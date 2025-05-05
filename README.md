# Wikipedia Enhanced

A modern, feature-rich Wikipedia interface with enhanced functionality including article summarization, Q&A capabilities, random article discovery, and AI-powered quiz generation.

## 🌟 Features

### 1. Modern Search Interface
- Real-time search suggestions
- Clean, responsive design
- Dark mode support
- Smooth animations and transitions

### 2. Article Summarizer
- Quick article summaries using AI
- Clean, readable formatting
- Links to full Wikipedia articles
- Error handling and loading states

### 3. Q&A Bot
- Ask questions about any Wikipedia article
- AI-powered answers using Hugging Face
- Intuitive interface
- Real-time feedback

### 4. Random Articles
- Discover random Wikipedia articles
- Get quick summaries
- Save interesting finds
- Clean card-based layout

### 5. Quiz Generator
- Generate multiple-choice quizzes from any article
- Customizable number of questions (3, 5, or 10)
- AI-powered question generation
- Instant scoring and feedback
- Clean, interactive interface

### 6. User Experience
- Responsive design for all devices
- Dark mode support
- Smooth animations
- Keyboard shortcuts
- Progressive disclosure for complex content

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection
- Node.js (for local development)
- Vercel account (for deployment)

### Local Development
1. Clone the repository:
```bash
git clone https://github.com/yourusername/wikipedia-enhanced.git
```

2. Navigate to the project directory:
```bash
cd wikipedia-enhanced
```

3. Install dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with your Hugging Face API key:
```env
HUGGING_FACE_API_KEY=your_api_key_here
```

5. Run the development server:
```bash
npm run dev
```

### Deployment to Vercel
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the following environment variables in Vercel:
   - `HUGGING_FACE_API_KEY`: Your Hugging Face API key
4. Deploy your project

## 📖 Usage

### Main Page
- Use the search bar to find Wikipedia articles
- Get real-time suggestions as you type
- Press Enter or click Search to view results

### Article Summarizer
1. Click the "Summarizer" link in the navigation
2. Enter a Wikipedia topic
3. Click "Fetch Article" or press Enter
4. View the AI-generated summary

### Q&A Bot
1. Click the "Q&A Bot" link in the navigation
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