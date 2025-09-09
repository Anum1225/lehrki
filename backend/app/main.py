from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os
import json
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

from .core.database import init_db
from .api.routes import router as api_router
from .services.websocket_manager import manager, NotificationService
from .core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_db()
    yield
    # Shutdown
    pass


# Create FastAPI app
app = FastAPI(
    title="LehrKI API",
    description="AI-powered educational platform with FastAPI backend",
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS
allowed_origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:3001",
]

# Add domains from env (comma-separated)
if settings.ALLOWED_DOMAINS:
    env_domains = settings.ALLOWED_DOMAINS.split(",")
    for domain in env_domains:
        domain = domain.strip()
        if domain:
            if not domain.startswith("http"):
                domain = f"https://{domain}"
            allowed_origins.append(domain)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o for o in allowed_origins if o],
    allow_origin_regex=r"https://.*\.(railway|netlify)\.app$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(api_router, prefix="/api")

# Serve static files (React build)
if os.path.exists("../frontend/dist"):
    app.mount("/assets", StaticFiles(directory="../frontend/dist/assets"), name="assets")

    @app.get("/{full_path:path}")
    async def serve_react_app(full_path: str):
        """Serve React app for all non-API routes"""
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API endpoint not found")

        # Sanitize path to prevent directory traversal
        if ".." in full_path or full_path.startswith("/"):
            raise HTTPException(status_code=404, detail="Invalid path")

        file_path = os.path.join("../frontend/dist", full_path)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            return FileResponse(file_path)

        # Fallback to index.html for React Router
        return FileResponse("../frontend/dist/index.html")

# WebSocket endpoint
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    connection_id = None
    try:
        connection_id = await manager.connect(websocket, user_id)
        while True:
            data = await websocket.receive_text()
            try:
                message = json.loads(data)
            except json.JSONDecodeError:
                await websocket.send_text(json.dumps({"error": "Invalid JSON format"}))
                continue
            
            # Handle different message types
            if message.get("type") == "join_room":
                await manager.join_room(connection_id, message.get("room_id"))
            elif message.get("type") == "leave_room":
                await manager.leave_room(connection_id, message.get("room_id"))
            elif message.get("type") == "chat_message":
                await NotificationService.send_new_message_notification(
                    room_id=message.get("room_id"),
                    sender_name=message.get("sender_name"),
                    message=message.get("message")
                )
            
    except WebSocketDisconnect:
        pass
    finally:
        if connection_id:
            try:
                manager.disconnect(connection_id, user_id)
            except Exception as e:
                print(f"Error disconnecting websocket: {e}")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "LehrKI API is running"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
