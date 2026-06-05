import { Handler } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";

const handler: Handler = async (event) => {
  try {
    const filePath = event.queryStringParameters?.path;

    if (!filePath) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing file path" }),
      };
    }

    // Security: ensure file is in /tmp/processed
    const processedDir = "/tmp/processed";
    const normalizedPath = path.normalize(filePath);
    if (!normalizedPath.startsWith(processedDir)) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Access denied" }),
      };
    }

    if (!fs.existsSync(normalizedPath)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "File not found" }),
      };
    }

    const fileContent = fs.readFileSync(normalizedPath);
    const fileName = path.basename(normalizedPath);
    const ext = path.extname(fileName).toLowerCase();

    let contentType = "application/octet-stream";
    if (ext === ".pptx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.presentationml.presentation";
    } else if (ext === ".docx") {
      contentType =
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": fileContent.length.toString(),
      },
      body: fileContent.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    console.error("Download error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
    };
  }
};

export { handler };
