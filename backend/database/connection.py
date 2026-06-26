import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from database.models import Base, Part
from database.seed_data import get_seed_parts

if getattr(sys, "frozen", False):
    DB_DIR = os.path.join(os.environ["APPDATA"], "AutoPartsInventory")
    os.makedirs(DB_DIR, exist_ok=True)
else:
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

        session.add_all(get_seed_parts())
        session.commit()
        print("Datos de ejemplo (15 repuestos) insertados correctamente.")
    except Exception as e:
        session.rollback()
        print(f"Error al insertar datos de ejemplo: {e}")
    finally:
        session.close()
