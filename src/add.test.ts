import { addN } from "./add";

test("Should do addition properly", () => {
    const add8 = addN(8);
    expect(add8(7)).toBe(15);
    expect(add8(100)).toBe(108);
})

test("Should be associative", () => {
    expect(addN(8)(2)).toBe(addN(2)(8));
})