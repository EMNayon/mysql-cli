// MySQL CLI Complete A-to-Z Command Reference Dataset
// Covers: Server Connect, Direct One-Liners, DDL (Databases/Tables), DML (Queries/CRUD), Heavy Imports/Exports, Security, System Variables & Diagnostics
// Retains real-world ERP case study (`erp_publication_adhunik_v2_beta` & `adhunikp_beta_db.sql`)

const COMMANDS_DATA = [
  // =========================================================================
  // STAGE 1: SERVER CONNECT, LOGIN & SHELL EXIT
  // =========================================================================
  {
    id: "cmd-start-1",
    category: "getting-started",
    badge: "Stage 1: Service",
    title: {
      bn: "MySQL সার্ভিস স্ট্যাটাস ও স্টার্ট করা (Linux Service)",
      en: "Check & Start MySQL Server Service in Linux"
    },
    description: {
      bn: "টার্মিনালে MySQL সার্ভার রানিং আছে কিনা চেক করা এবং স্টার্ট বা রিস্টার্ট করা।",
      en: "Verify if MySQL daemon is active and manage systemd server state."
    },
    command: "sudo systemctl status mysql\nsudo systemctl start mysql",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "সার্ভার বন্ধ থাকলে phpMyAdmin ৪0৪ দেখাবে। লিনাক্স সার্ভিস চেক করার একমাত্র উপায় টার্মিনাল।",
      en: "Control panel GUIs fail completely if mysql service is inactive; terminal gives direct systemd control."
    },
    proTips: [
      "রিস্টার্ট করার নির্দেশ: `sudo systemctl restart mysql`",
      "বুট নেওয়ার সাথে অটো-স্টার্ট করতে: `sudo systemctl enable mysql`"
    ],
    tags: ["getting-started", "service", "systemctl", "connect"],
    syntax: "sudo systemctl [status|start|restart|stop] mysql"
  },
  {
    id: "cmd-start-2",
    category: "getting-started",
    badge: "Stage 1: Login",
    title: {
      bn: "MySQL CLI-তে লোকাল রুটে নিরাপদ প্রবেশ (Password Prompt)",
      en: "Log in to Local MySQL Server via CLI"
    },
    description: {
      bn: "টার্মিনাল থেকে পাসওয়ার্ড প্রম্পট সহ রুট বা নির্দিষ্ট ইউজার হিসেবে ইন্টারঅ্যাক্টিভ কনসোলে প্রবেশ করা।",
      en: "Securely enter MySQL interactive prompt with hidden password prompt."
    },
    command: "mysql -u lighttecha1 -p",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "পাসওয়ার্ড কীবোর্ডে টাইপ করার সময় অদৃশ্য থাকে, যা কোনো ব্রাউজারে সেভ হওয়ার ঝুঁকি থাকে না।",
      en: "Keeps connection credentials out of browser local storage and plaintext logs."
    },
    proTips: [
      "রুট ইউজার হিসেবে লগইন করতে: `mysql -u root -p`",
      "ক্যাপাসিটি চারসেট সহ ঢুকতে: `mysql -u root -p --default-character-set=utf8mb4`",
      "কনসোল থেকে বের হতে লিখুন: `exit` অথবা `quit` বা `Ctrl+D`"
    ],
    tags: ["getting-started", "login", "connect", "root"],
    syntax: "mysql -u [username] -p"
  },
  {
    id: "cmd-start-3",
    category: "getting-started",
    badge: "Stage 1: Non-Interactive",
    title: {
      bn: "MySQL কনসোলে না ঢুকেই সরাসরি এক লাইনে কুয়েরি চালানো",
      en: "Execute One-Liner SQL Query directly from Bash without entering CLI"
    },
    description: {
      bn: "টার্মিনালে রিডাইরেক্ট না হয়েই সরাসরি শেল থেকে ডাটাবেজ লিস্ট বা টেস্ট কুয়েরি রান করা।",
      en: "Run quick inline queries via `-e` flag from shell without keeping open connection."
    },
    command: "mysql -u lighttecha1 -p -e \"SHOW DATABASES;\"",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "শেল স্ক্রিপ্টিং বা অটোমেশনে কোনো মেনু না খুলে ব্যাকগ্রাউন্ডে ফলাফল আনা যায়।",
      en: "Ideal for shell scripts and automated cron jobs needing database query outputs."
    },
    proTips: [
      "নির্দিষ্ট ডাটাবেজে কুয়েরি করতে: `mysql -u user -p -e \"SELECT COUNT(*) FROM users;\" db_name`",
      "ভার্টিক্যাল রেজাল্ট দেখতে: `mysql -u user -p -e \"SELECT * FROM users LIMIT 1\\G\" db_name`"
    ],
    tags: ["getting-started", "one-liner", "inline", "execute"],
    syntax: "mysql -u [user] -p -e \"[SQL_QUERY]\" [db_name]"
  },
  {
    id: "cmd-start-4",
    category: "getting-started",
    badge: "Stage 1: Remote Host",
    title: {
      bn: "রিমোট কাস্টম হোস্ট ও পোর্টে কানেক্ট হওয়া (Remote VPS/Cloud)",
      en: "Connect to Remote MySQL Server specifying Host IP & Port"
    },
    description: {
      bn: "দূরবর্তী কোনো ক্লাউড বা ভিপিএস (VPS) সার্ভারে পোর্টের মাধ্যমে রিডাইরেক্ট হয়ে কানেক্ট করা।",
      en: "Establish direct CLI socket shell into remote cloud MySQL servers."
    },
    command: "mysql -h 192.168.1.100 -P 3306 -u lighttecha1 -p",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "কোনো phpMyAdmin ইন্সটল করা ছাড়াই সরাসরি রিমোট সার্ভারের ডাটাবেজ এক্সেস করা যায়।",
      en: "Eliminates need for exposed web control panels on remote staging or production nodes."
    },
    proTips: [
      "ডিফল্ট MySQL পোর্ট `3306`",
      "SSL কানেকশন ব্যবহারে: `mysql -h host -u user -p --ssl-mode=REQUIRED`"
    ],
    tags: ["getting-started", "remote", "host", "port"],
    syntax: "mysql -h [host_ip] -P [port] -u [user] -p"
  },

  // =========================================================================
  // STAGE 2: DATABASE CREATION & MANAGEMENT (DDL)
  // =========================================================================
  {
    id: "cmd-db-1",
    category: "db-table-crud",
    badge: "Stage 2: Create DB",
    title: {
      bn: "ইউনিকোড ও বাংলা সাপোর্টসহ নতুন ডাটাবেজ তৈরি",
      en: "Create Database with UTF8MB4 Collation (Bengali & Emoji Ready)"
    },
    description: {
      bn: "বাংলা ও ইমোজি সাপোর্ট নিশ্চিত করতে `utf8mb4_unicode_ci` ক্যারেক্টারসেটে ডাটাবেজ গঠন করা।",
      en: "Creates database with 4-byte UTF-8 encoding preventing broken character representations."
    },
    command: "CREATE DATABASE IF NOT EXISTS erp_publication_adhunik_v2_beta DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "এক লাইনেই মিসম্যাচ ছাড়া সঠিক ক্যারেক্টার সেট গ্যারান্টি দেওয়া যায়।",
      en: "Ensures default database creation forces full 4-byte UTF-8 standard at creation time."
    },
    proTips: [
      "বিদ্যমান সব ডাটাবেজের তালিকা দেখতে: `SHOW DATABASES;`",
      "ডাটাবেজ এক্টিভ করতে: `USE erp_publication_adhunik_v2_beta;`"
    ],
    tags: ["db-table-crud", "create-db", "utf8mb4", "bengali"],
    syntax: "CREATE DATABASE [name] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  },
  {
    id: "cmd-db-2",
    category: "db-table-crud",
    badge: "Stage 2: Schema Switch",
    title: {
      bn: "ডাটাবেজের তালিকা দেখা ও সক্রিয় ডাটাবেজে সুইচ করা",
      en: "List All Databases & Switch Active Schema Context"
    },
    description: {
      bn: "সার্ভারের সকল ডাটাবেজ লিস্ট দেখে নির্দিষ্ট প্রজেক্টের ডাটাবেজ সিলেক্ট করা।",
      en: "List schemas and set current session context to selected database."
    },
    command: "SHOW DATABASES;\nUSE erp_publication_adhunik_v2_beta;\nSELECT DATABASE();",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "কোন ডাটাবেজে আছেন তা `SELECT DATABASE();` দিয়ে তাৎক্ষণিক কনফার্ম হওয়া যায়।",
      en: "Instant confirmation of active schema target before running destructive queries."
    },
    proTips: [
      "কমান্ডের শেষে সেমিকোলনের (`;`) ব্যবহার বাধ্যতামূলক।",
      "বর্তমানে সক্রিয় ডাটাবেজের নাম পেতে: `SELECT DATABASE();`"
    ],
    tags: ["db-table-crud", "show-databases", "use", "select-database"],
    syntax: "SHOW DATABASES; USE [db_name];"
  },
  {
    id: "cmd-db-3",
    category: "db-table-crud",
    badge: "Stage 2: Drop DB",
    title: {
      bn: "অপ্রয়োজনীয় ডাটাবেজ নিরাপদভাবে ডিলিট করা (`DROP DATABASE`)",
      en: "Drop / Delete Database safely with IF EXISTS"
    },
    description: {
      bn: "টেস্ট বা পুরাতন ডাটাবেজ মুছে ফেলা (সাবধানতা আবশ্যক!)।",
      en: "Permanently removes database schema and all underlying table contents."
    },
    command: "DROP DATABASE IF EXISTS test_dummy_db;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "GUI তে ঝুলন্ত লোডিং ছাড়াই ব্যাকগ্রাউন্ডে ইনস্ট্যান্ট ফাইল আনলিংক সম্পন্ন হয়।",
      en: "Instantly reclaims storage filesystem pointers directly in the OS kernel."
    },
    proTips: [
      "সাবধান! এটি রিকভার করা সম্ভব নয়। ব্যাকআপ না নিয়ে প্রোডাকশন ডিলিট করবেন না।"
    ],
    tags: ["db-table-crud", "drop-database", "delete"],
    syntax: "DROP DATABASE IF EXISTS [db_name];"
  },

  // =========================================================================
  // STAGE 3: TABLE SCHEMA DESIGN & MANAGEMENT (DDL)
  // =========================================================================
  {
    id: "cmd-table-1",
    category: "db-table-crud",
    badge: "Stage 3: Table List",
    title: {
      bn: "সকল টেবিল তালিকা দেখা ও স্কিমা ডিসক্রাইব করা",
      en: "Show All Tables & Inspect Column Data Types"
    },
    description: {
      bn: "সক্রিয় ডাটাবেজে কতগুলো টেবিল আছে তা দেখা এবং নির্দিষ্ট টেবিলের কলাম স্ট্রাকচার ইনস্পেক্ট করা।",
      en: "Displays list of tables and details field names, data types, nullability, and primary keys."
    },
    command: "SHOW TABLES;\nDESCRIBE users;",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "১২৬টি টেবিল তালিকায় ক্লিক করে লোড দেওয়ার ঝামেলা ছাড়া এক সেকেন্ডে ফিল্ড লিস্ট পাওয়া যায়।",
      en: "Lightning fast inspection of column definitions without UI lag."
    },
    proTips: [
      "সংক্ষেপে টাইপ করতে: `DESC users;`",
      "টেবিলের সঠিক `CREATE TABLE` কোড দেখতে: `SHOW CREATE TABLE users\\G`"
    ],
    tags: ["db-table-crud", "show-tables", "describe", "schema"],
    syntax: "SHOW TABLES; DESCRIBE [table_name];"
  },
  {
    id: "cmd-table-2",
    category: "db-table-crud",
    badge: "Stage 3: Create Table",
    title: {
      bn: "প্রাইমারি ও ফরেন কি সহ নতুন টেবিল তৈরি (`CREATE TABLE`)",
      en: "Create Relational InnoDB Table with Primary & Foreign Keys"
    },
    description: {
      bn: "ইনডেক্সিং, ইউনিক কনস্ট্রেইন্ট ও রিলেশনাল ফরেন কি কানেকশনসহ প্রফেশনাল টেবিল স্কিমা তৈরি।",
      en: "Defines table structures with strict data types, auto-increments, and relational constraints."
    },
    command: "CREATE TABLE IF NOT EXISTS users (\n  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,\n  name VARCHAR(191) NOT NULL,\n  email VARCHAR(191) NOT NULL UNIQUE,\n  password VARCHAR(255) NOT NULL,\n  role_id INT UNSIGNED DEFAULT 1,\n  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\n  INDEX idx_email (email)\n) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "ইনডেক্স ও কনস্ট্রেইন্ট নির্ভুলভাবে কোড আকারে ভার্সন কন্ট্রোলে রাখা যায়।",
      en: "Allows exact DDL script version control for team migrations."
    },
    proTips: [
      "সর্বদা `ENGINE=InnoDB` ব্যবহার করুন (ট্রানজেকশন ও ফরেন কি সাপোর্টের জন্য)।",
      "বাংলা সাজেশনের জন্য `CHARSET=utf8mb4` বেছে নিন।"
    ],
    tags: ["db-table-crud", "create-table", "innodb", "primary-key"],
    syntax: "CREATE TABLE [name] (column_definitions) ENGINE=InnoDB;"
  },
  {
    id: "cmd-table-3",
    category: "db-table-crud",
    badge: "Stage 3: Alter Schema",
    title: {
      bn: "টেবিলে নতুন কলাম বা ইনডেক্স যোগ ও পরিবর্তন (`ALTER TABLE`)",
      en: "Alter Table Schema, Add Column & Create Indexes"
    },
    description: {
      bn: "বিদ্যমান টেবিল ড্রপ না করেই নতুন কলাম যোগ করা, ইনডেক্স তৈরি করা বা টাইপ পরিবর্তন।",
      en: "Modify existing table columns and append high-speed search indexes dynamically."
    },
    command: "ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER email;\nALTER TABLE users ADD INDEX idx_phone (phone);",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "১ লাখের বেশি ডাটার বড় টেবিলে ইনডেক্স যোগ করার সময় CLI ঝুলবে না।",
      en: "Executes non-blocking online DDL schema changes cleanly on large tables."
    },
    proTips: [
      "কলাম ডিলিট করতে: `ALTER TABLE users DROP COLUMN phone;`",
      "কলামের নাম বদলাতে: `ALTER TABLE users CHANGE phone mobile VARCHAR(25);`"
    ],
    tags: ["db-table-crud", "alter-table", "add-column", "index"],
    syntax: "ALTER TABLE [table] ADD COLUMN [col] [type];"
  },
  {
    id: "cmd-table-4",
    category: "db-table-crud",
    badge: "Stage 3: Truncate Table",
    title: {
      bn: "টেবিলের সব ডাটা খালি করা ও আইডি রিসেট (`TRUNCATE TABLE`)",
      en: "Empty All Rows Fast & Reset Auto Increment ID"
    },
    description: {
      bn: "টেবিলের ডাটা সম্পূর্ণ মুছে কলাম স্ট্রাকচার ঠিক রেখে `AUTO_INCREMENT` আইডি ১-এ রিসেট করা।",
      en: "Drops and recreates table empty instance reclaimed storage instantly."
    },
    command: "TRUNCATE TABLE audit_logs;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "`DELETE FROM` রো-বাই-রো মোছে যা ধীরগতির; `TRUNCATE` ১ সেকেন্ডে ১০ লাখ ডাটা রিসেট করে।",
      en: "Bypasses row-level lock tracking, completing instantly regardless of table size."
    },
    proTips: [
      "সতর্কতা: এটি রোলব্যাক করা যায় না।"
    ],
    tags: ["db-table-crud", "truncate", "reset-table", "clean"],
    syntax: "TRUNCATE TABLE [table_name];"
  },

  // =========================================================================
  // STAGE 4: DATA MANIPULATION & QUERIES (DML / CRUD)
  // =========================================================================
  {
    id: "cmd-crud-1",
    category: "query-dml",
    badge: "Stage 4: Data Insert",
    title: {
      bn: "টেবিলে নতুন রো বা ডাটা ইনসার্ট করা (`INSERT INTO`)",
      en: "Insert Single & Multi-row Records into Table"
    },
    description: {
      bn: "একক বা একসাথে একাধিক রেকর্ড ডাটাবেজ টেবিলে যুক্ত করা।",
      en: "Appends single or bulk batch records into target table."
    },
    command: "INSERT INTO users (name, email, password, role_id) VALUES \n('Tanvir Ahmed', 'tanvir@example.com', '$2y$10$hashedpass1', 1),\n('Adhunik Publications', 'info@adhunik.com', '$2y$10$hashedpass2', 2);",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "বাল্ক ইনসার্ট এক কুয়েরিতে হাজারো রেকর্ড মুহূর্তের মধ্যে যোগ করে।",
      en: "Bulk multi-row INSERTs process up to 50x faster than individual query calls."
    },
    proTips: [
      "ইনসার্ট শেষ হলে আইডি চেক করুন: `SELECT LAST_INSERT_ID();`",
      "ডুপ্লিকেট ইগনোর করতে: `INSERT IGNORE INTO users ...`"
    ],
    tags: ["query-dml", "insert", "bulk-insert", "records"],
    syntax: "INSERT INTO [table] (cols) VALUES (val1), (val2);"
  },
  {
    id: "cmd-crud-2",
    category: "query-dml",
    badge: "Stage 4: Select Queries",
    title: {
      bn: "ফিল্টারিং, JOIN এবং ফিল্ড সার্চ কুয়েরি (`SELECT` & `JOIN`)",
      en: "Query Data with WHERE, INNER JOIN & Formatting"
    },
    description: {
      bn: "দুই বা ততধিক টেবিল জয়েন করে শর্তসাপেক্ষে সুনির্দিষ্ট ফিল্ডের তথ্য তুলে আনা।",
      en: "Retrieves relational records combining child and parent dataset rows."
    },
    command: "SELECT u.id, u.name, u.email, r.name AS role_name \nFROM users u \nINNER JOIN roles r ON u.role_id = r.id \nWHERE u.email LIKE '%adhunik%' \nORDER BY u.id DESC LIMIT 10;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "আউটপুট ভার্টিক্যালি বড় হলে শেষে `\\G` দিলে প্রতিটি রো আলাদা বাক্সে ইনস্পেক্ট করা যায়।",
      en: "Appending `\\G` formats wide relational table rows into clean key-value vertical blocks."
    },
    proTips: [
      "ভার্টিক্যাল প্রীতিময় আউটপুট দেখতে শেষে সেমিকোলনের জায়গায় `\\G` দিন: `SELECT * FROM users WHERE id=1\\G`",
      "মোট কতগুলো রো আছে জানতে: `SELECT COUNT(*) FROM users;`"
    ],
    tags: ["query-dml", "select", "join", "where", "formatting"],
    syntax: "SELECT [cols] FROM [table] INNER JOIN [other] ON [condition];"
  },
  {
    id: "cmd-crud-3",
    category: "query-dml",
    badge: "Stage 4: Update & Delete",
    title: {
      bn: "নিরাপদে ডাটা আপডেট ও ডিলিট করা (`UPDATE` & `DELETE`)",
      en: "Safely Update & Delete Records with WHERE Clause"
    },
    description: {
      bn: "শর্তসাপেক্ষে নির্দিষ্ট রো-এর মান আপডেট করা অথবা ভুল রেকর্ড মুছে ফেলা।",
      en: "Modifies or removes filtered database table records safely."
    },
    command: "-- Update Record\nUPDATE users SET role_id = 2 WHERE email = 'tanvir@example.com';\n\n-- Delete Record\nDELETE FROM users WHERE id = 105;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "`WHERE` ছাড়া ভুল আপডেট/ডিলিট রোধ করতে আগে `SELECT` দিয়ে রো নিশ্চিত হওয়া যায়।",
      en: "Ensures precise targeting before making permanent row state modifications."
    },
    proTips: [
      "সতর্কতা: `WHERE` ক্লজ ছাড়া `UPDATE` বা `DELETE` দিলে টেবিলের সব রেকর্ড মুছে বা বদলে যাবে!",
      "আগে `SELECT * FROM table WHERE condition;` দিয়ে মিলিয়ে নিন।"
    ],
    tags: ["query-dml", "update", "delete", "where"],
    syntax: "UPDATE [table] SET [col]=[val] WHERE [cond]; DELETE FROM [table] WHERE [cond];"
  },

  // =========================================================================
  // STAGE 5: HEAVY DATABASE IMPORT, EXPORT & PIPELINES (REAL CASE STUDY)
  // =========================================================================
  {
    id: "cmd-import-1",
    category: "import-export",
    badge: "Stage 5: Live Stream",
    title: {
      bn: "Pipe Viewer (`pv`) দিয়ে সরাসরি লাইভ প্রগ্রেসসহ ইমপোর্ট (Real ERP)",
      en: "Live Import with Pipe Viewer (`pv` Progress Meter)"
    },
    description: {
      bn: "আপনার ১২৬টি টেবিলের `adhunikp_beta_db.sql` ফাইলটি লাইভ গতি (MB/s) ও শতাংশ প্রগ্রেসসহ সকেটে ইমপোর্ট করার উপায়।",
      en: "Streams heavy database dumps to MySQL UNIX socket with live progress status."
    },
    command: "pv adhunikp_beta_db.sql | mysql -u lighttecha1 -p erp_publication_adhunik_v2_beta",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "phpMyAdmin-এ মেমোরি লিমিট ও টাইমআউট ট্র্যাপ থাকে। CLI পাইপলাইন ১-৫০ জিবি ফাইল মেমোরি ছাড়াই রিস্টোর করে।",
      en: "phpMyAdmin crashes on files >50MB due to execution limits. Terminal socket streaming has zero file size ceilings."
    },
    proTips: [
      "ইন্সটল করতে লিনাক্সে চালান: `sudo apt install pv`",
      "গিজিপ ফাইলের ক্ষেত্রে: `zcat backup.sql.gz | pv | mysql -u user -p db`"
    ],
    tags: ["import-export", "import", "pv", "pipe", "fast"],
    syntax: "pv [file.sql] | mysql -u [user] -p [database]"
  },
  {
    id: "cmd-import-2",
    category: "import-export",
    badge: "Stage 5: Turbo Source",
    title: {
      bn: "Foreign Key ও Autocommit বন্ধ রেখে `source` দিয়ে দ্রুত ইমপোর্ট",
      en: "Fast Console Import via `source` with FK Validation Disabled"
    },
    description: {
      bn: "MySQL CLI-তে ঢুকে `SET foreign_key_checks = 0;` সাময়িক বন্ধ রেখে `source` দিয়ে বিশাল ইআরপি ফাইল ইমপোর্ট।",
      en: "Log into MySQL CLI, temporarily disable foreign key index locks, and execute SQL dump."
    },
    command: "USE erp_publication_adhunik_v2_beta;\nSET foreign_key_checks = 0;\nSET autocommit = 0;\nsource adhunikp_beta_db.sql;\nCOMMIT;\nSET foreign_key_checks = 1;",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "ইনডেক্স ও কনস্ট্রেইন্ট ডিস্ক আই/ও রাইট লক হয় না, ফলে ইমপোর্ট গতি ৫ থেকে ১০ গুণ বেড়ে যায়।",
      en: "Eliminates cascading index rebuild locks during inserts, boosting restoration throughput by up to 10x."
    },
    proTips: [
      "সোর্স রান করার আগে অবশ্যই `USE database_name;` সিলেক্ট করুন।",
      "ইমপোর্ট শেষে `SET foreign_key_checks = 1;` অন করুন।"
    ],
    tags: ["import-export", "source", "foreign_key", "speedup"],
    syntax: "SET foreign_key_checks=0; source /path/to/file.sql;"
  },
  {
    id: "cmd-export-1",
    category: "import-export",
    badge: "Stage 5: Live Backup",
    title: {
      bn: "টেবিল লক ছাড়া অন-দ্য-ফ্লাই `mysqldump` প্রোডাকশন ব্যাকআপ",
      en: "Non-Locking Production Backup with `mysqldump`"
    },
    description: {
      bn: "প্রোডাকশন সার্ভারে লাইভ ইউজার থাকা অবস্থায়ও কোনো লক ছাড়া ব্যাকআপ ডাম্প জেনারেট।",
      en: "Creates a consistent database dump snapshot from InnoDB engine tables without blocking application traffic."
    },
    command: "mysqldump -u lighttecha1 -p --single-transaction --quick --routines erp_publication_adhunik_v2_beta > backup_$(date +%F).sql",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "`--single-transaction` InnoDB টেবিল ড্রপ/লক না করে snapshot ধরে নিয়ে ব্যাকআপ করে।",
      en: "`--single-transaction` uses MVCC isolation snapshot instead of locking table rows."
    },
    proTips: [
      "`--quick` মেমোরিতে পুরো টেবিল লোড না করে রো-বাই-রো স্ট্রিম করে ডিস্কে লেখে।",
      "কমপ্রেসড ব্যাকআপ করতে: `mysqldump ... | gzip -9 > backup.sql.gz`"
    ],
    tags: ["import-export", "export", "mysqldump", "single-transaction"],
    syntax: "mysqldump -u [user] -p --single-transaction [db] > [output.sql]"
  },
  {
    id: "cmd-export-2",
    category: "import-export",
    badge: "Stage 5: Schema Only",
    title: {
      bn: "শুধুমাত্র স্কিমা/স্ট্রাকচার ব্যাকআপ (ডাটা ছাড়া `--no-data`)",
      en: "Export Schema / DDL Structure Only without Table Data"
    },
    description: {
      bn: "কোনো ডাটা ছাড়া শুধুমাত্র সকল টেবিলের `CREATE TABLE` স্ট্রাকচার ও ইনডেক্স ব্যাকআপ নেওয়া।",
      en: "Generates lightweight DDL database structure SQL file excluding row contents."
    },
    command: "mysqldump -u lighttecha1 -p --no-data erp_publication_adhunik_v2_beta > schema_only.sql",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "নতুন ডেভেলপমেন্ট এনভায়রনমেন্ট সাজাতে লাইটওয়েট স্কিমা তৈরি করতে সেরা উপায়।",
      en: "Produces clean lightweight migration files ideal for staging and dev setup."
    },
    proTips: [
      "শুধুমাত্র ডাটা নিতে (স্ট্রাকচার ছাড়া): `mysqldump -u user -p --no-create-info db > data_only.sql`"
    ],
    tags: ["import-export", "export", "schema-only", "no-data"],
    syntax: "mysqldump -u [user] -p --no-data [database] > schema.sql"
  },

  // =========================================================================
  // STAGE 6: USER MANAGEMENT & SECURITY GRANTS
  // =========================================================================
  {
    id: "cmd-admin-1",
    category: "administration",
    badge: "Stage 6: Create User",
    title: {
      bn: "নতুন ডাটাবেজ ইউজার তৈরি ও পারমিশন প্রদান (`GRANT ALL`)",
      en: "Create Secure User & Assign Database Privileges"
    },
    description: {
      bn: "রুট ছাড়া নিরাপদ অ্যাপ ইউজার তৈরি করা এবং নির্দিষ্ট ডাটাবেজে ফুল প্রিভিলেজ এসাইন করে পারমিশন রিলোড করা।",
      en: "Creates dedicated app database user with host restrictions and grants table access permissions."
    },
    command: "CREATE USER 'erp_admin'@'localhost' IDENTIFIED BY 'StrongPass123!';\nGRANT ALL PRIVILEGES ON erp_publication_adhunik_v2_beta.* TO 'erp_admin'@'localhost';\nFLUSH PRIVILEGES;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "এক লাইনেই ইউজার তৈরি, হোস্ট বাউন্ডিং ও মেমোরিতে পারমিশন রিফ্রেশ করা যায়।",
      en: "Guarantees privilege tables are reloaded instantly in memory using `FLUSH PRIVILEGES`."
    },
    proTips: [
      "যেকোনো হোস্ট থেকে এক্সেস দিতে `'localhost'` এর স্থানে `'%'` ব্যবহার করুন।",
      "ইউজারের পারমিশন চেক করতে: `SHOW GRANTS FOR 'erp_admin'@'localhost';`"
    ],
    tags: ["administration", "users", "grant", "security"],
    syntax: "CREATE USER '[user]'@'[host]' IDENTIFIED BY '[pass]'; GRANT ALL ON [db].* TO '[user]'@'[host]';"
  },
  {
    id: "cmd-admin-2",
    category: "administration",
    badge: "Stage 6: Pass & Grants",
    title: {
      bn: "ইউজারের পাসওয়ার্ড পরিবর্তন ও হোস্ট পারমিশন রিভোকোট",
      en: "Alter User Password & Revoke Specific Grants"
    },
    description: {
      bn: "বিদ্যমান ইউজারের সিকিউরিটি পাসওয়ার্ড আপডেট অথবা অপ্রয়োজনীয় পারমিশন কেড়ে নেওয়া।",
      en: "Update database user authentication credentials and modify access grants."
    },
    command: "ALTER USER 'erp_admin'@'localhost' IDENTIFIED BY 'NewUpdatedPass2026!';\nREVOKE DROP ON erp_publication_adhunik_v2_beta.* FROM 'erp_admin'@'localhost';\nFLUSH PRIVILEGES;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "সরাসরি ইন-মেমোরি অথেন্টিকেশন প্লাগইন আপডেট করে নিরাপদ রাখা যায়।",
      en: "Direct modification of mysql.user authentication plugin records."
    },
    proTips: [
      "ইউজার ডিলিট করতে: `DROP USER 'erp_admin'@'localhost';`",
      "সব ইউজারের তালিকা দেখতে: `SELECT User, Host FROM mysql.user;`"
    ],
    tags: ["administration", "password-reset", "revoke", "security"],
    syntax: "ALTER USER '[user]'@'[host]' IDENTIFIED BY '[new_pass]';"
  },
  {
    id: "cmd-admin-3",
    category: "administration",
    badge: "Stage 6: User List",
    title: {
      bn: "সার্ভারের সকল ইউজারের তালিকা ও পারমিশন ইনস্পেক্ট করা",
      en: "List All Database Users & Inspect Active Grants"
    },
    description: {
      bn: "MySQL অভ্যন্তরীণ `mysql.user` টেবিল কুয়েরি করে তৈরি করা সব ইউজার ও তাদের পারমিশন পরীক্ষা।",
      en: "Queries system catalog user tables for active database accounts."
    },
    command: "SELECT User, Host, plugin FROM mysql.user;\nSHOW GRANTS FOR 'erp_admin'@'localhost';",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "কোন ইউজার কোন হোস্ট থেকে বা কোন প্লাগইন (`caching_sha2_password`) দিয়ে যুক্ত তা নিশ্চিত হওয়া।",
      en: "Displays authentication plugin drivers and exact host masks."
    },
    proTips: [
      "রুট ইউজারের পারমিশন দেখতে: `SHOW GRANTS FOR 'root'@'localhost';`"
    ],
    tags: ["administration", "user-list", "show-grants", "security"],
    syntax: "SELECT User, Host FROM mysql.user; SHOW GRANTS FOR '[user]'@'[host]';"
  },

  // =========================================================================
  // STAGE 7: CONFIGURATION & SYSTEM VARIABLES TUNING
  // =========================================================================
  {
    id: "cmd-opt-1",
    category: "optimization",
    badge: "Stage 7: Packet Tuning",
    title: {
      bn: "Max Packet Limit বর্ধন (1GB Import Limit Fix)",
      en: "Check & Update `max_allowed_packet` size for heavy imports"
    },
    description: {
      bn: "বড় SQL ডাম্প বা ইমেজ/ইনসার্ট ফাইল ইমপোর্টে 'Packet too large' (Error 1153) সমাধান।",
      en: "Inspects and resizes active packet buffer to prevent network socket overflow errors."
    },
    command: "SHOW VARIABLES LIKE 'max_allowed_packet';\nSET GLOBAL max_allowed_packet = 1073741824;",
    difficulty: "Advanced",
    whyCliOverGui: {
      bn: "রানিং সার্ভারে রিস্টার্ট ছাড়াই ১ জিবির প্যাকেট সাইজ তাৎক্ষণিক এসাইন করা যায়।",
      en: "Sets dynamic global server variable without requiring service downtime or config edit."
    },
    proTips: [
      "`1073741824` বাইট = ১ গিগাবাইট (1GB)",
      "মাইএসকিউএল কনফিগ ফাইলে স্থায়ী করতে `/etc/mysql/mysql.conf.d/mysqld.cnf`-এ সেট করুন।"
    ],
    tags: ["optimization", "max_allowed_packet", "tuning", "config"],
    syntax: "SET GLOBAL max_allowed_packet = 1073741824;"
  },
  {
    id: "cmd-opt-2",
    category: "optimization",
    badge: "Stage 7: Process Monitor",
    title: {
      bn: "চলমান প্রসেস ও ঝুলন্ত কুয়েরি মনিটরিং (`SHOW PROCESSLIST`)",
      en: "Monitor Active Running Queries & Kill Locked Process Threads"
    },
    description: {
      bn: "কোন কোন কুয়েরি বা ইমপোর্ট সার্ভারে ব্যাকগ্রাউন্ডে চলছে এবং কোনটি আটকে (Locked) আছে তা ট্র্যাক করা।",
      en: "Displays all active client SQL query threads and execution durations."
    },
    command: "SHOW FULL PROCESSLIST;\nKILL 452;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "সার্ভার স্লো হলে তাৎক্ষণিক কোন কুয়েরি কত সেকেন্ড ধরে চলছে তা শনাক্ত ও কিল করা যায়।",
      en: "Crucial for identifying CPU-intensive or deadlock-causing operations live."
    },
    proTips: [
      "যদি কোনো কুয়েরি ঝুলন্ত থাকে, তবে তার `Id` দেখে কিল করুন: `KILL <id>;`",
      "শুধুমাত্র স্লো কুয়েরি দেখতে `Time` কলাম ইনস্পেক্ট করুন।"
    ],
    tags: ["optimization", "processlist", "kill", "monitoring"],
    syntax: "SHOW FULL PROCESSLIST; KILL [process_id];"
  },
  {
    id: "cmd-opt-3",
    category: "optimization",
    badge: "Stage 7: Table Repair",
    title: {
      bn: "সব টেবিল একসাথে অপ্টিমাইজ ও ইনডেক্স ডিফ্র্যাগমেন্টেশন",
      en: "Batch Optimize & Defragment All Database Tables"
    },
    description: {
      bn: "`mysqlcheck` কমান্ড ব্যবহার করে ডাটাবেজের সকল টেবিলের অব্যবহৃত মেমোরি খালি করা।",
      en: "Reclaims unused allocated space and updates index statistics."
    },
    command: "mysqlcheck -u lighttecha1 -p --optimize --databases erp_publication_adhunik_v2_beta",
    difficulty: "Advanced",
    whyCliOverGui: {
      bn: "১২৬টি টেবিল একসাথে অপ্টিমাইজ করতে phpMyAdmin টাইমআউট খায়; CLI এক লাইনে কাজ করে।",
      en: "Executes batch maintenance across hundreds of tables without HTTP payload limits."
    },
    proTips: [
      "অটোমেটিক চেক ও রিপেয়ার করতে: `mysqlcheck -u root -p --auto-repair --all-databases`",
      "সপ্তাহে বা মাসে একবার এই মেইনটেন্যান্স কমান্ড চালানো ভালো।"
    ],
    tags: ["optimization", "mysqlcheck", "maintenance", "repair"],
    syntax: "mysqlcheck -u [user] -p --optimize --databases [db]"
  },
  {
    id: "cmd-opt-4",
    category: "optimization",
    badge: "Stage 7: Engine Status",
    title: {
      bn: "InnoDB বাফার পুল, লক ও ট্রানজেকশন ইন্টারনালস ইনস্পেকশন",
      en: "Inspect InnoDB Engine Buffer Pool & Deadlock Diagnostics"
    },
    description: {
      bn: "InnoDB স্টোরেজ ইঞ্জিনের বিস্তারিত বাফার পুল স্টেট, রিসেন্ট ডেডলক ট্রিপ ও মেমোরি এনালিসিস।",
      en: "Provides low-level InnoDB engine telemetry, memory page pool metrics, and transaction lock history."
    },
    command: "SHOW ENGINE INNODB STATUS\\G",
    difficulty: "Advanced",
    whyCliOverGui: {
      bn: "ডেডলকের আসল কারণ জানার একমাত্র বৈজ্ঞানিক উপায় হল এই কমান্ডের আউটপুট পড়া।",
      en: "The only definitive diagnostic source for raw deadlock stack trace investigation."
    },
    proTips: [
      "শেষে `\\G` দিলে আউটপুট উলম্বভাবে সুন্দর ফরম্যাটে শো করবে।",
      "সার্ভার স্ট্যাটাস সংক্ষেপে দেখতে: `status;`"
    ],
    tags: ["optimization", "innodb", "deadlock", "buffer-pool"],
    syntax: "SHOW ENGINE INNODB STATUS\\G"
  }
];

// Export to window for global access
window.COMMANDS_DATA = COMMANDS_DATA;
