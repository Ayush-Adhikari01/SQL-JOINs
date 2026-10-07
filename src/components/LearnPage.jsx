import React, { useState } from "react";
import { BookOpen, Video, Layers, Split, HelpCircle } from "lucide-react";

export function LearnPage({ isDark = false }) {
  const [activeSection, setActiveSection] = useState("what_is_join");

  const sections = [
    { id: "what_is_join", title: "A. What is a JOIN?" },
    { id: "why_required", title: "B. Why are JOINs Required?" },
    { id: "tables_relationships", title: "C. Tables & Relationships (ER Model)" },
    { id: "keys", title: "D. Primary Key & Foreign Key" },
    { id: "inner_join", title: "E. INNER JOIN Explained" },
    { id: "left_join", title: "F. LEFT OUTER JOIN Explained" },
    { id: "right_join", title: "G. RIGHT OUTER JOIN Explained" },
    { id: "full_join", title: "H. FULL OUTER JOIN Explained" },
    { id: "cross_join", title: "I. CROSS JOIN (Cartesian Product)" },
    { id: "self_join", title: "J. SELF JOIN (Hierarchical Queries)" },
    { id: "natural_join", title: "K. NATURAL JOIN" },
    { id: "join_vs_union", title: "L. JOIN vs UNION (Core Difference)" },
    { id: "common_mistakes", title: "M. Common JOIN Pitfalls" },
    { id: "real_world", title: "N. Real-World Industry Applications" },
    { id: "video_resources", title: "O. Educational Video & References" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-16">
      {/* Table of Contents Navigation */}
      <div className="lg:col-span-1 space-y-2">
        <div 
          className="sticky top-20 border rounded-2xl p-4 shadow-xs transition-colors"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)"
          }}
        >
          <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
            <BookOpen className="w-4 h-4 text-violet-500" />
            <span>DBMS Curriculum Syllabus</span>
          </div>

          <div className="space-y-1 max-h-[70vh] overflow-y-auto pr-1">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all"
                style={{
                  backgroundColor: activeSection === s.id ? "var(--color-primary)" : "transparent",
                  color: activeSection === s.id ? "#ffffff" : "var(--text-main)"
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Educational Article Content */}
      <div className="lg:col-span-3 space-y-8">
        <div 
          className="border rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 transition-colors"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-subtle)"
          }}
        >
          {activeSection === "what_is_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>A. What is a SQL JOIN?</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                In relational database management systems (RDBMS), a <strong>JOIN</strong> is a relational operation that matches and combines rows from two or more tables based on a related attribute or key between them.
              </p>
              <div 
                className="p-4 rounded-2xl border text-xs leading-relaxed"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)",
                  color: "var(--text-main)"
                }}
              >
                <strong>Formal Definition:</strong> If R(A_1, ..., A_n) and S(B_1, ..., B_m) are two relations, the theta-join R ⋈_θ S is defined as σ_θ(R × S), where θ is a predicate condition (such as equality R.key = S.key) evaluated over the Cartesian product.
              </div>
            </div>
          )}

          {activeSection === "why_required" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>B. Why are JOINs Required?</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Relational databases are purposefully designed according to <strong>Database Normalization</strong> (1NF, 2NF, 3NF, BCNF) to:
              </p>
              <ul className="list-disc list-inside space-y-2 text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
                <li>Eliminate data redundancy (storing the department name 10,000 times for each employee wastes disk space).</li>
                <li>Prevent insertion anomalies (adding a department before any employee joins).</li>
                <li>Prevent deletion anomalies (deleting all employees does not inadvertently delete the department record).</li>
                <li>Prevent update anomalies (renaming a department requires updating only a single row).</li>
              </ul>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Because data is partitioned cleanly into normalized tables, <strong>JOINs are the mechanism by which the application reconstructs meaningful combined datasets at query runtime.</strong>
              </p>
            </div>
          )}

          {activeSection === "tables_relationships" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>C. Tables and Relationships</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <h4 className="font-bold text-xs uppercase text-blue-500 mb-1">One-to-One (1:1)</h4>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Each record in Table A matches at most one record in Table B (e.g., Person and Passport).</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <h4 className="font-bold text-xs uppercase text-violet-500 mb-1">One-to-Many (1:N)</h4>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>A single record in Department relates to multiple records in Employee. The most common join structure.</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <h4 className="font-bold text-xs uppercase text-pink-500 mb-1">Many-to-Many (M:N)</h4>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>Students and Courses. Handled via an associative/junction relation.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "keys" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>D. Primary Key & Foreign Key</h2>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <span className="font-mono font-bold text-xs text-blue-500">PRIMARY KEY (PK):</span>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>A column or set of columns uniquely identifying every row in a table. Must never contain NULL values.</p>
                </div>
                <div className="p-3.5 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <span className="font-mono font-bold text-xs text-violet-500">FOREIGN KEY (FK):</span>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>A column in a child table whose values refer to a Primary Key in a parent table, enforcing referential integrity.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "inner_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>E. INNER JOIN</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                An <strong>INNER JOIN</strong> returns only the records where the join condition is satisfied in BOTH tables. Unmatched rows from both sides are discarded.
              </p>
              <pre 
                className="p-4 rounded-xl text-xs font-mono overflow-x-auto border shadow-xs leading-relaxed"
                style={{
                  backgroundColor: isDark ? "#111111" : "#FFFFFF",
                  color: isDark ? "#F5F5F5" : "#111111",
                  borderColor: isDark ? "#292929" : "#D1D5DB"
                }}
              >
{`SELECT e.employee_name, d.department_name
FROM Employee e
INNER JOIN Department d
ON e.department_id = d.department_id;`}
              </pre>
            </div>
          )}

          {activeSection === "left_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>F. LEFT OUTER JOIN</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A <strong>LEFT OUTER JOIN</strong> returns ALL rows from the left table, plus matched rows from the right table. For left rows having no match in the right table, columns from the right table are padded with <code>NULL</code>.
              </p>
            </div>
          )}

          {activeSection === "right_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>G. RIGHT OUTER JOIN</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A <strong>RIGHT OUTER JOIN</strong> returns ALL rows from the right table, and matched rows from the left table. For right rows without matches, left columns are populated with <code>NULL</code>.
              </p>
            </div>
          )}

          {activeSection === "full_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>H. FULL OUTER JOIN</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A <strong>FULL OUTER JOIN</strong> preserves all tuples from both relations. When no match exists on either side, NULLs are substituted.
              </p>
            </div>
          )}

          {activeSection === "cross_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>I. CROSS JOIN (Cartesian Product)</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                Produces the mathematical Cartesian product (R × S). Every row of Table A is paired with every row of Table B without a filtering condition.
              </p>
            </div>
          )}

          {activeSection === "self_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>J. SELF JOIN</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A <strong>SELF JOIN</strong> joins a table to itself using aliases to resolve hierarchical or unary relationships (such as employee reporting lines).
              </p>
            </div>
          )}

          {activeSection === "natural_join" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>K. NATURAL JOIN</h2>
              <p className="text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                A <strong>NATURAL JOIN</strong> automatically joins tables based on columns with identical names in both tables and eliminates redundant duplicate key columns from projection.
              </p>
            </div>
          )}

          {activeSection === "join_vs_union" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>L. JOIN vs UNION</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left border rounded-xl" style={{ borderColor: "var(--border-subtle)" }}>
                  <thead className="border-b" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                    <tr>
                      <th className="p-3">Dimension</th>
                      <th className="p-3">SQL JOIN</th>
                      <th className="p-3">SQL UNION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y" style={{ borderColor: "var(--border-subtle)" }}>
                    <tr>
                      <td className="p-3 font-semibold">Direction</td>
                      <td className="p-3">Combines tables <strong>horizontally</strong> (adds columns).</td>
                      <td className="p-3">Combines result sets <strong>vertically</strong> (adds rows).</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Column Requirement</td>
                      <td className="p-3">Columns can have different names and schemas.</td>
                      <td className="p-3">Must have the exact same number and compatible data types.</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-semibold">Relational Equivalent</td>
                      <td className="p-3">Theta-selection over Cartesian product (σ_θ(R × S)).</td>
                      <td className="p-3">Set Union (R ∪ S).</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeSection === "common_mistakes" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>M. Common JOIN Pitfalls & Solutions</h2>
              <div className="space-y-3">
                {[
                  {
                    err: "Accidental Cartesian Product",
                    cause: "Forgetting the ON clause or typing WHERE condition on the wrong table alias.",
                    fix: "Always write explicit ANSI SQL JOIN syntax rather than comma joins (FROM A, B)."
                  },
                  {
                    err: "NULL Equality Failure",
                    cause: "Assuming NULL = NULL evaluates to TRUE in SQL.",
                    fix: "In SQL three-valued logic, NULL = NULL evaluates to UNKNOWN/FALSE. Use IS NOT DISTINCT FROM if matching NULLs is required."
                  },
                  {
                    err: "Unintended Row Duplication",
                    cause: "Joining on non-unique columns resulting in unexpected fan-out multiplication.",
                    fix: "Verify cardinality; check whether right table has multiple rows per key."
                  }
                ].map((item, idx) => (
                  <div 
                    key={idx} 
                    className="p-4 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-subtle)"
                    }}
                  >
                    <div className="font-bold text-xs text-rose-500">{item.err}</div>
                    <div className="text-xs mt-1" style={{ color: "var(--text-muted)" }}><strong>Cause:</strong> {item.cause}</div>
                    <div className="text-xs text-emerald-500 mt-0.5"><strong>Remedy:</strong> {item.fix}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "real_world" && (
            <div className="space-y-4">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>N. Real-World Applications</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <h4 className="font-bold text-blue-500 mb-1">Financial Ledgers & Banking</h4>
                  <p style={{ color: "var(--text-muted)" }}>INNER JOIN between Accounts and Transactions to calculate statement balances with cryptographic verification.</p>
                </div>
                <div className="p-4 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)" }}>
                  <h4 className="font-bold text-violet-500 mb-1">Healthcare Hospital Information</h4>
                  <p style={{ color: "var(--text-muted)" }}>LEFT JOIN Patients with Clinical Prescriptions to identify admitted patients currently missing required medications.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "video_resources" && (
            <div className="space-y-6">
              <h2 className="text-2xl font-black" style={{ color: "var(--text-main)" }}>O. Educational Video & Verified Academic References</h2>
              
              <div 
                className="rounded-2xl border overflow-hidden p-4 space-y-3"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-subtle)"
                }}
              >
                <div className="flex items-center space-x-2 text-xs font-bold text-blue-500 uppercase">
                  <Video className="w-4 h-4" />
                  <span>Public Educational Video Resource: SQL JOINs In 10 Minutes</span>
                </div>
                <div 
                  className="aspect-video w-full rounded-xl overflow-hidden border flex items-center justify-center"
                  style={{
                    backgroundColor: "#000000",
                    borderColor: "var(--border-subtle)"
                  }}
                >
                  <iframe
                    className="w-full h-full"
                    src="https://www.youtube-nocookie.com/embed/9yeOJ0ZMUYw"
                    title="SQL Joins Explained"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Curated video guide covering INNER, LEFT, RIGHT, and FULL OUTER joins with relational diagrams.
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <h4 className="text-sm font-bold" style={{ color: "var(--text-main)" }}>Authoritative References & Textbooks</h4>
                <ul className="space-y-2 text-xs">
                  <li className="p-3 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                    📚 <strong>Silberschatz, A., Korth, H. F., & Sudarshan, S.</strong> (2020). <em>Database System Concepts</em> (7th ed.). McGraw-Hill Education. Chapter 2 (Relational Model) & Chapter 3 (SQL).
                  </li>
                  <li className="p-3 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                    📚 <strong>Elmasri, R., & Navathe, S. B.</strong> (2016). <em>Fundamentals of Database Systems</em> (7th ed.). Pearson. Chapter 8 (SQL Relational Database Standard).
                  </li>
                  <li className="p-3 rounded-xl border" style={{ backgroundColor: "var(--bg-elevated)", borderColor: "var(--border-subtle)", color: "var(--text-muted)" }}>
                    🌐 <strong>PostgreSQL Global Development Group.</strong> (2026). <em>PostgreSQL 16 Documentation: Table Expressions and Joins</em>. Available at: postgresql.org/docs
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
