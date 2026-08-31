// MySQL Errors Data & Doctor Troubleshooting Guide
// Comprehensive diagnostics for real-world import/export errors

const ERRORS_DATA = [
  {
    code: "Error 1050 (42S01)",
    name: "Table Already Exists",
    badge: "High Frequency",
    sampleFromLog: "ERROR 1050 (42S01) at line 142: Table 'users' already exists",
    rootCause: {
      bn: "আপনার টার্গেট ডাটাবেজে আগে থেকেই একই নামে টেবিল তৈরি করা আছে। ব্যাকআপ ফাইলে `DROP TABLE IF EXISTS` ক্লজ না থাকলে ইমপোর্ট মাঝপথে আটকে গিয়ে এই এরর দেয়।",
      en: "The target database schema already contains a table with the exact same name, and your dump script lacks automatic `DROP TABLE IF EXISTS` statements."
    },
    solutions: [
      {
        method: "Option 1: Drop Table before Source",
        description: {
          bn: "MySQL-এ ঢুকে বিদ্যমান পুরনো ডাটাবেজটি নতুন করে ড্রপ করে রিক্রিয়েট করুন।",
          en: "Drop and recreate the empty target schema before re-running the import."
        },
        code: "DROP DATABASE erp_publication_adhunik_v2_beta;\nCREATE DATABASE erp_publication_adhunik_v2_beta DEFAULT CHARACTER SET utf8mb4;\nUSE erp_publication_adhunik_v2_beta;"
      },
      {
        method: "Option 2: Export Dump with --add-drop-table",
        description: {
          bn: "পরবর্তী ব্যাকআপ নেয়ার সময় `--add-drop-table` ফ্ল্যাগটি যুক্ত করে mysqldump দিন।",
          en: "Ensure future dumps automatically insert DROP TABLE statements before CREATE TABLE."
        },
        code: "mysqldump -u root -p --add-drop-table --single-transaction database_name > backup.sql"
      }
    ],
    preventionTip: {
      bn: "নতুন ইমপোর্ট করার আগে ডাটাবেজ খালি (Clean State) আছে কিনা নিশ্চিত করুন।",
      en: "Always verify target database table count is 0 before initiating bulk dumps."
    }
  },
  {
    code: "Error 1062 (23000)",
    name: "Duplicate Entry for Key PRIMARY",
    badge: "Constraint Failure",
    sampleFromLog: "ERROR 1062 (23000) at line 489: Duplicate entry '1' for key 'PRIMARY'",
    rootCause: {
      bn: "প্রাইমারি কি (Primary Key) আইডি কলামে একই আইডি ২ বা ততধিকবার ইনসার্ট হওয়ার চেষ্টা করছে, অথবা ইমপোর্ট অর্ধেক হওয়ার পর পুনরায় চালানো হয়েছে।",
      en: "Attempting to insert a duplicate unique identifier into a primary key column, usually caused by running an import over partially existing data."
    },
    solutions: [
      {
        method: "Option 1: Clean Database & Disable Unique Checks",
        description: {
          bn: "ইমপোর্টের শুরুতে Unique Checks বন্ধ করে নিন।",
          en: "Disable unique check validations temporarily during batch execution."
        },
        code: "SET UNIQUE_CHECKS = 0;\nSET FOREIGN_KEY_CHECKS = 0;\nsource adhunikp_beta_db.sql;\nSET UNIQUE_CHECKS = 1;\nSET FOREIGN_KEY_CHECKS = 1;"
      },
      {
        method: "Option 2: Use --force flag in CLI",
        description: {
          bn: "এরর পাওয়া গেলেও ইমপোর্ট না থামিয়ে বাকী টেবিলগুলো সম্পন্ন করতে `--force` ফ্ল্যাগ দিন।",
          en: "Instruct the MySQL CLI client to bypass statement errors and continue importing."
        },
        code: "mysql --force -u lighttecha1 -p erp_publication_adhunik_v2_beta < adhunikp_beta_db.sql"
      }
    ],
    preventionTip: {
      bn: "টেবিলের ডাটা সম্পূর্ণ `TRUNCATE` অথবা `DROP` করে নতুন করে রিস্টোর করুন।",
      en: "Truncate existing table contents prior to performing secondary data dumps."
    }
  },
  {
    code: "Error 1826 (HY000)",
    name: "Duplicate Foreign Key Constraint Name",
    badge: "FK Constraint Lock",
    sampleFromLog: "ERROR 1826 (HY000) at line 912: Duplicate foreign key constraint name 'fk_users_role_id'",
    rootCause: {
      bn: "অন্য কোনো টেবিলে অথবা একই ডাটাবেজে এই Foreign Key Constraint নামটি আগে থেকেই রেজিস্টার্ড হয়ে আছে। MySQL-এ একটি ডাটাবেজের প্রতিটির ফরেন কি এর নাম অনন্য (Unique) হতে হয়।",
      en: "Foreign key constraint names must be globally unique within the database schema. An existing table already reserves this constraint name."
    },
    solutions: [
      {
        method: "Option 1: Disable Foreign Key Checks Session-wide",
        description: {
          bn: "ইমপোর্ট সেশনের জন্য ফরেন কি চেক সাময়িকভাবে বন্ধ করে ইমপোর্ট সম্পূর্ণ করুন। (Recommended)",
          en: "Bypass constraint checks entirely during batch table structure creation."
        },
        code: "SET foreign_key_checks = 0;\nsource adhunikp_beta_db.sql;\nSET foreign_key_checks = 1;"
      },
      {
        method: "Option 2: One-liner CLI with --init-command",
        description: {
          bn: "লিনাক্স ব্যাশ থেকে সরাসরি ইমপোর্ট করার সময় `--init-command` ব্যবহার করুন।",
          en: "Pass session initialization variables via standard bash invocation."
        },
        code: "mysql -u lighttecha1 -p --init-command=\"SET foreign_key_checks=0; SET autocommit=0;\" erp_publication_adhunik_v2_beta < adhunikp_beta_db.sql"
      }
    ],
    preventionTip: {
      bn: "আপনার মাইগ্রেশন ফাইলে ফরেন কি এর নামগুলোর শেষে টেবিলের নাম প্রিফিক্স হিসেবে দিন (যেমন: `fk_order_items_product_id`)।",
      en: "Namespace foreign key constraint names with parent and child table names."
    }
  },
  {
    code: "Error 2006 (HY000)",
    name: "MySQL Server Has Gone Away",
    badge: "Packet Overhead Limit",
    sampleFromLog: "ERROR 2006 (HY000) at line 1204: MySQL server has gone away (max_allowed_packet exceeded)",
    rootCause: {
      bn: "আপনার বড় ডাটাবেজ ব্যাকআপ ফাইলটিতে বিশাল ইনসার্ট কুয়েরি (Huge Multi-row INSERT statement) আছে যা MySQL-এর `max_allowed_packet` মেমোরি লিমিটের চেয়ে বড়।",
      en: "A single SQL bulk INSERT payload exceeded the server's configured `max_allowed_packet` limit, causing MySQL to disconnect."
    },
    solutions: [
      {
        method: "Option 1: Increase max_allowed_packet in CLI",
        description: {
          bn: "কানেকশন তৈরির সময়ই ম্যাক্সিমাম প্যাকেট সাইজ ৬৪ মেগাবাইট বা ১২৮ মেগাবাইট বাড়িয়ে দিন।",
          en: "Increase maximum packet transfer size dynamically during connection."
        },
        code: "mysql -u lighttecha1 -p --max_allowed_packet=512M erp_publication_adhunik_v2_beta < adhunikp_beta_db.sql"
      },
      {
        method: "Option 2: Set Global Variable in MySQL",
        description: {
          bn: "MySQL কনসোলে ঢুকে গ্লোবাল ভেরিয়েবল আপডেট করুন।",
          en: "Update global server packet ceiling dynamically without restarting mysqld."
        },
        code: "SET GLOBAL max_allowed_packet = 1073741824; -- 1GB"
      }
    ],
    preventionTip: {
      bn: "`mysqldump` তৈরি করার সময় `--net_buffer_length=16384` বা `--extended-insert=FALSE` ব্যবহার করতে পারেন।",
      en: "Configure `/etc/mysql/my.cnf` with `max_allowed_packet = 256M` permanently."
    }
  },
  {
    code: "Error 1045 (28000)",
    name: "Access Denied for User",
    badge: "Authentication Error",
    sampleFromLog: "ERROR 1045 (28000): Access denied for user 'lighttecha1'@'localhost' (using password: YES)",
    rootCause: {
      bn: "ইউজারনেম বা পাসওয়ার্ড ভুল দেওয়া হয়েছে, অথবা উক্ত ইউজারের সংশ্লিষ্ট ডাটাবেজে প্রবেশের অনুমতি/প্রিভিলেজ নাই।",
      en: "Invalid username or password provided, or user lacks granted privileges for the specified database host."
    },
    solutions: [
      {
        method: "Option 1: Verify Password & Host",
        description: {
          bn: "পাসওয়ার্ড কীবোর্ডে টাইপ করে নিরাপদ প্রম্পট `-p` দিয়ে ঢুকুন।",
          en: "Prompt for password explicitly using `-p` flag without hardcoding plain text."
        },
        code: "mysql -u lighttecha1 -p"
      },
      {
        method: "Option 2: Reset User Password via Root",
        description: {
          bn: "রুট ইউজার হিসেবে প্রবেশ করে ইউজারের পাসওয়ার্ড ও গ্রান্টস আপডেট করুন।",
          en: "Log in with root credentials to grant target permissions and flush privileges."
        },
        code: "ALTER USER 'lighttecha1'@'localhost' IDENTIFIED BY 'NewSecurePass123!';\nFLUSH PRIVILEGES;"
      }
    ],
    preventionTip: {
      bn: "কমান্ড লাইনে কখনো সরাসরি স্পেস ছাড়া পাসওয়ার্ড লিখবেন না (`-pMyPassword` নিরাপদ নয়)। সবসময় প্রম্পট ব্যবহার করুন।",
      en: "Avoid passing raw passwords inline in command histories; rely on standard hidden password prompts."
    }
  },
  {
    code: "Error 1064 (42000)",
    name: "SQL Syntax Error near Line X",
    badge: "Version Mismatch",
    sampleFromLog: "ERROR 1064 (42000): You have an error in your SQL syntax; check the manual near 'utf8mb4_0900_ai_ci'",
    rootCause: {
      bn: "MySQL 8.0 ভার্সনে তৈরি করা ডাটাবেজ ব্যাকআপ ফাইল পুরনো MySQL 5.7 সার্ভারে ইমপোর্ট করার চেষ্টা করা হলে এই ক্যারেক্টারসেট বা ভার্সন মিসম্যাচ এরর আসে।",
      en: "Importing a MySQL 8.0 dump into MySQL 5.7 server where `utf8mb4_0900_ai_ci` collation is unsupported."
    },
    solutions: [
      {
        method: "Option 1: Replace Collation in SQL file using sed",
        description: {
          bn: "লিনাক্স `sed` কমান্ড ব্যবহার করে ফাইলে থাকা 0900 ক্যারেক্টার সেটকে `utf8mb4_unicode_ci` দিয়ে রিপ্লেস করুন।",
          en: "Replace unsupported 8.0 collation occurrences with standard legacy 5.7 collation."
        },
        code: "sed -i 's/utf8mb4_0900_ai_ci/utf8mb4_unicode_ci/g' adhunikp_beta_db.sql\nsed -i 's/utf8mb4_0900_bin/utf8mb4_bin/g' adhunikp_beta_db.sql"
      }
    ],
    preventionTip: {
      bn: "MySQL 8.0 থেকে ব্যাকআপ নেয়ার সময় `--default-character-set=utf8` ফ্ল্যাগ ব্যবহার করুন।",
      en: "Check destination target database engine versions before deploying production dumps."
    }
  }
];

// Export to window
window.ERRORS_DATA = ERRORS_DATA;
