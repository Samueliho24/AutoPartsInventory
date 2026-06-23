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
from services.pdf_generator_fpdf import generate_report as generate_pdf_report

if getattr(sys, "frozen", False):
    BASE_DIR = sys._MEIPASS
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))

FRONTEND_DIST = os.path.join(BASE_DIR, "..", "frontend", "dist")
INDEX_HTML = os.path.join(FRONTEND_DIST, "index.html")


class Api:

    def get_app_info(self):
        return {
            "name": "AutoPartsInventory",
            "version": "1.0.0",
        }

    def get_all_parts(self) -> list:
        try:
            return get_all_parts()
        except Exception as e:
            return {"error": str(e)}

    def search_part_by_number(self, part_number: str):
        try:
            result = search_part_by_number(part_number)
            if result is None:
                return {"error": f"No se encontr\u00f3 el repuesto '{part_number}'."}
            return result
        except Exception as e:
            return {"error": str(e)}

    def register_movement(self, part_id: str, type: str, quantity: int):
        try:
            return register_movement(part_id, type, quantity)
        except ValueError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"Error inesperado: {e}"}

    def get_movement_report(self) -> list:
        try:
            return get_movement_report()
        except Exception as e:
            return {"error": str(e)}

    def generate_report(self, report_type: str = "all") -> dict:
        try:
            return generate_pdf_report(report_type)
        except Exception as e:
            return {"error": f"No se pudo generar el reporte: {e}"}


def main():
    print("Inicializando base de datos...")
    init_db()
    seed_sample_data()

    if not os.path.isfile(INDEX_HTML):
        print(
            "ERROR: No se encontr\u00f3 el frontend compilado en:",
            INDEX_HTML,
        )
        print("Ejecuta 'npm run build' dentro de la carpeta 'frontend/' primero.")
        sys.exit(1)

    window = webview.create_window(
        title="AutoPartsInventory - Gesti\u00f3n de Repuestos",
        url=INDEX_HTML,
        width=1280,
        height=800,
        min_size=(1024, 600),
        resizable=True,
        text_select=True,
    )

    webview.start(
        debug=True,
        http_server=True,
        private_mode=False,
    )


if __name__ == "__main__":
    main()
