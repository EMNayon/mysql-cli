// Main Application Logic with Alpine.js 3.x
// Handles reactive SPA tabs, bilingual switching, command filtering, builder, copy toasts, and theme

document.addEventListener("alpine:init", () => {
  Alpine.data("mysqlApp", () => ({
    // Navigation / Tabs
    currentTab: "overview", // 'overview', 'comparison', 'commands', 'builder', 'troubleshoot', 'terminal', 'cheatsheet'
    
    // Language & Theme State
    lang: localStorage.getItem("mysql_hub_lang") || "bn", // 'bn' (Bangla) or 'en' (English)
    isDark: localStorage.getItem("mysql_hub_theme") !== "light",

    // Search & Filter
    searchQuery: "",
    selectedCategory: "all",
    selectedTag: "",

    // Data sources
    commands: COMMANDS_DATA,
    benchmarks: CLI_VS_GUI_BENCHMARKS,
    errors: ERRORS_DATA,

    // Command Builder State
    builder: {
      action: "import", // 'import', 'export', 'connect', 'create_user', 'reset_password', 'optimize'
      user: "lighttecha1",
      host: "localhost",
      port: "3306",
      database: "erp_publication_adhunik_v2_beta",
      filePath: "~/Downloads/adhunikp_beta_db.sql",
      usePv: true,
      singleTransaction: true,
      quick: true,
      skipTriggers: false,
      noData: false,
      newPassword: "SecurePassword123!",
      newUser: "app_user",
      disableChecks: true
    },

    // Interactive Terminal reference
    terminalInstance: null,

    // Toast Notification
    toast: {
      show: false,
      message: "",
      type: "success"
    },

    init() {
      // Apply theme
      this.applyTheme();
      
      // Initialize charts when comparison tab is opened
      this.$watch("currentTab", (newTab) => {
        if (newTab === "comparison") {
          setTimeout(() => {
            if (typeof initBenchmarkCharts === "function") {
              initBenchmarkCharts();
            }
          }, 150);
        } else if (newTab === "terminal") {
          setTimeout(() => {
            this.initTerminal();
          }, 150);
        }
      });

      // Highlight syntax on DOM changes
      this.$watch("searchQuery", () => this.refreshSyntaxHighlight());
      this.$watch("selectedCategory", () => this.refreshSyntaxHighlight());
      this.$watch("lang", (val) => {
        localStorage.setItem("mysql_hub_lang", val);
      });
    },

    toggleLanguage() {
      this.lang = this.lang === "bn" ? "en" : "bn";
      localStorage.setItem("mysql_hub_lang", this.lang);
      this.showToast(this.lang === "bn" ? "ভাষা বাংলায় পরিবর্তন করা হয়েছে" : "Language switched to English");
    },

    toggleTheme() {
      this.isDark = !this.isDark;
      localStorage.setItem("mysql_hub_theme", this.isDark ? "dark" : "light");
      this.applyTheme();
    },

    applyTheme() {
      if (this.isDark) {
        document.documentElement.classList.add("dark");
        document.documentElement.setAttribute("data-bs-theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.setAttribute("data-bs-theme", "light");
      }
    },

    // Filtered Commands getter
    get filteredCommands() {
      return this.commands.filter((cmd) => {
        // Category filter
        if (this.selectedCategory !== "all" && cmd.category !== this.selectedCategory) {
          return false;
        }

        // Tag filter
        if (this.selectedTag && !cmd.tags.includes(this.selectedTag)) {
          return false;
        }

        // Search query
        if (this.searchQuery.trim()) {
          const q = this.searchQuery.toLowerCase();
          const matchTitleEn = cmd.title.en.toLowerCase().includes(q);
          const matchTitleBn = cmd.title.bn.toLowerCase().includes(q);
          const matchCmd = cmd.command.toLowerCase().includes(q);
          const matchDescEn = cmd.description.en.toLowerCase().includes(q);
          const matchDescBn = cmd.description.bn.toLowerCase().includes(q);
          const matchTags = cmd.tags.some((t) => t.toLowerCase().includes(q));
          return matchTitleEn || matchTitleBn || matchCmd || matchDescEn || matchDescBn || matchTags;
        }

        return true;
      });
    },

    // Generated Command output string
    get generatedCommand() {
      const b = this.builder;
      const hostParam = b.host && b.host !== "localhost" ? ` -h ${b.host} -P ${b.port}` : "";
      
      switch (b.action) {
        case "import":
          if (b.usePv) {
            return `pv ${b.filePath || "dump.sql"} | mysql -u ${b.user}${hostParam} -p ${b.database}`;
          } else if (b.disableChecks) {
            return `mysql -u ${b.user}${hostParam} -p ${b.database} --init-command="SET foreign_key_checks=0; SET unique_checks=0; SET autocommit=0;" < ${b.filePath || "dump.sql"}`;
          } else {
            return `mysql -u ${b.user}${hostParam} -p ${b.database} < ${b.filePath || "dump.sql"}`;
          }

        case "export":
          let exportFlags = [];
          if (b.singleTransaction) exportFlags.push("--single-transaction");
          if (b.quick) exportFlags.push("--quick");
          if (b.skipTriggers) exportFlags.push("--skip-triggers");
          if (b.noData) exportFlags.push("--no-data");
          exportFlags.push("--routines");
          
          return `mysqldump -u ${b.user}${hostParam} -p ${exportFlags.join(" ")} ${b.database} > ${b.filePath || "backup_$(date +%F).sql"}`;

        case "connect":
          return `mysql -u ${b.user}${hostParam} -p ${b.database ? b.database : ""}`.trim();

        case "create_user":
          return `mysql -u root -p -e "CREATE USER '${b.newUser}'@'${b.host === "localhost" ? "localhost" : "%"}' IDENTIFIED BY '${b.newPassword}'; GRANT ALL PRIVILEGES ON ${b.database}.* TO '${b.newUser}'@'${b.host === "localhost" ? "localhost" : "%"}'; FLUSH PRIVILEGES;"`;

        case "reset_password":
          return `mysql -u root -p -e "ALTER USER '${b.user}'@'${b.host === "localhost" ? "localhost" : "%"}' IDENTIFIED BY '${b.newPassword}'; FLUSH PRIVILEGES;"`;

        case "optimize":
          return `mysqlcheck -u ${b.user}${hostParam} -p --optimize --databases ${b.database}`;

        default:
          return "mysql -u root -p";
      }
    },

    // Copy to clipboard with visual toast
    copyToClipboard(text, customMessage = "") {
      if (!navigator.clipboard) {
        // Fallback
        const textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      } else {
        navigator.clipboard.writeText(text);
      }

      const msg = customMessage || (this.lang === "bn" ? "কমান্ড সফলভাবে কপি হয়েছে!" : "Command copied to clipboard!");
      this.showToast(msg);

      // Trigger light confetti if available
      if (typeof confetti === "function") {
        confetti({
          particleCount: 30,
          spread: 50,
          origin: { y: 0.85 }
        });
      }
    },

    showToast(msg, type = "success") {
      this.toast.message = msg;
      this.toast.type = type;
      this.toast.show = true;
      setTimeout(() => {
        this.toast.show = false;
      }, 3000);
    },

    initTerminal() {
      if (!this.terminalInstance) {
        const container = document.getElementById("terminalContainer");
        const input = document.getElementById("terminalInput");
        const output = document.getElementById("terminalOutput");
        if (container && input && output) {
          this.terminalInstance = new MySQLTerminalSimulator(container, input, output);
        }
      }
    },

    runSampleInTerminal(sampleCmd) {
      this.currentTab = "terminal";
      setTimeout(() => {
        this.initTerminal();
        const input = document.getElementById("terminalInput");
        if (input && this.terminalInstance) {
          input.value = sampleCmd;
          this.terminalInstance.executeCommand(sampleCmd);
          input.value = "";
          this.terminalInstance.scrollToBottom();
        }
      }, 200);
    },

    refreshSyntaxHighlight() {
      this.$nextTick(() => {
        if (window.Prism) {
          Prism.highlightAll();
        }
      });
    }
  }));
});

