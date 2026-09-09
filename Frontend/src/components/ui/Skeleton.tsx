interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  animation?: boolean;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = "var(--radius-sm)",
  animation = true,
}: SkeletonProps) {
  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
        background: "var(--surface-2)",
        borderRadius,
        animation: animation ? "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" : "none",
      }}
    />
  );
}
