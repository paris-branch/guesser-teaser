# Paris October Weekend Teaser - Agent Notes

## Project Overview
Created a static website teaser for a dance event called "Paris October Weekend". The site features 12 riddles that are revealed progressively each Monday leading up to the event.

## File Structure
```
/
├── index.html              # Main HTML page (EDIT RIDDLE TEXT HERE)
├── styles/
│   └── main.scss          # Main stylesheet with color variables
│   └── main.css           # Compiled CSS
├── scripts/
│   ├── main.js            # Main application logic
│   └── riddles-data.js    # Riddles dates and answers
└── img/
    └── banner.png         # Event banner
    └── friday5.png        # Example riddle image (or other images)
```

## Design Decisions

### Color Scheme (SCSS Variables)
All colors are defined as variables at the top of `styles/main.scss`

These colors are designed to complement the banner image.

### Layout Sections

1. **Banner Section**
   - Displays `img/banner.png`
   - Links to external website
   - Responsive image with hover scale effect

2. **Bubbles Grid**
   - 12 numbered bubbles (1-12) arranged in a responsive grid
   - Auto-fits to screen size (4 columns on mobile, more on desktop)
   - Three states:
     - **Past/Clickable**: Bold white number, white circle border, clickable
       - On hover: circle fills white, shows date instead of number
     - **Active/Selected**: Gradient background matching banner colors, white border
       - Shows the currently displayed riddle
       - On hover: keeps gradient, shows number (not date)
     - **Future/Inactive**: Light grey date only, grey circle, no interaction

3. **Riddle Display Area**
   - Answer input field with datalist autocomplete
   - "Check" button (also works with Enter key)
   - Riddle content area showing:
     - Riddle number
     - Riddle text
     - Optional hint
     - Feedback messages (success/error)

## JavaScript Architecture

### `scripts/riddles-data.js`
- Contains `riddlesData` array with 12 riddles
- Each riddle has:
  - `number`: 1-12
  - `date`: ISO date string (YYYY-MM-DD) for reveal date
  - `answers`: Array with the correct Scottish Country Dance name
  - `revealed`: Boolean (calculated at runtime)
- **Riddle text is now in `index.html`** for easy editing (in hidden div `#riddles-content`)
- Contains `allAnswerSuggestions` with all 30 Scottish Country Dance names from Friday/Saturday programs
- **Dance names extracted from**: `programs/friday.txt` and `programs/saturday.txt`

### `scripts/main.js`
- `RiddleTeaser` class handles all interactions
- Key methods:
  - `loadRiddleContent()`: Reads riddle text from HTML on initialization
  - `selectRiddleFromURL()`: Checks for `?riddle=N` URL parameter and selects that riddle
  - `updateRiddleStates()`: Compares dates to determine which riddles are revealed
  - `renderBubbles()`: Generates bubble HTML based on state
  - `selectRiddle()`: Handles bubble clicks, displays riddle, and updates URL parameter
  - `selectFirstRiddle()`: Automatically selects the most recent revealed riddle if no URL param
  - `checkAnswer()`: Validates user input against accepted answers
  - `showFeedback()`: Displays success/error messages
  - `formatDate()`: Formats dates in British style (e.g., "13 July")
  - `updateAutocomplete()`: Filters and displays dance name suggestions
  - `filterDances()`: Matches search term against any word in dance names
  - `navigateAutocomplete()`: Keyboard navigation (arrow keys) in dropdown
  - `showAutocomplete()`/`hideAutocomplete()`: Manage dropdown visibility

## Responsive Design

### Breakpoints
- **Desktop**: Max-width 1400px container, standard spacing
- **Tablet (≤768px)**: Smaller bubbles (80px), adjusted fonts
- **Mobile (≤480px)**: 4-column grid, compact layout (70px bubbles)

### Mobile Optimizations
- Flexible grid layout
- Full-width check button on mobile
- Reduced font sizes
- Maintained touch-friendly bubble sizes

