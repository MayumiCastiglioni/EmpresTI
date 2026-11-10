import { describe, expect, it } from "vitest";
import { calculateLoanDueAt, createBrazilCalendar, isLoanOverdue } from "../src/server/loans/calendar";
const calendar = createBrazilCalendar();

describe("EMP-T02 — calendário 2026–2030", () => {
  it("EMP-07 — exclui dia inicial, finais de semana e 20/11, vencendo 23:59:59 de São Paulo", () => {
    expect(calculateLoanDueAt(new Date("2026-11-06T15:00:00Z"),calendar).toISOString()).toBe("2026-11-28T02:59:59.000Z");
  });
  it("EMP-07 — usa data de São Paulo perto da meia-noite UTC", () => {
    const late = calculateLoanDueAt(new Date("2026-11-07T02:59:59Z"),calendar);
    const following = calculateLoanDueAt(new Date("2026-11-07T03:00:00Z"),calendar);
    expect(late.toISOString()).toBe("2026-11-28T02:59:59.000Z");
    expect(following.toISOString()).toBe("2026-11-28T02:59:59.000Z");
    expect(calculateLoanDueAt(new Date("2026-11-10T02:59:59Z"),calendar).toISOString()).not.toBe(calculateLoanDueAt(new Date("2026-11-10T03:00:00Z"),calendar).toISOString());
  });
  it.each([2026,2027,2028,2029,2030])("EMP-07 — cobre datas nacionais fixas em %s sem incluir pontos facultativos", year => {
    for(const day of ["01-01","04-21","05-01","09-07","10-12","11-02","11-15","11-20","12-25"])expect(calendar.isHoliday(`${year}-${day}`)).toBe(true);
    expect(calendar.covers(year)).toBe(true);
    const result=calculateLoanDueAt(new Date(`${year}-07-01T15:00:00Z`),calendar);
    expect(result.toISOString()).toBe(`${year}-07-${({2026:"22",2027:"22",2028:"21",2029:"20",2030:"20"} as Record<number,string>)[year]}T02:59:59.000Z`);
  });
  it("EMP-07 — usa apenas feriados fixos, sem Sexta-feira da Paixão ou pontos facultativos", () => {
    for(const day of ["2026-04-03","2027-03-26","2028-04-14","2029-03-30","2030-04-19","2026-02-17","2026-06-04"])expect(calendar.isHoliday(day)).toBe(false);
  });
  it("EMP-07 — atravessa dezembro/janeiro cobertos e ano bissexto", () => {
    expect(calculateLoanDueAt(new Date("2026-12-18T15:00:00Z"),calendar).toISOString()).toBe("2027-01-12T02:59:59.000Z");
    expect(calculateLoanDueAt(new Date("2028-02-18T15:00:00Z"),calendar).toISOString()).toBe("2028-03-10T02:59:59.000Z");
  });
  it("EMP-07 — recusa ano ou prazo fora da cobertura e data inválida", () => {
    for(const value of ["2025-12-30T15:00:00Z","2030-12-31T15:00:00Z","2031-01-01T15:00:00Z","invalid"]){expect(()=>calculateLoanDueAt(new Date(value),calendar)).toThrow();}
  });
  it("EMP-04 — atraso só depois do instante de vencimento, com precisão de milissegundos", () => {
    const due=new Date("2026-11-28T02:59:59.000Z");
    expect(isLoanOverdue(due,new Date(due.getTime()-1))).toBe(false);
    expect(isLoanOverdue(due,new Date(due))).toBe(false);
    expect(isLoanOverdue(due,new Date(due.getTime()+1))).toBe(true);
    expect(()=>isLoanOverdue(due,new Date("invalid"))).toThrow();
  });
});
