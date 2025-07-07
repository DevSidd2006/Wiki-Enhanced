# Wikipedia Enhanced 🌟

A modern, AI-powered Wikipedia interface with enhanced functionality including article summarization, intelligent Q&A, interactive quiz generation, and real-time news integration.

![Wikipedia Enhanced](https://img.shields.io/badge/Version-2.0-blue.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0.0-brightgreen.svg)

## 🚀 Features

### 🔍 **Enhanced Search & Discovery**
- Real-time Wikipedia search with smart suggestions
- Random article discovery with AI summaries
- Clean, responsive interface with dark mode support
- Smooth animations and intuitive navigation

### 📝 **AI-Powered Article Summarizer**
- Generate comprehensive summaries using Google's Gemini AI
- Multiple summary types: Quick, Detailed, Academic, Creative
- Customizable length and focus areas
- Cross-tool integration with Q&A and Quiz features

### 🤖 **Intelligent Q&A System**
- General AI chatbot for any topic
- Wikipedia-specific Q&A with article context
- Mode switching between chat and article Q&A
- Article selector with search functionality

### 🎯 **Interactive Quiz Generator**
- Generate custom quizzes from any Wikipedia article
- Multiple difficulty levels and question types
- Interactive quiz-taking with scoring system
- Customizable preferences (language, focus, length)
- Download/copy quiz functionality

### 📰 **Real-Time News Integration**
- Latest world news with category filtering
- Country-specific news options
- Responsive news cards with source attribution
- Integration with NewsAPI for real-time updates

### 📱 **Mobile-First Design**
- Fully responsive across all devices
- Touch-friendly interactions
- Optimized for mobile browsers
- Progressive Web App features

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **AI Integration**: Google Gemini API
- **APIs**: Wikipedia API, NewsAPI
- **Deployment**: Vercel-ready
- **Styling**: Custom CSS with mobile-first approach

## 📋 Prerequisites

- Node.js (version 18.0.0 or higher)
- npm or yarn package manager
- Google Gemini API key
- NewsAPI key (optional, fallback data provided)

## 🔧 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/wikipedia-enhanced.git
cd wikipedia-enhanced
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create a `.env` file in the root directory:
```env
OPENROUTER_API_KEY=your_openrouter_api_key_here
NEWS_API_KEY=your_news_api_key_here
```

**Getting API Keys:**
- **OpenRouter API**: Visit [OpenRouter.ai](https://openrouter.ai/keys) to get your API key
- **News API**: Visit [NewsAPI.org](https://newsapi.org/register) (free tier available)

### 4. Start the Development Server
```bash
npm start
# or
npm run dev
```

Visit `http://localhost:3000` to view the application.

## 📚 Usage Guide

### 🏠 **Main Dashboard**
- Search Wikipedia articles with real-time suggestions
- Access all features through the navigation menu
- View latest news in the integrated news section

### 📄 **Article Summarizer**
1. Navigate to `/summarizer` or click "Summarizer" in the menu
2. Enter a Wikipedia topic or paste article text
3. Customize summary preferences (type, length, focus)
4. Generate AI-powered summaries
5. Use cross-tool actions to create quizzes or ask questions

### 💬 **Q&A System**
1. Navigate to `/qa` or click "Q&A" in the menu
2. Choose between General Chat or Wikipedia Q&A mode
3. For Wikipedia mode: select an article using the search function
4. Ask questions and receive AI-generated answers
5. Context is maintained throughout the conversation

### 🎮 **Quiz Generator**
1. Navigate to `/quiz` or click "Quiz" in the menu
2. Enter a topic or use URL parameters from other tools
3. Customize quiz preferences (difficulty, type, questions count)
4. Generate the quiz and choose your interaction mode:
   - **Take Quiz**: Interactive quiz-taking with scoring
   - **View Questions**: Study format for printing/review
   - **Demo Quiz**: Try sample questions

### 📰 **News Section**
1. Navigate to `/news` or view on the main page
2. Filter by category (general, business, technology, etc.)
3. Select country for localized news
4. Click articles to read from original sources

## 🚀 Deployment

### Vercel Deployment (Recommended)
1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `OPENROUTER_API_KEY`
   - `NEWS_API_KEY`
4. Deploy with one click

### Manual Deployment
1. Build the project: `npm run build` (if build script exists)
2. Upload files to your hosting provider
3. Configure environment variables on your server
4. Start the application: `npm start`

## 📁 Project Structure

```
wikipedia-enhanced/
├── api/                    # API endpoints
│   ├── news.js            # News API handler
│   ├── qa.js              # Q&A API handler
│   ├── quiz.js            # Quiz API handler
│   └── summarize.js       # Summarizer API handler
├── public/                 # Static files
│   ├── index.html         # Main dashboard
│   ├── news.html          # News page
│   ├── qa.html            # Q&A interface
│   ├── quiz.html          # Quiz generator
│   ├── summarizer.html    # Article summarizer
│   ├── random.html        # Random articles
│   ├── styles.css         # Global styles
│   └── script.js          # Main JavaScript
├── .env.example           # Environment variables template
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
├── README.md             # Project documentation
├── test-server.js        # Development server
└── vercel.json           # Vercel configuration
```

## 🎨 Customization

### Adding New Features
1. Create new API endpoints in the `api/` directory
2. Add corresponding HTML pages in `public/`
3. Update the navigation in existing pages
4. Add routes in `test-server.js`

### Styling
- Edit `public/styles.css` for global styles
- The design is mobile-first and fully responsive
- CSS variables are used for easy theming

### AI Prompts
- Modify prompts in API files to customize AI behavior
- Each API endpoint has configurable prompt templates
- Support for multiple AI providers can be added

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- [Live Demo](https://your-demo-link.vercel.app)
- [API Documentation](https://github.com/yourusername/wikipedia-enhanced/wiki)
- [Issue Tracker](https://github.com/yourusername/wikipedia-enhanced/issues)

## 📧 Support

For support, questions, or feedback:
- Create an issue on GitHub
- Email: your.email@example.com
- Twitter: [@yourusername](https://twitter.com/yourusername)

---

**Made with ❤️ using AI and modern web technologies**
2. Enter a Wikipedia topic and fetch the article
3. Ask any question about the article
4. Get AI-powered answers

### Random Articles
1. Click the "Random Articles" link in the navigation
2. Use "Get Random Article" to discover new content
3. Get summaries of random articles
4. Save interesting finds for later

### Quiz Generator
1. Click the "Quiz Generator" link in the navigation
2. Enter a Wikipedia topic and fetch the article
3. Select the number of questions (3, 5, or 10)
4. Click "Generate Quiz" to create a quiz
5. Answer the questions and submit to see your score

## 🎨 Design Features

### Responsive Layout
- Adapts to all screen sizes
- Mobile-friendly interface
- Optimized for touch and mouse input

### Dark Mode
- Automatic system preference detection
- Manual toggle available
- Preserves user preference

### Animations
- Smooth scrolling effects
- Loading indicators
- Hover effects
- Progressive disclosure

## 🔧 Technical Details

### APIs Used
- Wikipedia REST API
- Hugging Face AI Models
  - BART for summarization
  - Mixtral-8x7B-Instruct for Q&A and quiz generation

### Technologies
- HTML5
- CSS3 (with CSS Variables)
- JavaScript (ES6+)
- Vercel Serverless Functions
- Hugging Face Inference API

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Wikipedia for their comprehensive API
- Hugging Face for their AI models
- Vercel for hosting and serverless functions
- All contributors who have helped improve this project

## 📞 Support

For support, please open an issue in the GitHub repository or contact the maintainers.

## 🚀 Future Enhancements

- [ ] User accounts and history
- [ ] Article bookmarks
- [ ] Custom themes
- [ ] More AI-powered features
- [ ] Offline support
- [ ] Browser extension
- [ ] Mobile app

---

Made with ❤️ by Siddhartha Kushwaha 