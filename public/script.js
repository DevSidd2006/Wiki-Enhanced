// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing...');
    updateDebugStatus('Initializing page...');
    
    try {
        // Make sure content is visible first
        const content = document.querySelector('.content');
        const mainContainer = document.querySelector('.main-container');
        const featuredGrid = document.querySelector('.featured-section-grid');
        
        if (content) {
            console.log('Setting content visibility...');
            content.style.display = 'block';
            content.style.opacity = '1';
            content.style.visibility = 'visible';
            content.style.position = 'relative';
            content.style.zIndex = '1';
            content.style.width = '100%';
        } else {
            console.error('Content element not found');
        }
        
        if (mainContainer) {
            console.log('Setting main container visibility...');
            mainContainer.style.display = 'block';
            mainContainer.style.opacity = '1';
            mainContainer.style.visibility = 'visible';
            mainContainer.style.position = 'relative';
            mainContainer.style.zIndex = '1';
        } else {
            console.error('Main container element not found');
        }
        
        if (featuredGrid) {
            console.log('Setting featured grid visibility...');
            featuredGrid.style.display = 'grid';
            featuredGrid.style.opacity = '1';
            featuredGrid.style.visibility = 'visible';
        } else {
            console.error('Featured grid element not found');
        }
        
        // Load initial content
        console.log('Loading initial content...');
        loadFeaturedArticle();
        loadOnThisDay();
        showFact();
        
        // Initialize event listeners
        console.log('Initializing event listeners...');
        initializeEventListeners();
        
        // Double check visibility after content loads
        setTimeout(() => {
            console.log('Verifying content visibility...');
            if (content) {
                content.style.display = 'block';
                content.style.opacity = '1';
                content.style.visibility = 'visible';
            }
            if (mainContainer) {
                mainContainer.style.display = 'block';
                mainContainer.style.opacity = '1';
                mainContainer.style.visibility = 'visible';
            }
            if (featuredGrid) {
                featuredGrid.style.display = 'grid';
                featuredGrid.style.opacity = '1';
                featuredGrid.style.visibility = 'visible';
            }
            updateDebugStatus('Content visibility verified');
        }, 1000);
        
        updateDebugStatus('Page initialized successfully');
    } catch (error) {
        console.error('Initialization error:', error);
        updateDebugStatus('Error during initialization: ' + error.message);
    }
});

// Initialize all event listeners
function initializeEventListeners() {
    console.log('Initializing event listeners...');
    try {
        // Search functionality
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', getSearchSuggestions);
            searchInput.addEventListener('keydown', handleSearchKeydown);
        }

        // Navigation menu
        const navMenuBtn = document.getElementById('navMenuBtn');
        if (navMenuBtn) {
            navMenuBtn.addEventListener('click', () => {
                document.getElementById('navOverlay').classList.add('open');
            });
        }

        const closeNavOverlay = document.getElementById('closeNavOverlay');
        if (closeNavOverlay) {
            closeNavOverlay.addEventListener('click', () => {
                document.getElementById('navOverlay').classList.remove('open');
            });
        }

        // Next fact button
        const nextFactBtn = document.getElementById('next-fact-btn');
        if (nextFactBtn) {
            nextFactBtn.addEventListener('click', nextFact);
        }

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            const navOverlay = document.getElementById('navOverlay');
            if (navOverlay && e.target === navOverlay) {
                navOverlay.classList.remove('open');
            }

            const searchSuggestions = document.getElementById('searchSuggestions');
            const searchInput = document.getElementById('searchInput');
            if (searchSuggestions && e.target !== searchInput && e.target !== searchSuggestions) {
                searchSuggestions.style.display = 'none';
            }
        });
        
        console.log('Event listeners initialized successfully');
    } catch (error) {
        console.error('Error initializing event listeners:', error);
        updateDebugStatus('Error initializing event listeners: ' + error.message);
    }
}

// Add debug logging
const debugStatus = document.getElementById('debug-status');
function updateDebugStatus(message) {
    if (debugStatus) {
        debugStatus.textContent = message;
    }
    console.log(message);
}

