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