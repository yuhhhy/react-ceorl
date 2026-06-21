import type { ColumnWidth } from "ceorl";

export function DemoPanel({
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
