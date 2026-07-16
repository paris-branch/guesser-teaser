// Main application logic

class RiddleTeaser {
    constructor() {
        this.riddlesData = riddlesData;
        this.currentRiddle = null;
        this.bubblesGrid = document.getElementById('bubbles-grid');
        this.riddleDisplay = document.getElementById('riddle-display');
        this.answerInput = document.getElementById('answer-input');
        this.checkButton = document.getElementById('check-button');
        this.autocompleteDropdown = document.getElementById('autocomplete-dropdown');
        this.allDances = allAnswerSuggestions;
        this.selectedIndex = -1;
        this.riddleContent = this.loadRiddleContent();
        this.solvedRiddles = this.loadSolvedRiddles();
        
        this.init();
    }

    loadSolvedRiddles() {
        try {
            const stored = localStorage.getItem('guesser-solved');
            return stored ? new Set(JSON.parse(stored)) : new Set();
        } catch {
            return new Set();
        }
    }

    saveSolvedRiddle(number) {
        this.solvedRiddles.add(number);
        localStorage.setItem('guesser-solved', JSON.stringify([...this.solvedRiddles]));
    }

    loadRiddleContent() {
        // Load riddle text from HTML
        const riddleElements = document.querySelectorAll('.riddle-data');
        const content = {};
        
        riddleElements.forEach(el => {
            const number = parseInt(el.dataset.number);
            const title = el.querySelector('h2')?.innerHTML || `Riddle #${number}`;
            const text = el.querySelector('.riddle-text')?.innerHTML || '';
            const hint = el.querySelector('.riddle-hint')?.innerHTML || '';
            
            content[number] = { title, text, hint };
        });
        
        return content;
    }

    init() {
        this.updateRiddleStates();
        this.renderBubbles();
        this.setupEventListeners();
        this.checkButton.disabled = true; // Initially disabled
        this.selectRiddleFromURL() || this.selectFirstRiddle(); // Check URL param or select first
    }

    selectRiddleFromURL() {
        // Check for ?riddle=N parameter
        const urlParams = new URLSearchParams(window.location.search);
        const riddleNumber = parseInt(urlParams.get('riddle'));
        
        if (riddleNumber && riddleNumber >= 1 && riddleNumber <= 12) {
            const riddle = this.riddlesData.find(r => r.number === riddleNumber);
            
            // Only select if the riddle is revealed
            if (riddle && riddle.revealed) {
                const bubble = document.querySelector(`.bubble[data-number="${riddleNumber}"]`);
                if (bubble) {
                    this.selectRiddle(riddle, bubble);
                    return true;
                }
            }
        }
        
        return false;
    }

    getEffectiveToday() {
        const urlParams = new URLSearchParams(window.location.search);
        const todayParam = urlParams.get('today');
        if (todayParam) {
            const parsed = new Date(todayParam);
            if (!isNaN(parsed.getTime())) {
                return parsed;
            }
        }
        return new Date();
    }

    updateRiddleStates() {
        const today = this.getEffectiveToday();
        today.setHours(0, 0, 0, 0);

        this.riddlesData.forEach(riddle => {
            const riddleDate = new Date(riddle.date);
            riddleDate.setHours(0, 0, 0, 0);
            
            riddle.revealed = riddleDate <= today;
        });
    }

    renderBubbles() {
        this.bubblesGrid.innerHTML = '';
        
        this.riddlesData.forEach(riddle => {
            const bubble = this.createBubble(riddle);
            this.bubblesGrid.appendChild(bubble);
        });
    }

    createBubble(riddle) {
        const bubble = document.createElement('div');
        const stateClasses = ['bubble', riddle.revealed ? 'past' : 'future'];
        if (this.solvedRiddles.has(riddle.number)) {
            stateClasses.push('solved');
        }
        bubble.className = stateClasses.join(' ');
        bubble.dataset.number = riddle.number;

        const formattedDate = this.formatDate(riddle.date);
        
        bubble.innerHTML = `
            <div class="bubble-circle">
                <span class="bubble-content">${riddle.revealed ? riddle.number : ''}</span>
                <span class="bubble-date">${formattedDate}</span>
            </div>
        `;

        if (riddle.revealed) {
            bubble.addEventListener('click', () => this.selectRiddle(riddle, bubble));
        }

        return bubble;
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('en-GB', { month: 'long' });
        return `${day} ${month}`;
    }

    selectRiddle(riddle, bubbleElement) {
        // Remove active class from all bubbles
        document.querySelectorAll('.bubble').forEach(b => b.classList.remove('active'));
        
        // Add active class to selected bubble
        bubbleElement.classList.add('active');
        
        // Store current riddle
        this.currentRiddle = riddle;
        
        // Update URL with riddle parameter (without page reload)
        const url = new URL(window.location);
        url.searchParams.set('riddle', riddle.number);
        window.history.pushState({}, '', url);
        
        // Display riddle
        this.displayRiddle(riddle);
        
        // Enable input and button
        this.answerInput.disabled = false;
        this.answerInput.value = '';
        this.answerInput.classList.remove('correct', 'incorrect');
        this.checkButton.disabled = false;
        this.answerInput.focus();
    }

