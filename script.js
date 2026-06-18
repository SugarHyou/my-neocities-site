function toggleMenu() {
    const nav = document.querySelector('#col-right');
    nav.classList.toggle('active');

    const btn = document.querySelector('.menu-toggle');
    if (nav.classList.contains('active')) {
        btn.innerHTML = '✕ Close';
    } else {
        btn.innerHTML = '☰ Menu';
    }
}

document.addEventListener('click', function (event) {
    const nav = document.querySelector('#col-right');
    const btn = document.querySelector('.menu-toggle');
    if (!nav.contains(event.target) && !btn.contains(event.target) && nav.classList.contains('active')) {
        toggleMenu();
    }
});

const listOutput = document.getElementById('js-playlist-output');
const audio = document.getElementById('main-player');
const statusText = document.querySelector('.now-playing-text');
const playBtn = document.getElementById('play-pause-btn');

const playlist = [
    { file: '/assets/audio/music/Another Night.mp3', name: '★ Another Night' },
    { file: '/assets/audio/music/チョベリグLucky♡Day.mp3', name: '★ チョベリグLucky♡Day' },
    { file: '/assets/audio/music/CYBER DANCE.mp3', name: '★ CYBER DANCE' },
    { file: '/assets/audio/music/IKE IKE.mp3', name: '★ IKE IKE' },
    { file: '/assets/audio/music/Love Invasion.mp3', name: '★ Love Invasion' },
    { file: '/assets/audio/music/NIGHT OF FIRE.mp3', name: '★ NIGHT OF FIRE' },
    { file: '/assets/audio/music/ONE NIGHT IN ARABIA.mp3', name: '★ ONE NIGHT IN ARABIA' },
    { file: '/assets/audio/music/ルカルカ★ナイトフィーバー 巡音ルカ.mp3', name: '★ ルカルカ★ナイトフィーバー 巡音ルカ' },
    { file: '/assets/audio/music/Velfarre 2000.mp3', name: '★ Velfarre 2000' },
];

let currentTrackIndex = localStorage.getItem('lastTrack') ? parseInt(localStorage.getItem('lastTrack')) : 0;

if (listOutput) {
    playlist.forEach((track, index) => {
        const li = document.createElement('li');
        li.innerText = track.name;

        li.onclick = () => {
            currentTrackIndex = index;
            playSong(track);
        };

        listOutput.appendChild(li);
    });
}

function togglePlay() {
    if (!audio) return;
    if (!audio.src) {
        playSong(playlist[currentTrackIndex]);
        return;
    }

    if (audio.paused) {
        audio.play();
        if (playBtn) playBtn.innerText = "⏸";
        if (statusText) statusText.innerText = "♪ Playing: " + playlist[currentTrackIndex].name;
        localStorage.setItem('isPaused', 'false');
    } else {
        audio.pause();
        if (playBtn) playBtn.innerText = "▶";
        if (statusText) statusText.innerText = "♪ Paused";
        localStorage.setItem('isPaused', 'true');
    }
}

window.addEventListener('load', () => {
    if (!audio) return;
    const savedTime = localStorage.getItem('lastTime');
    const isPaused = localStorage.getItem('isPaused') === 'true';

    audio.src = playlist[currentTrackIndex].file;

    if (savedTime) {
        audio.currentTime = parseFloat(savedTime);
    }

    if (statusText) statusText.innerText = "♪ Last played: " + playlist[currentTrackIndex].name;

    if (!isPaused) {
        audio.play().then(() => {
            if (playBtn) playBtn.innerText = "⏸";
            if (statusText) statusText.innerText = "♪ Playing: " + playlist[currentTrackIndex].name;
        }).catch(error => {
            console.log("Autoplay blocked or user interaction required.");
            if (playBtn) playBtn.innerText = "▶";
        });
    } else {
        if (playBtn) playBtn.innerText = "▶";
        if (statusText) statusText.innerText = "♪ Paused";
    }
});

if (audio) {
    audio.ontimeupdate = () => {
        localStorage.setItem('lastTime', audio.currentTime);
    };

    audio.onended = () => {
        if (!audio.loop) {
            changeTrack(1);
        }
    };
}

