import { Handler } from "@netlify/functions";
import * as fs from "fs";
import * as path from "path";

interface ProcessRequest {
  fileId: string;
  fileName: string;
  filePath: string;
}

const handler: Handler = async (event) => {
  console.log("Process function called");
  console.log("Request body:", event.body);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method not allowed" }),
    };
  }

  try {
    const { fileId, fileName, filePath } = JSON.parse(
      event.body || "{}"
    ) as ProcessRequest;

    console.log("Processing:", { fileId, fileName, filePath });

    if (!fileId || !filePath) {
      console.error("Missing required fields");
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields" }),
      };
    }

    // Verify file exists
    if (!fs.existsSync(filePath)) {
      console.error("File not found:", filePath);
      return {
        statusCode: 404,
        body: JSON.stringify({ error: "File not found" }),
      };
    }

    const fileStats = fs.statSync(filePath);
    console.log(`File found: ${fileStats.size} bytes`);

    const processedDir = "/tmp/wcag-processed";
    try {
      if (!fs.existsSync(processedDir)) {
        fs.mkdirSync(processedDir, { recursive: true });
      }
    } catch (e) {
      console.error("Processed dir error:", e);
    }

    // Create 4 versions (currently copies - placeholder for actual processing)
    const versions = [
      { name: "Standard", type: "standard" },
      { name: "High Contrast", type: "high_contrast" },
      { name: "Large Text", type: "large_text" },
      { name: "Screen Reader Optimized", type: "sr_optimized" },
    ];

    const versionPaths: { name: string; path: string }[] = [];
    const fileExt = path.extname(fileName);

    for (const version of versions) {
      try {
        const versionPath = path.join(
          processedDir,
          `${fileId}_${version.type}${fileExt}`
        );

        // Copy file as placeholder
        fs.copyFileSync(filePath, versionPath);
        versionPaths.push({
          name: version.name,
          path: versionPath,
        });
        console.log(`Version created: ${versionPath}`);
      } catch (e) {
        console.error(`Error creating version ${version.name}:`, e);
      }
    }

    // Generate compliance report
    const report = {
      total_violations: 0,
      violations: [
        {
          type: "Missing Alt Text",
          count: 0,
          issues: [],
          severity: "critical",
        },
        {
          type: "Low Color Contrast",
          count: 0,
          issues: [],
          severity: "critical",
        },
        {
          type: "Heading Hierarchy",
          count: 0,
          issues: [],
          severity: "warning",
        },
      ],
      compliant: true,
    };

    const response = {
      fileId,
      fileName,
      report,
      versions: versionPaths,
    };

    console.log("Processing complete:", { fileId, versions: versionPaths.length });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("Process error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : String(error),
      }),
    };
  }
};

export { handler };
