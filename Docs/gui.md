# Especificación de Interfaz de Usuario (UI/UX) - AutoPartsInventory

## Paleta de Colores & Identidad

| Rol | Color | Uso |
|---|---|---|
| Fondo principal | `#f1f5f9` | Body y contenedores generales |
| Tarjetas | `#ffffff` | Tabla, modales, secciones |
| Input / campo | `#f8fafc` | Inputs, textareas, búsqueda |
| Borde | `#e2e8f0` | Bordes suaves de contenedores |
| Texto principal | `#0f172a` | Títulos, contenido principal |
| Texto secundario | `#475569` | Subtítulos, placeholders |
| Texto tenue | `#94a3b8` | Metadatos, etiquetas secundarias |
| Azul acento | `#5b8def` / `#4a7ad4` | Botón imprimir, acerca de, header icon |
| Verde éxito | `#34c759` / `#2db14e` | Botón Cargar Entrada, badge stock alto |
| Rojo peligro | `#ff6b6b` / `#e55a5a` | Botón Descargar Salida, alertas, badge stock bajo |
| Amarillo warning | `#f5a623` | Badge stock medio |

## Tipografía

- **Familia:** Inter, fallback `Segoe UI`, `Roboto`, sans-serif
- **Tamaños:** Título 1.35rem, cuerpo tabla 0.9rem, metadatos 0.75rem–0.8rem
- **Pesos:** 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

## Bordes y Sombras

- `border-radius: 8px` — consistente en tarjetas, inputs, botones, modales
- Sombras suaves `box-shadow: 0 4px 24px rgba(0,0,0,0.08)` para modales
- Transiciones de 0.2s en hovers y estados

## Árbol de Componentes

```
App
└── Dashboard                             # Ventana principal única
    ├── Header                            # Título + botones Imprimir / Acerca de
    ├── Controls                          # Barra búsqueda + botones Carga/Descarga
    │   ├── SearchInput                   # Filtro local por part_number
    │   ├── BtnCarga                      # [+ Cargar Entrada] verde
    │   └── BtnDescarga                   # [- Descargar Salida] rojo
    ├── TableVirtuoso                     # Tabla virtualizada con scroll infinito
    │   ├── Header row (sticky)           # N° Parte | Ubicación | Descripción | Stock | Precio | Moneda | Acción
    │   ├── Part rows (virtualizadas)     # Solo se renderizan ~55 filas visibles
    │   ├── Action buttons               # [+][-][✏️] por fila
    │   └── StockBadge                   # Badge numérico estilizado por nivel
    ├── ModalCarga                        # (overlay condicional, verde)
    │   └── FormCarga                     # part_number, location, description, quantity
    ├── ModalDescarga                     # (overlay condicional, rojo)
    │   └── FormDescarga                  # part_number (autocomplete), quantity + alerta stock
    ├── ModalReporte                      # (overlay condicional, azul)
    │   └── FormReporte                   # Tipo (All/IN/OUT) + rango fechas
    ├── ModalPrecio                       # (overlay condicional, azul)
    │   └── FormPrecio                    # sale_price + currency toggle (Bs/USD)
    ├── ModalAcerca                       # (overlay condicional, azul)
    │   └── Info app + desarrollador
    └── Footer                            # Copyright + versión
```

## Comportamiento de Modales

- Abren con transición `opacity 0.2s` + `transform 0.2s`
- Backdrop con fondo `rgba(0,0,0,0.3)` y `backdrop-filter: blur(4px)`
- Cierre al hacer clic en `[Cancelar]` o en el backdrop
- `[Confirmar Carga]` / `[Confirmar Descarga]` / `[Guardar Precio]` / `[Generar Reporte]` — llaman a `window.pywebview.api.*`

## Validaciones

### ModalDescarga
- Input `Cantidad a Retirar` con `min=1`
- Si `cantidad > stockDisponible` del repuesto seleccionado:
  - Aparece alerta roja con ícono de advertencia
  - Botón `[Confirmar Descarga]` se deshabilita visualmente
- Validación evaluada en tiempo real con `onChange`

### ModalCarga
- Si el `part_number` existe → suma stock + actualiza ubicación/descripción
- Si no existe → crea nuevo repuesto

### ModalPrecio
- `sale_price` debe ser >= 0
- `currency` toggle obligatorio (Bs/USD)
- Preview del precio formateado en vivo

### Tabla (TableVirtuoso)
- Búsqueda filtra en tiempo real por `part_number`
- Scroll infinito virtualizado (solo renderiza filas visibles)
- Stock <= 5: badge rojo (bajo)
- Stock 6-20: badge amarillo (medio)
- Stock > 20: badge verde (alto)
