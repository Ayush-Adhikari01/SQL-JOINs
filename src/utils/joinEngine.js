/**
 * Core SQL Join Computation Engine
 * Supports: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF, and NATURAL joins.
 * Computes execution stats, step-by-step logs, match maps, and SQL query representations.
 */

export const JOIN_TYPES = [
  {
    id: "INNER",
    name: "INNER JOIN",
    badge: "Most Common",
    symbol: "⋈",
    algebra: "TableA ⋈_{A.key = B.key} TableB",
    summary: "Returns only the tuples where the join condition evaluates to TRUE in both tables.",
    description: "Evaluates the Cartesian product and filters out any records where keys do not match. NULL keys never match.",
    diagramColor: "text-emerald-500 bg-emerald-500/10 border-emerald-500"
  },
  {
    id: "LEFT",
    name: "LEFT OUTER JOIN",
    badge: "Preserves Left",
    symbol: "⟕",
    algebra: "TableA ⟕_{A.key = B.key} TableB",
    summary: "Returns all tuples from the left table, plus matched tuples from the right table. Fills with NULLs if no match exists.",
    description: "Guarantees no records from Table A are lost. If an A row has no counterpart in B, all B columns receive NULL.",
    diagramColor: "text-blue-500 bg-blue-500/10 border-blue-500"
  },
  {
    id: "RIGHT",
    name: "RIGHT OUTER JOIN",
    badge: "Preserves Right",
    symbol: "⟖",
    algebra: "TableA ⟖_{A.key = B.key} TableB",
    summary: "Returns all tuples from the right table, plus matched tuples from the left table. Fills with NULLs if no match exists.",
    description: "Guarantees no records from Table B are lost. If a B row has no counterpart in A, all A columns receive NULL.",
    diagramColor: "text-violet-500 bg-violet-500/10 border-violet-500"
  },
  {
    id: "FULL",
    name: "FULL OUTER JOIN",
    badge: "Preserves All",
    symbol: "⟗",
    algebra: "TableA ⟗_{A.key = B.key} TableB",
    summary: "Returns all records when there is a match in either left or right table records. Retains unmatched records from both sides.",
    description: "A union of LEFT JOIN and RIGHT JOIN. Unmatched rows from both sides are preserved and padded with NULL values.",
    diagramColor: "text-amber-500 bg-amber-500/10 border-amber-500"
  },
  {
    id: "CROSS",
    name: "CROSS JOIN",
    badge: "Cartesian Product",
    symbol: "⨯",
    algebra: "TableA × TableB",
    summary: "Produces the complete Cartesian product of both tables. Every row of A is paired with every row of B.",
    description: "No ON condition is applied. If Table A has N rows and Table B has M rows, output size is exactly N × M.",
    diagramColor: "text-rose-500 bg-rose-500/10 border-rose-500"
  },
  {
    id: "SELF",
    name: "SELF JOIN",
    badge: "Unary Hierarchy",
    symbol: "⟲ ⋈",
    algebra: "TableA₁ ⋈ TableA₂",
    summary: "A regular join in which a table is joined with itself using table aliases to model hierarchical or reflexive relationships.",
    description: "Typically employed for parent-child relationships, such as finding an employee's direct manager or peer comparisons.",
    diagramColor: "text-cyan-500 bg-cyan-500/10 border-cyan-500"
  },
  {
    id: "NATURAL",
    name: "NATURAL JOIN",
    badge: "Implicit Keys",
    symbol: "⋈ ≍",
    algebra: "TableA ⋈ TableB",
    summary: "Automatically joins tables based on all columns having the exact same column name and compatible data types.",
    description: "Does not require an explicit ON clause. Eliminates redundant duplicate join columns from the final projected schema.",
    diagramColor: "text-teal-500 bg-teal-500/10 border-teal-500"
  }
];

/**
 * Execute join operation dynamically based on user parameters
 */
