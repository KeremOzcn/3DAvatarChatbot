if (typeof window !== "undefined") {
  if (!window.error_handler_installed) {
    window.error_handler_logs = [];

    const originalConsole = window.console;
    const WRAPPED_METHODS = new Set([
      "log",
      "debug",
      "info",
      "warn",
      "error",
      "table",
      "group",
      "groupCollapsed",
      "groupEnd",
      "time",
      "timeEnd",
    ]);

    const handler = {
      get: (_target, name) => {
        const key = String(name);
        const orig = originalConsole?.[key];

        const wrapper = (...args) => {
          const logEntry = {
            type: key,
            ts: Date.now(),
            arguments: args,
          };
          try {
            window.error_handler_logs.push(logEntry);

            const logsUrl = new URL(
              `${window.location.protocol}//${window.location.hostname}:${window.location.port}/api/dataHandler`,
            );
            logsUrl.searchParams.append("type", "logs");

            const apiEnabled = localStorage.getItem("chatvrm_external_api_enabled");
            if (window.location.hostname === "localhost" && apiEnabled === "true") {
              fetch(logsUrl, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(logEntry),
              }).catch(() => {});
            }
          } catch (_) {
            // loglamada hata çıkarsa sessiz geç
          }

          if (typeof orig === "function") {
            try {
              return orig.apply(originalConsole, args);
            } catch (_) {
              // orijinal çağrı başarısızsa sessiz geç
            }
          }
          return undefined;
        };

        if (WRAPPED_METHODS.has(key)) {
          return wrapper;
        }

        if (typeof orig === "function") {
          return orig.bind(originalConsole);
        }
        return orig;
      },
    };

    window.console = new Proxy({}, handler);

    window.addEventListener("error", (e) => {
      try {
        console.error(`Error occurred: ${e?.error?.message} ${e?.error?.stack}`);
      } catch (_) {}
      return false;
    });

    window.addEventListener("unhandledrejection", (e) => {
      try {
        console.error(`Unhandled rejection: ${e?.message}`);
      } catch (_) {}
      return false;
    });

    window.error_handler_installed = true;
  }
}