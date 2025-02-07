import { ParsedEmail, parseForwardedEmail } from "../utils/emailParser";
import { writeEmailsToCsv } from "../services/csvWritter";
import { getLastProcessedId, saveLastProcessedId } from "../services/stateService";

export async function fetchAndProcessEmails(connection: any): Promise<void> {
  const mailbox = await connection.openBox("INBOX");
  const lastProcessedId = getLastProcessedId();

  // Get the date 7 days ago
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 14);

  const searchCriteria = ["UNSEEN", ["SINCE", sevenDaysAgo]]; // Fetch new emails since last processed
  const fetchOptions = { bodies: "", markSeen: false };

  try {
    const messages = await connection.search(searchCriteria, fetchOptions);

    const parsedEmails: ParsedEmail[] = [];
    let latestMessageId = lastProcessedId;

    for (const msg of messages) {
      const rawEmail = msg.parts[0].body;
      const inboxDate = msg.attributes.date?.toISOString() || "N/A"; 
      console.log("Email received date:", inboxDate);
      
      const parsed = parseForwardedEmail(rawEmail, inboxDate);

      parsedEmails.push(parsed);
      latestMessageId = msg.attributes.uid > latestMessageId ? msg.attributes.uid : latestMessageId;
    }

    await writeEmailsToCsv(parsedEmails);
    saveLastProcessedId(latestMessageId);
  } catch (error) {
    console.error("Error processing emails:", error);
  } finally {
    await connection.closeBox();
  }
}
