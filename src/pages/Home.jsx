import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'

export default function Home() {
  const [pontos, setPontos] = useState([])
  const [itens, setItens] = useState([])
  const [doadores, setDoadores] = useState([])
  const [necessidades, setNecessidades] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const [p, i, d] = await Promise.all([
          api.get('/pontos-coleta'),
          api.get('/itens'),
          api.get('/doadores')
        ])
        setPontos(p.data)
        setItens(i.data)
        setDoadores(d.data)

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
    load()
  }, [])

  return (
    <div className="page-wrapper">
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge-dot"></span>
            Sistema Ativo — Crise no Brasil
          </div>
          <h1>Conectando <span className="highlight">doações</span> a quem mais precisa</h1>
          <p>O DoaLink organiza a distribuição de doações em situações de enchente, garantindo que os recursos cheguem nos lugares certos, no momento certo.</p>
          <div className="hero-actions">
            <Link to="/doacoes" className="btn btn-primary">🤝 Fazer uma Doação</Link>
            <Link to="/pontos" className="btn btn-secondary">📍 Ver Pontos de Coleta</Link>
          </div>
          <div className="hero-stats">
            <div><div className="stat-number">{pontos.filter(p => p.status === 'ativo').length}</div><div className="stat-label">Pontos Ativos</div></div>
            <div><div className="stat-number">{itens.length}</div><div className="stat-label">Tipos de Item</div></div>
            <div><div className="stat-number">{doadores.length}</div><div className="stat-label">Doadores</div></div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2 className="section-title">Necessidades Urgentes <span>({necessidades.length})</span></h2>
          <Link to="/necessidades" className="btn btn-ghost btn-sm">Ver todas →</Link>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner"></div> Carregando...</div>
        ) : necessidades.length === 0 ? (
          <div className="empty-state"><div className="icon">✅</div><p>Nenhuma necessidade registrada.</p></div>
        ) : (
          <div className="cards-grid">
            {necessidades.slice(0, 6).map(n => {
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
                      <span>Recebido</span>
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
        )}
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="section-header">
          <h2 className="section-title">Pontos de Coleta <span>({pontos.length})</span></h2>
          <Link to="/pontos" className="btn btn-ghost btn-sm">Ver todos →</Link>
        </div>
        {loading ? (
          <div className="loading"><div className="spinner"></div> Carregando...</div>
        ) : pontos.length === 0 ? (
          <div className="empty-state"><div className="icon">📍</div><p>Nenhum ponto cadastrado.</p></div>
        ) : (
          <div className="cards-grid">
            {pontos.slice(0, 3).map(p => (
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
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}