import os
import sys
import webview
from database.connection import init_db, seed_sample_data
from api.bridge import InventoryAPI

if getattr(sys, "frozen", False):
    BASE_DIR = sys._MEIPASS
    FRONTEND_DIST = os.path.join(BASE_DIR, "frontend", "dist")
else:
    BASE_DIR = os.path.dirname(os.path.abspath(__file__))
    FRONTEND_DIST = os.path.join(BASE_DIR, "..", "frontend", "dist")

INDEX_HTML = os.path.join(FRONTEND_DIST, "index.html")


def main():
    dev_mode = "--dev" in sys.argv

    if dev_mode:
        print("Modo desarrollo: usando Vite dev server en http://localhost:5173")
    else:
        print("Modo producción: usando frontend compilado en dist/")

    print("Inicializando base de datos...")
    init_db()
    seed_sample_data()

    if not dev_mode and not os.path.isfile(INDEX_HTML):
        print(
            "ERROR: No se encontró el frontend compilado en:",
            INDEX_HTML,
        )
        print("Ejecuta 'npm run build' dentro de la carpeta 'frontend/' primero.")
        print("O usa '--dev' para apuntar al servidor de Vite.")
        sys.exit(1)

    api = InventoryAPI()

    window = webview.create_window(
        title="AutoPartsInventory - Gestión de Repuestos",
        url="http://localhost:5173" if dev_mode else FRONTEND_DIST,
        js_api=api,
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
