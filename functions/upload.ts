import { Handler } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";

const handler: Handler = async (event) => {
  console.log("Upload function called");
  console.log("HTTP Method:", event.httpMethod);
  console.log("Headers:", JSON.stringify(event.headers));
  console.log("Body size:", event.body?.length || 0);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    if (!event.body) {
      console.error("No body in request");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No file data provided" }),
      };
    }

    // Decode base64 if needed
    let buffer: Buffer;
    try {
      buffer = event.isBase64Encoded
        ? Buffer.from(event.body, "base64")
        : Buffer.from(event.body);
    } catch (e) {
      console.error("Buffer decode error:", e);
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid file data" }),
      };
    }

    // Generate file ID and path
    const fileId = Date.now().toString();
    const uploadsDir = "/tmp/wcag-uploads";

    // Create directory
    try {
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
    } catch (e) {
      console.error("Directory creation error:", e);
      // Continue anyway, might already exist
    }

    // Extract filename
    const contentDisposition = event.headers["content-disposition"] || "";
    const filenameMatch = contentDisposition.match(/filename[^;=\n]*=(["\']?)([^"\';]*)\1/);
    let fileName = filenameMatch ? filenameMatch[2] : `document_${fileId}.pptx`;

    // Ensure file has extension
    if (!fileName.includes(".")) {
      fileName = `${fileName}.pptx`;
    }

    const filePath = path.join(uploadsDir, `${fileId}_${fileName}`);

    // Write file
    try {
      fs.writeFileSync(filePath, buffer);
      console.log(`File saved: ${filePath} (${buffer.length} bytes)`);
    } catch (e) {
      console.error("File write error:", e);
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to save file" }),
      };
    }

    // Verify file was written
    if (!fs.existsSync(filePath)) {
      console.error("File verification failed");
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "File write verification failed" }),
      };
    }

    const response = {
      fileId,
      fileName: fileName,
      filePath: filePath,
    };

    console.log("Upload successful:", response);
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Upload error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

export { handler };
