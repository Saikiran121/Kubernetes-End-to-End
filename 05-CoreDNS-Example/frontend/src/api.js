const BASE = process.env.REACT_APP_BACKEND_URL || 'http://backend-service.demo-app.svc.cluster.local:3000';

export async function fetchItems() {
  const res = await fetch(`${BASE}/items`);
  return res.json();
}

export async function addItem(text) {
  const res = await fetch(`${BASE}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  });
  return res.json();
}

