#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   AI Interview Prep - Local Setup    ${NC}"
echo -e "${BLUE}========================================${NC}\n"

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 18+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Node.js found: $(node --version)"
echo -e "${GREEN}✓${NC} npm found: $(npm --version)\n"

# Setup Backend
echo -e "${BLUE}Setting up Backend...${NC}"
cd Backend

if [ ! -f .env ]; then
    if [ ! -f .env.local ]; then
        echo -e "${YELLOW}Creating .env file...${NC}"
        cp .env.example .env 2>/dev/null || echo "PORT=5000
MONGO_URI=mongodb://localhost:27017/ai-interview-prep
JWT_SECRET=dev_jwt_secret_key
NODE_ENV=development" > .env
    else
        cp .env.local .env
    fi
fi

npm install
echo -e "${GREEN}✓${NC} Backend dependencies installed\n"

# Setup Frontend
echo -e "${BLUE}Setting up Frontend...${NC}"
cd ../Frontend/vite-project

if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local file...${NC}"
    echo "VITE_API_URL=http://localhost:5000" > .env.local
fi

npm install
echo -e "${GREEN}✓${NC} Frontend dependencies installed\n"

cd ../..

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ Setup Complete!${NC}"
echo -e "${BLUE}========================================${NC}\n"

echo -e "To start development servers, run:\n"
echo -e "${YELLOW}Terminal 1 (Backend):${NC}"
echo -e "  cd Backend && npm run dev\n"

echo -e "${YELLOW}Terminal 2 (Frontend):${NC}"
echo -e "  cd Frontend/vite-project && npm run dev\n"

echo -e "Then open: ${GREEN}http://localhost:5173${NC}\n"