// Search functionality
async function getSearchSuggestions() {
    const query = document.getElementById('searchInput').value.trim();
    const list = document.getElementById('searchSuggestions');
    list.innerHTML = "";

    if (query.length === 0) {
        list.style.display = 'none';
        return;
    }

    try {
        const response = await fetch(`https://en.wikipedia.org/w/api.php?action=opensearch&search=${encodeURIComponent(query)}&limit=10&namespace=0&format=json&origin=*`, {
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            },
            mode: 'cors'
        });
        const data = await response.json();
        const suggestions = data[1];

        if (suggestions.length > 0) {
            list.style.display = 'block';
            suggestions.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                li.onclick = () => {
                    document.getElementById('searchInput').value = item;
                    list.style.display = 'none';
                    searchWikipedia();
                };
                list.appendChild(li);
            });
        } else {
            list.style.display = 'none';
        }
    } catch (err) {
        console.error("Error fetching suggestions:", err);
        list.style.display = 'none';
    }
}

function handleSearchKeydown(e) {
    const suggestions = document.getElementById('searchSuggestions');
    const items = suggestions.getElementsByTagName('li');
    let currentIndex = -1;

    for (let i = 0; i < items.length; i++) {
        if (items[i].classList.contains('active')) {
            currentIndex = i;
            break;
        }
    }

    if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (currentIndex < items.length - 1) {
            items[currentIndex]?.classList.remove('active');
            items[currentIndex + 1].classList.add('active');
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (currentIndex > 0) {
            items[currentIndex]?.classList.remove('active');
            items[currentIndex - 1].classList.add('active');
        }
    } else if (e.key === 'Enter') {
        e.preventDefault();
        const activeItem = suggestions.querySelector('.active');
        if (activeItem) {
            document.getElementById('searchInput').value = activeItem.textContent;
            suggestions.style.display = 'none';
            searchWikipedia();
        } else {
            searchWikipedia();
        }
    }
}

// Gemini API Configuration
const GEMINI_API_KEY = 'AIzaSyAnnLUFH22h4DUCC7Rl8q94bQbNlcygqGM'; // Replace with your actual API key
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

// Article Summarization
async function summarizeArticle(articleText) {
    try {
        updateDebugStatus('Summarizing article...');
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `Please summarize the following article in 3-4 concise paragraphs, highlighting the key points and main ideas:\n\n${articleText}`
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API request failed with status ${response.status}`);
        }

        const data = await response.json();
        const summary = data.candidates[0].content.parts[0].text;
        
        updateDebugStatus('Summary generated successfully');
        return summary;
    } catch (error) {
        console.error('Error summarizing article:', error);
        updateDebugStatus('Error generating summary');
        return 'Failed to generate summary. Please try again later.';
    }
}

// Function to handle article summarization
async function handleArticleSummarization(articleTitle) {
    try {
        updateDebugStatus('Fetching article content...');
        
        // First, get the article content from Wikipedia
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleTitle)}`);
        if (!response.ok) {
            throw new Error('Failed to fetch article');
        }
        
        const data = await response.json();
        const articleText = data.extract;
        
        // Show loading state
        const summaryContainer = document.getElementById('articleContent');
        summaryContainer.innerHTML = '<div class="loading">Generating summary...</div>';
        
        // Generate summary using Gemini
        const summary = await summarizeArticle(articleText);
        
        // Display the summary
        summaryContainer.innerHTML = `
            <div class="article-summary">
                <h3>Summary of "${articleTitle}"</h3>
                <div class="summary-content">
                    ${summary.split('\n').map(paragraph => `<p>${paragraph}</p>`).join('')}
                </div>
                <div class="article-meta">
                    <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(articleTitle)}" target="_blank" class="read-more">
                        Read full article on Wikipedia
                    </a>
                </div>
            </div>
        `;
        
        // Generate table of contents
        generateTableOfContents();
        
    } catch (error) {
        console.error('Error processing article:', error);
        const summaryContainer = document.getElementById('articleContent');
        summaryContainer.innerHTML = `
            <div class="error-message">
                ❌ Failed to process article. Please try again.
            </div>
        `;
    }
}

