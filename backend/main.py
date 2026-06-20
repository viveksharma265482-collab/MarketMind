import os
import tempfile
import logging
from typing import Dict, Any
from pydantic import BaseModel
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize analyzer and AI modules
from analyzer import get_preview_data, process_marketing_analysis
from ai_consultant import get_gemini_insights, get_brainstorm_suggestions, get_brainstorm_detail, get_similar_ideas, get_recommendation_detail, get_recommendation_alternative
from demo_generator import generate_large_demo_csv

app = FastAPI(title="MarketMind AI Backend", version="1.0")

# Enable CORS for Next.js frontend calls
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for easy local setup
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/upload")
async def upload_file_preview(file: UploadFile = File(...)):
    """Receives file, saves to a temp location, parses metadata and returns first 10 rows."""
    filename = file.filename
    if not filename:
        return JSONResponse(status_code=400, content={"success": False, "message": "Empty filename."})
        
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ['.csv', '.xlsx', '.xls']:
        return JSONResponse(status_code=400, content={"success": False, "message": "Unsupported file format. Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)."})

    # Write file to a temporary file
    temp_dir = tempfile.gettempdir()
    temp_file = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=ext, delete=False)
    temp_path = temp_file.name

    try:
        contents = await file.read()
        temp_file.write(contents)
        temp_file.close()
        
        # Parse preview data
        preview_data = get_preview_data(temp_path)
        return preview_data
    except ValueError as val_err:
        logger.error(f"Validation error in preview: {val_err}")
        return JSONResponse(status_code=400, content={"success": False, "message": str(val_err)})
    except Exception as e:
        logger.error(f"Error parsing preview for {filename}: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Uploaded file contains no valid marketing data. Please upload a valid CSV or Excel dataset."})
    finally:
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/analyze")
async def analyze_marketing_data(file: UploadFile = File(...)):
    """Runs the full marketing attribution, rule-based algorithms, and fetches AI consultant insights."""
    filename = file.filename
    if not filename:
        return JSONResponse(status_code=400, content={"success": False, "message": "Empty filename."})
        
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ['.csv', '.xlsx', '.xls']:
        return JSONResponse(status_code=400, content={"success": False, "message": "Unsupported file format. Please upload a valid CSV or Excel file (.csv, .xlsx, .xls)."})

    # Write file to a temporary file
    temp_dir = tempfile.gettempdir()
    temp_file = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=ext, delete=False)
    temp_path = temp_file.name

    try:
        contents = await file.read()
        temp_file.write(contents)
        temp_file.close()
        
        # 1. Process deterministic analytics
        analysis_data = process_marketing_analysis(temp_path)
        
        # 2. Query AI Consultant (Gemini API or Local Fallback)
        ai_insights = get_gemini_insights(analysis_data)
        
        # 3. Merge data
        result = {
            "kpis": analysis_data["kpis"],
            "charts": analysis_data["charts"],
            "budgetOptimization": analysis_data["budgetOptimization"],
            "wastedSpend": analysis_data["wastedSpend"],
            "topCampaigns": analysis_data["topCampaigns"],
            "aiInsights": ai_insights
        }
        
        return result
    except ValueError as val_err:
        logger.error(f"Validation error in analysis: {val_err}")
        return JSONResponse(status_code=400, content={"success": False, "message": str(val_err)})
    except Exception as e:
        logger.error(f"Error executing analysis for {filename}: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Uploaded file contains no valid marketing data. Please upload a valid CSV or Excel dataset."})
    finally:
        # Cleanup temp file
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.get("/api/demo")
def get_demo_analysis():
    """Generates a 1000+ row dataset dynamically, analyzes it, and returns the result with preview."""
    temp_dir = tempfile.gettempdir()
    demo_filename = "demo_marketing_data_1000.csv"
    demo_path = os.path.join(temp_dir, demo_filename)
    
    try:
        # Always generate fresh demo CSV to prevent cached profiles
        generate_large_demo_csv(demo_path)
            
        # 1. Parse preview data
        preview_data = get_preview_data(demo_path)
        
        # 2. Process analysis
        analysis_data = process_marketing_analysis(demo_path)
        
        # 3. Get AI insights
        ai_insights = get_gemini_insights(analysis_data)
        
        # 4. Consolidate results
        result = {
            "kpis": analysis_data["kpis"],
            "charts": analysis_data["charts"],
            "budgetOptimization": analysis_data["budgetOptimization"],
            "wastedSpend": analysis_data["wastedSpend"],
            "topCampaigns": analysis_data["topCampaigns"],
            "aiInsights": ai_insights,
            "preview": preview_data
        }
        
        return result
    except ValueError as val_err:
        logger.error(f"Validation error in demo: {val_err}")
        return JSONResponse(status_code=400, content={"success": False, "message": str(val_err)})
    except Exception as e:
        logger.error(f"Error executing demo analysis: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": f"Demo generation failed: {str(e)}"})

