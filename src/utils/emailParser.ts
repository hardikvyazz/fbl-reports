export interface ParsedEmail {
    reporter: string;
    originalSender: string;
    originalRecipient: string;
    domain: string;
    subject: string;
    inboxDate: string;
  }
  
  export function parseForwardedEmail(forwardedMessage: string, inboxDate: string): ParsedEmail {
    const lines = forwardedMessage.split("\n");
    let originalSender = "";
    let originalRecipient = "";
    let subject = "";
  
    lines.forEach((line) => {
      if (line.startsWith("From:")) originalSender = line.split("From: ")[1]?.trim() || "N/A";
      if (line.startsWith("To:")) originalRecipient = line.split("To: ")[1]?.trim() || "N/A";
      if (line.startsWith("Subject:")) subject = line.split("Subject: ")[1]?.trim() || "N/A";
    });
  
    const domain = originalSender.includes("@") ? originalSender.split("@")[1] : "N/A";
  
    return {
      reporter: "feedback@arf.mail.yahoo.com",
      originalSender,
      originalRecipient,
      domain,
      subject,
      inboxDate // Placeholder, will be replaced later
    };
  }
  