# Contrato de API Bridge — `window.pywebview.api`

## 1. Mecanismo del Bridge

PyWebView expone un objeto Python como `window.pywebview.api` en el contexto global del frontend React. Cada método público de la clase `InventoryAPI` (definida en `backend/api/bridge.py`) se vuelve invocable desde JavaScript como una función asíncrona.

### Flujo de llamada

```
React (JS)
  │  await window.pywebview.api.metodo(args)
  ▼
PyWebView (C++ bridge nativo)
  │  Serializa args JSON → llama método Python
  ▼
InventoryAPI (Python)
  │  Procesa, llama a part_service / pdf_generator
  ▼
Retorna dict / list → serializado a JSON → resuelve Promise en JS
```

### Manejo de errores

Toda función retorna un `Promise`. Si el backend encuentra un error controlado, retorna un objeto con la clave `"error"`:

```js
// Éxito
{ id: "abc-123", part_number: "BRAKE-PAD-001", stock: 15 }

// Error controlado
{ error: "Stock insuficiente. Disponible: 5, solicitado: 10." }

// Error inesperado (excepción Python no capturada)
{ error: "Error inesperado: <traceback>" }
```

El frontend debe verificar `data.error` después de cada llamada.

---

## 2. Modelos de Datos

### Part

```json
{
  "id": "uuid-string",
  "part_number": "90915-YZZN1",
  "location": "Estante A1",
  "description": "Filtro de aceite original Toyota",
  "stock": 20,
  "purchase_cost": 8.5,
  "sale_price": 12.5,
  "currency": "USD"
}
```

| Campo | Tipo | Nullable | Descripción |
|---|---|---|---|
| id | string | no | UUID v4, interno |
| part_number | string | no | Identificador único visible |
| location | string | sí | Ej. "Estante A3" |
| description | string | sí | Descripción del producto |
| stock | int | no | Cantidad en existencia |
| purchase_cost | float \| null | sí | Costo de compra |
| sale_price | float \| null | sí | Precio de venta |
| currency | string | sí | "Bs" o "USD" |

### Movement

