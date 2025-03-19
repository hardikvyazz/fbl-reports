import { reporterAddress } from "../config/credentials";

export interface ParsedEmail {
  reporter: string;
  originalSender: string;
  originalRecipient: string;
  domain: string;
  subject: string;
  inboxDate: string;
  messageId: string;
  x_listmonk_campaign: string;
}

export function parseForwardedEmail(forwardedMessage: string, inboxDate: string): ParsedEmail {
  const lines = forwardedMessage.split("\n");
  let originalSender = "N/A";
  let originalRecipient = "N/A";
  let subject = "N/A";
  let messageId = "N/A";
  let domain = "N/A";
  let x_listmonk_campaign = "N/A";

  let insideOriginalHeaders = false;
  let potentialMessageId = "N/A";

  lines.forEach((line) => {
      line = line.trim();

      // Detect where the original email headers start (ignoring Yahoo's wrapper)
      if (line.toLowerCase().startsWith("received:")) {
          insideOriginalHeaders = true; // Now we're inside the original email
      }

      if (insideOriginalHeaders) {
          if (line.toLowerCase().startsWith("message-id:")) {
              potentialMessageId = line.split(":")[1]?.trim() || "N/A";
          }
          if (line.toLowerCase().startsWith("from:")) {
              originalSender = line.split(":")[1]?.trim() || "N/A";
          }
          if (line.toLowerCase().startsWith("to:")) {
              originalRecipient = line.split(":")[1]?.trim() || "N/A";
          }
          if (line.toLowerCase().startsWith("subject:")) {
              subject = line.split(":")[1]?.trim() || "N/A";
          }
          if (line.toLowerCase().startsWith("x-listmonk-campaign:")) {
            x_listmonk_campaign = line.split(":")[1]?.trim() || "N/A";
        }
      }
  });

  if (potentialMessageId !== "N/A") {
      messageId = potentialMessageId; // Use the first valid message ID from original headers
  }

  domain = originalSender.includes("@") ? originalSender.split("@")[1] : "N/A";

  return {
      reporter: reporterAddress,
      originalSender,
      originalRecipient,
      domain,
      subject,
      inboxDate,
      messageId,
      x_listmonk_campaign
  };
}
