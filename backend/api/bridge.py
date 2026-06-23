import os
import sys
from services.part_service import (
    get_all_parts,
    search_part_by_number,
    register_movement,
    get_movement_report,
    update_price,
    get_movement_report_with_range,
)
from services.pdf_generator_fpdf import generate_report as generate_pdf_report


class InventoryAPI:

    def get_app_info(self):
        return {
            "name": "AutoPartsInventory",
            "version": "1.1.0",
            "developer": "Tu Nombre",
            "email": "contacto@ejemplo.com",
            "description": "Sistema de gestión de inventario para repuestos automotrices.",
        }

    def get_inventory(self) -> list:
        try:
            return get_all_parts()
        except Exception as e:
            return {"error": str(e)}

    def search_part(self, part_number: str):
        try:
            result = search_part_by_number(part_number)
            if result is None:
                return {"error": f"No se encontró el repuesto '{part_number}'."}
            return result
        except Exception as e:
            return {"error": str(e)}

    def load_entry(self, part_number: str, location: str, description: str, quantity: int):
        """Si existe el repuesto, suma stock. Si no, lo crea y registra IN."""
        try:
            existing = search_part_by_number(part_number)
            if existing:
                result = register_movement(existing["id"], "IN", quantity)
                if location:
                    from database.connection import get_session
                    from database.models import Part
                    session = get_session()
                    try:
                        part = session.query(Part).filter(Part.id == result["id"]).first()
                        if part:
                            part.location = location
                            if description:
                                part.description = description
                            session.commit()
                            result["location"] = part.location or ""
                            result["description"] = part.description or ""
                    finally:
                        session.close()
                return result
            else:
                from database.connection import get_session
                from database.models import Part
                import uuid
                from datetime import datetime
                session = get_session()
                try:
                    new_part = Part(
                        id=uuid.uuid4(),
                        part_number=part_number,
                        location=location or "",
                        description=description or "",
                        stock=quantity,
                        created_at=datetime.now(),
                    )
                    session.add(new_part)
                    session.flush()

                    from database.models import Movement
                    movement = Movement(
                        part_id=new_part.id,
                        type="IN",
                        quantity=quantity,
                        date=datetime.now(),
                    )
                    session.add(movement)
                    session.commit()

                    return {
                        "id": str(new_part.id),
                        "part_number": new_part.part_number,
                        "location": new_part.location or "",
                        "description": new_part.description or "",
                        "stock": new_part.stock,
                        "purchase_cost": new_part.purchase_cost,
                        "sale_price": new_part.sale_price,
                        "currency": new_part.currency or "",
                    }
                except Exception as e:
                    session.rollback()
                    return {"error": str(e)}
                finally:
                    session.close()
        except Exception as e:
            return {"error": str(e)}

    def unload_exit(self, part_number: str, quantity: int):
        """Busca por número de parte, valida stock y registra OUT."""
        try:
            existing = search_part_by_number(part_number)
            if existing is None:
                return {"error": f"No se encontró el repuesto '{part_number}'."}
            if existing["stock"] < quantity:
                return {"error": f"Stock insuficiente. Disponible: {existing['stock']}, solicitado: {quantity}."}
            return register_movement(existing["id"], "OUT", quantity)
        except Exception as e:
            return {"error": str(e)}

    def update_part_price(self, part_id: str, sale_price: float, currency: str):
        try:
            return update_price(part_id, sale_price, currency)
        except ValueError as e:
            return {"error": str(e)}
        except Exception as e:
            return {"error": f"Error inesperado: {e}"}

    def get_movement_report(self) -> list:
        try:
            return get_movement_report()
        except Exception as e:
            return {"error": str(e)}

    def get_movement_report_range(self, type_filter: str = "all", date_from: str = None, date_to: str = None) -> dict:
        try:
            return get_movement_report_with_range(type_filter, date_from, date_to)
        except Exception as e:
            return {"error": str(e)}

    def generate_report_pdf(self, report_type: str = "all", date_from: str = None, date_to: str = None) -> dict:
        try:
            return generate_pdf_report(report_type, date_from, date_to)
        except Exception as e:
            return {"error": f"No se pudo generar el reporte: {e}"}
