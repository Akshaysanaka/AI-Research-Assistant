const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(cors({
	origin: process.env.CORS_ORIGIN?.split(',').map(s => s.trim()) || '*',
	methods: ['GET', 'POST', 'OPTIONS'],
	allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '2mb' }));

app.get('/health', (req, res) => {
	res.json({ status: 'ok', service: 'backend', time: new Date().toISOString() });
});

// Routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');
const dashboardRoutes = require('./routes/dashboard');
const searchRoutes = require('./routes/search');
const collaboratorsRoutes = require('./routes/collaborators');
const opportunitiesRoutes = require('./routes/opportunities');

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/collaborators', collaboratorsRoutes);
app.use('/api/opportunities', opportunitiesRoutes);

// Enhanced AI agent handler with research dashboard context
app.post('/api/ai', async (req, res) => {
	try {
		const { messages, data } = req.body || {};

		if (!Array.isArray(messages) || messages.length === 0) {
			return res.status(400).json({ error: 'messages must be a non-empty array' });
		}

		const googleKey = process.env.GOOGLE_API_KEY;
		const useGoogle = Boolean(googleKey);

		if (useGoogle) {
			try {
				// Lazy load to avoid requiring the dep if not installed
				const { GoogleGenerativeAI } = require('@google/generative-ai');
				const genAI = new GoogleGenerativeAI(googleKey);

				const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

				const systemPreamble = `You are an AI research assistant for a research collaboration platform. You have access to user profiles, collaborators, grants, and research data. Be helpful, concise, and actionable. When asked questions, provide direct answers based on the available data. If no data is provided, give general research advice. Always be professional and encouraging for researchers.`;

				// Convert messages to Gemini format with system message first
				const history = [
					{ role: 'user', parts: [{ text: systemPreamble }] },
					{ role: 'model', parts: [{ text: 'I understand. I am a research assistant AI that helps with collaboration platforms, profiles, grants, and research data. I will be helpful, concise, and professional.' }] },
					...messages.slice(0, -1).map(msg => ({
						role: msg.role === 'assistant' ? 'model' : 'user',
						parts: [{ text: msg.content }]
					}))
				];

				const lastMessage = messages[messages.length - 1];
				const prompt = lastMessage.content + (data ? `\n\nHere is additional JSON data to consider:\n${JSON.stringify(data).slice(0, 6000)}` : '');

				const chat = model.startChat({
					history
				});

				const result = await chat.sendMessage(prompt);
				const text = result.response.text() || 'No response';
				return res.json({ ok: true, provider: 'google', message: text });
			} catch (err) {
				// Fall through to local agent on any Google API error
				console.error('Google API error, falling back to local agent:', err?.message || err);
			}
		}

		// Enhanced local agent fallback with research context
		try {
			const lastUser = [...messages].reverse().find(m => m.role === 'user');
			const userText = typeof lastUser?.content === 'string' ? lastUser.content : JSON.stringify(lastUser?.content || '');

			let insights = [];
			let response = '';

			if (data) {
				try {
					if (data.collaborators && Array.isArray(data.collaborators)) {
						insights.push(`Found ${data.collaborators.length} potential collaborators`);
						const topMatch = data.collaborators.find(c => c.matchScore);
						if (topMatch) insights.push(`Top match: ${topMatch.name} (${topMatch.matchScore}% match)`);
					}
					if (data.grants && Array.isArray(data.grants)) {
						insights.push(`Found ${data.grants.length} grant opportunities`);
						const urgentGrants = data.grants.filter(g => g.deadline && new Date(g.deadline) < new Date(Date.now() + 30*24*60*60*1000));
						if (urgentGrants.length) insights.push(`${urgentGrants.length} grants due within 30 days`);
					}
					if (data.profile) {
						insights.push(`Profile: ${data.profile.name || 'Researcher'} with ${data.profile.publications || 0} publications`);
					}
				} catch (_) {
					insights.push('Could not parse provided data');
				}
			}

			// Generate contextual response based on user query
			const query = userText.toLowerCase();

			if (query.includes('john doe') || query.includes('dr. john doe') || query.includes('my profile') || query.includes('about me')) {
				response = 'Dr. John Doe is an Associate Professor in Computer Science with 38 publications and 5 grants awarded. His research interests include Machine Learning, Natural Language Processing, Computer Vision, AI Ethics, and Deep Learning. He has a 94% collaboration success rate and has been awarded $2.4M in total grants. Would you like me to help you find collaborators or grant opportunities that match his research interests?';
			} else if (query.includes('grant') || query.includes('funding')) {
				response = insights.length ? `Based on your data: ${insights.join('. ')}. I recommend reviewing grant deadlines and matching your research interests to available opportunities.` : 'I can help you find grant opportunities. Please provide more details about your research area or check the Grants tab for current opportunities.';
			} else if (query.includes('collaborat') || query.includes('partner')) {
				response = insights.length ? `Collaboration insights: ${insights.join('. ')}. Consider reaching out to high-match researchers for potential partnerships.` : 'I can help you find research collaborators. Check the Collaborators tab for AI-matched researchers based on your profile.';
			} else if (query.includes('profile') || query.includes('cv')) {
				response = insights.length ? `Your profile summary: ${insights.join('. ')}. Make sure your research interests are up to date for better matches.` : 'Your research profile helps us find better matches. Update your profile in the Profile tab with your latest publications and interests.';
			} else if (query.includes('search') || query.includes('find')) {
				response = 'Use the search bar at the top for semantic search across researchers and opportunities. I can also help analyze your search results.';
			} else {
				response = insights.length ? `Here's what I found in your data: ${insights.join('. ')}. How else can I assist with your research?` : 'I\'m your AI research assistant. I can help with finding collaborators, grant opportunities, profile optimization, and research insights. What would you like to know?';
			}

			return res.json({ ok: true, provider: 'local', message: response });
		} catch (localError) {
			console.error('Local agent error:', localError);
			return res.status(500).json({ error: 'local_agent_error', message: 'Failed to process request with local agent' });
		}
	} catch (error) {
		console.error(error);
		return res.status(500).json({ error: 'internal_error' });
	}
});

app.listen(port, () => {
	console.log(`Backend running on http://localhost:${port}`);
});


