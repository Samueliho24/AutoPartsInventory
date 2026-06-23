# Contexto del Proyecto: AutoPartsInventory

## 1. Descripción General

Aplicación de escritorio local para la gestión de inventario de repuestos automotrices. Corre en una sola computadora sin conexión a red.

### Funcionalidades Esenciales
- Cargar repuestos al inventario (Entradas / IN).
- Descargar repuestos del inventario (Salidas / OUT).
- Visualizar en tiempo real el stock disponible con búsqueda por número de parte.
- Editar precio de venta y moneda (Bs/USD) por repuesto.
- Generar e imprimir un reporte PDF del historial de movimientos con filtro por tipo y rango de fechas.

## 2. Datos del Repuesto

| Campo | Tipo | Notas |
|---|---|---|
| part_number | String (UNIQUE) | Identificador visible para el usuario |
| location | String | Ubicación física (ej. "Estante A3") |
| description | String | Descripción del producto |
| stock | Integer | Cantidad en existencia |
| purchase_cost | Float | Costo de compra (opcional) |
| sale_price | Float | Precio de venta |
| currency | String | 'Bs' o 'USD' |

## 3. Stack Tecnológico

- **Frontend:** React 19 + Vite 8 + JavaScript (JSX) + Sass Modules (`.module.scss`) + Ant Design v6 + Lucide React + React Virtuoso
- **Backend:** Python 3.10/3.11 (32-bit), SQLAlchemy 2.x (ORM), SQLite
- **Contenedor de Escritorio:** PyWebView
- **Reportes:** FPDF2

## 4. Arquitectura

Modelo **Híbrido Local**: PyWebView inyecta un objeto `window.pywebview.api` que expone métodos Python directamente al frontend React. No hay servidor HTTP externo.

```
┌─────────────────────────────────────────────────┐
│ PyWebView Window                                │
│  ┌────────────────┐   ┌──────────────────────┐  │
│  │  React (Vite)  │   │  Python (InventoryAPI) │  │
│  │  Dashboard.jsx │◄──┤  window.pywebview.api │  │
│  │  Modales       │   │  part_service.py      │  │
│  │  TableVirtuoso │   │  pdf_generator_fpdf   │  │
│  └────────────────┘   │  SQLite ←→ SQLAlchemy │  │
│                        └──────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## 5. Estructura del Repositorio

```
/
├── Docs/
│   ├── api-contract.md      # Contrato formal de API Bridge
│   ├── context.md           # Contexto general del proyecto
│   ├── gui.md               # Especificación UI/UX
│   └── technical.md         # Documentación técnica detallada
├── backend/
│   ├── main.py               # PyWebView entry + js_api
│   ├── requirements.txt
│   ├── api/
│   │   └── bridge.py         # InventoryAPI class
│   ├── database/
│   │   ├── __init__.py
│   │   ├── models.py         # SQLAlchemy: Part, Movement
│   │   ├── connection.py     # Engine, init_db, seed (15 partes)
│   │   └── inventory.db      # SQLite
│   └── services/
│       ├── __init__.py
│       ├── part_service.py   # CRUD + reportes
│       └── pdf_generator_fpdf.py
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.scss
│   │   ├── services/
│   │   │   └── api.js        # Async wrapper PyWebView + fallback
│   │   ├── context/
│   │   │   └── RouterContext.jsx
│   │   ├── components/
│   │   │   ├── Sidebar.jsx + .module.scss
│   │   │   ├── Dashboard.jsx + .module.scss
│   │   │   ├── ModalCarga.jsx + .module.scss
│   │   │   ├── ModalDescarga.jsx + .module.scss
│   │   │   ├── ModalReporte.jsx + .module.scss
│   │   │   ├── ModalPrecio.jsx + .module.scss
│   │   │   └── ModalAcerca.jsx + .module.scss
│   │   └── views/
│   └── dist/                  # Build producción
└── AGENTS.md
```

## 6. Base de Datos (SQLite + SQLAlchemy)

### Tabla `parts`
| Columna | Tipo | Notas |
|---|---|---|
| id | UUID (PK) | Interno, generado automáticamente |
| part_number | TEXT UNIQUE | Identificador del repuesto |
| location | TEXT | Ubicación física |
| description | TEXT | Descripción del producto |
| stock | INTEGER DEFAULT 0 | Cantidad en existencia |
| purchase_cost | FLOAT | Costo de compra |
| sale_price | FLOAT | Precio de venta |
| currency | TEXT | 'Bs' o 'USD' |
| created_at | DATETIME | Fecha de creación |

### Tabla `movements`
| Columna | Tipo | Notas |
|---|---|---|
| id | UUID (PK) | Interno |
| part_id | UUID (FK → parts.id) | Repuesto asociado |
| type | TEXT | 'IN' (entrada) o 'OUT' (salida) |
| quantity | INTEGER | Cantidad movida |
| date | DATETIME | Fecha y hora del movimiento |
| created_at | DATETIME | Fecha de creación del registro |

## 7. Bridge API (window.pywebview.api)

| Método | Parámetros | Retorno |
|---|---|---|
| `get_app_info()` | — | `{name, version, developer, email, description}` |
| `get_inventory()` | — | `list[part]` |
| `search_part(part_number)` | `str` | `part` o `{error: ...}` |
| `load_entry(part_number, location, description, quantity)` | `str, str, str, int` | `part` actualizado |
| `unload_exit(part_number, quantity)` | `str, int` | `part` actualizado |
| `update_part_price(part_id, sale_price, currency)` | `str, float, str` | `part` actualizado |
| `get_movement_report()` | — | `list[movement]` |
| `get_movement_report_range(type_filter, date_from, date_to)` | `str, str?, str?` | `{movements, totals}` |
| `generate_report_pdf(report_type, date_from, date_to)` | `str, str?, str?` | `{success: ...}` |

## 8. Convenciones de Código

- Código fuente (variables, funciones, nombres de archivo, SQL) → **inglés**.
- Comentarios, documentación y textos de interfaz de usuario → **español**.
