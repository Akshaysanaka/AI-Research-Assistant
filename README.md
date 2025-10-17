# Research Collaboration Dashboard

A full-stack web application for research collaboration, featuring AI-powered matching, grant opportunities, and profile management.

## Features

- **AI Research Assistant**: Contextual AI chat for research guidance
- **Profile Management**: Upload CV and manage research profiles
- **Collaborator Matching**: AI-powered researcher matching
- **Grant Opportunities**: Browse and apply for research grants
- **Dashboard Analytics**: Research metrics and insights

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, MongoDB
- **AI Integration**: OpenAI API with local fallback

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd research-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create `.env` file in Backend directory:
```env
MONGO_URI=mongodb://localhost:27017/research-dashboard
PORT=3001
OPENAI_API_KEY=your-openai-key-here (optional)
CORS_ORIGIN=http://localhost:5173
```

4. Start the development servers:
```bash
npm run dev
```

This will start both frontend (http://localhost:5173) and backend (http://localhost:3001) servers.

## Deployment

### Option 1: Vercel (Frontend) + Railway/Heroku (Backend)

#### Frontend Deployment (Vercel)

1. Push your code to GitHub
2. Connect your GitHub repo to Vercel
3. Configure build settings:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`
4. Set environment variables in Vercel:
   - `VITE_API_URL`: Your backend URL (e.g., `https://your-backend.herokuapp.com`)

#### Backend Deployment (Railway)

1. Create a Railway account
2. Connect your GitHub repo
3. Railway will auto-detect Node.js app
4. Set environment variables in Railway dashboard
5. Deploy

### Option 2: Netlify (Frontend) + Render (Backend)

#### Frontend Deployment (Netlify)

1. Build the frontend:
```bash
npm run build
```

2. Deploy to Netlify:
   - Drag and drop the `Frontend/dist` folder to Netlify
   - Or connect GitHub repo and set build command to `npm run build`

#### Backend Deployment (Render)

1. Create Render account
2. Connect GitHub repo
3. Choose "Web Service"
4. Set build/runtime settings:
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Set environment variables

### Option 3: Docker Deployment

Create `Dockerfile` in root:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm install

# Copy source
COPY . .

# Build frontend
RUN npm run build

# Expose port
EXPOSE 3001

# Start backend
CMD ["npm", "run", "start"]
```

Create `docker-compose.yml`:

```yaml
version: '3.8'
services:
  app:
    build: .
    ports:
      - "3001:3001"
    environment:
      - MONGO_URI=mongodb://mongo:27017/research-dashboard
      - PORT=3001
    depends_on:
      - mongo

  mongo:
    image: mongo:5.0
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db

volumes:
  mongo_data:
```

Deploy with:
```bash
docker-compose up -d
```

## Environment Variables

### Backend (.env)

```env
MONGO_URI=mongodb://localhost:27017/research-dashboard
PORT=3001
OPENAI_API_KEY=your-openai-key-here
OPENAI_MODEL=gpt-4o-mini
CORS_ORIGIN=http://localhost:5173
```

### Frontend (Vercel/Netlify Environment Variables)

```env
VITE_API_URL=http://localhost:3001
```

## API Endpoints

- `GET /health` - Health check
- `POST /api/ai` - AI chat endpoint
- `GET /api/dashboard` - Dashboard data
- `POST /api/profile` - Profile management
- `GET /api/collaborators` - Collaborator data
- `GET /api/opportunities` - Grant opportunities

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License
