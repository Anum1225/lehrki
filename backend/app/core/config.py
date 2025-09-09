import os
from typing import Optional

class Settings:
    """Application settings and configuration"""
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite+aiosqlite:///./lehrki_dev.db")
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # Stripe
    STRIPE_SECRET_KEY: Optional[str] = os.getenv("STRIPE_SECRET_KEY")
    STRIPE_PRODUCT_ID: Optional[str] = os.getenv("STRIPE_PRODUCT_ID")
    STRIPE_WEBHOOK_SECRET: Optional[str] = os.getenv("STRIPE_WEBHOOK_SECRET")
    
    # CORS
    ALLOWED_DOMAINS: str = os.getenv("ALLOWED_DOMAINS", "")
    DEV_DOMAIN: str = os.getenv("DEV_DOMAIN", "localhost:3000")
    
    # AI Services
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    
    # Application
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    @property
    def stripe_configured(self) -> bool:
        """Check if Stripe is properly configured"""
        return bool(self.STRIPE_SECRET_KEY and self.STRIPE_PRODUCT_ID)
    
    @property
    def ai_configured(self) -> bool:
        """Check if AI services are properly configured"""
        return bool(self.OPENAI_API_KEY)

settings = Settings()