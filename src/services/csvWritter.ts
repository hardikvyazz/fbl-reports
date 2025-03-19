import { createObjectCsvWriter } from "csv-writer";
import path from "path";
import { ParsedEmail } from "../utils/emailParser";

export async function writeEmailsToCsv(emails: ParsedEmail[]): Promise<void> {
  const todayDate = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
  const fileName = path.resolve("data", `fbl_reports_${todayDate}.csv`);

  const csvWriter = createObjectCsvWriter({
    path: fileName,
    header: [
      { id: "reporter", title: "Reporter" },
      { id: "originalSender", title: "Original Sender" },
      { id: "originalRecipient", title: "Original Recipient" },
      { id: "domain", title: "Domain" },
      { id: "subject", title: "Subject Line" },
      { id: "inboxDate", title: "Inbox Date" },
      {id: "messageId", title: "Message ID" },
      {id: "x_listmonk_campaign", title: "Listmonk Campaign" },
    ],
  });

  try {
    await csvWriter.writeRecords(emails);
    console.log(`CSV file created: ${fileName}`);
  } catch (error) {
    console.error("Error writing to CSV file:", error);
  }
}
