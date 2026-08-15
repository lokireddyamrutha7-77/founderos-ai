from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database.db import get_db
from models.user import User
from models.advisor import AdvisorReport as AdvisorReportModel
from services.security import get_current_user
from datetime import datetime
import json

router = APIRouter(prefix="/advisor", tags=["Advisor"])

def success(data):
    return {"success": True, "data": data, "error": None}

def report_to_dict(r):
    return {
        "id": f"rep_{r.id}",
        "createdAt": r.created_at.isoformat(),
        "title": r.title,
        "assessmentScore": r.assessment_score,
        "explanation": r.explanation,
        "targetCustomer": r.target_customer,
        "marketOpportunity": r.market_opportunity,
        "competition": r.competition,
        "revenueModel": r.revenue_model,
        "pricing": r.pricing,
        "costs": r.costs,
        "swot": r.swot,
        "roadmap": r.roadmap,
        "risks": r.risks,
        "nextActions": r.next_actions
    }

@router.get("/")
def get_reports(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    reports = db.query(AdvisorReportModel).filter(AdvisorReportModel.user_id == current_user.id).order_by(AdvisorReportModel.created_at.desc()).all()
    return success([report_to_dict(r) for r in reports])

@router.post("/")
def generate_report(profile_data: dict, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    stage = profile_data.get("stage", "no_idea")
    industry = profile_data.get("industry", "Business Incubator")

    score = 45 if stage == 'no_idea' else (68 if stage == 'idea' else 82)
    explanation = "Analysis of interests and industry matches. Based on your skill parameters and target budget, we have mapped a service-oriented agency structure." if stage == 'no_idea' else "Market validation blueprint for your business concept. Competitor analysis reveals high margin potential with moderate acquisition friction."
    target_customer = 'B2B small business owners seeking operations consultation' if stage == 'no_idea' else 'High-earning executives looking for fractional brand design'

    db_report = AdvisorReportModel(
        user_id=current_user.id,
        title=f"Strategic Opportunity Report — {industry}",
        assessment_score=score,
        explanation=explanation,
        target_customer=target_customer,
        market_opportunity="Estimated TAM of $4.2B in Tier 1 cities, driven by digital brand transition requirements post-2025.",
        competition="Highly fragmented local boutique consultancies. Differentiator lies in custom AI workflow integrations.",
        revenue_model="Fixed-term strategy engagements ($2,500 - $5,000) transitioning to retainer contracts ($1,500/mo).",
        pricing="$3,500 setup strategy retainer + $1,500 maintenance fee.",
        costs="Principal contractor hire, hosting, legal setup, branding.",
        swot={
          "strengths": ['Low initial capital expenditures', 'Highly specialized advisory skills', 'Agile delivery model'],
          "weaknesses": ['Solo resource limitations', 'High dependencies on founder brand', 'Long sales cycles'],
          "opportunities": ['AI automation integrations for clients', 'Underserved regional markets', 'High ticket corporate cohorts'],
          "threats": ['Direct competition from remote agencies', 'Rapid tool evolution risk', 'Macro budget consolidations']
        },
        roadmap=[
          { "phase": 'Phase 1: Validation', "title": 'Customer Discovery & Sandbox', "tasks": ['Conduct 10 stakeholder interviews', 'Setup landing page framework', 'Launch strategy draft newsletter'] },
          { "phase": 'Phase 2: Alpha Launch', "title": 'Initial Pilot Deliverables', "tasks": ['Close first 2 advisory retainers', 'Execute core SWOT mappings', 'Deploy client workspace template'] },
          { "phase": 'Phase 3: Operations & Scale', "title": 'Process Automation', "tasks": ['Hire virtual agency assistant', 'Launch targeted LinkedIn outreach', 'Document case study results'] }
        ],
        risks=[
          { "risk": 'Founder capacity bottleneck', "impact": 'High', "mitigation": 'Template standard documents and automate billing operations early.' },
          { "risk": 'High client churn', "impact": 'Medium', "mitigation": 'Focus on 6-month minimum lock-ins with clear milestone deliverables.' }
        ],
        next_actions=[
          'Log your first equity investment in the Finance tracker.',
          'Add "Conduct 10 customer validation interviews" to Tasks.',
          'Define the milestone for "First paid customer pilot".'
        ]
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return success(report_to_dict(db_report))
