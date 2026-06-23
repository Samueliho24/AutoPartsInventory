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
    """Inserta 3 repuestos de ejemplo si la tabla está vacía."""
    session = get_session()
    try:
        if session.query(Part).first() is not None:
<<<<<<< Updated upstream
            # Ya hay datos, no seedear
=======
>>>>>>> Stashed changes
            return

        samples = [
            Part(
                part_number="BRAKE-PAD-001",
                location="Estante A3",
                description="Pastillas de freno delanteras",
                stock=10,
            ),
            Part(
                part_number="OIL-FILTER-101",
                location="Estante B1",
                description="Filtro de aceite estándar",
                stock=25,
            ),
            Part(
                part_number="SPARK-PLUG-X2",
                location="Estante C2",
                description="Bujía de encendido",
                stock=50,
            ),
        ]
        session.add_all(samples)
        session.commit()
        print("Datos de ejemplo insertados correctamente.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar datos de ejemplo: {e}")
    finally:
        session.close()
