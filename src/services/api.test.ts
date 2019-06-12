import { buildSearchUrl, createImageUrlBuilder} from "./api";
import noCover from "../assets/noCover.jpg";
test("Searchbuilder should handle spaces properly", () => {
    const lotr = buildSearchUrl("lotr", "lord of the rings")
    expect(lotr).toBe("lotr?q=lord+of+the+rings");
});

test("Searchbuilder should handle being given no base", () => {
    const lotr = buildSearchUrl("", "lord of the rings")
    expect(lotr).toBe("?q=lord+of+the+rings");
})

test("ImageUrlBuilder should create correct image urls", () => {
    const build = createImageUrlBuilder("");
    expect(build("something", "m")).toBe("something-M.jpg");
})

test("ImageUrlBuilder should give a fallback value when there is no isbn present", () => {
    const build = createImageUrlBuilder("");
    expect(build("", "m")).toBe(noCover);
})
