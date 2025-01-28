import fs from "fs";
import path from "path";

const stateFilePath = path.resolve("data", "lastProcessedId.json");

export function getLastProcessedId(): string {
  try {
    if (fs.existsSync(stateFilePath)) {
      const data = fs.readFileSync(stateFilePath, "utf-8");
      return JSON.parse(data).lastProcessedId || "0";
    }
    return "0"; // Default to 0 if file doesn't exist
  } catch (error) {
    console.error("Error reading last processed ID:", error);
    return "0";
  }
}

export function saveLastProcessedId(lastProcessedId: string): void {
  try {
    fs.writeFileSync(stateFilePath, JSON.stringify({ lastProcessedId }, null, 2));
    console.log("Last processed ID updated:", lastProcessedId);
  } catch (error) {
    console.error("Error saving last processed ID:", error);
  }
}
