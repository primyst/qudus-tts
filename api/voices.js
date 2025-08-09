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

    // Map to match { id, label } format
    const voices = data.voices.map((v) => ({
      id: v.voice_id,
      label: `${v.name} (${v.labels?.accent || "Unknown Accent"})`
    }));

    res.status(200).json(voices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch voices" });
  }
}
