import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  console.log("=== UPLOAD FUNCTION START ===");
  console.log("Method:", event.httpMethod);
  console.log("Headers keys:", Object.keys(event.headers || {}));

  if (event.httpMethod !== "POST") {
    console.log("Invalid method");
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST allowed" }),
    };
  }

  try {
    if (!event.body) {
      console.log("No body");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "No file data" }),
      };
    }

    console.log("Body size:", event.body.length);
    console.log("Is base64:", event.isBase64Encoded);

    // Generate IDs
    const fileId = Date.now().toString();
    const timestamp = new Date().toISOString();

    // Get filename from header
    const contentDisposition = event.headers["content-disposition"] || "";
    let fileName = "document.pptx";

    const match = contentDisposition.match(/filename[^;=\n]*=(["\']?)([^"\';]*)\1/);
    if (match && match[2]) {
      fileName = match[2];
    }

    console.log("File name:", fileName);
    console.log("File ID:", fileId);

    // For now, just acknowledge receipt
    // Real file handling would go here
    const response = {
      fileId,
      fileName,
      timestamp,
      status: "uploaded",
    };

    console.log("=== UPLOAD FUNCTION SUCCESS ===");
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("=== UPLOAD ERROR ===", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      }),
    };
  }
};

export { handler };