export function executeJoin({
  tableA,
  tableB,
  joinType = "INNER",
  keyA,
  keyB,
  isSelfJoin = false
}) {
  const startTime = performance.now();
  const errors = [];
  const warnings = [];

  // Validation
  if (!tableA || !tableA.rows || !tableA.columns) {
    errors.push("Table A is invalid or not initialized.");
  }
  if (!tableB || !tableB.rows || !tableB.columns) {
    errors.push("Table B is invalid or not initialized.");
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      warnings,
      resultColumns: [],
      resultRows: [],
      steps: [],
      stats: { executionTimeMs: 0, rowCount: 0, comparisonsCount: 0 }
    };
  }

  // Handle Natural Join key deduction
  let effectiveKeyA = keyA;
  let effectiveKeyB = keyB;

  if (joinType === "NATURAL") {
    const commonCols = tableA.columns
      .map(c => c.name)
      .filter(colName => tableB.columns.some(bc => bc.name.toLowerCase() === colName.toLowerCase()));

    if (commonCols.length === 0) {
      warnings.push("No common column names found between tables. NATURAL JOIN degraded to Cartesian CROSS JOIN.");
      effectiveKeyA = null;
      effectiveKeyB = null;
    } else {
      effectiveKeyA = commonCols[0];
      const matchedB = tableB.columns.find(bc => bc.name.toLowerCase() === effectiveKeyA.toLowerCase());
      effectiveKeyB = matchedB ? matchedB.name : effectiveKeyA;
    }
  }

  if (joinType !== "CROSS" && !(joinType === "NATURAL" && !effectiveKeyA)) {
    if (!effectiveKeyA) {
      errors.push("Please select a join key for Table A.");
    }
    if (!effectiveKeyB) {
      errors.push("Please select a join key for Table B.");
    }
  }

  if (errors.length > 0) {
    return {
      success: false,
      errors,
      warnings,
      resultColumns: [],
      resultRows: [],
      steps: [],
      stats: { executionTimeMs: 0, rowCount: 0, comparisonsCount: 0 }
    };
  }

  // Determine Output Columns Schema
  const resultColumns = [];
  const aliasA = tableA.alias || "a";
  const aliasB = tableB.alias || "b";

  tableA.columns.forEach(col => {
    resultColumns.push({
      key: `a_${col.name}`,
      originalName: col.name,
      origin: "A",
      tableName: tableA.name,
      label: `${aliasA}.${col.name}`,
      type: col.type || "string"
    });
  });

  tableB.columns.forEach(col => {
    // If Natural join matches column, SQL Natural join projects only once
    const isNaturalDuplicate = joinType === "NATURAL" && effectiveKeyA && col.name.toLowerCase() === effectiveKeyB.toLowerCase();
    if (!isNaturalDuplicate) {
      resultColumns.push({
        key: `b_${col.name}`,
        originalName: col.name,
        origin: "B",
        tableName: tableB.name,
        label: `${aliasB}.${col.name}`,
        type: col.type || "string"
      });
    }
  });

  const steps = [];
  steps.push({
    stepNumber: 1,
    title: "Read Source Relations",
    description: `Loaded Table A "${tableA.name}" (${tableA.rows.length} rows) and Table B "${tableB.name}" (${tableB.rows.length} rows).`,
    details: `Relational schema parsed: A has ${tableA.columns.length} attributes, B has ${tableB.columns.length} attributes.`
  });

  steps.push({
    stepNumber: 2,
    title: "Identify Join Predicate & Keys",
    description: joinType === "CROSS"
      ? "Cartesian product selected. No join predicate required (every tuple of A matches every tuple of B)."
      : `Join condition set: ${aliasA}.${effectiveKeyA} = ${aliasB}.${effectiveKeyB}`,
    details: `Comparing equality on column "${effectiveKeyA}" from Table A against "${effectiveKeyB}" from Table B.`
  });

  const matchedARowIndices = new Set();
  const matchedBRowIndices = new Set();
  const resultRows = [];
  let comparisonsCount = 0;
  const matchPairs = []; // For visual diagram and row connecting lines

  // Main evaluation logic
  if (joinType === "CROSS") {
    steps.push({
      stepNumber: 3,
      title: "Compute Cartesian Product",
      description: `Iterating over all ${tableA.rows.length} × ${tableB.rows.length} = ${tableA.rows.length * tableB.rows.length} combinations.`,
      details: "Generating combined tuple pairs without filtering."
    });

    tableA.rows.forEach((rowA, idxA) => {
      tableB.rows.forEach((rowB, idxB) => {
        comparisonsCount++;
        const combined = {};
        tableA.columns.forEach(col => {
          combined[`a_${col.name}`] = rowA[col.name];
        });
        tableB.columns.forEach(col => {
          combined[`b_${col.name}`] = rowB[col.name];
        });
        combined._meta = {
          originAIndex: idxA,
          originBIndex: idxB,
          matchStatus: "cross_product",
          rowId: `cross_${idxA}_${idxB}`
        };
        resultRows.push(combined);
        matchPairs.push({ indexA: idxA, indexB: idxB, type: "cross" });
      });
    });
  } else {
    steps.push({
      stepNumber: 3,
      title: "Evaluate Join Predicate (Nested Loop Scan)",
      description: `Scanning Table A tuples and probing Table B for matches on key equality.`,
      details: `Comparing values while treating SQL NULL as non-matching (three-valued logic: NULL = NULL evaluates to UNKNOWN/FALSE).`
    });

    tableA.rows.forEach((rowA, idxA) => {
      const valA = rowA[effectiveKeyA];
      let rowAMatched = false;

      tableB.rows.forEach((rowB, idxB) => {
        comparisonsCount++;
        const valB = rowB[effectiveKeyB];

        // SQL Join Equality: NULL never matches NULL
        const isMatch = (valA !== null && valA !== undefined && valB !== null && valB !== undefined) &&
          (String(valA).trim().toLowerCase() === String(valB).trim().toLowerCase());

        if (isMatch) {
          rowAMatched = true;
          matchedARowIndices.add(idxA);
          matchedBRowIndices.add(idxB);

          const combined = {};
          tableA.columns.forEach(col => {
            combined[`a_${col.name}`] = rowA[col.name];
          });
          tableB.columns.forEach(col => {
            if (!(joinType === "NATURAL" && col.name.toLowerCase() === effectiveKeyB.toLowerCase())) {
              combined[`b_${col.name}`] = rowB[col.name];
            }
          });

          combined._meta = {
            originAIndex: idxA,
            originBIndex: idxB,
            matchStatus: "matched",
            keyValue: valA,
            rowId: `matched_${idxA}_${idxB}`
          };

          resultRows.push(combined);
          matchPairs.push({ indexA: idxA, indexB: idxB, type: "matched", keyVal: valA });
        }
      });

      // Handle Left Outer preservation
      if (!rowAMatched && (joinType === "LEFT" || joinType === "FULL")) {
        const combined = {};
        tableA.columns.forEach(col => {
          combined[`a_${col.name}`] = rowA[col.name];
        });
        tableB.columns.forEach(col => {
          if (!(joinType === "NATURAL" && col.name.toLowerCase() === effectiveKeyB.toLowerCase())) {
            combined[`b_${col.name}`] = null;
          }
        });
        combined._meta = {
          originAIndex: idxA,
          originBIndex: null,
          matchStatus: "unmatched_left",
          keyValue: valA,
          rowId: `left_unmatched_${idxA}`
        };
        resultRows.push(combined);
      }
    });

    // Handle Right Outer preservation
    if (joinType === "RIGHT" || joinType === "FULL") {
      tableB.rows.forEach((rowB, idxB) => {
        if (!matchedBRowIndices.has(idxB)) {
          const combined = {};
          tableA.columns.forEach(col => {
            combined[`a_${col.name}`] = null;
          });
          tableB.columns.forEach(col => {
            if (!(joinType === "NATURAL" && col.name.toLowerCase() === effectiveKeyB.toLowerCase())) {
              combined[`b_${col.name}`] = rowB[col.name];
            }
          });
          combined._meta = {
            originAIndex: null,
            originBIndex: idxB,
            matchStatus: "unmatched_right",
            keyValue: rowB[effectiveKeyB],
            rowId: `right_unmatched_${idxB}`
          };
          resultRows.push(combined);
        }
      });
    }
  }

  steps.push({
    stepNumber: 4,
    title: "Apply Null Extension & Outer Filtering",
    description: `Applied ${joinType} rule. ${matchedARowIndices.size} rows matched from A, ${matchedBRowIndices.size} rows matched from B.`,
    details: `${tableA.rows.length - matchedARowIndices.size} unmatched in A, ${tableB.rows.length - matchedBRowIndices.size} unmatched in B.`
  });

  steps.push({
    stepNumber: 5,
    title: "Construct Result Dataset",
    description: `Synthesized final relation containing ${resultRows.length} tuples and ${resultColumns.length} projected attributes.`,
    details: `Successfully completed join execution in ${(performance.now() - startTime).toFixed(2)} ms.`
  });

  const endTime = performance.now();
  const executionTimeMs = parseFloat((endTime - startTime).toFixed(3));

  // Generated SQL Query
  const sqlQuery = generateSQLQuery({
    tableA,
    tableB,
    joinType,
    keyA: effectiveKeyA,
    keyB: effectiveKeyB
  });

  return {
    success: true,
    joinType,
    tableA,
    tableB,
    keyA: effectiveKeyA,
    keyB: effectiveKeyB,
    resultColumns,
    resultRows,
    matchPairs,
    matchedAIndices: Array.from(matchedARowIndices),
    matchedBIndices: Array.from(matchedBRowIndices),
    unmatchedAIndices: tableA.rows.map((_, i) => i).filter(i => !matchedARowIndices.has(i)),
    unmatchedBIndices: tableB.rows.map((_, i) => i).filter(i => !matchedBRowIndices.has(i)),
    steps,
    sqlQuery,
    warnings,
    errors: [],
    stats: {
      executionTimeMs,
      rowCount: resultRows.length,
      tableARows: tableA.rows.length,
      tableBRows: tableB.rows.length,
      comparisonsCount,
      matchedCount: matchPairs.length,
      unmatchedLeftCount: tableA.rows.length - matchedARowIndices.size,
      unmatchedRightCount: tableB.rows.length - matchedBRowIndices.size
    }
  };
}

