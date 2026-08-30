"""
Database models and initialization for SkillPilot AI
SQLite / PostgreSQL with SQLModel ORM
"""

import json
import os
from datetime import datetime, timedelta
from typing import Optional, List, Dict, Any
from dotenv import load_dotenv
from sqlalchemy import create_engine, Column, JSON
from sqlalchemy.orm import sessionmaker, Session
from sqlmodel import SQLModel, Field, Relationship

load_dotenv()

# ==========================================
# DATABASE CONFIGURATION
# ==========================================

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./skillpilot.db")

if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        echo=False
    )
else:
    engine = create_engine(
        DATABASE_URL,
        echo=False,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ==========================================
# DATABASE MODELS
# ==========================================

class User(SQLModel, table=True):
    """User profile with competency tracking"""
    __tablename__ = "users"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str = Field(unique=True, index=True)
    username: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    designation: str = "Statistical Officer"  # e.g., "Statistical Officer", "Field Investigator"
    department: str = "NSO"                   # e.g., "NSO", "FOD", "NAD"
    experience_years: int = 0
    
    # Competency JSON - stores domain: {skill: level, ...}
    competencies: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    
    # Account metadata
    is_active: bool = True
    is_admin: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    last_login: Optional[datetime] = None
    
    # Relationships
    quizzes: List["Quiz"] = Relationship(back_populates="user")
    certificates: List["Certificate"] = Relationship(back_populates="user")
    progress: List["ProgressTracking"] = Relationship(back_populates="user")


class Quiz(SQLModel, table=True):
    """Quiz completion records"""
    __tablename__ = "quizzes"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    quiz_id: str = ""  # Unique quiz identifier
    user_id: int = Field(foreign_key="users.id", index=True)
    quiz_title: str = ""
    score_percentage: int = 0
    total_questions: int = 0
    correct_answers: int = 0
    
    # Topics/skills tested & answers
    topics: List[Any] = Field(default_factory=list, sa_column=Column(JSON))
    answers: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    
    passed: bool = False  # True if score >= 70%
    time_taken_seconds: int = 0
    completed_at: datetime = Field(default_factory=datetime.utcnow)
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="quizzes")


class Certificate(SQLModel, table=True):
    """User certificates/badges for skill achievement"""
    __tablename__ = "certificates"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    certificate_id: str = ""  # Unique certificate ID
    user_id: int = Field(foreign_key="users.id", index=True)
    
    skill_name: str = ""
    domain: str = ""  # Statistical, Technical, Digital Governance, Behavioural
    level_achieved: int = 1  # 1-4
    
    # Certificate details
    issued_date: datetime = Field(default_factory=datetime.utcnow)
    expiry_date: Optional[datetime] = None
    certificate_url: Optional[str] = None  # Path to generated PDF
    qr_code_url: Optional[str] = None
    
    # Verification
    is_verified: bool = True
    verification_code: str = ""
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="certificates")


class ProgressTracking(SQLModel, table=True):
    """Real-time progress tracking for learners"""
    __tablename__ = "progress_tracking"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    
    # Skill being tracked
    skill_name: str = ""
    domain: str = ""
    
    # Progress metrics
    current_level: int = 0  # 0-4
    target_level: int = 4
    progress_percentage: int = 0  # 0-100
    
    # Milestones
    milestones_achieved: int = 0
    milestone_dates: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    
    # Timestamps
    started_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    completed_at: Optional[datetime] = None
    
    # Relationships
    user: Optional[User] = Relationship(back_populates="progress")


class CourseEnrollment(SQLModel, table=True):
    """Track user course enrollments"""
    __tablename__ = "course_enrollments"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)
    
    course_id: str = ""  # e.g., "igot-stat-sampling-201"
    course_title: str = ""
    course_domain: str = ""
    
    # Progress
    enrolled_at: datetime = Field(default_factory=datetime.utcnow)
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    
    completion_percentage: int = 0  # 0-100
    is_completed: bool = False
    
    notes: Optional[str] = None


class AdminStats(SQLModel, table=True):
    """Aggregated statistics for admin dashboard"""
    __tablename__ = "admin_stats"
    
    id: Optional[int] = Field(default=None, primary_key=True)
    
    total_users: int = 0
    active_users_30d: int = 0
    total_quizzes_taken: int = 0
    avg_quiz_score: float = 0.0
    
    competency_distribution: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    
    critical_gaps: int = 0
    high_gaps: int = 0
    
    avg_completion_rate: float = 0.0
    top_performing_skills: List[Any] = Field(default_factory=list, sa_column=Column(JSON))
    
    last_updated: datetime = Field(default_factory=datetime.utcnow)
    calculation_time_ms: int = 0


class AssessmentResult(SQLModel, table=True):
    """Persisted AI competency gap analysis result per user"""
    __tablename__ = "assessment_results"

    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="users.id", index=True)

    role: str = ""
    overall_score: int = 0
    domain_scores: Dict[str, Any] = Field(default_factory=dict, sa_column=Column(JSON))
    skill_gaps: List[Any] = Field(default_factory=list, sa_column=Column(JSON))
    recommendations: List[Any] = Field(default_factory=list, sa_column=Column(JSON))
    critical_gaps_count: int = 0
    insight: str = ""

    computed_at: datetime = Field(default_factory=datetime.utcnow)


# ==========================================
# DATABASE INITIALIZATION
# ==========================================

def init_db():
    """Create all tables in the database"""
    SQLModel.metadata.create_all(engine)
    print("[DB] Database tables initialized successfully!")


