// Advanced Article Viewer - Shared functionality for all pages
// This file provides the advanced article viewer with AI integration

class AdvancedArticleViewer {
  constructor() {
    this.currentArticleTitle = "";
    this.selectedText = '';
    this.isInitialized = false;
  }

  // Initialize the viewer (call this on page load)
  init() {
    if (this.isInitialized) return;
    
    // Add event listeners for closing modal and hiding toolbar
    document.addEventListener('mousedown', (e) => {
      const toolbar = document.getElementById('selection-toolbar');
      if (toolbar && !toolbar.contains(e.target) && !e.target.closest('#viewer-content')) {
        toolbar.style.display = 'none';
      }
    });

    this.isInitialized = true;
  }

  // Main function to show article in advanced viewer
  async showArticleModal(articleTitle = null) {
    if (articleTitle) {
      this.currentArticleTitle = articleTitle;
    }
    
    if (!this.currentArticleTitle) return;
    
    const modal = document.getElementById('articleModal');
    const titleEl = document.getElementById('viewer-title');
    const contentEl = document.getElementById('viewer-content');
    const tocEl = document.getElementById('viewer-toc');

    if (!modal || !titleEl || !contentEl || !tocEl) {
      console.error('Advanced viewer elements not found. Make sure the modal structure is correct.');
      return;
    }

    // Show modal and loading state
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    titleEl.textContent = 'Loading...';
    contentEl.innerHTML = `
      <div style="text-align: center; padding: 50px;">
        <div class="loader">
          <div class="box1"></div>
          <div class="box2"></div>
          <div class="box3"></div>
        </div>
        <span style="margin-left: 12px;">Loading article content...</span>
      </div>
    `;
    tocEl.innerHTML = '';

    try {
      // Fetch Wikipedia article content using the parse API
      const response = await fetch(`https://en.wikipedia.org/w/api.php?action=parse&page=${encodeURIComponent(this.currentArticleTitle)}&prop=text&formatversion=2&format=json&origin=*`);
      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.info || 'Failed to load article');
      }

      const articleHtml = data.parse.text;
      
      // Clean and process the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = articleHtml;
      
      // Remove unwanted elements
      tempDiv.querySelectorAll('.mw-editsection, .navbox, .metadata, .ambox').forEach(el => el.remove());
      
      // Fix relative links to point to Wikipedia
      tempDiv.querySelectorAll('a[href^="/wiki/"]').forEach(link => {
        link.href = 'https://en.wikipedia.org' + link.getAttribute('href');
        link.target = '_blank';
      });

      // Fix image sources
      tempDiv.querySelectorAll('img').forEach(img => {
        const src = img.getAttribute('src');
        if (src && src.startsWith('//')) {
          img.src = 'https:' + src;
        }
      });

      titleEl.textContent = data.parse.title;
      contentEl.innerHTML = tempDiv.innerHTML;

      // Generate Table of Contents
      this.createTableOfContents(contentEl, tocEl);

