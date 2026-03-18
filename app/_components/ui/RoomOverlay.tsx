"use client";

import { useEffect, useState, useRef } from "react";
import ScrollHint from "./ScrollHint";

interface RoomOverlayProps {
  currentRoom: string | null;
  onLeave: () => void;
  hideScrollHint?: boolean;
}

interface Message {
  id: string;
  sender: string;
  text: string;
  time: string;
  isMe: boolean;
}

export default function RoomOverlay({
  currentRoom,
  onLeave,
  hideScrollHint = false,
}: RoomOverlayProps) {
  const [displayRoom, setDisplayRoom] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  if (currentRoom !== displayRoom) {
    setDisplayRoom(currentRoom);
    if (currentRoom) {
      setMessages([
        {
          id: `welcome-${currentRoom}`,
          sender: "System Bot",
          text: `Welcome to the ${currentRoom} workspace. Start collaborating!`,
          time: "Just now",
          isMe: false,
        },
      ]);
    }
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const myMessage: Message = {
      id: Date.now().toString(),
      sender: "You",
      text: inputValue,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      isMe: true,
    };

    setMessages((prev) => [...prev, myMessage]);
    setInputValue("");

    setTimeout(() => {
      const botReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "Alex (Lead)",
        text: `Got it! Let's discuss this in the ${displayRoom} sync later.`,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isMe: false,
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1000);
  };

  const isOpen = !!currentRoom;

  return (
    <>
      <ScrollHint isHidden={isOpen || hideScrollHint} />

      <div
        className={`fixed top-0 right-0 w-100 h-full bg-slate-900/85 backdrop-blur-xl border-l border-white/10 text-white flex flex-col shadow-[-10px_0_30px_rgba(0,0,0,0.5)] transition-transform duration-500 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center bg-slate-950/50">
          <div>
            <h2 className="text-xl font-black text-white flex items-center gap-2">
              {displayRoom}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs text-slate-400 font-medium">
                3 Members Online
              </span>
            </div>
          </div>
          <button
            onClick={onLeave}
            className="group flex items-center justify-center w-8 h-8 rounded-full bg-white/5 hover:bg-red-500/20 transition-colors"
          >
            <svg
              className="w-4 h-4 text-slate-400 group-hover:text-red-400 transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto flex flex-col gap-5 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.isMe ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <div className="flex items-baseline gap-2 mb-1 px-1">
                <span
                  className={`text-xs font-bold ${msg.isMe ? "text-cyan-400" : "text-slate-300"}`}
                >
                  {msg.sender}
                </span>
                <span className="text-[10px] text-slate-500">{msg.time}</span>
              </div>
              <div
                className={`p-3 rounded-2xl text-sm leading-relaxed ${
                  msg.isMe
                    ? "bg-cyan-600/20 text-cyan-50 border border-cyan-500/30 rounded-tr-sm"
                    : "bg-slate-800 text-slate-200 border border-white/5 rounded-tl-sm"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="p-4 border-t border-white/10 bg-slate-950/50">
          <form
            onSubmit={handleSendMessage}
            className="relative flex items-center"
          >
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={`Message ${displayRoom}...`}
              className="w-full bg-slate-900 border border-slate-700 text-white rounded-full pl-5 pr-12 py-3 text-sm focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="absolute right-2 p-2 bg-cyan-600 rounded-full text-white disabled:opacity-50 disabled:bg-slate-700 transition-all hover:bg-cyan-500"
            >
              <svg
                className="w-4 h-4 translate-x-px -translate-y-px"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
