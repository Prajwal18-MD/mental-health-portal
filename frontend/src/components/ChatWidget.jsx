// frontend/src/components/ChatWidget.jsx
import { useEffect, useState, useRef } from "react";

export default function ChatWidget({ token }) {
  const [messages, setMessages] = useState([]); // { role: 'user'|'bot', text, ts }
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef();

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage(e) {
    e && e.preventDefault();
    if (!text.trim()) return;
    const userMsg = { role: "user", text: text.trim(), ts: new Date().toISOString() };
    setMessages(m => [...m, userMsg]);
    setText("");
    setSending(true);

    try {
      const r = await fetch("http://127.0.0.1:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ text: userMsg.text })
      });
      const j = await r.json();
      if (!r.ok) {
        console.error("chat api error", j);
        const errMsg = { role: "bot", text: "Sorry, chat failed. Try again later.", ts: new Date().toISOString() };
        setMessages(m => [...m, errMsg]);
      } else {
        // expected { reply: "..." } and also returns stored message objects
        const botReply = j.reply || "I couldn't respond.";
        setMessages(m => [...m, { role: "bot", text: botReply, ts: new Date().toISOString() }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(m => [...m, { role: "bot", text: "Network error. Try again later.", ts: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-3 space-y-2 bg-slate-50 rounded">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 rounded ${m.role === 'user' ? 'bg-white self-end text-right' : 'bg-[#FFEF5F] self-start'}`}>
            <div className="text-sm">{m.text}</div>
            <div className="text-xs text-gray-400 mt-1">{new Date(m.ts).toLocaleTimeString()}</div>
          </div>
        ))}
        <div ref={endRef}></div>
      </div>

      <form onSubmit={sendMessage} className="flex items-center gap-2 mt-2">
        <input
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" disabled={sending || !text.trim()} className="px-3 py-2 bg-[#4D2B8C] text-white rounded">
          {sending ? "..." : "Send"}
        </button>
      </form>
    </div>
  );
}
