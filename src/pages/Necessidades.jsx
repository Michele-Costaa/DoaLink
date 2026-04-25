import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Necessidades() {
  const [necessidades, setNecessidades] = useState([])
  const [pontos, setPontos] = useState([])
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('listar')
  const [form, setForm] = useState({ pontos_coleta_id: '', item_id: '', quantidade_necessaria: '', prioridade: 'media' })
  const [alert, setAlert] = useState(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    try {
      const [p, i] = await Promise.all([api.get('/pontos-coleta'), api.get('/itens')])
      setPontos(p.data)
      setItens(i.data)

      const todasNec = []
      for (const ponto of p.data) {
        try {
          const nec = await api.get(`/necessidades/ponto/${ponto.id}`)
          nec.data.forEach(n => todasNec.push({ ...n, ponto_nome: ponto.nome }))
        } catch(e) {}
      }
      const prioOrdem = { emergencial: 0, alta: 1, media: 2, baixa: 3 }
      todasNec.sort((a, b) => (prioOrdem[a.prioridade] ?? 9) - (prioOrdem[b.prioridade] ?? 9))
      setNecessidades(todasNec)
    } catch(e) {}
    finally { setLoading(false) }
  }

  async function cadastrar() {
    setAlert(null)
    if (!form.pontos_coleta_id || !form.item_id || !form.quantidade_necessaria) {
      setAlert({ type: 'error', msg: '⚠️ Preencha todos os campos obrigatórios.' })
      return
    }
    try {
      await api.post('/necessidades', {
        pontos_coleta_id: parseInt(form.pontos_coleta_id),
        item_id: parseInt(form.item_id),
        quantidade_necessaria: parseInt(form.quantidade_necessaria),
        prioridade: form.prioridade
      })
      setAlert({ type: 'success', msg: '✅ Necessidade registrada!' })
      setForm({ pontos_coleta_id: '', item_id: '', quantidade_necessaria: '', prioridade: 'media' })
      setTimeout(() => { setTab('listar'); loadAll(); setAlert(null) }, 1500)
    } catch(e) {
      setAlert({ type: 'error', msg: '⚠️ ' + e.message })
    }
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>🆘 Necessidades</h1>
        <p>O que cada ponto de coleta precisa receber</p>
      </div>
      <div className="section">
        <div className="tabs">
          <button className={`tab-btn ${tab === 'listar' ? 'active' : ''}`} onClick={() => setTab('listar')}>Ver Necessidades</button>
          <button className={`tab-btn ${tab === 'cadastrar' ? 'active' : ''}`} onClick={() => setTab('cadastrar')}>+ Cadastrar</button>
        </div>

        {tab === 'listar' && (
          loading ? <div className="loading"><div className="spinner"></div> Carregando...</div>
          : necessidades.length === 0 ? (
            <div className="empty-state"><div className="icon">✅</div><p>Nenhuma necessidade registrada.</p></div>
          ) : (
            <div className="cards-grid">
              {necessidades.map(n => {
                const pct = n.quantidade_necessaria > 0
                  ? Math.min(100, Math.round((n.quantidade_recebida / n.quantidade_necessaria) * 100))
                  : 0
                const fillClass = pct >= 80 ? 'success' : pct >= 40 ? '' : 'warning'
                return (
                  <div className="card" key={n.id}>
                    <div className="card-header">
                      <div className="card-icon orange">📦</div>
                      <span className={`card-status status-${n.prioridade}`}>{n.prioridade}</span>
                    </div>
                    <div className="card-title">{n.item_nome}</div>
                    <div className="card-subtitle">{n.ponto_nome}</div>
                    <div className="progress-wrap">
                      <div className="progress-label">
                        <span>Progresso: {pct}%</span>
                        <strong>{n.quantidade_recebida} / {n.quantidade_necessaria}</strong>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${fillClass}`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )
        )}

        {tab === 'cadastrar' && (
          <div className="form-card">
            <div className="form-title">Registrar Necessidade</div>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
            <div className="form-group">
              <label>Ponto de Coleta *</label>
              <select value={form.pontos_coleta_id} onChange={e => setForm({...form, pontos_coleta_id: e.target.value})}>
                <option value="">Selecione o ponto...</option>
                {pontos.map(p => <option key={p.id} value={p.id}>{p.nome} — {p.cidade}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Item *</label>
              <select value={form.item_id} onChange={e => setForm({...form, item_id: e.target.value})}>
                <option value="">Selecione o item...</option>
                {itens.map(i => <option key={i.id} value={i.id}>{i.nome} ({i.categoria})</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Quantidade Necessária *</label>
                <input type="number" value={form.quantidade_necessaria} onChange={e => setForm({...form, quantidade_necessaria: e.target.value})} placeholder="Ex: 100" min="1"/>
              </div>
              <div className="form-group">
                <label>Prioridade</label>
                <select value={form.prioridade} onChange={e => setForm({...form, prioridade: e.target.value})}>
                  <option value="baixa">Baixa</option>
                  <option value="media">Média</option>
                  <option value="alta">Alta</option>
                  <option value="emergencial">Emergencial</option>
                </select>
              </div>
            </div>
            <button className="btn btn-primary btn-full" onClick={cadastrar}>Registrar Necessidade</button>
          </div>
        )}
      </div>
    </div>
  )
}