import { getRelativeTimeUnit, getRelativeTimeValue } from "./date";

const second = 1000;
const minute = 60 * second;
const hour = 60 * minute;
const day = 24 * hour;

test("Relative time unit should be days if difference is x>= 1 day", () => {
    expect(getRelativeTimeUnit(day)).toBe("day");
    expect(getRelativeTimeUnit(day * 100)).toBe("day");
});

test("Relative time unit should be hours if difference is 1<=x<24 hours", () => {
    expect(getRelativeTimeUnit(5 * hour)).toBe("hour");
    expect(getRelativeTimeUnit(23 * hour)).toBe("hour");
    expect(getRelativeTimeUnit(1 * hour)).toBe("hour");
});

test("Relative time unit should be seconds if difference is x<1 minute", () => {
    expect(getRelativeTimeUnit(second * 30)).toBe("second");
    expect(getRelativeTimeUnit(0)).toBe("second");
});

test("Relative time unit should be quarters if difference is 15<=x<60 minutes", () => {
    expect(getRelativeTimeUnit(30 * minute)).toBe("quarter");
    expect(getRelativeTimeUnit(15 * minute)).toBe("quarter");
    expect(getRelativeTimeUnit(59 * minute)).toBe("quarter");
});


test("Relative time value should be in minutes if difference is 1<=x<15 minutes", () => {
    expect(getRelativeTimeValue(14 * minute)).toBe(14);
    expect(getRelativeTimeValue(1 * minute)).toBe(1);
});

test("Relative time value should be in quarters if difference is 15<=x<60 minutes", () => {
    expect(getRelativeTimeValue(15 * minute)).toBe(1);
    expect(getRelativeTimeValue(35 * minute)).toBe(2);
    expect(getRelativeTimeValue(59 * minute)).toBe(3);
});

test("Relative time value should be in hours if difference is 1<=x<24 hours", () => {
    expect(getRelativeTimeValue(1 * hour)).toBe(1);
    expect(getRelativeTimeValue(23 * hour + 59 * minute)).toBe(23);
});
test("Relative time value should be in days if difference is 1<=x days", () => {
    expect(getRelativeTimeValue(1 * day)).toBe(1);
    expect(getRelativeTimeValue(25 * day)).toBe(25);
});
