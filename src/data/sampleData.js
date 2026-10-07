export const SAMPLE_DATASETS = {
  employee_dept: {
    id: "employee_dept",
    name: "Employee & Department",
    description: "Classic corporate staff assignment to departments with matching, unassigned staff, and empty departments.",
    tableA: {
      name: "Employee",
      alias: "e",
      keyColumn: "department_id",
      columns: [
        { name: "employee_id", label: "Emp ID", type: "number", isPrimary: true },
        { name: "employee_name", label: "Employee Name", type: "string" },
        { name: "department_id", label: "Dept ID", type: "number", isForeign: true },
        { name: "salary", label: "Salary ($)", type: "number" }
      ],
      rows: [
        { employee_id: 101, employee_name: "Alice Smith", department_id: 1, salary: 75000 },
        { employee_id: 102, employee_name: "Bob Jones", department_id: 2, salary: 62000 },
        { employee_id: 103, employee_name: "Charlie Brown", department_id: 1, salary: 81000 },
        { employee_id: 104, employee_name: "Diana Prince", department_id: 3, salary: 92000 },
        { employee_id: 105, employee_name: "Evan Wright", department_id: null, salary: 50000 },
        { employee_id: 106, employee_name: "Fiona Gallagher", department_id: 5, salary: 68000 }
      ]
    },
    tableB: {
      name: "Department",
      alias: "d",
      keyColumn: "department_id",
      columns: [
        { name: "department_id", label: "Dept ID", type: "number", isPrimary: true },
        { name: "department_name", label: "Department Name", type: "string" },
        { name: "location", label: "Location", type: "string" }
      ],
      rows: [
        { department_id: 1, department_name: "Engineering", location: "Building A" },
        { department_id: 2, department_name: "Marketing", location: "Building B" },
        { department_id: 3, department_name: "Finance", location: "Building C" },
        { department_id: 4, department_name: "Human Resources", location: "Building D" }
      ]
    }
  },
  student_course: {
    id: "student_course",
    name: "Student & Course Enrollments",
    description: "Academic enrollment mapping showing registered students, open electives, and unenrolled students.",
    tableA: {
      name: "Student",
      alias: "s",
      keyColumn: "course_id",
      columns: [
        { name: "student_id", label: "Roll No", type: "number", isPrimary: true },
        { name: "student_name", label: "Student Name", type: "string" },
        { name: "course_id", label: "Course ID", type: "string", isForeign: true },
        { name: "gpa", label: "GPA", type: "number" }
      ],
      rows: [
        { student_id: 201, student_name: "Aarav Sharma", course_id: "CS101", gpa: 3.9 },
        { student_id: 202, student_name: "Priya Nair", course_id: "DS202", gpa: 3.7 },
        { student_id: 203, student_name: "Rohan Varma", course_id: "CS101", gpa: 3.4 },
        { student_id: 204, student_name: "Sneha Patel", course_id: "AI303", gpa: 4.0 },
        { student_id: 205, student_name: "Vikram Das", course_id: null, gpa: 3.1 }
      ]
    },
    tableB: {
      name: "Course",
      alias: "c",
      keyColumn: "course_id",
      columns: [
        { name: "course_id", label: "Course ID", type: "string", isPrimary: true },
        { name: "course_title", label: "Course Title", type: "string" },
        { name: "credits", label: "Credits", type: "number" },
        { name: "instructor", label: "Instructor", type: "string" }
      ],
      rows: [
        { course_id: "CS101", course_title: "Database Systems", credits: 4, instructor: "Dr. Swaminathan A" },
        { course_id: "DS202", course_title: "Data Structures", credits: 4, instructor: "Prof. Ramanathan" },
        { course_id: "AI303", course_title: "Artificial Intelligence", credits: 3, instructor: "Dr. Ananya Roy" },
        { course_id: "CY404", course_title: "Cyber Security", credits: 3, instructor: "Dr. K. Iyer" }
      ]
    }
  },
  customer_orders: {
    id: "customer_orders",
    name: "Customer & Orders",
    description: "E-commerce transaction mapping showing loyal customers, new buyers, and guest checkouts.",
    tableA: {
      name: "Customer",
      alias: "c",
      keyColumn: "customer_id",
      columns: [
        { name: "customer_id", label: "Customer ID", type: "number", isPrimary: true },
        { name: "customer_name", label: "Customer Name", type: "string" },
        { name: "city", label: "City", type: "string" },
        { name: "tier", label: "Membership Tier", type: "string" }
      ],
      rows: [
        { customer_id: 1, customer_name: "Karan Mehta", city: "Mumbai", tier: "Gold" },
        { customer_id: 2, customer_name: "Ananya Sen", city: "Bengaluru", tier: "Platinum" },
        { customer_id: 3, customer_name: "Rahul Joshi", city: "Delhi", tier: "Silver" },
        { customer_id: 4, customer_name: "Zoya Akhtar", city: "Pune", tier: "Bronze" }
      ]
    },
    tableB: {
      name: "Orders",
      alias: "o",
      keyColumn: "customer_id",
      columns: [
        { name: "order_id", label: "Order ID", type: "number", isPrimary: true },
        { name: "customer_id", label: "Customer ID", type: "number", isForeign: true },
        { name: "order_date", label: "Order Date", type: "string" },
        { name: "amount", label: "Total Amount ($)", type: "number" }
      ],
      rows: [
        { order_id: 5001, customer_id: 1, order_date: "2026-03-01", amount: 250 },
        { order_id: 5002, customer_id: 2, order_date: "2026-03-03", amount: 1200 },
        { order_id: 5003, customer_id: 1, order_date: "2026-03-05", amount: 430 },
        { order_id: 5004, customer_id: 99, order_date: "2026-03-07", amount: 80 }
      ]
    }
  },
  doctor_patients: {
    id: "doctor_patients",
    name: "Doctor & Patients",
    description: "Healthcare hospital clinical assignments with primary care physicians and outpatient appointments.",
    tableA: {
      name: "Doctor",
      alias: "doc",
      keyColumn: "doctor_id",
      columns: [
        { name: "doctor_id", label: "Doctor ID", type: "number", isPrimary: true },
        { name: "doctor_name", label: "Doctor Name", type: "string" },
        { name: "specialty", label: "Specialty", type: "string" }
      ],
      rows: [
        { doctor_id: 11, doctor_name: "Dr. Alok Verma", specialty: "Cardiology" },
        { doctor_id: 12, doctor_name: "Dr. Sunita Rao", specialty: "Neurology" },
        { doctor_id: 13, doctor_name: "Dr. Kevin Peter", specialty: "Orthopedics" },
        { doctor_id: 14, doctor_name: "Dr. Neha Kapoor", specialty: "Pediatrics" }
      ]
    },
    tableB: {
      name: "Patient",
      alias: "p",
      keyColumn: "doctor_id",
      columns: [
        { name: "patient_id", label: "Patient ID", type: "number", isPrimary: true },
        { name: "patient_name", label: "Patient Name", type: "string" },
        { name: "doctor_id", label: "Assigned Doctor", type: "number", isForeign: true },
        { name: "diagnosis", label: "Diagnosis", type: "string" }
      ],
      rows: [
        { patient_id: 901, patient_name: "Mohan Das", doctor_id: 11, diagnosis: "Arrhythmia" },
        { patient_id: 902, patient_name: "Geeta Sen", doctor_id: 12, diagnosis: "Migraine" },
        { patient_id: 903, patient_name: "Amitabh Ray", doctor_id: 11, diagnosis: "Hypertension" },
        { patient_id: 904, patient_name: "Simran Kaur", doctor_id: 99, diagnosis: "Fever" }
      ]
    }
  },
  library_books: {
    id: "library_books",
    name: "Library & Books",
    description: "University library loans showing members, borrowed titles, overdue records, and idle catalog items.",
    tableA: {
      name: "Member",
      alias: "m",
      keyColumn: "member_id",
      columns: [
        { name: "member_id", label: "Member ID", type: "number", isPrimary: true },
        { name: "member_name", label: "Member Name", type: "string" },
        { name: "membership_type", label: "Type", type: "string" }
      ],
      rows: [
        { member_id: 301, member_name: "Ramesh Babu", membership_type: "Faculty" },
        { member_id: 302, member_name: "Pooja Hegde", membership_type: "Student" },
        { member_id: 303, member_name: "Tanmay Bhat", membership_type: "Research Scholar" },
        { member_id: 304, member_name: "Kavya Maran", membership_type: "Student" }
      ]
    },
    tableB: {
      name: "BookLoan",
      alias: "b",
      keyColumn: "member_id",
      columns: [
        { name: "loan_id", label: "Loan ID", type: "number", isPrimary: true },
        { name: "member_id", label: "Borrower ID", type: "number", isForeign: true },
        { name: "book_title", label: "Book Title", type: "string" },
        { name: "due_days", label: "Days Remaining", type: "number" }
      ],
      rows: [
        { loan_id: 701, member_id: 301, book_title: "Database System Concepts - Silberschatz", due_days: 14 },
        { loan_id: 702, member_id: 302, book_title: "Fundamentals of DBMS - Elmasri & Navathe", due_days: 7 },
        { loan_id: 703, member_id: 301, book_title: "Designing Data-Intensive Applications", due_days: 21 },
        { loan_id: 704, member_id: 499, book_title: "Introduction to Algorithms - CLRS", due_days: 3 }
      ]
    }
  },
  fire_department: {
    id: "fire_department",
    name: "Fire Department Management",
    description: "Emergency response stations, crew personnel, operational units, and regional jurisdiction mapping.",
    tableA: {
      name: "Station",
      alias: "st",
      keyColumn: "station_id",
      columns: [
        { name: "station_id", label: "Station ID", type: "number", isPrimary: true },
        { name: "station_name", label: "Station Name", type: "string" },
        { name: "zone", label: "District Zone", type: "string" }
      ],
      rows: [
        { station_id: 1, station_name: "Central Firehouse", zone: "Downtown" },
        { station_id: 2, station_name: "Westside Station 4", zone: "Industrial" },
        { station_id: 3, station_name: "Harbor Station 9", zone: "Coastal" },
        { station_id: 4, station_name: "Hilltop Station 12", zone: "Suburbs" }
      ]
    },
    tableB: {
      name: "FireTruck",
      alias: "ft",
      keyColumn: "station_id",
      columns: [
        { name: "truck_id", label: "Truck Unit", type: "string", isPrimary: true },
        { name: "station_id", label: "Station ID", type: "number", isForeign: true },
        { name: "vehicle_type", label: "Type", type: "string" },
        { name: "pump_capacity_gpm", label: "Capacity (GPM)", type: "number" }
      ],
      rows: [
        { truck_id: "Engine-101", station_id: 1, vehicle_type: "Pumper Truck", pump_capacity_gpm: 1500 },
        { truck_id: "Ladder-202", station_id: 2, vehicle_type: "Aerial Ladder", pump_capacity_gpm: 2000 },
        { truck_id: "Rescue-303", station_id: 1, vehicle_type: "Heavy Rescue", pump_capacity_gpm: 1250 },
        { truck_id: "Hazard-909", station_id: 8, vehicle_type: "HazMat Responder", pump_capacity_gpm: 1000 }
      ]
    }
  },
  self_join_hierarchy: {
    id: "self_join_hierarchy",
    name: "Employee Manager Hierarchy (Self-Join Ready)",
    description: "Single hierarchical employee table featuring manager IDs, ideal for recursive self-join demonstrations.",
    tableA: {
      name: "EmpHierarchy",
      alias: "emp",
      keyColumn: "manager_id",
      columns: [
        { name: "emp_id", label: "Emp ID", type: "number", isPrimary: true },
        { name: "name", label: "Name", type: "string" },
        { name: "role", label: "Role", type: "string" },
        { name: "manager_id", label: "Manager ID", type: "number" }
      ],
      rows: [
        { emp_id: 1, name: "CEO Vikramaditya", role: "Executive Director", manager_id: null },
        { emp_id: 2, name: "Meera Sen", role: "VP Engineering", manager_id: 1 },
        { emp_id: 3, name: "Raghav Menon", role: "VP Operations", manager_id: 1 },
        { emp_id: 4, name: "Aman Gupta", role: "Senior Dev", manager_id: 2 },
        { emp_id: 5, name: "Sara Khan", role: "Lead Architect", manager_id: 2 },
        { emp_id: 6, name: "Nitin Gadhavi", role: "Ops Lead", manager_id: 3 }
      ]
    },
    tableB: {
      name: "EmpHierarchy_Copy",
      alias: "mgr",
      keyColumn: "emp_id",
      columns: [
        { name: "emp_id", label: "Manager ID (PK)", type: "number", isPrimary: true },
        { name: "name", label: "Manager Name", type: "string" },
        { name: "role", label: "Manager Role", type: "string" },
        { name: "manager_id", label: "Senior Manager ID", type: "number" }
      ],
      rows: [
        { emp_id: 1, name: "CEO Vikramaditya", role: "Executive Director", manager_id: null },
        { emp_id: 2, name: "Meera Sen", role: "VP Engineering", manager_id: 1 },
        { emp_id: 3, name: "Raghav Menon", role: "VP Operations", manager_id: 1 },
        { emp_id: 4, name: "Aman Gupta", role: "Senior Dev", manager_id: 2 },
        { emp_id: 5, name: "Sara Khan", role: "Lead Architect", manager_id: 2 },
        { emp_id: 6, name: "Nitin Gadhavi", role: "Ops Lead", manager_id: 3 }
      ]
    }
  }
};
