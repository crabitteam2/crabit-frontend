import bulldozerImage from "@/../public/images/recaps/character-bulldozer.png";
import explorerImage from "@/../public/images/recaps/character-explorer.png";
import sprintImage from "@/../public/images/recaps/character-sprint.png";
import steadyImage from "@/../public/images/recaps/character-steady.png";
import type { StaticImageData } from "next/image";

/** 배경 무늬로 반복해서 그리는 모양입니다. */
export type RecapPatternKind = "fire" | "square" | "bolt" | "circle";

/** 저축 유형 하나가 쓰는 색과 그림입니다. */
export interface RecapTheme {
  /** 화면 배경 그라데이션의 위와 아래 색입니다. */
  readonly gradient: readonly [string, string];
  /** 별, 원, 십자 도형의 채움색입니다. */
  readonly shapes: {
    readonly star: string;
    readonly circle: string;
    readonly cross: string;
  };
  /** 배경 무늬의 모양과 색입니다. */
  readonly pattern: { readonly kind: RecapPatternKind; readonly color: string };
  /** 유형을 나타내는 캐릭터입니다. */
  readonly character: StaticImageData;
}

const THEMES: Record<string, RecapTheme> = {
  "불도저형 토끼": {
    gradient: ["#fd6c57", "#ffd889"],
    shapes: { star: "#ffd1b6", circle: "#ffca7a", cross: "#ffdea1" },
    pattern: { kind: "fire", color: "rgba(255,255,255,0.35)" },
    character: bulldozerImage,
  },
  "꾸준형 토끼": {
    gradient: ["#57cefd", "#b5e4b4"],
    shapes: { star: "#bffaf6", circle: "#c8ffdd", cross: "#c3eb9f" },
    pattern: { kind: "square", color: "rgba(173,231,253,0.3)" },
    character: steadyImage,
  },
  "단기 집중형 토끼": {
    gradient: ["#50ae43", "#e0c13a"],
    shapes: { star: "#c9e777", circle: "#a2e594", cross: "#f6eb90" },
    pattern: { kind: "bolt", color: "rgba(194,255,166,0.2)" },
    character: sprintImage,
  },
  "탐색형 토끼": {
    gradient: ["#8f43ad", "#e06f3a"],
    shapes: { star: "#fd92d6", circle: "#fa9b94", cross: "#ffcab3" },
    pattern: { kind: "circle", color: "rgba(190,69,237,0.3)" },
    character: explorerImage,
  },
};

const FALLBACK_THEME = THEMES["불도저형 토끼"]!;

/**
 * 저축 유형 이름에 맞는 색과 그림을 찾습니다.
 *
 * 계약이 유형 이름을 자유 문자열로 두어 모르는 값이 올 수 있고, 그때는 기본 테마를 씁니다.
 */
export function getRecapTheme(typeTitle: string): RecapTheme {
  return THEMES[typeTitle] ?? FALLBACK_THEME;
}
