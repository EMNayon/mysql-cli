// MySQL Interactive Terminal Simulator
// Emulates authentic MySQL 8.0 CLI shell experience with database states, tables, and execution logs

class MySQLTerminalSimulator {
  constructor(container, inputElement, outputElement) {
    this.container = container;
    this.inputElement = inputElement;
    this.outputElement = outputElement;

    this.currentDb = "erp_publication_adhunik_v2_beta";
    this.history = [];
    this.historyIndex = -1;

    this.init();
  }

  init() {
    this.clearConsole();
    this.attachEventListeners();
  }

  attachEventListeners() {
    if (!this.inputElement) return;

    this.inputElement.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const cmd = this.inputElement.value;
        if (cmd.trim()) {
          this.executeCommand(cmd);
          this.inputElement.value = "";
        }
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        if (this.history.length > 0) {
          if (this.historyIndex > 0) {
            this.historyIndex--;
          } else {
            this.historyIndex = 0;
          }
          this.inputElement.value = this.history[this.historyIndex] || "";
        }
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        if (this.historyIndex < this.history.length - 1) {
          this.historyIndex++;
          this.inputElement.value = this.history[this.historyIndex] || "";
        } else {
          this.historyIndex = this.history.length;
          this.inputElement.value = "";
        }
      }
    });

    // Auto focus input when clicking terminal container
    if (this.container) {
      this.container.addEventListener("click", () => {
        this.inputElement.focus();
      });
    }
  }

  scrollToBottom() {
    if (this.container) {
      this.container.scrollTop = this.container.scrollHeight;
    }
  }

  escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  clearConsole() {
    if (!this.outputElement) return;
    this.outputElement.innerHTML = `
      <div class="text-muted mb-2 font-monospace">
        Welcome to the <span class="text-cyan">MySQL 8.0 CLI Terminal Simulator</span>.<br>
        Commands end with <span class="text-warning">;</span> or <span class="text-warning">\\g</span>.<br>
        Type <span class="text-emerald">help</span> for assistance, or test preset commands.
      </div>
      <div class="text-secondary small mb-3">Server version: 8.0.36-0ubuntu0.22.04.1 (Ubuntu Linux x86_64)</div>
    `;
    this.scrollToBottom();
  }

  executeCommand(rawCmd) {
    const trimmed = rawCmd.trim();
    if (!trimmed) return;

    // Add to history
    this.history.push(trimmed);
    this.historyIndex = this.history.length;

    // Render user command line in prompt
    const promptLabel = trimmed.startsWith("pv ") || trimmed.startsWith("mysqldump ")
      ? "lighttecha1@ubuntu:~$ "
      : `mysql (${this.currentDb || "none"})&gt; `;
      
    const userLine = document.createElement("div");
    userLine.className = "mb-1";
    userLine.innerHTML = `<span class="prompt-text">${promptLabel}</span><span class="text-light font-monospace">${this.escapeHtml(trimmed)}</span>`;
    this.outputElement.appendChild(userLine);

    // Process command logic
    const cleanCmd = trimmed.replace(/;$/, "").trim();
    const lowerCmd = cleanCmd.toLowerCase();

    const outputBlock = document.createElement("div");
    outputBlock.className = "mb-3 font-monospace";

    if (lowerCmd === "clear" || lowerCmd === "\\c") {
      this.clearConsole();
      return;
    } else if (lowerCmd === "help") {
      outputBlock.innerHTML = `
        <div class="text-cyan mb-1">List of supported simulator actions:</div>
        <div class="text-muted small ps-2">
          • <span class="text-light">show databases;</span> - List database schemas<br>
          • <span class="text-light">use [db_name];</span> - Switch active database<br>
          • <span class="text-light">show tables;</span> - List 126 tables in active database<br>
          • <span class="text-light">describe users;</span> - Inspect users table structure<br>
          • <span class="text-light">select count(*) from users;</span> - Count users records<br>
          • <span class="text-light">status;</span> - Check UNIX socket health & charset<br>
          • <span class="text-light">source adhunikp_beta_db.sql</span> - Simulate batch file import<br>
          • <span class="text-light">pv adhunikp_beta_db.sql | mysql</span> - Simulate bash streaming
        </div>
      `;
    } else if (lowerCmd === "show databases") {
      outputBlock.innerHTML = `
        <pre class="terminal-table text-cyan">+------------------------------------+
| Database                           |
+------------------------------------+
| information_schema                 |
| erp_publication_adhunik_v2_beta    |
| mysql                              |
| performance_schema                 |
| sys                                |
| test_db                            |
+------------------------------------+
6 rows in set (0.00 sec)</pre>
      `;
    } else if (lowerCmd.startsWith("use ")) {
      const dbName = cleanCmd.split(/\s+/)[1];
      this.currentDb = dbName;
      outputBlock.innerHTML = `<div class="text-emerald">Database changed</div>`;
    } else if (lowerCmd === "select database()") {
      outputBlock.innerHTML = `
        <pre class="terminal-table text-cyan">+-----------------------------------+
| database()                        |
+-----------------------------------+
| ${this.currentDb || "NULL"}       |
+-----------------------------------+
1 row in set (0.00 sec)</pre>
      `;
    } else if (lowerCmd === "status" || lowerCmd === "\\s") {
      outputBlock.innerHTML = `
        <div class="text-muted">--------------</div>
        <div>mysql  Ver 8.0.36-0ubuntu0.22.04.1 for Linux on x86_64</div>
        <div>Connection id:          <span class="text-cyan">142</span></div>
        <div>Current database:       <span class="text-emerald">${this.currentDb || "none"}</span></div>
        <div>Current user:           <span class="text-warning">lighttecha1@localhost</span></div>
        <div>SSL:                    <span class="text-muted">Not in use</span></div>
        <div>Current pager:          <span class="text-muted">stdout</span></div>
        <div>Using outlet:           <span class="text-cyan">UNIX Socket (/var/run/mysqld/mysqld.sock)</span></div>
        <div>Server version:         <span class="text-light">8.0.36 Ubuntu</span></div>
        <div>Protocol version:       <span class="text-light">10</span></div>
        <div>Server characterset:    <span class="text-emerald">utf8mb4</span></div>
        <div>Db     characterset:    <span class="text-emerald">utf8mb4</span></div>
        <div>Client characterset:    <span class="text-emerald">utf8mb4</span></div>
        <div>Conn.  characterset:    <span class="text-emerald">utf8mb4</span></div>
        <div>Uptime:                 <span class="text-light">14 days 6 hours 22 min 10 sec</span></div>
        <div class="text-muted">Threads: 4  Questions: 189204  Slow queries: 0  Opens: 1204</div>
        <div class="text-muted">--------------</div>
      `;
    } else if (lowerCmd === "show tables") {
      if (!this.currentDb) {
        outputBlock.innerHTML = `<div class="text-danger">ERROR 1046 (3D000): No database selected</div>`;
      } else {
        outputBlock.innerHTML = `
          <pre class="terminal-table text-cyan">+---------------------------------------------+
| Tables_in_${this.currentDb.padEnd(33, " ")} |
+---------------------------------------------+
| accounts_vouchers                           |
| authors                                     |
| books_catalog                               |
| categories                                  |
| customers                                   |
| inventory_stock                             |
| invoices                                    |
| order_items                                 |
| orders                                      |
| permissions                                 |
| publication_orders                          |
| roles                                       |
| suppliers                                   |
| transactions                                |
| users                                       |
| ... [111 additional tables truncated]       |
+---------------------------------------------+
126 rows in set (0.01 sec)</pre>
        `;
      }
    } else if (lowerCmd === "describe users" || lowerCmd === "desc users") {
      outputBlock.innerHTML = `
        <pre class="terminal-table text-cyan">+------------------+---------------+------+-----+---------+----------------+
| Field            | Type          | Null | Key | Default | Extra          |
+------------------+---------------+------+-----+---------+----------------+
| id               | bigint unsigned| NO   | PRI | NULL    | auto_increment |
| name             | varchar(191)  | NO   |     | NULL    |                |
| email            | varchar(191)  | NO   | UNI | NULL    |                |
| password         | varchar(255)  | NO   |     | NULL    |                |
| role_id          | int unsigned  | NO   | MUL | NULL    |                |
| created_at       | timestamp     | YES  |     | NULL    |                |
| updated_at       | timestamp     | YES  |     | NULL    |                |
+------------------+---------------+------+-----+---------+----------------+
7 rows in set (0.00 sec)</pre>
      `;
    } else if (lowerCmd === "select count(*) from users") {
      outputBlock.innerHTML = `
        <pre class="terminal-table text-cyan">+----------+
| count(*) |
+----------+
|    14820 |
+----------+
1 row in set (0.00 sec)</pre>
      `;
    } else if (lowerCmd.startsWith("source ") || lowerCmd.includes("adhunikp_beta_db.sql")) {
      outputBlock.innerHTML = `
        <div class="text-muted">Reading file '${this.escapeHtml(trimmed.replace(/^source\s+/, ""))}'...</div>
        <div class="text-cyan">Query OK, 0 rows affected (0.00 sec)</div>
        <div class="text-cyan">Query OK, 126 tables created, 148,200 records inserted.</div>
        <div class="text-emerald font-weight-bold">✔ Restoration completed successfully in 2.41 seconds. Zero errors encountered.</div>
      `;
    } else if (lowerCmd.startsWith("pv ")) {
      outputBlock.innerHTML = `
        <div class="text-muted">1.42GiB 0:00:18 [<span class="text-cyan">78.9MiB/s</span>] [<span class="text-emerald">===================================&gt;</span>] 100%</div>
        <div class="text-emerald mt-1">✔ Binary stream finished. All 126 tables imported via UNIX socket stream.</div>
      `;
    } else if (lowerCmd.startsWith("select ") || lowerCmd.startsWith("show ") || lowerCmd.startsWith("set ")) {
      outputBlock.innerHTML = `
        <div class="text-cyan">Query OK, 0 rows affected (0.01 sec)</div>
      `;
    } else if (lowerCmd.startsWith("create ") || lowerCmd.startsWith("alter ") || lowerCmd.startsWith("drop ")) {
      outputBlock.innerHTML = `
        <div class="text-emerald">Query OK, 1 row affected (0.03 sec)</div>
      `;
    } else if (lowerCmd === "exit" || lowerCmd === "quit") {
      outputBlock.innerHTML = `<div class="text-muted">Bye</div>`;
    } else {
      outputBlock.innerHTML = `
        <div class="text-cyan">Query OK, command executed in interactive simulator. (0.01 sec)</div>
      `;
    }

    this.outputElement.appendChild(outputBlock);
    this.scrollToBottom();
  }
}

// Export to window
window.MySQLTerminalSimulator = MySQLTerminalSimulator;
