import { EMAIL_CONFIG } from "../config/credentials";
import { connect } from "imap-simple";

async function authenticateIMAP(retries = 2, delay = 60000) { // 1 min delay initially
  const config = {
    imap: {
      user: EMAIL_CONFIG.user,
      password: EMAIL_CONFIG.appPassword,
      host: EMAIL_CONFIG.imapHost,
      port: EMAIL_CONFIG.imapPort,
      tls: true,
      tlsOptions: {
        rejectUnauthorized: false, // Ignore self-signed certificate
      },
    },
  };

  try {
    const connection = await connect(config);
    console.log("✅ IMAP connection established.");
    return connection;
  } catch (error:any) {
    console.error(`❌ Failed to authenticate with IMAP: ${error.message}`);

    if (retries > 0) {
      console.log(`🔄 Retrying in ${delay / 1000} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, delay));

      // Increase delay (exponential backoff: 1 min → 5 min)
      const nextDelay = delay === 60000 ? 300000 : delay;

      return authenticateIMAP(retries - 1, nextDelay);
    }

    throw new Error("IMAP Authentication failed after multiple attempts.");
  }
}

export { authenticateIMAP };