# LehrKI

A comprehensive educational platform with AI-powered features.

## Project Structure

```
LehrKI/
├── backend/           # Backend API and services
│   ├── app/
│   │   ├── api/       # API routes
│   │   ├── core/      # Core functionality (auth, database)
│   │   ├── models/    # Data models and schemas
│   │   ├── services/  # Business logic services
│   │   └── utils/     # Utility functions
│   └── tests/         # Backend tests
├── frontend/          # React frontend application
├── docs/              # Documentation
└── scripts/           # Deployment and utility scripts
```

## Getting Started

### Backend
```bash
cd backend
pip install -r requirements.txt
python app/main.py
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```