import express from "express";
import { authenticateIMAP } from "./controllers/authController";
import { fetchAndProcessEmails } from "./controllers/emailContriller"
const app = express();
const PORT = process.env.PORT || 3000;

app.get("/process-emails", async (req, res) => {
  try {
    const connection = await authenticateIMAP();
    await fetchAndProcessEmails(connection);
    res.send("Emails processed successfully!");
  } catch (error) {
    console.error("Error in /process-emails route:", error);
    res.status(500).send("Failed to process emails.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
