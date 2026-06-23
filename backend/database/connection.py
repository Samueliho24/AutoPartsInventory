import os
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from database.models import Base, Part

# Ruta absoluta de la base de datos SQLite local
DB_DIR = os.path.dirname(os.path.abspath(__file__))
DB_PATH = os.path.join(DB_DIR, "inventory.db")

# Motor y sesión global de SQLAlchemy
engine = create_engine(f"sqlite:///{DB_PATH}", echo=False)


def get_session() -> Session:
    """Retorna una nueva sesión de base de datos."""
    return Session(engine)


def init_db() -> None:
    """Crea las tablas si no existen."""
    Base.metadata.create_all(engine)


def seed_sample_data() -> None:
    """Inserta 15 repuestos realistas si la tabla está vacía."""
    session = get_session()
    try:
        if session.query(Part).first() is not None:
            return

        samples = [
            # Filtros y Mantenimiento
            Part(part_number="90915-YZZN1",  location="Estante A1", description="Filtro de aceite original Toyota (Corolla, Yaris, Terios)", stock=20),
            Part(part_number="15400-PLM-A02", location="Estante A1", description="Filtro de aceite original Honda (Civic, Accord)", stock=18),
            Part(part_number="FL-820S",       location="Estante A2", description="Filtro de aceite Motorcraft Ford (F-150, Explorer)", stock=15),
            Part(part_number="A2462C",        location="Estante A3", description="Filtro de aire de motor ACDelco GM (línea profesional)", stock=12),
            # Frenos y Suspensión
            Part(part_number="04465-0K290",   location="Estante B1", description="Pastillas de freno delanteras Toyota (Hilux, Fortuner)", stock=25),
            Part(part_number="7L2Z-1104-A",   location="Estante B2", description="Cubo de rueda delantero Ford (Explorer 2006-2010)", stock=8),
            Part(part_number="513288",        location="Estante B3", description="Rodamiento de rueda trasera SKF (Chevrolet)", stock=30),
            Part(part_number="54611-3X000",   location="Estante B4", description="Amortiguador delantero Hyundai (Elantra)", stock=10),
            # Encendido y Sistema Eléctrico
            Part(part_number="12622441",      location="Estante C1", description="Bobina de encendido GM Genuine (Tahoe, Silverado)", stock=14),
            Part(part_number="ILKAR7B11",     location="Estante C2", description="Bujía de iridio NGK (Subaru, Toyota, Nissan)", stock=60),
            Part(part_number="30520-R40-007", location="Estante C1", description="Bobina de encendido Honda (K24 Accord, CR-V)", stock=9),
            Part(part_number="7701048390",    location="Estante C3", description="Bobina de encendido Renault (Clio, Logan, Megane)", stock=11),
            # Bandas, Correas y Enfriamiento
            Part(part_number="K060840",       location="Estante D1", description="Correa de accesorios Gates serpentina 6 canales", stock=22),
            Part(part_number="16100-39426",   location="Estante D2", description="Bomba de agua original Toyota (4Runner, Tacoma)", stock=7),
            Part(part_number="5070",          location="Estante D3", description="Termostato de motor Stant (Ford, GM)", stock=35),
        ]
        session.add_all(samples)
        session.commit()
        print("Datos de ejemplo (15 repuestos) insertados correctamente.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar datos de ejemplo: {e}")
    finally:
        session.close()
