const SESSIONS = [
  [
    { prompt: true,  text: "ls -la" },
    { prompt: false, text: "total 64" },
    { prompt: false, text: "drwxr-xr-x  9 user staff   288 Jun 21 14:02 ." },
    { prompt: false, text: "drwxr-xr-x 18 user staff   576 Jun 20 09:11 .." },
    { prompt: false, text: "-rw-r--r--  1 user staff  1.2K Jun 21 13:48 config.toml" },
    { prompt: false, text: "drwxr-xr-x  4 user staff   128 Jun 19 22:30 scripts" },
    { prompt: false, text: "drwxr-xr-x  3 user staff    96 Jun 18 11:05 .local" },
    { prompt: true,  text: "" },
  ],
  [
    { prompt: true,  text: "git log --oneline -5" },
    { prompt: false, text: "9263061 feat: 将焦点环 CSS 变量移至 :root" },
    { prompt: false, text: "487ef3a fix: 移除列默认边框样式" },
    { prompt: false, text: "95cbed2 fix: 核心 CSS 随库分发" },
    { prompt: false, text: "22ab627 refactor: 提取 DemoPanel 和 Toolbar" },
    { prompt: false, text: "228a847 chore: 重组为 pnpm monorepo" },
    { prompt: true,  text: "git status" },
    { prompt: false, text: "On branch dev" },
    { prompt: false, text: "nothing to commit, working tree clean" },
    { prompt: true,  text: "" },
  ],
  [
    { prompt: true,  text: "top -b -n 1 | head -12" },
    { prompt: false, text: "Tasks: 312 total,   1 running, 311 sleeping" },
    { prompt: false, text: "%Cpu(s):  3.1 us,  0.9 sy,  0.0 ni, 95.7 id" },
    { prompt: false, text: "MiB Mem :  16384.0 total,   4210.3 free" },
    { prompt: false, text: "MiB Swap:   2048.0 total,   2048.0 free" },
    { prompt: false, text: "" },
    { prompt: false, text: "  PID USER      PR  NI    VIRT    RES  %CPU" },
    { prompt: false, text: " 1284 user      20   0  512.3m  42.1m   1.2" },
    { prompt: false, text: " 2011 user      20   0  231.0m  18.4m   0.4" },
    { prompt: true,  text: "" },
  ],
  [
    { prompt: true,  text: "cat ~/.config/niri/config.kdl | head -8" },
    { prompt: false, text: 'input {' },
    { prompt: false, text: '    keyboard {' },
    { prompt: false, text: '        xkb { layout "us"; }' },
    { prompt: false, text: '    }' },
    { prompt: false, text: '}' },
    { prompt: false, text: 'layout {' },
    { prompt: false, text: '    gaps 8' },
    { prompt: false, text: '}' },
    { prompt: true,  text: "" },
  ],
];

import type { ColumnWidth } from "ceorl";

function toFraction(n: number): string {
  for (const d of [2, 3, 4, 5, 6, 8]) {
    const num = Math.round(n * d);
    if (Math.abs(num / d - n) < 0.001) return `${num}/${d}`;
  }
  return `${Math.round(n * 100)}%`;
}

export function DemoPanel({ title, index = 0, width }: { title: string; index?: number; width?: ColumnWidth }) {
  const lines = SESSIONS[index % SESSIONS.length];
  const widthLabel = width != null
    ? typeof width === "number" ? toFraction(width) : String(width)
    : null;

  return (
    <div style={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
    }}>
      <div style={{
        background: "rgba(0, 0, 0, 0.25)",
        padding: "7px 14px",
        fontSize: 12,
        color: "#555",
        borderBottom: "1px solid #252525",
        flexShrink: 0,
        letterSpacing: "0.02em",
        userSelect: "none",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <span>{title} — bash</span>
        {widthLabel && <span style={{ color: "#666" }}>{widthLabel}</span>}
      </div>

      <div style={{
        flex: 1,
        padding: "12px 16px",
        fontSize: 13,
        lineHeight: 1.65,
        color: "#c0c0c0",
        overflowY: "auto",
      }}>
        {lines.map((line, i) =>
          line.prompt ? (
            <div key={i} style={{ display: "flex", alignItems: "center", marginTop: i > 0 ? 6 : 0 }}>
              <span style={{ color: "#4a8a5a", marginRight: 4 }}>user@niri</span>
              <span style={{ color: "#888", marginRight: 4 }}>~$</span>
              <span>{line.text}</span>
              {i === lines.length - 1 && (
                <span style={{ display: "inline-block", width: 7, height: 15, background: "#c0c0c0", marginLeft: 2, verticalAlign: "middle", opacity: 0.9 }} />
              )}
            </div>
          ) : (
            <div key={i} style={{ color: "#787878", paddingLeft: 0 }}>{line.text || " "}</div>
          )
        )}
      </div>
    </div>
  );
}
