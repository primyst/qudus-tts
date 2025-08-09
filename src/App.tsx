import { useEffect, useState } from "react";

export default function App() {
  const [voices, setVoices] = useState<{ id: string; label: string }[]>([]);
  const [text, setText] = useState("");
  const [voice, setVoice] = useState("");
  const [loading, setLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const res = await fetch("/api/voices");
        const data = await res.json();
        setVoices(data);
        if (data.length > 0) setVoice(data[0].id);
      } catch (err) {
        console.error("Failed to load voices", err);
      }
    };
    fetchVoices();
  }, []);

  const speak = async () => {
    if (!text.trim()) {
      alert("Please enter some text");
      return;
    }

    setLoading(true);
    setAudioUrl(null);

    try {
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text, voice }),
      });

      if (!response.ok) throw new Error("Failed to generate speech");

      const arrayBuffer = await response.arrayBuffer();
      const blob = new Blob([arrayBuffer], { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.play();
    } catch (err) {
      console.error(err);
      alert("Error generating speech");
    } finally {
      setLoading(false);
    }
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

      <select
        className="mb-4 p-3 rounded-lg text-black"
        value={voice}
        onChange={(e) => setVoice(e.target.value)}
      >
        {voices.map((v) => (
          <option key={v.id} value={v.id}>
            {v.label}
          </option>
        ))}
      </select>

      <button
        onClick={speak}
        disabled={loading}
        className="bg-pink-500 hover:bg-pink-600 px-6 py-3 rounded-lg font-semibold disabled:opacity-50"
      >
        {loading ? "Generating..." : "🔊 Convert to Speech"}
      </button>

      {audioUrl && (
        <div className="mt-4 flex flex-col items-center gap-2">
          <audio controls src={audioUrl}></audio>
          <a
            href={audioUrl}
            download="speech.mp3"
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg"
          >
            ⬇️ Download MP3
          </a>
        </div>
      )}

      <footer className="mt-8 text-sm opacity-75">
        Design & Developed by{" "}
        <a
          href="https://aq-portfolio-rose.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-pink-300"
        >
          &gt;primyst&lt;
        </a>
      </footer>
    </div>
  );
}
