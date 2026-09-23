// GlassSkeleton — shimmer loading skeleton

export function GlassSkeleton({ className = '', style }) {
  return (
    <div
      className={`skeleton ${className}`}
      style={style}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
}

export function GlassSkeletonCard({ lines = 3 }) {
  return (
    <div className="glass-card p-5 space-y-3">
      <GlassSkeleton className="h-4 w-3/4" />
      {Array.from({ length: lines - 1 }).map((_, i) => (
        <GlassSkeleton
          key={i}
          className="h-3"
          style={{ width: `${60 + Math.random() * 30}%` }}
        />
      ))}
    </div>
  );
}

