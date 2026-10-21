import { readFile } from "node:fs/promises";

const file = new URL("../events.json", import.meta.url);

const requiredFields = [
  "date",
  "sport",
  "title",
  "venue",
  "time",
  "who",
  "how",
  "flag",
  "src",
  "srcName"
];

try {
  const raw = await readFile(file, "utf8");
  const data = JSON.parse(raw);

  if (!data || typeof data !== "object" || !Array.isArray(data.events)) {
    throw new Error("events.json must be an object with an events array.");
  }

  for (let i = 0; i < data.events.length; i++) {
    const item = data.events[i];
    for (const field of requiredFields) {
      if (!(field in item)) {
        throw new Error(`Item ${i + 1} is missing required field: ${field}`);
      }
    }

    if (!Array.isArray(item.who) || item.who.length === 0) {
      throw new Error(`Item ${i + 1} has an invalid who array.`);
    }

    if (!/^https?:\/\//i.test(item.src)) {
      throw new Error(`Item ${i + 1} has an invalid src URL.`);
    }
  }

  console.log(`✓ events.json is valid: ${data.events.length} fixtures`);
} catch (error) {
  console.error("✗ Validation failed");
  console.error(error.message);
  process.exit(1);
}
