import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import langchainRoutes from "./routes/langchain.js";
import crewaiRoutes from "./routes/crewai.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Agentic AI Research Assistant Backend is running 🚀");
});

app.use("/api/langchain", langchainRoutes);
app.use("/api/crewai", crewaiRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
