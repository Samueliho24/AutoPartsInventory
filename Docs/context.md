# Contexto del Proyecto: AutoPartsInventory (Simplificado)

## 1. Descripción General
Aplicación de escritorio local y minimalista para el control rápido de entradas y salidas de repuestos automotrices. Corre en una sola computadora sin conexión a red.

### Funcionalidades Esenciales
- Cargar repuestos al inventario (Entradas / IN).
- Descargar repuestos del inventario (Salidas / OUT).
- Generar e imprimir un reporte PDF del historial de movimientos.

## 2. Datos del Repuesto (por diseño)
Por cada repuesto se almacenan exclusivamente:

- **part_number** (Número de parte) — identificador único visible para el usuario.
- **location** (Ubicación física, ej. "Estante A3").
- **description** (Descripción del producto).
- **stock** (Cantidad en existencia).

No se almacenan: precios, marcas, modelos de auto, categorías, stock mínimo, ni alertas.

## 3. Stack Tecnológico
- **Frontend:** React 19 + Vite 8 + JavaScript (JSX) + Sass Modules (`.module.scss`) + Ant Design v6 + Lucide React.
- **Backend:** Python 3.10/3.11 (32-bit), SQLAlchemy 2.x (ORM), SQLite.
- **Contenedor de Escritorio:** PyWebView.
- **Reportes:** FPDF2.

## 4. Arquitectura
Modelo **Híbrido Local**: PyWebView inyecta un objeto `window.pywebview.api` que expone métodos Python directamente al frontend React. No hay servidor HTTP externo.

## 5. Estructura del Repositorio
```
/
├── Docs/context.md
├── backend/
│   ├── main.py               # PyWebView entry + Api bridge
│   ├── requirements.txt
│   ├── .venv/
│   ├── database/
│   │   ├── __init__.py
│   │   ├── models.py         # SQLAlchemy: Part, Movement
│   │   ├── connection.py     # Engine, sesión, init_db, seed
│   │   └── inventory.db      # SQLite (generado)
│   └── services/
│       ├── __init__.py
│       ├── part_service.py   # Lógica de inventario
│       └── pdf_generator.py  # Generación de PDF (futuro)
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── src/
│   │   ├── main.jsx
│   │   ├── App.jsx
│   │   ├── index.scss
│   │   ├── context/RouterContext.jsx
│   │   ├── components/Sidebar.jsx + .module.scss
│   │   └── views/{Dashboard,Inventory,Movements,Reports}.jsx + .module.scss
│   └── dist/                  # Build de producción
└── AGENTS.md
```

## 6. Base de Datos (SQLite + SQLAlchemy)

### Tabla `parts`
| Columna | Tipo | Notas |
|---|---|---|
| id | UUID (PK) | Interno, no visible al usuario |
| part_number | TEXT UNIQUE | Identificador del repuesto para el usuario |
| location | TEXT | Ubicación física |
| description | TEXT | Descripción del producto |
| stock | INTEGER DEFAULT 0 | Cantidad en existencia |
| created_at | DATETIME | Fecha de creación del registro |

### Tabla `movements`
| Columna | Tipo | Notas |
|---|---|---|
| id | UUID (PK) | Interno, no visible al usuario |
| part_id | UUID (FK → parts.id) | Repuesto asociado |
| type | TEXT | 'IN' (entrada) o 'OUT' (salida) |
| quantity | INTEGER | Cantidad movida |
| date | DATETIME | Fecha y hora del movimiento |
| created_at | DATETIME | Fecha de creación del registro |

## 7. Convenciones de Código
- Código fuente (variables, funciones, nombres de archivo, SQL) → **inglés**.
- Comentarios, documentación y textos de interfaz de usuario → **español**.
