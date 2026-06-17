import { useEffect, useState } from 'react'
import api from '../api/client'

const STATUSES = ['draft', 'active', 'expired', 'cancelled']
const EMPTY = { title: '', client_name: '', value: 0, status: 'draft', contact_id: '', start_date: '', end_date: '', notes: '' }
const STATUS_BADGE = { draft: 'badge-gray', active: 'badge-green', expired: 'badge-red', cancelled: 'badge-gray' }

export default function Contracts() {
  const [contracts, setContracts] = useState([])
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const load = () => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    Promise.all([
      api.get(`/contracts/?${params}`).then((r) => setContracts(r.data)),
      api.get('/contacts/').then((r) => setContacts(r.data)),
    ]).catch(() => setError('Failed to load contracts'))
  }
  useEffect(() => { load() }, [statusFilter])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowModal(true) }
  const openEdit = (c) => {
    setForm({ ...c, contact_id: c.contact_id || '', start_date: c.start_date || '', end_date: c.end_date || '', notes: c.notes || '' })
    setEditing(c.id)
    setShowModal(true)
  }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, value: Number(form.value), contact_id: form.contact_id || null, start_date: form.start_date || null, end_date: form.end_date || null }
      if (editing) await api.put(`/contracts/${editing}`, payload)
      else await api.post('/contracts/', payload)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save contract')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this contract?')) return
    try {
      await api.delete(`/contracts/${id}`)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete contract')
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
        <h1>Contracts</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Contract</button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="filter-bar">
        <div className="tab-group">
          {['', ...STATUSES].map((s) => (
            <button key={s} className={`tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === '' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <table>
        <thead>
          <tr><th>Title</th><th>Client</th><th>Value</th><th>Status</th><th>End Date</th><th></th></tr>
        </thead>
        <tbody>
          {contracts.map((c) => (
            <tr key={c.id}>
              <td>{c.title}</td>
              <td>{c.client_name}</td>
              <td>${c.value.toLocaleString()}</td>
              <td><span className={`badge ${STATUS_BADGE[c.status] || 'badge-gray'}`}>{c.status}</span></td>
              <td>{c.end_date || '—'}</td>
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
            <h2>{editing ? 'Edit' : 'New'} Contract</h2>
            <form onSubmit={save}>
              {field('title', 'Title')}
              {field('client_name', 'Client Name')}
              {field('value', 'Value ($)', 'number')}
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label>Contact</label>
                <select value={form.contact_id} onChange={(e) => setForm({ ...form, contact_id: e.target.value })}>
                  <option value="">— none —</option>
                  {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              {field('start_date', 'Start Date', 'date')}
              {field('end_date', 'End Date', 'date')}
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
