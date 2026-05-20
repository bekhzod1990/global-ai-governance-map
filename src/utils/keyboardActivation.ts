export interface KeyboardActivationEvent {
  key: string;
  preventDefault: () => void;
}

export function isKeyboardActivationKey(key: string): boolean {
  return key === "Enter" || key === " ";
}

export function activateOnKeyboard(
  event: KeyboardActivationEvent,
  activate: () => void
): void {
  if (!isKeyboardActivationKey(event.key)) return;
  event.preventDefault();
  activate();
}
