export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function sendChat(messages: ChatMessage[], data?: unknown): Promise<string> {
  const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';  // Use environment variable for backend URL
  const res = await fetch(`${apiUrl}/ai`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages, data }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(text || `Request failed with ${res.status}`);
  }
  const json = await res.json();
  return json.message as string;
}


