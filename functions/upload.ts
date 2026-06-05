import { Handler } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No file data" }),
      };
    }

    // Decode base64 if needed
    const buffer = event.isBase64Encoded
      ? Buffer.from(event.body, "base64")
      : Buffer.from(event.body);

    // Generate file ID
    const fileId = Date.now().toString();
    const uploadsDir = "/tmp/uploads";

    fs.mkdirSync(uploadsDir, { recursive: true });

    // Extract filename from content-disposition header
    const contentDisposition = event.headers["content-disposition"] || "";
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
    const fileName = filenameMatch ? filenameMatch[1] : `document_${fileId}`;

    const filePath = path.join(uploadsDir, `${fileId}_${fileName}`);
    fs.writeFileSync(filePath, buffer);

    return {
      statusCode: 200,
      body: JSON.stringify({
        fileId,
        fileName,
        filePath,
      }),
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
    };
  }
};

export { handler };
