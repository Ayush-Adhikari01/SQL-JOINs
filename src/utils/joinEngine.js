/**
 * Core SQL Join Computation Engine
 * Supports: INNER, LEFT, RIGHT, FULL OUTER, CROSS, SELF, NATURAL, and THETA/EQUI joins.
 * Computes execution stats, step-by-step logs, match maps, SQL query representations,
 * formal relational algebra expressions, and a shared step-by-step execution trace.
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
    id: "NATURAL",
    name: "NATURAL JOIN",
    badge: "Implicit Keys",
    symbol: "⋈ ≍",
    algebra: "TableA ⋈ TableB",
    summary: "Automatically joins tables based on all columns having the exact same column name and compatible data types.",
    description: "Does not require an explicit ON clause. Eliminates redundant duplicate join columns from the final projected schema.",
    diagramColor: "text-teal-500 bg-teal-500/10 border-teal-500"
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
    id: "THETA",
    name: "THETA JOIN",
    badge: "General Predicate",
    symbol: "⋈_θ",
    algebra: "TableA ⋈_{A.key θ B.key} TableB",
    summary: "Evaluates Cartesian product and filters tuples matching a generalized comparison condition θ (=, ≠, <, ≤, >, ≥).",
    description: "A generalized join condition using any relational comparison operator. Equijoin is the special case where θ is strict equality.",
    diagramColor: "text-indigo-500 bg-indigo-500/10 border-indigo-500"
  }
];

export const COMPARISON_OPERATORS = [
  { value: "=", label: "= (Equal / Equijoin)", description: "Strict equality" },
  { value: "!=", label: "≠ / != (Not Equal)", description: "Inequality comparison" },
  { value: "<", label: "< (Less Than)", description: "Strictly less than" },
  { value: "<=", label: "≤ / <= (Less or Equal)", description: "Less than or equal to" },
  { value: ">", label: "> (Greater Than)", description: "Strictly greater than" },
  { value: ">=", label: "≥ / >= (Greater or Equal)", description: "Greater than or equal to" }
];

/**
 * SQL Three-Valued Logic Comparison
 * Evaluates valA operator valB.
 * If either value is null or undefined, comparison evaluates to UNKNOWN (false in JOIN ON condition).
 */
export function evaluatePredicate(valA, valB, operator = "=") {
  if (valA === null || valA === undefined || valB === null || valB === undefined) {
    return false;
  }

  const strA = String(valA).trim();
  const strB = String(valB).trim();

  // Check if both sides can be evaluated numerically
  const numA = Number(strA);
  const numB = Number(strB);
  const isBothNumeric = !isNaN(numA) && !isNaN(numB) && strA !== "" && strB !== "";

  const a = isBothNumeric ? numA : strA.toLowerCase();
  const b = isBothNumeric ? numB : strB.toLowerCase();

  switch (operator) {
    case "=":
    case "==":
      return a === b;
    case "!=":
    case "<>":
      return a !== b;
    case "<":
      return a < b;
    case "<=":
      return a <= b;
    case ">":
      return a > b;
    case ">=":
      return a >= b;
    default:
      return a === b;
  }
}

/**
 * Generates formatted formal Relational Algebra expression
 */
