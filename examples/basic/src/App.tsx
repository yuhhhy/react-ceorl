import { useState, useCallback, useRef, useEffect } from "react";
import { CeorlShell } from "ceorl";
import type { ColumnDescriptor, ColumnWidth } from "ceorl";
import type { CeorlShellHandle } from "ceorl";

const PANEL_COLORS = [
  "#1a1a2e",
  "#16213e",
  "#0f3460",
  "#533483",
  "#e94560",
  "#2d6a4f",
  "#6c584c",
  "#774936",
];

const WIDTH_OPTIONS: ColumnWidth[] = [0.5, 1 / 3, 0.25];

function DemoPanel({
  title,
  color,
  width,
}: {
  title: string;
  color: string;
  width: ColumnWidth;
}) {
  return (
    <div
      style={{
        background: color,
        color: "#e0e0e0",
        height: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>{title}</h2>
      <p style={{ margin: 0, fontSize: 14, opacity: 0.7 }}>Width: {String(width)}</p>
    </div>
  );
}

export default function App() {
  const shellRef = useRef<CeorlShellHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [keyboardNav, setKeyboardNav] = useState(true);

  const [columns, setColumns] = useState<ColumnDescriptor[]>(() => [
    {
      id: "col-0",
      width: 0.5,
      content: (
        <DemoPanel title="Panel 1" color={PANEL_COLORS[0]} width={0.5} />
      ),
    },
    {
      id: "col-1",
      width: 1 / 3,
      content: (
        <DemoPanel title="Panel 2" color={PANEL_COLORS[1]} width={1 / 3} />
      ),
    },
    {
      id: "col-2",
      width: 0.25,
      content: (
        <DemoPanel title="Panel 3" color={PANEL_COLORS[2]} width={0.25} />
      ),
    },
  ]);

  const addColumn = useCallback(() => {
    setColumns((prev) => {
      const idx = prev.length;
      const width = WIDTH_OPTIONS[idx % 3];
      return [
        ...prev,
        {
          id: `col-${Date.now()}`,
          width,
          content: (
            <DemoPanel
              title={`Panel ${idx + 1}`}
              color={PANEL_COLORS[idx % PANEL_COLORS.length]}
              width={width}
            />
          ),
        },
      ];
    });
  }, []);

  const removeColumn = useCallback(() => {
    setColumns((prev) => {
      if (prev.length <= 1) return prev;
      const removedId = prev[prev.length - 1].id;
      if (activeIndex >= prev.length - 1) {
        setActiveIndex(Math.max(0, prev.length - 2));
      }
      return prev.filter((c) => c.id !== removedId);
    });
  }, [activeIndex]);

  // 键盘导航 — document 全局监听，豁免 editable 元素
  const idxRef = useRef(activeIndex)
  const colsRef = useRef(columns.length)
  useEffect(() => {
    idxRef.current = activeIndex
    colsRef.current = columns.length
  })

  useEffect(() => {
    if (!keyboardNav) return

    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
      if ((e.target as HTMLElement).closest('input, textarea, select, [contenteditable]')) return

      e.preventDefault()

      const current = idxRef.current
      const total = colsRef.current
      if (e.key === 'ArrowLeft' && current > 0) {
        setActiveIndex(current - 1)
      } else if (e.key === 'ArrowRight' && current < total - 1) {
        setActiveIndex(current + 1)
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [keyboardNav])

  // activeIndex 变化 → 滚动
  useEffect(() => {
    shellRef.current?.scrollTo(activeIndex)
  }, [activeIndex])

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          gap: 8,
          padding: "6px 16px",
          background: "rgba(0,0,0,0.85)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
          zIndex: 100,
        }}
      >
        <button
          type="button"
          onClick={addColumn}
          style={{
            padding: "4px 12px",
            background: "#2d6a4f",
            color: "#e0e0e0",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          + Add Panel
        </button>
        <button
          type="button"
          onClick={removeColumn}
          disabled={columns.length <= 1}
          style={{
            padding: "4px 12px",
            background: "#e94560",
            color: "#e0e0e0",
            border: "none",
            borderRadius: 6,
            cursor: columns.length <= 1 ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            opacity: columns.length <= 1 ? 0.5 : 1,
          }}
        >
          - Remove Last
        </button>
        <button
          type="button"
          onClick={() => {
            const next = activeIndex - 1;
            if (next >= 0) {
              setActiveIndex(next);
            }
          }}
          disabled={activeIndex <= 0}
          style={{
            padding: "4px 12px",
            background: "#444",
            color: "#e0e0e0",
            border: "none",
            borderRadius: 6,
            cursor: activeIndex <= 0 ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            opacity: activeIndex <= 0 ? 0.5 : 1,
          }}
        >
          ← Prev
        </button>
        <button
          type="button"
          onClick={() => {
            const next = activeIndex + 1;
            if (next < columns.length) {
              setActiveIndex(next);
            }
          }}
          disabled={activeIndex >= columns.length - 1}
          style={{
            padding: "4px 12px",
            background: "#444",
            color: "#e0e0e0",
            border: "none",
            borderRadius: 6,
            cursor:
              activeIndex >= columns.length - 1 ? "not-allowed" : "pointer",
            fontSize: 13,
            fontWeight: 500,
            opacity: activeIndex >= columns.length - 1 ? 0.5 : 1,
          }}
        >
          Next →
        </button>
        <button
          type="button"
          onClick={() => setKeyboardNav((v) => !v)}
          style={{
            padding: "4px 12px",
            background: keyboardNav ? "#533483" : "#444",
            color: "#e0e0e0",
            border: "none",
            borderRadius: 6,
            cursor: "pointer",
            fontSize: 13,
            fontWeight: 500,
          }}
        >
          {keyboardNav ? "KB Nav: ON" : "KB Nav: OFF"}
        </button>
        <span
          style={{
            marginLeft: 16,
            color: "#888",
            fontSize: 13,
            display: "flex",
            alignItems: "center",
          }}
        >
          Active: Panel {activeIndex + 1} / {columns.length}
        </span>
      </div>

      <CeorlShell
        ref={shellRef}
        columns={columns}
        activeIndex={activeIndex}
        style={{ flex: 1, width: "100%" }}
      />
    </div>
  );
}
