// Don Quixote Audiobook Player
document.addEventListener('DOMContentLoaded', function() {
    // State management
    const state = {
        currentChapter: 1,
        totalChapters: 20,
        isPlaying: false,
        currentTime: 0,
        duration: 0,
        volume: 0.7,
        playbackSpeed: 1,
        repeat: false,
        bookmark: null,
        timer: {
            running: false,
            startTime: 0,
            elapsed: 0
        },
        notes: '',
        progress: 0,
        darkMode: false
    };

    // DOM Elements
    const audioPlayer = document.getElementById('audio-player');
    const playBtn = document.getElementById('play-btn');
    const playIcon = document.getElementById('play-icon');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const repeatBtn = document.getElementById('repeat-btn');
    const volumeSlider = document.getElementById('volume-slider');
    const progressBar = document.getElementById('progress-bar');
    const progressFill = document.getElementById('progress-fill');
    const progressHandle = document.getElementById('progress-handle');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');
    const currentChapterEl = document.getElementById('current-chapter');
    const currentTitleEl = document.getElementById('current-title');
    const playerStatus = document.getElementById('player-status');
    const chaptersGrid = document.getElementById('chapters-grid');
    const speedButtons = document.querySelectorAll('.speed-btn');
    const setBookmarkBtn = document.getElementById('set-bookmark');
    const goToBookmarkBtn = document.getElementById('go-to-bookmark');
    const bookmarkInfo = document.getElementById('bookmark-info');
    const timerDisplay = document.getElementById('timer-display');
    const timerToggle = document.getElementById('timer-toggle');
    const notesArea = document.getElementById('notes-area');
    const saveNotesBtn = document.getElementById('save-notes');
    const progressCircle = document.getElementById('progress-circle');
    const progressPercent = document.getElementById('progress-percent');
    const themeToggle = document.getElementById('theme-toggle');
    const exportNotesBtn = document.getElementById('export-notes');

    // Chapter data with this specific book's titles
    const chapters = [
        { number: 1, title: "A Knight in Armor", file: "01 - Chapter 1.mp3", duration: null },
        { number: 2, title: "Don Quixote Leaves Home", file: "02 - Chapter 2.mp3", duration: null },
        { number: 3, title: "The Price of Meddling", file: "03 - Chapter 3.mp3", duration: null },
        { number: 4, title: "Don Quixote and Sancho Panza Have Some Strange Adventures", file: "04 - Chapter 4.mp3", duration: null },
        { number: 5, title: "More Strange Adventures", file: "05 - Chapter 5.mp3", duration: null },
        { number: 6, title: "Back to La Mancha", file: "06 - Chapter 6.mp3", duration: null },
        { number: 7, title: "Don Quixote Learns He Is Already Famous", file: "07 - Chapter 7.mp3", duration: null },
        { number: 8, title: "On the Road Again", file: "08 - Chapter 8.mp3", duration: null },
        { number: 9, title: "The Knight of the Wood", file: "09 - Chapter 9.mp3", duration: null },
        { number: 10, title: "The Adventure of the Lions", file: "10 - Chapter 10.mp3", duration: null },
        { number: 11, title: "The Puppet Show", file: "11 - Chapter 11.mp3", duration: null },
        { number: 12, title: "At the Duke's Palace", file: "12 - Chapter 12.mp3", duration: null },
        { number: 13, title: "The Adventure of the Wooden Horse", file: "13 - Chapter 13.mp3", duration: null },
        { number: 14, title: "Don Quixote Advises Sancho", file: "14 - Chapter 14.mp3", duration: null },
        { number: 15, title: "Sancho, Governor for Life", file: "15 - Chapter 15.mp3", duration: null },
        { number: 16, title: "Danger at the Island", file: "16 - Chapter 16.mp3", duration: null },
        { number: 17, title: "Sancho's Wisest Decision", file: "17 - Chapter 17.mp3", duration: null },
        { number: 18, title: "Knight and Squire Reunited", file: "18 - Chapter 18.mp3", duration: null },
        { number: 19, title: "The Knight of the White Moon", file: "19 - Chapter 19.mp3", duration: null },
        { number: 20, title: "Don Quixote's Last Illness", file: "20 - Chapter 20.mp3", duration: null }
    ];

    // Initialize
    function init() {
        loadState();
        renderChapters();
        loadChapter(1);
        setupEventListeners();
        updateProgress();
        updateTimerDisplay();
    }

    // Load saved state from localStorage
    function loadState() {
        const saved = localStorage.getItem('donQuixoteState');
        if (saved) {
            const parsed = JSON.parse(saved);
            Object.assign(state, parsed);
            
            // Apply saved state
            audioPlayer.volume = state.volume;
            volumeSlider.value = state.volume;
            audioPlayer.playbackRate = state.playbackSpeed;
            notesArea.value = state.notes;
            
            // Update UI
            updateSpeedButtons();
            updateProgressCircle();
            updateBookmarkInfo();
            
            // Apply dark mode if saved
            if (state.darkMode) {
                document.body.classList.add('dark-theme');
                themeToggle.innerHTML = '<i class="fas fa-sun"></i> Light Mode';
            }
        }
    }

    // Save state to localStorage
    function saveState() {
        localStorage.setItem('donQuixoteState', JSON.stringify(state));
    }

    // Render chapters grid
    function renderChapters() {
        chaptersGrid.innerHTML = '';
        chapters.forEach(chapter => {
            const card = document.createElement('div');
            card.className = `chapter-card ${chapter.number === state.currentChapter ? 'active' : ''}`;
            card.innerHTML = `
                <div class="chapter-number">Chapter ${chapter.number}</div>
                <div class="chapter-title">${chapter.title}</div>
                <div class="chapter-duration">
                    <i class="far fa-clock"></i>
                    <span class="duration-text">${chapter.duration ? formatTime(chapter.duration) : 'Loading...'}</span>
                </div>
                <button class="chapter-play-btn" data-chapter="${chapter.number}">
                    ${chapter.number === state.currentChapter && state.isPlaying ? 'Pause' : 'Play'}
                </button>
            `;
            chaptersGrid.appendChild(card);
            
            // Load duration
            if (!chapter.duration) {
                loadChapterDuration(chapter);
            }
        });
        
        // Add event listeners to chapter cards
        document.querySelectorAll('.chapter-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (!e.target.classList.contains('chapter-play-btn')) {
                    const chapter = parseInt(card.querySelector('.chapter-play-btn').dataset.chapter);
                    loadChapter(chapter);
                }
            });
        });
        
        // Add event listeners to play buttons
        document.querySelectorAll('.chapter-play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const chapter = parseInt(btn.dataset.chapter);
                if (chapter === state.currentChapter) {
                    togglePlay();
                } else {
                    loadChapter(chapter);
                }
            });
        });
    }

    // Load chapter duration
    function loadChapterDuration(chapter) {
        const audio = new Audio();
        audio.src = chapter.file;
        audio.addEventListener('loadedmetadata', () => {
            chapter.duration = audio.duration;
            const durationEl = document.querySelector(`.chapter-card:nth-child(${chapter.number}) .duration-text`);
            if (durationEl) {
                durationEl.textContent = formatTime(chapter.duration);
            }
        });
    }

    // Load a chapter
    function loadChapter(chapterNumber) {
        if (chapterNumber < 1 || chapterNumber > state.totalChapters) return;
        
        state.currentChapter = chapterNumber;
        state.isPlaying = false;
        
        const chapter = chapters[chapterNumber - 1];
        audioPlayer.src = chapter.file;
        audioPlayer.load();
        
        currentChapterEl.textContent = chapterNumber;
        currentTitleEl.textContent = chapter.title;
        playerStatus.textContent = 'Ready to play';
        
        updateChapterCards();
        updateProgress();
        saveState();
        
        // Auto-play if was playing before
        if (state.isPlaying) {
            setTimeout(() => togglePlay(), 100);
        }
    }

    // Toggle play/pause
    function togglePlay() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            state.isPlaying = true;
            playIcon.className = 'fas fa-pause';
            playerStatus.textContent = 'Playing';
            
            // Start timer if not running
            if (!state.timer.running) {
                startTimer();
            }
        } else {
            audioPlayer.pause();
            state.isPlaying = false;
            playIcon.className = 'fas fa-play';
            playerStatus.textContent = 'Paused';
            
            // Pause timer
            pauseTimer();
        }
        
        updateChapterCards();
        saveState();
    }

    // Update chapter cards UI
    function updateChapterCards() {
        document.querySelectorAll('.chapter-card').forEach((card, index) => {
            const chapterNumber = index + 1;
            const playBtn = card.querySelector('.chapter-play-btn');
            
            card.classList.toggle('active', chapterNumber === state.currentChapter);
            playBtn.textContent = chapterNumber === state.currentChapter && state.isPlaying ? 'Pause' : 'Play';
        });
    }

    // Update progress bar
    function updateProgress() {
        const progress = (state.currentTime / state.duration) * 100 || 0;
        progressFill.style.width = `${progress}%`;
        progressHandle.style.left = `${progress}%`;
        
        currentTimeEl.textContent = formatTime(state.currentTime);
        durationEl.textContent = formatTime(state.duration);
        
        // Update progress circle
        const chapterProgress = ((state.currentChapter - 1) / state.totalChapters) * 100;
        const currentChapterProgress = (state.currentTime / state.duration) * (100 / state.totalChapters);
        state.progress = chapterProgress + currentChapterProgress;
        updateProgressCircle();
    }

    // Update progress circle
    function updateProgressCircle() {
        const circumference = 2 * Math.PI * 15.9155;
        const offset = circumference - (state.progress / 100) * circumference;
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = offset;
        progressPercent.textContent = `${Math.round(state.progress)}%`;
    }

    // Format time (seconds to MM:SS)
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    // Update speed buttons
    function updateSpeedButtons() {
        speedButtons.forEach(btn => {
            btn.classList.toggle('active', parseFloat(btn.dataset.speed) === state.playbackSpeed);
        });
    }

    // Update bookmark info
    function updateBookmarkInfo() {
        if (state.bookmark) {
            const time = formatTime(state.bookmark.time);
            bookmarkInfo.innerHTML = `
                <div>
                    <strong>Chapter ${state.bookmark.chapter}</strong><br>
                    ${time} · ${new Date(state.bookmark.timestamp).toLocaleDateString()}
                </div>
            `;
        } else {
            bookmarkInfo.textContent = 'No bookmark set';
        }
    }

    // Timer functions
    function startTimer() {
        state.timer.running = true;
        state.timer.startTime = Date.now() - state.timer.elapsed;
        timerToggle.textContent = 'Pause Timer';
        updateTimer();
    }

    function pauseTimer() {
        state.timer.running = false;
        state.timer.elapsed = Date.now() - state.timer.startTime;
        timerToggle.textContent = 'Resume Timer';
    }

    function resetTimer() {
        state.timer.running = false;
        state.timer.startTime = 0;
        state.timer.elapsed = 0;
        timerToggle.textContent = 'Start Timer';
        updateTimerDisplay();
    }

    function updateTimer() {
        if (state.timer.running) {
            state.timer.elapsed = Date.now() - state.timer.startTime;
            updateTimerDisplay();
            requestAnimationFrame(updateTimer);
        }
    }

    function updateTimerDisplay() {
        const totalSeconds = Math.floor(state.timer.elapsed / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        timerDisplay.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    // Setup event listeners
    function setupEventListeners() {
        // Audio events
        audioPlayer.addEventListener('loadedmetadata', () => {
            state.duration = audioPlayer.duration;
            updateProgress();
        });

        audioPlayer.addEventListener('timeupdate', () => {
            state.currentTime = audioPlayer.currentTime;
            updateProgress();
        });

        audioPlayer.addEventListener('ended', () => {
            if (state.repeat) {
                audioPlayer.currentTime = 0;
                audioPlayer.play();
            } else if (state.currentChapter < state.totalChapters) {
                loadChapter(state.currentChapter + 1);
                setTimeout(() => togglePlay(), 100);
            } else {
                state.isPlaying = false;
                playIcon.className = 'fas fa-play';
                playerStatus.textContent = 'Finished';
                updateChapterCards();
                pauseTimer();
            }
            saveState();
        });

        // Control buttons
        playBtn.addEventListener('click', togglePlay);

        prevBtn.addEventListener('click', () => {
            if (state.currentChapter > 1) {
                loadChapter(state.currentChapter - 1);
                setTimeout(() => togglePlay(), 100);
            }
        });

        nextBtn.addEventListener('click', () => {
            if (state.currentChapter < state.totalChapters) {
                loadChapter(state.currentChapter + 1);
                setTimeout(() => togglePlay(), 100);
            }
        });

        repeatBtn.addEventListener('click', () => {
            state.repeat = !state.repeat;
            repeatBtn.classList.toggle('active', state.repeat);
            saveState();
        });

        // Progress bar
        progressBar.addEventListener('click', (e) => {
            const rect = progressBar.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audioPlayer.currentTime = percent * state.duration;
        });

        // Volume
        volumeSlider.addEventListener('input', (e) => {
            state.volume = parseFloat(e.target.value);
            audioPlayer.volume = state.volume;
            saveState();
        });

        // Playback speed
        speedButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                state.playbackSpeed = parseFloat(btn.dataset.speed);
                audioPlayer.playbackRate = state.playbackSpeed;
                updateSpeedButtons();
                saveState();
            });
        });

        // Bookmarks
        setBookmarkBtn.addEventListener('click', () => {
            state.bookmark = {
                chapter: state.currentChapter,
                time: state.currentTime,
                timestamp: Date.now()
            };
            updateBookmarkInfo();
            saveState();
            
            // Show confirmation
            const originalText = setBookmarkBtn.innerHTML;
            setBookmarkBtn.innerHTML = '<i class="fas fa-check"></i> Bookmarked!';
            setTimeout(() => {
                setBookmarkBtn.innerHTML = originalText;
            }, 2000);
        });

        goToBookmarkBtn.addEventListener('click', () => {
            if (state.bookmark) {
                loadChapter(state.bookmark.chapter);
                setTimeout(() => {
                    audioPlayer.currentTime = state.bookmark.time;
                    if (!state.isPlaying) {
                        togglePlay();
                    }
                }, 100);
            }
        });

        // Timer
        timerToggle.addEventListener('click', () => {
            if (state.timer.running) {
                pauseTimer();
            } else {
                if (state.timer.elapsed === 0) {
                    startTimer();
                } else {
                    startTimer();
                }
            }
            saveState();
        });

        // Double-click timer to reset
        timerDisplay.addEventListener('dblclick', resetTimer);

        // Notes
        notesArea.addEventListener('input', (e) => {
            state.notes = e.target.value;
            saveState();
        });

        saveNotesBtn.addEventListener('click', () => {
            saveState();
            
            // Show confirmation
            const originalText = saveNotesBtn.textContent;
            saveNotesBtn.textContent = 'Saved!';
            setTimeout(() => {
                saveNotesBtn.textContent = originalText;
            }, 2000);
        });

        // Theme toggle
        themeToggle.addEventListener('click', () => {
            state.darkMode = !state.darkMode;
            document.body.classList.toggle('dark-theme', state.darkMode);
            themeToggle.innerHTML = state.darkMode 
                ? '<i class="fas fa-sun"></i> Light Mode'
                : '<i class="fas fa-moon"></i> Dark Mode';
            saveState();
        });

        // Export notes
        exportNotesBtn.addEventListener('click', () => {
            const blob = new Blob([state.notes], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `don-quixote-notes-${new Date().toISOString().split('T')[0]}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') return;
            
            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    togglePlay();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    audioPlayer.currentTime = Math.max(0, audioPlayer.currentTime - 10);
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    audioPlayer.currentTime = Math.min(state.duration, audioPlayer.currentTime + 10);
                    break;
                case 'm':
                    e.preventDefault();
                    audioPlayer.muted = !audioPlayer.muted;
                    break;
                case 'f':
                    e.preventDefault();
                    if (!document.fullscreenElement) {
                        document.documentElement.requestFullscreen();
                    } else {
                        document.exitFullscreen();
                    }
                    break;
            }
        });

        // Save state before page unload
        window.addEventListener('beforeunload', saveState);
    }

    // Initialize the application
    init();
});