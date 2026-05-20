import { describe, expect, it, vi } from "vitest";
import { activateOnKeyboard, isKeyboardActivationKey } from "./keyboardActivation";

describe("keyboard activation", () => {
  it("recognizes standard button activation keys", () => {
    expect(isKeyboardActivationKey("Enter")).toBe(true);
    expect(isKeyboardActivationKey(" ")).toBe(true);
    expect(isKeyboardActivationKey("Escape")).toBe(false);
  });

  it("runs the activation callback for Enter and Space", () => {
    const activate = vi.fn();
    const preventDefault = vi.fn();

    activateOnKeyboard({ key: "Enter", preventDefault }, activate);
    activateOnKeyboard({ key: " ", preventDefault }, activate);

    expect(activate).toHaveBeenCalledTimes(2);
    expect(preventDefault).toHaveBeenCalledTimes(2);
  });

  it("ignores non-activation keys", () => {
    const activate = vi.fn();
    const preventDefault = vi.fn();

    activateOnKeyboard({ key: "ArrowRight", preventDefault }, activate);

    expect(activate).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });
});