def get_db():
    """Dependency injection for database session"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def get_session() -> Session:
    """Convenience context-manager session getter"""
    return SessionLocal()


# ==========================================
# DATABASE HELPER FUNCTIONS
# ==========================================

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Fetch user by email"""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Fetch user by ID"""
    return db.query(User).filter(User.id == user_id).first()


def create_user(db: Session, email: str, username: str, hashed_password: str, 
                full_name: str, designation: str, department: str) -> User:
    """Create new user"""
    user = User(
        email=email,
        username=username,
        hashed_password=hashed_password,
        full_name=full_name,
        designation=designation,
        department=department,
        competencies={
            "Statistical": {},
            "Technical": {},
            "Digital Governance": {},
            "Behavioural": {}
        }
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user_competencies(db: Session, user_id: int, competencies: Dict[str, Any]) -> User:
    """Update user competency levels"""
    user = get_user_by_id(db, user_id)
    if user:
        user.competencies = competencies
        user.updated_at = datetime.utcnow()
        db.add(user)
        db.commit()
        db.refresh(user)
    return user


def save_quiz_result(db: Session, user_id: int, quiz_data: Dict[str, Any]) -> Quiz:
    """Save quiz completion"""
    quiz = Quiz(
        quiz_id=quiz_data.get("quizId", ""),
        user_id=user_id,
        quiz_title=quiz_data.get("quizTitle", ""),
        score_percentage=quiz_data.get("scorePercentage", 0),
        correct_answers=quiz_data.get("correctAnswers", 0),
        total_questions=quiz_data.get("totalQuestions", 0),
        topics=quiz_data.get("topics", []),
        answers=quiz_data.get("answers", {}),
        passed=quiz_data.get("scorePercentage", 0) >= 70,
        time_taken_seconds=quiz_data.get("timeTakenSeconds", 0)
    )
    db.add(quiz)
    db.commit()
    db.refresh(quiz)
    return quiz


def issue_certificate(db: Session, user_id: int, cert_data: Dict[str, Any]) -> Certificate:
    """Issue certificate to user"""
    import uuid
    cert = Certificate(
        certificate_id=str(uuid.uuid4()),
        user_id=user_id,
        skill_name=cert_data.get("skill_name", ""),
        domain=cert_data.get("domain", ""),
        level_achieved=cert_data.get("level_achieved", 1),
        issued_date=datetime.utcnow(),
        expiry_date=cert_data.get("expiry_date"),
        certificate_url=cert_data.get("certificate_url"),
        qr_code_url=cert_data.get("qr_code_url"),
        verification_code=str(uuid.uuid4())[:8].upper()
    )
    db.add(cert)
    db.commit()
    db.refresh(cert)
    return cert


def get_user_progress(db: Session, user_id: int) -> List[ProgressTracking]:
    """Get all progress records for a user"""
    return db.query(ProgressTracking).filter(ProgressTracking.user_id == user_id).all()


def update_progress(db: Session, user_id: int, skill_name: str, domain: str, 
                   current_level: int, progress_percentage: int) -> ProgressTracking:
    """Update skill progress"""
    progress = db.query(ProgressTracking).filter(
        (ProgressTracking.user_id == user_id) & 
        (ProgressTracking.skill_name == skill_name)
    ).first()
    
    if not progress:
        progress = ProgressTracking(
            user_id=user_id,
            skill_name=skill_name,
            domain=domain,
            current_level=current_level,
            progress_percentage=progress_percentage
        )
    else:
        progress.current_level = current_level
        progress.progress_percentage = progress_percentage
        progress.updated_at = datetime.utcnow()
        
        if progress.milestone_dates is None:
            progress.milestone_dates = {}
        
        for milestone in [25, 50, 75, 100]:
            if progress_percentage >= milestone and str(milestone) not in progress.milestone_dates:
                progress.milestone_dates[str(milestone)] = datetime.utcnow().isoformat()
                progress.milestones_achieved += 1
                
        if progress_percentage == 100:
            progress.completed_at = datetime.utcnow()
    
    db.add(progress)
    db.commit()
    db.refresh(progress)
    return progress


def get_admin_stats(db: Session) -> AdminStats:
    """Calculate and return admin statistics"""
    from sqlalchemy import func
    
    total_users = db.query(func.count(User.id)).scalar() or 0
    total_quizzes = db.query(func.count(Quiz.id)).scalar() or 0
    avg_score = db.query(func.avg(Quiz.score_percentage)).scalar() or 0.0
    
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    active_users = db.query(func.count(func.distinct(Quiz.user_id))).filter(
        Quiz.completed_at >= thirty_days_ago
    ).scalar() or 0
    
    stats = AdminStats(
        total_users=total_users,
        active_users_30d=active_users,
        total_quizzes_taken=total_quizzes,
        avg_quiz_score=round(float(avg_score), 2),
        last_updated=datetime.utcnow()
    )
    
    db.add(stats)
    db.commit()
    db.refresh(stats)
    return stats


def save_assessment(db: Session, user_id: int, assessment_data: Dict[str, Any]) -> AssessmentResult:
    """Persist a new assessment result for the user"""
    result = AssessmentResult(
        user_id=user_id,
        role=assessment_data.get("role", ""),
        overall_score=assessment_data.get("overallScore", 0),
        domain_scores=assessment_data.get("domainScores", {}),
        skill_gaps=assessment_data.get("skillGaps", []),
        recommendations=assessment_data.get("recommendations", []),
        critical_gaps_count=assessment_data.get("criticalGapsCount", 0),
        insight=assessment_data.get("insight", ""),
        computed_at=datetime.utcnow(),
    )
    db.add(result)
    db.commit()
    db.refresh(result)
    return result


def get_latest_assessment(db: Session, user_id: int) -> Optional[AssessmentResult]:
    """Get the most recent assessment result for a user"""
    return (
        db.query(AssessmentResult)
        .filter(AssessmentResult.user_id == user_id)
        .order_by(AssessmentResult.computed_at.desc())
        .first()
    )
