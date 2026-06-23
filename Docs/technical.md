# Documentación Técnica — AutoPartsInventory

## 1. Arquitectura General

Aplicación de escritorio local bajo el modelo **Híbrido Cliente-Servidor Local**:

```
┌─────────────────────────────────────────────────────────────┐
│ PyWebView Window (Edge WebView2)                            │
│                                                             │
│  ┌─────────────────────┐    ┌───────────────────────────┐   │
│  │  Frontend (React)   │    │  Backend (Python)          │   │
│  │                     │    │                            │   │
│  │  Dashboard.jsx      │◄──►│  InventoryAPI (bridge)    │   │
│  │  Modales (5)        │ JS │  part_service.py           │   │
│  │  TableVirtuoso      │    │  pdf_generator_fpdf.py     │   │
│  │  services/api.js    │    │  SQLAlchemy ORM            │   │
│  └─────────────────────┘    └──────┬────────────────────┘   │
│                                    │                        │
│                           ┌────────▼────────┐               │
│                           │  SQLite         │               │
│                           │  inventory.db   │               │
│                           └─────────────────┘               │
└─────────────────────────────────────────────────────────────┘
```

### Capas

| Capa | Tecnología | Responsabilidad |
|---|---|---|
| Presentación | React 19 + Vite 8 + Sass Modules | UI, estado local, virtual scrolling |
| Bridge | PyWebView (`js_api`) | Comunicación JS ↔ Python serializada en JSON |
| Lógica de negocio | Python 3.10/3.11 | CRUD inventario, validaciones, generación PDF |
| Persistencia | SQLite + SQLAlchemy 2.x | Almacenamiento local sin servidor |

---

## 2. Estructura del Proyecto

```
/
├── Docs/
│   ├── api-contract.md           ← Contrato de API Bridge
│   ├── context.md                ← Contexto general del proyecto
│   ├── gui.md                    ← Especificación UI/UX
│   └── technical.md              ← Este archivo
│
├── backend/
│   ├── main.py                   # Entry point: init DB, seed, lanza PyWebView
│   ├── requirements.txt          # Dependencias Python
│   ├── api/
│   │   └── bridge.py             # InventoryAPI — clase expuesta como js_api
│   ├── database/
│   │   ├── __init__.py
│   │   ├── models.py             # SQLAlchemy: Part, Movement (UUID PKs)
│   │   ├── connection.py         # Engine, init_db(), seed_sample_data()
│   │   └── inventory.db          # SQLite (generado automáticamente)
│   └── services/
│       ├── __init__.py
│       ├── part_service.py       # CRUD: get_all, search, register, update_price, report
│       └── pdf_generator_fpdf.py # Generación de PDF con FPDF2
│
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx              # Entry point React
│   │   ├── App.jsx               # Renderiza <Dashboard />
│   │   ├── index.scss            # Variables CSS globales, reset, scrollbar
│   │   ├── services/
│   │   │   └── api.js            # Wrapper async con detección PyWebView + fallback dev
│   │   ├── context/
│   │   │   └── RouterContext.jsx # Reservado para uso futuro
│   │   ├── components/
│   │   │   ├── Dashboard.jsx + .module.scss    # Ventana principal
│   │   │   ├── Sidebar.jsx + .module.scss      # Inactivo (reservado)
│   │   │   ├── ModalCarga.jsx + .module.scss    # Entrada IN (verde)
│   │   │   ├── ModalDescarga.jsx + .module.scss # Salida OUT (rojo)
│   │   │   ├── ModalReporte.jsx + .module.scss  # Reporte + fechas (azul)
│   │   │   ├── ModalPrecio.jsx + .module.scss   # Editar precio + moneda
│   │   │   └── ModalAcerca.jsx + .module.scss   # Info app + desarrollador
│   │   └── views/
│   └── dist/                     # Build producción (gitignored)
│
├── AGENTS.md                     # Instrucciones para asistentes IA
└── README.md
```

---

## 3. Base de Datos

### Esquema Entidad-Relación

