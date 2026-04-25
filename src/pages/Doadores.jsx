import { useEffect, useState } from 'react'
import api from '../services/api'

export default function Doadores() {
  const [doadores, setDoadores] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('listar')
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' })
  const [alert, setAlert] = useState(null)

  useEffect(() => { loadDoadores() }, [])

  async function loadDoadores() {
    try {
      const res = await api.get('/doadores')
      setDoadores(res.data)
    } catch(e) {}
    finally { setLoading(false) }
  }

  async function cadastrar() {
    setAlert(null)
    if (!form.nome || !form.email || !form.telefone) {
      setAlert({ type: 'error', msg: '⚠️ Preencha todos os campos.' })
      return
    }
    try {
      await api.post('/doadores', form)
      setAlert({ type: 'success', msg: '✅ Doador cadastrado com sucesso!' })
      setForm({ nome: '', email: '', telefone: '' })
      setTimeout(() => { setTab('listar'); loadDoadores(); setAlert(null) }, 1500)
    } catch(e) {
      setAlert({ type: 'error', msg: '⚠️ ' + e.message })
    }
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>💙 Doadores</h1>
        <p>Pessoas que estão ajudando a fazer a diferença</p>
      </div>
      <div className="section">
        <div className="tabs">
          <button className={`tab-btn ${tab === 'listar' ? 'active' : ''}`} onClick={() => setTab('listar')}>Ver Doadores</button>
          <button className={`tab-btn ${tab === 'cadastrar' ? 'active' : ''}`} onClick={() => setTab('cadastrar')}>+ Cadastrar</button>
        </div>

        {tab === 'listar' && (
          loading ? <div className="loading"><div className="spinner"></div> Carregando...</div>
          : doadores.length === 0 ? (
            <div className="empty-state"><div className="icon">💙</div><p>Nenhum doador cadastrado.</p></div>
          ) : (
            <div className="cards-grid">
              {doadores.map(d => (
                <div className="card" key={d.id}>
                  <div className="card-header">
                    <div className="card-icon green">👤</div>
                  </div>
                  <div className="card-title">{d.nome}</div>
                  <div className="card-info">
                    <div className="info-row">✉️ {d.email}</div>
                    <div className="info-row">📞 {d.telefone}</div>
                    <div className="info-row" style={{fontSize:'0.78rem',color:'var(--gray-dark)'}}>
                      Cadastrado em {new Date(d.created_at).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'cadastrar' && (
          <div className="form-card">
            <div className="form-title">Novo Doador</div>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
            <div className="form-group">
              <label>Nome Completo *</label>
              <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Maria da Silva"/>
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} placeholder="maria@email.com"/>
            </div>
            <div className="form-group">
              <label>Telefone *</label>
              <input value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} placeholder="(00) 00000-0000"/>
            </div>
            <button className="btn btn-primary btn-full" onClick={cadastrar}>Cadastrar Doador</button>
          </div>
        )}
      </div>
    </div>
  )
}