// Modify the searchWikipedia function to use summarization
async function searchWikipedia() {
    const query = document.getElementById('searchInput').value.trim();
    if (!query) return;

    try {
        updateDebugStatus('Searching Wikipedia...');
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`);
        if (!response.ok) throw new Error('Article not found');
        
        const data = await response.json();
        const resultsDiv = document.getElementById('results');
        
        resultsDiv.innerHTML = `
            <h2>${data.title}</h2>
            ${data.thumbnail ? `<img src="${data.thumbnail.source}" alt="${data.title}" style="max-width:200px;float:right;margin-left:20px;">` : ''}
            <p>${data.extract}</p>
            <div class="article-meta">
                <button onclick="handleArticleSummarization('${data.title}')" class="summarize-button">
                    Generate AI Summary
                </button>
                <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(data.title)}" target="_blank">
                    Read full article
                </a>
            </div>
        `;
        
        resultsDiv.scrollIntoView({ behavior: 'smooth' });
        updateDebugStatus('Search completed');
    } catch (error) {
        const resultsDiv = document.getElementById('results');
        resultsDiv.innerHTML = `
            <div class="error-message">
                ❌ No results found for "${query}". Try a different search term.
            </div>
        `;
        updateDebugStatus('Search failed');
    }
}

// Add styles for the summarize button
const style = document.createElement('style');
style.textContent = `
    .summarize-button {
        padding: 8px 16px;
        background-color: #2196F3;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        margin-right: 10px;
        transition: background-color 0.3s;
    }
    
    .summarize-button:hover {
        background-color: #1976D2;
    }
    
    .article-summary {
        background: var(--card-bg);
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }
    
    .summary-content {
        line-height: 1.6;
        margin: 15px 0;
    }
    
    .article-meta {
        margin-top: 20px;
        display: flex;
        gap: 10px;
        align-items: center;
    }
    
    .read-more {
        color: var(--primary-color);
        text-decoration: none;
        font-weight: 500;
    }
    
    .read-more:hover {
        text-decoration: underline;
    }
`;
document.head.appendChild(style);

// Featured article loading
async function loadFeaturedArticle() {
    const featuredDiv = document.querySelector('.main-featured .featured-content');
    if (!featuredDiv) {
        console.error('Featured content div not found');
        return;
    }

    featuredDiv.innerHTML = '<div>Loading featured article...</div>';
    try {
        const today = new Date();
        const y = today.getFullYear();
        const m = String(today.getMonth() + 1).padStart(2, '0');
        const d = String(today.getDate()).padStart(2, '0');
        const url = `https://en.wikipedia.org/api/rest_v1/feed/featured/${y}/${m}/${d}`;
        console.log('Fetching featured article from:', url);
        
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            },
            mode: 'cors'
        });
        
        if (!res.ok) throw new Error(`Failed to fetch featured article: ${res.status}`);
        
        const data = await res.json();
        const article = data.tfa;
        
        featuredDiv.innerHTML = `
            <h3>${article.title}</h3>
            ${article.thumbnail ? `<img src="${article.thumbnail.source}" alt="${article.title}" style="max-width:120px;float:right;margin-left:16px;border-radius:8px;">` : ''}
            <p>${article.extract}</p>
            <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(article.title)}" target="_blank" style="color:var(--primary-color);font-weight:500;">
                Read full article
            </a>
        `;
    } catch (e) {
        console.error('Error loading featured article:', e);
        featuredDiv.innerHTML = '<div style="color:#dc3545;">Failed to load featured article.</div>';
    }
}

