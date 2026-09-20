import {
  buildInsights,
  buildConnections,
  buildTrendData,
} from "./data";

self.onmessage = (event) => {
  const { type, rows } = event.data || {};

  if (type !== "analyze") {
    return;
  }

  try {
    if (!Array.isArray(rows)) {
      throw new Error("Invalid dataset rows.");
    }

    const insights = buildInsights(rows);
    const connections = buildConnections(rows);
    const trends = buildTrendData(rows);

    self.postMessage({
      type: "analysis-complete",
      insights,
      connections,
      trends,
    });
  } catch (error) {
    self.postMessage({
      type: "analysis-error",
      message: error?.message || "Unable to analyze dataset.",
    });
  }
};