```
┌─────────────────────────────────┐
│            parts                │
├─────────────────────────────────┤
│ id              UUID (PK)       │◄──────────────┐
│ part_number     TEXT (UNIQUE)   │               │
│ location        TEXT            │               │
│ description     TEXT            │               │
│ stock           INTEGER (def 0) │               │
│ purchase_cost   FLOAT           │               │
│ sale_price      FLOAT           │               │
│ currency        TEXT            │               │
│ created_at      DATETIME        │               │
└─────────────────────────────────┘               │
                                                  │
┌─────────────────────────────────┐               │
│          movements              │               │
├─────────────────────────────────┤               │
│ id              UUID (PK)       │               │
│ part_id         UUID (FK) ──────┘               │
│ type            TEXT ('IN'|'OUT')               │
│ quantity        INTEGER                         │
│ date            DATETIME                        │
│ created_at      DATETIME                        │
└─────────────────────────────────┘               │
```

### Detalle de Columnas

#### `parts`

| Columna | Tipo SQL | SQLAlchemy | Notas |
|---|---|---|---|
| id | TEXT (UUID) | Uuid, PK | Generado con `uuid.uuid4()` |
| part_number | TEXT | String, UNIQUE | Identificador visible para el usuario |
| location | TEXT | String, nullable | Ubicación física |
| description | TEXT | String, nullable | Descripción del producto |
| stock | INTEGER | Integer, default=0 | Cantidad en existencia |
| purchase_cost | REAL | Float, nullable | Costo de compra |
| sale_price | REAL | Float, nullable | Precio de venta |
| currency | TEXT | String, nullable | "Bs" o "USD" |
| created_at | DATETIME | DateTime | `datetime.now` al crear |

#### `movements`

| Columna | Tipo SQL | SQLAlchemy | Notas |
|---|---|---|---|
| id | TEXT (UUID) | Uuid, PK | Generado con `uuid.uuid4()` |
| part_id | TEXT (UUID) | ForeignKey("parts.id") | Relación N:1 con parts |
| type | TEXT | String | "IN" (entrada) o "OUT" (salida) |
| quantity | INTEGER | Integer | Cantidad movida |
| date | DATETIME | DateTime | Fecha/hora del movimiento |
| created_at | DATETIME | DateTime | `datetime.now` al crear |

### Seed Data

`seed_sample_data()` inserta 15 repuestos realistas con precios mezclados:
- **11 en USD** (precios entre $11.50 y $79.00)
- **4 en Bs** (precios entre Bs. 180 y Bs. 420)
- Ubicados en estantes A1–D3

---

## 4. Backend (Python)

### 4.1 `models.py` — SQLAlchemy ORM

Define `Base` (declarative base), `Part` (8 columnas + relationship a movements), `Movement` (6 columnas + relationship a part). Usa `uuid.UUID` como tipo de primary key con `default=uuid.uuid4`. La relación `Part.movements` usa `cascade="all, delete-orphan"`.

### 4.2 `connection.py` — Engine y Sesión

- `engine = create_engine("sqlite:///inventory.db")`
- `get_session()` retorna `Session(engine)`
- `init_db()` llama a `Base.metadata.create_all(engine)`
- `seed_sample_data()` inserta 15 partes si la tabla está vacía

### 4.3 `part_service.py` — Lógica de Negocio

| Función | Descripción |
|---|---|
| `get_all_parts()` | SELECT * FROM parts ORDER BY part_number |
| `search_part_by_number(pn)` | SELECT WHERE part_number = ? |
| `register_movement(part_id, type, qty)` | UPDATE stock + INSERT movement en transacción |
| `get_movement_report()` | SELECT movements JOIN parts ORDER BY date DESC |
| `update_price(part_id, sale_price, currency)` | UPDATE sale_price + currency |
| `get_movement_report_with_range(type, from, to)` | LIKE report pero con filtros WHERE dinámicos + totales |

### 4.4 `pdf_generator_fpdf.py` — Reportes PDF

Usa FPDF2 para generar PDF con:
- Encabezado con título + fecha de generación + rango seleccionado
- Tabla con columnas: Fecha, N° Parte, Descripción, Tipo (color verde/rojo), Cantidad
- Filas alternadas con color de fondo
- Resumen de totales al final (Total IN, Total OUT, Ganancia/Perdida Neta)
- Abre el PDF automáticamente con `webbrowser.open()`

