# CLAUDE.md - AI Assistant Guide for othello.js

## Project Overview

This is a browser-based **Othello (Reversi)** game implemented in vanilla JavaScript with HTML5 Canvas rendering. The game runs entirely client-side with no backend dependencies.

## Directory Structure

```
othello.js/
├── index.html              # Main HTML entry point
├── public/
│   ├── css/
│   │   └── main.css        # Stylesheet (currently empty - styles are inline)
│   └── js/
│       └── main.js         # Complete game logic and rendering
└── CLAUDE.md               # This file
```

## Architecture

### Core Components (public/js/main.js)

The game uses a module pattern with the following key objects:

1. **`turn`** (lines 5-25) - Singleton object managing player turns
   - `init()` - Reset to black's turn
   - `changeTurn()` - Switch between black and white
   - `getNowPlayer()` - Returns current player color
   - `render()` - Updates DOM to show current player

2. **`initBoard(areaLength)`** (lines 28-214) - Factory function creating the board state
   - `getPossibles(color)` - Returns array of valid move positions
   - `validate(pos, possibles)` - Checks if a position is valid
   - `put(pos, color)` - Places a piece and flips captured pieces
   - `render()` - Draws all pieces using Canvas API
   - `isFinish()` - Checks if game is over
   - `calcResult()` - Calculates winner

3. **Helper Functions**
   - `drawCircle(color, target)` (lines 216-226) - Renders a single piece on canvas
   - `parseId(id)` (lines 228-234) - Converts canvas ID to board coordinates
   - `onClick(e)` (lines 236-273) - Main click event handler with game flow logic
   - `initTable(length)` (lines 303-317) - Creates HTML table with canvas elements

### Game Flow

1. Page loads → `load()` is called via DOMContentLoaded
2. Board is initialized as 8x8 grid with 4 starting pieces
3. Black plays first
4. On click: validate move → place piece → flip captured → change turn
5. If no valid moves, turn passes automatically
6. Game ends when board is full or neither player can move

## Development Notes

### Constants

- `AREA_LENGTH = 8` - Board dimensions (8x8)
- Canvas size: 48x48 pixels per cell
- Piece radius: 16 pixels

### Coordinate System

- Board uses `[x][y]` indexing where `x` is row and `y` is column
- Canvas IDs follow pattern: `"canvas," + row + "," + col`

### Language

- UI text and code comments are in Japanese
- "やり直す" = "Restart"
- "置く場所がない" = "No valid moves"

## Running the Project

Simply open `index.html` in a web browser. No build process or server required.

```bash
# Using Python's built-in server (optional)
python -m http.server 8000
# Then open http://localhost:8000

# Or just open directly
open index.html  # macOS
xdg-open index.html  # Linux
```

## Code Conventions

- **No build tools** - Vanilla JavaScript only
- **No external dependencies** - Pure browser APIs
- **Module pattern** - Using IIFEs and closures for encapsulation
- **DOM manipulation** - Direct manipulation using `document.getElementById`
- **Event handling** - Using `addEventListener`

## Potential Improvements

When making changes, consider:

1. The CSS file is empty - all styling is done inline in JavaScript (line 309)
2. No error handling for edge cases
3. Game state is stored in closure variables, not easily serializable
4. No mobile touch event support (uses click events only)
5. No unit tests exist

## Git Workflow

- Main development branch: Check current branch with `git branch`
- Commits should be descriptive and focused
- No CI/CD configuration exists

## Testing

Manual testing only - open in browser and play through game scenarios:
1. Normal gameplay flow
2. Turn passing when no moves available
3. Game end conditions
4. Restart button functionality
