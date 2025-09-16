import { inDND } from "../utils/dndChecker";

describe("inDND", () => {
  const dnd = { start: "21:00", end: "06:00" };

  test("should return true when time is inside DND period before midnight", () => {
    expect(inDND("2025-09-16T23:00:00Z", dnd)).toBe(true);
  });

  test("should return true when time is at midnight during DND period", () => {
    expect(inDND("2025-09-17T00:00:00Z", dnd)).toBe(true);
  });

  test("should return true when time is inside DND period after midnight", () => {
    expect(inDND("2025-09-17T04:00:00Z", dnd)).toBe(true);
  });

  test("should return true when time is exactly at DND start time", () => {
    expect(inDND("2025-09-16T21:00:00Z", dnd)).toBe(true);
  });

  test("should return false when time is exactly at DND end time", () => {
    expect(inDND("2025-09-17T06:00:00Z", dnd)).toBe(false);
  });

  test("should return false when time is after DND period ends", () => {
    expect(inDND("2025-09-17T06:01:00Z", dnd)).toBe(false);
  });

  test("should return false when DND configuration is undefined", () => {
    expect(inDND("2025-09-16T23:00:00Z")).toBe(false);
  });

  test("should return false when time is before DND period starts", () => {
    expect(inDND("2025-09-16T20:59:00Z", dnd)).toBe(false);
  });

  const simpleDnd = { start: "08:00", end: "17:00" };

  test("should return true when time is inside same-day DND period", () => {
    expect(inDND("2025-09-16T09:00:00Z", simpleDnd)).toBe(true);
  });

  test("should return false when time is before same-day DND period", () => {
    expect(inDND("2025-09-16T07:00:00Z", simpleDnd)).toBe(false);
  });

  test("should return false when time is after same-day DND period", () => {
    expect(inDND("2025-09-16T19:00:00Z", simpleDnd)).toBe(false);
  });

  const fullDayDnd = { start: "00:00", end: "00:00" };

  test("should return false when DND start and end times are identical", () => {
    expect(inDND("2025-09-16T12:00:00Z", fullDayDnd)).toBe(false);
  });
});
