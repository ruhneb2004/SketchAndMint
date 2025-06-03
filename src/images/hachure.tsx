export const Hachure = () => (
  <svg width="24" height="24" viewBox="0 0 100 100">
    <defs>
      <pattern
        id="diagonalHachure"
        patternUnits="userSpaceOnUse"
        width="10"
        height="10"
        patternTransform="rotate(45)"
      >
        <line x1="0" y="0" x2="0" y2="10" stroke="#000" strokeWidth="2" />
      </pattern>
    </defs>
    <rect
      x="0"
      y="0"
      width="100"
      height="100"
      fill="url(#diagonalHachure)"
      stroke="#000"
      strokeWidth="2"
    />
  </svg>
);
