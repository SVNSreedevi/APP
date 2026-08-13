const exceljs = require('exceljs');

let testResults = [];
let totalPass = 0;
let totalFail = 0;
const typeSummary = {};

exports.startRun = function() {
    testResults = [];
    totalPass = 0;
    totalFail = 0;
};

exports.recordTest = function(data) {
    testResults.push({
        title: data.title,
        category: data.category,
        state: data.passed ? 'Passed' : 'Failed',
        duration: data.duration,
        error: data.error
    });
    
    if (data.passed) totalPass++;
    else totalFail++;

    if (!typeSummary[data.category]) {
        typeSummary[data.category] = { total: 0, pass: 0, fail: 0 };
    }
    typeSummary[data.category].total++;
    if (data.passed) typeSummary[data.category].pass++;
    else typeSummary[data.category].fail++;
};

exports.generateReport = async function(outputPath) {
    const workbook = new exceljs.Workbook();
    
    // Sheet 1: Summary Stats
    const sheet1 = workbook.addWorksheet('Summary');
    sheet1.columns = [
        { header: 'Metric', key: 'metric', width: 20 },
        { header: 'Value', key: 'value', width: 20 }
    ];
    sheet1.addRow({ metric: 'Total Tests', value: totalPass + totalFail });
    sheet1.addRow({ metric: 'Passed', value: totalPass });
    sheet1.addRow({ metric: 'Failed', value: totalFail });
    const passRate = ((totalPass / (totalPass + totalFail)) * 100).toFixed(2);
    sheet1.addRow({ metric: 'Pass Rate (%)', value: passRate });

    // Sheet 2: By Category
    const sheet2 = workbook.addWorksheet('By Category');
    sheet2.columns = [
        { header: 'Category', key: 'category', width: 40 },
        { header: 'Total Tests', key: 'total', width: 15 },
        { header: 'Passed', key: 'pass', width: 15 },
        { header: 'Failed', key: 'fail', width: 15 }
    ];
    for (const [cat, data] of Object.entries(typeSummary)) {
        sheet2.addRow({ category: cat, total: data.total, pass: data.pass, fail: data.fail });
    }

    // Sheet 3: Test Cases
    const sheet3 = workbook.addWorksheet('Test Cases');
    sheet3.columns = [
        { header: 'Category', key: 'category', width: 40 },
        { header: 'Test Title', key: 'title', width: 80 },
        { header: 'Status', key: 'state', width: 15 },
        { header: 'Duration (ms)', key: 'duration', width: 15 },
        { header: 'Error', key: 'error', width: 50 }
    ];
    testResults.forEach(r => sheet3.addRow(r));

    await workbook.xlsx.writeFile(outputPath);
    console.log(`[WDIO] Excel report generated at ${outputPath}`);
    
    // Cache data for HTML and Summary generator
    const fs = require('fs');
    fs.writeFileSync(outputPath.replace('.xlsx', '.json'), JSON.stringify({
        totalPass, totalFail, total: totalPass + totalFail,
        results: testResults,
        summary: typeSummary
    }));
};
