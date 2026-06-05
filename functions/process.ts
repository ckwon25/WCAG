import { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  console.log("=== PROCESS FUNCTION START ===");
  console.log("Method:", event.httpMethod);

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Only POST allowed" }),
    };
  }

  try {
    console.log("Body:", event.body?.substring(0, 100));

    const data = JSON.parse(event.body || "{}");
    const { fileId, fileName } = data;

    console.log("Processing:", { fileId, fileName });

    if (!fileId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing fileId" }),
      };
    }

    // Return mock results
    const versions = [
      { name: "Standard", path: `/processed/${fileId}_standard.pptx` },
      { name: "High Contrast", path: `/processed/${fileId}_hc.pptx` },
      { name: "Large Text", path: `/processed/${fileId}_lg.pptx` },
      {
        name: "Screen Reader Optimized",
        path: `/processed/${fileId}_sr.pptx`,
      },
    ];

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
      ],
      compliant: true,
    };

    const response = {
      fileId,
      fileName,
      report,
      versions,
    };

    console.log("=== PROCESS FUNCTION SUCCESS ===");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify(response),
    };
  } catch (error) {
    console.error("=== PROCESS ERROR ===", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error",
      }),
    };
  }
};

export { handler };
