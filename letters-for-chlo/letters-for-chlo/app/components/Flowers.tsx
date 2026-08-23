// Simple decorative flower doodles, drawn as inline SVG so there are no
// image files to manage and nothing external to load.

export function FlowerCorner({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="#ffc9dd">
        <circle cx="50" cy="28" r="16" />
        <circle cx="28" cy="50" r="16" />
        <circle cx="72" cy="50" r="16" />
        <circle cx="50" cy="72" r="16" />
      </g>
      <circle cx="50" cy="50" r="13" fill="#fff2c6" />
    </svg>
  );
}

export function SmallFlower({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 60 60"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <g fill="#ffa3c4">
        <circle cx="30" cy="18" r="10" />
        <circle cx="18" cy="30" r="10" />
        <circle cx="42" cy="30" r="10" />
        <circle cx="30" cy="42" r="10" />
      </g>
      <circle cx="30" cy="30" r="8" fill="#fff7ea" />
    </svg>
  );
}
