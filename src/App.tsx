import { useState } from "react";

export default function App() {
  const [text, setText] = useState("");

  const speak = () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    speechSynthesis.speak(utterance);
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 p-6">
      <h1 className="text-3xl font-bold mb-6">Text to Voice AI</h1>
      <textarea
        className="w-full max-w-lg p-4 rounded-lg text-black mb-4"
        rows={5}
        placeholder="Type something and hear it..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        onClick={speak}
        className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg font-semibold"
      >
        🔊 Convert to Speech
      </button>
      <footer className="mt-8 text-sm opacity-75">
        Design & Developed by <a href="https://aq-portfolio-rose.vercel.app/"><strong>&gt;primyst&lt;</strong></a>
      </footer>
    </div>
  );
}
