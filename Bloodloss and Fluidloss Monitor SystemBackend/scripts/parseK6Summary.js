const fs = require('fs');
const path = require('path');

const summaryPath = path.join(process.cwd(), 'summary.json');

if (!fs.existsSync(summaryPath)) {
  console.error('Error: summary.json not found!');
  process.exit(1);
}

const summaryData = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));

// Defensive utility to extract metric values gracefully
function getMetricValue(metricObj, key) {
  if (!metricObj) return 'N/A';
  if (metricObj.values && metricObj.values[key] !== undefined) {
    return metricObj.values[key];
  }
  if (metricObj[key] !== undefined) {
    return metricObj[key];
  }
  return 'N/A';
}

function formatRate(value) {
  if (value === 'N/A') return value;
  return (value * 100).toFixed(2) + '%';
}

function formatFloat(value) {
  if (value === 'N/A') return value;
  return parseFloat(value).toFixed(2);
}

const metrics = summaryData.metrics || {};

const totalRequests = getMetricValue(metrics.http_reqs, 'count');
const rps = getMetricValue(metrics.http_reqs, 'rate');

const durationAvg = getMetricValue(metrics.http_req_duration, 'avg');
const durationMin = getMetricValue(metrics.http_req_duration, 'min');
const durationMax = getMetricValue(metrics.http_req_duration, 'max');
const durationP95 = getMetricValue(metrics.http_req_duration, 'p(95)');

const failureRate = getMetricValue(metrics.http_req_failed, 'rate');
const checksRate = getMetricValue(metrics.checks, 'rate');

const markdownContent = `
## 🚀 k6 Load Testing Executive Summary

| Metric | Value |
|--------|-------|
| **Total Requests Sent** | ${totalRequests} |
| **Throughput (RPS)** | ${formatFloat(rps)} req/s |
| **Average Latency** | ${formatFloat(durationAvg)} ms |
| **Minimum Latency** | ${formatFloat(durationMin)} ms |
| **Maximum Latency** | ${formatFloat(durationMax)} ms |
| **p(95) Latency** | ${formatFloat(durationP95)} ms |
| **Request Failure Rate** | ${formatRate(failureRate)} |
| **Assertions (Checks) Pass Rate** | ${formatRate(checksRate)} |

*Load test executed with 100 Virtual Users over a duration of 1 minute.*
`;

console.log(markdownContent);

const summaryFile = process.env.GITHUB_STEP_SUMMARY;
if (summaryFile) {
  fs.appendFileSync(summaryFile, markdownContent);
  console.log('Successfully wrote summary to GITHUB_STEP_SUMMARY');
} else {
  console.log('GITHUB_STEP_SUMMARY not set in environment.');
}
