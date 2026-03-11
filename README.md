# Don Quixote Audiobook - Student Edition

A beautifully designed, portable audiobook player for Miguel de Cervantes' *The Adventures of Don Quixote*. This self-contained web application provides students with an engaging listening experience complete with study tools and a distinctive medieval manuscript aesthetic.

## Features

### 🎧 Audiobook Player
- Complete 20-chapter audiobook with high-quality MP3 files
- Intuitive playback controls (play/pause, previous/next, repeat)
- Adjustable playback speed (0.75×, 1×, 1.25×, 1.5×)
- Volume control and mute toggle
- Visual progress tracking with seek bar

### 📚 Study Tools
- **Chapter Bookmarks**: Save your place in any chapter
- **Listening Timer**: Track study sessions with start/pause/reset
- **Integrated Notes**: Take notes while listening with auto-save
- **Progress Tracking**: Visual progress circle showing completion percentage
- **Dark Mode**: Toggle between light and dark themes for comfortable viewing

### 🎨 Design Features
- **Medieval Manuscript Aesthetic**: Aged parchment textures, ink blot effects, and decorative borders
- **Responsive Layout**: Works on desktop, tablet, and mobile devices
- **Keyboard Shortcuts**: Spacebar to play/pause, arrow keys for seeking
- **Fullscreen Mode**: Immersive listening experience
- **Portable**: No internet required after initial load

## How to Use

### Getting Started
1. Simply open `index.html` in any modern web browser
2. The audiobook will load automatically
3. Click any chapter to start listening

### Basic Controls
- **Play/Pause**: Click the play button or press Spacebar
- **Previous/Next**: Use the arrow buttons or navigate through chapters
- **Seek**: Click anywhere on the progress bar
- **Volume**: Use the volume slider or press 'M' to mute
- **Fullscreen**: Press 'F' to toggle fullscreen mode

### Study Features
1. **Set a Bookmark**: Click "Set Bookmark" to save your current position
2. **Use the Timer**: Start the timer to track your listening session
3. **Take Notes**: Type in the notes area - they auto-save
4. **Export Notes**: Download your notes as a text file

## Technical Details

### File Structure
```
don-quixote-audiobook/
├── index.html          # Main HTML file
├── style.css           # Styles with medieval manuscript aesthetic
├── script.js           # Interactive JavaScript
├── README.md           # This documentation
└── *.mp3              # 20 chapter audio files (01-20)
```

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+
- Opera 47+

### Storage
- Uses `localStorage` to save:
  - Current playback position
  - Bookmarks
  - Notes
  - Timer state
  - Theme preference
- All data persists between browser sessions
- No server-side storage or tracking

### Performance
- Audio files are streamed efficiently
- Minimal JavaScript footprint
- CSS animations use GPU acceleration
- Responsive design adapts to any screen size

## For Educators

### Classroom Use
This audiobook player is ideal for:
- Literature classes studying *Don Quixote*
- ESL/ELL students improving listening comprehension
- Students with reading difficulties
- Independent study assignments
- Flipped classroom activities

### Accessibility Features
- Keyboard navigation support
- High contrast mode (dark theme)
- Clear visual feedback for all interactions
- Responsive design for various devices
- No reliance on mouse/touchpad for core functions

### Customization
Educators can:
1. Modify chapter titles in `script.js` (chapters array)
2. Adjust colors in `style.css` (CSS variables)
3. Add additional study tools by extending the JavaScript
4. Replace audio files with different recordings if needed

## Development

### Building From Source
No build process required! This is a pure HTML/CSS/JS application.

### Modifying the Design
The design uses CSS custom properties for easy theming:
```css
:root {
    --parchment-light: #f8f3e9;
    --ink-dark: #2c1810;
    --accent-gold: #d4af37;
    /* ... */
}
```

### Adding Features
The JavaScript is modular and well-commented. Key functions:
- `loadChapter()` - Loads and plays a specific chapter
- `togglePlay()` - Controls play/pause state
- `saveState()` - Persists user data to localStorage
- `updateProgress()` - Updates UI progress indicators

## License & Credits

### Audio Files
The included MP3 files are from a public domain recording of *The Adventures of Don Quixote*. They are provided for educational use only.

### Design & Code
- **Design**: Medieval manuscript aesthetic with modern web standards
- **Typography**: Cinzel (display) and Crimson Pro (body) from Google Fonts
- **Icons**: Font Awesome 6
- **Development**: Pure vanilla JavaScript, no frameworks required

### Copyright
© Student Edition 2026 · Designed for educational use

This application is provided as-is for educational purposes. The audio files are in the public domain, and the code is free to use and modify for educational purposes.

## Support

For issues or questions:
1. Ensure you're using a modern web browser
2. Check that JavaScript is enabled
3. Verify audio files are in the same directory as index.html
4. Clear browser cache if experiencing issues

The application stores data locally - clearing browser data will reset bookmarks, notes, and preferences.

---

*"Finally, from so little sleeping and so much reading, his brain dried up and he went completely out of his mind."*  
— Miguel de Cervantes, *Don Quixote*