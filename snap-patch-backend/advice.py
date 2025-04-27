# advice.py
import os, openai
from fastapi import APIRouter, Depends
from auth import Auth0Bearer

openai.api_key = os.getenv("OPENAI_API_KEY")

router = APIRouter(prefix="/api", tags=["advice"])
auth_dep = Auth0Bearer()

@router.post("/advice")
async def recovery_advice(severity: str, user=Depends(auth_dep)):
    """
    Given severity “low”/“moderate”/“severe”, returns personalized healing tips.
    """
    prompt = (
        f"You are a medical recovery coach. "
        f"Provide a concise set of healing tips for a {severity} skin injury, "
        "including wound care, timeline, and when to seek professional help."
    )
    resp = openai.ChatCompletion.create(
        model="gpt-4",
        messages=[{"role":"user","content":prompt}]
    )
    advice = resp.choices[0].message.content.strip()
    return {"advice": advice}
