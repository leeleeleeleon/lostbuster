/** 문자 격자로 그리는 도트 그림. "."은 빈칸, 나머지 글자는 palette의 색 */
export default function Pixel({
  art,
  palette,
  size = 3,
  className,
}: {
  art: string[];
  palette: Record<string, string>;
  size?: number;
  className?: string;
}) {
  const w = Math.max(...art.map((r) => r.length));
  const rects = [];
  for (let y = 0; y < art.length; y++) {
    const row = art[y];
    // 같은 색이 이어지면 한 칸으로 합친다
    for (let x = 0; x < row.length; ) {
      const ch = row[x];
      let end = x + 1;
      while (row[end] === ch) end++;
      if (ch !== "." && palette[ch]) {
        rects.push(<rect key={`${x}-${y}`} x={x} y={y} width={end - x} height={1} fill={palette[ch]} />);
      }
      x = end;
    }
  }
  return (
    <svg
      className={className}
      width={w * size}
      height={art.length * size}
      viewBox={`0 0 ${w} ${art.length}`}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rects}
    </svg>
  );
}
