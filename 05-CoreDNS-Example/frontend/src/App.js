import React, { useState, useEffect } from 'react';
import { fetchItems, addItem } from './api';

export default function App() {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    fetchItems().then(setItems);
  }, []);

  const handleAdd = async () => {
    if (!text) return;
    const newItem = await addItem(text);
    setItems(items.concat(newItem));
    setText('');
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Demo App</h1>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="New item"
      />
      <button onClick={handleAdd}>Add</button>
      <ul>
        {items.map(i => (
          <li key={i.id}>{i.text}</li>
        ))}
      </ul>
    </div>
  );
}

