import io
from datetime import datetime

from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.platypus import HRFlowable, Paragraph, SimpleDocTemplate, Table, TableStyle

from models.advisor import AdvisorReport
from models.finance import FinanceSnapshot


def generate_advisor_report_pdf(report: AdvisorReport) -> bytes:
    """
    Generate a clean, readable PDF for an AdvisorReport using ReportLab.
    Returns raw PDF bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1A1A1A'),
        spaceAfter=10,
    )
    score_style = ParagraphStyle(
        'ScoreStyle',
        parent=styles['Heading2'],
        fontSize=14,
        leading=18,
        textColor=colors.HexColor('#C9A961'),
        spaceAfter=15,
    )
    h2_style = ParagraphStyle(
        'SectionHeader',
        parent=styles['Heading2'],
        fontSize=13,
        leading=16,
        textColor=colors.HexColor('#222222'),
        spaceBefore=14,
        spaceAfter=6,
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['BodyText'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#333333'),
        spaceAfter=6,
    )
    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['BodyText'],
        fontSize=10,
        leading=14,
        textColor=colors.HexColor('#333333'),
        leftIndent=15,
        spaceAfter=4,
    )
    footer_style = ParagraphStyle(
        'FooterText',
        parent=styles['Italic'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#666666'),
        spaceBefore=20,
    )

    story = []

    # Title with truncated idea description if long
    idea_preview = report.idea_description.strip() if report.idea_description else "Startup Idea"
    idea_title = idea_preview[:80] + "..." if len(idea_preview) > 80 else idea_preview

    story.append(Paragraph("<b>Altora AI Advisor Report</b>", title_style))
    story.append(Paragraph(f"<b>Idea:</b> {idea_title}", body_style))
    story.append(Paragraph(f"<b>Viability Score:</b> {report.idea_score} / 100", score_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB'), spaceAfter=15))

    # Full Idea Description
    story.append(Paragraph("<b>Full Idea Description</b>", h2_style))
    story.append(Paragraph(report.idea_description.replace('\n', '<br/>'), body_style))

    # 1. Market Validation
    story.append(Paragraph("<b>Market Validation</b>", h2_style))
    story.append(Paragraph(report.market_validation.replace('\n', '<br/>'), body_style))

    # 2. Competitors
    story.append(Paragraph("<b>Competitor Analysis</b>", h2_style))
    competitors = report.competitors or []
    if isinstance(competitors, list):
        for comp in competitors:
            name = comp.get("name", "Competitor")
            weakness = comp.get("weakness", "N/A")
            advantage = comp.get("advantage", "N/A")
            item_text = f"• <b>{name}</b> — <i>Weakness:</i> {weakness} | <i>Advantage:</i> {advantage}"
            story.append(Paragraph(item_text, bullet_style))

    # 3. SWOT Analysis
    story.append(Paragraph("<b>SWOT Analysis</b>", h2_style))
    swot = report.swot or {}
    if isinstance(swot, dict):
        for category in ["strengths", "weaknesses", "opportunities", "threats"]:
            items = swot.get(category, [])
            if items:
                story.append(Paragraph(f"<b>{category.capitalize()}:</b>", bullet_style))
                for item in items:
                    story.append(Paragraph(f"&nbsp;&nbsp;&nbsp;&nbsp;- {item}", bullet_style))

    # 4. Business Model
    story.append(Paragraph("<b>Business Model</b>", h2_style))
    story.append(Paragraph(report.business_model.replace('\n', '<br/>'), body_style))

    # 5. Revenue Suggestions
    story.append(Paragraph("<b>Revenue Opportunities</b>", h2_style))
    rev_sug = report.revenue_suggestions or []
    if isinstance(rev_sug, list):
        for idx, item in enumerate(rev_sug, 1):
            story.append(Paragraph(f"{idx}. {item}", bullet_style))

    # 6. Growth Strategy
    story.append(Paragraph("<b>Growth Strategy</b>", h2_style))
    growth = report.growth_strategy or []
    if isinstance(growth, list):
        for idx, item in enumerate(growth, 1):
            story.append(Paragraph(f"Stage {idx}: {item}", bullet_style))

    # 7. Legal Considerations
    story.append(Paragraph("<b>Legal & Compliance</b>", h2_style))
    story.append(Paragraph(report.legal_considerations.replace('\n', '<br/>'), body_style))

    # 8. Next Steps
    story.append(Paragraph("<b>Actionable Next Steps</b>", h2_style))
    next_steps = report.next_steps or []
    if isinstance(next_steps, list):
        for idx, item in enumerate(next_steps, 1):
            story.append(Paragraph(f"{idx}. {item}", bullet_style))

    # Footer
    created_str = report.created_at.strftime("%B %d, %Y at %H:%M UTC") if report.created_at else "N/A"
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB'), spaceBefore=20, spaceAfter=10))
    story.append(Paragraph(f"Report generated on {created_str} by Altora AI Advisor.", footer_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def generate_finance_snapshot_pdf(snapshot: FinanceSnapshot) -> bytes:
    """
    Generate a simple one-page PDF for a FinanceSnapshot.
    Returns raw PDF bytes.
    """
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=letter,
        rightMargin=40,
        leftMargin=40,
        topMargin=40,
        bottomMargin=40,
    )

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Heading1'],
        fontSize=20,
        leading=24,
        textColor=colors.HexColor('#1A1A1A'),
        spaceAfter=10,
    )
    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['BodyText'],
        fontSize=11,
        leading=16,
        textColor=colors.HexColor('#333333'),
        spaceAfter=8,
    )
    footer_style = ParagraphStyle(
        'FooterText',
        parent=styles['Italic'],
        fontSize=9,
        leading=12,
        textColor=colors.HexColor('#666666'),
        spaceBefore=20,
    )

    story = []

    story.append(Paragraph("<b>Altora Financial Snapshot</b>", title_style))
    updated_str = snapshot.updated_at.strftime("%B %d, %Y at %H:%M UTC") if snapshot.updated_at else "N/A"
    story.append(Paragraph(f"Last updated: {updated_str}", body_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB'), spaceAfter=20))

    rev_str = f"${snapshot.revenue:,.2f}"
    exp_str = f"${snapshot.expenses:,.2f}"
    burn_str = f"${snapshot.burn_rate:,.2f}"

    if snapshot.burn_rate == 0:
        runway_str = "∞ (Profitable / Break-even)"
    elif snapshot.runway_months is not None:
        runway_str = f"{snapshot.runway_months} months"
    else:
        runway_str = "N/A"

    table_data = [
        [Paragraph("<b>Metric</b>", body_style), Paragraph("<b>Amount / Estimate</b>", body_style)],
        [Paragraph("Monthly Revenue", body_style), Paragraph(rev_str, body_style)],
        [Paragraph("Monthly Expenses", body_style), Paragraph(exp_str, body_style)],
        [Paragraph("Monthly Burn Rate", body_style), Paragraph(burn_str, body_style)],
        [Paragraph("Estimated Runway", body_style), Paragraph(runway_str, body_style)],
    ]

    table = Table(table_data, colWidths=[200, 250])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F3F4F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#111827')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 8),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
    ]))

    story.append(table)
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor('#E5E7EB'), spaceBefore=30, spaceAfter=10))
    story.append(Paragraph(f"Document generated on {datetime.utcnow().strftime('%B %d, %Y at %H:%M UTC')} by Altora.", footer_style))

    doc.build(story)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
