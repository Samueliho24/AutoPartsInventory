<<<<<<< Updated upstream
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
=======
# Contexto del Proyecto: Spare Parts Inventory System (Local)

## 1. Descripción General
Este es un proyecto rápido para desarrollar una aplicación de escritorio local e intuitiva enfocada en la gestión de inventario para un negocio de venta de repuestos automotrices. El sistema correrá en una sola computadora.

### Requerimientos Clave
* Registrar entradas de mercancía (compras/ajustes).
* Registrar salidas de mercancía (ventas/devoluciones).
* Visualizar en tiempo real el stock disponible en un catálogo con búsquedas avanzadas.
* Alertas de inventario crítico (Stock Bajo).
* Generar reportes imprimibles en formato PDF.

---

## 2. Stack Tecnológico Seleccionado
* **Frontend:** React + HTML5 + Sass Modules (`.module.scss`) + JavaScript.
* **Backend y Lógica:** Python 3.10/3.11 (32-bits) (como servicio/puente local).
* **Contenedor de Escritorio:** PyWebView (reutiliza el motor de renderizado del S.O.).
* **Base de Datos:** SQLite (Integrada y local, guardada en un solo archivo `.db`).
* **Reportes:** FPDF2 o ReportLab (Módulos nativos de Python).

---

## 3. Arquitectura del Sistema
El software opera bajo un modelo **Híbrido Cliente-Servidor Local**:
1. **Capa de Presentación (React + SCSS):** Maneja la UI de forma moderna con estilos encapsulados por componente para evitar efectos colaterales.
2. **Capa del Puente (Bridge):** Objeto JavaScript nativo inyectado por PyWebView que expone las funciones de Python en el ámbito global de la ventana (`window.pywebview.api`).
3. **Capa de Lógica y Datos (Python + SQLite):** Recibe las llamadas del frontend, interactúa de forma directa con la base de datos local y maneja el sistema de archivos para exportar los PDFs.

---

## 4. Estructura de Carpetas Planificada
El repositorio mantendrá el entorno de Node.js y el de Python completamente aislados. Todo el código fuente está estrictamente escrito en inglés, mientras que los comentarios y textos de cara al usuario final están en español:

```text
/ (Raíz del repositorio)
├── Docs/                     # Documentación, diagramas y este archivo de contexto
│   └── contexto.md
├── backend/                  # Lógica del sistema en Python (Código en inglés, comentarios en español)
│   ├── main.py               # Punto de entrada de la aplicación y PyWebView
│   ├── database/
│   │   ├── connection.py     # Inicialización y queries SQL de SQLite
│   │   └── inventory.db      # Base de datos (generada automáticamente)
│   ├── services/
│   │   ├── product_service.py
│   │   └── pdf_generator.py
│   ├── .venv/                # Entorno virtual de Python de 32-bits (Excluido de Git)
│   └── requirements.txt      # Dependencias de Python de producción
└── frontend/                 # Interfaz gráfica en React (Código en inglés, textos en español)
    ├── package.json
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx           # Layout principal (Sidebar + Vistas)
    │   ├── index.scss        # Estilos y variables globales/reset de Sass
    │   ├── components/       # Componentes reusables con sus respectivos módulos Sass
    │   │   ├── Sidebar.jsx
    │   │   ├── Sidebar.module.scss
    │   │   ├── Table.jsx
    │   │   └── Table.module.scss
    │   └── views/            # Pantallas principales
    │       ├── Dashboard.jsx
    │       ├── Dashboard.module.scss
    │       ├── Inventory.jsx
    │       ├── Inventory.module.scss
    │       ├── Movements.jsx
    │       ├── Movements.module.scss
    │       ├── Reports.jsx
    │       └── Reports.module.scss
    └── dist/                 # Compilación de producción (HTML/CSS/JS estáticos)´´´


## 5. Plan de Desarrollo de 4 Días
Día 1: Backend Base y Persistencia (Python) -> Configuración de SQLite, creación de tablas (parts, movements) y lógica de servicios.

Día 2: Frontend en React (Maquetado SCSS) -> Definición de variables globales CSS/Sass y maquetado de la UI estructurada (Dashboard, Catálogo con filtros y formularios).

Día 3: Integración del Puente (React <-> Python) -> Conexión de los eventos de la UI con la API expuesta por PyWebView y desarrollo del módulo de reportes PDF.

Día 4: Pruebas locales y Empaquetado Final -> Compilación del frontend (npm run build), enlace del script ejecutable y congelado con pyinstaller (arquitectura de 32-bits).


>>>>>>> Stashed changes
