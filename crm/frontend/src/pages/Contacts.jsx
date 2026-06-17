import { useEffect, useState } from 'react'
import api from '../api/client'

const EMPTY = { name: '', email: '', phone: '', company: '', type: 'contact', status: 'active' }

export default function Contacts() {
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const load = () => api.get('/contacts/').then((r) => setContacts(r.data))
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowModal(true) }
  const openEdit = (c) => { setForm(c); setEditing(c.id); setShowModal(true) }

  const save = async (e) => {
    e.preventDefault()
    if (editing) await api.put(`/contacts/${editing}`, form)
    else await api.post('/contacts/', form)
    setShowModal(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this contact?')) return
    await api.delete(`/contacts/${id}`)
    load()
  }

  return (
    <div>
      <div className="toolbar">
        <h1>Contacts & Leads</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add</button>
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
              {[['Name', 'name'], ['Email', 'email'], ['Phone', 'phone'], ['Company', 'company']].map(([label, key]) => (
                <div key={key}>
                  <label>{label}</label>
                  <input value={form[key] || ''} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                </div>
              ))}
              <div>
                <label>Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="contact">Contact</option>
                  <option value="lead">Lead</option>
                </select>
              </div>
              <div>
                <label>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
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
