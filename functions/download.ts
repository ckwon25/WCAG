import { Handler } from "@netlify/functions";
import * as fs from "fs";

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
    if (!filePath.startsWith("/tmp/processed")) {
      return {
        statusCode: 403,
        body: JSON.stringify({ error: "Access denied" }),
      };
    }

    if (!fs.existsSync(filePath)) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "File not found" }),
      };
    }

    const fileContent = fs.readFileSync(filePath);
    const fileName = filePath.split("/").pop();

    return {
      statusCode: 200,
      headers: {
        "Content-Type":
          filePath.endsWith(".pptx")
            ? "application/vnd.openxmlformats-officedocument.presentationml.presentation"
            : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
      body: fileContent.toString("base64"),
      isBase64Encoded: true,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
    };
  }
};

export { handler };
