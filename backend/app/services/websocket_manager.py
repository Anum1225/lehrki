from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Set
import json
import asyncio
from datetime import datetime
import uuid

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.user_connections: Dict[str, Set[str]] = {}
        self.room_connections: Dict[str, Set[str]] = {}

    async def connect(self, websocket: WebSocket, user_id: str, connection_id: str = None):
        await websocket.accept()
        
        if not connection_id:
            connection_id = str(uuid.uuid4())
        
        self.active_connections[connection_id] = websocket
        
        if user_id not in self.user_connections:
            self.user_connections[user_id] = set()
        self.user_connections[user_id].add(connection_id)
        
        return connection_id

    def disconnect(self, connection_id: str, user_id: str):
        if connection_id in self.active_connections:
            del self.active_connections[connection_id]
        
        if user_id in self.user_connections:
            self.user_connections[user_id].discard(connection_id)
            if not self.user_connections[user_id]:
                del self.user_connections[user_id]

    async def send_personal_message(self, message: dict, user_id: str):
        if user_id in self.user_connections:
            for connection_id in self.user_connections[user_id].copy():
                try:
                    websocket = self.active_connections.get(connection_id)
                    if websocket:
                        await websocket.send_text(json.dumps(message))
                except:
                    self.disconnect(connection_id, user_id)

    async def join_room(self, connection_id: str, room_id: str):
        if room_id not in self.room_connections:
            self.room_connections[room_id] = set()
        self.room_connections[room_id].add(connection_id)

    async def leave_room(self, connection_id: str, room_id: str):
        if room_id in self.room_connections:
            self.room_connections[room_id].discard(connection_id)

    async def broadcast_to_room(self, message: dict, room_id: str):
        if room_id in self.room_connections:
            for connection_id in self.room_connections[room_id].copy():
                try:
                    websocket = self.active_connections.get(connection_id)
                    if websocket:
                        await websocket.send_text(json.dumps(message))
                except:
                    self.room_connections[room_id].discard(connection_id)

    async def broadcast_all(self, message: dict):
        for connection_id, websocket in self.active_connections.copy().items():
            try:
                await websocket.send_text(json.dumps(message))
            except:
                pass

manager = ConnectionManager()

class NotificationService:
    @staticmethod
    async def send_quiz_completion_notification(user_id: str, quiz_title: str, score: float):
        message = {
            "type": "quiz_completed",
            "data": {
                "title": quiz_title,
                "score": score,
                "timestamp": datetime.now().isoformat(),
                "message": f"Quiz '{quiz_title}' completed with {score}% score!"
            }
        }
        await manager.send_personal_message(message, user_id)

    @staticmethod
    async def send_new_message_notification(room_id: str, sender_name: str, message: str):
        notification = {
            "type": "new_message",
            "data": {
                "sender": sender_name,
                "message": message,
                "timestamp": datetime.now().isoformat(),
                "room_id": room_id
            }
        }
        await manager.broadcast_to_room(notification, room_id)

    @staticmethod
    async def send_system_notification(user_id: str, title: str, message: str, type: str = "info"):
        notification = {
            "type": "system_notification",
            "data": {
                "title": title,
                "message": message,
                "type": type,
                "timestamp": datetime.now().isoformat()
            }
        }
        await manager.send_personal_message(notification, user_id)