// On This Day loading
async function loadOnThisDay() {
    const otdDiv = document.querySelector('.onthisday-featured .onthisday-content');
    if (!otdDiv) {
        console.error('On This Day div not found');
        return;
    }

    otdDiv.innerHTML = '<div>Loading events...</div>';
    try {
        const today = new Date();
        const m = today.getMonth() + 1;
        const d = today.getDate();
        const url = `https://en.wikipedia.org/api/rest_v1/feed/onthisday/events/${m}/${d}`;
        console.log('Fetching On This Day events from:', url);
        
        const res = await fetch(url, {
            headers: {
                'Accept': 'application/json',
                'Origin': window.location.origin
            },
            mode: 'cors'
        });
        
        if (!res.ok) throw new Error(`Failed to fetch events: ${res.status}`);
        
        const data = await res.json();
        otdDiv.innerHTML = '<ul>' + data.events.slice(0, 5).map(ev =>
            `<li>${ev.year}: <span>${ev.text}</span></li>`
        ).join('') + '</ul>';
    } catch (e) {
        console.error('Error loading On This Day events:', e);
        otdDiv.innerHTML = '<div style="color:#dc3545;">Failed to load events.</div>';
    }
}

// Did You Know facts
const facts = [
    "... that an 1895 painting (pictured), depicting a woman clutching a crumpled letter, was described by a critic as 'a list of disasters'?",
    "... that Avi Yemini is one of seventeen children who were raised in an ultra-Orthodox Chabad family?",
    "... that Playboi Carti's song titled '2024' was first teased in 2023 and later officially released in 2025?",
    "... that Soemartini was appointed as the chief of the National Archives of Indonesia after working in the agency for a year?",
    "... that Home of a Rebel Sharpshooter was staged by moving a corpse?",
    "... that Wen Chia-ling, despite her family's initial opposition to her becoming an archer, helped Taiwan's team achieve its best-ever finish at the 2000 Summer Olympics?",
    "... that just two weeks after a Florida TV station began using a news helicopter, it crashed, killing two of three occupants?",
    "... that although the philosophical study of well-being dates back millennia, empirical research has intensified since the second half of the 20th century?",
    "... that the 1982 film The Second November was filmed in colour, but shown in black-and-white until 2012?"
];

let dykIndex = Math.floor(Math.random() * facts.length);

function showFact() {
    const factElement = document.getElementById("dyk-fact");
    if (factElement) {
        factElement.textContent = facts[dykIndex];
    }
}

function nextFact() {
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * facts.length);
    } while (newIndex === dykIndex && facts.length > 1);
    dykIndex = newIndex;
    showFact();
}

// Article modal functions
let currentArticleTitle = "";

function showArticleModal(title) {
    currentArticleTitle = title;
    const modal = document.getElementById('articleModal');
    const iframe = document.getElementById('articleIframe');
    iframe.src = `https://en.wikipedia.org/wiki/${encodeURIComponent(currentArticleTitle)}`;
    modal.style.display = 'flex';
}

function closeArticleModal() {
    const modal = document.getElementById('articleModal');
    const iframe = document.getElementById('articleIframe');
    iframe.src = "";
    modal.style.display = 'none';
}

// Search results modal functions
function showSearchResultsModal(html) {
    document.getElementById('modalResults').innerHTML = html;
    document.getElementById('searchResultsModal').style.display = 'flex';
}

function closeSearchResultsModal() {
    document.getElementById('searchResultsModal').style.display = 'none';
    document.getElementById('modalResults').innerHTML = '';
}

// Table of Contents generation
function generateTableOfContents() {
    const article = document.getElementById('articleContent');
    const toc = document.getElementById('tableOfContents');
    if (!article || !toc) return;
    
    const headings = article.querySelectorAll('h2, h3, h4, h5, h6');
    if (headings.length === 0) {
        toc.innerHTML = '';
        return;
    }
    
    let tocHtml = '<div class="toc-panel"><strong>Contents</strong><ul>';
    headings.forEach((heading, idx) => {
        if (!heading.id) heading.id = 'section-' + idx;
        tocHtml += `<li class="toc-level-${heading.tagName.toLowerCase()}"><a href="#${heading.id}">${heading.textContent}</a></li>`;
    });
    tocHtml += '</ul></div>';
    toc.innerHTML = tocHtml;
}

