const fs = require('fs');
const path = require('path');
const xlsxReporter = require('./xlsxReporter.js');

async function fallback() {
    console.log('[WDIO-Fallback] Generating fallback failure report due to fatal crash.');
    
    xlsxReporter.startRun();
    xlsxReporter.recordTest({
        category: 'Fatal Error',
        title: 'Appium / Emulator Boot Failure',
        passed: false,
        duration: 50,
        error: 'The Appium server failed to start, the emulator crashed, or WDIO timed out globally.'
    });
    
    await xlsxReporter.generateReport(path.join(__dirname, '..', 'execution-report.xlsx'));
    
    const generateHtmlReport = require('./generateHtmlReport.js');
    generateHtmlReport(path.join(__dirname, '..', 'execution-report.html'));
    
    const generateSummary = require('./generateSummary.js');
    if (process.env.GITHUB_STEP_SUMMARY) {
        generateSummary(process.env.GITHUB_STEP_SUMMARY);
    }
}

fallback();
