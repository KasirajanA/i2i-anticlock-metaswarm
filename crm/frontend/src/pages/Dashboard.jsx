import { useEffect, useState } from 'react'
import api from '../api/client'

const STAGE_COLORS = {
  lead: 'badge-gray', qualified: 'badge-blue', proposal: 'badge-yellow',
  won: 'badge-green', lost: 'badge-red',
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [pipeline, setPipeline] = useState(null)

  useEffect(() => {
    api.get('/reporting/summary').then((r) => setSummary(r.data))
    api.get('/reporting/pipeline').then((r) => setPipeline(r.data))
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      {summary && (
        <div className="stats-grid">
          {[
            { label: 'Contacts', value: summary.contacts },
            { label: 'Leads', value: summary.leads },
            { label: 'Open Deals', value: summary.open_deals },
            { label: 'Active Contracts', value: summary.active_contracts },
            { label: 'Open Tickets', value: summary.open_tickets },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <div className="value">{s.value}</div>
              <div className="label">{s.label}</div>
            </div>
          ))}
        </div>
      )}
      {pipeline && (
        <div className="card">
          <h2>Pipeline by Stage</h2>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
            {Object.entries(pipeline).map(([stage, count]) => (
              <div key={stage} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{count}</div>
                <span className={`badge ${STAGE_COLORS[stage] || 'badge-gray'}`}>{stage}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