    selectFirstRiddle() {
        // Find all revealed riddles
        const revealedRiddles = this.riddlesData.filter(r => r.revealed);
        if (revealedRiddles.length === 0) return;
        
        // Select the LAST revealed riddle (most recent) to show as active
        const lastRevealedRiddle = revealedRiddles[revealedRiddles.length - 1];
        
        // Find the corresponding bubble element
        const bubble = document.querySelector(`.bubble[data-number="${lastRevealedRiddle.number}"]`);
        if (bubble) {
            this.selectRiddle(lastRevealedRiddle, bubble);
        }
    }

    displayRiddle(riddle) {
        const content = this.riddleContent[riddle.number];
        
        if (!content) {
            console.error(`No content found for riddle ${riddle.number}`);
            return;
        }
        
        this.riddleDisplay.innerHTML = `
            <div class="riddle-content">
                <h2>${content.title}</h2>
                <p class="riddle-text">${content.text}</p>
                ${content.hint ? `<p class="riddle-hint">${content.hint}</p>` : ''}
            </div>
        `;

        if (riddle.number === 3) {
            this.setupInteractiveSVG();
        }
    }

    setupInteractiveSVG() {
        const img = this.riddleDisplay.querySelector('img[src*="saturday15.svg"]');
        if (!img) return;

        const wrapper = document.createElement('div');
        wrapper.className = 'dance-svg-wrapper';
        img.parentNode.insertBefore(wrapper, img);
        wrapper.appendChild(img);

        const overlay = document.createElement('div');
        overlay.className = 'dance-svg-overlay';
        wrapper.appendChild(overlay);

        const mistakes = [
            { x: 251, y: 5, w: 18, h: 11 },
            { x: 251, y: 22, w: 18, h: 13 },
            { x: 2, y: 5, w: 20, h: 11 },
            { x: 2, y: 14, w: 20, h: 19 },
            { x: 44, y: 17, w: 22, h: 20 },
            { x: 28, y: 17, w: 18, h: 20 },
            { x: 66, y: 0, w: 22, h: 11 },
        ];

        const vb = { minX: -1, minY: -1, w: 272, h: 73.73 };
        const found = new Set();

        const handleClick = (e) => {
            const imgRect = img.getBoundingClientRect();
            const imgAspect = imgRect.width / imgRect.height;
            const svgAspect = vb.w / vb.h;
            let scale, offsetX, offsetY;

            if (imgAspect > svgAspect) {
                scale = imgRect.height / vb.h;
                offsetX = (imgRect.width - vb.w * scale) / 2;
                offsetY = 0;
            } else {
                scale = imgRect.width / vb.w;
                offsetX = 0;
                offsetY = (imgRect.height - vb.h * scale) / 2;
            }

            const vbX = (e.clientX - imgRect.left - offsetX) / scale + vb.minX;
            const vbY = (e.clientY - imgRect.top - offsetY) / scale + vb.minY;
            const gY = vbY - 18;

            for (let i = 0; i < mistakes.length; i++) {
                const m = mistakes[i];
                if (vbX >= m.x && vbX <= m.x + m.w && gY >= m.y && gY <= m.y + m.h) {
                    if (!found.has(i)) {
                        found.add(i);
                        const circle = document.createElement('div');
                        circle.className = 'mistake-dot';
                        circle.style.left = ((vbX - vb.minX) * scale + offsetX) + 'px';
                        circle.style.top = ((vbY - vb.minY) * scale + offsetY) + 'px';
                        overlay.appendChild(circle);
                        if (found.size === mistakes.length) {
                            this.riddleDisplay.querySelector('h2').textContent = 'Guess the dance #3';
                        }
                    }
                    break;
                }
            }
        };

        img.addEventListener('click', handleClick);
    }