```json
{
  "date": "2026-06-23 14:30:00",
  "part_number": "90915-YZZN1",
  "description": "Filtro de aceite original Toyota",
  "type": "IN",
  "quantity": 5
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| date | string | "YYYY-MM-DD HH:mm:ss" |
| part_number | string | Número de parte del repuesto |
| description | string | Descripción |
| type | string | "IN" (entrada) o "OUT" (salida) |
| quantity | int | Cantidad movida |

### ReportResponse

```json
{
  "movements": [ Movement, ... ],
  "totals": {
    "total_in": 150,
    "total_out": 42,
    "net": 108
  }
}
```

| Campo | Tipo | Descripción |
|---|---|---|
| movements | Movement[] | Lista de movimientos filtrados |
| totals.total_in | int | Suma de cantidades IN |
| totals.total_out | int | Suma de cantidades OUT |
| totals.net | int | total_in - total_out |

### AppInfo

```json
{
  "name": "AutoPartsInventory",
  "version": "1.1.0",
  "developer": "Tu Nombre",
  "email": "contacto@ejemplo.com",
  "description": "Sistema de gestión de inventario para repuestos automotrices."
}
```

---

## 3. Métodos del Bridge

### 3.1 `get_app_info()`

Retorna información de la aplicación.

| | |
|---|---|
| **Sintaxis JS** | `const info = await window.pywebview.api.get_app_info()` |
| **Parámetros** | Ninguno |
| **Retorno éxito** | `AppInfo` |
| **Retorno error** | — (siempre retorna datos estáticos) |

---

### 3.2 `get_inventory()`

Retorta todos los repuestos ordenados por `part_number`.

| | |
|---|---|
| **Sintaxis JS** | `const parts = await window.pywebview.api.get_inventory()` |
| **Parámetros** | Ninguno |
| **Retorno éxito** | `Part[]` |
| **Retorno error** | `{error: string}` |

---

### 3.3 `search_part(part_number)`

Busca un repuesto específico por su número de parte.

| | |
|---|---|
| **Sintaxis JS** | `const part = await window.pywebview.api.search_part("90915-YZZN1")` |
| **Parámetros** | `part_number: string` |
| **Retorno éxito** | `Part` |
| **Retorno no encontrado** | `{error: "No se encontró el repuesto '...'."}` |
| **Retorno error** | `{error: string}` |

---

### 3.4 `load_entry(part_number, location, description, quantity)`

Registra una entrada de inventario. Si el `part_number` ya existe, suma al stock existente (y opcionalmente actualiza ubicación/descripción). Si no existe, crea un nuevo repuesto y registra el movimiento IN.

| | |
|---|---|
| **Sintaxis JS** | `await window.pywebview.api.load_entry("NUEVO-001", "Estante X", "Descripción", 10)` |
| **Parámetros** | `part_number: string`, `location: string`, `description: string`, `quantity: int` |
| **Retorno éxito** | `Part` actualizado |
| **Retorno error** | `{error: string}` |

**Comportamiento:**

- Si `part_number` existe en DB:
  - `part.stock += quantity`
  - Si `location` no es vacío, actualiza `part.location`
  - Si `description` no es vacío, actualiza `part.description`
  - Registra movimiento `type="IN"`
- Si `part_number` NO existe:
  - Crea nuevo `Part` con `stock = quantity`, `location`, `description`
  - Registra movimiento `type="IN"`
  - `purchase_cost`, `sale_price`, `currency` quedan en `null`

---

### 3.5 `unload_exit(part_number, quantity)`

Registra una salida de inventario. Valida que el repuesto exista y que el stock sea suficiente.

| | |
|---|---|
| **Sintaxis JS** | `await window.pywebview.api.unload_exit("90915-YZZN1", 3)` |
| **Parámetros** | `part_number: string`, `quantity: int` |
| **Retorno éxito** | `Part` actualizado (stock reducido) |
| **Retorno error** | `{error: "Stock insuficiente. Disponible: 5, solicitado: 10."}` |
| | `{error: "No se encontró el repuesto '...'."}` |

**Validaciones:**
- Si `quantity > part.stock` → error sin modificar DB
- Si `quantity <= 0` → error (controlado por `register_movement`)

---

### 3.6 `update_part_price(part_id, sale_price, currency)`

Actualiza el precio de venta y la moneda de un repuesto.

| | |
|---|---|
| **Sintaxis JS** | `await window.pywebview.api.update_part_price("uuid", 25.50, "USD")` |
| **Parámetros** | `part_id: string` (UUID), `sale_price: float`, `currency: string` ("Bs" \| "USD") |
| **Retorno éxito** | `Part` actualizado |
| **Retorno error** | `{error: "El ID del repuesto no es válido."}` |
| | `{error: "No se encontró un repuesto con id ..."}` |

---

### 3.7 `get_movement_report()`

Retorna el historial completo de movimientos sin filtros.

| | |
|---|---|
| **Sintaxis JS** | `const movs = await window.pywebview.api.get_movement_report()` |
| **Parámetros** | Ninguno |
| **Retorno éxito** | `Movement[]` (ordenado por fecha descendente) |
| **Retorno error** | `{error: string}` |

---

### 3.8 `get_movement_report_range(type_filter, date_from, date_to)`

Retorna movimientos filtrados por tipo y/o rango de fechas, más totales.

| | |
|---|---|
| **Sintaxis JS** | `const data = await window.pywebview.api.get_movement_report_range("all", "2026-01-01", "2026-06-23")` |
| **Parámetros** | `type_filter: string` — `"all"` \| `"IN"` \| `"OUT"` |
| | `date_from: string \| null` — `"YYYY-MM-DD"` o `null` (sin límite inferior) |
| | `date_to: string \| null` — `"YYYY-MM-DD"` o `null` (sin límite superior) |
| **Retorno éxito** | `ReportResponse` |
| **Retorno error** | `{error: string}` |

---

### 3.9 `generate_report_pdf(report_type, date_from, date_to)`

Genera un archivo PDF con el reporte de movimientos y lo abre en el navegador del sistema.

| | |
|---|---|
| **Sintaxis JS** | `await window.pywebview.api.generate_report_pdf("IN", "2026-01-01", "2026-06-23")` |
| **Parámetros** | `report_type: string` — `"all"` \| `"IN"` \| `"OUT"` |
| | `date_from: string \| null` |
| | `date_to: string \| null` |
| **Retorno éxito** | `{success: "Reporte Completo generado correctamente."}` |
| **Retorno error** | `{error: "No se pudo generar el reporte: ..."}` |

---

## 4. Mapa de Compatibilidad

| Método JS | Método Python | Servicio |
|---|---|---|
| `get_app_info()` | `InventoryAPI.get_app_info()` | — (datos estáticos) |
| `get_inventory()` | `InventoryAPI.get_inventory()` | `part_service.get_all_parts()` |
| `search_part(pn)` | `InventoryAPI.search_part(pn)` | `part_service.search_part_by_number()` |
| `load_entry(pn,loc,desc,qty)` | `InventoryAPI.load_entry(...)` | `part_service.search_part_by_number()` + `register_movement()` |
| `unload_exit(pn,qty)` | `InventoryAPI.unload_exit(...)` | `part_service.search_part_by_number()` + `register_movement()` |
| `update_part_price(id,price,cur)` | `InventoryAPI.update_part_price(...)` | `part_service.update_price()` |
| `get_movement_report()` | `InventoryAPI.get_movement_report()` | `part_service.get_movement_report()` |
| `get_movement_report_range(...)` | `InventoryAPI.get_movement_report_range(...)` | `part_service.get_movement_report_with_range()` |
| `generate_report_pdf(...)` | `InventoryAPI.generate_report_pdf(...)` | `pdf_generator_fpdf.generate_report()` |

---

## 5. Ejemplo Completo (Frontend)

```js
import { getInventory, loadEntry, unloadExit } from '../services/api';

// Obtener todo el inventario
const parts = await getInventory();

// Registrar entrada (crear o sumar stock)
try {
  const updated = await loadEntry("NUEVO-001", "Estante Z", "Descripción", 5);
  console.log("Stock actualizado:", updated.stock);
} catch (e) {
  alert("Error: " + e.message);
}

// Registrar salida con validación de stock
try {
  const result = await unloadExit("90915-YZZN1", 3);
} catch (e) {
  // e.message contiene el error del backend
  alert(e.message);
}
```
