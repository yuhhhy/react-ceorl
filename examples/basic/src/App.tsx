import { useState, useCallback, useRef, useEffect } from "react";
import { CeorlShell } from "ceorl";
import type { ColumnDescriptor } from "ceorl";
import type { CeorlShellHandle } from "ceorl";
import { DemoPanel } from "./components/DemoPanel";
import { PANEL_COLORS, WIDTH_OPTIONS } from "./components/constants";
import { Toolbar } from "./components/Toolbar";

export default function App() {
  const shellRef = useRef<CeorlShellHandle>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [keyboardNav, setKeyboardNav] = useState(true);

  const [columns, setColumns] = useState<ColumnDescriptor[]>(() => [
    {
      id: "col-0",
      width: 0.5,
      content: <DemoPanel title="Panel 1" color={PANEL_COLORS[0]} width={0.5} />,
    },
    {
      id: "col-1",
      width: 1 / 3,
      content: <DemoPanel title="Panel 2" color={PANEL_COLORS[1]} width={1 / 3} />,
    },
    {
      id: "col-2",
      width: 0.25,
      content: <DemoPanel title="Panel 3" color={PANEL_COLORS[2]} width={0.25} />,
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
      if (activeIndex >= prev.length - 1) {
        setActiveIndex(Math.max(0, prev.length - 2));
      }
      return prev.slice(0, -1);
    });
  }, [activeIndex]);

  const idxRef = useRef(activeIndex);
  const colsRef = useRef(columns.length);
  useEffect(() => {
    idxRef.current = activeIndex;
    colsRef.current = columns.length;
  });

  useEffect(() => {
    if (!keyboardNav) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      if ((e.target as HTMLElement).closest("input, textarea, select, [contenteditable]")) return;
      e.preventDefault();
      const current = idxRef.current;
      const total = colsRef.current;
      if (e.key === "ArrowLeft" && current > 0) setActiveIndex(current - 1);
      else if (e.key === "ArrowRight" && current < total - 1) setActiveIndex(current + 1);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [keyboardNav]);

  useEffect(() => {
    shellRef.current?.scrollTo(activeIndex);
  }, [activeIndex]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <Toolbar
        activeIndex={activeIndex}
        totalColumns={columns.length}
        keyboardNav={keyboardNav}
        onAdd={addColumn}
        onRemove={removeColumn}
        onPrev={() => setActiveIndex((i) => Math.max(0, i - 1))}
        onNext={() => setActiveIndex((i) => Math.min(columns.length - 1, i + 1))}
        onToggleKeyboard={() => setKeyboardNav((v) => !v)}
      />
      <CeorlShell
        ref={shellRef}
        inset={4}
        radius={10}
        columns={columns}
        activeIndex={activeIndex}
        style={{ flex: 1, width: "100%" }}
      />
    </div>
  );
}
