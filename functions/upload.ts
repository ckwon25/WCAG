import { Handler } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";
import * as busboy from "busboy";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  return new Promise((resolve) => {
    const uploadsDir = "/tmp/uploads";
    fs.mkdirSync(uploadsDir, { recursive: true });

    const fileId = Date.now().toString();
    let fileName = "document";
    let filePath = "";

    const bb = busboy({ headers: event.headers as any });

    bb.on("file", (fieldname, file, info) => {
      fileName = info.filename;
      filePath = path.join(uploadsDir, `${fileId}-${fileName}`);

      const stream = fs.createWriteStream(filePath);
      file.pipe(stream);

      stream.on("finish", () => {
        resolve({
          statusCode: 200,
          body: JSON.stringify({ fileId, fileName }),
        });
      });

      stream.on("error", (error) => {
        resolve({
          statusCode: 500,
          body: JSON.stringify({ error: String(error) }),
        });
      });
    });

    bb.on("error", (error) => {
      resolve({
        statusCode: 400,
        body: JSON.stringify({ error: String(error) }),
      });
    });

    if (event.body) {
      bb.write(
        Buffer.from(event.body, event.isBase64Encoded ? "base64" : "utf8")
      );
    }
    bb.end();
  });
};

export { handler };
