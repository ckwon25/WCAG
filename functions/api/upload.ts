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
    const body = event.body || "";
    const boundary = event.headers["content-type"]?.split("boundary=")[1];

    if (!boundary) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid multipart data" }),
      };
    }

    // Parse multipart form data
    const parts = body.split(`--${boundary}`);
    let fileData = null;
    let fileName = "document";

    for (const part of parts) {
      if (part.includes('Content-Disposition: form-data; name="file"')) {
        const match = part.match(/filename="([^"]+)"/);
        if (match) fileName = match[1];

        const fileStart = part.indexOf("\r\n\r\n") + 4;
        const fileEnd = part.lastIndexOf("\r\n");
        fileData = part.substring(fileStart, fileEnd);
        break;
      }
    }

    if (!fileData) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No file uploaded" }),
      };
    }

    // Save file
    const uploadsDir = "/tmp/uploads";
    fs.mkdirSync(uploadsDir, { recursive: true });

    const fileId = Date.now().toString();
    const filePath = path.join(uploadsDir, `${fileId}-${fileName}`);
    fs.writeFileSync(filePath, fileData, "binary");

    return {
      statusCode: 200,
      body: JSON.stringify({ fileId, fileName }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
    };
  }
};

export { handler };
