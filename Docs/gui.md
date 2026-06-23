<<<<<<< Updated upstream
# Especificación de Interfaz de Usuario (UI/UX) - Inventario Minimalista

## 🎨 Paleta de Colores & Identidad (Estilo Industrial Moderno)
- **Fondo Principal (Background):** #0f172a (Slate Oscuro) o #f8fafc (Slate Claro Moderno).
- **Contenedores y Tarjetas:** #1e293b / #ffffff con sombreados sutiles (`box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1)`).
- **Acciones Positivas (Cargas / Entradas):** #10b981 (Esmeralda Vibrante - Éxito).
- **Acciones de Salida (Descargas / Retiros):** #ef4444 (Rojo Carmín - Alerta/Salida).
- **Acentos e Impresión:** #3b82f6 (Azul Eléctrico Corporativo).
- **Texto Principal:** #f1f5f9 / #0f172a.

## 📐 Ventanas y Modales Requeridos
1. **Ventana Principal (Dashboard Único):**
   - **Header:** Título del negocio, reloj digital en tiempo real y barra de búsqueda interactiva por `Part Number`.
   - **Métricas Rápidas:** 3 mini-tarjetas que resumen: Total de Repuestos Únicos, Stock Total en Almacén, Último Movimiento Realizado.
   - **Acciones Principales:** Dos botones prominentes con íconos: `[+ Cargar Entrada]` y `[- Descargar Salida]`. Un botón de acción secundaria: `[🖨️ Imprimir Reporte]`.
   - **Tabla Central de Alta Densidad:** Columnas perfectamente alineadas de: Número de Parte, Ubicación, Descripción, Cantidad Disponible. Las filas cambian de color sutilmente al pasar el mouse (hover effect).

2. **Modal de Carga (Entrada):**
   - Encabezado verde. Formulario limpio con validación en tiempo real. Al escribir el número de parte, si ya existe en la base de datos, autocompleta la descripción y ubicación bloqueando los campos, dejando libre solo el campo "Cantidad a Sumar". Si no existe, permite rellenar todo para registrarlo como nuevo.

3. **Modal de Descarga (Salida):**
   - Encabezado rojo. Campo de texto para número de parte. Al seleccionarlo, muestra en un texto de ayuda sutil el stock disponible actual. Campo numérico para la cantidad a retirar. Si la cantidad supera las existencias, el botón se bloquea y el campo se tiñe de rojo con el mensaje *"Stock insuficiente"*.
=======
# Especificación de Diseño — Control de Inventario Express

## Paleta de Colores

| Rol | Color | Uso |
|---|---|---|
| Fondo principal | `#0f172a` | Body y contenedores generales |
| Tarjetas | `#1e293b` | Tabla, modales, secciones |
| Input / campo | `#1a2332` | Inputs, textareas |
| Borde | `#2d3a50` | Bordes suaves de contenedores |
| Texto principal | `#f1f5f9` | Títulos, contenido principal |
| Texto secundario | `#94a3b8` | Subtítulos, placeholders |
| Texto tenue | `#64748b` | Metadatos, etiquetas secundarias |
| Azul acento | `#3b82f6` / `#2563eb` | Botón imprimir, acciones generales |
| Verde éxito | `#10b981` / `#059669` | Botón Cargar Entrada, badge stock alto |
| Rojo peligro | `#ef4444` / `#dc2626` | Botón Descargar Salida, alertas, badge stock bajo |
| Amarillo warning | `#f59e0b` | Badge stock medio |

## Tipografía

- **Familia:** Inter (Google Fonts), fallback `Segoe UI`, `Roboto`, sans-serif
- **Tamaños:** Título página 1.5rem, header 1.25rem, cuerpo 0.875rem–0.95rem, metadatos 0.75rem–0.8rem
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Bordes y Sombras

- `border-radius: 8px` — consistente en tarjetas, inputs, botones, modales
- Sombras suaves `box-shadow: 0 4px 24px rgba(0,0,0,0.3)` para modales
- Transiciones de 0.2s en hovers y estados

## Árbol de Componentes

```
App
└── Dashboard                             # Ventana principal única
    ├── Header                            # Título + botón Imprimir Reporte
    ├── Controls                          # Barra búsqueda + botones Carga/Descarga
    │   ├── SearchInput                   # Filtro local por part_number
    │   ├── BtnCarga                      # [+ Cargar Entrada] verde
    │   └── BtnDescarga                   # [- Descargar Salida] rojo
    ├── PartsTable                        # Tabla con encabezados y filas hover
    │   └── StockBadge                    # Badge numérico estilizado
    ├── ModalCarga                        # (overlay condicional)
    │   └── FormCarga                     # part_number, location, description, quantity
    └── ModalDescarga                     # (overlay condicional)
        └── FormDescarga                  # part_number (autocomplete mock), quantity
            └── AlertStock                # Alerta si cantidad > stock disponible
```

## Estructura de Archivos Frontend

```
frontend/src/
├── main.jsx                     # Entry point
├── index.scss                   # Variables globales, reset, scrollbar
├── App.jsx                      # Renderiza Dashboard
├── context/
│   └── RouterContext.jsx        # (Reservado para uso futuro)
├── components/
│   ├── Sidebar.jsx              # (Reservado para uso futuro)
│   ├── Sidebar.module.scss
│   ├── Dashboard.jsx            # Ventana principal
│   ├── Dashboard.module.scss
│   ├── ModalCarga.jsx           # Modal entrada (verde)
│   ├── ModalCarga.module.scss
│   ├── ModalDescarga.jsx        # Modal salida (rojo)
│   └── ModalDescarga.module.scss
```

## Comportamiento de Modales

- Abren con transición `opacity 0.2s` + `transform 0.2s`
- Backdrop con fondo `rgba(0,0,0,0.6)` y `backdrop-filter: blur(4px)`
- Cierre al hacer clic en `[Cancelar]` o en el backdrop
- `[Confirmar Carga]` / `[Confirmar Descarga]` — llaman a `window.pywebview.api.*` cuando exista

## Validación ModalDescarga

- Input `Cantidad a Retirar` con `min=1`
- Si `cantidad > stockDisponible` del parte seleccionado:
  - Aparece alerta roja: "⚠️ Error: La cantidad ingresada supera las existencias en el inventario"
  - Botón `[Confirmar Descarga]` se deshabilita visualmente
- La validación se evalúa en tiempo real con `onChange`
>>>>>>> Stashed changes
