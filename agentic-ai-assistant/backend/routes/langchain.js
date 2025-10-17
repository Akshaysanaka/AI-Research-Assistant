import express from "express";
const router = express.Router();

// Simulated LangChain API placeholder
router.post("/search", (req, res) => {
  const { query } = req.body;
  res.json({
    query,
    results: [
      { title: "AI in Higher Education", author: "Dr. Jane Doe", year: 2024 },
      { title: "Collaborative Research with LLMs", author: "Prof. Alan Turing", year: 2023 }
    ]
  });
});

export default router;