### 4.5 `api/bridge.py` — InventoryAPI

Clase Python cuyos métodos públicos se exponen al frontend via `js_api`. Cada método captura excepciones y retorna `{"error": str(e)}` en caso de error.

### 4.6 `main.py` — Entry Point

1. Llama a `init_db()` y `seed_sample_data()`
2. Verifica que `frontend/dist/index.html` exista
3. Crea instancia de `InventoryAPI`
4. Llama a `webview.create_window(url=INDEX_HTML, js_api=api, ...)`
5. Inicia el loop de PyWebView

---

## 5. Frontend (React)

### 5.1 Árbol de Componentes

```
main.jsx
└── App.jsx
    └── Dashboard.jsx
        ├── Header
        │   ├── Título + icono Package
        │   ├── [Acerca de]       → ModalAcerca
        │   └── [Imprimir Reporte] → ModalReporte
        ├── Controls
        │   ├── SearchInput (búsqueda local por part_number)
        │   ├── [Cargar Entrada]  → ModalCarga
        │   └── [Descargar Salida] → ModalDescarga
        ├── TableVirtuoso
        │   ├── FixedHeader (7 columnas)
        │   ├── VirtualRows (solo ~55 filas en DOM)
        │   └── Acciones por fila: [+][-][✏️]
        └── Footer
            ├── © Copyright
            └── Versión
```

### 5.2 `services/api.js` — Wrapper de Comunicación

Cada función exportada:
1. Detecta `window.pywebview?.api`
2. Si existe → llama al método real
3. Si no existe (dev mode) → retorna datos mock de 15 partes
4. Verifica `data.error` y lanza `Error` si hay

### 5.3 Modales

| Modal | Disparador | Acción | Refresca |
|---|---|---|---|
| ModalCarga | Botón [+ Cargar] | `loadEntry()` → crea o suma stock | `refreshInventory()` |
| ModalDescarga | Botón [- Descargar] | `unloadExit()` → valida stock, resta | `refreshInventory()` |
| ModalReporte | Botón [Imprimir] | `generateReportPdf(type, from, to)` | No (abre PDF) |
| ModalPrecio | Botón [✏️] por fila | `updatePartPrice(id, price, cur)` | Estado local (setParts) |
| ModalAcerca | Botón [Acerca de] | `getAppInfo()` → muestra datos | No |

### 5.4 TableVirtuoso

- Biblioteca: `react-virtuoso` v4
- Solo renderiza filas visibles + buffer (~55 nodos DOM)
- `fixedHeaderContent` — sticky `<thead>` con 7 columnas
- `itemContent` — cada fila con datos + botones de acción
- `components.Table` — asigna className `styles.table`
- `components.TableRow` — asigna className `styles.tableRow` con hover
- `components.EmptyPlaceholder` — mensaje cuando no hay resultados

### 5.5 Manejo de Estado

| Variable | Tipo | Hook |
|---|---|---|
| `parts` | `Part[]` | `useState([])` |
| `search` | string | `useState('')` |
| `loading` | boolean | `useState(true)` |
| `filteredParts` | `Part[]` | `useMemo` — filtra por `part_number` |
| `refreshInventory` | function | `useCallback` — llama a `getInventory()` |
| 5 estados de modales | boolean | `useState(false)` |
| `selectedPart` | Part \| null | `useState(null)` |

---

## 6. Flujo de Operaciones

### 6.1 Carga de Inventario

```
Usuario → click [Cargar Entrada]
  → openCarga(null)
  → ModalCarga se abre
  → Usuario llena: part_number, location, description, quantity
  → click [Confirmar Carga]
  → handleCargaConfirm()
    → loadEntry(partNumber, location, description, quantity)
      → window.pywebview.api.load_entry(...)
        → InventoryAPI.load_entry()
          → search_part_by_number(pn) ¿existe?
          ├── Sí → register_movement(id, "IN", qty)
          │         → Part.stock += quantity
          │         → INSERT Movement "IN"
          ├── No  → INSERT new Part
          │         → INSERT Movement "IN"
      ← Part actualizado
    → refreshInventory()
      → getInventory()
      → setParts(data)
  → ModalCarga se cierra
  → Tabla se actualiza
```

