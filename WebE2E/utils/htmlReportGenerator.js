const fs = require('fs');
const path = require('path');

module.exports = function generateHTMLReport() {
    const outDir = path.join(__dirname, '..', 'Test_Results');
    const jsonPath = path.join(outDir, 'report-data.json');
    const htmlDir = path.join(outDir, 'HTML');
    const htmlPath = path.join(htmlDir, 'execution-report.html');

    if (!fs.existsSync(htmlDir)) {
        fs.mkdirSync(htmlDir, { recursive: true });
    }

    if (!fs.existsSync(jsonPath)) {
        console.error('[E2E] report-data.json not found, cannot generate HTML report.');
        return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E2E Execution Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #121212; color: #e0e0e0; margin: 0; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .stats { display: flex; justify-content: space-around; background: #1e1e1e; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
        .stat-box { text-align: center; }
        .stat-box h3 { margin: 0; font-size: 1.2rem; color: #aaaaaa; }
        .stat-box p { margin: 10px 0 0 0; font-size: 2rem; font-weight: bold; }
        .pass { color: #4caf50; }
        .fail { color: #f44336; }
        table { width: 100%; border-collapse: collapse; background: #1e1e1e; border-radius: 8px; overflow: hidden; }
        th, td { padding: 12px 15px; text-align: left; border-bottom: 1px solid #333; }
        th { background: #2c2c2c; font-weight: 600; }
        tr:hover { background: #2a2a2a; }
        .badge { padding: 4px 8px; border-radius: 4px; font-size: 0.85rem; font-weight: bold; }
        .badge-pass { background: #1b5e20; color: #a5d6a7; }
        .badge-fail { background: #b71c1c; color: #ef9a9a; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Mega Web E2E Test Execution Report</h1>
        <p>1,100 Assertions - Selenium Webdriver + Mocha</p>
    </div>
    
    <div class="stats">
        <div class="stat-box"><h3>Total Tests</h3><p>${data.total}</p></div>
        <div class="stat-box"><h3>Passed</h3><p class="pass">${data.totalPass}</p></div>
        <div class="stat-box"><h3>Failed</h3><p class="fail">${data.totalFail}</p></div>
        <div class="stat-box"><h3>Pass Rate</h3><p class="pass">${((data.totalPass / data.total) * 100).toFixed(2)}%</p></div>
    </div>

    <h2>Test Details</h2>
    <table>
        <thead>
            <tr>
                <th>Category</th>
                <th>Test Title</th>
                <th>Duration (ms)</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
            ${data.results.map(r => `
            <tr>
                <td>${r.category}</td>
                <td>${r.title}</td>
                <td>${r.duration}ms</td>
                <td><span class="badge ${r.state === 'Passed' ? 'badge-pass' : 'badge-fail'}">${r.state}</span></td>
            </tr>
            `).join('')}
        </tbody>
    </table>
</body>
</html>
    `;

    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`[E2E] HTML report successfully generated at ${htmlPath}`);
};