// Quiz Generator
async function generateQuiz(articleTitle) {
    try {
        updateDebugStatus('Generating quiz...');
        
        // First, get the article content
        const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(articleTitle)}`);
        if (!response.ok) throw new Error('Failed to fetch article');
        
        const data = await response.json();
        const articleText = data.extract;
        
        // Generate quiz using Gemini
        const quizPrompt = `Create a 5-question multiple choice quiz based on the following article. Format each question with 4 options (A, B, C, D) and mark the correct answer with an asterisk (*). Include a mix of factual and conceptual questions. Format the response as follows:

Question 1: [Question text]
A) [Option A]
B) [Option B]
C) [Option C]
D) [Option D]*

Question 2: [Question text]
A) [Option A]
B) [Option B]*
C) [Option C]
D) [Option D]

[Continue for all 5 questions]

Here's the article:\n\n${articleText}`;
        
        console.log('Sending quiz request to Gemini API...');
        const quizResponse = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: quizPrompt }]
                }]
            })
        });

        // First get the response as text
        const responseText = await quizResponse.text();
        console.log('Raw API Response:', responseText);

        // Check if the response is empty
        if (!responseText) {
            throw new Error('Empty response from API');
        }

        // Try to parse the JSON
        let quizData;
        try {
            quizData = JSON.parse(responseText);
        } catch (parseError) {
            console.error('JSON Parse Error:', parseError);
            console.error('Response that failed to parse:', responseText);
            throw new Error('Failed to parse API response: ' + parseError.message);
        }

        // Validate the response structure
        if (!quizData || typeof quizData !== 'object') {
            throw new Error('Invalid API response: not an object');
        }

        if (!quizData.candidates || !Array.isArray(quizData.candidates) || quizData.candidates.length === 0) {
            throw new Error('Invalid API response: missing or empty candidates array');
        }

        if (!quizData.candidates[0].content || !quizData.candidates[0].content.parts || !Array.isArray(quizData.candidates[0].content.parts)) {
            throw new Error('Invalid API response: missing or invalid content structure');
        }

        const quizText = quizData.candidates[0].content.parts[0].text;
        console.log('Generated Quiz Text:', quizText);
        
        if (!quizText) {
            throw new Error('No quiz text generated');
        }

        // Parse and display the quiz
        const quizContainer = document.getElementById('quizContent');
        const questions = quizText.split('\n\n').filter(q => q.trim());
        
        if (questions.length === 0) {
            throw new Error('No questions were generated');
        }

        let quizHTML = '<div class="quiz-container">';
        questions.forEach((question, index) => {
            const lines = question.split('\n');
            const questionText = lines[0].replace(/^\d+\.\s*/, '').trim();
            const options = lines.slice(1).filter(line => line.trim());
            
            if (options.length < 4) {
                console.warn(`Question ${index + 1} has fewer than 4 options`);
            }

            quizHTML += `
                <div class="quiz-question">
                    <h4>${index + 1}. ${questionText}</h4>
                    <div class="quiz-options">
                        ${options.map(option => {
                            const isCorrect = option.includes('*');
                            const cleanOption = option.replace('*', '').trim();
                            const optionLetter = cleanOption[0];
                            return `
                                <div class="quiz-option ${isCorrect ? 'correct' : ''}">
                                    <input type="radio" name="q${index}" id="q${index}${optionLetter}">
                                    <label for="q${index}${optionLetter}">${cleanOption}</label>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            `;
        });
        
        quizHTML += `
            <button onclick="checkQuizAnswers()" class="submit-quiz">Submit Answers</button>
            <div id="quiz-results"></div>
        </div>`;
        
        quizContainer.innerHTML = quizHTML;
        updateDebugStatus('Quiz generated successfully');
        
    } catch (error) {
        console.error('Error generating quiz:', error);
        const quizContainer = document.getElementById('quizContent');
        quizContainer.innerHTML = `
            <div class="error-message">
                ❌ Failed to generate quiz: ${error.message}
                <br>
                Please try again or contact support if the problem persists.
                <br>
                <button onclick="generateQuiz('${currentArticleTitle}')" class="retry-button">
                    Try Again
                </button>
            </div>
        `;
        updateDebugStatus('Error generating quiz: ' + error.message);
    }
}

// Q&A Bot
async function askQuestion(question, context) {
    try {
        updateDebugStatus('Processing question...');
        
        const qaPrompt = `Based on the following article context, please answer the question. If the answer cannot be found in the context, say "I cannot answer this question based on the provided context."\n\nContext: ${context}\n\nQuestion: ${question}`;
        
        const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: qaPrompt }]
                }]
            })
        });

        if (!response.ok) throw new Error('Failed to process question');
        
        const data = await response.json();
        const answer = data.candidates[0].content.parts[0].text;
        
        updateDebugStatus('Question answered');
        return answer;
        
    } catch (error) {
        console.error('Error processing question:', error);
        updateDebugStatus('Error processing question');
        return 'Sorry, I encountered an error while processing your question. Please try again.';
    }
}

// Quiz answer checking
function checkQuizAnswers() {
    const resultsDiv = document.getElementById('quiz-results');
    const questions = document.querySelectorAll('.quiz-question');
    let correctAnswers = 0;
    
    questions.forEach((question, index) => {
        const selectedOption = question.querySelector('input:checked');
        const correctOption = question.querySelector('.correct input');
        
        if (selectedOption && selectedOption === correctOption) {
            correctAnswers++;
            question.classList.add('correct-answer');
        } else if (selectedOption) {
            question.classList.add('wrong-answer');
        }
    });
    
    const score = (correctAnswers / questions.length) * 100;
    resultsDiv.innerHTML = `
        <div class="quiz-score">
            <h3>Quiz Results</h3>
            <p>You scored ${score.toFixed(1)}% (${correctAnswers} out of ${questions.length} correct)</p>
            ${score === 100 ? '<p>🎉 Perfect score! Well done!</p>' : ''}
        </div>
    `;
}

// Add styles for quiz and Q&A
const additionalStyles = `
    /* Quiz Styles */
    .quiz-container {
        background: var(--card-bg);
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }
    
    .quiz-question {
        margin-bottom: 20px;
        padding: 15px;
        border-radius: 8px;
        background: rgba(255,255,255,0.1);
    }
    
    .quiz-options {
        margin-top: 10px;
    }
    
    .quiz-option {
        margin: 8px 0;
        padding: 8px;
        border-radius: 4px;
        background: rgba(255,255,255,0.05);
        cursor: pointer;
    }
    
    .quiz-option:hover {
        background: rgba(255,255,255,0.1);
    }
    
    .quiz-option input {
        margin-right: 10px;
    }
    
    .quiz-option.correct {
        background: rgba(76,175,80,0.1);
    }
    
    .submit-quiz {
        padding: 10px 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        margin-top: 20px;
    }
    
    .submit-quiz:hover {
        background: var(--primary-hover);
    }
    
    .quiz-score {
        margin-top: 20px;
        padding: 15px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        text-align: center;
    }
    
    /* Q&A Styles */
    .qa-container {
        background: var(--card-bg);
        padding: 20px;
        border-radius: 8px;
        margin-top: 20px;
    }
    
    .qa-input {
        width: 100%;
        padding: 10px;
        margin-bottom: 10px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background: var(--input-bg);
        color: var(--text-color);
    }
    
    .qa-button {
        padding: 10px 20px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
    }
    
    .qa-button:hover {
        background: var(--primary-hover);
    }
    
    .qa-answer {
        margin-top: 20px;
        padding: 15px;
        background: rgba(255,255,255,0.1);
        border-radius: 8px;
        line-height: 1.6;
    }
`;

// Add the new styles to the existing style element
style.textContent += additionalStyles; 