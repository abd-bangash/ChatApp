 export const analyze = async (req, res) => {
  const { text } = req.body;

  try {
    const hfRes = await fetch(
      "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${process.env.HF_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const data = await hfRes.json();
    // HF returns array of labels with scores
    const top = data[0].sort((a,b)=>b.score - a.score)[0];
    // e.g. top.label = "joy"
    res.json({ emotion: top.label, score: top.score });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Emotion analysis failed" });
  }
};