"""
Certificate generation module for SkillPilot
Generates PDF certificates with QR codes for skill achievements
"""

import os
from datetime import datetime
from io import BytesIO
import qrcode
from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image as RLImage
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
import uuid

CERTIFICATES_DIR = "./certificates"
os.makedirs(CERTIFICATES_DIR, exist_ok=True)

def generate_qr_code(data: str) -> BytesIO:
    """Generate QR code for certificate verification"""
    qr = qrcode.QRCode(
        version=1,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=10,
        border=4,
    )
    qr.add_data(data)
    qr.make(fit=True)
    
    img = qr.make_image(fill_color="black", back_color="white")
    img_byte_arr = BytesIO()
    img.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    return img_byte_arr


def generate_certificate_pdf(
    user_name: str,
    skill_name: str,
    domain: str,
    level: int,
    issued_date: datetime,
    verification_code: str,
    certificate_id: str
) -> str:
    """
    Generate professional certificate PDF with:
    - User name, skill, domain, level
    - Digital signature
    - QR code for verification
    - MoSPI branding
    
    Returns: Path to generated PDF
    """
    
    # File path
    filename = f"cert_{certificate_id}_{int(datetime.now().timestamp())}.pdf"
    filepath = os.path.join(CERTIFICATES_DIR, filename)
    
    # Create PDF
    doc = SimpleDocTemplate(
        filepath,
        pagesize=landscape(A4),
        rightMargin=0.5*inch,
        leftMargin=0.5*inch,
        topMargin=0.75*inch,
        bottomMargin=0.5*inch
    )
    
    elements = []
    styles = getSampleStyleSheet()
    
    # ==========================================
    # HEADER: MoSPI Branding
    # ==========================================
    
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=HexColor("#1F2937"),
        spaceAfter=12,
        alignment=1,  # Center
        fontName='Helvetica-Bold'
    )
    
    header = Paragraph(
        "🇮🇳 Ministry of Statistics & Programme Implementation (MoSPI)",
        header_style
    )
    elements.append(header)
    
    subheader = Paragraph(
        "SkillPilot AI - Capacity Building & Learning Excellence",
        ParagraphStyle('SubHeader', parent=styles['Normal'], fontSize=12, 
                      textColor=HexColor("#6B7280"), alignment=1, spaceAfter=30)
    )
    elements.append(subheader)
    
    # ==========================================
    # CERTIFICATE TITLE
    # ==========================================
    
    cert_title = Paragraph(
        "CERTIFICATE OF ACHIEVEMENT",
        ParagraphStyle('CertTitle', parent=styles['Heading1'], fontSize=36, 
                      textColor=HexColor("#059669"), alignment=1, 
                      spaceAfter=30, fontName='Helvetica-Bold')
    )
    elements.append(cert_title)
    
    elements.append(Spacer(1, 0.3*inch))
    
    # ==========================================
    # CERTIFICATE BODY
    # ==========================================
    
    body_text = f"""
    <b>This Certifies That</b><br/>
    <br/>
    <font size=20><b>{user_name}</b></font><br/>
    <br/>
    <b>has successfully demonstrated mastery in</b><br/>
    <br/>
    <font size=18 color="#059669"><b>{skill_name}</b></font><br/>
    <b>(Domain: {domain})</b><br/>
    <br/>
    <b>Competency Level Achieved: {level}/4</b><br/>
    <br/>
    <font size=11>
    This certificate recognizes the completion of competency assessment and achievement 
    of the specified skill level as per the FRAC (Framework for Roles And Competencies) 
    aligned with India's Official Statistical System standards and iGOT Karmayogi guidelines.
    </font>
    """
    
    body = Paragraph(
        body_text,
        ParagraphStyle('Body', parent=styles['Normal'], fontSize=12, 
                      alignment=1, spaceAfter=20, leading=22)
    )
    elements.append(body)
    
    elements.append(Spacer(1, 0.2*inch))
    
    # ==========================================
    # FOOTER: Dates, Codes, QR
    # ==========================================
    
    issued_str = issued_date.strftime("%d %B %Y")
    
    footer_data = [
        [
            f"Certificate ID: {certificate_id}",
            f"Issued: {issued_str}",
            f"Verification Code: {verification_code}"
        ]
    ]
    
    footer_table = Table(footer_data, colWidths=[2.5*inch, 2.5*inch, 2.5*inch])
    footer_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 9),
        ('TEXTCOLOR', (0, 0), (-1, -1), HexColor("#6B7280")),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('TOPPADDING', (0, 0), (-1, -1), 12),
    ]))
    
    elements.append(footer_table)
    
    elements.append(Spacer(1, 0.15*inch))
    
    # ==========================================
    # QR CODE FOR VERIFICATION
    # ==========================================
    
    qr_data = f"skillpilot://verify/{certificate_id}/{verification_code}"
    qr_img = generate_qr_code(qr_data)
    
    # Create temporary QR image for ReportLab
    qr_temp_path = os.path.join(CERTIFICATES_DIR, f"qr_{certificate_id}.png")
    with open(qr_temp_path, 'wb') as f:
        f.write(qr_img.getvalue())
    
    qr_image = RLImage(qr_temp_path, width=1.5*inch, height=1.5*inch)
    
    # ==========================================
    # SIGNATURE AREA
    # ==========================================
    
    sig_text = Paragraph(
        "<b>Authorized by</b><br/>Ministry of Statistics & Programme Implementation<br/>Government of India",
        ParagraphStyle('Sig', parent=styles['Normal'], fontSize=9, 
                      alignment=1, textColor=HexColor("#6B7280"))
    )
    
    # Create final table with QR and signature
    final_data = [
        [qr_image, sig_text]
    ]
    
    final_table = Table(final_data, colWidths=[2*inch, 5*inch])
    final_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 20),
        ('TOPPADDING', (0, 0), (-1, -1), 20),
    ]))
    
    elements.append(final_table)
    
    # ==========================================
    # BUILD PDF
    # ==========================================
    
    try:
        doc.build(elements)
        
        # Clean up temp QR file
        if os.path.exists(qr_temp_path):
            os.remove(qr_temp_path)
        
        return filepath
    except Exception as e:
        print(f"❌ Error generating certificate: {e}")
        raise


def verify_certificate(certificate_id: str, verification_code: str) -> bool:
    """
    Verify certificate authenticity by checking code
    (In production, query database)
    """
    # This would query the database to verify the code matches certificate_id
    return len(verification_code) == 8 and verification_code.isupper()


def get_certificate_path(certificate_id: str) -> str:
    """Get path to certificate file"""
    # In production, query DB for actual file path
    # For now, return the directory where certificates are stored
    return CERTIFICATES_DIR
