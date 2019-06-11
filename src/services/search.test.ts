import { buildSearchUrl } from "./search";

test("Should handle spaces properly", () => {
    const lotr = buildSearchUrl("lotr", "lord of the rings")
    expect(lotr).toBe("lotr?q=lord+of+the+rings");
})