/**
 * Generates formatted SQL representation
 */
export function generateSQLQuery({
  tableA,
  tableB,
  joinType,
  keyA,
  keyB
}) {
  const aliasA = tableA.alias || tableA.name.charAt(0).toLowerCase();
  const aliasB = tableB.alias || (tableA.name === tableB.name ? `${tableB.name.charAt(0).toLowerCase()}2` : tableB.name.charAt(0).toLowerCase());

  let joinKeyword = "INNER JOIN";
  if (joinType === "LEFT") joinKeyword = "LEFT OUTER JOIN";
  else if (joinType === "RIGHT") joinKeyword = "RIGHT OUTER JOIN";
  else if (joinType === "FULL") joinKeyword = "FULL OUTER JOIN";
  else if (joinType === "CROSS") joinKeyword = "CROSS JOIN";
  else if (joinType === "SELF") joinKeyword = "INNER JOIN";
  else if (joinType === "NATURAL") joinKeyword = "NATURAL JOIN";

  // Select attribute list
  const projectedCols = [];
  tableA.columns.forEach(col => {
    projectedCols.push(`    ${aliasA}.${col.name}`);
  });
  tableB.columns.forEach(col => {
    if (!(joinType === "NATURAL" && col.name.toLowerCase() === (keyB || "").toLowerCase())) {
      projectedCols.push(`    ${aliasB}.${col.name}`);
    }
  });

  const selectClause = `SELECT\n${projectedCols.join(",\n")}`;
  const fromClause = `FROM ${tableA.name} ${aliasA}`;

  let onClause = "";
  if (joinType === "CROSS") {
    return `${selectClause}\n${fromClause}\nCROSS JOIN ${tableB.name} ${aliasB};`;
  }
  if (joinType === "NATURAL") {
    return `${selectClause}\n${fromClause}\nNATURAL JOIN ${tableB.name} ${aliasB};`;
  }

  onClause = `    ON ${aliasA}.${keyA} = ${aliasB}.${keyB}`;
  return `${selectClause}\n${fromClause}\n${joinKeyword} ${tableB.name} ${aliasB}\n${onClause};`;
}
