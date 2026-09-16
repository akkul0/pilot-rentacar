/** The client's own mark, redrawn as vector from their printed logo:
 *  a red arrow flying left, PİLOT riding above the shaft, Rent A Car below,
 *  fletching at the tail. Inline (not an <img>) so it picks up the loaded
 *  display face and the brand token. */
export function PilotMark({
  height = 30,
  title = "Pilot Rent a Car",
}: {
  height?: number;
  title?: string;
}) {
  return (
    <svg
      className="pilot-mark"
      height={height}
      role="img"
      viewBox="0 0 400 120"
      width={(400 / 120) * height}
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <g fill="currentColor">
        {/* arrowhead + shaft */}
        <path d="M6 60 70 33v54Z" />
        <rect height="8" rx="1" width="292" x="66" y="56" />
        {/* fletching */}
        <path d="M322 104 344 16h13l-22 88Z" />
        <path d="M347 104 369 16h13l-22 88Z" />
      </g>
      <text
        fill="currentColor"
        fontFamily="Archivo, Helvetica Neue, Arial, sans-serif"
        fontSize="56"
        fontWeight="800"
        letterSpacing="-1"
        x="112"
        y="50"
      >
        PİLOT
      </text>
      <text
        fill="currentColor"
        fontFamily="Archivo, Helvetica Neue, Arial, sans-serif"
        fontSize="31"
        fontWeight="700"
        letterSpacing="-0.4"
        x="116"
        y="98"
      >
        Rent A Car
      </text>
    </svg>
  );
}
