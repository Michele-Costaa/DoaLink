import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Pontos from './pages/Pontos'
import Itens from './pages/Itens'
import Necessidades from './pages/Necessidades'
import Doadores from './pages/Doadores'
import Doacoes from './pages/Doacoes'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pontos" element={<Pontos />} />
        <Route path="/itens" element={<Itens />} />
        <Route path="/necessidades" element={<Necessidades />} />
        <Route path="/doadores" element={<Doadores />} />
        <Route path="/doacoes" element={<Doacoes />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App