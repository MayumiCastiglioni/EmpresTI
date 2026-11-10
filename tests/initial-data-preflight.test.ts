import { describe, expect, it } from "vitest";
import { initialEquipment, preflightEquipment, type ExistingEquipment } from "../src/server/initial-data/preflight";

function photos() {
  return Object.fromEntries(initialEquipment.map(([tag],i) => {
    const sha256 = (i+1).toString(16).padStart(64,"0");
    return [tag, { provider:"pexels", sourceId:String(i+1), sourceUrl:`https://www.pexels.com/photo/${i+1}/`,
      photographer:"Autor sintético", photographerUrl:"https://www.pexels.com/@fixture/", licenseUrl:"https://www.pexels.com/license/",
      licenseCheckedAt:"2026-11-06", bucket:"equipment-images", objectKey:`empresti/${tag}/${sha256}.png`, width:800,height:600,sha256 }];
  }));
}
function records(p=photos()): ExistingEquipment[] {
  return initialEquipment.map(([assetTag,name,category,status]) => ({assetTag,name,category,status,image:p[assetTag]}));
}

describe("DAT-05A — pré-validação de equipamentos, sem escrita", () => {
  it("DADOS-01 — lista exata de doze itens, dez disponíveis e duas manutenções", () => {
    expect(initialEquipment.map(e=>e[0])).toEqual(Array.from({length:12},(_,i)=>`TI-${String(i+1).padStart(4,"0")}`));
    expect(initialEquipment.filter(e=>e[3]==="MANUTENCAO").map(e=>e[0])).toEqual(["TI-0004","TI-0007"]);
    expect(preflightEquipment(photos(),[]).create).toHaveLength(12);
  });
  it("DADOS-02 — comparação repetida reaproveita iguais sem depender da ordem dos metadados", () => {
    const existing=records();
    existing[0].image=Object.fromEntries(Object.entries(existing[0].image as Record<string,unknown>).reverse());
    const report=preflightEquipment(photos(),existing);
    expect(report.status).toBe("equipment-comparison-passed");expect(report.create).toEqual([]);expect(report.reuse).toHaveLength(12);
  });
  it.each(["name","category","status","image"] as const)("DADOS-03 — diferença em %s bloqueia lote inteiro e preserva entrada", field => {
    const existing=records(); existing[0][field]="DIVERGENTE";
    const before=JSON.stringify(existing);
    const report=preflightEquipment(photos(),existing);
    expect(report.status).toBe("blocked");expect(report.issues).toContainEqual({assetTag:"TI-0001",field});
    expect(report.create).toEqual([]);expect(report.reuse).toEqual([]);expect(JSON.stringify(existing)).toBe(before);
  });
  it("DADOS-03 — registros alheios são preservados e duplicata no lote bloqueia", () => {
    const existing=records();existing.push({...existing[0],assetTag:"OTHER"});
    expect(preflightEquipment(photos(),existing).status).toBe("equipment-comparison-passed");
    existing.push(existing[0]);expect(preflightEquipment(photos(),existing).status).toBe("blocked");
  });
  it("DADOS-04 — recusa foto ausente, extra, duplicada ou metadados inválidos", () => {
    const p=photos();delete p["TI-0001"];expect(preflightEquipment(p,[]).status).toBe("blocked");
    const extra={...photos(),extra:photos()["TI-0001"]};expect(preflightEquipment(extra,[]).status).toBe("blocked");
    const duplicate=photos();duplicate["TI-0002"].sourceId="1";expect(preflightEquipment(duplicate,[]).status).toBe("blocked");
    const sameContent=photos();sameContent["TI-0002"].sha256=sameContent["TI-0001"].sha256;
    sameContent["TI-0002"].objectKey=`empresti/TI-0002/${sameContent["TI-0002"].sha256}.png`;
    expect(preflightEquipment(sameContent,[]).status).toBe("blocked");
    for (const patch of [{width:10},{licenseCheckedAt:"2026-02-30"},{sourceUrl:"https://evil.example/photo"},{photographer:""},{objectKey:"../file"},{token:"private"}]) {
      const invalid=photos();Object.assign(invalid["TI-0001"],patch);expect(preflightEquipment(invalid,[]).status).toBe("blocked");
    }
  });
  it("DADOS-06 — erro não ecoa valor privado presente na entrada", () => {
    const invalid=photos();Object.assign(invalid["TI-0001"],{token:"SEGREDO-SINTETICO"});
    expect(JSON.stringify(preflightEquipment(invalid,[]))).not.toContain("SEGREDO-SINTETICO");
    expect(preflightEquipment(null,[]).status).toBe("blocked");
  });
});
