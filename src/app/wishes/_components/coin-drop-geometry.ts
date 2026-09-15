// Measurements in the unchanged PNG assets, mapped to the 390px design area.
export const COIN = { left: -5, top: 215, size: 144 };
export const BANK = { left: 92, top: 310, width: 207, height: 277 };
export const COIN_INK = {
  centerX: (86 + 348) / 6,
  centerY: (78 + 349) / 6,
  width: (348 - 86) / 3,
  height: (349 - 78) / 3,
}; // coin.png: 432×432, alpha > 128 half-open bounds (86,78)–(348,349).
// Front edge of the dark opening in piggy-bank-smile.png (1086×1448).
export const SLOT = {
  left: BANK.left + (388 / 1086) * BANK.width,
  right: BANK.left + (650 / 1086) * BANK.width,
  leftY: BANK.top + (634 / 1448) * BANK.height,
  rightY: BANK.top + (665 / 1448) * BANK.height,
};
export const SLOT_CENTER_X = (SLOT.left + SLOT.right) / 2;
export const ALIGNED = { x: SLOT_CENTER_X - COIN_INK.centerX, y: 150 };
export const LANDED = { x: ALIGNED.x, y: 435 };

export function frontEdgeY(x: number) {
  return (
    SLOT.leftY +
    ((x - SLOT.left) / (SLOT.right - SLOT.left)) * (SLOT.rightY - SLOT.leftY)
  );
}
// The identical bank image covers only the portion below its slanted front rim.
export const FRONT_CLIP = `polygon(0px ${frontEdgeY(BANK.left) - BANK.top}px, ${BANK.width}px ${frontEdgeY(BANK.left + BANK.width) - BANK.top}px, 100% 100%, 0 100%)`;

export function fallPose(progress: number) {
  const t = Math.max(0, Math.min(progress, 1));
  // Finish fitting before first contact with the rim, with zero end velocity.
  const fitting = Math.min(t / 0.68, 1);
  const eased = fitting * fitting * (3 - 2 * fitting);
  return {
    x: ALIGNED.x,
    y: ALIGNED.y + (LANDED.y - ALIGNED.y) * t * t,
    scale: 1 - 0.56 * eased,
    rotation: 7.5 * eased,
    turn: -12 * eased,
  };
}

export function projectedInkCorners(progress: number) {
  const pose = fallPose(progress);
  const angle = (pose.rotation * Math.PI) / 180;
  const turn = (pose.turn * Math.PI) / 180;
  return [-1, 1].flatMap((horizontal) =>
    [-1, 1].map((vertical) => {
      const x = horizontal * (COIN_INK.width / 2) * pose.scale * Math.cos(turn);
      const y = vertical * (COIN_INK.height / 2) * pose.scale;
      return {
        x:
          pose.x + COIN_INK.centerX + x * Math.cos(angle) - y * Math.sin(angle),
        y:
          pose.y + COIN_INK.centerY + x * Math.sin(angle) + y * Math.cos(angle),
      };
    }),
  );
}
