import type { RecapPatternKind } from "./recap-theme";

const FIRE_PATH =
  "M15.3912 23.3075L15.3862 23.3125L15.3762 23.32L15.3512 23.34C15.2427 23.4223 15.1376 23.5091 15.0362 23.6C14.7745 23.8318 14.5226 24.0745 14.2812 24.3275C13.6812 24.96 12.9112 25.9 12.1887 27.1575C10.7337 29.695 9.51122 33.4775 10.1987 38.535C10.8762 43.5275 12.9737 47.7 16.5187 50.61C20.0537 53.51 24.8387 55 30.6262 55C36.5937 55 41.3587 52.7625 44.5112 48.925C47.6362 45.1225 49.0312 39.935 48.6987 34.265C48.3787 28.825 45.4162 24.6975 42.7987 21.0525L42.0512 20.01C39.1962 15.98 36.9437 12.2675 37.4912 7.0725C37.5189 6.81104 37.4913 6.54667 37.4102 6.29657C37.3291 6.04647 37.1963 5.81623 37.0204 5.62078C36.8445 5.42534 36.6295 5.26907 36.3893 5.16213C36.1491 5.05518 35.8891 4.99994 35.6262 5C34.6712 5 33.5762 5.295 32.5212 5.74C31.2996 6.26377 30.1468 6.93546 29.0887 7.74C26.7762 9.485 24.4637 12.115 23.2312 15.63C22.0012 19.135 22.6262 22.475 23.5262 24.9075C24.1187 26.505 23.4762 28.0825 22.5087 28.5425C22.0971 28.7372 21.6261 28.7653 21.1942 28.6209C20.7623 28.4765 20.4029 28.1707 20.1912 27.7675L18.1762 23.94C18.0501 23.6999 17.8734 23.49 17.6583 23.3248C17.4432 23.1596 17.1948 23.043 16.9303 22.9831C16.6658 22.9232 16.3914 22.9215 16.1261 22.9779C15.8608 23.0343 15.611 23.1476 15.3937 23.31";

const BOLT_PATH =
  "M35.2269 0C36.0969 0 36.8914 0.496873 37.2718 1.2793C37.6519 2.06173 37.5514 2.99274 37.014 3.67676L27.4027 15.9092H39.7728C40.6754 15.9092 41.4927 16.4437 41.8548 17.2705C42.2166 18.0973 42.0547 19.0595 41.4427 19.7227L14.1702 49.2686C13.4623 50.0353 12.3227 50.2213 11.4075 49.7197C10.4927 49.218 10.0366 48.1575 10.3021 47.1484L15.2337 28.4092H2.27278C1.47763 28.409 0.740089 27.9928 0.328442 27.3125C-0.08311 26.6321 -0.109787 25.7855 0.259106 25.0811L12.7591 1.21777L12.8372 1.08105C13.2487 0.412366 13.9802 0.000144546 14.7728 0H35.2269Z";

interface RecapPatternProps {
  kind: RecapPatternKind;
  /** 무늬 색이며 투명도를 포함합니다. */
  color: string;
}

/**
 * 무늬 한 줄의 크기와 자리입니다.
 *
 * 첫 줄은 캐릭터 그림이 시작하는 자리에 놓고 `rowGap`만큼 내려갑니다. `offsets`는 줄마다
 * 화면 가운데에서 얼마나 밀렸는지입니다. 유형마다 시안이 다르게 배치해서 값을 그대로 옮겨 둡니다.
 */
const PATTERNS: Record<
  RecapPatternKind,
  {
    readonly width: number;
    readonly height: number;
    readonly rowGap: number;
    readonly offsets: readonly number[];
  }
> = {
  fire: {
    width: 60,
    height: 60,
    rowGap: 124,
    offsets: [-3, 57, -3, -85, -3, -85, -3],
  },
  square: {
    width: 50,
    height: 50,
    rowGap: 114,
    offsets: [-34, 35, -34, 35, -34, 35, -34],
  },
  bolt: {
    width: 42,
    height: 50,
    rowGap: 114,
    offsets: [-33, 32, -33, 32, -33, 32, -33],
  },
  circle: {
    width: 50,
    height: 50,
    rowGap: 114,
    offsets: [-32, 32, -32, 32, -32, 32, -32],
  },
};

const COLUMN_GAP = 82;

const MARKS_PER_ROW = 3;

function PatternMark({ kind, color }: RecapPatternProps) {
  const { width, height } = PATTERNS[kind];

  if (kind === "square" || kind === "circle") {
    return (
      <span
        style={{ width, height, backgroundColor: color }}
        className={`block shrink-0 ${kind === "circle" ? "rounded-full" : ""}`}
      />
    );
  }

  return (
    <svg
      viewBox={kind === "fire" ? "0 0 60 60" : "0 0 42 50"}
      style={{ width, height }}
      className="block shrink-0"
      aria-hidden="true"
    >
      <path d={kind === "fire" ? FIRE_PATH : BOLT_PATH} fill={color} />
    </svg>
  );
}

/**
 * 화면 뒤에 깔리는 무늬입니다.
 *
 * 캐릭터 그림이 시작하는 자리부터 일곱 줄을 놓고, 줄마다 좌우로 어긋나게 둡니다.
 */
export function RecapPattern({ kind, color }: RecapPatternProps) {
  const pattern = PATTERNS[kind];

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-[calc(env(safe-area-inset-top)+243px)] bottom-0 overflow-hidden"
    >
      {pattern.offsets.map((offset, row) => (
        <div
          key={row}
          style={{
            top: row * pattern.rowGap,
            left: `calc(50% + ${offset}px)`,
            gap: COLUMN_GAP,
          }}
          className="absolute flex -translate-x-1/2 items-center"
        >
          {Array.from({ length: MARKS_PER_ROW }, (_, column) => (
            <PatternMark key={column} kind={kind} color={color} />
          ))}
        </div>
      ))}
    </div>
  );
}
