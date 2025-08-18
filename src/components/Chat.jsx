"use client";
import { useEffect, useRef, useState } from "react";

function ChatBoot({ userId }) {
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const chatContainerRef = useRef(null);
  const bottomRef = useRef(null);

  // 🧠 Unique localStorage key per user
  const LOCAL_KEY = `chatHistory-${userId}`;

  // ✅ Load user-specific chat from backend on login, fallback to localStorage
  useEffect(() => {
    if (!userId) return;

    const fetchChat = async () => {
      try {
        const apiUrl =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiUrl}/api/chat/${userId}`);
        if (res.ok) {
          const chats = await res.json();
          // Convert DB format to local format
          const formatted = chats.map((msg) => ({
            role: msg.role,
            content: msg.message,
          }));
          setChatHistory(formatted);
          localStorage.setItem(LOCAL_KEY, JSON.stringify(formatted));
          return;
        }
      } catch (err) {
        // fallback to localStorage
      }
      const savedChat = localStorage.getItem(LOCAL_KEY);
      if (savedChat) {
        setChatHistory(JSON.parse(savedChat));
      } else {
        setChatHistory([]);
      }
    };
    fetchChat();
  }, [userId]);

  // ✅ Auto scroll on chat update
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  // ✅ Handle scroll button
  useEffect(() => {
    const handleScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } =
          chatContainerRef.current;
        const isScrolledUp = scrollHeight - scrollTop - clientHeight > 100;
        setShowScrollButton(isScrolledUp);
      }
    };

    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      chatContainer.addEventListener("scroll", handleScroll);
      return () => chatContainer.removeEventListener("scroll", handleScroll);
    }
  }, [chatHistory]);

  const scrollToBottom = () => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);

    const updatedHistory = [...chatHistory, { role: "user", content: query }];

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

      // Send user message to backend for DB storage
      await fetch(`${apiUrl}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId, message: query, role: "user" }),
      });

      // Get AI response
      const res = await fetch(`${apiUrl}/ask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: updatedHistory }),
      });

      const data = await res.json();

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
      localStorage.setItem(LOCAL_KEY, JSON.stringify(finalChat));
      setQuery("");
    } catch (error) {
      alert("Something went wrong. Check console.");
      console.error("Frontend Error:", error);
    }

    setLoading(false);
  };

  const handleClear = () => {
    setChatHistory([]);
    localStorage.removeItem(LOCAL_KEY);
  };

  return (
    <div className="container mx-auto px-6 py-6 relative">
      {/* Chat History */}
      {chatHistory.length > 0 && (
        <div
          ref={chatContainerRef}
          className="mt-6 space-y-4 max-h-96 overflow-y-auto pr-2"
          style={{ scrollbarWidth: "thin" }}
        >
          {chatHistory.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded shadow ${
                msg.role === "user"
                  ? "bg-gray-700 text-white text-right"
                  : "bg-gray-200 text-black text-left"
              }`}
            >
              <strong>{msg.role === "user" ? "You" : "AI"}:</strong>{" "}
              {msg.content}
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Scroll to Bottom Button */}
      {showScrollButton && (
        <button
          onClick={scrollToBottom}
          className="fixed bottom-32 right-8 bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-10"
          title="Scroll to bottom"
        >
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 13l3 3 7-7" />
            <path d="M7 6l3 3 7-7" />
          </svg>
        </button>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
        <textarea
          className="w-full border border-white bg-gray-800 text-white mt-10 mb-10 p-2 rounded"
          rows={5}
          placeholder="Ask something..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
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
    </div>
  );
}

export default ChatBoot;
