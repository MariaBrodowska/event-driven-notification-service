import { inDND } from "../utils/dndChecker";

describe("inDND", () => {
  const dnd = { start: "21:00", end: "06:00" };

  test("case: inside DND (before midnight)", () => {
    expect(inDND("2025-09-16T23:00:00Z", dnd)).toBe(true);
  });

  test("case: inside DND (after midnight)", () => {
    expect(inDND("2025-09-17T04:00:00Z", dnd)).toBe(true);
  });

  test("case: at the start of DND (should not allow)", () => {
    expect(inDND("2025-09-16T21:00:00Z", dnd)).toBe(true);
  });

  test("case: at the end of DND (should allow)", () => {
    expect(inDND("2025-09-17T06:00:00Z", dnd)).toBe(false);
  });

  test("case: DND undefined (should allow)", () => {
    expect(inDND("2025-09-16T23:00:00Z")).toBe(false);
  });
});
