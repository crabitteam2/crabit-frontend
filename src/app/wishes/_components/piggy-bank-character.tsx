import Image from "next/image";
import normalImage from "@/../public/images/wishes/piggy-bank.png";
import smileImage from "@/../public/images/wishes/piggy-bank-smile.png";
import heartImage from "@/../public/images/wishes/piggy-bank-filled.png";
import { BANK, FRONT_CLIP } from "./coin-drop-geometry";

type Expression = "normal" | "smile" | "heart";

// Align each original face's nose to the smile artwork's nose. Only the
// interior face is composited; ears, silhouette and slot always use smile.
const FACES = {
  normal: {
    image: normalImage,
    x: 0.213,
    y: 0.656,
    mask: [
      "radial-gradient(ellipse 24px 30px at 49px 193px, #000 70%, transparent 100%)",
      "radial-gradient(ellipse 24px 30px at 116px 205px, #000 70%, transparent 100%)",
      "radial-gradient(ellipse 31px 23px at 80px 228px, #000 70%, transparent 100%)",
    ].join(", "),
  },
  heart: {
    image: heartImage,
    x: -0.734,
    y: 0.259,
    mask: [
      "radial-gradient(ellipse 37px 37px at 51px 193px, #000 80%, transparent 100%)",
      "radial-gradient(ellipse 37px 37px at 125px 204px, #000 80%, transparent 100%)",
      "radial-gradient(ellipse 31px 23px at 80px 228px, #000 70%, transparent 100%)",
    ].join(", "),
  },
};

export function PiggyBankCharacter({
  expression,
  foreground = false,
}: {
  expression: Expression;
  foreground?: boolean;
}) {
  const face = expression === "smile" ? null : FACES[expression];
  return (
    <div
      aria-hidden="true"
      data-piggy-bank={foreground ? "foreground" : "character"}
      data-expression={expression}
      className="pointer-events-none absolute select-none"
      style={{
        ...BANK,
        clipPath: foreground ? FRONT_CLIP : undefined,
      }}
    >
      <Image
        src={smileImage}
        alt=""
        width={BANK.width}
        height={BANK.height}
        priority
        draggable={false}
        data-piggy-body="true"
        style={{ width: BANK.width, height: BANK.height }}
      />
      {face === null ? null : (
        <div
          className="absolute inset-0"
          data-piggy-face={expression}
          style={{ maskImage: face.mask }}
        >
          <Image
            src={face.image}
            alt=""
            width={BANK.width}
            height={BANK.height}
            priority
            draggable={false}
            style={{
              width: BANK.width,
              height: BANK.height,
              transform: `translate(${face.x}px, ${face.y}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
}