function playSong(trackObject) {
    if (!audio) return;
    audio.src = trackObject.file;
    audio.currentTime = 0;
    localStorage.setItem('lastTime', 0);

    audio.play();
    if (playBtn) playBtn.innerText = "⏸";
    if (statusText) statusText.innerText = "♪ Playing: " + trackObject.name;
    localStorage.setItem('lastTrack', currentTrackIndex);
}

function changeTrack(direction) {
    currentTrackIndex += direction;

    if (currentTrackIndex >= playlist.length) currentTrackIndex = 0;
    if (currentTrackIndex < 0) currentTrackIndex = playlist.length - 1;

    playSong(playlist[currentTrackIndex]);
}

function toggleLoop(btn) {
    if (!audio) return;
    audio.loop = !audio.loop;
    btn.classList.toggle('loop-active');
    if (statusText) statusText.innerText = audio.loop ? "♪ Looping: ON" : "♪ Looping: OFF";
}

function changeTheme(themeName) {
    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem('user-theme', themeName);
}

window.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('user-theme');
    const themeSelect = document.getElementById('theme-select');
    
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (themeSelect) themeSelect.value = savedTheme;
    } else {
        const currentMonth = new Date().getMonth(); 
        if (currentMonth === 5 || currentMonth === 6 || currentMonth === 7) {
            const defaultSummerTheme = 'tropical'; 
            document.documentElement.setAttribute('data-theme', defaultSummerTheme);
            if (themeSelect) themeSelect.value = defaultSummerTheme;
        }
    }
    checkReadStatus();
});

// ==========================================
// CALENDAR & HOLIDAYS SYSTEM
// ==========================================

const characterEvents = {
    "4-25": ["SugarHyou's Neocities Anniversary! ✨"],
    "10-14": ["SugarHyou's Birthday! ✨"],
    "2026-5-2": ["One4AllTeam Cosplay Meetup"],
    "2026-5-15": ["Comic-Con Revolution Early Badge Pickup"],    
    "2026-5-16": ["Comic-Con Revolution! ✨"],
    "2026-5-17": ["Comic-Con Revolution! ✨"],
    "2026-5-21": ["BN Appt"],
    "2026-5-24": ["BKawaii Market x Kira Kira Gals! ✨"],
    "2026-5-30": ["Anime Riverside ✨"],
    "2026-5-31": ["Anime Riverside ✨"],
    "2026-6-6": ["One4AllTeam "],
    "2026-6-8": ["Photoshoot"],
    "2026-6-19": ["The Nostalgia Con"],
    "2026-6-20": [
        "Anime Night Mart",
        "Harajuku Day Swap Meet",
        "The Nostalgia Con",
        "Jade's Furry Friends 5K Run/Walk",
        "QCON",
        "Santa Ana Flea Market",
    ],
    "2026-6-21": ["The Nostalgia Con",
        "Anime Night Mart"
    ],
    "2026-6-22": ["Summer BRIDGE"],
    "2026-6-23": ["Summer BRIDGE"],
    "2026-6-24": ["Summer BRIDGE"],
    "2026-6-25": ["Summer BRIDGE"],
    "2026-6-26": ["Fan Expo Anaheim"],
    "2026-6-27": ["Fan Expo Anaheim"],
    "2026-6-28": ["Fan Expo Anaheim"],
    "2026-6-29": ["Summer BRIDGE"],
    "2026-6-30": ["Summer BRIDGE"],
    "2026-7-1": ["Summer BRIDGE"],
    "2026-7-2": ["Anime Expo! ✨",
        "Summer BRIDGE"
    ],
    "2026-7-3": ["Anime Expo! ✨"],
    "2026-7-4": ["Harajuku Day Swap Meet",
        "Anime Expo"
    ],
    "2026-7-5": ["Anime Expo"],
    "2026-7-11": ["Spirit of Japan Festival! ✨"
    ],
    "2026-7-12": ["Spirit of Japan Festival"
    ],
    "2026-8-15": ["Sonic Boost"],
    "2026-8-16": ["Sonic Boost"],
    "2026-9-5": ["Anime San Diego! ✨"],
    "2026-9-6": ["Anime San Diego! ✨"],
};

let fetchedHolidays = {};
let loadedHolidayYear = null;
let date = new Date();

