# Join Operations Visualizer

> **Digital Assignment for Database Management Systems (DBMS)**  
> **Team Name:** Team Kapa  
> **Guided By:** Dr. Swaminathan A (Assistant Professor)

---

## 👥 Team Kapa
1. **Ayush Adhikari** — `25BCE5324` (Lead Full-Stack Developer & UI/UX Architect)
2. **Parth Malik** — `25BCE5386` (Database Systems Analyst & Logic Engine Specialist)
3. **Keshav Agarwal** — `25BCE5503` (Frontend Engineer & Curriculum Content Researcher)

---

## 📌 Problem Statement
*"Students often learn SQL JOIN operations through syntax and static examples, making it difficult to understand how records are matched, retained, and combined during execution. The **Join Operations Visualizer** provides an interactive environment where students can enter relational data, select different JOIN operations, observe record matching visually, inspect generated SQL and relational algebra, and understand the resulting dataset step by step."*

---

## 🎯 Objectives
- Provide an intuitive, educational interactive environment for students to observe join operations dynamically.
- Support in-memory execution of **INNER**, **LEFT OUTER**, **RIGHT OUTER**, **FULL OUTER**, **CROSS**, **SELF**, and **NATURAL** joins.
- Bridge abstract Codd relational algebra ($\sigma, \times, \bowtie$) with real ANSI SQL execution.
- Allow students to manipulate custom relational schemas, add columns, and insert/delete rows.
- Deliver automated test suites with edge case verification (NULLs, Cartesian explosions, empty tables).
- Enable instantaneous client-side PDF execution report generation with official Team Kapa branding.

---

## 🚀 Key Features

### 1. In-Browser Relational JOIN Engine
- Real-time computation of join conditions using nested loop scan semantics.
- Proper SQL three-valued logic compliance: `NULL = NULL` correctly evaluates to UNKNOWN/FALSE, meaning NULL keys never match in equijoins.
- Automatic preservation of unmatched tuples and padded NULL columns for outer joins.

### 2. Supported Join Types
- **INNER JOIN:** Retains only tuples satisfying key equality across both relations.
- **LEFT OUTER JOIN:** Preserves all left tuples; pads unmatched right columns with NULL.
- **RIGHT OUTER JOIN:** Preserves all right tuples; pads unmatched left columns with NULL.
- **FULL OUTER JOIN:** Preserves all tuples from both relations.
- **CROSS JOIN:** Pure Cartesian product ($|A| \times |B|$ combinations).
- **SELF JOIN:** Correlates a table against an aliased instance of itself (hierarchies, manager-employee mappings).
- **NATURAL JOIN:** Implicitly detects common attribute names and projects duplicate keys only once.

### 3. Interactive Visualizer & Venn Geometry
- Dynamic SVG set diagrams that update per selected join type.
- Row provenance tracking: `MATCH`, `LEFT OUTER (NULL PAD)`, `RIGHT OUTER (NULL PAD)`, and `CARTESIAN`.
- Search, filter, and sort capabilities on source relations and output relations.

### 4. Step-by-Step Execution Stepper
- Play, Pause, Next Step, Previous Step, and Reset controls.
- Step-by-step breakdown: Relation Ingestion $\to$ Key Resolution $\to$ Predicate Probing $\to$ Outer Preservation $\to$ Final Synthesis.

### 5. Standard SQL Generator & Relational Algebra
- Live ANSI SQL query generation with `COPY SQL` button.
- Theoretical relational algebra formalisms explaining mathematical foundations.

### 6. Interactive Custom Relation Editor
- Modal dialog to create new columns, specify data types (`string`, `number`), insert new tuples, edit cells in real-time, or delete rows.

### 7. "Predict the Result" Practice Quiz
- Interactive DBMS learning assessment with multiple-choice questions, theoretical explanations, score tracking, and celebratory confetti.

### 8. Automated Unit Test Suite (11 Test Cases)
- One-click test runner checking:
  - TC-01: INNER JOIN matching
  - TC-02: INNER JOIN disjoint sets
  - TC-03: LEFT JOIN null extension
  - TC-04: RIGHT JOIN null extension
  - TC-05: FULL OUTER JOIN preservation
  - TC-06: 1:N duplicate join key fan-outs
  - TC-07: NULL value three-valued logic
  - TC-08: Empty table edge cases
  - TC-09: Missing join key validation
  - TC-10: CROSS JOIN Cartesian product
  - TC-11: SELF JOIN reflexive mapping

### 9. PDF & CSV Report Generator
- Instant client-side download of a formatted PDF report with project metadata, team details, execution statistics, generated SQL, step logs, and complete computed records.

### 10. Day & Night Mode
- System-aware and manual Day/Night toggle with `localStorage` persistence.

---

## 🛠️ Technology Stack
- **Frontend Framework:** React 19 + Vite
- **Styling:** Tailwind CSS v4
- **Icons:** Lucide React
- **PDF Generation:** jsPDF + jsPDF-AutoTable
- **Visual Micro-interactions:** Canvas-Confetti

---

## 💻 How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Build for production
npm run build
```

---
w
## Evaluation Rubric Alignments
1. **Problem Understanding :** Directly addwresses abstract relational concepts with visual record mapping.
2. **Website :** Complete modern React SPA with Day/Night theming and responsive design.
3. **UX :** Clean feedback, provenance badges, search filters, and smooth modal editors.
4. **Implementation :** Pure JavaScript relational engine supporting 7 join operations.
5. **Testing :** Built-in automated test suite covering 11 critical edge cases.
6. **Project Progress :** Modular architecture with separation of UI, engine, sample data, and exporters.
7. **Demo & Explanation :** Step-by-step stepper and Learn page covering syllabus topics A–O.
8. **Creativity :** Interactive row provenance, Venn diagrams, and Practice Quiz game.
9. **Innovation :** Instant client-side PDF execution report generation with team branding.

---

© 2026 Team Kapa — Ayush Adhikari, Parth Malik, Keshav Agarwal | Guided by Dr. Swaminathan A
