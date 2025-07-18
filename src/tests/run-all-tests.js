#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const tests = [
  {
    name: 'Holiday detection',
    file: 'test-holidays.js'
  },
  {
    name: 'Vacation calculation',
    file: 'vacation-calculation-test.js'
  },
  {
    name: 'Calendar data',
    file: 'calendar-data-test.js'
  },
  {
    name: 'Application logic',
    file: 'app-logic-test.js'
  },
  {
    name: 'Component tests',
    file: 'component-tests.js'
  },
  {
    name: 'Comprehensive suite',
    file: 'comprehensive-test-suite.js'
  }
];

console.log('🧪 RUNNING ALL TESTS FOR YEARLY CALENDAR');
console.log('=' .repeat(60));

let totalTests = 0;
let passedTests = 0;
let failedTests = 0;

async function runTest(testInfo) {
  return new Promise((resolve) => {
    console.log(`\n🔄 ${testInfo.name}:`);
    
    const testProcess = spawn('node', [join(__dirname, testInfo.file)], {
      stdio: 'inherit',
      cwd: dirname(__dirname)
    });

    testProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`✅ ${testInfo.name} PASSED`);
        passedTests++;
      } else {
        console.log(`❌ ${testInfo.name} FAILED`);
        failedTests++;
      }
      totalTests++;
      resolve();
    });
  });
}

async function runAllTests() {
  for (const test of tests) {
    await runTest(test);
  }

  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`Total tests: ${totalTests}`);
  console.log(`Passed: ${passedTests}`);
  console.log(`Failed: ${failedTests}`);
  console.log(`Success rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`);

  if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED!');
    console.log('✅ Calendar correctly calculates vacation days with respect to weekends, holidays and overlaps.');
  } else {
    console.log('\n⚠️  SOME TESTS FAILED!');
    console.log('❌ Logic needs further adjustments.');
  }
}

runAllTests().catch(console.error);
