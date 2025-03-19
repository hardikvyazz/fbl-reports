import { reporterAddress } from "../config/credentials";
import { ParsedEmail, parseForwardedEmail } from "../utils/emailParser";
import { writeEmailsToCsv } from "../services/csvWritter";
import { getLastProcessedId, saveLastProcessedId } from "../services/stateService";

export async function fetchAndProcessEmails(connection: any): Promise<void> {
  const mailbox = await connection.openBox("INBOX");
  const lastProcessedId = getLastProcessedId();


  const nowUtc = new Date(); // Current time in UTC
  const istOffset = 5.5 * 60 * 60 * 1000; // IST offset in milliseconds
  const nowIst = new Date(nowUtc.getTime() + istOffset); // Convert UTC to IST
  
  const twentyFourHoursAgoIst = new Date(nowIst.getTime() - 24 * 60 * 60 * 1000); //24 hours age in IST


  // const searchCriteria = [["SINCE", lastProcessedId]]; // Fetch new emails since last processed
  const searchCriteria = lastProcessedId ? [["UID", `${lastProcessedId}:*`], ["FROM", reporterAddress]] : [["SINCE", twentyFourHoursAgoIst], ["FROM", reporterAddress]];  // If: Last Processed ID else Fallback: Fetch last 24 hours

  const fetchOptions = { bodies: "", markSeen: false };

  try {
    const messages = await connection.search(searchCriteria, fetchOptions);

    const parsedEmails: ParsedEmail[] = [];
    let latestMessageId = lastProcessedId;

    for (const msg of messages) {
      const rawEmail = msg.parts[0].body;
      const inboxDate = msg.attributes.date?.toISOString() || "N/A"; 
      
      const parsed = parseForwardedEmail(rawEmail, inboxDate);

      parsedEmails.push(parsed);
      latestMessageId = msg.attributes.uid > latestMessageId ? msg.attributes.uid : latestMessageId;
    }

    await writeEmailsToCsv(parsedEmails);
    saveLastProcessedId(latestMessageId);
  } catch (error) {
    console.error("Error processing emails:", error);
  } finally {
    await connection.end();
  }
}