export function generateRelationalAlgebra({
  tableA,
  tableB,
  joinType = "INNER",
  keyA,
  keyB,
  operator = "="
}) {
  const isSelf = joinType === "SELF" || tableA?.name === tableB?.name;
  const aliasA = isSelf ? (tableA?.alias || "E1") : (tableA?.alias || tableA?.name || "A");
  const aliasB = isSelf ? (tableB?.alias || "E2") : (tableB?.alias || tableB?.name || "B");
  const opSymbol = operator === "!=" ? "≠" : operator === "<=" ? "≤" : operator === ">=" ? "≥" : operator;

  switch (joinType) {
    case "INNER":
      return `${aliasA} ⋈_{${aliasA}.${keyA} ${opSymbol} ${aliasB}.${keyB}} ${aliasB}`;
    case "LEFT":
      return `${aliasA} ⟕_{${aliasA}.${keyA} ${opSymbol} ${aliasB}.${keyB}} ${aliasB}`;
    case "RIGHT":
      return `${aliasA} ⟖_{${aliasA}.${keyA} ${opSymbol} ${aliasB}.${keyB}} ${aliasB}`;
    case "FULL":
      return `${aliasA} ⟗_{${aliasA}.${keyA} ${opSymbol} ${aliasB}.${keyB}} ${aliasB}`;
    case "CROSS":
      return `${aliasA} × ${aliasB}`;
    case "NATURAL":
      return `${aliasA} ⋈ ${aliasB}`;
    case "SELF":
      return `ρ_{${aliasA}}(${tableA?.name || "R"}) ⋈_{${aliasA}.${keyA} ${opSymbol} ${aliasB}.${keyB}} ρ_{${aliasB}}(${tableA?.name || "R"})`;
    case "THETA":
      return `σ_{${aliasA}.${keyA} ${opSymbol} ${aliasB}.${keyB}} (${aliasA} × ${aliasB})`;
    default:
      return `${aliasA} ⋈ ${aliasB}`;
  }
}

/**
 * Builds the shared step-by-step execution trace
 * Single Source of Truth for both the real JOIN engine and the animated execution visualizer.
 */
