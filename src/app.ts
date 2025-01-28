import { authenticateIMAP } from "./controllers/authController";
import { fetchAndProcessEmails } from "./controllers/emailController";

async function startEmailProcessing() {
  try {
    const connection = await authenticateIMAP();
    await fetchAndProcessEmails(connection);
    console.log("Emails processed successfully!");
  } catch (error) {
    console.error("Error processing emails:", error);
  }
}

// Start email processing as soon as the script is executed
startEmailProcessing();
