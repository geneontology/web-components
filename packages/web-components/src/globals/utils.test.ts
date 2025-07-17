import { sameArray } from "./utils";

describe("sameArray", () => {
  it("should return true for two empty arrays", () => {
    expect(sameArray([], [])).toBe(true);
  });

  it("should return true for two arrays with the same elements", () => {
    expect(sameArray([1, 2, 3], [1, 2, 3])).toBe(true);
  });

  it("should return false for two arrays with different elements", () => {
    expect(sameArray([1, 2, 3], [1, 2, 4])).toBe(false);
  });

  it("should return false for two arrays with different lengths", () => {
    expect(sameArray([1, 2, 3], [1, 2])).toBe(false);
  });

  it("should return true for two arrays with the same object", () => {
    const obj1 = { id: 1 };
    expect(sameArray([obj1], [obj1])).toBe(true);
  });

  it("should return false for two arrays with different objects", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 1 };
    expect(sameArray([obj1], [obj2])).toBe(false);
  });

  it("should return true for two arrays with the same objects using custom equality function", () => {
    const obj1 = { id: 1 };
    const obj2 = { id: 1 };
    const customEqFn = (a, b) => a.id === b.id;
    expect(sameArray([obj1], [obj2], customEqFn)).toBe(true);
  });
});
