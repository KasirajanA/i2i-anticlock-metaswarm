import { useEffect, useState } from 'react'
import api from '../api/client'

const STATUSES = ['open', 'in_progress', 'resolved', 'closed']
const PRIORITIES = ['low', 'medium', 'high', 'urgent']
const EMPTY = { title: '', description: '', status: 'open', priority: 'medium', contact_id: '' }

const STATUS_BADGE = { open: 'badge-blue', in_progress: 'badge-yellow', resolved: 'badge-green', closed: 'badge-gray' }
const PRIORITY_BADGE = { low: 'badge-gray', medium: 'badge-yellow', high: 'badge-red', urgent: 'badge-red' }

export default function Support() {
  const [tickets, setTickets] = useState([])
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [error, setError] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')

  const load = () => {
    const params = new URLSearchParams()
    if (statusFilter) params.set('status', statusFilter)
    if (priorityFilter) params.set('priority', priorityFilter)
    Promise.all([
      api.get(`/support/?${params}`).then((r) => setTickets(r.data)),
      api.get('/contacts/').then((r) => setContacts(r.data)),
    ]).catch(() => setError('Failed to load tickets'))
  }
  useEffect(() => { load() }, [statusFilter, priorityFilter])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowModal(true) }
  const openEdit = (t) => { setForm({ ...t, contact_id: t.contact_id || '' }); setEditing(t.id); setShowModal(true) }

  const save = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const payload = { ...form, contact_id: form.contact_id || null }
      if (editing) await api.put(`/support/${editing}`, payload)
      else await api.post('/support/', payload)
      setShowModal(false)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to save ticket')
    }
  }

  const remove = async (id) => {
    if (!confirm('Delete this ticket?')) return
    try {
      await api.delete(`/support/${id}`)
      load()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to delete ticket')
    }
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Customer Support</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ New Ticket</button>
      </div>
      {error && <p className="error">{error}</p>}

      <div className="filter-bar">
        <div className="tab-group">
          {['', ...STATUSES].map((s) => (
            <button key={s} className={`tab ${statusFilter === s ? 'active' : ''}`} onClick={() => setStatusFilter(s)}>
              {s === '' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
        </div>
        <select className="filter-select" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>

      <table>
        <thead>
          <tr><th>Title</th><th>Contact</th><th>Status</th><th>Priority</th><th>Created</th><th>Resolved</th><th></th></tr>
        </thead>
        <tbody>
          {tickets.map((t) => {
            const contact = contacts.find((c) => c.id === t.contact_id)
            return (
              <tr key={t.id}>
                <td>{t.title}</td>
                <td>{contact?.name || '—'}</td>
                <td><span className={`badge ${STATUS_BADGE[t.status] || 'badge-gray'}`}>{t.status.replace('_', ' ')}</span></td>
                <td><span className={`badge ${PRIORITY_BADGE[t.priority] || 'badge-gray'}`}>{t.priority}</span></td>
                <td>{new Date(t.created_at).toLocaleDateString()}</td>
                <td>{t.resolved_at ? new Date(t.resolved_at).toLocaleDateString() : '—'}</td>
                <td style={{ display: 'flex', gap: '0.5rem' }}>
                  <button className="btn btn-sm" onClick={() => openEdit(t)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => remove(t.id)}>Del</button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit' : 'New'} Ticket</h2>
            <form onSubmit={save}>
              <div><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label>Description</label><textarea value={form.description || ''} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
              </div>
              <div>
                <label>Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label>Contact</label>
                <select value={form.contact_id} onChange={(e) => setForm({ ...form, contact_id: e.target.value })}>
                  <option value="">— none —</option>
                  {contacts.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
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
