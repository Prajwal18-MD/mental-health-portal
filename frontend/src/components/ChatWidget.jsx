import { useEffect, useState, useRef } from "react";
import { sendChat, getChatHistory } from "../services/api";

export default function ChatWidget({ token }) {
  const [history, setHistory] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef();

  useEffect(()=> {
    if(!token) return;
    getChatHistory(token).then(setHistory).catch(()=>setHistory([]));
  }, [token]);

  useEffect(()=> {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history]);

  async function send() {
    if (!text || !token) return;
    setLoading(true);
    try {
      const res = await sendChat(token, text);
      // append user message locally then fetch history
      setHistory(prev => [...prev, { sender: "user", text }]);
      setText("");
      // Append bot reply from response
      if (res && res.reply) {
        setHistory(prev => [...prev, { sender: "bot", text: res.reply }]);
        if (res.escalate) {
          alert("This message was flagged as HIGH risk. Please contact a professional or book a session.");
        }
      } else {
        // fallback
        setHistory(prev => [...prev, { sender: "bot", text: "Sorry, I couldn't respond." }]);
      }
      // re-sync full history from server (optional)
      const full = await getChatHistory(token);
      setHistory(full.map(h => ({ sender: h.sender, text: h.text, id: h.id })));
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-3 border rounded flex flex-col h-105">
      <h4 className="font-semibold mb-2">Chatbot — Basic Support</h4>
      <div className="flex-1 overflow-auto mb-2 p-2 bg-slate-50 rounded">
        {history.length === 0 ? <div className="text-sm text-gray-500">No conversation yet. Say hi 👋</div> :
          history.map((m, i) => (
            <div key={i} className={`mb-2 ${m.sender === "bot" ? "text-left" : "text-right"}`}>
              <div className={`inline-block px-3 py-2 rounded ${m.sender === "bot" ? "bg-white border" : "bg-sky-600 text-white"}`}>
                {m.text}
              </div>
            </div>
          ))
        }
        <div ref={endRef} />
      </div>

      <div className="flex gap-2">
        <input value={text} onChange={(e)=>setText(e.target.value)} className="flex-1 p-2 border rounded" placeholder="Type your message..." />
        <button onClick={send} disabled={loading || !text} className="px-3 py-2 bg-sky-600 text-white rounded">{loading ? "Sending..." : "Send"}</button>
      </div>
    </div>
  );
}
