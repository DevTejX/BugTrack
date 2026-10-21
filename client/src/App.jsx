
import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [bugs, setBugs] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [severity, setSeverity] = useState('Medium')


  
  // event 
const handleSubmit = async (event) => {
  event.preventDefault()

  const response = await fetch('http://localhost:5000/api/bugs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      description,
      severity,
    }),
  })

  if (response.ok) {
    const newBug = await response.json()
    setBugs((previousBugs) => [...previousBugs, newBug])

    setTitle('')
    setDescription('')
    setSeverity('Medium')
  }
}





  useEffect(() => {
    fetch('http://localhost:5000/api/bugs')
      .then((response) => response.json())
      .then((data) => setBugs(data))
      .catch((error) => console.error('Error fetching bugs:', error))
  }, [])

  return (
    <div>
      <h1>BugTrack</h1>
      <h2>Bug Reports</h2>

      {/* form for input */}
      
<form onSubmit={handleSubmit}>
  <h2>Report a Bug</h2>

  <input
    type="text"
    placeholder="Bug title"
    value={title}
    onChange={(event) => setTitle(event.target.value)}
    required
  />

  <br /><br />

  <textarea
    placeholder="Describe the bug"
    value={description}
    onChange={(event) => setDescription(event.target.value)}
    required
  />

  <br /><br />

  <select
    value={severity}
    onChange={(event) => setSeverity(event.target.value)}
  >
    <option value="Low">Low</option>
    <option value="Medium">Medium</option>
    <option value="High">High</option>
  </select>

  <br /><br />

  <button type="submit">Submit Bug</button>
</form>


<section>
  <h2>All Bug Reports</h2>

  {bugs.length === 0 ? (
    <p>No bug reports found.</p>
  ) : (
    bugs.map((bug) => (
      <div key={bug._id}>
        <h3>{bug.title}</h3>
        <p>{bug.description}</p>
        <p>Severity: {bug.severity}</p>
        <p>Status: {bug.status}</p>
        <hr />
      </div>
    ))
  )}
</section>
    </div>
  )
}




export default App
