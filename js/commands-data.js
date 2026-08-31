// MySQL CLI Command Dataset
// Provides detailed Bengali (bn) and English (en) descriptions, syntax, and tips

const COMMANDS_DATA = [
  {
    id: "cmd-1",
    category: "import-export",
    badge: "Fastest Stream",
    title: {
      bn: "Pipe Viewer (`pv`) দিয়ে সরাসরি লাইভ প্রগ্রেসসহ ইমপোর্ট",
      en: "Live Import with Pipe Viewer (`pv` Progress Bar)"
    },
    description: {
      bn: "লিনাক্স শেল থেকে পাইপ দিয়ে সরাসরি MySQL সকেটে ডাটা পাঠায়। এতে লাইভ গতি (MB/s) ও শতাংশ প্রগ্রেস দেখা যায়, যা ৫০ জিবি+ ফাইলেও কোনো মেমোরি আউট অফ টাইম করে না।",
      en: "Streams large SQL files directly to MySQL UNIX socket with live transfer rates and percentage progress bars. Prevents PHP/browser timeouts."
    },
    command: "pv adhunikp_beta_db.sql | mysql -u lighttecha1 -p erp_publication_adhunik_v2_beta",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "phpMyAdmin-এ মেমোরি লিমিট ও টাইমআউট ট্র্যাপ থাকে। CLI পাইপলাইন ব্যাকগ্রাউন্ডে ২ জিবি ফাইল মাত্র কয়েক সেকেন্ডে রিস্টোর করে।",
      en: "phpMyAdmin crashes on files >50MB due to execution limits. Terminal socket streaming has zero file size ceilings."
    },
    proTips: [
      "ইন্সটল করতে লিনাক্সে চালান: `sudo apt install pv`",
      "যদি গিজিপ কম্প্রেসড ফাইল (.sql.gz) হয়, তবে লিখুন: `zcat backup.sql.gz | pv | mysql -u user -p db`"
    ],
    tags: ["import", "pv", "pipe", "fast"],
    syntax: "pv [file.sql] | mysql -u [user] -p [database]"
  },
  {
    id: "cmd-2",
    category: "import-export",
    badge: "Turbo Source",
    title: {
      bn: "MySQL কনসোল থেকে `source` ও Foreign Key চেক অফ করে দ্রুত ইমপোর্ট",
      en: "Fast Console Import via `source` with FK Validation Disabled"
    },
    description: {
      bn: "MySQL CLI-তে লগইন করে `SET foreign_key_checks = 0;` সাময়িক বন্ধ রেখে `source` কমান্ড দিয়ে বিশাল ফাইল ইমপোর্ট করার প্রোডাকশন গ্রেড সেরা উপায়।",
      en: "Log into MySQL CLI, temporarily disable foreign key constraint index locking, and execute the SQL batch file directly using the `source` keyword."
    },
    command: "SET foreign_key_checks = 0;\nSET autocommit = 0;\nsource /path/to/adhunikp_beta_db.sql;\nCOMMIT;\nSET foreign_key_checks = 1;",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "ইমপোর্টের সময় ইনডেক্স ও কনস্ট্রেইন্ট ডিস্ক আই/ও রাইট লক হয় না, ফলে ইমপোর্ট গতি ৫ থেকে ১০ গুণ পর্যন্ত বেড়ে যায়।",
      en: "Eliminates cascading index rebuild locks during inserts, boosting restoration throughput by up to 1000%."
    },
    proTips: [
      "সোর্স রান করার আগে অবশ্যই `USE database_name;` করে ডাটাবেজ সিলেক্ট করে নিন।",
      "ইমপোর্ট শেষে পুনরায় `SET foreign_key_checks = 1;` চালু করতে ভুলবেন না।"
    ],
    tags: ["import", "source", "foreign_key", "speedup"],
    syntax: "source /absolute/path/to/filename.sql"
  },
  {
    id: "cmd-3",
    category: "import-export",
    badge: "Production Safe",
    title: {
      bn: "লাইভ ডাটাবেজ থেকে টেবিল লক ছাড়া অন-দ্য-ফ্লাই `mysqldump` ব্যাকআপ",
      en: "Non-Locking Live Production Backup with `mysqldump`"
    },
    description: {
      bn: "প্রোডাকশন সার্ভারে ইউজাররা কাজ করার সময়েও কোনো টেবিল রিড/রাইট লক ছাড়াই নিরাপদ ও দ্রুত ব্যাকআপ ফাইল জেনারেট করে।",
      en: "Creates a consistent database dump snapshot from InnoDB engine tables without blocking concurrent web application traffic."
    },
    command: "mysqldump -u lighttecha1 -p --single-transaction --quick --routines erp_publication_adhunik_v2_beta > backup_$(date +%F).sql",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "phpMyAdmin টেবিল লক করে ফেলে অথবা মেমোরি ফুল হয়ে ক্র্যাশ করে। CLI ব্যাকআপ শতভাগ নির্ঝঞ্ঝাট।",
      en: "`--single-transaction` uses MVCC isolation snapshot instead of locking table rows, keeping production applications online."
    },
    proTips: [
      "`--quick` ফ্ল্যাগ মেমোরিতে পুরো টেবিল লোড না করে রো-বাই-রো স্ট্রিম করে ডিস্কে লেখে।",
      "`--routines` স্টোরড প্রসিডিউর ও ফাংশনগুলো সহ এক্সপোর্ট করে।"
    ],
    tags: ["export", "mysqldump", "single-transaction", "backup"],
    syntax: "mysqldump -u [user] -p --single-transaction [database] > [output.sql]"
  },
  {
    id: "cmd-4",
    category: "import-export",
    badge: "High Compression",
    title: {
      bn: "`mysqldump` এবং `gzip` সরাসরি কম্প্রেশন করে জিপ ফাইল তৈরি",
      en: "Streamed Export with Compressed `.sql.gz` Output"
    },
    description: {
      bn: "এক্সপোর্ট করার সাথে সাথে `gzip` দিয়ে কমপ্রেস করে ডিস্ক স্পেস ৭০-৮০% পর্যন্ত সাশ্রয় করে ব্যাকআপ সংরক্ষণ করা।",
      en: "Pipes dump stream directly to `gzip` compression utility on-the-fly, reducing resulting file footprint by up to 80%."
    },
    command: "mysqldump -u lighttecha1 -p --single-transaction erp_publication_adhunik_v2_beta | gzip -9 > db_backup.sql.gz",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "১ জিবি ডাটাবেজ ব্যাকআপ মাত্র ২০০ মেগাবাইটে সরাসরি জিপ হয়ে সেভ হয়।",
      en: "Saves massive server storage space without requiring an intermediate raw SQL dump file on disk."
    },
    proTips: [
      "রিস্টোর করতে লিখুন: `gunzip < db_backup.sql.gz | mysql -u user -p db_name`",
      "`-9` ফ্লাগ সর্বোচ্চ কম্প্রেশন লেভেল নিশ্চিত করে।"
    ],
    tags: ["export", "gzip", "compress", "mysqldump"],
    syntax: "mysqldump [options] [db] | gzip -9 > [file.sql.gz]"
  },
  {
    id: "cmd-5",
    category: "navigation",
    badge: "Server Health",
    title: {
      bn: "MySQL সার্ভার স্ট্যাটাস, আপটাইম ও ক্যারেক্টারসেট ডায়াগনোসিস",
      en: "Inspect MySQL Server Status, Uptime & Socket Health"
    },
    description: {
      bn: "সার্ভারের কানেকশন আইডি, UNIX সকেট পাথ, কারেন্ট ক্যারেক্টার সেট (utf8mb4) ও মেমোরি স্ট্যাটাস এক পলকে দেখুন।",
      en: "Reports active database server uptime, UNIX socket connection parameters, binary log settings, and default character sets."
    },
    command: "status;",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "সরাসরি সকেটের স্থিতি ও সার্ভার গ্লোবাল স্টেট দ্রুত পরীক্ষা করা যায়।",
      en: "Provides zero-overhead detailed terminal diagnostics about socket paths and active thread ids."
    },
    proTips: [
      "ডাটাবেজ ক্যারেক্টার সেট বাংলা টেক্সটের জন্য `utf8mb4` কিনা তা এইStatusCommand দিয়ে কনফার্ম করুন।",
      "প্রম্পট থেকে সরাসরি `\s` দিয়েও এই কমান্ডটি চালানো যায়।"
    ],
    tags: ["status", "navigation", "charset", "health"],
    syntax: "status; OR \\s"
  },
  {
    id: "cmd-6",
    category: "navigation",
    badge: "Monitoring",
    title: {
      bn: "চলমান প্রসেস ও স্লো কুয়েরি মনিটরিং (`PROCESSLIST`)",
      en: "Monitor Active Running Queries & Locked Processes"
    },
    description: {
      bn: "কোন কোন কুয়েরি বা ইমপোর্ট সার্ভারে ব্যাকগ্রাউন্ডে চলছে এবং কোনটি আটকে (Locked) আছে তা লাইভ ট্র্যাক করুন।",
      en: "Displays all active client SQL query threads, their execution durations, states, and locked resources in real time."
    },
    command: "SHOW FULL PROCESSLIST;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "সার্ভার স্লো হলে তাৎক্ষণিক কোন কুয়েরি কত সেকেন্ড ধরে চলছে তা শনাক্ত করা যায়।",
      en: "Crucial for identifying CPU-intensive or deadlock-causing database operations live on production."
    },
    proTips: [
      "যদি কোনো কুয়েরি অনেক সময় ধরে ঝুলন্ত থাকে, তবে তার `Id` দেখে কিল করুন।",
      "সংক্ষিপ্ত ভার্সন: `SHOW PROCESSLIST;`"
    ],
    tags: ["processlist", "monitoring", "queries", "slow-query"],
    syntax: "SHOW FULL PROCESSLIST;"
  },
  {
    id: "cmd-7",
    category: "administration",
    badge: "Emergency Fix",
    title: {
      bn: "আটকে থাকা ঝুলন্ত কুয়েরি বা ইমপোর্ট থ্রেড বন্ধ করা (`KILL`)",
      en: "Terminate Hanging Query Threads or Stuck Imports (`KILL`)"
    },
    description: {
      bn: "যদি কোনো ইমপোর্ট বা কুয়েরি আটকে গিয়ে সিপিউ ১০০% করে ফেলে, তবে উক্ত প্রসেস আইডি কিল করে সার্ভার সচল করুন।",
      en: "Terminates specific active query threads by connection ID to relieve database CPU/RAM bottlenecks."
    },
    command: "KILL 452;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "GUI ফ্রিজ হয়ে গেলে বা সার্ভার রেন্সপন্ড না করলে টার্মিনাল দিয়েই সার্ভিস উদ্ধার সম্ভব।",
      en: "Immediate resolution for deadlocks when control panels become unresponsive due to server resource exhaustion."
    },
    proTips: [
      "আগে `SHOW PROCESSLIST;` থেকে নির্দিষ্ট আইডি নিশ্চিত হোন।",
      "কানেকশন সম্পূর্ণ বাদ দিতে: `KILL CONNECTION 452;`"
    ],
    tags: ["kill", "admin", "process", "emergency"],
    syntax: "KILL [process_id];"
  },
  {
    id: "cmd-8",
    category: "administration",
    badge: "Security Best Practice",
    title: {
      bn: "নতুন ডাটাবেজ ইউজার তৈরি ও পারমিশন প্রদান (`GRANT ALL`)",
      en: "Create Secure Database User & Assign Granular Privileges"
    },
    description: {
      bn: "রুট ইউজার ছাড়া সিকিউর অ্যাপ্লিকেশন ইউজার তৈরি করা এবং নির্দিষ্ট ডাটাবেজে ফুল প্রিভিলেজ এসাইন করে পারমিশন রিলোড করা।",
      en: "Creates dedicated app database user with host restrictions and grants necessary table access permissions safely."
    },
    command: "CREATE USER 'erp_admin'@'localhost' IDENTIFIED BY 'StrongPass123!';\nGRANT ALL PRIVILEGES ON erp_publication_adhunik_v2_beta.* TO 'erp_admin'@'localhost';\nFLUSH PRIVILEGES;",
    difficulty: "Intermediate",
    whyCliOverGui: {
      bn: "এক লাইনেই ইউজার তৈরি, হোস্ট বাউন্ডিং ও মেমোরিতে পারমিশন রিফ্রেশ করা যায়।",
      en: "Guarantees privilege tables are reloaded instantly in MySQL memory using explicit `FLUSH PRIVILEGES`."
    },
    proTips: [
      "যেকোনো হোস্ট থেকে এক্সেস দিতে `'localhost'` এর স্থানে `'%'` ব্যবহার করুন।",
      "ইউজারের পারমিশন চেক করতে: `SHOW GRANTS FOR 'erp_admin'@'localhost';`"
    ],
    tags: ["users", "grant", "security", "admin"],
    syntax: "CREATE USER '[user]'@'[host]' IDENTIFIED BY '[pass]'; GRANT ALL ON [db].* TO '[user]'@'[host]';"
  },
  {
    id: "cmd-9",
    category: "optimization",
    badge: "Database Maintenance",
    title: {
      bn: "সব টেবিল একসাথে অপ্টিমাইজ ও ইনডেক্স ডিফ্র্যাগমেন্টেশন",
      en: "Batch Optimize & Defragment All Database Tables"
    },
    description: {
      bn: "`mysqlcheck` কমান্ড ব্যবহার করে ডাটাবেজের সকল টেবিলের অব্যবহৃত মেমোরি খালি করা ও স্পিড বাড়ানো।",
      en: "Reclaims unused allocated space, fixes index fragmentation, and updates index statistics across tables."
    },
    command: "mysqlcheck -u lighttecha1 -p --optimize --databases erp_publication_adhunik_v2_beta",
    difficulty: "Advanced",
    whyCliOverGui: {
      bn: "১২৬টি টেবিল একসাথে সিলেক্ট করে অপ্টিমাইজ করতে phpMyAdmin টাইমআউট খেয়ে যায়। CLI ওয়ান-লাইনারে কাজ শেষ করে।",
      en: "Executes batch maintenance across hundreds of tables sequentially without HTTP payload limits."
    },
    proTips: [
      "একসাথে অটোমেটিক রিপেয়ার করতে: `mysqlcheck -u root -p --auto-repair --check --all-databases`",
      "সপ্তাহে বা মাসে একবার এই মেইনটেন্যান্স কমান্ড চালানো ভালো।"
    ],
    tags: ["optimization", "mysqlcheck", "maintenance", "repair"],
    syntax: "mysqlcheck -u [user] -p --optimize --databases [db]"
  },
  {
    id: "cmd-10",
    category: "optimization",
    badge: "InnoDB Performance",
    title: {
      bn: "InnoDB বাফার পুল, লক ও ট্রানজেকশন ইন্টারনালস ইনস্পেকশন",
      en: "Inspect InnoDB Engine Buffer Pool & Deadlock Diagnostics"
    },
    description: {
      bn: "InnoDB স্টোরেজ ইঞ্জিনের বিস্তারিত বাফার পুল স্টেট, রিসেন্ট ডেডলক ট্রিপ ও মেমোরি ইউসেজ এনালিসিস।",
      en: "Provides low-level InnoDB engine telemetry, memory page pool metrics, and transaction lock history."
    },
    command: "SHOW ENGINE INNODB STATUS\\G",
    difficulty: "Advanced",
    whyCliOverGui: {
      bn: "ডেডলকের আসল কারণ জানার একমাত্র বৈজ্ঞানিক উপায় হল এই কমান্ডের আউটপুট পড়া।",
      en: "The only definitive diagnostic source for raw deadlock stack trace investigation in MySQL."
    },
    proTips: [
      "শেষে `\\G` দিলে আউটপুট উলম্বভাবে সুন্দর ফরম্যাটে শো করবে।",
      "বাফার পুল হিট রেশিও ৯৯% এর উপরে রাখা আইডিয়াল।"
    ],
    tags: ["innodb", "optimization", "deadlock", "buffer-pool"],
    syntax: "SHOW ENGINE INNODB STATUS\\G"
  },
  {
    id: "cmd-11",
    category: "navigation",
    badge: "Database Creation",
    title: {
      bn: "নিখুঁত বাংলা ও ইউনিকোড সাপোর্টেড ডাটাবেজ তৈরি",
      en: "Create Database with UTF8MB4 Collation (Full Bengali & Emoji Support)"
    },
    description: {
      bn: "বাংলা অক্ষর ও ইমোজি যেন ভাঙা বা `????` না দেখায় সেজন্য `utf8mb4_unicode_ci` ক্যারেক্টারসেটে ডাটাবেজ তৈরি করুন।",
      en: "Creates fresh database pre-configured with 4-byte UTF-8 character encoding and Unicode collation for international fonts."
    },
    command: "CREATE DATABASE IF NOT EXISTS erp_publication_adhunik_v2_beta DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "ডিফল্ট ক্যারেক্টার সেটের ভুলের কারণে পরে ডাটাবেজে বাংলা লেখা নষ্ট হওয়ার হাত থেকে রক্ষা করে।",
      en: "Ensures default database creation forces full 4-byte UTF-8 standard directly at creation time."
    },
    proTips: [
      "ডাটাবেজ ডিলিট করতে (সাবধান!): `DROP DATABASE IF EXISTS test_db;`",
      "বিদ্যমান ডাটাবেজের ক্যারেক্টার সেট চেঞ্জ করতে: `ALTER DATABASE db_name CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`"
    ],
    tags: ["utf8mb4", "create-database", "bengali", "charset"],
    syntax: "CREATE DATABASE [name] CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
  },
  {
    id: "cmd-12",
    category: "import-export",
    badge: "Direct Pipe",
    title: {
      bn: "ব্যাশ ইনপুট রিডাইরেকশন দিয়ে দ্রুত ডাইরেক্ট ইমপোর্ট",
      en: "Direct SQL Import via Input Redirection Operator (`<`)"
    },
    description: {
      bn: "লিনাক্স শেল থেকে `<` চিহ্ন দিয়ে সরাসরি ডাটাবেজে স্কিমা ও ডাটা পুশ করার ক্লাসিক দ্রুততম পদ্ধতি।",
      en: "Standard Linux stdin file redirection stream into target MySQL database instance."
    },
    command: "mysql -u lighttecha1 -p erp_publication_adhunik_v2_beta < adhunikp_beta_db.sql",
    difficulty: "Beginner",
    whyCliOverGui: {
      bn: "সরাসরি লিনাক্স কার্নেল ফাইল রিডার ব্যবহার করায় কোনো ওভারহেড নেই।",
      en: "Direct kernel file-to-socket reading with minimal context switching."
    },
    proTips: [
      "যদি ইমপোর্টের সময় এরর হলেও থামতে না চান: `mysql --force -u user -p db < file.sql`",
      "ইমপোর্টের আউটপুট লগে সেভ করতে: `mysql -u user -p db < file.sql > import.log 2>&1`"
    ],
    tags: ["import", "redirection", "stdin", "bash"],
    syntax: "mysql -u [user] -p [database] < [file.sql]"
  }
];

// Export to window for global access
window.COMMANDS_DATA = COMMANDS_DATA;
