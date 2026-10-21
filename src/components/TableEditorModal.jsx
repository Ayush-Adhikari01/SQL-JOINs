import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Table, AlertCircle, Check, X, Users, Building, 
  ArrowLeft, ArrowRight, Columns, Settings2, Info, Edit2
} from "lucide-react";

export function TableEditorModal({
  isOpen,
  onClose,
  initialTable,
  onSave,
  tableNameLabel = "Table",
  // Multi-table support
  tableA,
  tableB,
  onSaveTableA,
  onSaveTableB,
  initialTab = "A"
}) {
  const isMultiTable = Boolean(tableA && tableB);
  const [activeTab, setActiveTab] = useState(initialTab || "A");
  const [activeSubView, setActiveSubView] = useState("data"); // 'data' | 'columns'
  const [editingHeaderCol, setEditingHeaderCol] = useState(null);

  // State for Table A (or single table)
  const sourceA = tableA || initialTable;
  const [nameA, setNameA] = useState(sourceA?.name || "Employee");
  const [aliasA, setAliasA] = useState(sourceA?.alias || "e");
  const [columnsA, setColumnsA] = useState([]);
  const [rowsA, setRowsA] = useState([]);

  // State for Table B (if multi-table)
  const [nameB, setNameB] = useState(tableB?.name || "Department");
  const [aliasB, setAliasB] = useState(tableB?.alias || "d");
  const [columnsB, setColumnsB] = useState([]);
  const [rowsB, setRowsB] = useState([]);

  const [errorMsg, setErrorMsg] = useState("");
  const [newColName, setNewColName] = useState("");
  const [newColType, setNewColType] = useState("string");
  const [newColDefault, setNewColDefault] = useState("");

  // Helper to initialize column metadata with _initialName tracking
  const initColumns = (cols) => {
    if (!cols || !Array.isArray(cols)) return [];
    return cols.map((col, idx) => ({
      ...col,
      _colId: col._colId || `col_${idx}_${col.name}`,
      _initialName: col._initialName || col.name,
      label: col.label || col.name,
      type: col.type || "string"
    }));
  };

  // Synchronize on open or table change
  useEffect(() => {
    if (isOpen) {
      const srcA = tableA || initialTable;
      if (srcA) {
        setNameA(srcA.name || "Employee");
        setAliasA(srcA.alias || "e");
        setColumnsA(initColumns(srcA.columns));
        setRowsA(srcA.rows ? JSON.parse(JSON.stringify(srcA.rows)) : []);
      }
      if (tableB) {
        setNameB(tableB.name || "Department");
        setAliasB(tableB.alias || "d");
        setColumnsB(initColumns(tableB.columns));
        setRowsB(tableB.rows ? JSON.parse(JSON.stringify(tableB.rows)) : []);
      }
      setActiveTab(initialTab || "A");
      setActiveSubView("data");
      setErrorMsg("");
      setNewColName("");
      setNewColDefault("");
    }
  }, [isOpen, initialTable, tableA, tableB, initialTab]);

  if (!isOpen) return null;

  // Active table getters & setters based on activeTab
  const isTabA = !isMultiTable || activeTab === "A";
  const currentColumns = isTabA ? columnsA : columnsB;
  const currentRows = isTabA ? rowsA : rowsB;
  const currentTableName = isTabA ? nameA : nameB;
  const currentAlias = isTabA ? aliasA : aliasB;

  const setCurrentRows = (newRows) => {
    if (isTabA) setRowsA(newRows);
    else setRowsB(newRows);
  };

  const setCurrentColumns = (newCols) => {
    if (isTabA) setColumnsA(newCols);
    else setColumnsB(newCols);
  };

  const setCurrentName = (val) => {
    if (isTabA) setNameA(val);
    else setNameB(val);
  };

  const setCurrentAlias = (val) => {
    if (isTabA) setAliasA(val);
    else setAliasB(val);
  };

  // ---------------------------------------------------------------------------
  // ROW CRUD
  // ---------------------------------------------------------------------------
  const handleAddRow = () => {
    setErrorMsg("");
    const newRow = {};
    const pkCol = currentColumns.find(c => c.isPrimary) || currentColumns[0];

    currentColumns.forEach((c) => {
      if (c === pkCol && c.type === "number") {
        const maxId = currentRows.reduce((max, r) => {
          const v = Number(r[c.name]);
          return !isNaN(v) && v > max ? v : max;
        }, 100);
        newRow[c.name] = maxId + 1;
      } else if (c.type === "number") {
        newRow[c.name] = null;
      } else {
        newRow[c.name] = `New ${c.label || c.name}`;
      }
    });

    setCurrentRows([...currentRows, newRow]);
  };

  const handleDeleteRow = (rowIndex) => {
    if (currentRows.length <= 1) {
      setErrorMsg("A relation must have at least one tuple (row).");
      return;
    }
    setErrorMsg("");
    setCurrentRows(currentRows.filter((_, idx) => idx !== rowIndex));
  };

  const handleCellChange = (rowIndex, colName, value, type) => {
    setErrorMsg("");
    const updated = [...currentRows];
    let parsedVal = value;

    if (value === "" || value === null || value === undefined || value.trim().toUpperCase() === "NULL") {
      parsedVal = null;
    } else if (type === "number") {
      const num = Number(value);
      parsedVal = isNaN(num) ? value : num;
    } else {
      parsedVal = value;
    }

    updated[rowIndex] = { ...updated[rowIndex], [colName]: parsedVal };
    setCurrentRows(updated);
  };

  // ---------------------------------------------------------------------------
  // COLUMN & SCHEMA MANAGEMENT
  // ---------------------------------------------------------------------------
  const handleRenameColumn = (oldName, newRawName) => {
    const clean = newRawName.trim().replace(/\s+/g, "_");
    if (!clean) {
      setErrorMsg("Column name cannot be empty.");
      return;
    }
    if (clean === oldName) return;

    if (currentColumns.some(c => c.name.toLowerCase() === clean.toLowerCase() && c.name !== oldName)) {
      setErrorMsg(`A column named "${clean}" already exists in ${currentTableName}.`);
      return;
    }

    setErrorMsg("");

    // 1. Update columns list, preserving _initialName and _colId
    const updatedCols = currentColumns.map(c => {
      if (c.name === oldName) {
        return {
          ...c,
          name: clean,
          label: clean
        };
      }
      return c;
    });
    setCurrentColumns(updatedCols);

    // 2. Update existing rows preserving ALL data under the new attribute key
    const updatedRows = currentRows.map(r => {
      const newRow = {};
      Object.keys(r).forEach(k => {
        if (k === oldName) {
          newRow[clean] = r[k];
        } else {
          newRow[k] = r[k];
        }
      });
      return newRow;
    });
    setCurrentRows(updatedRows);
  };

  const handleChangeColumnType = (colName, newType) => {
    const updatedCols = currentColumns.map(c => {
      if (c.name === colName) {
        return { ...c, type: newType };
      }
      return c;
    });
    setCurrentColumns(updatedCols);
  };

  const handleMoveColumn = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= currentColumns.length) return;

    const updatedCols = [...currentColumns];
    const temp = updatedCols[index];
    updatedCols[index] = updatedCols[targetIndex];
    updatedCols[targetIndex] = temp;
    setCurrentColumns(updatedCols);
  };

  const handleAddColumn = () => {
    const cleanName = newColName.trim().replace(/\s+/g, "_").toLowerCase();
    if (!cleanName) {
      setErrorMsg("Column name cannot be blank.");
      return;
    }
    if (currentColumns.some(c => c.name.toLowerCase() === cleanName.toLowerCase())) {
      setErrorMsg(`Column "${cleanName}" already exists in ${currentTableName}.`);
      return;
    }

    let defaultParsed = null;
    if (newColDefault.trim() !== "" && newColDefault.trim().toUpperCase() !== "NULL") {
      if (newColType === "number") {
        const num = Number(newColDefault);
        defaultParsed = isNaN(num) ? newColDefault : num;
      } else {
        defaultParsed = newColDefault;
      }
    }

    const newCol = {
      name: cleanName,
      label: cleanName,
      type: newColType,
      _colId: `col_${Date.now()}_${cleanName}`,
      _initialName: cleanName
    };

    setCurrentColumns([...currentColumns, newCol]);
    setCurrentRows(currentRows.map(r => ({ ...r, [cleanName]: defaultParsed })));
    setNewColName("");
    setNewColDefault("");
    setErrorMsg("");
  };

  const handleDeleteColumn = (colName) => {
    if (currentColumns.length <= 1) {
      setErrorMsg("A relation must have at least one column.");
      return;
    }

    const colObj = currentColumns.find(c => c.name === colName);
    if (colObj?.isPrimary) {
      if (!window.confirm(`"${colName}" appears to be a primary key. Deleting it may impact tuple uniqueness. Do you want to proceed?`)) {
        return;
      }
    }

    setCurrentColumns(currentColumns.filter(c => c.name !== colName));
    setCurrentRows(currentRows.map(r => {
      const copy = { ...r };
      delete copy[colName];
      return copy;
    }));
    setErrorMsg("");
  };

  // ---------------------------------------------------------------------------
  // VALIDATION & COMMIT
  // ---------------------------------------------------------------------------
  const validateTable = (tableName, cols, rowList) => {
    if (!tableName || !tableName.trim()) {
      return "Table name cannot be empty.";
    }
    if (cols.length === 0) {
      return `Table "${tableName}" must have at least one column.`;
    }
    if (rowList.length === 0) {
      return `Table "${tableName}" must contain at least one tuple.`;
    }

    // Check for empty or duplicate column names
    const colNameSet = new Set();
    for (const c of cols) {
      if (!c.name || !c.name.trim()) {
        return `Table "${tableName}" has a column with an empty name.`;
      }
      const lower = c.name.toLowerCase();
      if (colNameSet.has(lower)) {
        return `Table "${tableName}" contains duplicate column name "${c.name}".`;
      }
      colNameSet.add(lower);
    }

    // Determine primary key column
    const pkCol = cols.find(c => c.isPrimary) ||
      cols.find(c => c.name.toLowerCase().endsWith("_id") || c.name.toLowerCase() === "id") ||
      cols[0];

    if (pkCol) {
      const seen = new Map();
      for (let i = 0; i < rowList.length; i++) {
        const val = rowList[i][pkCol.name];
        if (val === null || val === undefined || String(val).trim() === "") {
          return `Primary key "${pkCol.name}" in "${tableName}" (Row ${i + 1}) cannot be NULL or empty.`;
        }
        const keyStr = String(val).trim();
        if (seen.has(keyStr)) {
          return `Duplicate primary key detected in "${tableName}": "${pkCol.name}" value "${val}" appears more than once (Rows ${seen.get(keyStr) + 1} and ${i + 1}). Primary keys must be unique.`;
        }
        seen.set(keyStr, i);
      }
    }

    return null;
  };

  const handleSaveAndApply = () => {
    // Validate Table A
    const errA = validateTable(nameA, columnsA, rowsA);
    if (errA) {
      setActiveTab("A");
      setErrorMsg(errA);
      return;
    }

    // Validate Table B if multi-table
    if (isMultiTable) {
      const errB = validateTable(nameB, columnsB, rowsB);
      if (errB) {
        setActiveTab("B");
        setErrorMsg(errB);
        return;
      }
    }

    // Construct renames mapping for Table A: { [oldInitialName]: currentName }
    const renamesA = {};
    columnsA.forEach(col => {
      if (col._initialName && col._initialName !== col.name) {
        renamesA[col._initialName] = col.name;
      }
    });

    const updatedTableA = {
      name: nameA.trim() || "Employee",
      alias: aliasA.trim() || "e",
      keyColumn: columnsA.find(c => c.isPrimary)?.name || columnsA[0]?.name,
      columns: columnsA.map(({ _colId, _initialName, ...rest }) => rest),
      rows: rowsA
    };

    if (isMultiTable) {
      const renamesB = {};
      columnsB.forEach(col => {
        if (col._initialName && col._initialName !== col.name) {
          renamesB[col._initialName] = col.name;
        }
      });

      const updatedTableB = {
        name: nameB.trim() || "Department",
        alias: aliasB.trim() || "d",
        keyColumn: columnsB.find(c => c.isPrimary)?.name || columnsB[0]?.name,
        columns: columnsB.map(({ _colId, _initialName, ...rest }) => rest),
        rows: rowsB
      };

      if (typeof onSaveTableA === "function") onSaveTableA(updatedTableA, renamesA);
      if (typeof onSaveTableB === "function") onSaveTableB(updatedTableB, renamesB);
    } else {
      if (typeof onSave === "function") onSave(updatedTableA, renamesA);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs font-serif animate-fade-in">
      <div 
        className="rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col border shadow-2xl overflow-hidden transition-all"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-main)"
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-5 sm:p-6 border-b flex flex-wrap items-center justify-between gap-3"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2.5 rounded-2xl text-white shadow-xs"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black tracking-tight" style={{ color: "var(--text-main)" }}>
                Edit Relational Tables & Schema
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Rename tables, modify attributes, add/remove columns, edit tuples, and enforce integrity.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl hover:opacity-75 transition-opacity cursor-pointer border"
            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
            title="Close editor"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Table Selector Tabs (If multi-table) */}
        {isMultiTable && (
          <div 
            className="flex items-center px-6 pt-3 border-b space-x-2"
            style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
          >
            <button
              onClick={() => { setErrorMsg(""); setActiveTab("A"); }}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all cursor-pointer ${
                activeTab === "A"
                  ? "shadow-xs border-b-transparent"
                  : "opacity-70 hover:opacity-100 border-transparent"
              }`}
              style={{
                backgroundColor: activeTab === "A" ? "var(--bg-surface)" : "transparent",
                borderColor: activeTab === "A" ? "var(--border-subtle)" : "transparent",
                color: activeTab === "A" ? "var(--color-primary)" : "var(--text-muted)"
              }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>{nameA || "Employee"} (Table A)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-500/15">
                {rowsA.length} rows • {columnsA.length} cols
              </span>
            </button>

            <button
              onClick={() => { setErrorMsg(""); setActiveTab("B"); }}
              className={`flex items-center space-x-2 px-4 py-2 text-xs font-bold rounded-t-xl border-t border-x transition-all cursor-pointer ${
                activeTab === "B"
                  ? "shadow-xs border-b-transparent"
                  : "opacity-70 hover:opacity-100 border-transparent"
              }`}
              style={{
                backgroundColor: activeTab === "B" ? "var(--bg-surface)" : "transparent",
                borderColor: activeTab === "B" ? "var(--border-subtle)" : "transparent",
                color: activeTab === "B" ? "var(--color-accent)" : "var(--text-muted)"
              }}
            >
              <Building className="w-3.5 h-3.5" />
              <span>{nameB || "Department"} (Table B)</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-slate-500/15">
                {rowsB.length} rows • {columnsB.length} cols
              </span>
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/40 text-rose-400 text-xs flex items-center gap-2 animate-fade-in font-mono">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* 1. TABLE NAME & ALIAS EDITING */}
          <div 
            className="p-4 rounded-2xl border space-y-3"
            style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider font-mono" style={{ color: isTabA ? "var(--color-primary)" : "var(--color-accent)" }}>
                Table Identity & SQL Alias
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                Updates queries, algebra, output headers & visualizations
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
              <div className="sm:col-span-8 space-y-1">
                <label className="text-[11px] font-bold block" style={{ color: "var(--text-muted)" }}>
                  Relation Name
                </label>
                <input
                  type="text"
                  value={currentTableName}
                  onChange={(e) => setCurrentName(e.target.value)}
                  placeholder="e.g. Employee, Staff, Dept"
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border outline-none font-mono"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                />
              </div>

              <div className="sm:col-span-4 space-y-1">
                <label className="text-[11px] font-bold block" style={{ color: "var(--text-muted)" }}>
                  SQL Alias (1-4 chars)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={currentAlias}
                  onChange={(e) => setCurrentAlias(e.target.value)}
                  placeholder="e.g. e, s, d"
                  className="w-full px-3 py-1.5 text-xs sm:text-sm font-bold rounded-xl border outline-none font-mono uppercase"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-main)"
                  }}
                />
              </div>
            </div>
          </div>

          {/* Subview Selector: Data Tuples vs Columns & Schema */}
          <div className="flex items-center justify-between gap-2 border-b pb-2" style={{ borderColor: "var(--border-subtle)" }}>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setActiveSubView("data")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSubView === "data"
                    ? "text-white shadow-xs"
                    : "hover:bg-neutral-500/10 text-slate-400"
                }`}
                style={{
                  background: activeSubView === "data" ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))" : "transparent"
                }}
              >
                <Table className="w-3.5 h-3.5" />
                <span>Tuples & Rows ({currentRows.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveSubView("columns")}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeSubView === "columns"
                    ? "text-white shadow-xs"
                    : "hover:bg-neutral-500/10 text-slate-400"
                }`}
                style={{
                  background: activeSubView === "columns" ? "linear-gradient(135deg, var(--color-primary), var(--color-accent))" : "transparent"
                }}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>Attributes & Schema ({currentColumns.length})</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-400 hidden sm:block">
              {activeSubView === "data" ? "Edit cell values inline" : "Rename, reorder, or add columns"}
            </div>
          </div>

          {/* SUBVIEW 1: ATTRIBUTES & SCHEMA MANAGEMENT */}
          {activeSubView === "columns" && (
            <div className="space-y-4 animate-fade-in">
              <div 
                className="p-3.5 rounded-2xl border space-y-3"
                style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-cyan-400">
                    + Add New Attribute Column
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Existing rows will receive the specified default value or NULL
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-end">
                  <div className="sm:col-span-5 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Column Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. email, hire_date"
                      value={newColName}
                      onChange={(e) => setNewColName(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs rounded-xl border outline-none font-mono"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-main)"
                      }}
                    />
                  </div>

                  <div className="sm:col-span-3 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Type
                    </label>
                    <select
                      value={newColType}
                      onChange={(e) => setNewColType(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-xl border outline-none font-mono"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-main)"
                      }}
                    >
                      <option value="string">string (VARCHAR)</option>
                      <option value="number">number (INT/DEC)</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-slate-400">
                      Default Value
                    </label>
                    <input
                      type="text"
                      placeholder="NULL"
                      value={newColDefault}
                      onChange={(e) => setNewColDefault(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-xl border outline-none font-mono"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-main)"
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <button
                      type="button"
                      onClick={handleAddColumn}
                      className="w-full py-1.5 px-3 rounded-xl text-xs font-bold text-white shadow-xs cursor-pointer hover:opacity-90 transition-transform hover:scale-105 flex items-center justify-center space-x-1"
                      style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Existing Columns List */}
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-slate-400 block">
                  Current Attributes ({currentColumns.length}) — Click name to rename directly:
                </span>

                <div className="space-y-1.5">
                  {currentColumns.map((col, idx) => {
                    const isPK = col.isPrimary || col.name.toLowerCase().endsWith("_id") || col.name.toLowerCase() === "id";

                    return (
                      <div
                        key={col._colId || col.name}
                        className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-2xl border transition-all"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          borderColor: isPK ? "rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.4)" : "var(--border-subtle)"
                        }}
                      >
                        <div className="flex items-center space-x-2 flex-1 min-w-[240px]">
                          <span className="w-5 text-center font-mono text-[11px] text-slate-400 font-bold">
                            #{idx + 1}
                          </span>

                          {isPK && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded font-bold bg-amber-500/20 text-amber-400 font-mono">
                              PK
                            </span>
                          )}

                          {/* Editable Column Name */}
                          <div className="flex-1">
                            <input
                              type="text"
                              value={col.name}
                              onChange={(e) => handleRenameColumn(col.name, e.target.value)}
                              className="w-full px-2 py-1 text-xs font-bold rounded-lg border outline-none font-mono"
                              style={{
                                backgroundColor: "var(--bg-elevated)",
                                borderColor: "var(--border-subtle)",
                                color: "var(--text-main)"
                              }}
                              title="Click to rename column"
                            />
                          </div>

                          {/* Type Select */}
                          <select
                            value={col.type || "string"}
                            onChange={(e) => handleChangeColumnType(col.name, e.target.value)}
                            className="px-2 py-1 text-xs rounded-lg border outline-none font-mono"
                            style={{
                              backgroundColor: "var(--bg-elevated)",
                              borderColor: "var(--border-subtle)",
                              color: "var(--text-main)"
                            }}
                          >
                            <option value="string">string</option>
                            <option value="number">number</option>
                          </select>
                        </div>

                        {/* Reorder & Delete controls */}
                        <div className="flex items-center space-x-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => handleMoveColumn(idx, -1)}
                            className="p-1 rounded-lg border hover:bg-neutral-500/10 disabled:opacity-30 cursor-pointer"
                            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                            title="Move column left / up"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            disabled={idx === currentColumns.length - 1}
                            onClick={() => handleMoveColumn(idx, 1)}
                            className="p-1 rounded-lg border hover:bg-neutral-500/10 disabled:opacity-30 cursor-pointer"
                            style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}
                            title="Move column right / down"
                          >
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteColumn(col.name)}
                            className="p-1 rounded-lg border hover:text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer ml-1 text-slate-400"
                            style={{ borderColor: "var(--border-subtle)" }}
                            title={`Delete column ${col.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* SUBVIEW 2: TUPLES & DATA ROWS */}
          {activeSubView === "data" && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold uppercase tracking-wider font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Relation Tuples ({currentRows.length} rows)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400 italic hidden sm:inline">
                    • Blank cell or "NULL" stores real SQL NULL
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setActiveSubView("columns")}
                    className="flex items-center space-x-1 px-2.5 py-1 text-xs rounded-xl border font-semibold hover:bg-neutral-500/10 cursor-pointer"
                    style={{ borderColor: "var(--border-subtle)", color: "var(--text-main)" }}
                  >
                    <Columns className="w-3 h-3" />
                    <span>Edit Columns</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="flex items-center space-x-1 px-3 py-1 text-xs rounded-xl text-white font-bold shadow-xs hover:opacity-90 cursor-pointer transition-transform hover:scale-105"
                    style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>+ Add Row</span>
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto rounded-2xl border" style={{ borderColor: "var(--border-subtle)" }}>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr 
                      className="border-b text-[11px] font-mono"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-subtle)",
                        color: "var(--text-muted)"
                      }}
                    >
                      <th className="p-2.5 w-10 text-center">#</th>
                      {currentColumns.map((c) => {
                        const isPK = c.isPrimary || c.name.toLowerCase().endsWith("_id") || c.name.toLowerCase() === "id";
                        const isEditingThis = editingHeaderCol === c.name;
                        return (
                          <th key={c.name} className="p-2 font-bold whitespace-nowrap">
                            {isEditingThis ? (
                              <input
                                type="text"
                                autoFocus
                                defaultValue={c.name}
                                onBlur={(e) => {
                                  handleRenameColumn(c.name, e.target.value);
                                  setEditingHeaderCol(null);
                                }}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleRenameColumn(c.name, e.currentTarget.value);
                                    setEditingHeaderCol(null);
                                  } else if (e.key === "Escape") {
                                    setEditingHeaderCol(null);
                                  }
                                }}
                                className="px-1.5 py-0.5 text-xs rounded border font-mono outline-none"
                                style={{
                                  backgroundColor: "var(--bg-surface)",
                                  borderColor: "var(--color-primary)",
                                  color: "var(--text-main)"
                                }}
                              />
                            ) : (
                              <div
                                onClick={() => setEditingHeaderCol(c.name)}
                                className="flex items-center space-x-1 cursor-pointer hover:opacity-80 group"
                                title="Click to rename attribute"
                              >
                                <span className={isPK ? "text-amber-400" : ""}>{c.name}</span>
                                {isPK && <span className="text-[9px] text-amber-400 ml-0.5 font-normal">(PK)</span>}
                                <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 text-slate-400 transition-opacity" />
                              </div>
                            )}
                          </th>
                        );
                      })}
                      <th className="p-2.5 w-12 text-center">Del</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                    {currentRows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="hover:bg-neutral-500/5 transition-colors">
                        <td className="p-2 text-center font-mono text-[11px] text-slate-400">
                          {rowIdx + 1}
                        </td>
                        {currentColumns.map((col) => {
                          const isNull = row[col.name] === null || row[col.name] === undefined;
                          const isPK = col.isPrimary || col.name.toLowerCase().endsWith("_id") || col.name.toLowerCase() === "id";

                          return (
                            <td key={col.name} className="p-1.5">
                              <div className="relative flex items-center min-w-[100px]">
                                <input
                                  type="text"
                                  value={isNull ? "" : String(row[col.name])}
                                  placeholder="NULL"
                                  onChange={(e) => handleCellChange(rowIdx, col.name, e.target.value, col.type)}
                                  className={`w-full px-2.5 py-1 text-xs rounded-xl border font-mono outline-none transition-colors ${
                                    isNull ? "italic text-slate-400" : ""
                                  }`}
                                  style={{
                                    backgroundColor: "var(--bg-surface)",
                                    borderColor: isPK ? "rgba(var(--primary-r), var(--primary-g), var(--primary-b), 0.4)" : "var(--border-subtle)",
                                    color: isNull ? "var(--semantic-null)" : "var(--text-main)"
                                  }}
                                />
                                {isNull && (
                                  <span className="absolute right-2 px-1 rounded text-[9px] font-mono font-bold bg-neutral-800 text-neutral-400 pointer-events-none">
                                    NULL
                                  </span>
                                )}
                              </div>
                            </td>
                          );
                        })}
                        <td className="p-1.5 text-center">
                          <button
                            type="button"
                            onClick={() => handleDeleteRow(rowIdx)}
                            className="p-1.5 hover:text-rose-500 rounded-lg transition-colors text-slate-400 hover:bg-rose-500/10 cursor-pointer"
                            title="Delete tuple"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div 
          className="p-4 border-t flex flex-wrap items-center justify-between gap-3"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <div className="text-xs font-mono text-slate-400">
            {isMultiTable ? (
              <span>Modifying {nameA} ({rowsA.length} tuples, {columnsA.length} cols) & {nameB} ({rowsB.length} tuples, {columnsB.length} cols)</span>
            ) : (
              <span>Modifying {currentTableName} ({currentRows.length} tuples)</span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity border cursor-pointer"
              style={{ borderColor: "var(--border-subtle)", color: "var(--text-muted)", backgroundColor: "var(--bg-surface)" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveAndApply}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:scale-105 flex items-center space-x-1.5 cursor-pointer"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save & Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
