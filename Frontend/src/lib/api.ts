export type ChatMessage = { role: 'user' | 'assistant' | 'system'; content: string };

export async function sendChat(messages: ChatMessage[], data?: unknown): Promise<string> {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  const res = await fetch(`${apiUrl}/api/ai`, {
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


