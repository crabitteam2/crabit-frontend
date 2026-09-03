import type { KeyboardEvent } from "react";
export function formEnter(event: KeyboardEvent, next?: () => void) {
  if (event.key !== "Enter") return;
  if (event.nativeEvent.isComposing || event.nativeEvent.keyCode === 229) {
    event.preventDefault();
    return;
  }
  if (next) { event.preventDefault(); next(); }
}
