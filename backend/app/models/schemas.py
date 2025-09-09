from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from .models import UserRole, SubscriptionStatus

# User schemas 
class UserBase(BaseModel):
    email: EmailStr
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    role: UserRole = UserRole.STUDENT
    language_preference: str = "en"

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: str
    profile_image_url: Optional[str] = None
    created_at: datetime
    token_balance: Optional[int] = 0
    
    class Config:
        from_attributes = True

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    language_preference: Optional[str] = None

# Quiz schemas
class QuizQuestionBase(BaseModel):
    question_text: str
    question_type: str = "multiple_choice"
    correct_answer: str
    options: Optional[Dict[str, Any]] = None
    order_index: int = 0

class QuizQuestionCreate(QuizQuestionBase):
    pass

class QuizQuestionResponse(QuizQuestionBase):
    id: int
    quiz_id: int
    
    class Config:
        from_attributes = True

class QuizBase(BaseModel):
    title: str
    description: Optional[str] = None
    topic: str
    level: str
    language: str = "en"
    is_public: bool = False

class QuizCreate(QuizBase):
    questions: List[QuizQuestionCreate] = []

class QuizGenerateRequest(BaseModel):
    topic: str
    level: str
    language: str = "en"
    num_questions: int = 5

class QuizResponse(QuizBase):
    id: int
    user_id: str
    tokens_used: int
    created_at: datetime
    question_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class QuizDetailResponse(QuizResponse):
    questions: List[QuizQuestionResponse] = []

# Parent Letter schemas
class ParentLetterCreate(BaseModel):
    student_context: Dict[str, Any]
    content_type: str = "progress_report"
    tone: str = "professional"
    language: str = "en"

class ParentLetterResponse(BaseModel):
    id: int
    user_id: str
    title: str
    content: str
    language: str
    tone: str
    tokens_used: int
    created_at: datetime
    
    class Config:
        from_attributes = True

# Chat schemas
class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    session_id: Optional[str] = None
    history: Optional[List[Dict[str, str]]] = None

class ChatResponse(BaseModel):
    response: str
    session_id: Optional[str] = None
    suggestions: List[str] = []
    context_aware: bool = False

# Token schemas
class TokenBalanceResponse(BaseModel):
    balance: int
    subscription: Dict[str, Any]

class TokenTransactionResponse(BaseModel):
    id: int
    amount: int
    description: str
    reference_type: Optional[str] = None
    created_at: datetime
    
    class Config:
        from_attributes = True

class TokenHistoryResponse(BaseModel):
    transactions: List[TokenTransactionResponse]
    pagination: Dict[str, int]

# Subscription schemas
class SubscriptionCreate(BaseModel):
    plan_type: str

class CheckoutResponse(BaseModel):
    checkout_url: str
    session_id: str

class PortalResponse(BaseModel):
    portal_url: str

class SubscriptionResponse(BaseModel):
    id: int
    user_id: str
    plan_name: str
    status: SubscriptionStatus
    monthly_token_limit: int
    expires_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Dashboard schemas
class DashboardStats(BaseModel):
    user: Dict[str, Any]
    quiz_count: int
    recent_quizzes: List[Dict[str, Any]]
    recent_letters: List[Dict[str, Any]]

# Analytics schemas
class AnalyticsOverview(BaseModel):
    total_students: int
    quizzes_created: int
    average_score: float
    study_time: str
    subject_performance: List[Dict[str, Any]]
    top_performers: List[Dict[str, Any]]

# Community schemas
class CommunityPostCreate(BaseModel):
    title: str
    content: str
    category: str

class CommunityPostResponse(BaseModel):
    id: int
    title: str
    content: str
    category: str
    author_id: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# Admin schemas
class AdminStatsResponse(BaseModel):
    total_users: int
    total_quizzes: int
    total_letters: int
    active_subscriptions: int
    revenue_this_month: float
    growth_rate: float

class AdminUserResponse(UserResponse):
    token_balance: int
    has_premium: bool

# Feedback schemas
class FeedbackCreate(BaseModel):
    type: str
    rating: int
    message: str
    email: Optional[str] = None

class FeedbackResponse(BaseModel):
    id: int
    user_id: Optional[str]
    type: str
    rating: int
    message: str
    email: Optional[str]
    status: str
    created_at: datetime
    
    class Config:
        from_attributes = True

# New AI Services schemas
class ContentSummaryRequest(BaseModel):
    content: str
    summary_type: str = "brief"  # brief, detailed, bullet_points, study_notes
    language: str = "en"

class ContentSummaryResponse(BaseModel):
    summary: str
    key_points: List[str]
    word_count: int
    reading_time: str

class LearningPathRequest(BaseModel):
    subject: str
    current_level: str
    target_level: str
    timeframe: str
    language: str = "en"

class LearningPathResponse(BaseModel):
    learning_path: Dict[str, Any]
    total_duration: str
    difficulty_progression: List[str]
    success_metrics: List[str]

class AutomatedGradingRequest(BaseModel):
    assignment_text: str
    rubric: Dict[str, Any]
    student_answer: str
    language: str = "en"

class AutomatedGradingResponse(BaseModel):
    overall_score: int
    max_score: int
    grade_letter: str
    criterion_scores: Dict[str, Any]
    strengths: List[str]
    improvements: List[str]
    detailed_feedback: str
    next_steps: List[str]

class EnhancedChatRequest(ChatRequest):
    history: Optional[List[Dict[str, str]]] = None

class EnhancedChatResponse(ChatResponse):
    suggestions: List[str] = []
    context_aware: bool = False