### 6.2 Descarga de Inventario

```
Usuario → click [- Descargar] en fila
  → openDescarga(part)
  → ModalDescarga se abre con part pre-seleccionado
  → Usuario escribe cantidad
  → Validación en tiempo real: ¿quantity > part.stock?
    → Sí: alerta roja + botón deshabilitado
    → No: botón habilitado
  → click [Confirmar Descarga]
  → handleDescargaConfirm()
    → unloadExit(partNumber, quantity)
      → window.pywebview.api.unload_exit(...)
        → InventoryAPI.unload_exit()
          → search_part_by_number(pn)
          → ¿stock >= quantity?
            ├── No → error "Stock insuficiente"
            ├── Sí → register_movement(id, "OUT", qty)
      ← Part actualizado (stock reducido)
    → refreshInventory()
```

### 6.3 Reporte PDF

```
Usuario → click [Imprimir Reporte]
  → ModalReporte se abre
  → Usuario selecciona: tipo (All/IN/OUT) + rango de fechas (opcional)
  → click [Generar Reporte]
  → handleGenerarReporte(type, dateFrom, dateTo)
    → generateReportPdf(type, dateFrom, dateTo)
      → window.pywebview.api.generate_report_pdf(...)
        → InventoryAPI.generate_report_pdf()
          → get_movement_report_with_range(type, from, to)
            → SELECT movements + parts WHERE ...
            → Calcula totales
          → FPDF genera PDF
          → webbrowser.open(tempfile)
      ← {success}
  → ModalReporte se cierra
  → PDF se abre en el navegador por defecto
```

---

## 7. Desarrollo

### Prerequisitos

- Windows 10 1803+ / Windows 11
- Python 3.10 o 3.11 (32-bit)
- Node.js 18+
- WebView2 Runtime (incluido en Windows 11)

### Setup Backend

```powershell
cd backend
.venv\Scripts\activate      # Activar entorno virtual
pip install -r requirements.txt
```

### Setup Frontend

```powershell
cd frontend
npm install
```

### Ejecutar en Desarrollo

```powershell
# Terminal 1: Frontend dev server
cd frontend
npm run dev

# Terminal 2: Backend (usando build de producción del frontend)
cd frontend
npm run build
cd ../backend
python main.py
```

### Build y Despliegue

```powershell
cd frontend
npm run build                # Genera dist/
cd ../backend
python main.py               # Inicia la app desktop
```

### Linting

```powershell
cd frontend
npm run lint
```

---

## 8. Convenciones

### Código
- **Variables, funciones, nombres de archivo, SQL → Inglés**
- **Comentarios, documentación, textos UI → Español**

### Estilos
- CSS custom properties en `:root` (ver `index.scss`)
- Paleta light: fondo `#f1f5f9`, tarjetas `#ffffff`, acento `#5b8def`
- Módulos Sass por componente (`*.module.scss`)
- Transiciones de 0.2s en hovers
- `border-radius: 8px` consistente

### Base de Datos
- UUID v4 como primary keys (nunca expuestos al usuario)
- `part_number` como identificador visible único
- Timestamps en todas las tablas (`created_at`)

### Manejo de Errores
- Backend: try/except en cada método del bridge, retorna `{"error": mensaje}`
- Frontend: `api.js` lanza Error si hay `data.error`
- Componentes: alert() para errores de usuario (por mejorar a futuro)

---

## 9. Dependencias

### Frontend (package.json)

| Paquete | Versión | Propósito |
|---|---|---|
| react | ^19.2.6 | UI framework |
| react-dom | ^19.2.6 | Renderizado DOM |
| antd | ^6.4.5 | Componentes UI (reservado) |
| lucide-react | ^1.21.0 | Iconos |
| react-virtuoso | ^4 | Virtual scrolling para tabla |
| sass | ^1.101.0 | Preprocesador CSS |
| vite | ^8.0.12 | Bundler / dev server |

### Backend (requirements.txt)

| Paquete | Propósito |
|---|---|
| pywebview | Contenedor de escritorio |
| sqlalchemy | ORM para SQLite |
| fpdf2 | Generación de PDF |