## Key Features

1. **Date-based Reveal**: Riddles automatically unlock each Monday based on system date
   - **Schedule**: 12 Mondays from 20 July to 5 October 2026
   - Week 1: 20 July, Week 2: 27 July, Week 3: 3 August
   - Week 4: 10 August, Week 5: 17 August, Week 6: 24 August, Week 7: 31 August, Week 8: 7 September
   - Week 9: 14 September, Week 10: 21 September, Week 11: 28 September, Week 12: 5 October
   - **Event dates**: 9-11 October 2026 (Friday-Sunday)
2. **URL Parameter Support**: Direct link to specific riddles with `?riddle=N` (e.g., `index.html?riddle=3`)
   - Only works for revealed riddles
   - URL updates when clicking bubbles (shareable links)
3. **Auto-select**: Most recent revealed riddle is automatically selected on page load (if no URL param)
4. **British Date Format**: Dates displayed as "13 July" (not "Jul 13")
5. **Smart Autocomplete**: Type any word from a dance name to see suggestions
   - Filters in real-time as you type (minimum 2 characters)
   - Matches any word in the dance name (e.g., "wed" matches "Mairi's Wedding")
   - Arrow keys to navigate, Enter to select, Escape to close
   - Click to select from dropdown
   - Prioritizes matches at word boundaries
6. **30 Scottish Country Dances**: All dances from Friday and Saturday programs
7. **Active State Visual**: Selected bubble shows gradient background (banner colors)
8. **Answer Validation**: Case-insensitive matching with exact dance name required
9. **Accessibility**: Keyboard navigation, semantic HTML
10. **Visual Feedback**: Color-coded input states (correct/incorrect)

## Completed

1. ✅ **Banner image**: Banner exists at `img/banner.png` (566KB)
2. ✅ **Color extraction**: Colors extracted from banner gradient:
   - Background: Dark blue (`#0d1b2e`)
   - Banner colors: Blue (`#4a8ec4`) → Purple (`#6e7db8`, `#9c6ba8`) → Coral (`#c85b87`) → Red-Orange (`#e55853`, `#f2543e`)
   - All color variables defined in SCSS
3. ✅ **SCSS compiled**: `styles/main.css` generated and ready to use
4. ✅ **Dance names loaded**: 30 Scottish Country Dances from Friday/Saturday programs
5. ✅ **Smart autocomplete**: Custom dropdown that matches any word in dance names
6. ✅ **British dates**: Formatted as "13 July" throughout
7. ✅ **First riddle auto-selected**: Page loads with first riddle active

## To Complete

1. **Update website link**: Change the banner link from placeholder to actual event URL (currently: https://www.paris-branch.org)
2. **Write actual riddles**: Edit the riddle text in `index.html` (in the `#riddles-content` section)
   - Each riddle has a title, text, and hint
   - Simply edit the HTML text - no JavaScript knowledge needed
   - **Can include images**: `<img src="img/yourimage.png">` in the riddle text
   - Images will be responsive, centered, with shadow
   - Answers are already set in `scripts/riddles-data.js`
3. **Test the site**: Open `index.html` in a browser and verify:
   - Riddles reveal on correct dates
   - Images display correctly in riddles
   - Autocomplete works for all dance names
   - Answer validation works correctly
   - URL parameters work (e.g., `index.html?riddle=2`)

## Development Notes

- SCSS needs to be compiled to CSS before deployment
- All dates in `riddles-data.js` use ISO format (YYYY-MM-DD)
- The date comparison uses midnight (00:00:00) for consistent behavior
- Answer matching is case-insensitive and whitespace-trimmed
- No external dependencies - pure vanilla JavaScript

## Potential Enhancements

- Add animations for riddle transitions
- Include social sharing for solved riddles
- Add progress tracker showing X/12 solved
- Store solved riddles in localStorage
- Add sound effects for correct/incorrect answers
- Create admin panel for easier riddle management
- Add timer showing days until event
