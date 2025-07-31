"use client";
import { useEffect, useState } from "react";
function MainPage() {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔁 Load chat from localStorage on first render
  useEffect(() => {
    const savedChat = localStorage.getItem("chatHistory");
    if (savedChat) {
      setChatHistory(JSON.parse(savedChat));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    const updatedHistory = [...chatHistory, { role: "user", content: query }];

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedHistory,
        }), // ✅ correct key
      });

      const data = await res.json();

      // ✅ Check if response is valid before adding
      if (!data.response || typeof data.response !== "string") {
        alert("AI failed to respond. Please try again.");
        setLoading(false);
        return;
      }

      const finalChat = [
        ...updatedHistory,
        { role: "assistant", content: data.response },
      ];

      setChatHistory(finalChat);
      localStorage.setItem("chatHistory", JSON.stringify(finalChat));
      setQuery("");
    } catch (error) {
      alert("Something went wrong. Check console.");
      console.error("Frontend Error:", error);
    }

    setLoading(false);
  };

  // 🧹 Clear chat
  const handleClear = () => {
    setChatHistory([]);
    localStorage.removeItem("chatHistory");
  };

  return (
    <div className="container mx-auto px-6 py-6">
      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          className="w-full border border-white bg-gray-800 text-white p-2 rounded"
          rows={5}
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault(); // prevent new line
              handleSubmit(e); // manually trigger submit
            }
          }}
        />
        <div className="flex justify-center items-center gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-700"
          >
            {loading ? "Thinking..." : "ASK GPT"}
          </button>
          <button
            type="button"
            onClick={handleClear}
            className="bg-red-500 text-white px-6 py-3 rounded hover:bg-red-700"
          >
            Clear Chat
          </button>
        </div>
      </form>

      {/* 💬 Chat History */}
      {chatHistory.length > 0 && (
        <div className="mt-6 space-y-4">
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded shadow ${
                msg.role === "user"
                  ? "bg-gray-700 text-white text-right "
                  : "bg-gray-200 text-black text-left"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MainPage;
