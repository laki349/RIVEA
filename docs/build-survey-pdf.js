// docs/survey-print.html → 인쇄용 A4 PDF
// 실행: node docs/build-survey-pdf.js [출력경로]
const { execFileSync } = require("child_process");
const path = require("path");
const fs = require("fs");

const SRC = path.resolve(__dirname, "survey-print.html");
const OUT = path.resolve(
  process.argv[2] || path.join(__dirname, "RIVEA_설문지_20260817.pdf")
);

const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

execFileSync(CHROME, [
  "--headless",
  "--disable-gpu",
  "--no-pdf-header-footer",
  "--run-all-compositor-stages-before-draw",
  "--virtual-time-budget=4000",
  `--print-to-pdf=${OUT}`,
  `file://${SRC}`,
], { stdio: "inherit" });

console.log(`${OUT}  (${(fs.statSync(OUT).size / 1024).toFixed(0)} KB)`);
