import uuid
from datetime import datetime
from database.connection import get_session
from database.models import Part, Movement


def get_all_parts() -> list[dict]:
    """Retorna todos los repuestos con sus 4 datos básicos."""
    session = get_session()
    try:
        parts = session.query(Part).order_by(Part.part_number).all()
        return [
            {
                "id": str(p.id),
                "part_number": p.part_number,
                "location": p.location or "",
                "description": p.description or "",
                "stock": p.stock,
            }
            for p in parts
        ]
    finally:
        session.close()


def search_part_by_number(part_number: str) -> dict | None:
    """Busca un repuesto por su número de parte."""
    session = get_session()
    try:
        part = (
            session.query(Part)
            .filter(Part.part_number == part_number)
            .first()
        )
        if part is None:
            return None
        return {
            "id": str(part.id),
            "part_number": part.part_number,
            "location": part.location or "",
            "description": part.description or "",
            "stock": part.stock,
        }
    finally:
        session.close()


def register_movement(part_id: str, type: str, quantity: int) -> dict:
    """
    Registra una entrada (IN) o salida (OUT) de inventario.
    En IN suma al stock. En OUT resta y valida que no quede negativo.
    Retorna el repuesto actualizado.
    """
    if type not in ("IN", "OUT"):
        raise ValueError("El tipo de movimiento debe ser 'IN' o 'OUT'.")
    if quantity <= 0:
        raise ValueError("La cantidad debe ser mayor a cero.")

    try:
        part_uuid = uuid.UUID(part_id)
    except ValueError:
        raise ValueError("El ID del repuesto no es válido.")

    session = get_session()
    try:
        part = session.query(Part).filter(Part.id == part_uuid).first()
        if part is None:
            raise ValueError(f"No se encontró un repuesto con id {part_id}.")

        if type == "OUT" and part.stock < quantity:
            raise ValueError(
                f"Stock insuficiente. Disponible: {part.stock}, solicitado: {quantity}."
            )

        # Actualizar stock
        if type == "IN":
            part.stock += quantity
        else:
            part.stock -= quantity

        # Crear registro de movimiento
        movement = Movement(
            part_id=part.id,
            type=type,
            quantity=quantity,
            date=datetime.now(),
        )
        session.add(movement)
        session.commit()

        return {
            "id": str(part.id),
            "part_number": part.part_number,
            "location": part.location or "",
            "description": part.description or "",
            "stock": part.stock,
        }
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_movement_report() -> list[dict]:
    """
    Retorna el historial completo de movimientos con datos del repuesto:
    fecha, número de parte, descripción, tipo y cantidad.
    """
    session = get_session()
    try:
        rows = (
            session.query(Movement, Part)
            .join(Part, Movement.part_id == Part.id)
            .order_by(Movement.date.desc())
            .all()
        )
        return [
            {
                "date": m.date.strftime("%Y-%m-%d %H:%M:%S") if m.date else "",
                "part_number": p.part_number,
                "description": p.description or "",
                "type": m.type,
                "quantity": m.quantity,
            }
            for m, p in rows
        ]
    finally:
        session.close()
