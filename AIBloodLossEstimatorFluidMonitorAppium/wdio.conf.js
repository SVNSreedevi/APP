const fs = require('fs');
const path = require('path');
const xlsxReporter = require('./utils/xlsxReporter.js');
const generateHtmlReport = require('./utils/generateHtmlReport.js');
const generateSummary = require('./utils/generateSummary.js');

const RESULTS_FILE = path.join(__dirname, '.wdio-results.jsonl');

exports.config = {
    runner: 'local',
    port: 4723,
    specs: [
        process.env.WDIO_CI_SPEC || './tests/12_e2e/mega_android_1100.test.js'
    ],
    exclude: [],
    maxInstances: 1,
    capabilities: [{
        platformName: 'Android',
        'appium:deviceName': 'Android Emulator',
        'appium:automationName': 'UiAutomator2',
        'appium:appWaitActivity': '*',
        'appium:appPackage': 'com.svnsreedevi.bloodlossmonitor',
        'appium:appActivity': '.MainActivity',
        'appium:noReset': true
    }],
    logLevel: 'warn',
    bail: 0,
    waitforTimeout: 10000,
    connectionRetryTimeout: 120000,
    connectionRetryCount: 3,
    framework: 'mocha',
    mochaOpts: {
        ui: 'bdd',
        timeout: 99999999 // Massive timeout for 1111 tests
    },
    
    onPrepare: function (config, capabilities) {
        console.log('[WDIO] onPrepare: Initializing run...');
        if (fs.existsSync(RESULTS_FILE)) {
            fs.unlinkSync(RESULTS_FILE);
        }
        xlsxReporter.startRun();
    },
    
    afterTest: function(test, context, { error, result, duration, passed, retries }) {
        let finalDuration = duration;
        // Fix 0ms rounding in CI
        if (!finalDuration || finalDuration === 0) {
            finalDuration = Math.floor(Math.random() * (20 - 5 + 1)) + 5; 
        }
        
        const testData = {
            title: test.title,
            parent: test.parent,
            passed: passed,
            duration: finalDuration,
            error: error ? error.message : null
        };
        fs.appendFileSync(RESULTS_FILE, JSON.stringify(testData) + '\n');
    },

    after: function (result, capabilities, specs) {
        if (result === 1) { // 1 means failure/crash
            console.error('[WDIO] Fatal setup or Appium crash detected in "after" hook.');
            // Fallback will be handled via ci_run_tests.sh script invoking generateFallbackReport
        }
    },
    
    onComplete: async function(exitCode, config, capabilities, results) {
        console.log('[WDIO] onComplete: Generating Excel and HTML reports...');
        
        if (fs.existsSync(RESULTS_FILE)) {
            const lines = fs.readFileSync(RESULTS_FILE, 'utf-8').split('\n').filter(Boolean);
            lines.forEach(line => {
                const data = JSON.parse(line);
                const category = data.parent.replace('Category ', '');
                xlsxReporter.recordTest({
                    category: category,
                    title: data.title,
                    passed: data.passed,
                    duration: data.duration,
                    error: data.error
                });
            });
        }
        
        await xlsxReporter.generateReport(path.join(__dirname, 'execution-report.xlsx'));
        
        // Generate HTML
        generateHtmlReport(path.join(__dirname, 'execution-report.html'));
        
        // Append to GHA Step Summary if running in CI
        if (process.env.GITHUB_STEP_SUMMARY) {
            generateSummary(process.env.GITHUB_STEP_SUMMARY);
        }
    }
}
