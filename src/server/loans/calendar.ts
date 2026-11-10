export const LOAN_TIME_ZONE = "America/Sao_Paulo";
export const CALENDAR_YEARS = [2026, 2027, 2028, 2029, 2030] as const;
export const CALENDAR_VERSION = "br-2026-2030-v1";
// Nine fixed dates from laws 662/1949 (updated), 6802/1980 and 14759/2023.
const fixedDates = ["01-01", "04-21", "05-01", "09-07", "10-12", "11-02", "11-15", "11-20", "12-25"];
export type LoanCalendar = { readonly version: string; covers(year: number): boolean; isHoliday(civilDate: string): boolean };
export function createBrazilCalendar(): LoanCalendar {
  const holidays = new Set(CALENDAR_YEARS.flatMap(year => fixedDates.map(day => `${year}-${day}`)));
  return Object.freeze({
    version: `${CALENDAR_VERSION}-fixed-only`,
    covers: (year: number) => CALENDAR_YEARS.some(y => y === year),
    isHoliday: (day: string) => holidays.has(day),
  });
}
const formatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: LOAN_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit",
  hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23",
});
function parts(instant: Date) {
  const values = Object.fromEntries(formatter.formatToParts(instant).map(p => [p.type, p.value]));
  return { year: Number(values.year), month: Number(values.month), day: Number(values.day), hour: Number(values.hour), minute: Number(values.minute), second: Number(values.second) };
}
function key(day: Date) { return day.toISOString().slice(0, 10); }
function endOfLocalDay(day: Date): Date {
  const desired = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate(), 23, 59, 59);
  let candidate = desired;
  for (let i = 0; i < 4; i++) {
    const local = parts(new Date(candidate));
    const represented = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute, local.second);
    const delta = desired - represented;
    if (!delta) return new Date(candidate);
    candidate += delta;
  }
  throw new Error("Não foi possível representar o vencimento no fuso aprovado.");
}
export function calculateLoanDueAt(requestedAt: Date, calendar: LoanCalendar): Date {
  if (!Number.isFinite(requestedAt.getTime())) throw new Error("Instante de solicitação inválido.");
  const local = parts(requestedAt);
  let day = new Date(Date.UTC(local.year, local.month - 1, local.day));
  if (!calendar.covers(local.year)) throw new Error("Calendário sem cobertura para o prazo solicitado.");
  let counted = 0;
  while (counted < 14) {
    day = new Date(day.getTime() + 86400000);
    if (!calendar.covers(day.getUTCFullYear())) throw new Error("Calendário sem cobertura para o prazo solicitado.");
    const weekday = day.getUTCDay();
    if (weekday !== 0 && weekday !== 6 && !calendar.isHoliday(key(day))) counted++;
  }
  return endOfLocalDay(day);
}
export function isLoanOverdue(dueAt: Date, now: Date): boolean {
  if (!Number.isFinite(dueAt.getTime()) || !Number.isFinite(now.getTime())) throw new Error("Instante inválido.");
  return now.getTime() > dueAt.getTime();
}
