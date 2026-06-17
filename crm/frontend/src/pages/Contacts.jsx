import { useEffect, useState } from 'react'
import api from '../api/client'

const EMPTY = { name: '', email: '', phone: '', company: '', type: 'lead', status: 'active', notes: '' }
const TYPES = ['lead', 'contact']
const STATUSES = ['active', 'inactive']

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [search, setSearch] = useState('')

  const load = () => {
    const params = new URLSearchParams()
    if (typeFilter) params.set('type', typeFilter)
    if (search) params.set('q', search)
    api.get(`/contacts/?${params}`).then((r) => setContacts(r.data)).catch(() => setError('Failed to load contacts'))
  }
  useEffect(() => { load() }, [typeFilter, search])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowModal(true) }
  const openEdit = (c) => { setForm({ ...c, notes: c.notes || '' }); setEditing(c.id); setShowModal(true) }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      if (editing) await api.put(`/contacts/${editing}`, form)
      else await api.post('/contacts/', form)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save contact')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this contact?')) return
    try {
      await api.delete(`/contacts/${id}`)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete contact')
    }
  }

  const field = (key, label, type = 'text') => (
    <div key={key}>
      <label>{label}</label>
      <input type={type} value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
    </div>
  )

  return (
    <div>
      <div className="toolbar">
        <h1>Contacts & Leads</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add</button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="filter-bar">
        <div className="tab-group">
          {['', 'lead', 'contact'].map((t) => (
            <button key={t} className={`tab ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
              {t === '' ? 'All' : t === 'lead' ? 'Leads' : 'Contacts'}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="Search by name, email, company…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <table>
        <thead>
          <tr><th>Name</th><th>Email</th><th>Company</th><th>Type</th><th>Status</th><th></th></tr>
        </thead>
        <tbody>
          {contacts.map((c) => (
            <tr key={c.id}>
              <td>{c.name}</td>
              <td>{c.email}</td>
              <td>{c.company}</td>
              <td><span className={`badge ${c.type === 'lead' ? 'badge-yellow' : 'badge-blue'}`}>{c.type}</span></td>
              <td><span className={`badge ${c.status === 'active' ? 'badge-green' : 'badge-gray'}`}>{c.status}</span></td>
              <td style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="btn btn-sm" onClick={() => openEdit(c)}>Edit</button>
                <button className="btn btn-danger" onClick={() => remove(c.id)}>Del</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit' : 'New'} Contact</h2>
            <form onSubmit={save}>
              {field('name', 'Name')}
              {field('email', 'Email', 'email')}
              {field('phone', 'Phone')}
              {field('company', 'Company')}
              <div>
                <label>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label>Notes</label>
                <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={3} />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
