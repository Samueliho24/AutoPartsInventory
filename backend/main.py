import os
import sys
import webview
from database.connection import init_db, seed_sample_data
from services.part_service import (
    get_all_parts,
    search_part_by_number,
    register_movement,
    get_movement_report,
)

# Determinar la ruta base (funciona tanto en desarrollo como empaquetado con PyInstaller)
if getattr(sys, "frozen", False):
    # Ejecutándose como ejecutable de PyInstaller
    BASE_DIR = sys._MEIPASS
else:
    # Entorno de desarrollo
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Ruta al archivo HTML compilado por Vite
FRONTEND_DIST = os.path.join(BASE_DIR, "..", "frontend", "dist")
INDEX_HTML = os.path.join(FRONTEND_DIST, "index.html")


class Api:
    """
    Clase puente expuesta al frontend mediante window.pywebview.api.
    Todos los métodos aquí son llamables desde JavaScript.
    """

    def get_app_info(self):
        """Devuelve información básica de la aplicación."""
        return {
            "name": "AutoPartsInventory",
            "version": "1.0.0",
        }

    def get_all_parts(self) -> list:
        """Retorna todos los repuestos."""
        try:
            return get_all_parts()
        except Exception as e:
            return {"error": str(e)}

    def search_part_by_number(self, part_number: str):
        """Busca un repuesto por número de parte."""
        try:
            result = search_part_by_number(part_number)
            if result is None:
                return {"error": f"No se encontró el repuesto '{part_number}'."}
            return result
        except Exception as e:
            return {"error": str(e)}

    def register_movement(self, part_id: str, type: str, quantity: int):
        """Registra una entrada (IN) o salida (OUT) de inventario."""
        try:
            return register_movement(part_id, type, quantity)
        except ValueError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"Error inesperado: {e}"}

    def get_movement_report(self) -> list:
        """Retorna el historial de movimientos para el reporte."""
        try:
            return get_movement_report()
        except Exception as e:
            return {"error": str(e)}


def main():
    """Punto de entrada principal de la aplicación de escritorio."""

    # Inicializar base de datos y datos de ejemplo
    print("Inicializando base de datos...")
    init_db()
    seed_sample_data()

    # Verificar que el frontend esté compilado antes de lanzar la ventana
    if not os.path.isfile(INDEX_HTML):
        print(
            "ERROR: No se encontró el frontend compilado en:",
            INDEX_HTML,
        )
        print("Ejecuta 'npm run build' dentro de la carpeta 'frontend/' primero.")
        sys.exit(1)

    # Crear la ventana de la aplicación con PyWebView
    window = webview.create_window(
        title="AutoPartsInventory - Gestión de Repuestos",
        url=INDEX_HTML,
        width=1280,
        height=800,
        min_size=(1024, 600),
        resizable=True,
        text_select=True,
    )

    # Iniciar el bucle de eventos con la API expuesta
    webview.start(
        debug=True,
        http_server=True,
        private_mode=False,
    )


if __name__ == "__main__":
    main()
