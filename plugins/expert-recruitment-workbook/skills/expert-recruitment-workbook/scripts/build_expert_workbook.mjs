import fs from "node:fs/promises";
import path from "node:path";
import { SpreadsheetFile, Workbook } from "@oai/artifact-tool";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i += 1) {
    const key = argv[i];
    if (!key.startsWith("--")) continue;
    args[key.slice(2)] = argv[i + 1];
    i += 1;
  }
  return args;
}

function cleanSheetName(value) {
  const cleaned = String(value || "专家招募")
    .replace(/[\\/?*\[\]:]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return (cleaned || "专家招募").slice(0, 31);
}

function text(value, fallback = "") {
  if (value === undefined || value === null) return fallback;
  return String(value).trim();
}

function normalizeExpert(expert, index) {
  return [
    index + 1,
    text(expert.company),
    text(expert.position),
    text(expert.rate),
    text(expert.source),
    text(expert.availability, "待定") || "待定",
    text(expert.background),
    text(expert.feedback),
    text(expert.notes),
  ];
}

function rowHeightFor(row) {
  const maxLength = Math.max(...row.slice(6).map((value) => String(value || "").length), 0);
  const lines = Math.ceil(maxLength / 48);
  return Math.min(300, Math.max(96, 72 + lines * 18));
}

const args = parseArgs(process.argv);
if (!args.input) {
  throw new Error("Missing required argument: --input <json-file>");
}

const inputPath = path.resolve(args.input);
const payload = JSON.parse(await fs.readFile(inputPath, "utf8"));
if (!Array.isArray(payload.experts) || payload.experts.length === 0) {
  throw new Error("Input JSON must contain a non-empty experts array.");
}

const title = text(payload.title, "专家招募表") || "专家招募表";
const subtitle = text(payload.subtitle, "访谈方向：以用户提供的招募文案为准");
const sheetName = cleanSheetName(payload.sheetName || title.replace(/｜.*$/, ""));
const questions = Array.isArray(payload.questions) ? payload.questions.map((item) => text(item)).filter(Boolean) : [];
const experts = payload.experts.map(normalizeExpert);
const columns = ["序号", "公司", "职位", "费率", "推荐方", "可访谈时间", "专家背景", "话题反馈", "备注"];

const outputPath = path.resolve(args.output || payload.outputPath || "expert-recruitment-workbook.xlsx");
const outputBase = outputPath.replace(/\.xlsx$/i, "");
const previewPath = path.resolve(args.preview || payload.previewPath || `${outputBase}.png`);
const inspectionPath = `${outputPath}.inspect.ndjson`;

const wb = Workbook.create();
wb.comments.setSelf({ displayName: "User" });
const sheet = wb.worksheets.add(sheetName);
sheet.showGridLines = false;

const widths = [54, 185, 205, 175, 82, 145, 420, 520, 255];
widths.forEach((px, index) => {
  sheet.getRangeByIndexes(0, index, 1, 1).format.columnWidthPx = px;
});

sheet.mergeCells("A1:I1");
sheet.getRange("A1").values = [[title]];
sheet.getRange("A1:I1").format = {
  fill: "#163A5F",
  font: { bold: true, color: "#FFFFFF", size: 18, name: "Microsoft YaHei" },
  horizontalAlignment: "left",
  verticalAlignment: "center",
  rowHeightPx: 42,
};

sheet.mergeCells("A2:I2");
sheet.getRange("A2").values = [[subtitle]];
sheet.getRange("A2:I2").format = {
  fill: "#DCEAF5",
  font: { bold: true, color: "#163A5F", size: 11, name: "Microsoft YaHei" },
  verticalAlignment: "center",
  wrapText: true,
  rowHeightPx: 34,
};

const questionStart = 3;
questions.forEach((question, index) => {
  const row = questionStart + index;
  sheet.mergeCells(`A${row}:I${row}`);
  sheet.getRange(`A${row}`).values = [[question]];
  sheet.getRange(`A${row}:I${row}`).format = {
    fill: index % 2 === 0 ? "#F3F7FA" : "#FFFFFF",
    font: { color: "#263238", size: 10, name: "Microsoft YaHei" },
    wrapText: true,
    verticalAlignment: "center",
    rowHeightPx: Math.min(100, Math.max(38, 28 + Math.ceil(question.length / 90) * 18)),
    borders: { preset: "outside", style: "thin", color: "#CFD8DC" },
  };
});

const sectionRow = questionStart + questions.length + 1;
const headerRow = sectionRow + 1;
const dataStart = headerRow + 1;
const dataEnd = dataStart + experts.length - 1;

sheet.mergeCells(`A${sectionRow}:I${sectionRow}`);
sheet.getRange(`A${sectionRow}`).values = [[`候选专家（共 ${experts.length} 位）`]];
sheet.getRange(`A${sectionRow}:I${sectionRow}`).format = {
  fill: "#2F718E",
  font: { bold: true, color: "#FFFFFF", size: 12, name: "Microsoft YaHei" },
  verticalAlignment: "center",
  rowHeightPx: 30,
};

sheet.getRange(`A${headerRow}:I${headerRow}`).values = [columns];
sheet.getRange(`A${dataStart}:I${dataEnd}`).values = experts;
const table = sheet.tables.add(`A${headerRow}:I${dataEnd}`, true, "ExpertRecruitmentTable");
table.style = "TableStyleMedium2";
table.showFilterButton = true;

sheet.getRange(`A${headerRow}:I${headerRow}`).format = {
  fill: "#2F718E",
  font: { bold: true, color: "#FFFFFF", size: 10, name: "Microsoft YaHei" },
  horizontalAlignment: "center",
  verticalAlignment: "center",
  rowHeightPx: 34,
  wrapText: true,
  borders: { preset: "all", style: "thin", color: "#D4E1E8" },
};

sheet.getRange(`A${dataStart}:I${dataEnd}`).format = {
  font: { color: "#263238", size: 10, name: "Microsoft YaHei" },
  verticalAlignment: "top",
  wrapText: true,
  borders: {
    insideHorizontal: { style: "thin", color: "#DDE5E9" },
    bottom: { style: "thin", color: "#B0BEC5" },
  },
};
experts.forEach((row, index) => {
  sheet.getRange(`${dataStart + index}:${dataStart + index}`).format.rowHeightPx = rowHeightFor(row);
});
sheet.getRange(`A${dataStart}:A${dataEnd}`).format.horizontalAlignment = "center";
sheet.getRange(`D${dataStart}:F${dataEnd}`).format.horizontalAlignment = "center";
sheet.getRange(`I${dataStart}:I${dataEnd}`).format.fill = "#FFF8E1";
sheet.freezePanes.freezeRows(headerRow);
sheet.freezePanes.freezeColumns(2);

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.mkdir(path.dirname(previewPath), { recursive: true });

const preview = await wb.render({ sheetName, autoCrop: "all", scale: 0.8, format: "png" });
await fs.writeFile(previewPath, new Uint8Array(await preview.arrayBuffer()));

const inspection = await wb.inspect({
  kind: "table",
  range: `${sheetName}!A1:I${dataEnd}`,
  include: "values,formulas",
  tableMaxRows: dataEnd + 2,
  tableMaxCols: 9,
  tableMaxCellChars: 180,
});
const formulaErrors = await wb.inspect({
  kind: "match",
  searchTerm: "#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A",
  options: { useRegex: true, maxResults: 100 },
  summary: "final formula error scan",
});

const xlsx = await SpreadsheetFile.exportXlsx(wb);
await xlsx.save(outputPath);
await fs.writeFile(
  inspectionPath,
  JSON.stringify({ inspection: inspection.ndjson, formulaErrors: formulaErrors.ndjson }, null, 2),
  "utf8",
);

console.log(JSON.stringify({
  outputPath,
  previewPath,
  inspectionPath,
  expertRows: experts.length,
  sheetName,
  dataEnd,
  formulaErrors: formulaErrors.ndjson,
}, null, 2));

