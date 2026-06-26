import uuid
from datetime import datetime
from database.connection import get_session
from database.models import Part, Movement
from sqlalchemy import and_


def get_all_parts() -> list[dict]:
    """Retorna todos los repuestos con sus datos."""
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
                "purchase_cost": p.purchase_cost,
                "sale_price": p.sale_price,
                "currency": p.currency or "",
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
            "purchase_cost": part.purchase_cost,
            "sale_price": part.sale_price,
            "currency": part.currency or "",
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

        if type == "IN":
            part.stock += quantity
        else:
            part.stock -= quantity

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
            "purchase_cost": part.purchase_cost,
            "sale_price": part.sale_price,
            "currency": part.currency or "",
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


def update_price(part_id: str, sale_price: float, currency: str, purchase_cost: float = None) -> dict:
    """Actualiza el precio de venta, costo de compra y moneda de un repuesto."""
    try:
        part_uuid = uuid.UUID(part_id)
    except ValueError:
        raise ValueError("El ID del repuesto no es válido.")

    session = get_session()
    try:
        part = session.query(Part).filter(Part.id == part_uuid).first()
        if part is None:
            raise ValueError(f"No se encontró un repuesto con id {part_id}.")

        if sale_price is not None:
            part.sale_price = sale_price
        if purchase_cost is not None:
            part.purchase_cost = purchase_cost
        if currency:
            part.currency = currency

        session.commit()
        return {
            "id": str(part.id),
            "part_number": part.part_number,
            "location": part.location or "",
            "description": part.description or "",
            "stock": part.stock,
            "purchase_cost": part.purchase_cost,
            "sale_price": part.sale_price,
            "currency": part.currency or "",
        }
    except Exception:
        session.rollback()
        raise
    finally:
        session.close()


def get_movement_report_with_range(type_filter: str = "all", date_from: str = None, date_to: str = None) -> dict:
    """
    Retorna movimientos filtrados por tipo y rango de fechas, más totales.
    type_filter: 'all' | 'IN' | 'OUT'
    date_from/date_to: strings 'YYYY-MM-DD' o None (sin límite)
    """
    session = get_session()
    try:
        query = (
            session.query(Movement, Part)
            .join(Part, Movement.part_id == Part.id)
        )

        filters = []
        if type_filter in ("IN", "OUT"):
            filters.append(Movement.type == type_filter)
        if date_from:
            filters.append(Movement.date >= datetime.strptime(date_from, "%Y-%m-%d"))
        if date_to:
            filters.append(Movement.date <= datetime.strptime(date_to, "%Y-%m-%d") + __import__("datetime").timedelta(days=1))

        if filters:
            query = query.filter(and_(*filters))

        rows = query.order_by(Movement.date.desc()).all()

        movements = []
        total_in = 0
        total_out = 0

        for m, p in rows:
            movements.append({
                "date": m.date.strftime("%Y-%m-%d %H:%M:%S") if m.date else "",
                "part_number": p.part_number,
                "description": p.description or "",
                "type": m.type,
                "quantity": m.quantity,
            })
            if m.type == "IN":
                total_in += m.quantity
            elif m.type == "OUT":
                total_out += m.quantity

        return {
            "movements": movements,
            "totals": {
                "total_in": total_in,
                "total_out": total_out,
                "net": total_in - total_out,
            },
        }
    finally:
        session.close()
