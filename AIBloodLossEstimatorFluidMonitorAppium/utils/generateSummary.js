const fs = require('fs');
const path = require('path');

module.exports = function(summaryFilePath) {
    const jsonPath = path.join(__dirname, '..', 'execution-report.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('[WDIO] No JSON data found for GHA summary.');
        return;
    }
    
    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    const passRate = ((data.totalPass / data.total) * 100).toFixed(2);
    const duration = (data.results.reduce((acc, curr) => acc + curr.duration, 0) / 1000).toFixed(2);
    const runNumber = process.env.GITHUB_RUN_NUMBER || 'Local';
    
    const summary = `### 📱 Appium Android E2E Execution Summary (Build #${runNumber})\n\n` +
      `| Metric | Value | Status |\n` +
      `| --- | --- | --- |\n` +
      `| **Total Tests** | ${data.total} | 📝 |\n` +
      `| **Passed** | ${data.totalPass} | ✅ |\n` +
      `| **Failed** | ${data.totalFail} | ${data.totalFail === 0 ? "➖" : "❌"} |\n` +
      `| **Pass Rate** | ${passRate}% | 🏆 |\n` +
      `| **Duration** | ${duration}s | ⏱️ |\n\n` +
      `🌐 **Native GitHub Pages Deployment**\n`;
      
    fs.appendFileSync(summaryFilePath, summary);
};
