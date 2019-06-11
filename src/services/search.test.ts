import { buildSearchUrl } from "./search";

test("Should handle spaces properly", () => {
    const lotr = buildSearchUrl("lotr", "lord of the rings")
    expect(lotr).toBe("lotr?q=lord+of+the+rings");
});

test("Should handle being given no base", () => {
    const lotr = buildSearchUrl("", "lord of the rings")
    expect(lotr).toBe("?q=lord+of+the+rings");
})