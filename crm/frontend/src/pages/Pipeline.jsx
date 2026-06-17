import { useEffect, useState } from 'react'
import api from '../api/client'

const STAGES = ['lead', 'qualified', 'proposal', 'won', 'lost']
const EMPTY = { title: '', value: 0, stage: 'lead', contact_id: '' }

export default function Pipeline() {
  const [deals, setDeals] = useState([])
  const [contacts, setContacts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const load = () => Promise.all([
    api.get('/pipeline/').then((r) => setDeals(r.data)),
    api.get('/contacts/').then((r) => setContacts(r.data)),
  ])
  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(EMPTY); setEditing(null); setShowModal(true) }
  const openEdit = (d) => { setForm({ ...d, contact_id: d.contact_id || '' }); setEditing(d.id); setShowModal(true) }

  const save = async (e) => {
    e.preventDefault()
    const payload = { ...form, value: Number(form.value), contact_id: form.contact_id || null }
    if (editing) await api.put(`/pipeline/${editing}`, payload)
    else await api.post('/pipeline/', payload)
    setShowModal(false)
    load()
  }

  const remove = async (id) => {
    if (!confirm('Delete this deal?')) return
    await api.delete(`/pipeline/${id}`)
    load()
  }

  const byStage = (stage) => deals.filter((d) => d.stage === stage)

  return (
    <div>
      <div className="toolbar">
        <h1>Sales Pipeline</h1>
        <button className="btn btn-primary" onClick={openCreate}>+ Add Deal</button>
      </div>

      <div className="pipeline-board">
        {STAGES.map((stage) => (
          <div key={stage} className="pipeline-col">
            <h3>{stage} ({byStage(stage).length})</h3>
            {byStage(stage).map((d) => (
              <div key={d.id} className="deal-card">
                <div>{d.title}</div>
                <div className="deal-value">${d.value.toLocaleString()}</div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button className="btn btn-sm" onClick={() => openEdit(d)}>Edit</button>
                  <button className="btn btn-danger" onClick={() => remove(d.id)}>Del</button>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit' : 'New'} Deal</h2>
            <form onSubmit={save}>
              <div><label>Title</label><input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
              <div><label>Value ($)</label><input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></div>
              <div>
                <label>Stage</label>
                <select value={form.stage} onChange={(e) => setForm({ ...form, stage: e.target.value })}>
                  {STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
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
