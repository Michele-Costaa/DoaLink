import { NavLink } from 'react-router-dom'

export default function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" className="navbar-brand">
        <div className="brand-icon">🤝</div>
        <span className="brand-name">Doa<em>Link</em></span>
      </NavLink>
      <ul className="nav-links">
        <li><NavLink to="/" end className={({isActive}) => isActive ? 'active' : ''}>Início</NavLink></li>
        <li><NavLink to="/pontos" className={({isActive}) => isActive ? 'active' : ''}>Pontos de Coleta</NavLink></li>
        <li><NavLink to="/itens" className={({isActive}) => isActive ? 'active' : ''}>Itens</NavLink></li>
        <li><NavLink to="/necessidades" className={({isActive}) => isActive ? 'active' : ''}>Necessidades</NavLink></li>
        <li><NavLink to="/doadores" className={({isActive}) => isActive ? 'active' : ''}>Doadores</NavLink></li>
        <li><NavLink to="/doacoes" className="nav-cta">Fazer Doação</NavLink></li>
      </ul>
    </nav>
  )
}