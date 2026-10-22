
import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_URL = 'http://localhost:5000/api/bugs'

function App() {
  const [bugs, setBugs] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Low')
  const [statusFilter, setStatusFilter] = useState('All')
  const [severityFilter, setSeverityFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [activeNav, setActiveNav] = useState('Dashboard')

  const loadBugs = async () => {
    try {
      setError('')
      const response = await fetch(API_URL)

      if (!response.ok) {
        throw new Error('Could not load bug reports.')
      }

      const data = await response.json()
      setBugs(data)
    } catch (err) {
      setError(err.message || 'Could not connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBugs()
  }, [])

  const openCount = bugs.filter((bug) => bug.status === 'Open').length
  const closedCount = bugs.filter((bug) => bug.status === 'Closed').length
  const highCount = bugs.filter((bug) => bug.severity === 'High').length

  const filteredBugs = useMemo(() => {
    const query = search.trim().toLowerCase()

    return bugs.filter((bug) => {
      const matchesStatus =
        statusFilter === 'All' || bug.status === statusFilter

      const matchesSeverity =
        severityFilter === 'All' || bug.severity === severityFilter

      const matchesSearch =
        !query ||
        bug.title?.toLowerCase().includes(query) ||
        bug.description?.toLowerCase().includes(query)

      const matchesNav =
        activeNav === 'Open Bugs'
          ? bug.status === 'Open'
          : activeNav === 'Closed Bugs'
            ? bug.status === 'Closed'
            : true

      return (
        matchesStatus &&
        matchesSeverity &&
        matchesSearch &&
        matchesNav
      )
    })
  }, [bugs, search, statusFilter, severityFilter, activeNav])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setError('')
    setMessage('')

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, severity }),
      })

      if (!response.ok) {
        throw new Error('Could not submit the bug report.')
      }

      const newBug = await response.json()
      setBugs((previousBugs) => [newBug, ...previousBugs])
      setTitle('')
      setDescription('')
      setSeverity('Low')
      setMessage('Bug report submitted successfully.')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    } finally {
      setSubmitting(false)
    }
  }

  const updateBugStatus = async (bug) => {
    const newStatus = bug.status === 'Open' ? 'Closed' : 'Open'
    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/${bug._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Could not update the bug status.')
      }

      setBugs((previousBugs) =>
        previousBugs.map((item) =>
          item._id === bug._id ? { ...item, status: newStatus } : item
        )
      )
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  const deleteBug = async (id) => {
    if (!window.confirm('Are you sure you want to delete this bug report?')) {
      return
    }

    setError('')
    setMessage('')

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Could not delete the bug report.')
      }

      setBugs((previousBugs) =>
        previousBugs.filter((bug) => bug._id !== id)
      )
      setMessage('Bug report deleted.')
    } catch (err) {
      setError(err.message || 'Something went wrong.')
    }
  }

  const selectNav = (item) => {
    setActiveNav(item)

    if (item === 'Open Bugs') setStatusFilter('Open')
    else if (item === 'Closed Bugs') setStatusFilter('Closed')
    else setStatusFilter('All')

    if (item === 'Dashboard' || item === 'All Bugs') {
      setSeverityFilter('All')
    }
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-icon"><BugIcon /></span>
          <span>BugTrack</span>
        </div>

        <nav className="side-nav" aria-label="Main navigation">
          <button
            className={activeNav === 'Dashboard' ? 'nav-item active' : 'nav-item'}
            onClick={() => selectNav('Dashboard')}
          >
            <HomeIcon /> <span>Dashboard</span>
          </button>
          <button
            className={activeNav === 'All Bugs' ? 'nav-item active' : 'nav-item'}
            onClick={() => selectNav('All Bugs')}
          >
            <ListIcon /> <span>All Bugs</span>
          </button>
          <button
            className={activeNav === 'Open Bugs' ? 'nav-item active' : 'nav-item'}
            onClick={() => selectNav('Open Bugs')}
          >
            <CircleIcon /> <span>Open Bugs</span>
          </button>
          <button
            className={activeNav === 'Closed Bugs' ? 'nav-item active' : 'nav-item'}
            onClick={() => selectNav('Closed Bugs')}
          >
            <CheckIcon /> <span>Closed Bugs</span>
          </button>
          <div className="nav-divider" />
          <button
            className={activeNav === 'Settings' ? 'nav-item active' : 'nav-item'}
            onClick={() => selectNav('Settings')}
          >
            <SettingsIcon /> <span>Settings</span>
          </button>
        </nav>

        <div className="sidebar-footer">
          <span className="online-dot" />
          <div>
            <strong>MERN Stack Project</strong>
            <span>Build · Track · Fix</span>
          </div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <label className="global-search">
            <SearchIcon />
            <input
              aria-label="Search all bugs"
              placeholder="Search bugs by title or description..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </label>

          <div className="user-area">
            <span className="topbar-status" title="BugTrack dashboard">
              <BellIcon />
            </span>
            <div className="avatar">T</div>
            <span className="user-name">Tejass</span>
            <span className="chevron">⌄</span>
          </div>
        </header>

        <div className="dashboard-layout">
          <section className="dashboard-content">
            <div className="welcome-row">
              <div>
                <p className="welcome-text">Welcome back! <span>👋</span></p>
                <h1>Bug Tracking Dashboard</h1>
                <p className="page-subtitle">
                  Track, manage and resolve bugs in your application.
                </p>
              </div>
              <button
                className="primary-button report-top-button"
                onClick={() => document.getElementById('bug-title')?.focus()}
              >
                <PlusIcon /> Report a Bug
              </button>
            </div>

            {error && <div className="alert alert-error">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}

            <div className="stats-grid">
              <StatCard
                title="Total Bugs"
                value={bugs.length}
                note="All reported bugs"
                type="total"
                icon={<BugIcon />}
              />
              <StatCard
                title="Open Bugs"
                value={openCount}
                note="Need attention"
                type="open"
                icon={<ClockIcon />}
              />
              <StatCard
                title="Closed Bugs"
                value={closedCount}
                note="Resolved issues"
                type="closed"
                icon={<CheckIcon />}
              />
              <StatCard
                title="High Severity"
                value={highCount}
                note="High priority issues"
                type="high"
                icon={<AlertIcon />}
              />
            </div>

            <div className="filter-bar">
              <label className="table-search">
                <SearchIcon />
                <input
                  placeholder="Search bugs..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </label>

              <select
                aria-label="Filter by status"
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
              >
                <option value="All">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
              </select>

              <select
                aria-label="Filter by severity"
                value={severityFilter}
                onChange={(event) => setSeverityFilter(event.target.value)}
              >
                <option value="All">All Severities</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <section className="reports-panel">
              <div className="reports-heading">
                <h2>Bug Reports</h2>
                <span>
                  Showing {filteredBugs.length} of {bugs.length} bugs
                </span>
              </div>

              {loading ? (
                <div className="empty-state">Loading bug reports...</div>
              ) : filteredBugs.length === 0 ? (
                <div className="empty-state">
                  <span className="empty-icon"><BugIcon /></span>
                  <strong>No bug reports found</strong>
                  <p>Try changing your search or filters, or report a new bug.</p>
                </div>
              ) : (
                <div className="table-scroll">
                  <table className="bugs-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Bug Title</th>
                        <th>Severity</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredBugs.map((bug, index) => (
                        <tr key={bug._id}>
                          <td className="number-cell">#{index + 1}</td>
                          <td className="bug-title-cell">
                            <strong>{bug.title}</strong>
                            <span>{bug.description}</span>
                          </td>
                          <td>
                            <span className={`badge severity-${(bug.severity || 'Medium').toLowerCase()}`}>
                              {bug.severity || 'Medium'}
                            </span>
                          </td>
                          <td>
                            <span className={`badge status-${(bug.status || 'Open').toLowerCase()}`}>
                              <span className="badge-dot" />
                              {bug.status || 'Open'}
                            </span>
                          </td>
                          <td>
                            <div className="action-buttons">
                              <button
                                className="change-button"
                                onClick={() => updateBugStatus(bug)}
                                title={`Change status to ${bug.status === 'Open' ? 'Closed' : 'Open'}`}
                              >
                                {bug.status === 'Open' ? 'Close Bug' : 'Reopen'}
                                <ChevronIcon />
                              </button>
                              <button
                                className="delete-button"
                                onClick={() => deleteBug(bug._id)}
                                aria-label={`Delete ${bug.title}`}
                                title="Delete bug"
                              >
                                <TrashIcon />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </section>

          <aside className="report-panel">
            <div className="report-panel-heading">
              <div className="report-heading-icon"><BugIcon /></div>
              <h2>Report a Bug</h2>
              <button
                className="clear-form-button"
                type="button"
                aria-label="Clear report form"
                onClick={() => {
                  setTitle('')
                  setDescription('')
                  setSeverity('Low')
                  setMessage('')
                }}
              >
                ×
              </button>
            </div>

            <form className="report-form" onSubmit={handleSubmit}>
              <label htmlFor="bug-title">Bug Title <span>*</span></label>
              <input
                id="bug-title"
                type="text"
                placeholder="Enter a short, descriptive title..."
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                maxLength={120}
              />

              <label htmlFor="bug-description">Description <span>*</span></label>
              <textarea
                id="bug-description"
                placeholder="Provide details about the issue, steps to reproduce, and expected behavior..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                maxLength={500}
                rows={5}
              />
              <div className="character-count">{description.length}/500</div>

              <label htmlFor="bug-severity">Severity</label>
              <select
                id="bug-severity"
                value={severity}
                onChange={(event) => setSeverity(event.target.value)}
              >
                <option value="Low">🟢 Low</option>
                <option value="Medium">🟠 Medium</option>
                <option value="High">🔴 High</option>
              </select>

              <button className="primary-button submit-button" type="submit" disabled={submitting}>
                <SendIcon />
                {submitting ? 'Submitting...' : 'Submit Bug'}
              </button>
            </form>
          </aside>
        </div>
      </main>
    </div>
  )
}

function StatCard({ title, value, note, type, icon }) {
  return (
    <div className={`stat-card stat-${type}`}>
      <div className="stat-icon">{icon}</div>
      <span className="stat-title">{title}</span>
      <strong className="stat-value">{value}</strong>
      <span className="stat-note">{note}</span>
    </div>
  )
}

function BugIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 7.5 6.5 5M16 7.5 17.5 5M4 10H2m20 0h-2M4 15H2m20 0h-2M8 4.5 9 2h6l1 2.5M12 7v13M7 9.5C7 7.6 9.2 6 12 6s5 1.6 5 3.5v6c0 2.5-2.2 4.5-5 4.5s-5-2-5-4.5z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function HomeIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m3 10 9-7 9 7v10H5V10m5 10v-6h4v6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function ListIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 5h12M9 12h12M9 19h12M3 5h.01M3 12h.01M3 19h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function CircleIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="2"/></svg>
}
function CheckIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2"/><path d="m8 12 2.5 2.5L16 9" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function SettingsIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm0-6 1.3 2.1 2.5.4 1.7-1 2 3.4-1.5 1.9.3 2.5 1.5 1.8-2 3.4-2.4-.6-2.1 1.2-.8 2.4h-4l-.8-2.4-2.1-1.2-2.4.6-2-3.4 1.5-1.8.3-2.5L2 7.4l2-3.4 2.4 1 2.5-.4L10.2 2.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
}
function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="10.8" cy="10.8" r="6.8" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="m16 16 5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function ClockIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="1.8"/><path d="M12 7v5l3 2" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
}
function AlertIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 22 21H2L12 3Z" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/><path d="M12 9v5m0 3h.01" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function PlusIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
}
function ChevronIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m7 10 5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function TrashIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 7h16M10 11v6m4-6v6M6 7l1 14h10l1-14M9 7V4h6v3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function SendIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m22 2-7 20-4-9-9-4 20-7ZM22 2 11 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}
function BellIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9m-8 12h4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
}

export default App
