import { BrowserRouter, Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { setNavigate } from './api/client'

function NavigateSetter() {
  const navigate = useNavigate()
  useEffect(() => { setNavigate(navigate) }, [navigate])
  return null
}
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Contacts from './pages/Contacts'
import Pipeline from './pages/Pipeline'
import Contracts from './pages/Contracts'
import Support from './pages/Support'

function Layout({ children }) {
  const { logout } = useAuth()
  const navItems = [
    { to: '/', label: 'Dashboard' },
    { to: '/contacts', label: 'Contacts & Leads' },
    { to: '/pipeline', label: 'Sales Pipeline' },
    { to: '/contracts', label: 'Contracts' },
    { to: '/support', label: 'Support' },
  ]
  return (
    <div className="layout">
      <nav className="sidebar">
        <div className="sidebar-title">CRM</div>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            {item.label}
          </NavLink>
        ))}
        <button className="logout-btn" onClick={logout}>Logout</button>
      </nav>
      <main className="content">{children}</main>
    </div>
  )
}

function PrivateRoute({ children }) {
  const { token } = useAuth()
  return token ? <Layout>{children}</Layout> : <Navigate to="/login" replace />
}

export default function App() {
  return (
    <BrowserRouter>
      <NavigateSetter />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/contacts" element={<PrivateRoute><Contacts /></PrivateRoute>} />
        <Route path="/pipeline" element={<PrivateRoute><Pipeline /></PrivateRoute>} />
        <Route path="/contracts" element={<PrivateRoute><Contracts /></PrivateRoute>} />
        <Route path="/support" element={<PrivateRoute><Support /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}
