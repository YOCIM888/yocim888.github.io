const path = require('path');
const { paths } = require('../config');
const logger = require('../utils/logger');
const fileSystem = require('../utils/fileSystem');

const SUBPAGE_CONFIG = [
  {
    type: 'novel',
    dataFile: path.join(paths.data, 'novel.json'),
    outputFile: path.join(paths.root, 'pages', 'novel.html'),
    template: 'manga'
  },
  {
    type: 'comic',
    dataFile: path.join(paths.data, 'comic.json'),
    outputFile: path.join(paths.root, 'pages', 'Comic.html'),
    template: 'manga'
  },
  {
    type: 'game',
    dataFile: path.join(paths.data, 'game.json'),
    outputFile: path.join(paths.root, 'pages', 'Game.html'),
    template: 'game'
  },
  {
    type: 'music',
    dataFile: path.join(paths.data, 'music.json'),
    outputFile: path.join(paths.root, 'pages', 'music.html'),
    template: 'music'
  }
];

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getMangaStyle() {
  return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif;
        }

        body {
            background: #fff5f8;
            background-image: radial-gradient(circle at 20% 30%, #fff0f5 0%, #fffafa 70%);
            min-height: 100vh;
            padding: 2rem 1.5rem;
            scrollbar-width: thin;
            scrollbar-color: #ffb6c1 #ffe6f0;
        }
        body::-webkit-scrollbar {
            width: 8px;
        }
        body::-webkit-scrollbar-thumb {
            background: #ffb6c1;
            border-radius: 10px;
        }
        body::-webkit-scrollbar-track {
            background: #ffe6f0;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            margin-bottom: 2rem;
            text-align: center;
        }

        .header h1 {
            font-size: 3.2rem;
            font-weight: 800;
            background: linear-gradient(145deg, #6b3a5a, #ff8fab);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.02em;
            filter: drop-shadow(0 8px 12px #ffd0e0);
        }

        .badge-strip {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem 2rem;
            margin: 1.2rem 0 2rem;
        }

        .badge-item {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(6px);
            border-radius: 60px;
            padding: 0.5rem 1.6rem;
            font-weight: 600;
            color: #5a3a5a;
            border: 1px solid #ffffff;
            box-shadow: 0 6px 14px rgba(255, 143, 171, 0.12);
            font-size: 1rem;
        }

        .intro-msg {
            background: #ffffffd9;
            border-radius: 40px;
            padding: 1.2rem 2.2rem;
            width: fit-content;
            margin: 1.5rem auto 2rem;
            border: 1px solid white;
            box-shadow: 0 12px 28px -10px #ffb0c8;
            font-size: 1.1rem;
            color: #4a2a3a;
            font-weight: 450;
            display: inline-flex;
            align-items: center;
            gap: 1rem;
            flex-wrap: wrap;
            justify-content: center;
        }

        .intro-msg span {
            background: #e0507a;
            color: white;
            padding: 0.2rem 1.4rem;
            border-radius: 40px;
            font-size: 0.9rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
            gap: 1.8rem;
            margin: 2.5rem 0 2rem;
        }

        .manga-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(10px);
            border-radius: 36px;
            padding: 1.6rem 1.5rem 1.9rem;
            border: 1px solid rgba(255,255,255,0.8);
            box-shadow: 0 20px 35px -10px #ffb0c8;
            transition: transform 0.15s ease, box-shadow 0.2s;
            display: flex;
            flex-direction: column;
            height: 100%;
            text-decoration: none;
            color: inherit;
            cursor: pointer;
        }

        .manga-card:hover {
            transform: translateY(-6px);
            background: white;
            border-color: #ffd0e0;
            box-shadow: 0 30px 45px -12px #f0a0b8;
        }

        .manga-card:link,
        .manga-card:visited,
        .manga-card:hover,
        .manga-card:active {
            text-decoration: none;
            color: inherit;
        }

        .card-top {
            display: flex;
            align-items: center;
            gap: 0.8rem;
            flex-wrap: wrap;
            margin-bottom: 0.8rem;
        }

        .rank-badge {
            background: #ffe4ec;
            color: #6b3a5a;
            font-weight: 700;
            font-size: 0.8rem;
            padding: 0.3rem 1rem;
            border-radius: 40px;
            border: 1px solid #ffb0c8;
        }

        .badge-gold {
            background: #ffe9b6;
            border-color: #ccaa6c;
            color: #5b4000;
        }

        .badge-purple {
            background: #ffe4ec;
            border-color: #ff8fab;
        }

        .badge-blue {
            background: #c7e4ff;
            border-color: #3f86c5;
            color: #10375e;
        }

        .manga-title {
            font-size: 1.7rem;
            font-weight: 750;
            line-height: 1.2;
            color: #4a2a3a;
            margin: 0.3rem 0 0.2rem;
        }

        .manga-author {
            color: #8a5a7a;
            font-weight: 500;
            font-size: 0.95rem;
            margin-bottom: 0.8rem;
            border-left: 4px solid #ff8fab;
            padding-left: 0.7rem;
        }

        .recommend-box {
            background: #fff0f5;
            border-radius: 24px;
            padding: 1rem 1.2rem;
            margin: 0.8rem 0 1rem;
            border: 1px solid #ffffff;
            box-shadow: inset 0 1px 4px #ffffff, 0 4px 10px rgba(255, 123, 156, 0.1);
        }

        .recommend-label {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 0.8rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #880e4f;
            margin-bottom: 0.5rem;
        }

        .recommend-label span {
            background: #ffb0c8;
            padding: 0.2rem 0.8rem;
            border-radius: 40px;
        }

        .recommend-text {
            color: #4a2a3a;
            font-size: 0.98rem;
            line-height: 1.5;
        }

        .meta-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.8rem;
            align-items: center;
        }

        .tag {
            background: white;
            border-radius: 40px;
            padding: 0.2rem 1rem;
            font-size: 0.8rem;
            border: 1px solid #ffc0d5;
            color: #6b3a5a;
        }

        .tag-strong {
            background: #ffefc9;
            border-color: #e6b85c;
        }

        .footer-note {
            text-align: center;
            margin-top: 4rem;
            padding-top: 2.5rem;
            border-top: 3px dashed #ffb0c8;
            color: #7a5a6a;
            font-size: 0.95rem;
        }

        .source-line {
            background: #ffe4ec;
            border-radius: 60px;
            padding: 0.6rem 2rem;
            display: inline-block;
            margin-bottom: 2rem;
        }

        @media (max-width: 600px) {
            .header h1 { font-size: 2.5rem; }
            .subpage-header {
                padding: 0.4rem 3%;
                border-radius: 16px;
            }
            .subpage-logo {
                font-size: 1rem;
            }
            .subpage-logo-img {
                width: 28px;
                height: 28px;
            }
            .subpage-quote {
                font-size: 0.7rem;
            }
            .subpage-theme-toggle,
            .subpage-player-icon {
                width: 30px;
                height: 30px;
                font-size: 0.85rem;
            }
            .subpage-music-player {
                width: 240px;
                right: 10px;
                top: 70px;
            }
            .subpage-player-controls button {
                width: 38px;
                height: 38px;
                font-size: 1.1rem;
            }
            #subpagePlayPauseBtn {
                width: 46px;
                height: 46px;
                font-size: 1.4rem;
            }
        }

        .subpage-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 5%;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            position: sticky;
            top: 8px;
            margin: 8px 8px 1.5rem;
            z-index: 100;
        }
        .subpage-logo {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: #ff7b9c;
            font-size: 1.3rem;
            font-weight: 600;
            text-shadow: 1px 1px 0 #ffe0e8;
            white-space: nowrap;
            cursor: pointer;
        }
        .subpage-logo-img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 143, 171, 0.4);
        }
        .subpage-quote {
            flex: 1;
            text-align: center;
            font-size: 0.85rem;
            color: #6a5a6a;
            font-style: italic;
            padding: 0 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .subpage-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }
        .subpage-theme-toggle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #ffd9e6;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 2px 8px rgba(255, 180, 200, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #ff8fab;
            transition: all 0.2s;
        }
        .subpage-theme-toggle:hover {
            background: #ffb6c1;
            color: white;
            transform: scale(1.1);
        }
        .subpage-player-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #ffd9e6;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 2px 8px rgba(255, 180, 200, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #ff8fab;
            transition: all 0.2s;
        }
        .subpage-player-icon:hover {
            background: #ffb6c1;
            color: white;
            transform: scale(1.1);
        }

        .subpage-music-player {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 200px;
            background: rgba(255, 240, 250, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 24px;
            padding: 0.5rem 0.3rem 0.5rem;
            box-shadow: 0 15px 35px rgba(255, 150, 180, 0.25);
            border: 1px solid rgba(255, 220, 240, 0.8);
            z-index: 1000;
            transition: opacity 0.2s, visibility 0.2s;
            opacity: 1;
            visibility: visible;
        }
        .subpage-music-player.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        .subpage-player-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            padding-bottom: 0.4rem;
            border-bottom: 2px dashed #ffbfd5;
        }
        .subpage-player-title {
            font-weight: 600;
            color: #ff8fab;
            font-size: 1rem;
        }
        .subpage-player-title i {
            margin-right: 5px;
            color: #ff7b9c;
        }
        .subpage-close-player {
            background: none;
            border: none;
            font-size: 1.1rem;
            color: #f0b8cc;
            cursor: pointer;
            padding: 0 4px;
            transition: color 0.2s;
        }
        .subpage-close-player:hover {
            color: #ff7b9c;
        }
        .subpage-song-info {
            text-align: center;
            margin-bottom: 0.8rem;
        }
        .subpage-song-name {
            font-weight: 600;
            color: #5a4a5a;
            background: rgba(255, 220, 240, 0.6);
            padding: 0.2rem 0.8rem;
            border-radius: 30px;
            display: inline-block;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.95rem;
        }
        .subpage-progress-container {
            margin: 0.8rem 0;
        }
        .subpage-progress-bar {
            width: 100%;
            height: 4px;
            border-radius: 10px;
            background: #ffd0dd;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
            cursor: pointer;
        }
        .subpage-progress-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: #ff7b9c;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px #ff9eb5;
            transition: 0.1s;
        }
        .subpage-progress-bar::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: #ff5f8a;
        }
        .subpage-time {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #d4729a;
            margin-top: 4px;
        }
        .subpage-player-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 0.6rem;
        }
        .subpage-player-controls button {
            background: white;
            border: none;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            color: #ff8fab;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 5px 12px rgba(255, 150, 170, 0.3);
            transition: 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        #subpagePlayPauseBtn {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
            background: #ff9eb5;
            color: white;
        }
        .subpage-player-controls button:hover {
            background: #ffb6c1;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 8px 18px #ff9eb5;
        }
        #subpagePlayPauseBtn:hover {
            background: #ff7b9c;
        }

        body.dark {
            background: #1a1020 !important;
            background-image: radial-gradient(circle at 20% 30%, #2a1a25 0%, #0f0a10 70%) !important;
            scrollbar-color: #8a4f6a #2a1a25;
        }
        body.dark::-webkit-scrollbar-thumb {
            background: #8a4f6a;
        }
        body.dark::-webkit-scrollbar-track {
            background: #2a1a25;
        }
        body.dark .manga-card {
            background: rgba(30, 20, 30, 0.85);
            border-color: #4a3a4a;
            box-shadow: 0 20px 35px -10px rgba(100, 50, 80, 0.3);
        }
        body.dark .manga-card:hover {
            background: rgba(40, 28, 40, 0.95);
            border-color: #ff8fab;
        }
        body.dark .manga-title { color: #f0c0d0; }
        body.dark .manga-author { color: #c0a0b0; border-left-color: #ff8fab; }
        body.dark .rank-badge { background: #2a1f2a; color: #d0b0c0; border-color: #5a4a5a; }
        body.dark .badge-gold { background: #3a2a10; border-color: #8a6a2a; color: #e0c070; }
        body.dark .badge-purple { background: #2a1a2a; border-color: #7a4a6a; color: #c0a0e0; }
        body.dark .badge-blue { background: #1a2a3a; border-color: #3a6a9a; color: #a0c0e0; }
        body.dark .recommend-box { background: #1e1520; border-color: #3a2a3a; box-shadow: inset 0 1px 4px #2a1a2a; }
        body.dark .recommend-label { color: #c0a0b0; }
        body.dark .recommend-label span { background: #3a2a3a; }
        body.dark .recommend-text { color: #d0c0e0; }
        body.dark .tag { background: #2a1f2a; border-color: #5a4a5a; color: #d0b0c0; }
        body.dark .badge-item { background: rgba(30, 20, 30, 0.7); color: #d0b0c0; border-color: #4a3a4a; }
        body.dark .intro-msg { background: rgba(30, 20, 30, 0.8); color: #d0c0e0; border-color: #4a3a4a; }
        body.dark .intro-msg span { background: #a03a6a; }
        body.dark .footer-note { border-top-color: #4a3a4a; color: #a08a9a; }
        body.dark .source-line { background: #2a1f2a; }
        body.dark .subpage-theme-toggle {
            background: rgba(30, 20, 30, 0.8);
            color: #ffa0b0;
            border-color: #5a4a5a;
        }
        body.dark .subpage-header {
            background: rgba(20, 20, 35, 0.8);
            border-color: #444;
        }
        body.dark .subpage-logo {
            color: #e0e0e0;
            text-shadow: none;
        }
        body.dark .subpage-logo-img {
            border-color: rgba(255, 160, 190, 0.5);
        }
        body.dark .subpage-quote {
            color: #b0b0b0;
        }
        body.dark .subpage-player-icon {
            background: rgba(30, 20, 30, 0.8);
            color: #ffa0b0;
            border-color: #5a4a5a;
        }
        body.dark .subpage-music-player {
            background: rgba(20, 20, 35, 0.9);
            border-color: #444;
        }
        body.dark .subpage-player-title {
            color: #f0a0b0;
        }
        body.dark .subpage-song-name {
            color: #e0e0e0;
            background: rgba(255, 255, 255, 0.1);
        }
        body.dark .subpage-close-player {
            color: #888;
        }
        body.dark .subpage-close-player:hover {
            color: #ff7b9c;
        }
        body.dark .subpage-progress-bar {
            background: #4a3a4a;
        }
        body.dark .subpage-time {
            color: #999;
        }
        body.dark .subpage-player-controls button {
            background: #3a2e3a;
            color: #f0b0c0;
            border-color: #5a4a5a;
        }
        body.dark .subpage-player-controls button:hover {
            background: #8a4f6a;
        }
        body.dark #subpagePlayPauseBtn {
            background: #c07090;
            color: white;
        }`;
}

function getGameStyle() {
  return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', 'Segoe UI', Roboto, system-ui, sans-serif;
        }

        body {
            background: #0d0b12;
            background-image: radial-gradient(circle at 30% 10%, #1f1b25 0%, #0b0810 100%);
            min-height: 100vh;
            padding: 2rem 1.2rem;
            color: #f0e0f0;
            scrollbar-width: thin;
            scrollbar-color: #8a4f6a #2a1a25;
        }
        body::-webkit-scrollbar {
            width: 8px;
        }
        body::-webkit-scrollbar-thumb {
            background: #8a4f6a;
            border-radius: 10px;
        }
        body::-webkit-scrollbar-track {
            background: #2a1a25;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
        }

        .header h1 {
            font-size: 3.2rem;
            font-weight: 800;
            background: linear-gradient(135deg, #ffb0c8, #ff9eb5);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            letter-spacing: -0.02em;
            filter: drop-shadow(0 0 15px #c0507a);
        }

        .sub-line {
            color: #f0a0b8;
            font-size: 1.2rem;
            margin: 0.8rem 0 2rem;
            border-bottom: 2px dashed #c0507a;
            padding-bottom: 1rem;
            display: inline-block;
        }

        .rule-badge {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem 2rem;
            margin: 2rem 0 1.5rem;
        }

        .rule-item {
            background: #1e1830;
            border-radius: 60px;
            padding: 0.5rem 1.8rem;
            border: 1px solid #c0507a;
            color: #ffc0d5;
            font-weight: 500;
            font-size: 0.95rem;
            backdrop-filter: blur(5px);
        }

        .rule-item strong {
            color: white;
            font-weight: 700;
        }

        .category-tabs {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 0.8rem;
            margin: 2.5rem 0 1.5rem;
        }

        .tab {
            background: #1d1728;
            border: 1.5px solid #9a4a7a;
            border-radius: 50px;
            padding: 0.8rem 2.8rem;
            font-weight: 700;
            font-size: 1.3rem;
            color: #ffb0c8;
            cursor: default;
            box-shadow: 0 6px 14px rgba(0,0,0,0.6);
            transition: 0.1s;
        }

        .tab.active {
            background: linear-gradient(145deg, #b0407a, #5a2a4a);
            border-color: #ff8fab;
            color: white;
            box-shadow: 0 0 18px #ff7b9c;
        }

        .tab-small {
            font-size: 0.9rem;
            margin-left: 0.5rem;
            opacity: 0.8;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.8rem;
            margin: 2rem 0 3rem;
        }

        .game-card {
            background: #16121ed9;
            backdrop-filter: blur(10px);
            border-radius: 36px;
            padding: 1.6rem 1.4rem 1.8rem;
            border: 1px solid #9a4a7a;
            box-shadow: 0 20px 30px -12px #00000080, 0 0 0 1px #3a2a3a inset;
            transition: all 0.15s;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: inherit;
            cursor: pointer;
        }

        .game-card:link,
        .game-card:visited,
        .game-card:hover,
        .game-card:active {
            text-decoration: none;
            color: inherit;
        }

        .game-card:hover {
            transform: translateY(-6px);
            border-color: #ff8fab;
            background: #1f1930;
            box-shadow: 0 25px 40px -10px #221c30;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
        }

        .platform-tag {
            background: #3a2040;
            color: #cfc3ff;
            border-radius: 40px;
            padding: 0.2rem 1rem;
            font-size: 0.75rem;
            font-weight: 600;
            border: 1px solid #c0507a;
        }

        .badge-3a {
            background: #b35f2e;
            color: #fae3d0;
            border-color: #f8a76b;
        }

        .badge-pc {
            background: #306f6f;
            color: #c8f0f0;
            border-color: #3dbbbb;
        }

        .badge-mobile {
            background: #a04a6a;
            color: #ffe4ec;
            border-color: #ff8fab;
        }

        .game-title {
            font-size: 1.6rem;
            font-weight: 750;
            line-height: 1.2;
            color: #ffffff;
            margin: 0.2rem 0 0.3rem;
            letter-spacing: -0.01em;
        }

        .game-sub {
            color: #f0a0b8;
            font-size: 0.9rem;
            margin-bottom: 1rem;
            border-left: 3px solid #ff8fab;
            padding-left: 0.7rem;
        }

        .reason-box {
            background: #221d30;
            border-radius: 22px;
            padding: 1rem 1.2rem;
            margin: 0.6rem 0 1rem;
            border: 1px solid #9a4a7a;
            box-shadow: inset 0 1px 4px #c0507a;
        }

        .reason-label {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #ffb0c8;
            font-weight: 600;
            font-size: 0.75rem;
            letter-spacing: 0.6px;
            margin-bottom: 0.3rem;
        }

        .reason-label span {
            background: #4a2a4a;
            padding: 0.2rem 1rem;
            border-radius: 40px;
        }

        .reason-text {
            color: #fce4ec;
            font-size: 0.96rem;
            line-height: 1.5;
        }

        .extra-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 0.6rem;
            font-size: 0.8rem;
            color: #c07090;
        }

        .extra-meta span {
            background: #2c2540;
            padding: 0.2rem 1rem;
            border-radius: 40px;
            border: 1px solid #9a4a7a;
        }

        .footer-note {
            text-align: center;
            margin-top: 4rem;
            padding: 2rem 0 1rem;
            border-top: 2px solid #5a2a4a;
            color: #c07090;
            font-size: 0.95rem;
        }

        .badge-warn {
            background: #3a2040;
            border-radius: 20px;
            padding: 0.2rem 1.2rem;
            display: inline-block;
            border: 1px solid #c0507a;
        }

        hr {
            border: 1px dashed #5a2a4a;
            margin: 2rem 0;
        }

        @media (max-width: 600px) {
            .header h1 { font-size: 2.3rem; }
            .tab { font-size: 1rem; padding: 0.6rem 1.2rem; }
            .subpage-header {
                padding: 0.4rem 3%;
                border-radius: 16px;
            }
            .subpage-logo {
                font-size: 1rem;
            }
            .subpage-logo-img {
                width: 28px;
                height: 28px;
            }
            .subpage-quote {
                font-size: 0.7rem;
            }
            .subpage-theme-toggle,
            .subpage-player-icon {
                width: 30px;
                height: 30px;
                font-size: 0.85rem;
            }
            .subpage-music-player {
                width: 240px;
                right: 10px;
                top: 70px;
            }
            .subpage-player-controls button {
                width: 38px;
                height: 38px;
                font-size: 1.1rem;
            }
            #subpagePlayPauseBtn {
                width: 46px;
                height: 46px;
                font-size: 1.4rem;
            }
        }

        .subpage-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 5%;
            background: rgba(20, 20, 35, 0.8);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
            border: 1px solid #444;
            border-radius: 20px;
            position: sticky;
            top: 8px;
            margin: 8px 8px 1.5rem;
            z-index: 100;
        }
        .subpage-logo {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: #e0e0e0;
            font-size: 1.3rem;
            font-weight: 600;
            white-space: nowrap;
            cursor: pointer;
        }
        .subpage-logo-img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 160, 190, 0.5);
        }
        .subpage-quote {
            flex: 1;
            text-align: center;
            font-size: 0.85rem;
            color: #b0b0b0;
            font-style: italic;
            padding: 0 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .subpage-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }
        .subpage-theme-toggle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(30, 20, 30, 0.8);
            border: 2px solid #5a4a5a;
            box-shadow: 0 2px 8px rgba(150, 50, 100, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #ffa0b0;
            transition: all 0.2s;
        }
        .subpage-theme-toggle:hover {
            background: #8a4f6a;
            color: white;
            transform: scale(1.1);
        }
        .subpage-player-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: rgba(30, 20, 30, 0.8);
            border: 2px solid #5a4a5a;
            box-shadow: 0 2px 8px rgba(150, 50, 100, 0.3);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #ffa0b0;
            transition: all 0.2s;
        }
        .subpage-player-icon:hover {
            background: #8a4f6a;
            color: white;
            transform: scale(1.1);
        }

        .subpage-music-player {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 200px;
            background: rgba(20, 20, 35, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 24px;
            padding: 0.5rem 0.3rem 0.5rem;
            box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
            border: 1px solid #444;
            z-index: 1000;
            transition: opacity 0.2s, visibility 0.2s;
            opacity: 1;
            visibility: visible;
        }
        .subpage-music-player.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        .subpage-player-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            padding-bottom: 0.4rem;
            border-bottom: 2px dashed #5a2a4a;
        }
        .subpage-player-title {
            font-weight: 600;
            color: #f0a0b0;
            font-size: 1rem;
        }
        .subpage-player-title i {
            margin-right: 5px;
            color: #ff7b9c;
        }
        .subpage-close-player {
            background: none;
            border: none;
            font-size: 1.1rem;
            color: #888;
            cursor: pointer;
            padding: 0 4px;
            transition: color 0.2s;
        }
        .subpage-close-player:hover {
            color: #ff7b9c;
        }
        .subpage-song-info {
            text-align: center;
            margin-bottom: 0.8rem;
        }
        .subpage-song-name {
            font-weight: 600;
            color: #e0e0e0;
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2rem 0.8rem;
            border-radius: 30px;
            display: inline-block;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.95rem;
        }
        .subpage-progress-container {
            margin: 0.8rem 0;
        }
        .subpage-progress-bar {
            width: 100%;
            height: 4px;
            border-radius: 10px;
            background: #4a3a4a;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
            cursor: pointer;
        }
        .subpage-progress-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: #ff7b9c;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px #ff9eb5;
            transition: 0.1s;
        }
        .subpage-progress-bar::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: #ff5f8a;
        }
        .subpage-time {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #999;
            margin-top: 4px;
        }
        .subpage-player-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 0.6rem;
        }
        .subpage-player-controls button {
            background: #3a2e3a;
            border: none;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            color: #f0b0c0;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3);
            transition: 0.2s;
            border: 1px solid #5a4a5a;
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        #subpagePlayPauseBtn {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
            background: #c07090;
            color: white;
        }
        .subpage-player-controls button:hover {
            background: #8a4f6a;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 8px 18px rgba(150, 50, 100, 0.4);
        }
        #subpagePlayPauseBtn:hover {
            background: #ff7b9c;
        }

        body.dark {
            background: #050310 !important;
            background-image: radial-gradient(circle at 30% 10%, #0f0a15 0%, #020105 100%) !important;
            scrollbar-color: #6a3a5a #1a0a15;
        }
        body.dark::-webkit-scrollbar-thumb {
            background: #6a3a5a;
        }
        body.dark::-webkit-scrollbar-track {
            background: #1a0a15;
        }
        body.dark .game-card {
            background: rgba(10, 6, 15, 0.95);
            border-color: #3a2a3a;
        }
        body.dark .game-card:hover {
            background: rgba(18, 12, 25, 0.98);
            border-color: #ff8fab;
        }
        body.dark .game-title { color: #f0e0f0; }
        body.dark .game-sub { color: #c07090; border-left-color: #ff8fab; }
        body.dark .platform-tag { background: #1a1020; border-color: #7a4a6a; color: #c080a0; }
        body.dark .reason-box { background: #0e0a15; border-color: #3a2a3a; }
        body.dark .reason-label { color: #c07090; }
        body.dark .reason-label span { background: #1e1440; }
        body.dark .reason-text { color: #d0b0c0; }
        body.dark .extra-meta span { background: #120e1e; border-color: #6a3a5a; }
        body.dark .rule-item { background: #0e0a15; border-color: #3a2a3a; }
        body.dark .tab { background: #0a0810; border-color: #3a2a3a; }
        body.dark .tab.active { background: linear-gradient(145deg, #6a2060, #2a1430); }
        body.dark .footer-note { border-top-color: #3a1a3a; color: #a06a8a; }
        body.dark .badge-warn { background: #1a1020; border-color: #7a4a6a; }
        body.dark hr { border-color: #3a1a3a; }
        body.dark .subpage-theme-toggle {
            background: rgba(10, 6, 15, 0.9);
            border-color: #7a4a6a;
            color: #f0c0d0;
        }
        body.dark .subpage-header {
            background: rgba(10, 10, 20, 0.9);
            border-color: #333;
        }
        body.dark .subpage-logo {
            color: #d0d0d0;
        }
        body.dark .subpage-logo-img {
            border-color: rgba(255, 160, 190, 0.4);
        }
        body.dark .subpage-quote {
            color: #999;
        }
        body.dark .subpage-player-icon {
            background: rgba(10, 6, 15, 0.9);
            border-color: #7a4a6a;
            color: #f0c0d0;
        }
        body.dark .subpage-music-player {
            background: rgba(10, 10, 20, 0.95);
            border-color: #333;
        }
        body.dark .subpage-player-title {
            color: #e090a0;
        }
        body.dark .subpage-song-name {
            color: #d0d0d0;
            background: rgba(255, 255, 255, 0.08);
        }
        body.dark .subpage-close-player {
            color: #777;
        }
        body.dark .subpage-close-player:hover {
            color: #ff7b9c;
        }
        body.dark .subpage-progress-bar {
            background: #3a2a3a;
        }
        body.dark .subpage-time {
            color: #888;
        }
        body.dark .subpage-player-controls button {
            background: #2a1e2a;
            color: #e0a0b0;
            border-color: #4a3a4a;
        }
        body.dark .subpage-player-controls button:hover {
            background: #7a4f6a;
        }
        body.dark #subpagePlayPauseBtn {
            background: #a06080;
            color: white;
        }`;
}

function getMusicStyle() {
  return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: 'Inter', 'Helvetica Neue', 'Segoe UI', system-ui, sans-serif;
        }

        body {
            background: linear-gradient(165deg, #fff0f5 0%, #ffe4ec 100%);
            min-height: 100vh;
            padding: 2rem 1.5rem;
            scrollbar-width: thin;
            scrollbar-color: #ffb6c1 #ffe6f0;
        }
        body::-webkit-scrollbar {
            width: 8px;
        }
        body::-webkit-scrollbar-thumb {
            background: #ffb6c1;
            border-radius: 10px;
        }
        body::-webkit-scrollbar-track {
            background: #ffe6f0;
        }

        .container {
            max-width: 1400px;
            margin: 0 auto;
        }

        .header {
            text-align: center;
            margin-bottom: 2.5rem;
        }

        .header h1 {
            font-size: 3.2rem;
            font-weight: 800;
            background: linear-gradient(145deg, #880e4f, #ff8fab);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            filter: drop-shadow(0 8px 12px #ffb0c8);
            letter-spacing: -0.02em;
        }

        .sub-badge {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem 2.5rem;
            margin: 1rem 0 1.8rem;
        }

        .pill {
            background: rgba(255, 255, 255, 0.6);
            backdrop-filter: blur(10px);
            border-radius: 60px;
            padding: 0.5rem 2rem;
            border: 1px solid white;
            color: #5a3a5a;
            font-weight: 600;
            box-shadow: 0 6px 14px rgba(255, 143, 171, 0.2);
        }

        .intro-note {
            background: #ffffffc2;
            backdrop-filter: blur(4px);
            border-radius: 60px;
            padding: 1rem 2.2rem;
            width: fit-content;
            margin: 0 auto 2.5rem;
            border: 1px solid white;
            color: #5a3a5a;
            font-size: 1.05rem;
        }

        .section-title {
            font-size: 2rem;
            font-weight: 700;
            color: #5a3a5a;
            margin: 2.2rem 0 1.2rem 0;
            border-left: 10px solid #ff8fab;
            padding-left: 1.2rem;
        }

        .section-sub {
            color: #8a5a7a;
            margin-bottom: 1.8rem;
            font-size: 1.1rem;
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
            gap: 1.8rem;
        }

        a.song-card {
            background: rgba(255, 255, 255, 0.85);
            backdrop-filter: blur(8px);
            border-radius: 36px;
            padding: 1.5rem 1.5rem 1.8rem;
            border: 1px solid rgba(255,255,255,0.8);
            box-shadow: 0 20px 30px -10px #ffb0c8;
            transition: 0.15s;
            display: flex;
            flex-direction: column;
            text-decoration: none;
            color: inherit;
            cursor: pointer;
        }

        a.song-card:link,
        a.song-card:visited,
        a.song-card:hover,
        a.song-card:active {
            text-decoration: none;
            color: inherit;
        }

        a.song-card:hover {
            transform: translateY(-6px);
            background: #ffffff;
            border-color: #ffc0d5;
            box-shadow: 0 28px 40px -12px #f0a0b8;
        }

        .card-header {
            display: flex;
            align-items: center;
            gap: 0.6rem;
            flex-wrap: wrap;
            margin-bottom: 0.8rem;
        }

        .song-label {
            background: #ffe4ec;
            color: #6b3a5a;
            font-weight: 700;
            font-size: 0.7rem;
            padding: 0.2rem 1rem;
            border-radius: 40px;
            border: 1px solid #ff8fab;
        }

        .song-label.gold {
            background: #ffe4a1;
            border-color: #c6972c;
        }

        .song-label.blue {
            background: #bde1ff;
            border-color: #3f74b3;
        }

        .song-title {
            font-size: 1.5rem;
            font-weight: 750;
            line-height: 1.2;
            color: #4a2a3a;
        }

        .song-artist {
            font-size: 0.95rem;
            color: #8a5a7a;
            margin-bottom: 0.5rem;
            border-left: 4px solid #ff8fab;
            padding-left: 0.7rem;
        }

        .anime-source {
            background: #ffe4ec;
            border-radius: 30px;
            padding: 0.2rem 1rem;
            font-size: 0.8rem;
            display: inline-block;
            margin: 0.2rem 0 0.6rem;
            color: #6b3a5a;
            font-weight: 500;
        }

        .recommend-box {
            background: #fff5f8;
            border-radius: 20px;
            padding: 0.9rem 1.2rem;
            margin: 0.8rem 0 0.2rem;
            border: 1px solid #ffffff;
        }

        .recommend-label {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 0.75rem;
            font-weight: 700;
            color: #c0507a;
            margin-bottom: 0.3rem;
            text-transform: uppercase;
        }

        .recommend-text {
            color: #4a2a3a;
            font-size: 0.94rem;
            line-height: 1.45;
        }

        .meta-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-top: 0.8rem;
        }

        .meta-tags span {
            background: #ffffff;
            border-radius: 40px;
            padding: 0.2rem 1rem;
            font-size: 0.7rem;
            border: 1px solid #ffc0d5;
            color: #6b3a5a;
        }

        .footer-note {
            text-align: center;
            margin-top: 4rem;
            padding-top: 2rem;
            border-top: 3px dashed #ffb0c8;
            color: #6b3a5a;
            font-size: 0.95rem;
        }

        .hr-div {
            opacity: 0.3;
            margin: 1.5rem 0;
        }

        @media (max-width:600px) {
            .header h1 { font-size: 2.2rem; }
            .subpage-header {
                padding: 0.4rem 3%;
                border-radius: 16px;
            }
            .subpage-logo {
                font-size: 1rem;
            }
            .subpage-logo-img {
                width: 28px;
                height: 28px;
            }
            .subpage-quote {
                font-size: 0.7rem;
            }
            .subpage-theme-toggle,
            .subpage-player-icon {
                width: 30px;
                height: 30px;
                font-size: 0.85rem;
            }
            .subpage-music-player {
                width: 240px;
                right: 10px;
                top: 70px;
            }
            .subpage-player-controls button {
                width: 38px;
                height: 38px;
                font-size: 1.1rem;
            }
            #subpagePlayPauseBtn {
                width: 46px;
                height: 46px;
                font-size: 1.4rem;
            }
        }

        .subpage-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0.5rem 5%;
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(12px);
            -webkit-backdrop-filter: blur(12px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
            border: 1px solid rgba(255, 255, 255, 0.8);
            border-radius: 20px;
            position: sticky;
            top: 8px;
            margin: 8px 8px 1.5rem;
            z-index: 100;
        }
        .subpage-logo {
            display: flex;
            align-items: center;
            gap: 8px;
            text-decoration: none;
            color: #ff7b9c;
            font-size: 1.3rem;
            font-weight: 600;
            text-shadow: 1px 1px 0 #ffe0e8;
            white-space: nowrap;
            cursor: pointer;
        }
        .subpage-logo-img {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(255, 143, 171, 0.4);
        }
        .subpage-quote {
            flex: 1;
            text-align: center;
            font-size: 0.85rem;
            color: #6a5a6a;
            font-style: italic;
            padding: 0 1rem;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }
        .subpage-header-right {
            display: flex;
            align-items: center;
            gap: 8px;
            flex-shrink: 0;
        }
        .subpage-theme-toggle {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #ffd9e6;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 2px 8px rgba(255, 180, 200, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #ff8fab;
            transition: all 0.2s;
        }
        .subpage-theme-toggle:hover {
            background: #ffb6c1;
            color: white;
            transform: scale(1.1);
        }
        .subpage-player-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            background: #ffd9e6;
            border: 2px solid rgba(255, 255, 255, 0.8);
            box-shadow: 0 2px 8px rgba(255, 180, 200, 0.4);
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 1rem;
            color: #ff8fab;
            transition: all 0.2s;
        }
        .subpage-player-icon:hover {
            background: #ffb6c1;
            color: white;
            transform: scale(1.1);
        }

        .subpage-music-player {
            position: fixed;
            top: 80px;
            right: 20px;
            width: 200px;
            background: rgba(255, 240, 250, 0.9);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-radius: 24px;
            padding: 0.5rem 0.3rem 0.5rem;
            box-shadow: 0 15px 35px rgba(255, 150, 180, 0.25);
            border: 1px solid rgba(255, 220, 240, 0.8);
            z-index: 1000;
            transition: opacity 0.2s, visibility 0.2s;
            opacity: 1;
            visibility: visible;
        }
        .subpage-music-player.hidden {
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
        }
        .subpage-player-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 0.8rem;
            padding-bottom: 0.4rem;
            border-bottom: 2px dashed #ffbfd5;
        }
        .subpage-player-title {
            font-weight: 600;
            color: #ff8fab;
            font-size: 1rem;
        }
        .subpage-player-title i {
            margin-right: 5px;
            color: #ff7b9c;
        }
        .subpage-close-player {
            background: none;
            border: none;
            font-size: 1.1rem;
            color: #f0b8cc;
            cursor: pointer;
            padding: 0 4px;
            transition: color 0.2s;
        }
        .subpage-close-player:hover {
            color: #ff7b9c;
        }
        .subpage-song-info {
            text-align: center;
            margin-bottom: 0.8rem;
        }
        .subpage-song-name {
            font-weight: 600;
            color: #5a4a5a;
            background: rgba(255, 220, 240, 0.6);
            padding: 0.2rem 0.8rem;
            border-radius: 30px;
            display: inline-block;
            max-width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-size: 0.95rem;
        }
        .subpage-progress-container {
            margin: 0.8rem 0;
        }
        .subpage-progress-bar {
            width: 100%;
            height: 4px;
            border-radius: 10px;
            background: #ffd0dd;
            outline: none;
            -webkit-appearance: none;
            appearance: none;
            cursor: pointer;
        }
        .subpage-progress-bar::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 12px;
            height: 12px;
            background: #ff7b9c;
            border-radius: 50%;
            border: 2px solid white;
            box-shadow: 0 2px 6px #ff9eb5;
            transition: 0.1s;
        }
        .subpage-progress-bar::-webkit-slider-thumb:hover {
            transform: scale(1.2);
            background: #ff5f8a;
        }
        .subpage-time {
            display: flex;
            justify-content: space-between;
            font-size: 0.75rem;
            color: #d4729a;
            margin-top: 4px;
        }
        .subpage-player-controls {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
            margin-top: 0.6rem;
        }
        .subpage-player-controls button {
            background: white;
            border: none;
            width: 42px;
            height: 42px;
            border-radius: 50%;
            color: #ff8fab;
            font-size: 1.2rem;
            cursor: pointer;
            box-shadow: 0 5px 12px rgba(255, 150, 170, 0.3);
            transition: 0.2s;
            border: 1px solid rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
        }
        #subpagePlayPauseBtn {
            width: 50px;
            height: 50px;
            font-size: 1.5rem;
            background: #ff9eb5;
            color: white;
        }
        .subpage-player-controls button:hover {
            background: #ffb6c1;
            color: white;
            transform: scale(1.1);
            box-shadow: 0 8px 18px #ff9eb5;
        }
        #subpagePlayPauseBtn:hover {
            background: #ff7b9c;
        }

        body.dark {
            background: linear-gradient(165deg, #1a1020 0%, #0f0a10 100%) !important;
            scrollbar-color: #8a4f6a #2a1a25;
        }
        body.dark::-webkit-scrollbar-thumb {
            background: #8a4f6a;
        }
        body.dark::-webkit-scrollbar-track {
            background: #2a1a25;
        }
        body.dark a.song-card {
            background: rgba(30, 20, 30, 0.85);
            border-color: #4a3a4a;
            box-shadow: 0 20px 30px -10px rgba(100, 50, 80, 0.3);
        }
        body.dark a.song-card:hover {
            background: rgba(40, 28, 40, 0.95);
            border-color: #ff8fab;
        }
        body.dark .song-title { color: #f0c0d0; }
        body.dark .song-artist { color: #c0a0b0; border-left-color: #ff8fab; }
        body.dark .song-label { background: #2a1f2a; color: #d0b0c0; border-color: #5a4a5a; }
        body.dark .song-label.gold { background: #3a2a10; border-color: #8a6a2a; color: #e0c070; }
        body.dark .song-label.blue { background: #1a2a3a; border-color: #3a6a9a; color: #a0c0e0; }
        body.dark .anime-source { background: #2a1f2a; color: #c0a0b0; }
        body.dark .recommend-box { background: #1e1520; border-color: #3a2a3a; }
        body.dark .recommend-label { color: #c0a0b0; }
        body.dark .recommend-text { color: #d0c0e0; }
        body.dark .meta-tags span { background: #2a1f2a; border-color: #5a4a5a; color: #d0b0c0; }
        body.dark .pill { background: rgba(30, 20, 30, 0.7); color: #d0b0c0; border-color: #4a3a4a; }
        body.dark .intro-note { background: rgba(30, 20, 30, 0.8); color: #d0c0e0; border-color: #4a3a4a; }
        body.dark .section-title { color: #d0b0c0; border-left-color: #ff8fab; }
        body.dark .section-sub { color: #a08a9a; }
        body.dark .footer-note { border-top-color: #4a3a4a; color: #a08a9a; }
        body.dark .hr-div { opacity: 0.15; }
        body.dark .subpage-theme-toggle {
            background: rgba(30, 20, 30, 0.8);
            color: #ffa0b0;
            border-color: #5a4a5a;
        }
        body.dark .subpage-header {
            background: rgba(20, 20, 35, 0.8);
            border-color: #444;
        }
        body.dark .subpage-logo {
            color: #e0e0e0;
            text-shadow: none;
        }
        body.dark .subpage-logo-img {
            border-color: rgba(255, 160, 190, 0.5);
        }
        body.dark .subpage-quote {
            color: #b0b0b0;
        }
        body.dark .subpage-player-icon {
            background: rgba(30, 20, 30, 0.8);
            color: #ffa0b0;
            border-color: #5a4a5a;
        }
        body.dark .subpage-music-player {
            background: rgba(20, 20, 35, 0.9);
            border-color: #444;
        }
        body.dark .subpage-player-title {
            color: #f0a0b0;
        }
        body.dark .subpage-song-name {
            color: #e0e0e0;
            background: rgba(255, 255, 255, 0.1);
        }
        body.dark .subpage-close-player {
            color: #888;
        }
        body.dark .subpage-close-player:hover {
            color: #ff7b9c;
        }
        body.dark .subpage-progress-bar {
            background: #4a3a4a;
        }
        body.dark .subpage-time {
            color: #999;
        }
        body.dark .subpage-player-controls button {
            background: #3a2e3a;
            color: #f0b0c0;
            border-color: #5a4a5a;
        }
        body.dark .subpage-player-controls button:hover {
            background: #8a4f6a;
        }
        body.dark #subpagePlayPauseBtn {
            background: #c07090;
            color: white;
        }`;
}

function buildMangaCard(item) {
  const badgeClass = item.rankBadgeClass ? ' ' + item.rankBadgeClass : '';
  const url = item.link || item.url || '#';
  const tagsHtml = (item.tags || []).map(t =>
    `<span class="tag">${escapeHtml(t)}</span>`
  ).join('\n                ');

  return `        <a class="manga-card" id="card-${item.id}" href="${url}" target="_blank" rel="noopener noreferrer">
            <div class="card-top">
                <span class="rank-badge${badgeClass}">${escapeHtml(item.rankText)}</span>
            </div>
            <div class="manga-title">${escapeHtml(item.title)}</div>
            <div class="manga-author">${escapeHtml(item.author)}</div>
            <div class="recommend-box">
                <div class="recommend-label"><span>推荐理由</span></div>
                <div class="recommend-text">${escapeHtml(item.recommendation)}</div>
            </div>
            <div class="meta-tags">
                ${tagsHtml}
            </div>
        </a>`;
}

function generateMangaHtml(data) {
  const cardsHtml = (data.comics || []).map(item => buildMangaCard(item)).join('\n');

  const badgesHtml = (data.badges || []).map(b =>
    `<span class="badge-item">${escapeHtml(b)}</span>`
  ).join('\n            ');

  const footerNoteHtml = data.footerNote
    ? `<p>${escapeHtml(data.footerNote)}</p>`
    : '';

  return `<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(data.pageTitle)}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>${getMangaStyle()}
    </style>
</head>
<body>
<header class="subpage-header">
    <a href="../index.html" class="subpage-logo" id="subpageLogoBtn">
        <img class="subpage-logo-img" src="../public/images/xiyue.webp" alt="YOCIM">
        <span>YOCIM轻站</span>
    </a>
    <div class="subpage-quote" id="subpageQuote">漫画是纸上的电影，每一格都是一帧心动。</div>
    <div class="subpage-header-right">
        <div class="subpage-theme-toggle" id="subpageThemeToggle"><i class="fas fa-moon"></i></div>
        <div class="subpage-player-icon" id="subpagePlayerIcon"><i class="fas fa-headphones-alt"></i></div>
    </div>
</header>
<div class="container">
    <div class="header">
        <h1>${escapeHtml(data.headerTitle)}</h1>
        <div class="badge-strip">
            ${badgesHtml}
        </div>
        <div class="intro-msg">
            <span>⭐ 每部均有推荐理由</span> ${escapeHtml(data.intro)}
        </div>
    </div>

    <div class="grid">
${cardsHtml}
    </div>
    <div class="footer-note">
        <div class="source-line">${escapeHtml(data.sourceLine || '')}</div>
        ${footerNoteHtml}
    </div>
</div>
<div class="subpage-music-player hidden" id="subpageMusicPlayer">
    <div class="subpage-player-header">
        <span class="subpage-player-title"><i class="fas fa-music"></i> 次元播放器</span>
        <button class="subpage-close-player" id="subpageClosePlayer"><i class="fas fa-times"></i></button>
    </div>
    <div class="subpage-player-content">
        <div class="subpage-song-info">
            <span class="subpage-song-name" id="subpageCurrentSong">未播放</span>
        </div>
        <div class="subpage-progress-container">
            <input type="range" class="subpage-progress-bar" id="subpageProgressBar" value="0" step="0.1">
            <div class="subpage-time">
                <span id="subpageCurrentTime">0:00</span> / <span id="subpageDuration">0:00</span>
            </div>
        </div>
        <div class="subpage-player-controls">
            <button id="subpagePrevBtn"><i class="fas fa-step-backward"></i></button>
            <button id="subpagePlayPauseBtn"><i class="fas fa-play"></i></button>
            <button id="subpageNextBtn"><i class="fas fa-step-forward"></i></button>
        </div>
    </div>
</div>
<script src="../scripts/subpage-theme.js"></script>
<script src="../scripts/subpage-music.js"></script>
</body>
</html>`;
}

function buildGameCard(item, badgeClass) {
  const tagsHtml = (item.tags || []).map(t =>
    `<span>${escapeHtml(t)}</span>`
  ).join('');

  const url = item.link || item.url || '#';
  return `        <a class="game-card" id="card-${item.id}" href="${escapeHtml(url)}" target="_blank" rel="noopener">
            <div class="card-header"><span class="platform-tag ${badgeClass}">${escapeHtml(item.platform)}</span><span>${escapeHtml(item.developer)}</span></div>
            <div class="game-title">${escapeHtml(item.title)}</div>
            <div class="game-sub">${escapeHtml(item.subtitle)}</div>
            <div class="reason-box"><div class="reason-label"><span>⭐ 推荐理由</span></div><div class="reason-text">${escapeHtml(item.recommendation)}</div></div>
            <div class="extra-meta">${tagsHtml}</div>
        </a>`;
}

function generateGameHtml(data) {
  const ruleBadgesHtml = (data.ruleBadges || []).map(r =>
    `<span class="rule-item"><strong>${escapeHtml(r.label)}</strong> ${escapeHtml(r.text)}</span>`
  ).join('\n            ');

  const tabsHtml = (data.tabs || []).map(t => {
    const activeClass = t.active ? ' active' : '';
    return `<span class="tab${activeClass}">${escapeHtml(t.text)} <span class="tab-small">${escapeHtml(t.count)}</span></span>`;
  }).join('\n        ');

  const sectionsHtml = (data.sections || []).map(section => {
    const cardsHtml = (section.games || []).map(item =>
      buildGameCard(item, section.badgeClass)
    ).join('\n');

    return `    <h2 style="color:#ff8fab; margin: 1.5rem 0 0.5rem;">${escapeHtml(section.title)}</h2>
    <div class="grid">
${cardsHtml}
    </div>`;
  }).join('\n\n');

  const warnHtml = data.warnBadge
    ? `    <hr>
    <div style="text-align:center; background: #2a1a2a; border-radius: 60px; padding: 1rem; width: fit-content; margin: 2rem auto;">
        <span class="badge-warn">${escapeHtml(data.warnBadge)}</span>
    </div>`
    : '';

  return `<!DOCTYPE html><html lang="zh"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(data.pageTitle)}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>${getGameStyle()}
    </style>
</head>
<body>
<header class="subpage-header">
    <a href="../index.html" class="subpage-logo" id="subpageLogoBtn">
        <img class="subpage-logo-img" src="../public/images/xiyue.webp" alt="YOCIM">
        <span>YOCIM轻站</span>
    </a>
    <div class="subpage-quote" id="subpageQuote">游戏不是逃避现实，而是在虚拟中找到真实的自己。</div>
    <div class="subpage-header-right">
        <div class="subpage-theme-toggle" id="subpageThemeToggle"><i class="fas fa-moon"></i></div>
        <div class="subpage-player-icon" id="subpagePlayerIcon"><i class="fas fa-headphones-alt"></i></div>
    </div>
</header>
<div class="container">
    <div class="header">
        <h1>${escapeHtml(data.headerTitle)}</h1>
        <div class="sub-line">${escapeHtml(data.subLine)}</div>
        <div class="rule-badge">
            ${ruleBadgesHtml}
        </div>
    </div>

    <div class="category-tabs">
        ${tabsHtml}
    </div>

${sectionsHtml}

${warnHtml}

    <div class="footer-note">
        ${data.footerNote || ''}
    </div>
</div>
<div class="subpage-music-player hidden" id="subpageMusicPlayer">
    <div class="subpage-player-header">
        <span class="subpage-player-title"><i class="fas fa-music"></i> 次元播放器</span>
        <button class="subpage-close-player" id="subpageClosePlayer"><i class="fas fa-times"></i></button>
    </div>
    <div class="subpage-player-content">
        <div class="subpage-song-info">
            <span class="subpage-song-name" id="subpageCurrentSong">未播放</span>
        </div>
        <div class="subpage-progress-container">
            <input type="range" class="subpage-progress-bar" id="subpageProgressBar" value="0" step="0.1">
            <div class="subpage-time">
                <span id="subpageCurrentTime">0:00</span> / <span id="subpageDuration">0:00</span>
            </div>
        </div>
        <div class="subpage-player-controls">
            <button id="subpagePrevBtn"><i class="fas fa-step-backward"></i></button>
            <button id="subpagePlayPauseBtn"><i class="fas fa-play"></i></button>
            <button id="subpageNextBtn"><i class="fas fa-step-forward"></i></button>
        </div>
    </div>
</div>
<script src="../scripts/subpage-theme.js"></script>
<script src="../scripts/scroll.js"></script>
<script src="../scripts/subpage-music.js"></script>

</body></html>`;
}

function buildSongCard(item) {
  const labelClass = item.labelClass ? ' ' + item.labelClass : '';
  const url = item.link || item.url || '#';
  const yearHtml = item.year ? `<span>${escapeHtml(item.year)}</span>` : '';
  const tagsHtml = (item.tags || []).map(t =>
    `<span>${escapeHtml(t)}</span>`
  ).join('');

  return `        <a class="song-card" id="card-${item.id}" href="${escapeHtml(url)}" target="_blank" rel="noopener">
            <div class="card-header"><span class="song-label${labelClass}">${escapeHtml(item.label)}</span>${yearHtml}</div>
            <div class="song-title">${escapeHtml(item.title)}</div>
            <div class="song-artist">${escapeHtml(item.artist)}</div>
            <div class="anime-source">${escapeHtml(item.animeSource)}</div>
            <div class="recommend-box"><div class="recommend-label"><span>🎧 推荐理由</span></div><div class="recommend-text">${escapeHtml(item.recommendation)}</div></div>
            <div class="meta-tags">${tagsHtml}</div>
        </a>`;
}

function generateMusicHtml(data) {
  const badgesHtml = (data.badges || []).map(b =>
    `<span class="pill">${escapeHtml(b)}</span>`
  ).join('\n            ');

  const sectionsHtml = (data.sections || []).map(section => {
    const cardsHtml = (section.songs || []).map(item =>
      buildSongCard(item)
    ).join('\n');

    return `    <div class="section-title">${escapeHtml(section.title)}</div>
    <div class="grid">
${cardsHtml}
    </div>`;
  }).join('\n\n');

  const footerLines = (data.footerNote || '').split('\n');
  const footerHtml = footerLines.map(line => line.trim()).filter(Boolean).join('<br>\n        ');

  return `<!DOCTYPE html><html lang="zh"><head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(data.pageTitle)}</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
    <style>${getMusicStyle()}
    </style>
</head>
<body>
<header class="subpage-header">
    <a href="../index.html" class="subpage-logo" id="subpageLogoBtn">
        <img class="subpage-logo-img" src="../public/images/xiyue.webp" alt="YOCIM">
        <span>YOCIM轻站</span>
    </a>
    <div class="subpage-quote" id="subpageQuote">旋律是灵魂的语言，无需翻译便能共鸣。</div>
    <div class="subpage-header-right">
        <div class="subpage-theme-toggle" id="subpageThemeToggle"><i class="fas fa-moon"></i></div>
        <div class="subpage-player-icon" id="subpagePlayerIcon"><i class="fas fa-headphones-alt"></i></div>
    </div>
</header>
<div class="container">
    <div class="header">
        <h1>${escapeHtml(data.headerTitle)}</h1>
        <div class="sub-badge">
            ${badgesHtml}
        </div>
        <div class="intro-note">
            ${escapeHtml(data.introNote)}
        </div>
    </div>

${sectionsHtml}

    <div class="footer-note">
        ${footerHtml}
    </div>
</div>
<div class="subpage-music-player hidden" id="subpageMusicPlayer">
    <div class="subpage-player-header">
        <span class="subpage-player-title"><i class="fas fa-music"></i> 次元播放器</span>
        <button class="subpage-close-player" id="subpageClosePlayer"><i class="fas fa-times"></i></button>
    </div>
    <div class="subpage-player-content">
        <div class="subpage-song-info">
            <span class="subpage-song-name" id="subpageCurrentSong">未播放</span>
        </div>
        <div class="subpage-progress-container">
            <input type="range" class="subpage-progress-bar" id="subpageProgressBar" value="0" step="0.1">
            <div class="subpage-time">
                <span id="subpageCurrentTime">0:00</span> / <span id="subpageDuration">0:00</span>
            </div>
        </div>
        <div class="subpage-player-controls">
            <button id="subpagePrevBtn"><i class="fas fa-step-backward"></i></button>
            <button id="subpagePlayPauseBtn"><i class="fas fa-play"></i></button>
            <button id="subpageNextBtn"><i class="fas fa-step-forward"></i></button>
        </div>
    </div>
</div>
<script src="../scripts/subpage-theme.js"></script>
<script src="../scripts/scroll.js"></script>
<script src="../scripts/subpage-music.js"></script>

</body></html>`;
}

const TEMPLATE_GENERATORS = {
  manga: generateMangaHtml,
  game: generateGameHtml,
  music: generateMusicHtml
};

class SubpageBuilder {
  constructor() {
    this.configs = SUBPAGE_CONFIG;
  }

  build() {
    logger.start('开始构建子页面...');

    let successCount = 0;
    let failCount = 0;

    this.configs.forEach(config => {
      try {
        const result = this.buildSinglePage(config);
        if (result) {
          successCount++;
        } else {
          failCount++;
        }
      } catch (error) {
        logger.error(`子页面 [${config.type}] 构建异常: ${error.message}`);
        failCount++;
      }
    });

    if (failCount === 0) {
      logger.success(`全部子页面构建成功 (${successCount}/${this.configs.length})`);
      return true;
    } else {
      logger.warn(`子页面构建完成: 成功 ${successCount}, 失败 ${failCount}`);
      return failCount < this.configs.length;
    }
  }

  buildSinglePage(config) {
    logger.progress(`构建子页面 [${config.type}]...`);

    if (!fileSystem.exists(config.dataFile)) {
      logger.warn(`数据文件不存在，跳过 [${config.type}]: ${config.dataFile}`);
      return false;
    }

    try {
      const data = fileSystem.readJson(config.dataFile);
      if (!data) {
        throw new Error('JSON数据为空');
      }

      const generator = TEMPLATE_GENERATORS[config.template];
      if (!generator) {
        throw new Error(`未知模板类型: ${config.template}`);
      }

      const html = generator(data);

      const success = fileSystem.writeFile(config.outputFile, html);
      if (success) {
        logger.success(`子页面 [${config.type}] 构建成功: ${config.outputFile}`);
        return true;
      } else {
        throw new Error('写入文件失败');
      }
    } catch (error) {
      logger.error(`子页面 [${config.type}] 构建失败: ${error.message}`);
      return false;
    }
  }
}

function buildSubpages() {
  const builder = new SubpageBuilder();
  return builder.build();
}

module.exports = { buildSubpages, SubpageBuilder };
