import { useState } from "react";
import { MessageCircle } from "lucide-react";

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ from: "ai", text: "Hi! How can I assist your research today?" }]);
  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;
    setMessages([...messages, { from: "user", text: input }, { from: "ai", text: "Here's a related grant opportunity on AI & Education (mock)." }]);
    setInput("");
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 bg-violet-600 text-white p-4 rounded-full shadow-lg hover:bg-violet-700"
      >
        <MessageCircle size={24} />
      </button>
      {open && (
        <div className="fixed bottom-20 right-6 bg-white shadow-2xl rounded-2xl w-80 p-4">
          <div className="h-60 overflow-y-auto mb-3 text-sm">
            {messages.map((m, i) => (
              <div key={i} className={`mb-2 ${m.from === "ai" ? "text-violet-700" : "text-gray-800 text-right"}`}>
                {m.text}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about research..."
              className="flex-1 border rounded-lg px-2 py-1"
            />
            <button onClick={sendMessage} className="bg-violet-600 text-white px-3 rounded-lg">Send</button>
          </div>
        </div>
      )}
    </>
  );
}
