import express from "express";
import fs from "fs";
const router = express.Router();

router.get("/collaborators", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/collaborators.json"));
  res.json(data);
});

router.get("/grants", (req, res) => {
  const data = JSON.parse(fs.readFileSync("./data/grants.json"));
  res.json(data);
});

export default router;
