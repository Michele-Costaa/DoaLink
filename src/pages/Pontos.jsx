import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Pontos() {
  const [pontos, setPontos] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('listar')
  const [form, setForm] = useState({ nome: '', email: '', telefone: '', endereco: '', cidade: '', estado: '', status: 'ativo' })
  const [alert, setAlert] = useState(null)

  useEffect(() => { loadPontos() }, [])

  async function loadPontos() {
    try {
      const res = await api.get('/pontos-coleta')
      setPontos(res.data)
    } catch(e) {}
    finally { setLoading(false) }
  }

  async function cadastrar() {
    setAlert(null)
    if (!form.nome || !form.endereco || !form.cidade || !form.estado) {
      setAlert({ type: 'error', msg: '⚠️ Preencha os campos obrigatórios (*)' })
      return
    }
    try {
      await api.post('/pontos-coleta', { ...form, estado: form.estado.toUpperCase() })
      setAlert({ type: 'success', msg: '✅ Ponto cadastrado com sucesso!' })
      setForm({ nome: '', email: '', telefone: '', endereco: '', cidade: '', estado: '', status: 'ativo' })
      setTimeout(() => { setTab('listar'); loadPontos(); setAlert(null) }, 1500)
    } catch(e) {
      setAlert({ type: 'error', msg: '⚠️ ' + e.response?.data?.error || e.message })
    }
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>📍 Pontos de Coleta</h1>
        <p>Gerencie os locais que recebem doações</p>
      </div>
      <div className="section">
        <div className="tabs">
          <button className={`tab-btn ${tab === 'listar' ? 'active' : ''}`} onClick={() => setTab('listar')}>Ver Pontos</button>
          <button className={`tab-btn ${tab === 'cadastrar' ? 'active' : ''}`} onClick={() => setTab('cadastrar')}>+ Cadastrar</button>
        </div>

        {tab === 'listar' && (
          loading ? <div className="loading"><div className="spinner"></div> Carregando...</div>
          : pontos.length === 0 ? (
            <div className="empty-state"><div className="icon">📍</div><p>Nenhum ponto cadastrado.<br/><button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={() => setTab('cadastrar')}>Cadastrar Ponto</button></p></div>
          ) : (
            <div className="cards-grid">
              {pontos.map(p => (
                <div className="card" key={p.id}>
                  <div className="card-header">
                    <div className="card-icon">📍</div>
                    <span className={`card-status status-${p.status}`}>{p.status}</span>
                  </div>
                  <div className="card-title">{p.nome}</div>
                  <div className="card-subtitle">{p.cidade} — {p.estado}</div>
                  <div className="card-info">
                    <div className="info-row">📍 {p.endereco}</div>
                    {p.telefone && <div className="info-row">📞 {p.telefone}</div>}
                    {p.email && <div className="info-row">✉️ {p.email}</div>}
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'cadastrar' && (
          <div className="form-card">
            <div className="form-title">Novo Ponto de Coleta</div>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
            <div className="form-group">
              <label>Nome *</label>
              <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Escola Municipal Centro"/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email</label>
                <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="contato@local.com"/>
              </div>
              <div className="form-group">
                <label>Telefone</label>
                <input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(00) 00000-0000"/>
              </div>
            </div>
            <div className="form-group">
              <label>Endereço *</label>
              <input value={form.endereco} onChange={e => setForm({...form, endereco: e.target.value})} placeholder="Rua, número, bairro"/>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Cidade *</label>
                <input value={form.cidade} onChange={e => setForm({...form, cidade: e.target.value})} placeholder="Ex: Teresina"/>
              </div>
              <div className="form-group">
                <label>Estado (sigla) *</label>
                <input value={form.estado} onChange={e => setForm({...form, estado: e.target.value})} placeholder="Ex: PI" maxLength={2}/>
              </div>
            </div>
            <div className="form-group">
              <label>Status</label>
              <select value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                <option value="ativo">Ativo</option>
                <option value="lotado">Lotado</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
            <button className="btn btn-primary btn-full" onClick={cadastrar}>Cadastrar Ponto</button>
          </div>
        )}
      </div>
    </div>
  )
}