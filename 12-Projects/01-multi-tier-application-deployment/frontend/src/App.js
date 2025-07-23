import React, { useState, useEffect } from "react";

const API = url => `/api${url}`;

function App() {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [notes, setNotes] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [form, setForm] = useState({ title: "", content: "" });
  const [error, setError] = useState("");

  // Auth handlers
  async function handleLogin(e) {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch(API("/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (!data.token) throw new Error(data.error || "Login failed");
      localStorage.setItem("token", data.token);
      setToken(data.token);
      setMode("notes");
      setUsername("");
      setPassword("");
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleSignup(e) {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch(API("/signup"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await resp.json();
      if (!data.message) throw new Error(data.error || "Signup failed");
      setMode("login");
      setUsername("");
      setPassword("");
      setError("Signup successful. Please log in.");
    } catch (e) {
      setError(e.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    setToken(null);
    setNotes([]);
    setMode("login");
  }

  // Fetch notes for logged in user
  async function fetchNotes() {
    if (!token) return;
    const resp = await fetch(API("/notes"), {
      headers: { Authorization: "Bearer " + token },
    });
    if (resp.status === 401) return handleLogout();
    const data = await resp.json();
    setNotes(data);
  }

  // CRUD handlers
  async function handleAddNote(e) {
    e.preventDefault();
    setError("");
    try {
      const resp = await fetch(API("/notes"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(form),
      });
      if (resp.status !== 201) throw new Error("Create note failed");
      setForm({ title: "", content: "" });
      fetchNotes();
    } catch (e) {
      setError(e.message);
    }
  }

  async function handleDeleteNote(id) {
    setError("");
    try {
      await fetch(API(`/notes/${id}`), {
        method: "DELETE",
        headers: { Authorization: "Bearer " + token },
      });
      fetchNotes();
    } catch {
      setError("Delete failed");
    }
  }

  async function handleUpdateNote(id, title, content) {
    setError("");
    try {
      await fetch(API(`/notes/${id}`), {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({ title, content }),
      });
      fetchNotes();
    } catch {
      setError("Update failed");
    }
  }

  useEffect(() => {
    if (token) {
      setMode("notes");
      fetchNotes();
    }
  }, [token]);

  if (!token && mode === "signup") return (
    <div>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <input placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Sign up</button>
      </form>
      <button onClick={() => setMode("login")}>Already have an account?</button>
      <div style={{color: 'red'}}>{error}</div>
    </div>
  );

  if (!token && mode === "login") return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input placeholder="Username" required value={username} onChange={e => setUsername(e.target.value)} /><br />
        <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} /><br />
        <button type="submit">Login</button>
      </form>
      <button onClick={() => setMode("signup")}>Need an account?</button>
      <div style={{color: 'red'}}>{error}</div>
    </div>
  );

  return (
    <div style={{ maxWidth: 360, margin: 'auto' }}>
      <h2>Your Notes</h2>
      <button onClick={handleLogout}>Logout</button>
      <form onSubmit={handleAddNote} style={{ marginTop: 15 }}>
        <input placeholder="Title" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /><br />
        <input placeholder="Content" required value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} /><br />
        <button type="submit">Add Note</button>
      </form>
      {notes.length === 0 && <p>No notes found.</p>}
      {notes.map(note => (
        <NoteItem key={note._id} note={note} onDelete={() => handleDeleteNote(note._id)} onUpdate={handleUpdateNote} />
      ))}
      <div style={{color:'red'}}>{error}</div>
    </div>
  );
}

// Component to edit a note inline
function NoteItem({ note, onDelete, onUpdate }) {
  const [editing, setEditing] = React.useState(false);
  const [title, setTitle] = React.useState(note.title);
  const [content, setContent] = React.useState(note.content);

  return (
    <div style={{ border: '1px solid #ccc', padding: 8, margin: '10px 0' }}>
      {editing ? (
        <form onSubmit={e => {
          e.preventDefault();
          onUpdate(note._id, title, content);
          setEditing(false);
        }}>
          <input value={title} onChange={e => setTitle(e.target.value)} required />
          <input value={content} onChange={e => setContent(e.target.value)} required />
          <button type="submit">Save</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <>
          <h4>{note.title}</h4>
          <p>{note.content}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
          <button onClick={onDelete} style={{ marginLeft: 10, color: 'red' }}>Delete</button>
        </>
      )}
    </div>
  );
}

export default App;

