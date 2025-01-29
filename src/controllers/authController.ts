import { EMAIL_CONFIG } from "../config/credentials";
import { connect } from "imap-simple";

export async function authenticateIMAP() {
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
    console.log("IMAP connection established.");
    return connection;
  } catch (error) {
    console.error("Failed to authenticate with IMAP:", error);
    throw new Error("IMAP Authentication failed.");
  }
}
