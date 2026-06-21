const btnBase: React.CSSProperties = {
  padding: "4px 12px",
  color: "#e0e0e0",
  border: "none",
  borderRadius: 6,
  cursor: "pointer",
  fontSize: 13,
  fontWeight: 500,
};

export function Toolbar({
  activeIndex,
  totalColumns,
  keyboardNav,
  onAdd,
  onRemove,
  onPrev,
  onNext,
  onToggleKeyboard,
}: {
  activeIndex: number;
  totalColumns: number;
  keyboardNav: boolean;
  onAdd: () => void;
  onRemove: () => void;
  onPrev: () => void;
  onNext: () => void;
  onToggleKeyboard: () => void;
}) {
  return (
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
      <button type="button" onClick={onAdd} style={{ ...btnBase, background: "#2d6a4f" }}>
        + Add Panel
      </button>
      <button
        type="button"
        onClick={onRemove}
        disabled={totalColumns <= 1}
        style={{
          ...btnBase,
          background: "#e94560",
          cursor: totalColumns <= 1 ? "not-allowed" : "pointer",
          opacity: totalColumns <= 1 ? 0.5 : 1,
        }}
      >
        - Remove Last
      </button>
      <button
        type="button"
        onClick={onPrev}
        disabled={activeIndex <= 0}
        style={{
          ...btnBase,
          background: "#444",
          cursor: activeIndex <= 0 ? "not-allowed" : "pointer",
          opacity: activeIndex <= 0 ? 0.5 : 1,
        }}
      >
        ← Prev
      </button>
      <button
        type="button"
        onClick={onNext}
        disabled={activeIndex >= totalColumns - 1}
        style={{
          ...btnBase,
          background: "#444",
          cursor: activeIndex >= totalColumns - 1 ? "not-allowed" : "pointer",
          opacity: activeIndex >= totalColumns - 1 ? 0.5 : 1,
        }}
      >
        Next →
      </button>
      <button
        type="button"
        onClick={onToggleKeyboard}
        style={{ ...btnBase, background: keyboardNav ? "#533483" : "#444" }}
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
        Active: Panel {activeIndex + 1} / {totalColumns}
      </span>
    </div>
  );
}