      // Initialize text selection functionality
      this.initializeTextSelection();

    } catch (error) {
      console.error('Error loading article:', error);
      contentEl.innerHTML = `
        <div style="text-align: center; padding: 50px; color: var(--error-color);">
          <h3>❌ Failed to load article</h3>
          <p>${error.message}</p>
          <button onclick="articleViewer.showArticleModal()" style="margin-top: 15px; padding: 8px 16px; background: var(--accent-primary); color: white; border: none; border-radius: 4px; cursor: pointer;">Try Again</button>
        </div>
      `;
    }
  }

  createTableOfContents(contentEl, tocEl) {
    const headings = contentEl.querySelectorAll('h2, h3');
    if (headings.length === 0) {
      tocEl.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No sections found</p>';
      return;
    }

    const tocList = document.createElement('ul');
    headings.forEach((heading, index) => {
      // Create unique ID for heading
      const id = `heading-${index}`;
      heading.id = id;

      const listItem = document.createElement('li');
      listItem.className = `toc-level-${heading.tagName.toLowerCase()}`;
      
      const link = document.createElement('a');
      link.href = `#${id}`;
      
      // Get clean heading text
      const headlineEl = heading.querySelector('.mw-headline');
      const headingText = headlineEl ? headlineEl.textContent : heading.textContent;
      link.textContent = headingText.trim();
      
      link.onclick = (e) => {
        e.preventDefault();
        heading.scrollIntoView({ behavior: 'smooth', block: 'start' });
      };

      listItem.appendChild(link);
      tocList.appendChild(listItem);
    });
    
    tocEl.appendChild(tocList);
  }

  initializeTextSelection() {
    const viewerContent = document.getElementById('viewer-content');
    const toolbar = document.getElementById('selection-toolbar');

    if (!viewerContent || !toolbar) return;

    // Remove existing listeners to prevent duplicates
    viewerContent.removeEventListener('mouseup', this.handleTextSelection.bind(this));
    
    viewerContent.addEventListener('mouseup', this.handleTextSelection.bind(this));
  }

  handleTextSelection(e) {
    const toolbar = document.getElementById('selection-toolbar');
    this.selectedText = window.getSelection().toString().trim();
    
    if (this.selectedText.length > 10) {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      toolbar.style.left = `${rect.left + window.scrollX + (rect.width / 2) - (toolbar.offsetWidth / 2)}px`;
      toolbar.style.top = `${rect.top + window.scrollY - toolbar.offsetHeight - 10}px`;
      toolbar.style.display = 'block';
    } else {
      toolbar.style.display = 'none';
    }
  }

  closeArticleModal() {
    const modal = document.getElementById('articleModal');
    const toolbar = document.getElementById('selection-toolbar');
    
    if (modal) modal.style.display = 'none';
    if (toolbar) toolbar.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    // Clear selection
    if (window.getSelection) {
      window.getSelection().removeAllRanges();
    }
  }

  // AI Integration Functions for Text Selection
  async summarizeSelectedText() {
    if (!this.selectedText) return;
    
    const toolbar = document.getElementById('selection-toolbar');
    toolbar.innerHTML = '<div style="padding: 8px;">📝 Summarizing...</div>';
    
    try {
      const response = await fetch('/api/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          articleText: this.selectedText, 
          summaryType: 'brief',
          length: 'short'
        })
      });
      
      const data = await response.json();
      this.showAIResult('Summary', data.summary);
      
    } catch (error) {
      this.showAIResult('Error', 'Failed to summarize text: ' + error.message);
    }
    
    toolbar.style.display = 'none';
  }

  async explainSelectedText() {
    if (!this.selectedText) return;
    
    const toolbar = document.getElementById('selection-toolbar');
    toolbar.innerHTML = '<div style="padding: 8px;">❓ Explaining...</div>';
    
    try {
      const question = `Can you explain "${this.selectedText}" in simple terms?`;
      const response = await fetch('/api/qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: question, 
          chatMode: 'general' 
        })
      });
      
      const data = await response.json();
      this.showAIResult('Explanation', data.answer);
      
    } catch (error) {
      this.showAIResult('Error', 'Failed to explain text: ' + error.message);
    }
    
    toolbar.style.display = 'none';
  }

  quizSelectedText() {
    if (!this.selectedText) return;
    
    // Open quiz page with selected text as context
    const quizUrl = `quiz.html?text=${encodeURIComponent(this.selectedText)}&title=${encodeURIComponent(this.currentArticleTitle + ' - Selected Text')}`;
    window.open(quizUrl, '_blank');
    
    const toolbar = document.getElementById('selection-toolbar');
    if (toolbar) toolbar.style.display = 'none';
  }

  showAIResult(title, content) {
    // Create a temporary result modal
    const resultModal = document.createElement('div');
    resultModal.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: var(--surface-bg);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 20px;
      max-width: 500px;
      max-height: 400px;
      overflow-y: auto;
      z-index: 10002;
      box-shadow: var(--shadow-strong);
    `;
    
    resultModal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
        <h3 style="margin: 0; color: var(--accent-primary);">${title}</h3>
        <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 1.5em; cursor: pointer; color: var(--text-muted);">&times;</button>
      </div>
      <div style="color: var(--text-primary); line-height: 1.6;">${content}</div>
    `;
    
    document.body.appendChild(resultModal);
    
    // Auto-remove after 10 seconds
    setTimeout(() => {
      if (resultModal.parentElement) {
        resultModal.remove();
      }
    }, 10000);
  }

  // Set current article title (for external use)
  setCurrentArticle(title) {
    this.currentArticleTitle = title;
  }

  // Get current article title
  getCurrentArticle() {
    return this.currentArticleTitle;
  }
}

// Create global instance
const articleViewer = new AdvancedArticleViewer();

// Auto-initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => articleViewer.init());
} else {
  articleViewer.init();
}

// Legacy function support for backwards compatibility
function showArticleModal(title) {
  articleViewer.showArticleModal(title);
}

function closeArticleModal() {
  articleViewer.closeArticleModal();
}

function summarizeSelectedText() {
  articleViewer.summarizeSelectedText();
}

function explainSelectedText() {
  articleViewer.explainSelectedText();
}

function quizSelectedText() {
  articleViewer.quizSelectedText();
}
