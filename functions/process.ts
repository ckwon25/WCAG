import { Handler } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { fileId, fileName } = JSON.parse(event.body || "{}");

    if (!fileId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing fileId" }),
      };
    }

    const uploadsDir = "/tmp/uploads";
    const filePath = fs.readdirSync(uploadsDir).find((f) => f.startsWith(fileId));

    if (!filePath) {
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "File not found" }),
      };
    }

    const fullPath = path.join(uploadsDir, filePath);
    const fileType = path.extname(filePath).slice(1);

    // Run Python processing
    const pythonScript = `
import sys
sys.path.insert(0, '/var/task/functions/api')
from parse import DocumentParser
from wcag_checker import WCAGChecker
from fixer import DocumentFixer

# Parse document
parser = DocumentParser('${fullPath}')
content = parser.parse()

# Check for violations
checker = WCAGChecker(content)
report = checker.check()

# Fix violations and create versions
fixer = DocumentFixer('${fullPath}', '${fileType}')
versions = fixer.fix()

# Return results
import json
print(json.dumps({
  'report': report,
  'versions': [
    {'name': 'Standard', 'path': versions['Standard']},
    {'name': 'High Contrast', 'path': versions['High Contrast']},
    {'name': 'Large Text', 'path': versions['Large Text']},
    {'name': 'Screen Reader Optimized', 'path': versions['Screen Reader Optimized']}
  ]
}))
`;

    const result = execSync(`python3 -c "${pythonScript}"`, {
      encoding: "utf-8",
      env: { ...process.env },
    });

    const processedData = JSON.parse(result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        fileId,
        fileName,
        report: processedData.report,
        versions: processedData.versions,
      }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: String(error) }),
    };
  }
};

export { handler };
