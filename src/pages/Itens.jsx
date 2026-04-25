import { useEffect, useState } from 'react'
import api from '../services/api'

const categoriaEmoji = {
  'Alimento': '🍱', 'Bebida': '💧', 'Vestuário': '👕',
  'Higiene': '🧴', 'Medicamento': '💊', 'Limpeza': '🧹',
  'Cama e Banho': '🛏️', 'Outro': '📦'
}

export default function Itens() {
  const [itens, setItens] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('listar')
  const [form, setForm] = useState({ nome: '', categoria: '' })
  const [alert, setAlert] = useState(null)

  useEffect(() => { loadItens() }, [])

  async function loadItens() {
    try {
      const res = await api.get('/itens')
      setItens(res.data)
    } catch(e) {}
    finally { setLoading(false) }
  }

  async function cadastrar() {
    setAlert(null)
    if (!form.nome || !form.categoria) {
      setAlert({ type: 'error', msg: '⚠️ Preencha todos os campos.' })
      return
    }
    try {
      await api.post('/itens', form)
      setAlert({ type: 'success', msg: '✅ Item cadastrado com sucesso!' })
      setForm({ nome: '', categoria: '' })
      setTimeout(() => { setTab('listar'); loadItens(); setAlert(null) }, 1500)
    } catch(e) {
      setAlert({ type: 'error', msg: '⚠️ ' + e.message })
    }
  }

  return (
    <div className="page-wrapper">
      <div className="page-header">
        <h1>📦 Itens</h1>
        <p>Catálogo de itens que podem ser doados</p>
      </div>
      <div className="section">
        <div className="tabs">
          <button className={`tab-btn ${tab === 'listar' ? 'active' : ''}`} onClick={() => setTab('listar')}>Ver Itens</button>
          <button className={`tab-btn ${tab === 'cadastrar' ? 'active' : ''}`} onClick={() => setTab('cadastrar')}>+ Cadastrar</button>
        </div>

        {tab === 'listar' && (
          loading ? <div className="loading"><div className="spinner"></div> Carregando...</div>
          : itens.length === 0 ? (
            <div className="empty-state"><div className="icon">📦</div><p>Nenhum item cadastrado.</p></div>
          ) : (
            <div className="cards-grid">
              {itens.map(i => (
                <div className="card" key={i.id}>
                  <div className="card-header">
                    <div className="card-icon orange">{categoriaEmoji[i.categoria] || '📦'}</div>
                    <span className="item-tag">{i.categoria}</span>
                  </div>
                  <div className="card-title">{i.nome}</div>
                  <div className="card-subtitle">Cadastrado em {new Date(i.created_at).toLocaleDateString('pt-BR')}</div>
                </div>
              ))}
            </div>
          )
        )}

        {tab === 'cadastrar' && (
          <div className="form-card">
            <div className="form-title">Novo Item</div>
            {alert && <div className={`alert alert-${alert.type}`}>{alert.msg}</div>}
            <div className="form-group">
              <label>Nome do Item *</label>
              <input value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} placeholder="Ex: Água mineral"/>
            </div>
            <div className="form-group">
              <label>Categoria *</label>
              <select value={form.categoria} onChange={e => setForm({...form, categoria: e.target.value})}>
                <option value="">Selecione...</option>
                <option value="Alimento">Alimento</option>
                <option value="Bebida">Bebida</option>
                <option value="Vestuário">Vestuário</option>
                <option value="Higiene">Higiene</option>
                <option value="Medicamento">Medicamento</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Cama e Banho">Cama e Banho</option>
                <option value="Outro">Outro</option>
              </select>
            </div>
            <button className="btn btn-primary btn-full" onClick={cadastrar}>Cadastrar Item</button>
          </div>
        )}
      </div>
    </div>
  )
}