export function generateJoinExecutionTrace({
  tableA,
  tableB,
  joinType = "INNER",
  keyA,
  keyB,
  operator = "=",
  resultColumns = [],
  naturalCommonCols = []
}) {
  const trace = [];
  const accumulatedResultRows = [];
  const matchedARowIndices = new Set();
  const matchedBRowIndices = new Set();
  let comparisonsCount = 0;

  const isSelf = joinType === "SELF" || tableA.name === tableB.name;
  const aliasA = isSelf ? (tableA.alias || "E1") : (tableA.alias || "a");
  const aliasB = isSelf ? (tableB.alias || "E2") : (tableB.alias || (tableA.name === tableB.name ? "b2" : "b"));
  const opSymbol = operator === "!=" ? "≠" : operator === "<=" ? "≤" : operator === ">=" ? "≥" : operator;

  let conditionLabel = "";
  if (joinType === "CROSS") {
    conditionLabel = `${tableA.name} [${aliasA}] CROSS JOIN ${tableB.name} [${aliasB}]`;
  } else if (joinType === "NATURAL") {
    conditionLabel = naturalCommonCols.length > 0
      ? `${tableA.name} [${aliasA}] NATURAL JOIN ${tableB.name} [${aliasB}] ON [${naturalCommonCols.join(", ")}]`
      : `${tableA.name} [${aliasA}] NATURAL JOIN ${tableB.name} [${aliasB}] (No common keys ➔ Cartesian Product)`;
  } else {
    conditionLabel = `${aliasA}.${keyA} ${opSymbol} ${aliasB}.${keyB}`;
  }

  // Calculate expected row counts
  const totalLeftRows = tableA.rows.length;
  const totalRightRows = tableB.rows.length;
  const totalCartesianPairs = totalLeftRows * totalRightRows;

  // Step 0: Ingest & Initialize Stage
  trace.push({
    stepIndex: 0,
    phase: "INIT",
    stage: "A",
    title: "1. Load Input Relations",
    description: `Loaded relation "${tableA.name}" (${totalLeftRows} tuples) and relation "${tableB.name}" (${totalRightRows} tuples).`,
    explanation: `Both input relations are loaded into working memory. Active join condition: ${conditionLabel}. Nested loop scan is prepared.`,
    predicateEvaluationText: conditionLabel,
    leftIndex: null,
    rightIndex: null,
    leftRow: null,
    rightRow: null,
    valA: null,
    valB: null,
    operator,
    isMatch: false,
    isCross: joinType === "CROSS",
    isUnmatchedLeft: false,
    isUnmatchedRight: false,
    emittedRow: null,
    currentResultRows: [],
    newlyEmittedIndex: null,
    activeKeyA: keyA,
    activeKeyB: keyB,
    conditionLabel,
    aliasA,
    aliasB,
    stats: {
      comparisonsCount: 0,
      outputCount: 0,
      matchedCount: 0,
      unmatchedLeftCount: 0,
      unmatchedRightCount: 0
    }
  });

  // Main Execution Trace Loop
  if (joinType === "CROSS") {
    // Cartesian Product
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

        accumulatedResultRows.push(combined);
        const currentResultCount = accumulatedResultRows.length;

        // Cartesian Combine & Emit Step
        trace.push({
          stepIndex: trace.length,
          phase: "MERGE",
          stage: "C",
          title: `Cartesian Pair: ${aliasA}[Row ${idxA + 1}] × ${aliasB}[Row ${idxB + 1}]`,
          description: `Combining tuple from ${tableA.name} with tuple from ${tableB.name} without predicate filtering.`,
          explanation: `CROSS JOIN combines this row from ${tableA.name} with every row from ${tableB.name} unconditionally (${currentResultCount} of ${totalCartesianPairs} expected combinations).`,
          predicateEvaluationText: `Unconditional Cartesian Pairing (Pair ${currentResultCount} of ${totalCartesianPairs})`,
          leftIndex: idxA,
          rightIndex: idxB,
          leftRow: rowA,
          rightRow: rowB,
          valA: null,
          valB: null,
          operator: "×",
          isMatch: true,
          isCross: true,
          isUnmatchedLeft: false,
          isUnmatchedRight: false,
          emittedRow: combined,
          currentResultRows: [...accumulatedResultRows],
          newlyEmittedIndex: currentResultCount - 1,
          activeKeyA: keyA,
          activeKeyB: keyB,
          conditionLabel,
          aliasA,
          aliasB,
          stats: {
            comparisonsCount,
            outputCount: currentResultCount,
            matchedCount: currentResultCount,
            unmatchedLeftCount: 0,
            unmatchedRightCount: 0
          }
        });
      });
    });
  } else {
    // Nested Loop Evaluation
    tableA.rows.forEach((rowA, idxA) => {
      let rowAMatched = false;

      tableB.rows.forEach((rowB, idxB) => {
        comparisonsCount++;

        let isMatch = false;
        let valA = rowA[keyA];
        let valB = rowB[keyB];

        if (joinType === "NATURAL" && naturalCommonCols.length > 0) {
          isMatch = naturalCommonCols.every(colName => {
            const vA = rowA[colName];
            const vB = rowB[colName];
            return (vA !== null && vA !== undefined && vB !== null && vB !== undefined) &&
              (String(vA).trim().toLowerCase() === String(vB).trim().toLowerCase());
          });
          valA = naturalCommonCols.map(c => `${c}=${rowA[c] ?? "NULL"}`).join(", ");
          valB = naturalCommonCols.map(c => `${c}=${rowB[c] ?? "NULL"}`).join(", ");
        } else {
          isMatch = evaluatePredicate(valA, valB, operator);
        }

        const aDisplayVal = valA === null || valA === undefined ? "NULL" : String(valA);
        const bDisplayVal = valB === null || valB === undefined ? "NULL" : String(valB);

        // Explanation text for this candidate comparison
        let explanation = "";
        let predicateEvaluationText = "";

        if (isMatch) {
          if (joinType === "NATURAL") {
            explanation = `Natural join match! All common attributes [${naturalCommonCols.join(", ")}] have identical values between ${aliasA}[Row ${idxA + 1}] and ${aliasB}[Row ${idxB + 1}].`;
            predicateEvaluationText = `Common attributes match (${valA}) ➔ TRUE [MATCH]`;
          } else {
            explanation = `Comparing ${aliasA}.${keyA} (${aDisplayVal}) with ${aliasB}.${keyB} (${bDisplayVal}). The predicate ${aDisplayVal} ${opSymbol} ${bDisplayVal} evaluates to TRUE. Tuples match!`;
            predicateEvaluationText = `${aliasA}.${keyA} [${aDisplayVal}] ${opSymbol} ${aliasB}.${keyB} [${bDisplayVal}] ➔ TRUE [MATCH]`;
          }
        } else {
          if (valA === null || valA === undefined || valB === null || valB === undefined) {
            explanation = `Comparing ${aliasA}.${keyA} (${aDisplayVal}) with ${aliasB}.${keyB} (${bDisplayVal}). Under SQL three-valued logic, any comparison with NULL yields UNKNOWN (FALSE). Tuples do NOT match.`;
            predicateEvaluationText = `${aliasA}.${keyA} [${aDisplayVal}] ${opSymbol} ${aliasB}.${keyB} [${bDisplayVal}] ➔ UNKNOWN/FALSE [MISMATCH]`;
          } else if (joinType === "NATURAL") {
            explanation = `Common attributes differ between ${aliasA}[Row ${idxA + 1}] and ${aliasB}[Row ${idxB + 1}]. Predicate evaluates to FALSE.`;
            predicateEvaluationText = `Common attributes differ ➔ FALSE [MISMATCH]`;
          } else {
            explanation = `Comparing ${aliasA}.${keyA} (${aDisplayVal}) with ${aliasB}.${keyB} (${bDisplayVal}). Predicate ${aDisplayVal} ${opSymbol} ${bDisplayVal} evaluates to FALSE. Tuples do NOT match.`;
            predicateEvaluationText = `${aliasA}.${keyA} [${aDisplayVal}] ${opSymbol} ${aliasB}.${keyB} [${bDisplayVal}] ➔ FALSE [MISMATCH]`;
          }
        }

        // Trace Step: Stage B Comparison
        trace.push({
          stepIndex: trace.length,
          phase: "COMPARE",
          stage: "B",
          title: `Compare: ${aliasA}[Row ${idxA + 1}] vs ${aliasB}[Row ${idxB + 1}]`,
          description: `Evaluating join predicate for candidate row pair.`,
          explanation,
          predicateEvaluationText,
          leftIndex: idxA,
          rightIndex: idxB,
          leftRow: rowA,
          rightRow: rowB,
          valA,
          valB,
          operator,
          isMatch,
          isCross: false,
          isUnmatchedLeft: false,
          isUnmatchedRight: false,
          emittedRow: null,
          currentResultRows: [...accumulatedResultRows],
          newlyEmittedIndex: null,
          activeKeyA: keyA,
          activeKeyB: keyB,
          conditionLabel,
          aliasA,
          aliasB,
          stats: {
            comparisonsCount,
            outputCount: accumulatedResultRows.length,
            matchedCount: matchedARowIndices.size,
            unmatchedLeftCount: 0,
            unmatchedRightCount: 0
          }
        });

        // If matched, assemble and emit composite output tuple
        if (isMatch) {
          rowAMatched = true;
          matchedARowIndices.add(idxA);
          matchedBRowIndices.add(idxB);

          const combined = {};
          tableA.columns.forEach(col => {
            combined[`a_${col.name}`] = rowA[col.name];
          });
          tableB.columns.forEach(col => {
            const isNaturalDuplicate = joinType === "NATURAL" && naturalCommonCols.some(c => c.toLowerCase() === col.name.toLowerCase());
            if (!isNaturalDuplicate) {
              combined[`b_${col.name}`] = rowB[col.name];
            }
          });

          combined._meta = {
            originAIndex: idxA,
            originBIndex: idxB,
            matchStatus: "matched",
            keyValue: rowA[keyA],
            rowId: `matched_${idxA}_${idxB}`
          };

          accumulatedResultRows.push(combined);
          const currentResultCount = accumulatedResultRows.length;

          // Trace Step: Stage C & D Combine & Emit
          trace.push({
            stepIndex: trace.length,
            phase: "MERGE",
            stage: "C",
            title: `Combine & Emit: ${aliasA}[Row ${idxA + 1}] + ${aliasB}[Row ${idxB + 1}]`,
            description: `Merging matched tuples into a single synthesized result tuple.`,
            explanation: `The join predicate evaluated to TRUE. Attributes from ${tableA.name} and ${tableB.name} are combined into a single output tuple and appended to RESULT RELATION.`,
            predicateEvaluationText: `${aliasA}.${keyA} (${aDisplayVal}) ${opSymbol} ${aliasB}.${keyB} (${bDisplayVal}) ➔ Output Tuple #${currentResultCount} Created`,
            leftIndex: idxA,
            rightIndex: idxB,
            leftRow: rowA,
            rightRow: rowB,
            valA,
            valB,
            operator,
            isMatch: true,
            isCross: false,
            isUnmatchedLeft: false,
            isUnmatchedRight: false,
            emittedRow: combined,
            currentResultRows: [...accumulatedResultRows],
            newlyEmittedIndex: currentResultCount - 1,
            activeKeyA: keyA,
            activeKeyB: keyB,
            conditionLabel,
            aliasA,
            aliasB,
            stats: {
              comparisonsCount,
              outputCount: currentResultCount,
              matchedCount: matchedARowIndices.size,
              unmatchedLeftCount: 0,
              unmatchedRightCount: 0
            }
          });
        }
      });

      // Handle Left Outer preservation when row A had no match
      if (!rowAMatched && (joinType === "LEFT" || joinType === "FULL")) {
        const combined = {};
        tableA.columns.forEach(col => {
          combined[`a_${col.name}`] = rowA[col.name];
        });
        tableB.columns.forEach(col => {
          const isNaturalDuplicate = joinType === "NATURAL" && naturalCommonCols.some(c => c.toLowerCase() === col.name.toLowerCase());
          if (!isNaturalDuplicate) {
            combined[`b_${col.name}`] = null;
          }
        });
        combined._meta = {
          originAIndex: idxA,
          originBIndex: null,
          matchStatus: "unmatched_left",
          keyValue: rowA[keyA],
          rowId: `left_unmatched_${idxA}`
        };

        accumulatedResultRows.push(combined);
        const currentResultCount = accumulatedResultRows.length;

        trace.push({
          stepIndex: trace.length,
          phase: "NULL_EXTEND_LEFT",
          stage: "C",
          title: `Preserve Left Tuple: ${aliasA}[Row ${idxA + 1}]`,
          description: `Preserving unmatched left tuple with NULL extension for right attributes.`,
          explanation: `This tuple in ${tableA.name} has no matching counterpart in ${tableB.name}. Because ${joinType} OUTER JOIN guarantees no records from the left relation are lost, it is preserved in RESULT RELATION and right-side attributes are padded with NULL.`,
          predicateEvaluationText: `${aliasA}[Row ${idxA + 1}] has no match in ${aliasB} ➔ Preserved with NULL padding`,
          leftIndex: idxA,
          rightIndex: null,
          leftRow: rowA,
          rightRow: null,
          valA: rowA[keyA],
          valB: null,
          operator,
          isMatch: false,
          isCross: false,
          isUnmatchedLeft: true,
          isUnmatchedRight: false,
          emittedRow: combined,
          currentResultRows: [...accumulatedResultRows],
          newlyEmittedIndex: currentResultCount - 1,
          activeKeyA: keyA,
          activeKeyB: keyB,
          conditionLabel,
          aliasA,
          aliasB,
          stats: {
            comparisonsCount,
            outputCount: currentResultCount,
            matchedCount: matchedARowIndices.size,
            unmatchedLeftCount: tableA.rows.length - matchedARowIndices.size,
            unmatchedRightCount: 0
          }
        });
      }
    });

    // Handle Right Outer preservation when rows in B had no match
    if (joinType === "RIGHT" || joinType === "FULL") {
      tableB.rows.forEach((rowB, idxB) => {
        if (!matchedBRowIndices.has(idxB)) {
          const combined = {};
          tableA.columns.forEach(col => {
            combined[`a_${col.name}`] = null;
          });
          tableB.columns.forEach(col => {
            const isNaturalDuplicate = joinType === "NATURAL" && naturalCommonCols.some(c => c.toLowerCase() === col.name.toLowerCase());
            if (!isNaturalDuplicate) {
              combined[`b_${col.name}`] = rowB[col.name];
            }
          });
          combined._meta = {
            originAIndex: null,
            originBIndex: idxB,
            matchStatus: "unmatched_right",
            keyValue: rowB[keyB],
            rowId: `right_unmatched_${idxB}`
          };

          accumulatedResultRows.push(combined);
          const currentResultCount = accumulatedResultRows.length;

          trace.push({
            stepIndex: trace.length,
            phase: "NULL_EXTEND_RIGHT",
            stage: "C",
            title: `Preserve Right Tuple: ${aliasB}[Row ${idxB + 1}]`,
            description: `Preserving unmatched right tuple with NULL extension for left attributes.`,
            explanation: `This tuple in ${tableB.name} has no matching counterpart in ${tableA.name}. Because ${joinType} OUTER JOIN preserves all tuples from the right relation, it is preserved in RESULT RELATION and left-side attributes are padded with NULL.`,
            predicateEvaluationText: `${aliasB}[Row ${idxB + 1}] has no match in ${aliasA} ➔ Preserved with NULL padding`,
            leftIndex: null,
            rightIndex: idxB,
            leftRow: null,
            rightRow: rowB,
            valA: null,
            valB: rowB[keyB],
            operator,
            isMatch: false,
            isCross: false,
            isUnmatchedLeft: false,
            isUnmatchedRight: true,
            emittedRow: combined,
            currentResultRows: [...accumulatedResultRows],
            newlyEmittedIndex: currentResultCount - 1,
            activeKeyA: keyA,
            activeKeyB: keyB,
            conditionLabel,
            aliasA,
            aliasB,
            stats: {
              comparisonsCount,
              outputCount: currentResultCount,
              matchedCount: matchedARowIndices.size,
              unmatchedLeftCount: tableA.rows.length - matchedARowIndices.size,
              unmatchedRightCount: tableB.rows.length - matchedBRowIndices.size
            }
          });
        }
      });
    }
  }

  // Final Step: Complete & Summary Stage
  trace.push({
    stepIndex: trace.length,
    phase: "COMPLETE",
    stage: "D",
    title: "Join Execution Complete",
    description: `Successfully evaluated all candidate tuples and constructed final RESULT RELATION.`,
    explanation: `Execution completed successfully. Synthesized ${accumulatedResultRows.length} tuples across ${resultColumns.length} attributes with ${comparisonsCount} tuple comparisons.`,
    predicateEvaluationText: `✓ Execution Complete: ${accumulatedResultRows.length} tuples synthesized`,
    leftIndex: null,
    rightIndex: null,
    leftRow: null,
    rightRow: null,
    valA: null,
    valB: null,
    operator,
    isMatch: false,
    isCross: joinType === "CROSS",
    isUnmatchedLeft: false,
    isUnmatchedRight: false,
    emittedRow: null,
    currentResultRows: [...accumulatedResultRows],
    newlyEmittedIndex: null,
    activeKeyA: keyA,
    activeKeyB: keyB,
    conditionLabel,
    aliasA,
    aliasB,
    stats: {
      comparisonsCount,
      outputCount: accumulatedResultRows.length,
      matchedCount: matchedARowIndices.size,
      unmatchedLeftCount: tableA.rows.length - matchedARowIndices.size,
      unmatchedRightCount: tableB.rows.length - matchedBRowIndices.size
    }
  });

  return {
    trace,
    finalResultRows: accumulatedResultRows,
    comparisonsCount,
    matchedAIndices: Array.from(matchedARowIndices),
    matchedBIndices: Array.from(matchedBRowIndices)
  };
}