function fetchHolidays(year) {
    fetchedHolidays = {}; 
    const url = `https://date.nager.at/api/v3/PublicHolidays/${year}/US`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            data.forEach(holiday => {
                const parts = holiday.date.split('-'); 
                const y = parseInt(parts[0], 10);
                const m = parseInt(parts[1], 10);
                const d = parseInt(parts[2], 10);
                
                const key = `${y}-${m}-${d}`;
                fetchedHolidays[key] = holiday.localName;
            });
            renderCalendar();
        })
        .catch(err => console.error("Error fetching holidays:", err));
}

function checkAndFetchHolidays() {
    const currentYear = date.getFullYear();
    if (loadedHolidayYear !== currentYear) {
        loadedHolidayYear = currentYear;
        fetchHolidays(currentYear);
    }
}

function renderCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const grid = document.getElementById('calendarGrid');
    if (!grid || !monthDisplay) return; 
    
    grid.innerHTML = "";

    const year = date.getFullYear();
    const month = date.getMonth();

    const monthName = date.toLocaleString('default', { month: 'long' });
    monthDisplay.innerText = `${monthName} ${year}`;

    const firstDay = new Date(year, month, 1).getDay();
    const lastDate = new Date(year, month + 1, 0).getDate();
    const todayDate = new Date();

    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        grid.appendChild(emptyDiv);
    }

    for (let i = 1; i <= lastDate; i++) {
        const dayDiv = document.createElement('div');
        dayDiv.innerText = i;

        const absoluteKey = `${year}-${month + 1}-${i}`;
        const recurringKey = `${month + 1}-${i}`;

        if (
            i === todayDate.getDate() &&
            month === todayDate.getMonth() &&
            year === todayDate.getFullYear()
        ) {
            dayDiv.classList.add('today');
        }

        let dayEvents = [];

        if (characterEvents[absoluteKey]) {
            dayEvents = dayEvents.concat(characterEvents[absoluteKey]);
        }
        if (characterEvents[recurringKey]) {
            dayEvents = dayEvents.concat(characterEvents[recurringKey]);
        }
        if (fetchedHolidays[absoluteKey]) {
            dayEvents.push(fetchedHolidays[absoluteKey]);
        }

        if (dayEvents.length > 0) {
            dayDiv.classList.add('event-day');
            
            const hasCustomEvents = characterEvents[absoluteKey] || characterEvents[recurringKey];
            if (fetchedHolidays[absoluteKey] && !hasCustomEvents) {
                dayDiv.classList.add('holiday-day'); 
            }
            
            const combinedText = dayEvents.join('\n');
            dayDiv.title = combinedText;
            dayDiv.onclick = () => alert(`Events for today:\n\n${combinedText}`);
        }

        grid.appendChild(dayDiv);
    }
}

const prevBtn = document.getElementById('prevMonth');
const nextBtn = document.getElementById('nextMonth');

if (prevBtn) {
    prevBtn.onclick = () => {
        date.setMonth(date.getMonth() - 1);
        checkAndFetchHolidays();
        renderCalendar();
    };
}

if (nextBtn) {
    nextBtn.onclick = () => {
        date.setMonth(date.getMonth() + 1);
        checkAndFetchHolidays();
        renderCalendar();
    };
}

checkAndFetchHolidays();
renderCalendar();


// ==========================================
// 📖 MANGA VOLUME CHAPTER READER ENGINE (PER-PAGE STORAGE)
// ==========================================

function toggleLanguage() {
  let currentLang = localStorage.getItem('site-lang') || 'en';
  let newLang = currentLang === 'en' ? 'jp' : 'en';
  localStorage.setItem('site-lang', newLang);
  applyLanguage(newLang);
}

function applyLanguage(lang) {
  const elements = document.querySelectorAll('.lang-text');
  const toggleBtn = document.getElementById('lang-toggle');
  elements.forEach(el => {
    if (lang === 'jp') {
      if (el.getAttribute('data-jp')) el.textContent = el.getAttribute('data-jp');
    } else {
      if (el.getAttribute('data-en')) el.textContent = el.getAttribute('data-en');
    }
  });

  if (toggleBtn) {
    toggleBtn.textContent = lang === 'en' ? '🇯🇵 Switch to JP' : '🇺🇸 Switch to EN';
  }
  
  document.documentElement.lang = lang;
}

document.addEventListener("DOMContentLoaded", () => {
  let savedLang = localStorage.getItem('site-lang') || 'en';
  applyLanguage(savedLang);
});