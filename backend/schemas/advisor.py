from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class AdvisorReportCreate(BaseModel):
    profile_data: Dict[str, Any]

class AdvisorReportResponse(BaseModel):
    pass
