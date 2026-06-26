function getApi() {
  return window.pywebview?.api;
}

function isPyWebView() {
  return typeof window.pywebview !== 'undefined' && window.pywebview?.api;
}

const FALLBACK_PARTS = [
  { id: '1', part_number: '90915-YZZN1', location: 'Estante A1', description: 'Filtro de aceite original Toyota (Corolla, Yaris, Terios)', stock: 20, purchase_cost: 8.5, sale_price: 12.5, currency: 'USD' },
  { id: '2', part_number: '15400-PLM-A02', location: 'Estante A1', description: 'Filtro de aceite original Honda (Civic, Accord)', stock: 18, purchase_cost: 9.0, sale_price: 13.0, currency: 'USD' },
  { id: '3', part_number: 'FL-820S', location: 'Estante A2', description: 'Filtro de aceite Motorcraft Ford (F-150, Explorer)', stock: 15, purchase_cost: 7.25, sale_price: 11.5, currency: 'USD' },
  { id: '4', part_number: 'A2462C', location: 'Estante A3', description: 'Filtro de aire de motor ACDelco GM (línea profesional)', stock: 12, purchase_cost: 15.0, sale_price: 22.0, currency: 'USD' },
  { id: '5', part_number: '04465-0K290', location: 'Estante B1', description: 'Pastillas de freno delanteras Toyota (Hilux, Fortuner)', stock: 25, purchase_cost: 120.0, sale_price: 180.0, currency: 'Bs' },
  { id: '6', part_number: '7L2Z-1104-A', location: 'Estante B2', description: 'Cubo de rueda delantero Ford (Explorer 2006-2010)', stock: 8, purchase_cost: 35.0, sale_price: 55.0, currency: 'USD' },
  { id: '7', part_number: '513288', location: 'Estante B3', description: 'Rodamiento de rueda trasera SKF (Chevrolet)', stock: 30, purchase_cost: 25.0, sale_price: 38.0, currency: 'USD' },
  { id: '8', part_number: '54611-3X000', location: 'Estante B4', description: 'Amortiguador delantero Hyundai (Elantra)', stock: 10, purchase_cost: 200.0, sale_price: 310.0, currency: 'Bs' },
  { id: '9', part_number: '12622441', location: 'Estante C1', description: 'Bobina de encendido GM Genuine (Tahoe, Silverado)', stock: 14, purchase_cost: 45.0, sale_price: 68.0, currency: 'USD' },
  { id: '10', part_number: 'ILKAR7B11', location: 'Estante C2', description: 'Bujía de iridio NGK (Subaru, Toyota, Nissan)', stock: 60, purchase_cost: 8.0, sale_price: 14.0, currency: 'USD' },
  { id: '11', part_number: '30520-R40-007', location: 'Estante C1', description: 'Bobina de encendido Honda (K24 Accord, CR-V)', stock: 9, purchase_cost: 52.0, sale_price: 79.0, currency: 'USD' },
  { id: '12', part_number: '7701048390', location: 'Estante C3', description: 'Bobina de encendido Renault (Clio, Logan, Megane)', stock: 11, purchase_cost: 38.0, sale_price: 56.0, currency: 'USD' },
  { id: '13', part_number: 'K060840', location: 'Estante D1', description: 'Correa de accesorios Gates serpentina 6 canales', stock: 22, purchase_cost: 18.0, sale_price: 28.0, currency: 'USD' },
  { id: '14', part_number: '16100-39426', location: 'Estante D2', description: 'Bomba de agua original Toyota (4Runner, Tacoma)', stock: 7, purchase_cost: 280.0, sale_price: 420.0, currency: 'Bs' },
  { id: '15', part_number: '5070', location: 'Estante D3', description: 'Termostato de motor Stant (Ford, GM)', stock: 35, purchase_cost: 12.0, sale_price: 19.0, currency: 'USD' },
];

export async function getAppInfo() {
  if (!isPyWebView()) {
    return { name: 'AutoPartsInventory', version: '1.1.0', developer: 'Samuel Chourio', email: 'chourio.samuel.24@gmail.com', description: 'Sistema de gestión de inventario para repuestos automotrices.' };
  }
  return getApi().get_app_info();
}

export async function getInventory() {
  if (!isPyWebView()) {
    return [...FALLBACK_PARTS];
  }
  const data = await getApi().get_inventory();
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function searchPart(partNumber) {
  if (!isPyWebView()) {
    return FALLBACK_PARTS.find(p => p.part_number === partNumber) || null;
  }
  const data = await getApi().search_part(partNumber);
  if (data?.error) return null;
  return data;
}

export async function loadEntry(partNumber, location, description, quantity, purchaseCost, salePrice) {
  if (!isPyWebView()) {
    return { id: Date.now().toString(), part_number: partNumber, location, description, stock: quantity, purchase_cost: purchaseCost ?? null, sale_price: salePrice ?? null, currency: '' };
  }
  const data = await getApi().load_entry(partNumber, location, description, quantity, purchaseCost ?? null, salePrice ?? null);
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function unloadExit(partNumber, quantity) {
  if (!isPyWebView()) {
    return { id: Date.now().toString(), part_number: partNumber, stock: 0 };
  }
  const data = await getApi().unload_exit(partNumber, quantity);
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function updatePartPrice(partId, salePrice, currency, purchaseCost) {
  if (!isPyWebView()) {
    return { id: partId, sale_price: salePrice, currency, purchase_cost: purchaseCost };
  }
  const data = await getApi().update_part_price(partId, salePrice, currency, purchaseCost ?? null);
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function getMovementReportRange(typeFilter, dateFrom, dateTo) {
  if (!isPyWebView()) {
    return { movements: [], totals: { total_in: 0, total_out: 0, net: 0 } };
  }
  const data = await getApi().get_movement_report_range(typeFilter, dateFrom || null, dateTo || null);
  if (data?.error) throw new Error(data.error);
  return data;
}

export async function generateReportPdf(reportType, dateFrom, dateTo) {
  if (!isPyWebView()) {
    return { success: true, filename: 'reporte-demo.pdf', filepath: '' };
  }
  const data = await getApi().generate_report_pdf(reportType, dateFrom || null, dateTo || null);
  if (data?.error) throw new Error(data.error);
  return data;
}
