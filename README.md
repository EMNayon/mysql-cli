# 🗄️ MySQL CLI Pro — Production Database Mastery & High-Speed Import Hub

[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)
[![MySQL 8.0+](https://img.shields.io/badge/MySQL-8.0%2B%20Ready-06b6d4.svg?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Built With Alpine.js](https://img.shields.io/badge/Built%20With-Alpine.js%20%2B%20Bootstrap%205-3b82f6.svg)](https://alpinejs.dev/)
[![Bilingual](https://img.shields.io/badge/Language-Bangla%20%7C%20English-f59e0b.svg)]()

> **MySQL CLI Pro** হলো একটি প্রফেশনাল, আধুনিক এবং ইন্টারেক্টিভ ওয়েব গাইড যা লিনাক্স টার্মিনালে ১ জিবির বেশি অথবা বিশাল ইআরপি (ERP) ডাটাবেজ (১২৬+ টেবিল) কোনো মেমোরি ক্র্যাশ ছাড়াই সেকেন্ডের মধ্যে ইমপোর্ট, এক্সপোর্ট এবং ট্রাবলশুট করার কৌশল শেখায়।

---

## 🚀 কেন phpMyAdmin বাদ দিয়ে MySQL CLI ব্যবহার করবেন?

`phpMyAdmin` বা সাধারণ GUI টুলগুলো বড় ফাইল ডাম্প (৫০ মেগাবাইটের বেশি) ইমপোর্ট করার সময় ব্রাউজার হ্যাং করে এবং PHP মেমোরি সীমার কারণে `Fatal Error: Maximum execution time exceeded` দিয়ে ক্র্যাশ করে।

**MySQL CLI ও UNIX Socket Streaming-এর সুবিধা:**
* ⚡ **১ জিবি থেকে ৫০ জিবি+** যেকোনো ডাটাবেজ কোনো ক্র্যাশ ছাড়াই ইমপোর্ট ও এক্সপোর্ট করা যায়।
* 🚀 **১০ গুণ দ্রুত গতি:** সকেট পাইপলাইন এবং `SET foreign_key_checks=0;` ট্রিক ব্যবহার করায় ডিস্ক আই/ও লক ফাস্ট হয়ে যায়।
* 🛡️ **জিরো টাইমআউট ঝুঁকি:** ওয়েব সার্ভার বা PHP এক্সিকিউশন লিমিট থাকে না।

---

## ✨ প্রধান ফিচারসমূহ (Key Features)

- 🛣️ **Interactive Step-by-Step Stepper Timeline:** ইআরপি ডাটাবেজ (`erp_publication_adhunik_v2_beta`) ইমপোর্ট করার সঠিক ৬-ধাপের গাইড উইথ কপি ও টেস্ট বাটন।
- 💻 **Complete A-to-Z Command Reference (22+ Commands):**
  - **Stage 1:** Server Connection, Linux Systemctl, Non-Interactive One-Liners (`mysql -e`)
  - **Stage 2 & 3:** UTF8MB4 Database Creation, InnoDB Table DDL, Indexing (`ALTER TABLE`)
  - **Stage 4:** Data Queries, JOINs, Formatting (`\G`) & Bulk Inserts
  - **Stage 5:** Heavy Imports (`pv` progress bar), `source` & Non-Locking Backups (`--single-transaction`)
  - **Stage 6 & 7:** Security Grants, User Creation, `max_allowed_packet` Tuning & InnoDB Engine Status
- 🧙‍♂️ **Interactive Command Builder:** অপশন সিলেক্ট করলেই স্বয়ংক্রিয়ভাবে রেডি-টু-রান লিনাক্স ব্যাশ/MySQL কমান্ড তৈরির টুল।
- 🩺 **Error Doctor (Log Diagnostics):** Error 1050, 1062, 1826 (Foreign Key Locks) ইত্যাদির বাস্তবসম্মত স্থায়ী সমাধান।
- 🖥️ **Terminal Sandbox Simulator:** কনসোলে সরাসরি টেস্ট করার জন্য ব্রাউজার-ভিত্তিক টার্মিনাল সিমুলেটর।
- 📱 **100% Responsive & Mobile Friendly:** স্মার্ট ড্রপডাউন ও সোয়াইপেবল নেভিগেশন সুবিধা।
- 🌐 **Bilingual & Dark/Light Mode:** বাংলা ও ইংরেজি দুই ভাষাতেই সম্পূর্ণ কনটেন্ট উপলব্ধ।

---

## 🛠️ টেকনোলজি স্ট্যাক (Tech Stack)

* **Core UI:** HTML5, Modern Vanilla CSS (Glassmorphism & Neon Glow)
* **Framework:** Bootstrap 5.3.3
* **Reactivity:** Alpine.js 3.x
* **Charts & Analytics:** Chart.js 4.4
* **Syntax Highlighting:** Prism.js (SQL & Bash)

---

## 📂 প্রজেক্ট ফাইল স্ট্রাকচার (Project Structure)

```text
mysqlcommand/
├── index.html              # Main SPA HTML structure & Alpine.js templates
├── css/
│   ├── style.css           # Modern design system, themes, stepper & responsive CSS
│   └── syntax-theme.css    # Syntax highlighting styles
├── js/
│   ├── app.js              # Reactive state management & command generator logic
│   ├── commands-data.js    # Comprehensive A-to-Z production command dataset
│   ├── errors-data.js      # Error Doctor log diagnosis dataset
│   ├── terminal-simulator.js # In-browser terminal sandbox engine
│   └── benchmark-chart.js  # Performance comparison chart initialization
└── images/
    └── logo.png            # Project logo
```

---

## 💻 যেভাবে স্থানীয়ভাবে চালাবেন (How to Run Locally)

কোনো ব্যাকএন্ড সার্ভার বা `npm install`-এর প্রয়োজন নেই! 

১. প্রজেক্টটি ক্লোন করুন:
   ```bash
   git clone https://github.com/EMNayon/mysql-cli.git
   cd mysql-cli
   ```
২. যেকোনো ব্রাউজারে index.html ফাইলটি খুলুন:
   ```bash
   google-chrome index.html
   # অথবা
   firefox index.html
   ```

---

## 📄 লাইসেন্স (License)

এই প্রজেক্টটি **MIT License**-এর অধীনে প্রকাশিত। 

---
Developed with ❤️ for Developers & Database Administrators.
