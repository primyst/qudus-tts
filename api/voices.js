export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const response = await fetch("https://api.elevenlabs.io/v1/voices", {
      headers: {
        "xi-api-key": process.env.ELEVENLABS_API_KEY,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText);
    }

    const data = await response.json();

    // Ensure voices is an array
    const voices = Array.isArray(data.voices) ? data.voices : [];

    const formattedVoices = voices.map((v) => ({
      id: v.voice_id,
      label: `${v.name} (${v.labels?.accent || "Unknown Accent"})`,
    }));

    res.status(200).json(formattedVoices);
  } catch (err) {
    console.error(err);
    // Return empty array on error to avoid frontend crash
    res.status(200).json([]);
  }
}
