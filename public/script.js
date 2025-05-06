// Theme handling
function initTheme() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '🌓';
    themeToggle.setAttribute('aria-label', 'Toggle dark mode');
    document.body.appendChild(themeToggle);
  
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);
    });
  }
  
  // Table of Contents
  function createTableOfContents() {
    const articleContent = document.querySelector('.article-content');
    const tocContainer = document.querySelector('.toc-panel');
    
    if (!articleContent || !tocContainer) return;
  
    const headings = articleContent.querySelectorAll('h2, h3, h4, h5, h6');
    if (headings.length === 0) {
      tocContainer.style.display = 'none';
      return;
    }
  
    const tocList = document.createElement('ul');
    let currentLevel = 2; // Start with h2
    let lastLevel = currentLevel;
  
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));
      const id = `section-${index}`;
      heading.id = id;
  
      const listItem = document.createElement('li');
      listItem.className = `toc-level-h${level}`;
      
      const link = document.createElement('a');
      link.href = `#${id}`;
      link.textContent = heading.textContent;
      link.addEventListener('click', (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
  
      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
  
    tocContainer.innerHTML = '<h3>Table of Contents</h3>';
    tocContainer.appendChild(tocList);
  
    // Set up Intersection Observer for active section tracking
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id = entry.target.id;
        const link = tocContainer.querySelector(`a[href="#${id}"]`);
        if (link) {
          if (entry.isIntersecting) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        }
      });
    }, {
      rootMargin: '-20% 0px -50% 0px',
      threshold: 0
    });
  
    headings.forEach(heading => observer.observe(heading));
  }
  
  // Update the searchWikipedia function to redirect overlay results to Wikipedia pages
  function searchWikipedia() {
    const query = document.getElementById("searchInput").value.trim();
    if (!query) {
        showSearchResultsModal('<p>Please enter a search term.</p>');
        return;
    }
    const url = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&format=json&origin=*`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            const results = data.query.search;
            if (results.length === 0) {
                showSearchResultsModal('<p>No results found.</p>');
                return;
            }
            const resultsHtml = results.map(item => {
                const wikiUrl = `https://en.wikipedia.org/wiki/${encodeURIComponent(item.title)}`;
                return `
                    <div class="result-item" style="cursor:pointer;" onclick="window.open('${wikiUrl}', '_blank')">
                        <a style='pointer-events:none;color:inherit;text-decoration:none;font-weight:bold;'>${item.title}</a>
                        <p style='pointer-events:none;color:inherit;'>${item.snippet}...</p>
                    </div>
                `;
            }).join('');
            showSearchResultsModal(resultsHtml);
        })
        .catch(error => {
            showSearchResultsModal('<p>Error fetching data. Please try again later.</p>');
            console.error("Error:", error);
        });
  }
  
  // Scrolling Animations
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -10px 0px' // More lenient margin
    });
  
    const elements = document.querySelectorAll('.content > *');
    elements.forEach(element => {
      element.classList.add('visible'); // Ensure visibility by default
      observer.observe(element);
    });
  
    // Fallback: Ensure all elements are visible after a short delay
    setTimeout(() => {
      elements.forEach(element => {
        if (!element.classList.contains('visible')) {
          element.classList.add('visible');
        }
      });
    }, 500);
  }
  
  // Progressive Disclosure
  function initProgressiveDisclosure() {
    document.querySelectorAll('.disclosure-header').forEach(header => {
      header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.disclosure-icon');
        
        content.classList.toggle('expanded');
        icon.classList.toggle('expanded');
      });
    });
  }
  
  // Content Recommendations
  function loadRecommendations() {
    // Simulated reading history (in a real app, this would come from user data)
    const readingHistory = [
      { title: 'History of Computing', url: '#' },
      { title: 'Artificial Intelligence', url: '#' },
      { title: 'Machine Learning', url: '#' }
    ];
  
    // Simulated related topics (in a real app, this would come from article analysis)
    const relatedTopics = [
      { title: 'Computer Science', url: '#' },
      { title: 'Data Science', url: '#' },
      { title: 'Neural Networks', url: '#' }
    ];
  
    const readingHistoryContainer = document.getElementById('readingHistory');
    const relatedTopicsContainer = document.getElementById('relatedTopics');
  
    // Render reading history recommendations
    readingHistoryContainer.innerHTML = readingHistory.map(item => `
      <div class="recommendation-item">
        <a href="${item.url}">
          <span class="icon">📚</span>
          <span>${item.title}</span>
        </a>
      </div>
    `).join('');
  
    // Render related topics
    relatedTopicsContainer.innerHTML = relatedTopics.map(item => `
      <div class="recommendation-item">
        <a href="${item.url}">
          <span class="icon">🔗</span>
          <span>${item.title}</span>
        </a>
      </div>
    `).join('');
  }
  
  // Article Summarizer
  async function fetchAndSummarize() {
    const query = document.getElementById("summarizerInput").value.trim();
    const contentDiv = document.getElementById("articleContent");
    const summaryDiv = document.getElementById("articleSummary");
  
    // Clear previous results
    contentDiv.innerHTML = "";
    summaryDiv.innerHTML = "";
  
    if (!query) {
      contentDiv.innerHTML = '<div class="error-message">❌ Please enter a topic to summarize.</div>';
      return;
    }
  
    try {
      // Show loading state for article fetch
      contentDiv.innerHTML = '<div class="loading">⏳ Fetching article from Wikipedia...</div>';
      
      // Fetch article content from Wikipedia
      const wikiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(query)}`;
      const wikiResponse = await fetch(wikiUrl);
      
      if (!wikiResponse.ok) {
        throw new Error(`Wikipedia API error: ${wikiResponse.status}`);
      }
      
      const wikiData = await wikiResponse.json();
  
      if (!wikiData.extract) {
        contentDiv.innerHTML = `<div class="error-message">❌ No article found for "${query}". Try a different topic.</div>`;
        return;
      }
  
      // Display the article content
      contentDiv.innerHTML = `
        <h3>📄 Article Content</h3>
        <p>${wikiData.extract}</p>
        <div class="article-meta">
          <a href="https://en.wikipedia.org/wiki/${encodeURIComponent(wikiData.title)}" target="_blank" class="read-more">
            Read full article on Wikipedia
          </a>
        </div>
      `;
  
      // Show loading state for summarization
      summaryDiv.innerHTML = '<div class="loading">⏳ Generating summary...</div>';
  
      // Send to our serverless function for summarization
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleText: wikiData.extract
        })
      });
  
      if (!response.ok) {
        throw new Error(`Summarization API error: ${response.status}`);
      }
  
      const data = await response.json();
  
      // Display the summary
      summaryDiv.innerHTML = `
        <h3>📝 Summary</h3>
        <p>${data.summary}</p>
        <div class="summary-meta">
          <span class="summary-length">${data.summary.split(' ').length} words</span>
        </div>
      `;
  
    } catch (error) {
      console.error("Summarization error:", error);
      const errorMessage = error.message.includes("API error") 
        ? "❌ Error connecting to the summarization service. Please try again later."
        : `❌ Error: ${error.message}`;
      
      summaryDiv.innerHTML = `<div class="error-message">${errorMessage}</div>`;
    }
  }
  
  // Update the Q&A function
  async function askQuestion() {
    const questionInput = document.getElementById("questionInput");
    const question = questionInput.value.trim();
    
    if (!question) {
      showMessage("Please enter a question.", "bot");
      return;
    }
  
    if (!articleText) {
      showMessage("Please search for an article first.", "bot");
      return;
    }
  
    showMessage(question, "user");
    questionInput.value = "";
    showMessage("Thinking...", "bot", true);
  
    try {
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleTitle: currentArticleTitle,
          articleText: articleText,
          question: question
        })
      });
  
      if (!response.ok) {
        throw new Error(`Q&A API error: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Remove the loading message
      const chatContainer = document.getElementById("chatContainer");
      chatContainer.removeChild(chatContainer.lastChild);
      
      showMessage(data.answer, "bot");
      generateSuggestedQuestions();
    } catch (error) {
      console.error('Error:', error);
      showMessage("Sorry, I encountered an error while processing your question. Please try again.", "bot");
    }
  }
  
  // Update the quiz generation function
  async function generateQuiz() {
    const numQuestions = document.getElementById("numQuestions").value;
    const quizDiv = document.getElementById("quiz");
    
    if (!articleText) {
      quizDiv.innerHTML = '<div class="error-message">❌ Please search for an article first.</div>';
      return;
    }
  
    quizDiv.innerHTML = '<div class="loading">⏳ Generating quiz...</div>';
  
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          articleTitle: currentArticleTitle,
          articleText: articleText,
          numQuestions: parseInt(numQuestions)
        })
      });
  
      if (!response.ok) {
        throw new Error(`Quiz API error: ${response.status}`);
      }
  
      const data = await response.json();
      displayQuiz(data.questions);
    } catch (error) {
      console.error('Error:', error);
      quizDiv.innerHTML = '<div class="error-message">❌ Failed to generate quiz. Please try again.</div>';
    }
  }
  
  // Initialize everything when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    createTableOfContents();
    initScrollAnimations();
    initProgressiveDisclosure();
    loadRecommendations();
    
    // Add event listener for Enter key in summarizer input
    document.getElementById('summarizerInput').addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        fetchAndSummarize();
      }
    });
  });