    setupEventListeners() {
        this.checkButton.addEventListener('click', () => this.checkAnswer());
        
        this.answerInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                if (this.selectedIndex >= 0 && this.autocompleteDropdown.classList.contains('show')) {
                    // Select highlighted item
                    const items = this.autocompleteDropdown.querySelectorAll('.autocomplete-item');
                    if (items[this.selectedIndex]) {
                        this.answerInput.value = items[this.selectedIndex].textContent;
                        this.hideAutocomplete();
                        e.preventDefault();
                    }
                } else {
                    this.checkAnswer();
                }
            } else if (e.key === 'ArrowDown') {
                this.navigateAutocomplete(1);
                e.preventDefault();
            } else if (e.key === 'ArrowUp') {
                this.navigateAutocomplete(-1);
                e.preventDefault();
            } else if (e.key === 'Escape') {
                this.hideAutocomplete();
            }
        });

        this.answerInput.addEventListener('input', (e) => {
            this.answerInput.classList.remove('correct', 'incorrect');
            // Remove any feedback message
            const feedback = this.riddleDisplay.querySelector('.feedback-message');
            if (feedback) {
                feedback.remove();
            }
            this.updateAutocomplete(e.target.value);
        });

        this.answerInput.addEventListener('focus', (e) => {
            if (e.target.value) {
                this.updateAutocomplete(e.target.value);
            }
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.input-wrapper')) {
                this.hideAutocomplete();
            }
        });
    }

    updateAutocomplete(searchTerm) {
        if (!searchTerm || searchTerm.length < 2) {
            this.hideAutocomplete();
            return;
        }

        const matches = this.filterDances(searchTerm);
        
        if (matches.length === 0) {
            this.hideAutocomplete();
            return;
        }

        this.showAutocomplete(matches, searchTerm);
    }

    filterDances(searchTerm) {
        const lowerSearch = searchTerm.toLowerCase();
        
        return this.allDances.filter(dance => {
            const lowerDance = dance.toLowerCase();
            const words = lowerDance.split(/\s+/);
            
            // Check if search term matches the start of any word in the dance name
            return words.some(word => word.startsWith(lowerSearch)) ||
                   lowerDance.includes(lowerSearch);
        }).sort((a, b) => {
            // Prioritize dances where a word starts with the search term
            const aWords = a.toLowerCase().split(/\s+/);
            const bWords = b.toLowerCase().split(/\s+/);
            const aStartsWithWord = aWords.some(word => word.startsWith(lowerSearch));
            const bStartsWithWord = bWords.some(word => word.startsWith(lowerSearch));
            
            if (aStartsWithWord && !bStartsWithWord) return -1;
            if (!aStartsWithWord && bStartsWithWord) return 1;
            return a.localeCompare(b);
        });
    }

    showAutocomplete(matches, searchTerm) {
        this.autocompleteDropdown.innerHTML = '';
        this.selectedIndex = -1;

        matches.forEach((dance, index) => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = dance;
            
            item.addEventListener('click', () => {
                this.answerInput.value = dance;
                this.hideAutocomplete();
                this.answerInput.focus();
            });

            this.autocompleteDropdown.appendChild(item);
        });

        this.autocompleteDropdown.classList.add('show');
    }

    hideAutocomplete() {
        this.autocompleteDropdown.classList.remove('show');
        this.selectedIndex = -1;
    }

    navigateAutocomplete(direction) {
        const items = this.autocompleteDropdown.querySelectorAll('.autocomplete-item');
        if (items.length === 0) return;

        // Remove previous selection
        if (this.selectedIndex >= 0 && items[this.selectedIndex]) {
            items[this.selectedIndex].classList.remove('selected');
        }

        // Update index
        this.selectedIndex += direction;
        if (this.selectedIndex < 0) this.selectedIndex = items.length - 1;
        if (this.selectedIndex >= items.length) this.selectedIndex = 0;

        // Add new selection
        items[this.selectedIndex].classList.add('selected');
        items[this.selectedIndex].scrollIntoView({ block: 'nearest' });
    }

    populateAnswerSuggestions() {
        // No longer needed with custom autocomplete
    }

    checkAnswer() {
        if (!this.currentRiddle) {
            return;
        }

        const userAnswer = this.answerInput.value.trim().toLowerCase();
        
        if (!userAnswer) {
            return;
        }

        const isCorrect = this.currentRiddle.answers.some(
            answer => answer.toLowerCase() === userAnswer
        );

        this.showFeedback(isCorrect);
    }

    showFeedback(isCorrect) {
        // Update input styling
        this.answerInput.classList.remove('correct', 'incorrect');
        this.answerInput.classList.add(isCorrect ? 'correct' : 'incorrect');

        // Remove existing feedback
        const existingFeedback = this.riddleDisplay.querySelector('.feedback-message');
        if (existingFeedback) {
            existingFeedback.remove();
        }

        // Add new feedback message
        const feedback = document.createElement('div');
        feedback.className = `feedback-message ${isCorrect ? 'success' : 'error'}`;
        feedback.textContent = isCorrect 
            ? '🎉 Correct! Well done!' 
            : '❌ Not quite right. Try again!';
        
        this.riddleDisplay.querySelector('.riddle-content').appendChild(feedback);

        if (isCorrect) {
            this.saveSolvedRiddle(this.currentRiddle.number);
            const bubble = document.querySelector(`.bubble[data-number="${this.currentRiddle.number}"]`);
            if (bubble) {
                bubble.classList.add('solved');
            }
            setTimeout(() => {
                this.answerInput.value = '';
                this.answerInput.classList.remove('correct');
            }, 3000);
        }
    }
}

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RiddleTeaser();
});
