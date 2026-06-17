import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/client'

export default function Login() {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      let token
      if (mode === 'register') {
        const res = await api.post('/auth/register', { email, password })
        token = res.data.access_token
      } else {
        const res = await api.post('/auth/login', new URLSearchParams({ username: email, password }), {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        })
        token = res.data.access_token
      }
      login(token)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong')
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>CRM</h1>
        <form onSubmit={submit}>
          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="error">{error}</p>}
          <button type="submit" className="btn btn-primary">
            {mode === 'login' ? 'Sign in' : 'Register'}
          </button>
        </form>
        <div className="toggle-link">
          {mode === 'login' ? (
            <>No account? <button onClick={() => setMode('register')}>Register</button></>
          ) : (
            <>Have an account? <button onClick={() => setMode('login')}>Sign in</button></>
          )}
        </div>
      </div>
    </div>
  )
}
