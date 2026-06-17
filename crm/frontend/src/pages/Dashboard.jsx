import { useEffect, useState } from 'react'
import api from '../api/client'

const STAGE_COLORS = {
  lead: 'badge-gray', qualified: 'badge-blue', proposal: 'badge-yellow',
  negotiation: 'badge-yellow', won: 'badge-green', lost: 'badge-red',
}
const CONTRACT_COLORS = {
  draft: 'badge-gray', active: 'badge-green', expired: 'badge-red', cancelled: 'badge-gray',
}

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [pipeline, setPipeline] = useState(null)
  const [contractStats, setContractStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/reporting/summary').then((r) => setSummary(r.data)).catch(() => setError('Failed to load summary'))
    api.get('/reporting/pipeline').then((r) => setPipeline(r.data)).catch(() => setError('Failed to load pipeline'))
    api.get('/reporting/contracts').then((r) => setContractStats(r.data)).catch(() => setError('Failed to load contract stats'))
  }, [])

  return (
    <div>
      <h1>Dashboard</h1>
      {error && <p className="error">{error}</p>}

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
          <div className="breakdown-grid">
            {Object.entries(pipeline).map(([stage, data]) => (
              <div key={stage} className="breakdown-cell">
                <span className={`badge ${STAGE_COLORS[stage] || 'badge-gray'}`}>{stage}</span>
                <div className="breakdown-count">{data.count}</div>
                <div className="breakdown-value">${data.total_value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {contractStats && (
        <div className="card">
          <h2>Contracts by Status</h2>
          <div className="breakdown-grid">
            {Object.entries(contractStats).map(([status, data]) => (
              <div key={status} className="breakdown-cell">
                <span className={`badge ${CONTRACT_COLORS[status] || 'badge-gray'}`}>{status}</span>
                <div className="breakdown-count">{data.count}</div>
                <div className="breakdown-value">${data.total_value.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
