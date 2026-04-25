import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Doacoes() {
  const [pontos, setPontos] = useState([])
  const [itens, setItens] = useState([])
  const [doadores, setDoadores] = useState([])
  const [necPonto, setNecPonto] = useState([])
  const [itensSelecionados, setItensSelecionados] = useState([])
  const [form, setForm] = useState({ doador_id: '', nome: '', email: '', telefone: '', pontos_coleta_id: '' })
  const [itemSelect, setItemSelect] = useState('')
  const [itemQtd, setItemQtd] = useState('')
  const [alert, setAlert] = useState(null)

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    try {
      const [p, i, d] = await Promise.all([
        api.get('/pontos-coleta'),
        api.get('/itens'),
        api.get('/doadores')
      ])
      setPontos(p.data)
      setItens(i.data)
      setDoadores(d.data)
    } catch(e) {}
  }

  async function onPontoChange(id) {
    setForm(f => ({ ...f, pontos_coleta_id: id }))
    if (!id) { setNecPonto([]); return }
    try {
      const res = await api.get(`/necessidades/ponto/${id}`)
      setNecPonto(res.data)
    } catch(e) { setNecPonto([]) }
  }

  function adicionarItem() {
    if (!itemSelect || !itemQtd || parseInt(itemQtd) < 1) return
    const id = parseInt(itemSelect)
    const qtd = parseInt(itemQtd)
    setItensSelecionados(prev => {
      const existing = prev.find(i => i.item_id === id)
      if (existing) return prev.map(i => i.item_id === id ? { ...i, quantidade: i.quantidade + qtd } : i)
      return [...prev, { item_id: id, quantidade: qtd }]
    })
    setItemSelect('')
    setItemQtd('')
  }

  function removerItem(idx) {
    setItensSelecionados(prev => prev.filter((_, i) => i !== idx))
  }

  async function registrarDoacao() {
    setAlert(null)
    if (!form.pontos_coleta_id) {
      setAlert({ type: 'error', msg: '⚠️ Selecione um ponto de coleta.' })
      return
    }
    if (itensSelecionados.length === 0) {
      setAlert({ type: 'error', msg: '⚠️ Adicione pelo menos um item.' })
      return
    }

    let doadorId = form.doador_id ? parseInt(form.doador_id) : null

    if (!doadorId) {
      if (!form.nome || !form.email || !form.telefone) {
        setAlert({ type: 'error', msg: '⚠️ Preencha os dados do doador ou selecione um existente.' })
        return
      }
      try {
        const res = await api.post('/doadores', { nome: form.nome, email: form.email, telefone: form.telefone })
        doadorId = res.data.id
      } catch(e) {
        setAlert({ type: 'error', msg: '⚠️ Erro ao cadastrar doador: ' + e.message })
        return
      }
    }

    try {
      await api.post('/doacoes', {
        doador_id: doadorId,
        pontos_coleta_id: parseInt(form.pontos_coleta_id),
        itens: itensSelecionados
      })
      setAlert({ type: 'success', msg: '🎉 Doação registrada com sucesso! Obrigado pela sua ajuda!' })
      setItensSelecionados([])
      setForm({ doador_id: '', nome: '', email: '', telefone: '', pontos_coleta_id: '' })
      setNecPonto([])
    } catch(e) {
      setAlert({ type: 'error', msg: '⚠️ ' + e.message })
    }
  }

  const pontoSelecionado = pontos.find(p => p.id == form.pontos_coleta_id)

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>🤝 Fazer uma Doação</h1>
        <p>Registre sua doação e ajude quem mais precisa</p>
      </div>
      <div className="section">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '2rem', alignItems: 'start' }}>

          <div className="form-card" style={{ maxWidth: '100%' }}>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}

            <div className="form-title">1. Seus dados</div>
            <div className="form-group">
              <label>Selecionar Doador Existente</label>
              <select value={form.doador_id} onChange={e => setForm({...form, doador_id: e.target.value})}>
                <option value="">— Novo doador —</option>
                {doadores.map(d => <option key={d.id} value={d.id}>{d.nome}</option>)}
              </select>
            </div>

            {!form.doador_id && (
              <>
                <div className="form-group">
                  <label>Nome *</label>
                  <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Seu nome completo"/>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="seu@email.com"/>
                  </div>
                  <div className="form-group">
                    <label>Telefone *</label>
                    <input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(00) 00000-0000"/>
                  </div>
                </div>
              </>
            )}

            <hr className="form-divider"/>

            <div className="form-title">2. Ponto de Coleta</div>
            <div className="form-group">
              <label>Onde você vai entregar? *</label>
              <select value={form.pontos_coleta_id} onChange={e => onPontoChange(e.target.value)}>
                <option value="">Selecione o ponto...</option>
                {pontos.filter(p => p.status !== 'inativo').map(p =>
                  <option key={p.id} value={p.id}>{p.nome} — {p.cidade} ({p.status})</option>
                )}
              </select>
            </div>

            {necPonto.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', color: 'var(--gray-mid)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.75rem' }}>📋 O que este ponto precisa:</p>
                {necPonto.map(n => {
                  const pct = Math.min(100, Math.round((n.quantidade_recebida / n.quantidade_necessaria) * 100))
                  return (
                    <div key={n.id} style={{ marginBottom: '0.6rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                        <span style={{ fontSize: '0.85rem' }}>{n.item_nome}</span>
                        <span className={`card-status status-${n.prioridade}`} style={{ fontSize: '0.68rem' }}>{n.prioridade}</span>
                      </div>
                      <div className="progress-bar">
                        <div className={`progress-fill ${pct >= 80 ? 'success' : pct >= 40 ? '' : 'warning'}`} style={{ width: `${pct}%` }}></div>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--gray-mid)', marginTop: '2px' }}>{n.quantidade_recebida}/{n.quantidade_necessaria} recebidos</div>
                    </div>
                  )
                })}
              </div>
            )}

            <hr className="form-divider"/>

            <div className="form-title">3. Itens da Doação</div>

            {itensSelecionados.map((item, i) => {
              const nome = itens.find(it => it.id === item.item_id)?.nome || '?'
              return (
                <div className="donation-item-row" key={i}>
                  <span style={{ fontSize: '0.9rem' }}>{nome}</span>
                  <span style={{ fontWeight: 600, color: 'var(--blue-light)' }}>{item.quantidade} un.</span>
                  <button className="remove-btn" onClick={() => removerItem(i)}>✕</button>
                </div>
              )
            })}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr auto auto', gap: '0.75rem', alignItems: 'flex-end', marginTop: '0.5rem' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Item</label>
                <select value={itemSelect} onChange={e => setItemSelect(e.target.value)}>
                  <option value="">Selecione...</option>
                  {itens.map(i => <option key={i.id} value={i.id}>{i.nome}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Qtd</label>
                <input type="number" value={itemQtd} onChange={e => setItemQtd(e.target.value)} placeholder="0" min="1" style={{ width: '80px' }}/>
              </div>
              <button className="btn btn-secondary" onClick={adicionarItem}>+ Add</button>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-primary btn-full" style={{ fontSize: '1rem', padding: '0.85rem' }} onClick={registrarDoacao}>
                🤝 Confirmar Doação
              </button>
            </div>
          </div>

          {/* Resumo lateral */}
          <div className="card" style={{ position: 'sticky', top: '88px' }}>
            <div className="card-title" style={{ marginBottom: '1rem' }}>📋 Resumo da Doação</div>
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(43,130,232,0.1)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--gray-mid)', marginBottom: '0.25rem' }}>DOADOR</div>
              <div style={{ fontWeight: 600 }}>
                {form.doador_id ? doadores.find(d => d.id == form.doador_id)?.nome : form.nome || '—'}
              </div>
            </div>
            <div style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(43,130,232,0.1)' }}>
              <div style={{ fontSize: '0.82rem', color: 'var(--gray-mid)', marginBottom: '0.25rem' }}>PONTO</div>
              <div style={{ fontWeight: 600 }}>{pontoSelecionado?.nome || '—'}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.82rem', color: 'var(--gray-mid)', marginBottom: '0.5rem' }}>ITENS</div>
              {itensSelecionados.length === 0 ? (
                <div style={{ color: 'var(--gray-dark)', fontSize: '0.88rem' }}>Nenhum item adicionado</div>
              ) : itensSelecionados.map((item, i) => {
                const nome = itens.find(it => it.id === item.item_id)?.nome || '?'
                return (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.88rem', padding: '0.3rem 0', borderBottom: '1px solid rgba(43,130,232,0.08)' }}>
                    <span>{nome}</span><strong>{item.quantidade} un.</strong>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}