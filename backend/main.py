from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from dotenv import load_dotenv
import os
import json

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")

print("API KEY =", api_key)

client = Groq(api_key=api_key)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

complaints = []


class Complaint(BaseModel):
    customerName: str
    productName: str
    description: str

@app.post("/complaints")
def create_complaint(data: Complaint):

    prompt = f"""
You are an AI complaint analyzer.

Customer Name: {data.customerName}
Product Name: {data.productName}
Complaint:
{data.description}

Return ONLY valid JSON like this:

{{
    "category":"...",
    "severity":"Low/Medium/High",
    "summary":"...",
    "recommendation":"..."
}}
"""

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.2,
        )

        result = response.choices[0].message.content.strip()

        try:
            analysis = json.loads(result)
        except:
            analysis = {
                "category": "General Complaint",
                "severity": "Medium",
                "summary": result,
                "recommendation": "Manual review required."
            }

    except Exception as e:
        analysis = {
            "category": "AI Error",
            "severity": "Unknown",
            "summary": str(e),
            "recommendation": "Check your Groq API key."
        }

    complaints.append({
        "customerName": data.customerName,
        "productName": data.productName,
        "description": data.description,
        "analysis": analysis
    })

    return {
        "message": "Complaint Submitted Successfully",
        "analysis": analysis
    }


@app.get("/complaints")
def get_complaints():
    return complaints