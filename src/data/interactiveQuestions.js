/**
 * Curated Comprehensive Question Bank for Interactive Practice & Conceptual Drills
 * Specifically focused on Relational Algebra & Database Management Systems JOIN Operations.
 * Contains 116 categorized, verified practice questions with rich explanations.
 */

export const INTERACTIVE_QUESTIONS = [
  {
    "id": "INT-001",
    "topic": "INNER JOIN",
    "subtopic": "Basic Equijoin Matching",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given Table A with 3 rows (IDs: 1, 2, 3) and Table B with 3 rows (IDs: 2, 3, 4). Which IDs will appear in the output of:\nSELECT A.id FROM A INNER JOIN B ON A.id = B.id;",
    "options": [
      {
        "id": "A",
        "text": "1, 2, 3, 4",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "2, 3",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "1, 4",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "1, 2, 3",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "INNER JOIN strictly retains only tuples that satisfy the join condition (A.id = B.id). The common values between {1, 2, 3} and {2, 3, 4} are 2 and 3. IDs 1 and 4 do not match and are eliminated."
  },
  {
    "id": "INT-002",
    "topic": "INNER JOIN",
    "subtopic": "Multiple Duplicate Matching (Fan-Out)",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table R has 2 rows, both with key = 5. Table S has 3 rows, all with key = 5. How many rows are returned by:\nSELECT * FROM R INNER JOIN S ON R.key = S.key;",
    "options": [
      {
        "id": "A",
        "text": "2",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "3",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "5",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "6",
        "isCorrect": true
      }
    ],
    "answer": "6",
    "explanation": "In an INNER JOIN, every row from the left table is paired with every matching row in the right table. Since both rows of R match all 3 rows of S, the total row count is 2 × 3 = 6."
  },
  {
    "id": "INT-003",
    "topic": "INNER JOIN",
    "subtopic": "Predicate Filtering vs Join Condition",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "For an INNER JOIN, does placing an additional filter condition in the ON clause produce a different result set compared to placing it in the WHERE clause?\nQuery 1: SELECT * FROM A JOIN B ON A.id = B.id AND B.status = 'active';\nQuery 2: SELECT * FROM A JOIN B ON A.id = B.id WHERE B.status = 'active';",
    "options": [
      {
        "id": "A",
        "text": "Yes, Query 1 returns more rows because ON is executed before WHERE",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "No, for an INNER JOIN both queries produce logically identical results",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Yes, Query 2 returns NULLs for inactive rows whereas Query 1 omits them",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Query 1 results in a syntax error in ANSI SQL",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "For an INNER JOIN, any row that fails either the join predicate or the filter predicate is excluded from the final output. Therefore, placing a filter in the ON clause vs the WHERE clause is logically equivalent (unlike in an OUTER JOIN, where ON filters do not prevent preservation of outer rows)."
  },
  {
    "id": "INT-004",
    "topic": "INNER JOIN",
    "subtopic": "Non-Equi Inner Join",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Consider Table Employees(emp_id, salary) and Table SalaryGrades(grade, min_salary, max_salary).\nWhich join condition correctly assigns each employee to their grade?",
    "options": [
      {
        "id": "A",
        "text": "ON Employees.salary = SalaryGrades.min_salary",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "ON Employees.salary BETWEEN SalaryGrades.min_salary AND SalaryGrades.max_salary",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "USING (salary)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "NATURAL JOIN SalaryGrades",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "A non-equi inner join uses comparison operators other than strict equality. Using BETWEEN min_salary AND max_salary matches each employee's continuous salary amount against discrete grade brackets."
  },
  {
    "id": "INT-005",
    "topic": "INNER JOIN",
    "subtopic": "Relational Algebra Equijoin Definition",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In Relational Algebra, how is the Equijoin R ⋈_{R.A = S.B} S formally defined in terms of primitive operators?",
    "options": [
      {
        "id": "A",
        "text": "σ_{R.A = S.B} (R × S)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Π_{R.A, S.B} (R ∪ S)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "σ_{R.A = S.B} (R ∩ S)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "ρ_{R.A = S.B} (R - S)",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "By Codd's definition, any join is a derived operator: the Theta Join (and Equijoin) is defined as a Selection condition applied on top of the Cartesian Product: σ_condition (R × S)."
  },
  {
    "id": "INT-006",
    "topic": "INNER JOIN",
    "subtopic": "Three Table Inner Join",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given tables A, B, and C with 10, 5, and 2 rows respectively. If A INNER JOIN B produces 8 rows, and the result INNER JOIN C produces 4 rows, what is the cardinality of (A JOIN B JOIN C)?",
    "options": [
      {
        "id": "A",
        "text": "100",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "8",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "4",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "2",
        "isCorrect": false
      }
    ],
    "answer": "C",
    "explanation": "Because natural and inner joins are associative: ((A ⋈ B) ⋈ C) = A ⋈ B ⋈ C. The intermediate relation (A ⋈ B) contains 8 tuples. Joining this intermediate result with C yields 4 tuples."
  },
  {
    "id": "INT-007",
    "topic": "INNER JOIN",
    "subtopic": "Composite Key Equijoin",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "When joining tables on composite primary-foreign keys (e.g. dept_id AND location_id), how should the ON clause be constructed?",
    "options": [
      {
        "id": "A",
        "text": "ON A.dept_id = B.dept_id OR A.location_id = B.location_id",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "ON A.dept_id = B.dept_id AND A.location_id = B.location_id",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "ON (A.dept_id, B.dept_id) = (A.location_id, B.location_id)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "ON A.dept_id = B.location_id",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Composite keys require all component attributes to match simultaneously, so they must be combined with the logical AND conjunction."
  },
  {
    "id": "INT-008",
    "topic": "INNER JOIN",
    "subtopic": "Empty Relation Participation",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If Table R contains 100 tuples and Table S contains 0 tuples (empty table), how many tuples does (R INNER JOIN S ON R.id = S.id) return?",
    "options": [
      {
        "id": "A",
        "text": "100",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "0",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "50",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "NULL",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "For an inner join tuple to appear in the result, it must find a corresponding matching tuple in the other relation. Since S has 0 tuples, no pairs can satisfy the predicate, yielding exactly 0 tuples."
  },
  {
    "id": "INT-009",
    "topic": "INNER JOIN",
    "subtopic": "Cross-Schema Attribute Naming",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In SQL, if relation R has columns (id, name) and relation S has columns (id, title), what happens if you run: SELECT id FROM R INNER JOIN S ON R.id = S.id;",
    "options": [
      {
        "id": "A",
        "text": "It returns the id column from table R automatically",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "It throws a syntax error: column reference 'id' is ambiguous",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "It returns two id columns",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "It defaults to S.id",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Because both tables contain a column named 'id', referencing 'id' in SELECT without a table qualifier (e.g. R.id or S.id) creates an ambiguous column reference error in SQL engines."
  },
  {
    "id": "INT-010",
    "topic": "INNER JOIN",
    "subtopic": "Commutativity of Inner Join",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Is the INNER JOIN operation commutative in terms of the set of matching tuple pairs produced?\n(i.e. does R INNER JOIN S produce the same matching entities as S INNER JOIN R?)",
    "options": [
      {
        "id": "A",
        "text": "Yes, the matched pairs are identical (order of columns in schema may vary)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "No, INNER JOIN is non-commutative",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Only if R and S have identical schemas",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only if keys are unique in both tables",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "INNER JOIN is commutative: (R ⋈ S) ≡ (S ⋈ R) up to column permutation in the result relation. The set of matching logical entities is identical."
  },
  {
    "id": "INT-011",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Unmatched Rows & NULL Extension",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Table Employees has 10 rows. Table Departments has 4 rows. If 2 employees have department_id values that do not exist in Departments, how many rows will (Employees LEFT JOIN Departments ON Employees.dept_id = Departments.dept_id) contain (assuming dept_id is unique in Departments)?",
    "options": [
      {
        "id": "A",
        "text": "8",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "10",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "12",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "4",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "A LEFT OUTER JOIN preserves every tuple from the left table (Employees). The 8 matching employees match 1-to-1, and the 2 unmatched employees are retained with NULLs for all Departments attributes. Total = 8 + 2 = 10 rows."
  },
  {
    "id": "INT-012",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Anti-Join Pattern with IS NULL",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What does the following query accomplish?\nSELECT A.*\nFROM A LEFT JOIN B ON A.id = B.id\nWHERE B.id IS NULL;",
    "options": [
      {
        "id": "A",
        "text": "Finds all rows in A that have a matching row in B",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "Finds all rows in A that DO NOT have a matching row in B (Anti-Join)",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Finds rows where B.id was stored as NULL in the original table B",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Returns an empty result set because B.id is an index key",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "This is the classic SQL Anti-Join idiom. LEFT JOIN preserves unmatched rows from A by padding B's columns with NULL. The WHERE B.id IS NULL predicate filters out all matched rows, leaving only rows from A with no match in B."
  },
  {
    "id": "INT-013",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "ON Clause vs WHERE Clause in Outer Join",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Consider:\nQ1: SELECT * FROM A LEFT JOIN B ON A.id = B.id AND B.flag = 1;\nQ2: SELECT * FROM A LEFT JOIN B ON A.id = B.id WHERE B.flag = 1;\nHow do Q1 and Q2 differ for unmatched rows in A?",
    "options": [
      {
        "id": "A",
        "text": "Q1 preserves all rows of A (extending B with NULLs if B.flag ≠ 1), while Q2 filters out all rows of A that have NULL for B.flag",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Both queries return identical results",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Q2 returns more rows than Q1",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Q1 converts into an INNER JOIN",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "In an outer join, condition in the ON clause only dictates which right-table rows get joined; unmatched left rows are still kept! But WHERE is applied after the join: if B.flag is NULL (for unmatched rows), 'NULL = 1' evaluates to UNKNOWN, discarding them and effectively turning Q2 into an INNER JOIN!"
  },
  {
    "id": "INT-014",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Minimum Tuples in Left Outer Join",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R has n tuples and relation S has m tuples, what is the absolute MINIMUM number of tuples in (R LEFT OUTER JOIN S ON R.x = S.x)?",
    "options": [
      {
        "id": "A",
        "text": "0",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "min(n, m)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "n",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "m",
        "isCorrect": false
      }
    ],
    "answer": "C",
    "explanation": "By definition, a LEFT OUTER JOIN preserves every tuple of the left relation R. Even if none of the tuples in R find a match in S, all n tuples will be preserved (padded with NULLs). Therefore, minimum cardinality is strictly n."
  },
  {
    "id": "INT-015",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Maximum Tuples in Left Outer Join",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R has n tuples and relation S has m tuples (neither has a unique key on the join attribute), what is the MAXIMUM possible number of tuples in (R LEFT OUTER JOIN S ON R.x = S.x)?",
    "options": [
      {
        "id": "A",
        "text": "n + m",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "n × m",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "max(n, m)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "n",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "If all n tuples in R and all m tuples in S share the exact same value for attribute x, then every row in R matches every row in S, generating n × m tuples (Cartesian product level fan-out)."
  },
  {
    "id": "INT-016",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Multi-Table Left Join Null Cascade",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Consider:\nSELECT *\nFROM A\nLEFT JOIN B ON A.b_id = B.id\nLEFT JOIN C ON B.c_id = C.id;\nIf a row in A has b_id = NULL, what will be the values of C's attributes for this row in the final result?",
    "options": [
      {
        "id": "A",
        "text": "Error: cannot join on NULL foreign key",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "NULL, because B.id is NULL, so B.c_id is NULL, which fails the join to C",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Default values defined in table C",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "C will match rows where c_id IS NULL",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "When A's row fails to match B, all B attributes (including B.c_id) are filled with NULL. When the second LEFT JOIN evaluates 'B.c_id = C.id', NULL = C.id evaluates to UNKNOWN, so no row in C matches, and C's columns are also filled with NULL."
  },
  {
    "id": "INT-017",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "COUNT(*) vs COUNT(column) on Outer Join",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Table Department has 1 row ('Sales'). Table Employee has 0 rows for 'Sales'.\nQuery 1: SELECT count(*) FROM Department D LEFT JOIN Employee E ON D.id = E.dept_id;\nQuery 2: SELECT count(E.id) FROM Department D LEFT JOIN Employee E ON D.id = E.dept_id;\nWhat do Query 1 and Query 2 return?",
    "options": [
      {
        "id": "A",
        "text": "Query 1 returns 1, Query 2 returns 0",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Query 1 returns 0, Query 2 returns 0",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Query 1 returns 1, Query 2 returns 1",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Query 1 returns 0, Query 2 returns 1",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "LEFT JOIN produces 1 row for 'Sales' with E.id as NULL. COUNT(*) counts all rows regardless of NULLs (returning 1). In contrast, COUNT(E.id) ignores NULL values in that specific column (returning 0)."
  },
  {
    "id": "INT-018",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Relational Algebra Representation",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In extended relational algebra, which expression correctly formalizes R ⟕ S?",
    "options": [
      {
        "id": "A",
        "text": "(R ⋈ S) ∪ ((R - Π_R(R ⋈ S)) × {(NULL, ..., NULL)})",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "(R ⋈ S) ∩ (R × S)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "(R ∪ S) - (R ∩ S)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "σ_{R.A = S.A} (R × S)",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "The left outer join consists of all matched tuples (R ⋈ S) united with unmatched tuples from R: (R - Π_R(R ⋈ S)), where the missing S-attributes are extended with NULL."
  },
  {
    "id": "INT-019",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Non-Commutative Nature",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Is LEFT OUTER JOIN commutative? (i.e., is A LEFT JOIN B always equivalent to B LEFT JOIN A?)",
    "options": [
      {
        "id": "A",
        "text": "Yes, all outer joins are commutative",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "No, A LEFT JOIN B preserves unmatched rows from A, whereas B LEFT JOIN A preserves unmatched rows from B",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Only if both tables have primary keys",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only if table sizes are equal",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "LEFT OUTER JOIN is asymmetric and therefore NOT commutative. A LEFT JOIN B guarantees all rows of A appear; B LEFT JOIN A guarantees all rows of B appear."
  },
  {
    "id": "INT-020",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Left Join Preserving Duplicates",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table X has 3 identical rows with id = 1. Table Y has 0 rows with id = 1. How many rows are returned by (X LEFT JOIN Y ON X.id = Y.id)?",
    "options": [
      {
        "id": "A",
        "text": "0",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "1",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "3",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "NULL",
        "isCorrect": false
      }
    ],
    "answer": "3",
    "explanation": "In SQL multisets, every row of the left relation is preserved independently. Since X has 3 rows, all 3 are retained with NULL values for Y's attributes."
  },
  {
    "id": "INT-021",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Equivalence to Left Outer Join",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which query is logically equivalent to:\nSELECT * FROM Orders O RIGHT OUTER JOIN Customers C ON O.cust_id = C.id;",
    "options": [
      {
        "id": "A",
        "text": "SELECT * FROM Customers C LEFT OUTER JOIN Orders O ON C.id = O.cust_id;",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "SELECT * FROM Orders O LEFT OUTER JOIN Customers C ON O.cust_id = C.id;",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "SELECT * FROM Orders O INNER JOIN Customers C ON O.cust_id = C.id;",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "SELECT * FROM Customers C FULL OUTER JOIN Orders O ON C.id = O.cust_id;",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "A RIGHT OUTER JOIN B is semantically identical to B LEFT OUTER JOIN A with reversed table order. Both preserve all rows of the right relation B (here Customers) and fill missing left attributes with NULL."
  },
  {
    "id": "INT-022",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Preserving Right Relation Unmatched Tuples",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Table Students has 50 rows. Table Dorms has 20 rooms, of which 5 rooms currently have no student assigned.\nIf we execute: SELECT * FROM Students S RIGHT JOIN Dorms D ON S.dorm_id = D.id;\nHow many rooms will appear in the output?",
    "options": [
      {
        "id": "A",
        "text": "Only the 15 occupied rooms",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "All 20 rooms (the 5 empty rooms appear with NULL for student details)",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "50 rooms",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "0 rooms",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "RIGHT JOIN guarantees that every tuple from the right relation (Dorms) is present in the output. The 5 unassigned rooms appear with NULL for all columns belonging to Students."
  },
  {
    "id": "INT-023",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Right Join Cardinality",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R has 10 tuples and relation S has 30 tuples, what is the MINIMUM possible number of tuples in R RIGHT JOIN S?",
    "options": [
      {
        "id": "A",
        "text": "10",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "30",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "0",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "40",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "A RIGHT JOIN preserves every tuple from S. Hence, the resulting cardinality can never be less than |S| = 30."
  },
  {
    "id": "INT-024",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Relational Algebra Symbol",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which mathematical symbol denotes the Right Outer Join in Relational Algebra?",
    "options": [
      {
        "id": "A",
        "text": "⟕",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "⟖",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "⟗",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "⋈",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "The bow-tie symbol with two open prongs on the right (⟖) denotes Right Outer Join. (⟕ denotes Left Outer Join, and ⟗ denotes Full Outer Join)."
  },
  {
    "id": "INT-025",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Null Extension Identification",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In R(A, B) RIGHT OUTER JOIN S(B, C) ON R.B = S.B, if a tuple from S does not match any tuple in R, which attributes in the resulting tuple will contain NULL?",
    "options": [
      {
        "id": "A",
        "text": "Only attribute C",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "Attributes A and R.B",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Attributes R.B and S.B",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "No attributes contain NULL",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "In a RIGHT JOIN, unmatched tuples come from S. Therefore, all attributes supplied by relation R (i.e. A and R.B) will be populated with NULL values."
  },
  {
    "id": "INT-026",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Chaining Joins Readability",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Why do SQL style guides generally recommend using LEFT OUTER JOIN instead of mixing LEFT and RIGHT OUTER JOINs in the same query?",
    "options": [
      {
        "id": "A",
        "text": "RIGHT JOIN executes significantly slower on modern SQL query optimizers",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "LEFT JOIN establishes a consistent left-to-right reading order, making complex queries easier to comprehend and maintain",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "RIGHT JOIN is deprecated in ANSI SQL:2016",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "RIGHT JOIN does not support indexes",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Both operators have identical performance in modern optimizers, but standardizing on LEFT JOIN provides consistent visual and logical data flow from the primary driving table to referenced tables."
  },
  {
    "id": "INT-027",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Filtering Right Join with WHERE",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What happens if a query has: SELECT * FROM A RIGHT JOIN B ON A.id = B.a_id WHERE A.status = 'active';?",
    "options": [
      {
        "id": "A",
        "text": "It still preserves all rows of B because of RIGHT JOIN",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "It converts into an INNER JOIN because unmatched B rows have A.status as NULL, and 'NULL = active' evaluates to UNKNOWN",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "It raises a runtime exception",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "It ignores the WHERE clause",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Filtering on the preserved null-padded table (A) in the WHERE clause discards all rows where A's attributes are NULL. This unintentionally reverts the RIGHT JOIN into an INNER JOIN."
  },
  {
    "id": "INT-028",
    "topic": "RIGHT OUTER JOIN",
    "subtopic": "Tuple Counting with Partial Matches",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table A has 4 tuples with key = 10. Table B has 1 tuple with key = 10 and 2 tuples with key = 20. How many tuples are returned by (A RIGHT JOIN B ON A.key = B.key)?",
    "options": [
      {
        "id": "A",
        "text": "3",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "4",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "6",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "7",
        "isCorrect": false
      }
    ],
    "answer": "6",
    "explanation": "For key = 10: 4 tuples from A match 1 tuple from B, producing 4 × 1 = 4 tuples. For key = 20: 2 tuples from B have no match in A, producing 2 tuples padded with NULLs. Total = 4 + 2 = 6 tuples."
  },
  {
    "id": "INT-029",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Symmetric Preservation",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What is the defining characteristic of a FULL OUTER JOIN?",
    "options": [
      {
        "id": "A",
        "text": "It returns all rows from the left table only",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "It returns all rows from both tables: matching rows are joined, and unmatched rows from either side are padded with NULLs",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "It computes the Cartesian Product of both tables",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "It returns only rows that fail to match on both sides",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "FULL OUTER JOIN is symmetric: it preserves all matched pairs plus unmatched tuples from both the left relation and the right relation."
  },
  {
    "id": "INT-030",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Disjoint Tables Cardinality",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table A has 15 rows with keys 1 to 15. Table B has 10 rows with keys 16 to 25. How many rows are returned by (A FULL OUTER JOIN B ON A.key = B.key)?",
    "options": [
      {
        "id": "A",
        "text": "0",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "15",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "25",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "150",
        "isCorrect": false
      }
    ],
    "answer": "25",
    "explanation": "Since the key sets are completely disjoint (0 matching rows), all 15 rows from A and all 10 rows from B are preserved as unmatched tuples. Total = 15 + 10 = 25 rows."
  },
  {
    "id": "INT-031",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Identical Tables Cardinality",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table A has 50 rows with distinct primary keys 1 to 50. Table B also has 50 rows with distinct primary keys 1 to 50. How many rows does (A FULL OUTER JOIN B ON A.id = B.id) return?",
    "options": [
      {
        "id": "A",
        "text": "50",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "100",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "2500",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "0",
        "isCorrect": false
      }
    ],
    "answer": "50",
    "explanation": "Because the keys are unique and identical across both tables, every row in A matches exactly one row in B with 0 unmatched rows. Thus, exactly 50 rows are returned."
  },
  {
    "id": "INT-032",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Calculation with Partial Overlap",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table P has 20 tuples. Table Q has 30 tuples. The inner join (P ⋈ Q) on their common primary key produces 12 tuples. How many tuples are in (P FULL OUTER JOIN Q)?",
    "options": [
      {
        "id": "A",
        "text": "50",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "38",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "26",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "600",
        "isCorrect": false
      }
    ],
    "answer": "38",
    "explanation": "Matched tuples = 12. Unmatched tuples in P = 20 - 12 = 8. Unmatched tuples in Q = 30 - 12 = 18. Total FULL OUTER JOIN tuples = 12 (matched) + 8 (unmatched P) + 18 (unmatched Q) = 38."
  },
  {
    "id": "INT-033",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Simulating FULL OUTER JOIN in MySQL",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "MySQL does not have native FULL OUTER JOIN syntax. How is a FULL OUTER JOIN conventionally implemented in MySQL?",
    "options": [
      {
        "id": "A",
        "text": "(A LEFT JOIN B) INTERSECT (A RIGHT JOIN B)",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "(A LEFT JOIN B) UNION (A RIGHT JOIN B)",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "A CROSS JOIN B WHERE A.id = B.id",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "(A INNER JOIN B) UNION ALL (A NATURAL JOIN B)",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "In MySQL, UNION removes duplicate rows between the LEFT JOIN (which has all matches + left unmatched) and the RIGHT JOIN (which has all matches + right unmatched), yielding the exact FULL OUTER JOIN result."
  },
  {
    "id": "INT-034",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Relational Algebra Notation",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In Relational Algebra, what symbol denotes the FULL OUTER JOIN?",
    "options": [
      {
        "id": "A",
        "text": "⟕",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "⟖",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "⟗",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "⋉",
        "isCorrect": false
      }
    ],
    "answer": "C",
    "explanation": "The bow-tie symbol with open prongs on both the left and right sides (⟗) represents the Full Outer Join operator."
  },
  {
    "id": "INT-035",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Exclusive Full Outer Join (Symmetric Difference)",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "How do you select ONLY rows that do NOT have a match in the other table using a FULL OUTER JOIN?\nSELECT * FROM A FULL OUTER JOIN B ON A.id = B.id WHERE ...",
    "options": [
      {
        "id": "A",
        "text": "WHERE A.id IS NULL AND B.id IS NULL",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "WHERE A.id IS NULL OR B.id IS NULL",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "WHERE A.id <> B.id",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "WHERE A.id IS NOT NULL",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "When a row from A has no match, B.id is NULL. When a row from B has no match, A.id is NULL. Thus, 'WHERE A.id IS NULL OR B.id IS NULL' filters out all matched tuples, returning only the unmatched rows from both tables."
  },
  {
    "id": "INT-036",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Commutativity of Full Outer Join",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Is FULL OUTER JOIN commutative?",
    "options": [
      {
        "id": "A",
        "text": "Yes, R ⟗ S produces the same set of tuples as S ⟗ R (up to column ordering)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "No, outer joins are never commutative",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Only if both tables have no duplicate rows",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only if R and S have the same schema",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Unlike LEFT or RIGHT joins, FULL OUTER JOIN is completely symmetric with respect to both relations, making it commutative: R ⟗ S ≡ S ⟗ R."
  },
  {
    "id": "INT-037",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Tuple Bounds Given Primary Keys",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Relations R and S each have 100 tuples, and both use attribute K as their primary key. What are the minimum and maximum possible tuple counts for (R FULL OUTER JOIN S ON R.K = S.K)?",
    "options": [
      {
        "id": "A",
        "text": "Min: 0, Max: 200",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "Min: 100, Max: 200",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Min: 100, Max: 10000",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Min: 200, Max: 200",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Because K is a primary key in both, each key appears at most once. Minimum occurs when all 100 keys match (100 tuples). Maximum occurs when the keys are completely disjoint, giving 100 + 100 = 200 tuples."
  },
  {
    "id": "INT-038",
    "topic": "FULL OUTER JOIN",
    "subtopic": "Degree of Full Outer Join",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Relation R has 3 attributes and relation S has 4 attributes. How many columns are in the output schema of (SELECT * FROM R FULL OUTER JOIN S ON R.id = S.id)?",
    "options": [
      {
        "id": "A",
        "text": "3",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "4",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "6",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "7",
        "isCorrect": true
      }
    ],
    "answer": "7",
    "explanation": "In an explicit JOIN ON query with SELECT *, all columns from both relations are retained in the result schema: degree = 3 + 4 = 7 columns."
  },
  {
    "id": "INT-039",
    "topic": "CROSS JOIN",
    "subtopic": "Basic Cardinality Formula",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table A contains 7 rows and Table B contains 9 rows. How many rows are generated by a CROSS JOIN between A and B?",
    "options": [
      {
        "id": "A",
        "text": "16",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "63",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "9",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "2",
        "isCorrect": false
      }
    ],
    "answer": "63",
    "explanation": "A CROSS JOIN produces the Cartesian product of two relations: |A × B| = |A| × |B| = 7 × 9 = 63."
  },
  {
    "id": "INT-040",
    "topic": "CROSS JOIN",
    "subtopic": "Degree of Cartesian Product",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R has degree n (number of attributes) and relation S has degree m, what is the degree of (R × S)?",
    "options": [
      {
        "id": "A",
        "text": "n × m",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "n + m",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "max(n, m)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "n - m",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "The schema of a Cartesian product is the concatenation of the attribute lists of both relations. Thus, degree(R × S) = degree(R) + degree(S) = n + m."
  },
  {
    "id": "INT-041",
    "topic": "CROSS JOIN",
    "subtopic": "Accidental Cartesian Product in SQL-89",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In SQL-89 comma-join syntax, what occurs if the developer forgets to include the WHERE join condition?\nSELECT * FROM Customers, Orders;",
    "options": [
      {
        "id": "A",
        "text": "An error is thrown stating join condition is missing",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "An unintended Cartesian product (CROSS JOIN) is executed across both tables",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "The database automatically performs a NATURAL JOIN",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only matching primary keys are joined",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "In SQL-89 syntax, listing tables separated by commas in the FROM clause without a WHERE predicate defaults directly to a full Cartesian Product (CROSS JOIN)."
  },
  {
    "id": "INT-042",
    "topic": "CROSS JOIN",
    "subtopic": "Cartesian Product with Empty Table",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table X has 10,000 tuples and Table Y has 0 tuples. How many tuples are produced by (X CROSS JOIN Y)?",
    "options": [
      {
        "id": "A",
        "text": "10000",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "0",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "1",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "NULL",
        "isCorrect": false
      }
    ],
    "answer": "0",
    "explanation": "The cardinality of a Cartesian product is |X| × |Y| = 10,000 × 0 = 0 tuples."
  },
  {
    "id": "INT-043",
    "topic": "CROSS JOIN",
    "subtopic": "Practical Use Cases of Cross Join",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following is a legitimate practical use case for a CROSS JOIN in database applications?",
    "options": [
      {
        "id": "A",
        "text": "Generating all possible combinations (e.g. all Sizes × all Colors for inventory matrices)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Enforcing referential integrity constraints",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Removing duplicate rows from a table",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Replacing an index scan on large tables",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "CROSS JOINs are ideal for combinatorial generation, such as pairing every product with every day in a calendar table to create empty reporting slots."
  },
  {
    "id": "INT-044",
    "topic": "CROSS JOIN",
    "subtopic": "Cross Join with ON Clause",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In standard ANSI SQL, what happens if you specify an ON clause with a CROSS JOIN, such as:\nSELECT * FROM A CROSS JOIN B ON A.id = B.id;?",
    "options": [
      {
        "id": "A",
        "text": "Standard SQL prohibits an ON clause on CROSS JOIN (raises syntax error), though some dialects treat it as INNER JOIN",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "It is standard syntax for FULL JOIN",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "It performs a natural join",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "The ON clause is ignored",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "By ANSI SQL standards, CROSS JOIN takes no ON clause. An ON clause belongs strictly to qualified joins (INNER, LEFT, RIGHT, FULL)."
  },
  {
    "id": "INT-045",
    "topic": "CROSS JOIN",
    "subtopic": "Associativity of Cartesian Product",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Is the Cartesian product operation associative? That is, is (A × B) × C isomorphic to A × (B × C)?",
    "options": [
      {
        "id": "A",
        "text": "Yes, Cartesian product is associative",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "No, it is only commutative",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Only if all relations have the same degree",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only if relations have disjoint attributes",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Cartesian product is associative: ((A × B) × C) produces identical combined tuple structures as (A × (B × C))."
  },
  {
    "id": "INT-046",
    "topic": "CROSS JOIN",
    "subtopic": "Cartesian Product of 3 Relations",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Relation A has 2 tuples, B has 3 tuples, and C has 4 tuples. How many tuples are in (A × B × C)?",
    "options": [
      {
        "id": "A",
        "text": "9",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "14",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "24",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "48",
        "isCorrect": false
      }
    ],
    "answer": "24",
    "explanation": "Cardinality = |A| × |B| × |C| = 2 × 3 × 4 = 24 tuples."
  },
  {
    "id": "INT-047",
    "topic": "CROSS JOIN",
    "subtopic": "Selection over Cartesian Product",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In query optimization, why does the DBMS push selection predicates down into join algorithms instead of executing a pure Cartesian Product first?",
    "options": [
      {
        "id": "A",
        "text": "To prevent enormous intermediate memory consumption caused by |R| × |S|",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Because Cartesian products cannot be computed on disks",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Because SQL prohibits Cartesian products internally",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "To eliminate the need for primary keys",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "A Cartesian product creates an intermediate table of size |R| × |S|. Pushing down selection predicates avoids generating unneeded rows, drastically improving query performance."
  },
  {
    "id": "INT-048",
    "topic": "CROSS JOIN",
    "subtopic": "Self Cross Join",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "If relation R has 6 tuples, how many tuples are in (R × R)?",
    "options": [
      {
        "id": "A",
        "text": "6",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "12",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "36",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "64",
        "isCorrect": false
      }
    ],
    "answer": "36",
    "explanation": "Cardinality is |R| × |R| = 6 × 6 = 36 tuples."
  },
  {
    "id": "INT-049",
    "topic": "NATURAL JOIN",
    "subtopic": "Common Attribute Schema Projection",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "How does the output schema of a NATURAL JOIN differ from an equijoin executed with SELECT * FROM R, S WHERE R.id = S.id?",
    "options": [
      {
        "id": "A",
        "text": "NATURAL JOIN projects the common attribute only ONCE, whereas SELECT * in equijoin includes both R.id and S.id",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "NATURAL JOIN renames all attributes to uppercase",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "NATURAL JOIN includes NULL columns for unmatched keys",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "There is no difference in the output schema",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "By relational algebra definition, NATURAL JOIN equates all identically named columns and projects each common attribute exactly once, avoiding duplicate column occurrences in the output relation."
  },
  {
    "id": "INT-050",
    "topic": "NATURAL JOIN",
    "subtopic": "Disjoint Schemas Degeneration",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R(A, B) and relation S(C, D) have NO common attribute names, what does R ⋈ S evaluate to?",
    "options": [
      {
        "id": "A",
        "text": "An empty relation ∅",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "The Cartesian Product R × S",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "A schema validation error",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "The union R ∪ S",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "A NATURAL JOIN enforces equality on all common attributes. When the set of common attributes is empty, there are no conditions to check, so it degenerates directly into the Cartesian Product (R × S)."
  },
  {
    "id": "INT-051",
    "topic": "NATURAL JOIN",
    "subtopic": "Identical Schemas Behavior",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R and relation S have the EXACT SAME relational schema (same attribute names and types), what does R ⋈ S evaluate to?",
    "options": [
      {
        "id": "A",
        "text": "R ∪ S",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "R ∩ S (Set Intersection)",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "R × S",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "R - S",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "When all attributes are common, NATURAL JOIN requires all attributes in R to match all attributes in S. This returns precisely the tuples that exist in both relations: R ∩ S."
  },
  {
    "id": "INT-052",
    "topic": "NATURAL JOIN",
    "subtopic": "Accidental Column Matching Hazard",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Why do senior database architects advise AGAINST using NATURAL JOIN in production code?",
    "options": [
      {
        "id": "A",
        "text": "If a new column with a generic name (like 'status' or 'created_at') is added to both tables in future migrations, NATURAL JOIN will silently join on it, breaking existing queries",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "NATURAL JOIN cannot use B-Tree indexes",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "NATURAL JOIN is not part of the SQL standard",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "NATURAL JOIN causes table deadlocks",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Because NATURAL JOIN matches all identically named columns automatically, future schema changes that add identical column names (e.g., 'updated_at', 'status') will inadvertently become join criteria, yielding unexpected zero or reduced results."
  },
  {
    "id": "INT-053",
    "topic": "NATURAL JOIN",
    "subtopic": "Degree Calculation",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Relation R has attributes (A, B, C, D) and relation S has attributes (C, D, E). What is the degree of R ⋈ S?",
    "options": [
      {
        "id": "A",
        "text": "7",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "5",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "4",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "2",
        "isCorrect": false
      }
    ],
    "answer": "5",
    "explanation": "The schema of the natural join is the set union of attribute names: {A, B, C, D} ∪ {C, D, E} = {A, B, C, D, E}. Degree = 5."
  },
  {
    "id": "INT-054",
    "topic": "NATURAL JOIN",
    "subtopic": "Natural Join vs USING Clause",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "How does JOIN ... USING (department_id) protect against the pitfalls of NATURAL JOIN?",
    "options": [
      {
        "id": "A",
        "text": "It explicitly restricts the join to only the specified column(s), even if other columns share the same name across both tables",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "It enables outer join semantics automatically",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "It forces the query to use hash join algorithm",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "It duplicates the join column in the output",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "JOIN ... USING (col) achieves the single-column projection benefit of natural join while explicitly specifying which columns to join on, preventing unintended matching on other common columns."
  },
  {
    "id": "INT-055",
    "topic": "NATURAL JOIN",
    "subtopic": "Cardinality with Multiple Common Attributes",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Tables R(A, B, C) and S(A, B, D) are joined via NATURAL JOIN. Under what condition is a tuple produced?",
    "options": [
      {
        "id": "A",
        "text": "R.A = S.A OR R.B = S.B",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "R.A = S.A AND R.B = S.B",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "R.C = S.D",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only R.A = S.A",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "NATURAL JOIN enforces equality across ALL common attributes using conjunction (AND). Here common attributes are A and B, so both R.A = S.A AND R.B = S.B must hold simultaneously."
  },
  {
    "id": "INT-056",
    "topic": "NATURAL JOIN",
    "subtopic": "Commutativity & Associativity",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which algebraic properties does NATURAL JOIN satisfy?",
    "options": [
      {
        "id": "A",
        "text": "Both Commutative and Associative",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Commutative only",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Associative only",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Neither Commutative nor Associative",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Natural join satisfies both commutativity (R ⋈ S ≡ S ⋈ R) and associativity ((R ⋈ S) ⋈ T ≡ R ⋈ (S ⋈ T)), enabling flexible optimizer join-tree reordering."
  },
  {
    "id": "INT-057",
    "topic": "NATURAL JOIN",
    "subtopic": "Natural Left Outer Join",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What does the SQL construct: SELECT * FROM R NATURAL LEFT JOIN S; do?",
    "options": [
      {
        "id": "A",
        "text": "Matches automatically on all common columns and preserves all unmatched tuples from R",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Executes a natural join then deletes left rows",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Raises a syntax error because NATURAL cannot be combined with OUTER",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Converts to a cross join",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "NATURAL LEFT JOIN combines natural join semantics (automatic equality on all common column names with single projection) with left outer join preservation of unmatched left rows."
  },
  {
    "id": "INT-058",
    "topic": "NATURAL JOIN",
    "subtopic": "Null Values in Common Columns",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R has a tuple with (id: 1, code: NULL) and relation S has a tuple with (id: 1, code: NULL), will this pair match in R NATURAL JOIN S?",
    "options": [
      {
        "id": "A",
        "text": "Yes, because NULL equals NULL",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "No, because the equality predicate code = code evaluates to UNKNOWN, which is treated as FALSE in join conditions",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Yes, if code is defined as VARCHAR",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only if NULLS ARE EQUAL pragma is enabled",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "In SQL three-valued logic, NULL = NULL evaluates to UNKNOWN, not TRUE. Because natural join requires all common columns to evaluate to TRUE, rows with NULL in any common column do not match."
  },
  {
    "id": "INT-059",
    "topic": "SELF JOIN",
    "subtopic": "Mandatory Table Aliases",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Why must table aliases be used when performing a SELF JOIN in SQL?",
    "options": [
      {
        "id": "A",
        "text": "To give the database engine two distinct references to the same physical table in the FROM clause and expressions",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "To make the query run twice as fast",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "To automatically create a temporary copy on disk",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Aliases are optional in self joins",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Because both sides of the join reference the same table, table aliases (e.g. e1 and e2) are mandatory to disambiguate which instance each column reference refers to."
  },
  {
    "id": "INT-060",
    "topic": "SELF JOIN",
    "subtopic": "Employee-Manager Hierarchy",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Consider Employee(emp_id, emp_name, manager_id). Which query lists each employee alongside their manager's name?",
    "options": [
      {
        "id": "A",
        "text": "SELECT E.emp_name, M.emp_name AS manager FROM Employee E LEFT JOIN Employee M ON E.manager_id = M.emp_id;",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "SELECT E.emp_name, M.emp_name FROM Employee E JOIN Employee M ON E.emp_id = M.emp_id;",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "SELECT * FROM Employee NATURAL JOIN Employee;",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "SELECT * FROM Employee WHERE manager_id = emp_id;",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "To match an employee with their manager, join employee's manager_id to the manager's emp_id. A LEFT JOIN ensures top-level executives (who have manager_id = NULL) are not omitted."
  },
  {
    "id": "INT-061",
    "topic": "SELF JOIN",
    "subtopic": "Eliminating Duplicate Pairs (< vs !=)",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "To find all distinct pairs of employees who work in the same department without generating duplicate reverse pairs (e.g., getting (Alice, Bob) but not (Bob, Alice)), which condition should be used?",
    "options": [
      {
        "id": "A",
        "text": "ON e1.dept_id = e2.dept_id AND e1.emp_id <> e2.emp_id",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "ON e1.dept_id = e2.dept_id AND e1.emp_id < e2.emp_id",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "ON e1.dept_id = e2.dept_id AND e1.emp_id = e2.emp_id",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "ON e1.dept_id <> e2.dept_id",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Using '<>' eliminates pairing an employee with themselves, but still yields both (Alice, Bob) and (Bob, Alice). Using strict inequality '<' eliminates self-pairing AND ensures each pair appears exactly once in canonical sorted order."
  },
  {
    "id": "INT-062",
    "topic": "SELF JOIN",
    "subtopic": "Candidate Key Self Join Cardinality",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Relation R has 25 tuples where attribute A is a candidate key. How many tuples are returned by:\nSELECT * FROM R r1 JOIN R r2 ON r1.A = r2.A;",
    "options": [
      {
        "id": "A",
        "text": "25",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "50",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "625",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "0",
        "isCorrect": false
      }
    ],
    "answer": "25",
    "explanation": "Because A is a candidate key, all 25 values are distinct. Each tuple in r1 matches exactly one tuple in r2 (itself). Total tuples = 25."
  },
  {
    "id": "INT-063",
    "topic": "SELF JOIN",
    "subtopic": "Finding Second Highest Value",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In classical SQL prior to window functions, how does a self-join find the second highest salary?",
    "options": [
      {
        "id": "A",
        "text": "By self-joining on e1.salary < e2.salary and grouping by e1.salary with COUNT(DISTINCT e2.salary) = 1",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "By self-joining on e1.salary = e2.salary",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "By doing a cross join and taking AVG(salary)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Self joins cannot perform ranking operations",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "By counting how many distinct salaries in e2 are strictly greater than e1.salary, a count of 0 identifies the maximum salary, and a count of 1 identifies the 2nd highest salary."
  },
  {
    "id": "INT-064",
    "topic": "SELF JOIN",
    "subtopic": "Transitive Graph Traversal",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given Flights(origin, destination), which query finds all two-hop flights (flights with exactly one layover)?",
    "options": [
      {
        "id": "A",
        "text": "SELECT f1.origin, f2.destination FROM Flights f1 JOIN Flights f2 ON f1.destination = f2.origin;",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "SELECT * FROM Flights f1 JOIN Flights f2 ON f1.origin = f2.origin;",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "SELECT * FROM Flights f1 JOIN Flights f2 ON f1.destination = f2.destination;",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "SELECT * FROM Flights f1 CROSS JOIN Flights f2;",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "A two-hop flight requires the destination of the first flight leg (f1.destination) to be the origin of the second flight leg (f2.origin)."
  },
  {
    "id": "INT-065",
    "topic": "SELF JOIN",
    "subtopic": "Relational Algebra Renaming Operator",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In relational algebra, what operator is formally required to execute a self-join on relation R?",
    "options": [
      {
        "id": "A",
        "text": "Rename operator ρ (rho)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Projection operator Π (pi)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Selection operator σ (sigma)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Division operator ÷",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "The rename operator ρ creates a distinct relation name and attribute labels (e.g. ρ_{R1}(R) × ρ_{R2}(R)) to disambiguate the schema."
  },
  {
    "id": "INT-066",
    "topic": "SELF JOIN",
    "subtopic": "Detecting Consecutive Events",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given Log(log_date, temperature), what join condition finds consecutive days where temperature increased?",
    "options": [
      {
        "id": "A",
        "text": "ON l2.log_date = l1.log_date + INTERVAL 1 DAY AND l2.temperature > l1.temperature",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "ON l2.log_date = l1.log_date",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "ON l2.temperature = l1.temperature + 1",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "ON l1.temperature > l2.temperature",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Joining on the date increment ensures l2 is the immediate next calendar day, and filtering on temperature checks for the increase."
  },
  {
    "id": "INT-067",
    "topic": "SELF JOIN",
    "subtopic": "Self Outer Join for Root Nodes",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "When modeling organizational hierarchies via self-joins, why is a LEFT JOIN preferred over an INNER JOIN?",
    "options": [
      {
        "id": "A",
        "text": "Because top-level leaders (e.g. CEO) have manager_id = NULL and would otherwise be omitted",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Because INNER JOIN cannot join a table to itself",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Because LEFT JOIN ignores primary key constraints",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Because LEFT JOIN operates without aliases",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "An INNER JOIN requires manager_id to match an existing emp_id. The CEO has manager_id = NULL, so an INNER JOIN would drop the CEO from the report."
  },
  {
    "id": "INT-068",
    "topic": "SELF JOIN",
    "subtopic": "Maximum Self Join Tuples with Duplicates",
    "difficulty": "Hard",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "A relation R has 10 tuples, all of which contain the exact same value for attribute X. How many tuples are produced by (SELECT * FROM R a JOIN R b ON a.X = b.X)?",
    "options": [
      {
        "id": "A",
        "text": "10",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "20",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "100",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "45",
        "isCorrect": false
      }
    ],
    "answer": "100",
    "explanation": "Because all 10 tuples have identical X values, every tuple in table a matches every tuple in table b: 10 × 10 = 100 tuples."
  },
  {
    "id": "INT-069",
    "topic": "THETA JOIN",
    "subtopic": "Definition and Valid Operators",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which comparison operators are permissible in a Theta Join condition (R ⋈_θ S)?",
    "options": [
      {
        "id": "A",
        "text": "Only equality (=)",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "Any standard comparison operator: =, <, <=, >, >=, <>",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Only arithmetic operators (+, -, *, /)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only string concatenation operators",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "In Relational Algebra, Theta (θ) denotes any general boolean predicate consisting of comparison operators {=, <, ≤, >, ≥, ≠}."
  },
  {
    "id": "INT-070",
    "topic": "EQUI JOIN",
    "subtopic": "Equijoin as Specialization of Theta Join",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What distinguishes an Equijoin from a general Theta Join?",
    "options": [
      {
        "id": "A",
        "text": "An Equijoin uses ONLY equality comparison operators (=) in its join condition",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "An Equijoin eliminates duplicate column names like Natural Join",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "An Equijoin only works on tables with identical number of rows",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "An Equijoin does not allow table aliases",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "An Equijoin is simply a Theta Join where the predicate θ consists solely of equality operators (=)."
  },
  {
    "id": "INT-071",
    "topic": "THETA JOIN",
    "subtopic": "Temporal Interval Overlap Join",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given Bookings A(start_date, end_date) and Bookings B(start_date, end_date), which join predicate correctly identifies overlapping reservations?",
    "options": [
      {
        "id": "A",
        "text": "ON A.start_date <= B.end_date AND A.end_date >= B.start_date",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "ON A.start_date = B.start_date",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "ON A.end_date = B.end_date",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "ON A.start_date > B.end_date",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Two continuous time intervals [startA, endA] and [startB, endB] overlap if and only if startA ≤ endB and endA ≥ startB. This is a classic non-equi Theta Join."
  },
  {
    "id": "INT-072",
    "topic": "EQUI JOIN",
    "subtopic": "Equijoin vs Natural Join Column Duplication",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Let R(A, B) and S(B, C). How many columns does an Equijoin (SELECT * FROM R JOIN S ON R.B = S.B) have in standard SQL?",
    "options": [
      {
        "id": "A",
        "text": "3 columns (A, B, C)",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "4 columns (R.A, R.B, S.B, S.C)",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "2 columns",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "5 columns",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "In an explicit Equijoin with SELECT *, SQL preserves all columns from both relations, including both R.B and S.B (4 total columns), unlike NATURAL JOIN which collapses common columns into one."
  },
  {
    "id": "INT-073",
    "topic": "THETA JOIN",
    "subtopic": "Query Optimization Strategy",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Why are general non-equi Theta Joins (e.g. ON A.val < B.val) typically more computationally expensive for database engines than Equijoins?",
    "options": [
      {
        "id": "A",
        "text": "Because Hash Join algorithms cannot be directly applied to inequality predicates, often forcing Nested Loop Joins",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Because inequality operators are not supported by the SQL standard",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Because relations must be converted to XML first",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Because non-equi joins disable CPU cache",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Hash Joins rely on hashing join keys to exact buckets, which requires equality testing. For general inequalities (<, >), the optimizer often falls back to Nested Loop joins or specialized index range scans, which can be O(N × M)."
  },
  {
    "id": "INT-074",
    "topic": "EQUI JOIN",
    "subtopic": "Relational Algebra to SQL Equivalence",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "The relational algebra query Π_{A, D} (σ_{R.B = S.B} (R × S)) translates directly to which SQL query?",
    "options": [
      {
        "id": "A",
        "text": "SELECT R.A, S.D FROM R JOIN S ON R.B = S.B;",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "SELECT * FROM R NATURAL JOIN S;",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "SELECT R.A, S.D FROM R, S;",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "SELECT R.B FROM R JOIN S USING (B);",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "The selection condition σ_{R.B = S.B} over Cartesian product corresponds to 'FROM R JOIN S ON R.B = S.B', and the projection Π_{A, D} corresponds to 'SELECT R.A, S.D'."
  },
  {
    "id": "INT-075",
    "topic": "THETA JOIN",
    "subtopic": "Range Pricing Query",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which type of join is executed when matching Product(price) with DiscountTiers(min_price, max_price, discount_pct) using: ON price >= min_price AND price < max_price?",
    "options": [
      {
        "id": "A",
        "text": "Equijoin",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "Non-equi Theta Join",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Natural Join",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Cartesian product without selection",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Because the join predicates utilize range inequalities (>= and <) rather than strict equality, it is a non-equi Theta Join."
  },
  {
    "id": "INT-076",
    "topic": "EQUI JOIN",
    "subtopic": "Multi-Predicate Equijoin Cardinality",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table R has 2 rows: (1, 'A') and (2, 'B'). Table S has 2 rows: (1, 'A') and (1, 'B'). How many rows are returned by: SELECT * FROM R JOIN S ON R.x = S.x AND R.y = S.y;",
    "options": [
      {
        "id": "A",
        "text": "0",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "1",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "2",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "4",
        "isCorrect": false
      }
    ],
    "answer": "1",
    "explanation": "Only the tuple (1, 'A') matches both predicates (x = 1 AND y = 'A') simultaneously in both relations. Total rows = 1."
  },
  {
    "id": "INT-077",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Primary Key to Foreign Key (1:N) Bounds",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Relation Parent has 50 tuples (primary key id). Relation Child has 200 tuples (foreign key parent_id NOT NULL referencing Parent.id).\nWhat are the minimum and maximum possible tuples in (Parent ⋈ Child)?",
    "options": [
      {
        "id": "A",
        "text": "Min: 0, Max: 200",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "Min: 50, Max: 200",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Min: 200, Max: 200",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "Min: 0, Max: 10000",
        "isCorrect": false
      }
    ],
    "answer": "C",
    "explanation": "Because foreign key parent_id is NOT NULL, every child tuple MUST reference an existing parent. Since Parent.id is a primary key, each child matches exactly one parent. Therefore, every one of the 200 children produces exactly one join tuple: Min = 200, Max = 200."
  },
  {
    "id": "INT-078",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Primary Key to Primary Key (1:1) Bounds",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Relations R and S each have 100 tuples. Attribute A is the primary key in both relations. What are the minimum and maximum possible tuples in (R ⋈_{R.A = S.A} S)?",
    "options": [
      {
        "id": "A",
        "text": "Min: 0, Max: 100",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Min: 100, Max: 100",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Min: 0, Max: 10000",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Min: 100, Max: 200",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Since A is unique in both tables, each match is 1-to-1. If their key sets are disjoint, 0 rows match (Min = 0). If their key sets are identical, all 100 match (Max = 100)."
  },
  {
    "id": "INT-079",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Non-Key Equijoin Worst-Case Fan-Out",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Relation R has 40 tuples and relation S has 60 tuples. Neither relation has any key or uniqueness constraint on attribute B. What is the maximum number of tuples possible in R ⋈_{R.B = S.B} S?",
    "options": [
      {
        "id": "A",
        "text": "60",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "100",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "2400",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "1000",
        "isCorrect": false
      }
    ],
    "answer": "2400",
    "explanation": "If all 40 tuples in R have B = 'val' and all 60 tuples in S also have B = 'val', every tuple of R matches every tuple of S, producing 40 × 60 = 2400 tuples."
  },
  {
    "id": "INT-080",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Nullable Foreign Key Lower Bound",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation Child has 100 tuples with foreign key parent_id referencing Parent, but parent_id IS NULLABLE, what is the minimum number of tuples in (Parent ⋈ Child)?",
    "options": [
      {
        "id": "A",
        "text": "100",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "0",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "1",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "50",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "If all 100 tuples in Child have parent_id = NULL, then since NULL = id evaluates to UNKNOWN, none of the tuples will match Parent. Thus, minimum cardinality is 0."
  },
  {
    "id": "INT-081",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Left Join Upper Bound",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Let R have m tuples and S have n tuples. If attribute S.k is a candidate key in S, what is the MAXIMUM possible number of tuples in (R LEFT JOIN S ON R.k = S.k)?",
    "options": [
      {
        "id": "A",
        "text": "m × n",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "m",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "n",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "m + n",
        "isCorrect": false
      }
    ],
    "answer": "B",
    "explanation": "Because S.k is a candidate key in S, each tuple in R can match at most ONE tuple in S. Since LEFT JOIN preserves all m tuples of R and none can fan out to more than 1 match, the maximum is strictly m."
  },
  {
    "id": "INT-082",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Full Outer Join Bound with Disjoint Keys",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table A has 80 rows and Table B has 120 rows. If no keys match between A and B, how many rows are in (A FULL OUTER JOIN B)?",
    "options": [
      {
        "id": "A",
        "text": "0",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "80",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "120",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "200",
        "isCorrect": true
      }
    ],
    "answer": "200",
    "explanation": "When zero rows match, FULL OUTER JOIN preserves all unmatched rows from both relations: 80 + 120 = 200."
  },
  {
    "id": "INT-083",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Inner Join Subset Relation",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following inequalities always holds regarding the cardinalities of INNER JOIN, LEFT JOIN, and FULL JOIN on the same condition?",
    "options": [
      {
        "id": "A",
        "text": "|R ⋈ S| <= |R ⟕ S| <= |R ⟗ S|",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "|R ⟕ S| <= |R ⋈ S| <= |R ⟗ S|",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "|R ⟗ S| <= |R ⟕ S| <= |R ⋈ S|",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "|R ⋈ S| = |R ⟕ S| = |R ⟗ S|",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "INNER JOIN produces only matched pairs. LEFT JOIN includes all matched pairs plus unmatched R tuples. FULL JOIN includes all matched pairs plus unmatched R tuples AND unmatched S tuples. Hence: |R ⋈ S| ≤ |R ⟕ S| ≤ |R ⟗ S|."
  },
  {
    "id": "INT-084",
    "topic": "JOIN CARDINALITY",
    "subtopic": "N:M Fan-Out Calculation",
    "difficulty": "Medium",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "Table X has 3 rows with code = 'US' and 2 rows with code = 'UK'. Table Y has 4 rows with code = 'US' and 5 rows with code = 'UK'. How many rows does (X JOIN Y ON X.code = Y.code) return?",
    "options": [
      {
        "id": "A",
        "text": "14",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "22",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "45",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "12",
        "isCorrect": false
      }
    ],
    "answer": "22",
    "explanation": "For 'US': 3 × 4 = 12 rows. For 'UK': 2 × 5 = 10 rows. Total rows = 12 + 10 = 22."
  },
  {
    "id": "INT-085",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Self Join Minimum Cardinality",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "For any non-empty relation R containing n tuples, what is the MINIMUM possible number of tuples in (SELECT * FROM R r1 JOIN R r2 ON r1.id = r2.id)?",
    "options": [
      {
        "id": "A",
        "text": "0",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "n",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "n²",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "1",
        "isCorrect": false
      }
    ],
    "answer": "n",
    "explanation": "Every tuple in R is guaranteed to match at least itself (reflexivity: t.id = t.id). Therefore, when all id values are unique, exactly n tuples are returned."
  },
  {
    "id": "INT-086",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Cardinality with Cartesian Product",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "If relation A has 12 tuples and relation B has 8 tuples, what is the cardinality of (A × B)?",
    "options": [
      {
        "id": "A",
        "text": "20",
        "isCorrect": false
      },
      {
        "id": "B",
        "text": "96",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "4",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "144",
        "isCorrect": false
      }
    ],
    "answer": "96",
    "explanation": "Cardinality = |A| × |B| = 12 × 8 = 96."
  },
  {
    "id": "INT-087",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Semi-Join Definition",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What does the Semi-Join operation (R ⋉ S) return in relational algebra?",
    "options": [
      {
        "id": "A",
        "text": "All tuples of R that participate in the join (R ⋈ S), projecting ONLY the attributes of R without duplicate row fan-out",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Half of the tuples from relation R and half from S",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "All tuples from S that do not match R",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "The Cartesian product divided by 2",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "A Semi-Join R ⋉ S = Π_R(R ⋈ S). It returns all rows from R that have at least one matching row in S, keeping only R's schema and preventing duplicate row generation."
  },
  {
    "id": "INT-088",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Anti-Join Notation & Definition",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In relational algebra, how is the Anti-Semi-Join (R ▷ S) defined?",
    "options": [
      {
        "id": "A",
        "text": "R - (R ⋉ S)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "R ∪ S",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "R ⋈ S",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "S - R",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "The anti-semi-join R ▷ S returns all tuples from R that DO NOT have a matching tuple in S. Formally, it is the set difference between R and the semi-join: R - (R ⋉ S)."
  },
  {
    "id": "INT-089",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Semi-Join in SQL",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which SQL clause natively implements Semi-Join semantics without risking duplicate row fan-out?",
    "options": [
      {
        "id": "A",
        "text": "WHERE EXISTS (SELECT 1 FROM S WHERE S.id = R.s_id)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "INNER JOIN S ON S.id = R.s_id",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "FULL OUTER JOIN S ON S.id = R.s_id",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "CROSS JOIN S",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "EXISTS tests for the presence of a match and stops at the first hit, returning the row from R without duplicating it when multiple matching rows exist in S."
  },
  {
    "id": "INT-090",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Natural Join Derivation from Primitive Operators",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given R(A, B) and S(B, C), how is the natural join R ⋈ S expressed using primitive relational algebra operators {σ, Π, ×}?",
    "options": [
      {
        "id": "A",
        "text": "Π_{A, R.B, C} (σ_{R.B = S.B} (R × S))",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "σ_{R.B = S.B} (R × S)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Π_{A, C} (R × S)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "σ_{A = C} (R × S)",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Natural join first takes the Cartesian product (R × S), filters by equating the common attribute (σ_{R.B = S.B}), and finally projects the unique attribute list (Π_{A, R.B, C}), eliminating the duplicate column S.B."
  },
  {
    "id": "INT-091",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Division Operator via Projection & Difference",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "The Relational Division operator (R ÷ S) is frequently used in DBMS to answer which type of business query?",
    "options": [
      {
        "id": "A",
        "text": "'Find students who have enrolled in ALL courses required for graduation'",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "'Find the total sum of all employee salaries'",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "'Find employees with no manager'",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "'Find the top 5 highest grossing products'",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Relational division corresponds to the universal quantifier (∀) in first-order logic: finding entities in R associated with ALL entities in S."
  },
  {
    "id": "INT-092",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Commutative Push-Down of Selection",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If condition c depends ONLY on attributes in relation R, which relational equivalence rule holds?",
    "options": [
      {
        "id": "A",
        "text": "σ_c (R ⋈ S) ≡ (σ_c (R)) ⋈ S",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "σ_c (R ⋈ S) ≡ R ⋈ (σ_c (S))",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "σ_c (R ⋈ S) ≡ σ_c (R) ∪ S",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "σ_c (R ⋈ S) ≡ R ⋈ S",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "This is the classic Selection Push-Down rule: filtering relation R prior to joining drastically minimizes the size of the relation passed into the join operator."
  },
  {
    "id": "INT-093",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Push-Down of Projection",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given R(A, B, C) and S(C, D, E), if a query only needs attributes A and E: Π_{A, E} (R ⋈ S). Can we project away attribute C before the join?",
    "options": [
      {
        "id": "A",
        "text": "No, attribute C is the join attribute and must be retained until the join predicate is evaluated",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Yes, projection can always eliminate unused final attributes immediately",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Only if C is indexed",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Yes, by converting to a cross join",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "The join condition requires attribute C (R.C = S.C). Eliminating C before the join would make evaluating the natural join impossible. Attributes not used in the join or final output (such as B and D) can be projected away early, but join keys cannot."
  },
  {
    "id": "INT-094",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Full Outer Join Decomposition",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following algebraic expressions is identical to (R ⟗ S)?",
    "options": [
      {
        "id": "A",
        "text": "(R ⟕ S) ∪ (R ⟖ S)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "(R ⟕ S) ∩ (R ⟖ S)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "(R ⋈ S) ∪ (R × S)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "(R ⋈ S) - (R × S)",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Full outer join is the union of the left outer join (which contains matched + left unmatched) and the right outer join (which contains matched + right unmatched). Union eliminates the duplicate matched tuples, leaving the full outer join."
  },
  {
    "id": "INT-095",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Anti-Join in SQL using NOT EXISTS",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Which query correctly implements the Anti-Join (Customers ▷ Orders) to find customers with zero orders?",
    "options": [
      {
        "id": "A",
        "text": "SELECT * FROM Customers C WHERE NOT EXISTS (SELECT 1 FROM Orders O WHERE O.cust_id = C.id);",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "SELECT * FROM Customers C WHERE EXISTS (SELECT 1 FROM Orders O WHERE O.cust_id = C.id);",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "SELECT * FROM Customers C JOIN Orders O ON C.id = O.cust_id;",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "SELECT * FROM Customers C CROSS JOIN Orders O;",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "NOT EXISTS returns true if and only if the subquery returns 0 rows, identifying customers who have no corresponding order records."
  },
  {
    "id": "INT-096",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Semi-Join Output Schema",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "If relation R has schema (A, B) and relation S has schema (B, C, D), what is the schema of (R ⋉ S)?",
    "options": [
      {
        "id": "A",
        "text": "(A, B)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "(A, B, C, D)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "(B, C, D)",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "(A, C, D)",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "The Semi-Join R ⋉ S projects exclusively onto the schema of the left relation R. Therefore, its schema contains only (A, B)."
  },
  {
    "id": "INT-097",
    "topic": "NULL SEMANTICS",
    "subtopic": "NULL = NULL Evaluation in Joins",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In standard SQL, why does an INNER JOIN on A.col = B.col NEVER match a row where A.col is NULL with a row where B.col is NULL?",
    "options": [
      {
        "id": "A",
        "text": "Because in three-valued logic (3VL), NULL = NULL evaluates to UNKNOWN, and join conditions require TRUE to match",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Because database engines automatically replace NULL with empty string",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Because NULL values are deleted during indexing",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Because foreign keys cannot be NULL",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "In SQL Three-Valued Logic, comparing two NULL values yields UNKNOWN. Since join predicates only accept tuples where the predicate evaluates strictly to TRUE, NULLs never match each other in an INNER JOIN."
  },
  {
    "id": "INT-098",
    "topic": "NULL SEMANTICS",
    "subtopic": "Null-Safe Equality Operator",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In MySQL and PostgreSQL, what operator enables matching NULL values as equal in join conditions?\n(i.e. evaluates NULL <=> NULL as TRUE)",
    "options": [
      {
        "id": "A",
        "text": "The <=> (Spaceship / NULL-Safe Equal) operator or IS NOT DISTINCT FROM",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "The == operator",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "The ~= operator",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "The != operator",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "MySQL's '<=>' and SQL standard 'IS NOT DISTINCT FROM' treat two NULL values as equal, allowing rows where both sides are NULL to join successfully."
  },
  {
    "id": "INT-099",
    "topic": "SQL JOIN SEMANTICS",
    "subtopic": "Logical Query Processing Order",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "In what logical order are the following query clauses evaluated by a SQL query processor?",
    "options": [
      {
        "id": "A",
        "text": "FROM -> ON -> JOIN -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "SELECT -> FROM -> WHERE -> JOIN -> GROUP BY",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "WHERE -> FROM -> JOIN -> SELECT",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "FROM -> SELECT -> WHERE -> HAVING",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Logically, tables are first identified in FROM, joined via ON/JOIN, filtered by WHERE, aggregated with GROUP BY/HAVING, computed in SELECT, and finally ordered by ORDER BY."
  },
  {
    "id": "INT-100",
    "topic": "JOIN OPTIMIZATION",
    "subtopic": "Nested Loop Join Complexity",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What is the worst-case time complexity of a Simple Nested Loop Join between relation R (size M) and relation S (size N) without any indexes?",
    "options": [
      {
        "id": "A",
        "text": "O(M × N)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "O(M + N)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "O(log(M × N))",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "O(M)",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "A simple nested loop join iterates through every tuple in R, and for each tuple scans all tuples in S: total comparisons = M × N, giving O(M × N)."
  },
  {
    "id": "INT-101",
    "topic": "JOIN OPTIMIZATION",
    "subtopic": "Hash Join Prerequisites",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Under what condition is a Hash Join applicable in a relational database?",
    "options": [
      {
        "id": "A",
        "text": "The join condition must contain at least one equality predicate (equijoin)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "The join condition must use only inequality operators (<, >)",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Both relations must be pre-sorted on the join attribute",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Both relations must fit entirely in CPU L1 cache",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "Hash joins build an in-memory hash table on the smaller relation using the join key. This requires an equality predicate (=) to hash and probe identical bucket keys."
  },
  {
    "id": "INT-102",
    "topic": "JOIN OPTIMIZATION",
    "subtopic": "Sort-Merge Join Performance",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "When is a Sort-Merge Join particularly advantageous for the database optimizer?",
    "options": [
      {
        "id": "A",
        "text": "When both input relations are already sorted on the join attributes (e.g. from an index scan)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "When relations contain no common attributes",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "When one relation has 0 rows",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "When executing a CROSS JOIN",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "If both relations are already sorted on the join key (for instance, via clustered indexes), merge join can scan both tables linearly in O(M + N) time without building hash tables."
  },
  {
    "id": "INT-103",
    "topic": "JOIN OPTIMIZATION",
    "subtopic": "Left-Deep vs Bushy Join Trees",
    "difficulty": "Hard",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Why do many relational query optimizers (such as System R) restrict their search space to 'Left-Deep Join Trees'?",
    "options": [
      {
        "id": "A",
        "text": "Left-deep trees allow pipelining of intermediate results without fully materializing right-hand relations to disk",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Left-deep trees are the only trees allowed by ANSI SQL",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Left-deep trees guarantee zero disk reads",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Bushy trees produce incorrect results",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "In a left-deep tree, the right child of every join operator is always a base relation. This allows the inner relation to be scanned or indexed directly while pipelining the outer result stream."
  },
  {
    "id": "INT-104",
    "topic": "SQL JOIN SEMANTICS",
    "subtopic": "Coalesce Function with Outer Joins",
    "difficulty": "Easy",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "What is the purpose of using COALESCE(Employees.bonus, 0) after a LEFT JOIN?",
    "options": [
      {
        "id": "A",
        "text": "To replace NULL values generated for unmatched rows with a default value of 0",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "To filter out rows where bonus is 0",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "To sort employees by bonus",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "To enforce a NOT NULL database constraint",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "COALESCE returns the first non-NULL expression from its arguments. For unmatched outer join rows, bonus is NULL, so COALESCE(bonus, 0) substitutes 0."
  },
  {
    "id": "INT-105",
    "topic": "SQL JOIN SEMANTICS",
    "subtopic": "Multiple Table Join Associativity",
    "difficulty": "Medium",
    "questionType": "MCQ",
    "sourceType": "interactive-practice",
    "question": "Given tables A, B, and C. Is (A INNER JOIN B ON ...) INNER JOIN C ON ... always associative in relational algebra?",
    "options": [
      {
        "id": "A",
        "text": "Yes, inner joins are associative, meaning the optimizer can join (B ⋈ C) first if that produces a smaller intermediate relation",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "No, joins must be evaluated strictly left-to-right as written in the query",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "Only if all tables have foreign keys",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "Only if tables have the same number of columns",
        "isCorrect": false
      }
    ],
    "answer": "A",
    "explanation": "INNER JOIN is both commutative and associative. This fundamental algebraic property gives database query optimizers the freedom to choose any join order tree that minimizes I/O cost."
  },
  {
    "id": "INT-106",
    "topic": "JOIN CARDINALITY",
    "subtopic": "Multi-Table Join Minimum Cardinality",
    "difficulty": "Easy",
    "questionType": "NAT",
    "sourceType": "interactive-practice",
    "question": "If relation A has 5 tuples, B has 10 tuples, and C has 0 tuples, what is the cardinality of (A INNER JOIN B ON A.id = B.id INNER JOIN C ON B.id = C.id)?",
    "options": [
      {
        "id": "A",
        "text": "0",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "5",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "10",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "50",
        "isCorrect": false
      }
    ],
    "answer": "0",
    "explanation": "Since C is empty (0 tuples), joining with C yields 0 tuples. Any inner join chain involving an empty relation produces 0 tuples."
  },
  {
    "id": "INT-107",
    "topic": "JOIN EQUIVALENCE",
    "subtopic": "Commutativity of Joins",
    "difficulty": "Easy",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following join operations are ALWAYS commutative in terms of the set of matching tuple pairs produced? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "INNER JOIN",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "NATURAL JOIN",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "LEFT OUTER JOIN",
        "isCorrect": false
      },
      {
        "id": "D",
        "text": "CROSS JOIN",
        "isCorrect": true
      }
    ],
    "answer": [
      "A",
      "B",
      "D"
    ],
    "explanation": "INNER JOIN, NATURAL JOIN, and CROSS JOIN are all commutative: switching relation order yields identical entity pairings. In contrast, LEFT OUTER JOIN is asymmetric (A LEFT JOIN B preserves A, while B LEFT JOIN A preserves B)."
  },
  {
    "id": "INT-108",
    "topic": "LEFT OUTER JOIN",
    "subtopic": "Anti-Join Implementation Strategies",
    "difficulty": "Medium",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following queries find tuples in table R that have NO matching tuples in table S on attribute id? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "SELECT R.* FROM R LEFT JOIN S ON R.id = S.id WHERE S.id IS NULL;",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "SELECT R.* FROM R WHERE NOT EXISTS (SELECT 1 FROM S WHERE S.id = R.id);",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "SELECT R.* FROM R WHERE R.id NOT IN (SELECT S.id FROM S WHERE S.id IS NOT NULL);",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "SELECT R.* FROM R JOIN S ON R.id <> S.id;",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "Options A (Left Join Anti-Pattern), B (NOT EXISTS), and C (NOT IN with NULL filter) are valid ways to execute an anti-join. Option D is an inequality theta join which returns pairings with non-matching IDs, not unmatched entities."
  },
  {
    "id": "INT-109",
    "topic": "THETA JOIN",
    "subtopic": "Non-Equi Join Conditions",
    "difficulty": "Medium",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following join conditions are classified as NON-EQUI joins? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "ON Emp.salary >= Grade.min_sal AND Emp.salary <= Grade.max_sal",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "ON Emp.dept_id = Dept.dept_id",
        "isCorrect": false
      },
      {
        "id": "C",
        "text": "ON Order1.order_date < Order2.order_date",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "ON A.code <> B.code",
        "isCorrect": true
      }
    ],
    "answer": [
      "A",
      "C",
      "D"
    ],
    "explanation": "Non-equi joins use comparison operators other than strict equality (=). Range checks (BETWEEN / <= / >=), chronological precedence (<), and inequality (<>) are all non-equi joins."
  },
  {
    "id": "INT-110",
    "topic": "NATURAL JOIN",
    "subtopic": "Properties of Natural Join",
    "difficulty": "Medium",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following statements about NATURAL JOIN are TRUE? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "It implicitly equates all attributes with the same name across both relations",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "The resulting schema includes each common attribute only once",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "If relations have no common attributes, it evaluates to the Cartesian product",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "It automatically preserves unmatched rows like an outer join",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "A, B, and C are fundamental mathematical definitions of natural join. D is false because NATURAL JOIN by default is an inner join and eliminates unmatched rows."
  },
  {
    "id": "INT-111",
    "topic": "OUTER JOIN",
    "subtopic": "Preservation of Left Relation",
    "difficulty": "Easy",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following joins will guarantee that NO rows from relation R are discarded from the output? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "R LEFT OUTER JOIN S",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "S RIGHT OUTER JOIN R",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "R FULL OUTER JOIN S",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "R INNER JOIN S",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "R LEFT JOIN S preserves all R rows. S RIGHT JOIN R preserves all R rows. R FULL OUTER JOIN S preserves all rows from both tables. INNER JOIN discards unmatched rows."
  },
  {
    "id": "INT-112",
    "topic": "RELATIONAL ALGEBRA",
    "subtopic": "Primitive Operator Set",
    "difficulty": "Medium",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following relational algebra operators belong to Codd's primitive set of 5 basic operators? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "Selection (σ)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Projection (Π)",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Cartesian Product (×)",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "Natural Join (⋈)",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "Codd's 5 primitive operators are Selection (σ), Projection (Π), Union (∪), Set Difference (-), and Cartesian Product (×). Natural Join (⋈) is a derived operator defined using σ, Π, and ×."
  },
  {
    "id": "INT-113",
    "topic": "JOIN OPTIMIZATION",
    "subtopic": "Join Execution Algorithms",
    "difficulty": "Easy",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following execution algorithms are commonly used by modern database engines to execute equijoins? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "Nested Loop Join",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "Hash Join",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "Sort-Merge Join",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "Depth First Search Join",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "The three foundational physical join operators in relational query engines are Nested Loop Join, Hash Join, and Sort-Merge Join."
  },
  {
    "id": "INT-114",
    "topic": "INNER JOIN",
    "subtopic": "Zero Tuples Result Conditions",
    "difficulty": "Medium",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Consider R(A, B) and S(B, C). Which of the following conditions guarantee that an INNER JOIN (R ⋈ S) returns ZERO rows? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "Either relation R or relation S has 0 rows (empty relation)",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "The set of B values in R is completely disjoint from the set of B values in S",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "All values of B in both relations are NULL",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "Both relations contain 100 rows with identical B values",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "If either relation is empty (A), key sets are disjoint (B), or keys are all NULL (since NULL = NULL evaluates to UNKNOWN in SQL) (C), 0 tuples can match. Option D produces 100 × 100 = 10,000 tuples."
  },
  {
    "id": "INT-115",
    "topic": "NULL SEMANTICS",
    "subtopic": "Three-Valued Logic in Joins",
    "difficulty": "Medium",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following statements about SQL three-valued logic (3VL) in joins are TRUE? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "In an ON clause, NULL = NULL evaluates to UNKNOWN, which does NOT satisfy an inner join",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "An outer join extends missing attribute values with NULL for unmatched rows",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "The spaceship operator <=> or IS NOT DISTINCT FROM treats two NULL values as matching",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "COUNT(*) excludes rows where join columns are NULL",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "A, B, and C are true. D is false because COUNT(*) counts all rows in the result set regardless of NULL values; only COUNT(column) ignores NULLs."
  },
  {
    "id": "INT-116",
    "topic": "JOIN EQUIVALENCE",
    "subtopic": "Relational Algebra Optimization Equivalences",
    "difficulty": "Hard",
    "questionType": "MSQ",
    "sourceType": "interactive-practice",
    "question": "Which of the following relational algebra transformations are valid query optimization equivalences? (Select all that apply)",
    "options": [
      {
        "id": "A",
        "text": "σ_c (R ⋈ S) ≡ (σ_c (R)) ⋈ S, when condition c references only attributes of R",
        "isCorrect": true
      },
      {
        "id": "B",
        "text": "R ⋈ S ≡ S ⋈ R",
        "isCorrect": true
      },
      {
        "id": "C",
        "text": "(R ⋈ S) ⋈ T ≡ R ⋈ (S ⋈ T)",
        "isCorrect": true
      },
      {
        "id": "D",
        "text": "R ⟕ S ≡ S ⟕ R",
        "isCorrect": false
      }
    ],
    "answer": [
      "A",
      "B",
      "C"
    ],
    "explanation": "Selection push-down (A), commutativity of join (B), and associativity of join (C) are fundamental relational algebra equivalence rules. Left outer join is not commutative (D)."
  }
];
