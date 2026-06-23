import os
import tempfile
import webbrowser
from datetime import datetime

from fpdf import FPDF

from services.part_service import get_movement_report


DARK_BG = (241, 245, 249)
CARD_BG = (226, 232, 240)
WHITE_TEXT = (15, 23, 42)
SECONDARY_TEXT = (71, 85, 105)
GREEN = (52, 199, 89)
RED = (255, 107, 107)
LIGHT_ROW = (248, 250, 252)
BODY_TEXT = (51, 65, 85)
BORDER_LIGHT = (226, 232, 240)


class ReportPDF(FPDF):

    def header(self):
        self.set_fill_color(*DARK_BG)
        self.rect(0, 0, 210, 26, 'F')
        self.set_y(7)
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(*WHITE_TEXT)
        self.cell(0, 10, 'Reporte de Movimientos de Inventario', align='C')
        self.ln(22)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(*SECONDARY_TEXT)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', align='C')


def generate_report(report_type='all'):
    movements = get_movement_report()

    if report_type == 'all':
        filtered = movements
        title_suffix = 'Completo'
    elif report_type == 'IN':
        filtered = [m for m in movements if m['type'] == 'IN']
        title_suffix = 'Solo Entradas (IN)'
    elif report_type == 'OUT':
        filtered = [m for m in movements if m['type'] == 'OUT']
        title_suffix = 'Solo Salidas (OUT)'
    else:
        filtered = movements
        title_suffix = 'Completo'

    pdf = ReportPDF()
    pdf.alias_nb_pages()
    pdf.set_auto_page_break(auto=True, margin=20)
    pdf.add_page()

    pdf.set_font('Helvetica', '', 9)
    pdf.set_text_color(*SECONDARY_TEXT)
    pdf.cell(0, 6, f'Control de Inventarios  |  Reporte {title_suffix}', align='C')
    pdf.ln(4)
    pdf.cell(0, 6, f'Generado el {datetime.now().strftime("%d/%m/%Y %H:%M")}', align='C')
    pdf.ln(12)

    col_w = [34, 36, 66, 28, 26]
    headers = ['Fecha', 'N Parte', 'Descripcion', 'Tipo', 'Cantidad']

    pdf.set_fill_color(*CARD_BG)
    pdf.set_text_color(*WHITE_TEXT)
    pdf.set_font('Helvetica', 'B', 9)
    for i, h in enumerate(headers):
        pdf.cell(col_w[i], 10, h, border=0, align='C', fill=True)
    pdf.ln()

    pdf.set_font('Helvetica', '', 9)
    alt = False

    for m in filtered:
        tipo = m['type']
        tipo_label = 'Entrada' if tipo == 'IN' else 'Salida'

        if alt:
            pdf.set_fill_color(*LIGHT_ROW)
        else:
            pdf.set_fill_color(255, 255, 255)

        pdf.set_draw_color(*BORDER_LIGHT)

        fecha = m['date'][:10] if len(m['date']) > 10 else m['date']

        pdf.set_text_color(*BODY_TEXT)
        pdf.cell(col_w[0], 9, fecha, border='TBL', align='C', fill=True)
        pdf.cell(col_w[1], 9, m['part_number'], border='TB', align='C', fill=True)
        pdf.cell(col_w[2], 9, m['description'][:45], border='TB', fill=True)

        type_color = GREEN if tipo == 'IN' else RED
        pdf.set_text_color(*type_color)
        pdf.cell(col_w[3], 9, tipo_label, border='TB', align='C', fill=True)

        pdf.set_text_color(*BODY_TEXT)
        pdf.cell(col_w[4], 9, str(m['quantity']), border='TBR', align='C', fill=True)
        pdf.ln()

        alt = not alt

    if not filtered:
        pdf.set_text_color(*SECONDARY_TEXT)
        pdf.set_font('Helvetica', 'I', 10)
        pdf.cell(0, 20, 'No hay movimientos registrados para este reporte.', align='C')

    tmp = tempfile.NamedTemporaryFile(suffix='.pdf', delete=False)
    tmp.close()
    pdf.output(tmp.name)
    webbrowser.open(f'file://{tmp.name}')
    return {'success': f'Reporte {title_suffix} generado correctamente.'}
