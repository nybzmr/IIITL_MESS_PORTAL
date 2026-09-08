const IST_TIME_ZONE = "Asia/Kolkata";
const DAY_MS = 24 * 60 * 60 * 1000;

function getISTDateParts(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-CA", {
        timeZone: IST_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(date);
    const value = {};
    for (const part of parts) value[part.type] = part.value;
    return { year: Number(value.year), month: Number(value.month), day: Number(value.day) };
}

function dateKeyFromUTCDate(date) {
    return date.toISOString().slice(0, 10);
}

function addDays(dateKey, days) {
    const date = new Date(`${dateKey}T00:00:00.000Z`);
    date.setUTCDate(date.getUTCDate() + days);
    return dateKeyFromUTCDate(date);
}

function getCurrentWeekStart(date = new Date()) {
    const parts = getISTDateParts(date);
    const istCalendarDate = new Date(Date.UTC(parts.year, parts.month - 1, parts.day));
    const mondayOffset = (istCalendarDate.getUTCDay() + 6) % 7;
    istCalendarDate.setUTCDate(istCalendarDate.getUTCDate() - mondayOffset);
    return dateKeyFromUTCDate(istCalendarDate);
}

function getWeekPeriod(weekStart) {
    const weekEnd = addDays(weekStart, 7);
    const format = (value) => new Intl.DateTimeFormat("en-GB", {
        timeZone: "UTC",
        day: "numeric",
        month: "long",
        year: "numeric",
    }).format(new Date(`${value}T00:00:00.000Z`));

    return {
        start: weekStart,
        end: weekEnd,
        label: `${format(weekStart)} to ${format(weekEnd)}`,
    };
}

function getCouponWeeks(date = new Date()) {
    const currentWeekStart = getCurrentWeekStart(date);
    const nextWeekStart = addDays(currentWeekStart, 7);
    return {
        current: getWeekPeriod(currentWeekStart),
        next: getWeekPeriod(nextWeekStart),
    };
}

module.exports = {
    DAY_MS,
    addDays,
    getCouponWeeks,
    getCurrentWeekStart,
    getWeekPeriod,
};
