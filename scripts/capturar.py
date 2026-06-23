"""
Script para capturar screenshots del sistema AutoPartsInventory.
Uso: python scripts/capturar.py [antes|despues]
"""

import sys
import os
import time
import subprocess
from PIL import ImageGrab

SCREENSHOTS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'screenshots')

VIEWS = [
    ('dashboard', 'Dashboard - Vista principal'),
    ('carga', 'ModalCarga - Entrada de inventario'),
    ('descarga', 'ModalDescarga - Salida de inventario'),
    ('reporte', 'ModalReporte - Generar reporte'),
]

def ensure_dir():
    if not os.path.exists(SCREENSHOTS_DIR):
        os.makedirs(SCREENSHOTS_DIR)

def capture(filename):
    path = os.path.join(SCREENSHOTS_DIR, filename)
    screenshot = ImageGrab.grab()
    screenshot.save(path)
    print(f"  Capturado: {filename}")
    return path

def main():
    prefix = sys.argv[1] if len(sys.argv) > 1 else 'antes'
    ensure_dir()

    print(f"=== Capturando screenshots ({prefix}) ===")
    print()
    print("La aplicacion se abrira en 3 segundos...")
    print("Por favor, espera a que cargue completamente.")
    print()

    # Tomar screenshot del dashboard primero
    input("Presiona Enter para capturar el DASHBOARD...")
    capture(f"{prefix}-01-dashboard.png")

    print()
    print("Ahora abre el Modal de CARGA (haz clic en el boton verde 'Cargar')")
    input("Presiona Enter cuando el modal de carga este visible...")
    capture(f"{prefix}-02-carga.png")
    print("Cierra el modal de carga antes de continuar.")

    print()
    print("Ahora abre el Modal de DESCARGA (haz clic en el boton rojo 'Descargar')")
    input("Presiona Enter cuando el modal de descarga este visible...")
    capture(f"{prefix}-03-descarga.png")
    print("Cierra el modal de descarga antes de continuar.")

    print()
    print("Ahora abre el Modal de REPORTE (haz clic en 'Imprimir Reporte')")
    input("Presiona Enter cuando el modal de reporte este visible...")
    capture(f"{prefix}-04-reporte.png")
    print("Cierra el modal de reporte.")

    print()
    print(f"Todas las capturas ({prefix}) guardadas en: {SCREENSHOTS_DIR}")

if __name__ == '__main__':
    main()
