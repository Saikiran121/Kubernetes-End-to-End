import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    axios.get('/api/hello')
      .then(res => setMessage(res.data.message))
      .catch(console.error);
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Kubernetes Recreate Strategy Demo</h1>
      <p>{message || 'Loading...'}</p>
    </div>
  );
}

export default App;
