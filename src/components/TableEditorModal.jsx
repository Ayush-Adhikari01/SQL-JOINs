import React, { useState } from "react";
import { Plus, Trash2, Table, AlertCircle, Check, X } from "lucide-react";

export function TableEditorModal({
  isOpen,
  onClose,
  initialTable,
  onSave,
  tableNameLabel = "Table A"
}) {
  if (!isOpen) return null;

  const [tableName, setTableName] = useState(initialTable.name || "CustomTable");
  const [alias, setAlias] = useState(initialTable.alias || "t");
  const [columns, setColumns] = useState(
    initialTable.columns ? JSON.parse(JSON.stringify(initialTable.columns)) : [
      { name: "id", label: "ID", type: "number", isPrimary: true },
      { name: "name", label: "Name", type: "string" }
    ]
  );
  const [rows, setRows] = useState(
    initialTable.rows ? JSON.parse(JSON.stringify(initialTable.rows)) : []
  );

  const [newColName, setNewColName] = useState("");
  const [newColType, setNewColType] = useState("string");
  const [errorMsg, setErrorMsg] = useState("");

  const handleAddColumn = () => {
    const cleanName = newColName.trim().replace(/\s+/g, "_").toLowerCase();
    if (!cleanName) {
      setErrorMsg("Column name cannot be blank.");
      return;
    }
    if (columns.some(c => c.name === cleanName)) {
      setErrorMsg(`Column "${cleanName}" already exists.`);
      return;
    }

    setColumns([...columns, { name: cleanName, label: cleanName, type: newColType }]);
    setRows(rows.map(r => ({ ...r, [cleanName]: "" })));
    setNewColName("");
    setErrorMsg("");
  };

  const handleRemoveColumn = (colName) => {
    if (columns.length <= 1) {
      setErrorMsg("A relation must have at least one column.");
      return;
    }
    setColumns(columns.filter(c => c.name !== colName));
    setRows(rows.map(r => {
      const copy = { ...r };
      delete copy[colName];
      return copy;
    }));
  };

  const handleAddRow = () => {
    const newRow = {};
    columns.forEach(c => {
      newRow[c.name] = c.type === "number" ? (rows.length + 1) : `Sample ${rows.length + 1}`;
    });
    setRows([...rows, newRow]);
  };

  const handleCellChange = (rowIndex, colName, value, type) => {
    const updated = [...rows];
    let parsedVal = value;
    if (type === "number") {
      parsedVal = value === "" ? null : Number(value);
    } else {
      parsedVal = value === "" ? null : value;
    }
    updated[rowIndex][colName] = parsedVal;
    setRows(updated);
  };

  const handleDeleteRow = (rowIndex) => {
    setRows(rows.filter((_, idx) => idx !== rowIndex));
  };

  const handleSaveAndApply = () => {
    if (columns.length === 0) {
      setErrorMsg("At least one column is required.");
      return;
    }
    if (rows.length === 0) {
      setErrorMsg("Add at least one tuple (row) to visualize.");
      return;
    }

    onSave({
      name: tableName.trim() || "Table",
      alias: alias.trim() || "t",
      columns,
      rows
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="rounded-3xl w-full max-w-4xl max-h-[90vh] flex flex-col border shadow-2xl overflow-hidden transition-all"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-subtle)",
          color: "var(--text-main)"
        }}
      >
        {/* Modal Header */}
        <div 
          className="p-6 border-b flex items-center justify-between"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <div className="flex items-center space-x-3">
            <div 
              className="p-2 rounded-xl text-white shadow-xs"
              style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
            >
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">
                Customize Relation ({tableNameLabel})
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Create or edit schema columns, insert tuples, and manipulate dataset records.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:opacity-75 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Relation Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                Relation / Table Name
              </label>
              <input
                type="text"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border font-mono outline-none"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)"
                }}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                SQL Alias (e.g., e, d, t1)
              </label>
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border font-mono outline-none"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)"
                }}
              />
            </div>
          </div>

          {/* Columns Editor */}
          <div 
            className="space-y-3 p-4 rounded-2xl border"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-subtle)"
            }}
          >
            <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
              Relational Schema Attributes (Columns)
            </h4>

            <div className="flex flex-wrap gap-2">
              {columns.map((c) => (
                <div
                  key={c.name}
                  className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl border text-xs"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-subtle)"
                  }}
                >
                  <span className="font-mono font-bold" style={{ color: "var(--text-main)" }}>{c.name}</span>
                  <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>({c.type})</span>
                  <button
                    onClick={() => handleRemoveColumn(c.name)}
                    className="hover:text-rose-500 ml-1 text-slate-400"
                    title="Remove column"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: "var(--border-subtle)" }}>
              <input
                type="text"
                placeholder="New column name (e.g. dept_id)"
                value={newColName}
                onChange={(e) => setNewColName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs rounded-lg border font-mono outline-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)"
                }}
              />
              <select
                value={newColType}
                onChange={(e) => setNewColType(e.target.value)}
                className="px-3 py-1.5 text-xs rounded-lg border outline-none"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)"
                }}
              >
                <option value="string">String (VARCHAR)</option>
                <option value="number">Number (INT)</option>
              </select>
              <button
                type="button"
                onClick={handleAddColumn}
                className="flex items-center space-x-1 px-3.5 py-1.5 text-xs rounded-lg text-white font-bold shadow-xs hover:opacity-90"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Column</span>
              </button>
            </div>
          </div>

          {/* Rows Data Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Tuples ({rows.length} records)
              </h4>
              <button
                type="button"
                onClick={handleAddRow}
                className="flex items-center space-x-1 px-3 py-1.5 text-xs rounded-lg text-white font-bold shadow-xs hover:opacity-90"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Insert New Tuple</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border" style={{ borderColor: "var(--border-subtle)" }}>
              <table className="w-full text-left text-xs">
                <thead 
                  className="border-b"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-subtle)",
                    color: "var(--text-muted)"
                  }}
                >
                  <tr>
                    <th className="p-2 w-10 text-center font-mono">#</th>
                    {columns.map((c) => (
                      <th key={c.name} className="p-2 font-mono">{c.name}</th>
                    ))}
                    <th className="p-2 w-12 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                  {rows.map((row, rowIdx) => (
                    <tr key={rowIdx} className="hover:opacity-90">
                      <td className="p-2 text-center font-mono text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {rowIdx + 1}
                      </td>
                      {columns.map((col) => (
                        <td key={col.name} className="p-1.5">
                          <input
                            type={col.type === "number" ? "number" : "text"}
                            value={row[col.name] === null || row[col.name] === undefined ? "" : row[col.name]}
                            placeholder="NULL"
                            onChange={(e) => handleCellChange(rowIdx, col.name, e.target.value, col.type)}
                            className="w-full px-2 py-1 text-xs rounded border font-mono outline-none"
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              borderColor: "var(--border-subtle)",
                              color: "var(--text-main)"
                            }}
                          />
                        </td>
                      ))}
                      <td className="p-1.5 text-center">
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(rowIdx)}
                          className="p-1 hover:text-rose-500 rounded transition-colors text-slate-400"
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
        </div>

        {/* Modal Footer */}
        <div 
          className="p-4 border-t flex items-center justify-end space-x-3"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold hover:opacity-80 transition-opacity"
            style={{ color: "var(--text-muted)" }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveAndApply}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white shadow-xs transition-all hover:scale-105 flex items-center space-x-1"
            style={{ background: "linear-gradient(135deg, var(--color-primary), var(--color-accent))" }}
          >
            <Check className="w-3.5 h-3.5" />
            <span>Apply Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
}
