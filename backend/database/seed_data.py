from database.models import Part

SAMPLE_PARTS = [
    # Filtros y Mantenimiento
    {"part_number": "90915-YZZN1",  "location": "Estante A1", "description": "Filtro de aceite original Toyota (Corolla, Yaris, Terios)", "stock": 20, "purchase_cost": 8.50, "sale_price": 12.50, "currency": "USD"},
    {"part_number": "15400-PLM-A02", "location": "Estante A1", "description": "Filtro de aceite original Honda (Civic, Accord)", "stock": 18, "purchase_cost": 9.00, "sale_price": 13.00, "currency": "USD"},
    {"part_number": "FL-820S",       "location": "Estante A2", "description": "Filtro de aceite Motorcraft Ford (F-150, Explorer)", "stock": 15, "purchase_cost": 7.25, "sale_price": 11.50, "currency": "USD"},
    {"part_number": "A2462C",        "location": "Estante A3", "description": "Filtro de aire de motor ACDelco GM (línea profesional)", "stock": 12, "purchase_cost": 15.00, "sale_price": 22.00, "currency": "USD"},
    # Frenos y Suspensión
    {"part_number": "04465-0K290",   "location": "Estante B1", "description": "Pastillas de freno delanteras Toyota (Hilux, Fortuner)", "stock": 25, "purchase_cost": 120.00, "sale_price": 180.00, "currency": "Bs"},
    {"part_number": "7L2Z-1104-A",   "location": "Estante B2", "description": "Cubo de rueda delantero Ford (Explorer 2006-2010)", "stock": 8, "purchase_cost": 35.00, "sale_price": 55.00, "currency": "USD"},
    {"part_number": "513288",        "location": "Estante B3", "description": "Rodamiento de rueda trasera SKF (Chevrolet)", "stock": 30, "purchase_cost": 25.00, "sale_price": 38.00, "currency": "USD"},
    {"part_number": "54611-3X000",   "location": "Estante B4", "description": "Amortiguador delantero Hyundai (Elantra)", "stock": 10, "purchase_cost": 200.00, "sale_price": 310.00, "currency": "Bs"},
    # Encendido y Sistema Eléctrico
    {"part_number": "12622441",      "location": "Estante C1", "description": "Bobina de encendido GM Genuine (Tahoe, Silverado)", "stock": 14, "purchase_cost": 45.00, "sale_price": 68.00, "currency": "USD"},
    {"part_number": "ILKAR7B11",     "location": "Estante C2", "description": "Bujía de iridio NGK (Subaru, Toyota, Nissan)", "stock": 60, "purchase_cost": 8.00, "sale_price": 14.00, "currency": "USD"},
    {"part_number": "30520-R40-007", "location": "Estante C1", "description": "Bobina de encendido Honda (K24 Accord, CR-V)", "stock": 9, "purchase_cost": 52.00, "sale_price": 79.00, "currency": "USD"},
    {"part_number": "7701048390",    "location": "Estante C3", "description": "Bobina de encendido Renault (Clio, Logan, Megane)", "stock": 11, "purchase_cost": 38.00, "sale_price": 56.00, "currency": "USD"},
    # Bandas, Correas y Enfriamiento
    {"part_number": "K060840",       "location": "Estante D1", "description": "Correa de accesorios Gates serpentina 6 canales", "stock": 22, "purchase_cost": 18.00, "sale_price": 28.00, "currency": "USD"},
    {"part_number": "16100-39426",   "location": "Estante D2", "description": "Bomba de agua original Toyota (4Runner, Tacoma)", "stock": 7, "purchase_cost": 280.00, "sale_price": 420.00, "currency": "Bs"},
    {"part_number": "5070",          "location": "Estante D3", "description": "Termostato de motor Stant (Ford, GM)", "stock": 35, "purchase_cost": 12.00, "sale_price": 19.00, "currency": "USD"},
]


def get_seed_parts():
    return [Part(**data) for data in SAMPLE_PARTS]