@app.post("/api/brainstorm")
async def brainstorm_ideas(file: UploadFile = File(None)):
    """Generates marketing growth suggestions based on uploaded or demo campaign data."""
    # If no file is provided, use the demo dataset
    if file is None or file.filename == "":
        temp_dir = tempfile.gettempdir()
        demo_filename = "demo_marketing_data_1000.csv"
        demo_path = os.path.join(temp_dir, demo_filename)
        
        try:
            # Generate the demo CSV if it doesn't exist
            if not os.path.exists(demo_path):
                generate_large_demo_csv(demo_path)
            
            analysis_data = process_marketing_analysis(demo_path)
            ideas = get_brainstorm_suggestions(analysis_data)
            return {"success": True, "ideas": ideas}
        except Exception as e:
            logger.error(f"Error executing demo brainstorm: {e}")
            return JSONResponse(status_code=500, content={"success": False, "message": f"Demo brainstorm failed: {str(e)}"})
            
    # Save and parse provided file
    filename = file.filename
    ext = os.path.splitext(filename)[1].lower()
    if ext not in ['.csv', '.xlsx', '.xls']:
        return JSONResponse(status_code=400, content={"success": False, "message": "Unsupported file format. Please upload a valid CSV or Excel file."})

    temp_dir = tempfile.gettempdir()
    temp_file = tempfile.NamedTemporaryFile(dir=temp_dir, suffix=ext, delete=False)
    temp_path = temp_file.name

    try:
        contents = await file.read()
        temp_file.write(contents)
        temp_file.close()
        
        analysis_data = process_marketing_analysis(temp_path)
        ideas = get_brainstorm_suggestions(analysis_data)
        return {"success": True, "ideas": ideas}
    except ValueError as val_err:
        logger.error(f"Validation error in brainstorm: {val_err}")
        return JSONResponse(status_code=400, content={"success": False, "message": str(val_err)})
    except Exception as e:
        logger.error(f"Error executing brainstorm: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": "Uploaded file could not be parsed for brainstorming."})
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

class DetailRequest(BaseModel):
    analysisData: Dict[str, Any]
    category: str
    title: str
    reason: str

@app.post("/api/brainstorm/detail")
async def brainstorm_detail(request: DetailRequest):
    """Generates detailed business case advice for a selected brainstorm idea."""
    try:
        detail = get_brainstorm_detail(
            request.analysisData, 
            request.category, 
            request.title, 
            request.reason
        )
        return {"success": True, "detail": detail}
    except Exception as e:
        logger.error(f"Error generating brainstorm detail: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

class SimilarRequest(BaseModel):
    analysisData: Dict[str, Any]
    category: str
    title: str

@app.post("/api/brainstorm/similar")
async def brainstorm_similar(request: SimilarRequest):
    """Generates 3 additional related suggestions based on a clicked brainstorm idea."""
    try:
        similar = get_similar_ideas(
            request.analysisData, 
            request.category, 
            request.title
        )
        return {"success": True, "ideas": similar}
    except Exception as e:
        logger.error(f"Error generating similar ideas: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

class RecommendationDetailRequest(BaseModel):
    analysisData: Dict[str, Any]
    recommendation: str
    reason: str
    benefit: str

@app.post("/api/recommendation/detail")
async def recommendation_detail(request: RecommendationDetailRequest):
    """Generates detailed operational case advice for a recommended action."""
    try:
        detail = get_recommendation_detail(
            request.analysisData, 
            request.recommendation, 
            request.reason, 
            request.benefit
        )
        return {"success": True, "detail": detail}
    except Exception as e:
        logger.error(f"Error generating recommendation detail: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

class RecommendationAlternativeRequest(BaseModel):
    analysisData: Dict[str, Any]
    recommendation: str
    reason: str

@app.post("/api/recommendation/alternative")
async def recommendation_alternative(request: RecommendationAlternativeRequest):
    """Generates an alternative data-driven recommendation strategy using Gemini."""
    try:
        alternative = get_recommendation_alternative(
            request.analysisData, 
            request.recommendation, 
            request.reason
        )
        return {"success": True, "alternative": alternative}
    except Exception as e:
        logger.error(f"Error generating recommendation alternative: {e}")
        return JSONResponse(status_code=500, content={"success": False, "message": str(e)})

@app.get("/api/health")
def health_check():
    """Health check endpoint."""
    return {"status": "ok", "gemini_configured": os.environ.get("GEMINI_API_KEY") is not None}