/**
 * Execute join operation dynamically based on user parameters
 * Single Source of Truth for both existing and animated join visualizers.
 */
export function executeJoin({
  tableA,
  tableB,
  joinType = "INNER",
  keyA,
  keyB,
  operator = "=",
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
      executionTrace: [],
      steps: [],
      stats: { executionTimeMs: 0, rowCount: 0, comparisonsCount: 0 }
    };
  }

  // Handle Natural Join key deduction (match on all shared column names)
  let effectiveKeyA = keyA;
  let effectiveKeyB = keyB;
  let naturalCommonCols = [];

  if (joinType === "NATURAL") {
    naturalCommonCols = tableA.columns
      .map(c => c.name)
      .filter(colName => tableB.columns.some(bc => bc.name.toLowerCase() === colName.toLowerCase()));

    if (naturalCommonCols.length === 0) {
      warnings.push("No common column names found between relations. NATURAL JOIN operates as Cartesian CROSS JOIN.");
      effectiveKeyA = null;
      effectiveKeyB = null;
    } else {
      effectiveKeyA = naturalCommonCols[0];
      const matchedB = tableB.columns.find(bc => bc.name.toLowerCase() === effectiveKeyA.toLowerCase());
      effectiveKeyB = matchedB ? matchedB.name : effectiveKeyA;
    }
  }

  if (joinType !== "CROSS" && !(joinType === "NATURAL" && naturalCommonCols.length === 0)) {
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
      executionTrace: [],
      steps: [],
      stats: { executionTimeMs: 0, rowCount: 0, comparisonsCount: 0 }
    };
  }

  // Determine Output Columns Schema
  const resultColumns = [];
  const isSelf = joinType === "SELF" || tableA.name === tableB.name;
  const aliasA = isSelf ? (tableA.alias || "E1") : (tableA.alias || "a");
  const aliasB = isSelf ? (tableB.alias || "E2") : (tableB.alias || (tableA.name === tableB.name ? "b2" : "b"));

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
    // In SQL Natural join, common attributes are projected ONLY once from Table A
    const isNaturalDuplicate = joinType === "NATURAL" && naturalCommonCols.some(c => c.toLowerCase() === col.name.toLowerCase());
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

  // Generate shared execution trace
  const {
    trace,
    finalResultRows,
    comparisonsCount,
    matchedAIndices,
    matchedBIndices
  } = generateJoinExecutionTrace({
    tableA,
    tableB,
    joinType,
    keyA: effectiveKeyA,
    keyB: effectiveKeyB,
    operator,
    resultColumns,
    naturalCommonCols
  });

  // Populate matchPairs for existing Venn / row linking components
  const matchPairs = [];
  trace.forEach(step => {
    if (step.phase === "MERGE" && step.leftIndex !== null && step.rightIndex !== null) {
      matchPairs.push({
        indexA: step.leftIndex,
        indexB: step.rightIndex,
        type: step.isCross ? "cross" : "matched",
        keyVal: step.valA
      });
    }
  });

  // Populate conceptual steps for backward compatibility with StepExecutionStepper
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
      : `Join condition set: ${aliasA}.${effectiveKeyA} ${operator} ${aliasB}.${effectiveKeyB}`,
    details: `Comparing on column "${effectiveKeyA}" from Table A against "${effectiveKeyB}" from Table B with operator "${operator}".`
  });

  steps.push({
    stepNumber: 3,
    title: joinType === "CROSS" ? "Compute Cartesian Product" : "Evaluate Join Predicate (Nested Loop Scan)",
    description: joinType === "CROSS"
      ? `Iterating over all ${tableA.rows.length} × ${tableB.rows.length} = ${tableA.rows.length * tableB.rows.length} combinations.`
      : `Scanning Table A tuples and probing Table B for matches on key predicate.`,
    details: `Executed ${comparisonsCount} pairwise comparisons.`
  });

  steps.push({
    stepNumber: 4,
    title: "Apply Null Extension & Outer Filtering",
    description: `Applied ${joinType} rule. ${matchedAIndices.length} rows matched from A, ${matchedBIndices.length} rows matched from B.`,
    details: `${tableA.rows.length - matchedAIndices.length} unmatched in A, ${tableB.rows.length - matchedBIndices.length} unmatched in B.`
  });

  steps.push({
    stepNumber: 5,
    title: "Construct Result Dataset",
    description: `Synthesized final relation containing ${finalResultRows.length} tuples and ${resultColumns.length} projected attributes.`,
    details: `Successfully completed join execution in ${(performance.now() - startTime).toFixed(2)} ms.`
  });

  const endTime = performance.now();
  const executionTimeMs = parseFloat((endTime - startTime).toFixed(3));

  // Generated SQL Query & Relational Algebra
  const sqlQuery = generateSQLQuery({
    tableA,
    tableB,
    joinType,
    keyA: effectiveKeyA,
    keyB: effectiveKeyB,
    operator
  });

  const relationalAlgebra = generateRelationalAlgebra({
    tableA,
    tableB,
    joinType,
    keyA: effectiveKeyA,
    keyB: effectiveKeyB,
    operator
  });

  return {
    success: true,
    joinType,
    tableA,
    tableB,
    keyA: effectiveKeyA,
    keyB: effectiveKeyB,
    operator,
    resultColumns,
    resultRows: finalResultRows,
    executionTrace: trace,
    matchPairs,
    matchedAIndices,
    matchedBIndices,
    unmatchedAIndices: tableA.rows.map((_, i) => i).filter(i => !matchedAIndices.includes(i)),
    unmatchedBIndices: tableB.rows.map((_, i) => i).filter(i => !matchedBIndices.includes(i)),
    steps,
    sqlQuery,
    relationalAlgebra,
    warnings,
    errors: [],
    stats: {
      executionTimeMs,
      rowCount: finalResultRows.length,
      tableARows: tableA.rows.length,
      tableBRows: tableB.rows.length,
      comparisonsCount,
      matchedCount: matchPairs.length,
      unmatchedLeftCount: tableA.rows.length - matchedAIndices.length,
      unmatchedRightCount: tableB.rows.length - matchedBIndices.length
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
  keyB,
  operator = "="
}) {
  const isSelf = joinType === "SELF" || tableA.name === tableB.name;
  const aliasA = isSelf ? (tableA.alias || "e1") : (tableA.alias || tableA.name.charAt(0).toLowerCase());
  const aliasB = isSelf ? (tableB.alias || "e2") : (tableB.alias || (tableA.name === tableB.name ? `${tableB.name.charAt(0).toLowerCase()}2` : tableB.name.charAt(0).toLowerCase()));

  let joinKeyword = "INNER JOIN";
  if (joinType === "LEFT") joinKeyword = "LEFT OUTER JOIN";
  else if (joinType === "RIGHT") joinKeyword = "RIGHT OUTER JOIN";
  else if (joinType === "FULL") joinKeyword = "FULL OUTER JOIN";
  else if (joinType === "CROSS") joinKeyword = "CROSS JOIN";
  else if (joinType === "SELF") joinKeyword = "INNER JOIN";
  else if (joinType === "NATURAL") joinKeyword = "NATURAL JOIN";
  else if (joinType === "THETA") joinKeyword = "JOIN";

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

  if (joinType === "CROSS") {
    return `${selectClause}\n${fromClause}\nCROSS JOIN ${tableB.name} ${aliasB};`;
  }
  if (joinType === "NATURAL") {
    return `${selectClause}\n${fromClause}\nNATURAL JOIN ${tableB.name} ${aliasB};`;
  }

  const onClause = `    ON ${aliasA}.${keyA} ${operator} ${aliasB}.${keyB}`;
  return `${selectClause}\n${fromClause}\n${joinKeyword} ${tableB.name} ${aliasB}\n${onClause};`;
}
