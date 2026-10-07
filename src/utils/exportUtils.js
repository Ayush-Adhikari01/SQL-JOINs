import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { JOIN_TYPES, executeJoin } from "./joinEngine";

/**
 * Generates and downloads comprehensive PDF execution report
 * 100% dynamically derived from the visualizer state at the moment of export.
 */
export function generatePDFReport({
  joinResult,
  tableA,
  tableB,
  joinType = "INNER",
  keyA,
  keyB,
  customNotes = ""
}) {
  // If joinResult is missing or stale, calculate dynamically on the fly
  let computed = joinResult;
  if (!computed || !computed.resultRows || !computed.stats) {
    computed = executeJoin({
      tableA,
      tableB,
      joinType,
      keyA,
      keyB
    });
  }

  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const primaryColor = [15, 23, 42]; // slate-900
  const accentColor = [59, 130, 246]; // blue-500
  const lightBg = [248, 250, 252]; // slate-50
  const metaJoin = JOIN_TYPES.find(j => j.id === joinType) || {
    name: `${joinType} JOIN`,
    symbol: "⋈",
    algebra: `TableA ⋈ TableB`
  };

  // Header Banner
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, 210, 36, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.text("JOIN OPERATIONS VISUALIZER", 14, 15);

  doc.setFontSize(9.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(203, 213, 225);
  doc.text("Relational Algebra & Dynamic SQL Query Execution Report", 14, 22);
  doc.text(`Generated: ${new Date().toLocaleString()} | Operation: ${joinType} JOIN`, 14, 28);

  // Guide, Mentor and Academic Credits Box
  let y = 42;
  doc.setFillColor(...lightBg);
  doc.roundedRect(14, y, 182, 30, 2, 2, "F");
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, y, 182, 30, 2, 2, "D");

  doc.setFontSize(8.5);
  doc.setTextColor(51, 65, 85);
  doc.setFont("helvetica", "bold");
  doc.text("Project Team: Team Kapa (DBMS Digital Assignment)", 18, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text("Members: Ayush Adhikari (25BCE5324) | Parth Malik (25BCE5386) | Keshav Agarwal (25BCE5503)", 18, y + 12);
  doc.text("Faculty Guidance: Dr. Swaminathan A (Assistant Professor, Database Systems & CS)", 18, y + 18);
  
  // Dynamic predicate text
  const predicateText = joinType === "CROSS" 
    ? "Cartesian Product (No ON condition: A × B)"
    : joinType === "NATURAL"
    ? `Natural Equality on Shared Column Names`
    : `ON [${tableA.name}.${keyA || 'N/A'}] = [${tableB.name}.${keyB || 'N/A'}]`;

  doc.setFont("helvetica", "bold");
  doc.text(`Active Join Predicate: `, 18, y + 24);
  doc.setFont("courier", "bold");
  doc.text(predicateText, 57, y + 24);

  // Section 1: Execution Summary Metrics & Relational Algebra
  y += 36;
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("1. Relational Algebra Formulation & Metrics", 14, y);

  y += 4;
  const stats = computed?.stats || {};
  const algebraFormula = metaJoin.algebra
    ? metaJoin.algebra
        .replace("TableA", tableA.name)
        .replace("TableB", tableB.name)
        .replace("A.key", `${tableA.name}.${keyA}`)
        .replace("B.key", `${tableB.name}.${keyB}`)
    : `${tableA.name} ${metaJoin.symbol} ${tableB.name}`;

  const summaryRows = [
    ["Operation Selected", `${metaJoin.name} (${metaJoin.symbol})`],
    ["Formal Relational Algebra", algebraFormula],
    ["Left Relation (Table A)", `${tableA.name} (${tableA.rows?.length || 0} tuples, ${tableA.columns?.length || 0} attributes)`],
    ["Right Relation (Table B)", `${tableB.name} (${tableB.rows?.length || 0} tuples, ${tableB.columns?.length || 0} attributes)`],
    ["Join Predicate / Key Condition", predicateText],
    ["Total Synthesized Tuples", `${stats.rowCount || 0} records`],
    ["Matched Record Pairs", `${stats.matchedCount || 0} pairs`],
    ["Unmatched Left Tuples", `${stats.unmatchedLeftCount || 0} tuples (${joinType === 'LEFT' || joinType === 'FULL' ? 'Preserved with NULL' : 'Excluded'})`],
    ["Unmatched Right Tuples", `${stats.unmatchedRightCount || 0} tuples (${joinType === 'RIGHT' || joinType === 'FULL' ? 'Preserved with NULL' : 'Excluded'})`],
    ["In-Memory Execution Time", `${stats.executionTimeMs || 0.05} ms`]
  ];

  autoTable(doc, {
    startY: y + 2,
    head: [["Evaluation Parameter", "Evaluated Value"]],
    body: summaryRows,
    theme: "striped",
    headStyles: { fillColor: [30, 41, 59], fontSize: 8.5 },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 65 } },
    margin: { left: 14, right: 14 }
  });

  y = doc.lastAutoTable.finalY + 10;

  // Section 2: Generated ANSI SQL Query
  if (y > 225) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("2. Dynamic ANSI-Compliant SQL Query", 14, y);

  y += 4;
  const sqlLines = (computed?.sqlQuery || "SELECT *;").split("\n");
  const sqlBoxHeight = Math.max(16, 6 + sqlLines.length * 4.5);
  doc.setFillColor(15, 23, 42);
  doc.roundedRect(14, y, 182, sqlBoxHeight, 2, 2, "F");
  doc.setTextColor(241, 245, 249);
  doc.setFont("courier", "normal");
  doc.setFontSize(8);

  sqlLines.forEach((line, idx) => {
    doc.text(line, 18, y + 5 + idx * 4.5);
  });

  y += sqlBoxHeight + 8;

  // Section 3: Step-by-Step Operational Walkthrough
  if (y > 220) {
    doc.addPage();
    y = 20;
  }

  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("3. Relational Execution Logic Walkthrough", 14, y);

  const stepsData = (computed?.steps || []).map(s => [
    `Step ${s.stepNumber}`,
    s.title,
    s.description
  ]);

  autoTable(doc, {
    startY: y + 3,
    head: [["Step", "Phase", "Operational Explanation"]],
    body: stepsData,
    theme: "grid",
    headStyles: { fillColor: [59, 130, 246], fontSize: 8 },
    bodyStyles: { fontSize: 7.5 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 20 }, 1: { fontStyle: "bold", cellWidth: 45 } },
    margin: { left: 14, right: 14 }
  });

  // Section 4: Final Computed Result Dataset
  doc.addPage();
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...primaryColor);
  doc.text("4. Synthesized Result Dataset (Step 5 Output)", 14, 18);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Total Records: ${computed?.resultRows?.length || 0} | NULL representations are formally indicated.`, 14, 24);

  const resultHeaders = (computed?.resultColumns || []).map(col => col.label);
  const resultRows = (computed?.resultRows || []).map(row => {
    return (computed?.resultColumns || []).map(col => {
      const val = row[col.key];
      return val === null || val === undefined ? "NULL" : String(val);
    });
  });

  autoTable(doc, {
    startY: 28,
    head: [resultHeaders],
    body: resultRows,
    theme: "striped",
    headStyles: { fillColor: [15, 118, 110], fontSize: 8 },
    bodyStyles: { fontSize: 7.5 },
    margin: { left: 14, right: 14 },
    didParseCell: (data) => {
      if (data.section === "body" && data.cell.raw === "NULL") {
        data.cell.styles.textColor = [239, 68, 68]; // red for NULL
        data.cell.styles.fontStyle = "bold";
      }
    }
  });

  // Footer on each page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Join Operations Visualizer | Team Kapa (Ayush Adhikari, Parth Malik, Keshav Agarwal) | Page ${i} of ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }

  const filename = `Join_Operations_Report_${joinType}_${Date.now()}.pdf`;
  doc.save(filename);
}

/**
 * Generates and downloads CSV format of the result dataset
 */
export function generateCSVReport({ joinResult, joinType }) {
  if (!joinResult || !joinResult.resultColumns || !joinResult.resultRows) return;

  const headers = joinResult.resultColumns.map(c => `"${c.label}"`).join(",");
  const rows = joinResult.resultRows.map(row => {
    return joinResult.resultColumns.map(col => {
      const val = row[col.key];
      if (val === null || val === undefined) return '"NULL"';
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(",");
  });

  const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `join_result_${joinType.toLowerCase()}_${Date.now()}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Generates and downloads SQL file
 */
export function generateSQLFile({ joinResult, joinType }) {
  if (!joinResult || !joinResult.sqlQuery) return;

  const header = `-- ==================================================\n` +
    `-- JOIN OPERATIONS VISUALIZER - SQL EXPORT\n` +
    `-- Team Kapa (Ayush Adhikari, Parth Malik, Keshav Agarwal)\n` +
    `-- Operation: ${joinType} JOIN\n` +
    `-- Date: ${new Date().toISOString()}\n` +
    `-- ==================================================\n\n`;

  const blob = new Blob([header + joinResult.sqlQuery], { type: "text/sql;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `query_${joinType.toLowerCase()}_${Date.now()}.sql`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
