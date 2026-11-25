/**
 * ==========================================================================
 * HVK BIO PROFILE - LOW-END OPTIMIZED 3D SPATIAL VISIONOS & HYBRID AUDIO
 * Zero Layout Thrashing, GPU-Only Animations, Offline file:// & Mobile Safe
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --------------------------------------------------------------------------
    // 0. PHÁT HIỆN THIẾT BỊ CẢM ỨNG & PREFERS-REDUCED-MOTION
    // --------------------------------------------------------------------------
    const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let isTouchDevice = (
        (window.matchMedia && window.matchMedia('(hover: none), (pointer: coarse)').matches) ||
        ('ontouchstart' in window && navigator.maxTouchPoints > 0 && !(window.matchMedia && window.matchMedia('(pointer: fine)').matches))
    );

    if (isTouchDevice) {
        document.body.classList.add('is-touch-device');
    }

    function isDesktopInteractionEnabled() {
        return !isTouchDevice && window.innerWidth >= 780;
    }

    // --------------------------------------------------------------------------
    // 1. DANH SÁCH 3 BÀI NHẠC & BẢNG MÀU HÀO QUANG ĐỘNG THEO TỪNG BÀI
    // --------------------------------------------------------------------------
    const PLAYLIST = [
        {
            title: "Cho Bản Thân",
            artist: "Habin",
            src: "music/cho-ban-than-nay.mp3",
            bpm: 108,
            aura: {
                rgb: "217, 70, 239",
                secondaryRgb: "168, 85, 247",
                borderRgb: "240, 171, 252",
                barFrom: "#c084fc",
                barTo: "#f472b6",
                hueMin: 282,
                hueMax: 322
            }
        },
        {
            title: "Hải Sao",
            artist: "pixel neko và thắng",
            src: "music/hai-sao.mp3",
            bpm: 124,
            aura: {
                rgb: "139, 92, 246",
                secondaryRgb: "56, 189, 248",
                borderRgb: "165, 180, 252",
                barFrom: "#818cf8",
                barTo: "#38bdf8",
                hueMin: 225,
                hueMax: 270
            }
        },
        {
            title: "Người Em Cố Đô 2",
            artist: "Xuân Đỉnh K.Y và Rum",
            src: "music/nguoi-em-co-do-2.mp3",
            bpm: 116,
            aura: {
                rgb: "99, 102, 241",
                secondaryRgb: "168, 85, 247",
                borderRgb: "196, 181, 253",
                barFrom: "#6366f1",
                barTo: "#c084fc",
                hueMin: 240,
                hueMax: 286
            }
        }
    ];

    // Khởi tạo HTML5 Audio Element
    const audio = new Audio();
    audio.preload = 'auto';
    audio.volume = 1.0;
    audio.muted = false;

    // Elements - Main Card & Clock
    const mainCardEl = document.getElementById('mainCard');
    const detailPanelEl = document.getElementById('detailPanel');
    const cardBeatGlowEl = document.getElementById('cardBeatGlow');
    const liveClockEl = document.getElementById('liveClockGmt7');

    // Elements - Quick Music Tile (Main Card)
    const quickMusicTile = document.querySelector('.music-tile-trigger');
    const quickTrackTitle = document.getElementById('quickTrackTitle');
    const quickTrackArtist = document.getElementById('quickTrackArtist');
    const quickPlayStatus = document.getElementById('quickPlayStatus');
    const quickSoundwaveBars = document.querySelectorAll('#quickSoundwave span');

    // Elements - Detail Music Panel (Turntable, Tonearm, Visualizer, Controls)
    const detailTrackTitle = document.getElementById('detailTrackTitle');
    const detailTrackArtist = document.getElementById('detailTrackArtist');
    const detailTrackIndex = document.getElementById('detailTrackIndex');
    const detailPlayPauseBtn = document.getElementById('detailPlayPauseBtn');
    const detailPlayPauseIcon = document.getElementById('detailPlayPauseIcon');
    const detailNextBtn = document.getElementById('detailNextBtn');
    const detailPrevBtn = document.getElementById('detailPrevBtn');
    const playlistItems = document.querySelectorAll('.playlist-item');
    const vinylContainer = document.querySelector('.vinyl-container');
    const vinylAuraEl = document.querySelector('.vinyl-aura');
    const tonearmAssembly = document.getElementById('tonearmAssembly');
    const hybridVisualizerEl = document.getElementById('hybridVisualizer');
    const vizBars = document.querySelectorAll('#hybridVisualizer .viz-bar');
    const visualizerModeBadge = document.getElementById('visualizerModeBadge');
    const seekBar = document.getElementById('seekBar');
    const currentTimeDisplay = document.getElementById('currentTimeDisplay');
    const durationDisplay = document.getElementById('durationDisplay');
    const muteBtn = document.getElementById('muteBtn');
    const volumeIcon = document.getElementById('volumeIcon');
    const volumeBar = document.getElementById('volumeBar');

    // Elements - 3D Spatial Stage & Panels
    const spatialStage = document.getElementById('spatialStage');
    const spatialBackdrop = document.getElementById('spatialBackdrop');
    const closePanelBtn = document.getElementById('closePanelBtn');
    const spatialTriggers = document.querySelectorAll('.spatial-trigger-btn');
    const panelCategoryIcon = document.getElementById('panelCategoryIcon');
    const panelCategoryLabel = document.getElementById('panelCategoryLabel');

    // Cache kích thước thẻ để tránh gọi getBoundingClientRect() liên tục khi di chuột
    const glassCards = document.querySelectorAll('.editorial-card');
    let cachedCardRects = [];
    let cachedMainRect = null;
    let isAnimatingSplit = false;
    let splitAnimTimer = null;

    function refreshCachedRects() {
        cachedCardRects = Array.from(glassCards).map((el) => ({
            el,
            rect: el.getBoundingClientRect()
        }));
        cachedMainRect = mainCardEl ? mainCardEl.getBoundingClientRect() : null;
    }

    // --------------------------------------------------------------------------
    // 2. ENTRANCE ANIMATION THEO TẦNG (STAGGERED FADE-UP & SCALE)
    // --------------------------------------------------------------------------
    if (mainCardEl) {
        if (prefersReducedMotion) {
            mainCardEl.classList.remove('is-pre-enter');
            mainCardEl.classList.add('is-entered', 'is-entrance-done');
            refreshCachedRects();
        } else {
            mainCardEl.classList.add('is-entering-spring');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    mainCardEl.classList.remove('is-pre-enter');
                    mainCardEl.classList.add('is-entered');
                    setTimeout(() => {
                        mainCardEl.classList.remove('is-entering-spring');
                        mainCardEl.classList.add('is-entrance-done');
                        refreshCachedRects();
                    }, 760);
                });
            });
        }
    }

    // --------------------------------------------------------------------------
    // 3. ĐỒNG HỒ THỰC GMT+7 (ASIA/HO_CHI_MINH) AN TOÀN MỌI TRÌNH DUYỆT
    // --------------------------------------------------------------------------
    let gmt7Formatter = null;
    try {
        gmt7Formatter = new Intl.DateTimeFormat('vi-VN', {
            timeZone: 'Asia/Ho_Chi_Minh',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        });
    } catch (_) {
        gmt7Formatter = null;
    }

    function updateLiveClockGmt7() {
        if (!liveClockEl) return;
        try {
            if (gmt7Formatter) {
                liveClockEl.textContent = gmt7Formatter.format(new Date());
                return;
            }
        } catch (_) { }
        const nowUtc7 = new Date(Date.now() + 7 * 60 * 60 * 1000);
        const hh = String(nowUtc7.getUTCHours()).padStart(2, '0');
        const mm = String(nowUtc7.getUTCMinutes()).padStart(2, '0');
        const ss = String(nowUtc7.getUTCSeconds()).padStart(2, '0');
        liveClockEl.textContent = `${hh}:${mm}:${ss}`;
    }

    updateLiveClockGmt7();
    setInterval(updateLiveClockGmt7, 1000);

    // --------------------------------------------------------------------------
    // 4. LOGIC PHÁT NHẠC PRODUCER, TONEARM, SEEK/VOLUME & HYBRID VISUALIZER
    // --------------------------------------------------------------------------
    let currentIndex = Math.floor(Math.random() * PLAYLIST.length);
    let isPlaying = false;
    let userInteracted = false;
    let userVolume = 1.0;
    let isMuted = false;
    let isSeeking = false;
    let activeTarget = null;

    // Hybrid Audio Visualizer:
    // Mở qua file:// -> tự động dùng chế độ giả lập nhịp, KHÔNG gọi createMediaElementSource để không bị CORS tắt tiếng.
    const isLocalFileProtocol = window.location.protocol === 'file:';
    let visualizerMode = isLocalFileProtocol ? 'simulated' : 'pending';
    let audioCtx = null;
    let analyser = null;
    let sourceNode = null;
    let freqData = null;
    let silentFrameCount = 0;

    const vizBarLevels = new Float32Array(vizBars.length).fill(0.16);
    const quickBarLevels = new Float32Array(quickSoundwaveBars.length).fill(0.32);

    function setVisualizerBadge(mode) {
        if (!visualizerModeBadge) return;
        visualizerModeBadge.textContent = mode === 'webaudio' ? 'LIVE FFT' : 'SYNC BEAT';
    }

    setVisualizerBadge(visualizerMode);

    function initHybridWebAudio() {
        if (isLocalFileProtocol || visualizerMode === 'simulated') return;

        if (audioCtx) {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => { });
            }
            return;
        }

        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (!AudioContextClass) {
                visualizerMode = 'simulated';
                setVisualizerBadge('simulated');
                return;
            }

            audioCtx = new AudioContextClass();
            analyser = audioCtx.createAnalyser();
            analyser.fftSize = 64;
            analyser.smoothingTimeConstant = 0.8;
            freqData = new Uint8Array(analyser.frequencyBinCount);

            sourceNode = audioCtx.createMediaElementSource(audio);
            sourceNode.connect(analyser);
            analyser.connect(audioCtx.destination);

            visualizerMode = 'webaudio';
            setVisualizerBadge('webaudio');

            if (audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => { });
            }
        } catch (_) {
            visualizerMode = 'simulated';
            setVisualizerBadge('simulated');
            analyser = null;
            freqData = null;
        }
    }

    let particleColorsDirty = true;

    function applyTrackAura(track) {
        if (!track || !track.aura) return;
        const rootStyle = document.documentElement.style;
        rootStyle.setProperty('--aura-rgb', track.aura.rgb);
        rootStyle.setProperty('--aura-secondary-rgb', track.aura.secondaryRgb);
        rootStyle.setProperty('--aura-border-rgb', track.aura.borderRgb);
        rootStyle.setProperty('--aura-bar-from', track.aura.barFrom);
        rootStyle.setProperty('--aura-bar-to', track.aura.barTo);
        particleColorsDirty = true;
    }

    function formatIndex(index, total) {
        return `0${index + 1} / 0${total}`;
    }

    function formatTime(seconds) {
        if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    function updateTonearmTracking(percent) {
        if (!tonearmAssembly) return;
        const clamped = Math.max(0, Math.min(100, percent || 0));
        const angle = 25 + (clamped / 100) * 7;
        tonearmAssembly.style.setProperty('--tonearm-angle', `${angle.toFixed(1)}deg`);
    }

    function updateSeekVisuals(currentSec, durationSec) {
        const hasValidDuration = Number.isFinite(durationSec) && durationSec > 0;
        const percent = hasValidDuration ? Math.max(0, Math.min(100, (currentSec / durationSec) * 100)) : 0;

        if (seekBar) {
            seekBar.value = percent.toFixed(1);
            seekBar.style.setProperty('--seek-percent', `${percent.toFixed(1)}%`);
        }
        if (currentTimeDisplay) {
            currentTimeDisplay.textContent = formatTime(currentSec);
        }
        if (durationDisplay) {
            durationDisplay.textContent = hasValidDuration ? formatTime(durationSec) : '0:00';
        }
        updateTonearmTracking(percent);
    }

    function applyVolume(vol, muted) {
        const clampedVol = Math.max(0, Math.min(1, Number.isFinite(vol) ? vol : 1));
        isMuted = Boolean(muted) || clampedVol === 0;
        if (clampedVol > 0) {
            userVolume = clampedVol;
        }

        audio.volume = isMuted ? 0 : clampedVol;
        audio.muted = isMuted;

        const displayVol = isMuted ? 0 : clampedVol;
        if (volumeBar) {
            volumeBar.value = displayVol.toFixed(2);
            volumeBar.style.setProperty('--vol-percent', `${(displayVol * 100).toFixed(0)}%`);
        }
        if (volumeIcon) {
            if (isMuted || displayVol === 0) {
                volumeIcon.className = 'ri-volume-mute-line text-xs text-rose-400';
            } else if (displayVol < 0.5) {
                volumeIcon.className = 'ri-volume-down-line text-xs text-violet-300';
            } else {
                volumeIcon.className = 'ri-volume-up-line text-xs text-violet-200';
            }
        }
    }

    function updateTrackUI() {
        const current = PLAYLIST[currentIndex];
        applyTrackAura(current);

        if (quickTrackTitle) quickTrackTitle.textContent = current.title;
        if (quickTrackArtist) quickTrackArtist.textContent = `${current.artist} • Nhấn để mở đĩa than`;

        if (detailTrackTitle) detailTrackTitle.textContent = current.title;
        if (detailTrackArtist) detailTrackArtist.textContent = `${current.artist} • Đĩa than 33 RPM`;
        if (detailTrackIndex) detailTrackIndex.textContent = formatIndex(currentIndex, PLAYLIST.length);

        playlistItems.forEach((item, idx) => {
            item.classList.toggle('is-active', idx === currentIndex);
        });
    }

    function resetVisualizerBarsToIdle() {
        for (let i = 0; i < vizBars.length; i++) {
            vizBarLevels[i] = 0.16;
            vizBars[i].style.transform = 'scaleY(0.16)';
        }
        for (let k = 0; k < quickSoundwaveBars.length; k++) {
            quickBarLevels[k] = 0.32;
            quickSoundwaveBars[k].style.transform = 'scaleY(0.32)';
        }
        if (cardBeatGlowEl) cardBeatGlowEl.style.opacity = '0';
        if (vinylAuraEl) {
            vinylAuraEl.style.opacity = '0.42';
            vinylAuraEl.style.transform = 'scale(0.94)';
        }
    }

    function updatePlaybackUI(playing) {
        isPlaying = playing;

        if (detailPlayPauseIcon) {
            detailPlayPauseIcon.className = playing ? 'ri-pause-fill text-lg' : 'ri-play-fill text-lg';
        }
        if (quickPlayStatus) {
            quickPlayStatus.textContent = playing ? 'PLAYING' : 'PAUSED';
        }

        if (quickMusicTile) quickMusicTile.classList.toggle('is-playing', playing);
        if (vinylContainer) vinylContainer.classList.toggle('is-playing', playing);
        if (tonearmAssembly) tonearmAssembly.classList.toggle('is-playing', playing);
        if (hybridVisualizerEl) hybridVisualizerEl.classList.toggle('is-active', playing);

        if (!playing) {
            resetVisualizerBarsToIdle();
        }
    }

    function loadTrack(index) {
        currentIndex = index;
        silentFrameCount = 0;
        audio.src = PLAYLIST[currentIndex].src;
        audio.volume = isMuted ? 0 : userVolume;
        audio.muted = isMuted;
        updateSeekVisuals(0, 0);
        updateTrackUI();
    }

    function playTrack() {
        initHybridWebAudio();
        audio.volume = isMuted ? 0 : userVolume;
        audio.muted = isMuted;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
            playPromise.then(() => {
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume().catch(() => { });
                }
                updatePlaybackUI(true);
            }).catch(() => {
                updatePlaybackUI(false);
            });
        }
    }

    function togglePlay() {
        if (audio.paused) {
            playTrack();
        } else {
            audio.pause();
            updatePlaybackUI(false);
        }
    }

    function playNext() {
        currentIndex = (currentIndex + 1) % PLAYLIST.length;
        loadTrack(currentIndex);
        playTrack();
    }

    function playPrev() {
        currentIndex = (currentIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
        loadTrack(currentIndex);
        playTrack();
    }

    audio.addEventListener('loadedmetadata', () => {
        if (!isSeeking) updateSeekVisuals(audio.currentTime || 0, audio.duration || 0);
    });

    audio.addEventListener('durationchange', () => {
        if (!isSeeking) updateSeekVisuals(audio.currentTime || 0, audio.duration || 0);
    });

    audio.addEventListener('timeupdate', () => {
        if (!isSeeking) updateSeekVisuals(audio.currentTime || 0, audio.duration || 0);
    });

    audio.addEventListener('ended', () => {
        playNext();
    });

    audio.addEventListener('error', () => {
        updatePlaybackUI(false);
    });

    // Tương tác thanh tua thời gian (Seek Bar)
    if (seekBar) {
        seekBar.addEventListener('click', (e) => e.stopPropagation());
        seekBar.addEventListener('pointerdown', (e) => {
            e.stopPropagation();
            isSeeking = true;
        });

        seekBar.addEventListener('input', (e) => {
            e.stopPropagation();
            isSeeking = true;
            const pct = parseFloat(seekBar.value) || 0;
            seekBar.style.setProperty('--seek-percent', `${pct.toFixed(1)}%`);
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                const previewSec = (pct / 100) * audio.duration;
                if (currentTimeDisplay) currentTimeDisplay.textContent = formatTime(previewSec);
                updateTonearmTracking(pct);
            }
        });

        seekBar.addEventListener('change', (e) => {
            e.stopPropagation();
            if (Number.isFinite(audio.duration) && audio.duration > 0) {
                const pct = parseFloat(seekBar.value) || 0;
                audio.currentTime = (pct / 100) * audio.duration;
            }
            isSeeking = false;
        });

        seekBar.addEventListener('pointerup', () => {
            isSeeking = false;
        });
    }

    // Tương tác thanh chỉnh âm lượng & nút Mute
    applyVolume(userVolume, false);

    if (volumeBar) {
        volumeBar.addEventListener('click', (e) => e.stopPropagation());
        volumeBar.addEventListener('pointerdown', (e) => e.stopPropagation());
        volumeBar.addEventListener('input', (e) => {
            e.stopPropagation();
            const val = parseFloat(volumeBar.value);
            applyVolume(val, val === 0);
        });
    }

    if (muteBtn) {
        muteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (isMuted) {
                applyVolume(userVolume > 0.05 ? userVolume : 0.75, false);
            } else {
                applyVolume(userVolume, true);
            }
        });
    }

    // Khởi tạo bài ngẫu nhiên
    loadTrack(currentIndex);

    // Tự phát hoặc mở khóa ngay tại tương tác đầu tiên
    audio.play().then(() => {
        initHybridWebAudio();
        updatePlaybackUI(true);
    }).catch(() => {
        updatePlaybackUI(false);
        const triggerFirstPlay = (e) => {
            if (!userInteracted) {
                userInteracted = true;
                const clickedPlaybackCtrl = e && e.target && e.target.closest && e.target.closest('#detailPlayPauseBtn, #detailNextBtn, #detailPrevBtn, .playlist-item, #muteBtn');
                if (!clickedPlaybackCtrl) {
                    playTrack();
                }
            }
            window.removeEventListener('click', triggerFirstPlay, true);
            window.removeEventListener('touchstart', triggerFirstPlay, true);
            window.removeEventListener('keydown', triggerFirstPlay, true);
            window.removeEventListener('pointerdown', triggerFirstPlay, true);
        };
        window.addEventListener('click', triggerFirstPlay, true);
        window.addEventListener('touchstart', triggerFirstPlay, true);
        window.addEventListener('keydown', triggerFirstPlay, true);
        window.addEventListener('pointerdown', triggerFirstPlay, true);
    });

    if (detailPlayPauseBtn) {
        detailPlayPauseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userInteracted = true;
            togglePlay();
        });
    }

    if (detailNextBtn) {
        detailNextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userInteracted = true;
            playNext();
        });
    }

    if (detailPrevBtn) {
        detailPrevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            userInteracted = true;
            playPrev();
        });
    }

    playlistItems.forEach((item) => {
        item.addEventListener('click', (e) => {
            e.stopPropagation();
            userInteracted = true;
            const trackIdx = parseInt(item.getAttribute('data-index'), 10);
            if (!isNaN(trackIdx)) {
                loadTrack(trackIdx);
                playTrack();
            }
        });
    });

    // --------------------------------------------------------------------------
    // 5. 3D SPATIAL SPLIT-VIEW & POP-OUT DETAIL PANEL MANAGER
    // --------------------------------------------------------------------------
    const viewMeta = {
        youtube: {
            icon: 'ri-youtube-fill text-red-400',
            label: 'YOUTUBE OFFICIAL CHANNEL'
        },
        facebook: {
            icon: 'ri-facebook-circle-fill text-blue-400',
            label: 'FACEBOOK PROFILE'
        },
        discord: {
            icon: 'ri-discord-fill text-indigo-400',
            label: 'DISCORD SERVER & VOICE'
        },
        github: {
            icon: 'ri-github-fill text-violet-300',
            label: 'GITHUB PROFILE'
        },
        music: {
            icon: 'ri-disc-line text-violet-300',
            label: 'SPATIAL VINYL AUDIO PLAYER'
        }
    };

    function triggerSplitSpringTransition() {
        if (!spatialStage) return;
        isAnimatingSplit = true;
        spatialStage.classList.add('is-animating-split');
        if (splitAnimTimer) clearTimeout(splitAnimTimer);
        splitAnimTimer = setTimeout(() => {
            spatialStage.classList.remove('is-animating-split');
            isAnimatingSplit = false;
            refreshCachedRects();
        }, 560);
    }

    function updateSelectedTrigger(targetKey) {
        spatialTriggers.forEach((btn) => {
            btn.classList.toggle('is-selected', btn.getAttribute('data-target') === targetKey);
        });
    }

    function renderDetailContent(targetKey, isDirectSwitch = false) {
        const meta = viewMeta[targetKey] || { icon: 'ri-information-line', label: 'THÔNG TIN' };

        if (panelCategoryIcon) panelCategoryIcon.className = meta.icon;
        if (panelCategoryLabel) panelCategoryLabel.textContent = meta.label;

        const allViews = document.querySelectorAll('.detail-view');
        const targetView = document.getElementById(`view-${targetKey}`);
        if (!targetView) return;

        if (isDirectSwitch) {
            if (detailPanelEl) detailPanelEl.classList.add('is-switching');
            if (spatialStage) spatialStage.classList.add('is-switching');

            const oldView = Array.from(allViews).find((v) => v !== targetView && v.classList.contains('is-visible'));
            if (oldView) {
                oldView.classList.remove('is-visible');
                oldView.classList.add('is-exiting');
                setTimeout(() => {
                    oldView.classList.remove('is-exiting');
                    oldView.style.display = 'none';
                }, 190);
            }

            targetView.style.display = 'flex';
            void targetView.offsetWidth;
            targetView.classList.remove('is-exiting');
            targetView.classList.add('is-visible');

            setTimeout(() => {
                if (detailPanelEl) detailPanelEl.classList.remove('is-switching');
                if (spatialStage) spatialStage.classList.remove('is-switching');
            }, 210);
        } else {
            allViews.forEach((view) => {
                view.classList.remove('is-visible', 'is-exiting');
                view.style.display = 'none';
            });
            targetView.style.display = 'flex';
            void targetView.offsetWidth;
            targetView.classList.add('is-visible');
        }
    }

    function openDetailPanel(targetKey) {
        activeTarget = targetKey;
        triggerSplitSpringTransition();
        if (spatialStage) spatialStage.classList.add('is-expanded');
        if (spatialBackdrop) spatialBackdrop.classList.add('is-active');
        updateSelectedTrigger(targetKey);
        renderDetailContent(targetKey, false);
    }

    function closeDetailPanel() {
        activeTarget = null;
        triggerSplitSpringTransition();
        if (spatialStage) {
            spatialStage.classList.remove('is-expanded');
            spatialStage.classList.remove('is-switching');
        }
        if (spatialBackdrop) spatialBackdrop.classList.remove('is-active');
        if (detailPanelEl) detailPanelEl.classList.remove('is-switching');

        spatialTriggers.forEach((btn) => {
            btn.classList.remove('is-selected');
        });

        setTimeout(() => {
            if (!spatialStage || !spatialStage.classList.contains('is-expanded')) {
                const allViews = document.querySelectorAll('.detail-view');
                allViews.forEach((view) => {
                    view.classList.remove('is-visible', 'is-exiting');
                    view.style.display = 'none';
                });
            }
        }, 300);
    }

    function handleTriggerAction(targetKey) {
        if (!targetKey) return;
        const isPanelOpen = spatialStage && spatialStage.classList.contains('is-expanded');

        if (targetKey === 'music' && audio.paused) {
            userInteracted = true;
            playTrack();
        }

        if (isPanelOpen) {
            if (activeTarget === targetKey) {
                closeDetailPanel();
            } else {
                activeTarget = targetKey;
                updateSelectedTrigger(targetKey);
                renderDetailContent(targetKey, true);
            }
        } else {
            openDetailPanel(targetKey);
        }
    }

    spatialTriggers.forEach((trigger) => {
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            const target = trigger.getAttribute('data-target');
            handleTriggerAction(target);
        });
    });

    if (closePanelBtn) {
        closePanelBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDetailPanel();
        });
    }

    if (spatialBackdrop) {
        spatialBackdrop.addEventListener('click', (e) => {
            e.stopPropagation();
            closeDetailPanel();
        });
    }

    if (detailPanelEl) {
        detailPanelEl.addEventListener('click', (e) => e.stopPropagation());
    }

    if (mainCardEl) {
        mainCardEl.addEventListener('click', (e) => e.stopPropagation());
    }

    document.addEventListener('click', (e) => {
        if (spatialStage && spatialStage.classList.contains('is-expanded')) {
            const isInsideDetail = detailPanelEl && detailPanelEl.contains(e.target);
            const isInsideMain = mainCardEl && mainCardEl.contains(e.target);
            if (!isInsideDetail && !isInsideMain) {
                closeDetailPanel();
            }
        }
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && spatialStage && spatialStage.classList.contains('is-expanded')) {
            closeDetailPanel();
        }
    });

    if (window.location.hash) {
        try {
            history.replaceState(null, '', window.location.pathname + window.location.search);
        } catch (_) { }
    }

    // --------------------------------------------------------------------------
    // 6. SAO CHÉP USERNAME (@Bảo) AN TOÀN KHI MỞ OFFLINE FILE://
    // --------------------------------------------------------------------------
    const usernameBtn = document.getElementById('usernameChip');
    if (usernameBtn) {
        const showCopiedFeedback = () => {
            const originalContent = usernameBtn.innerHTML;
            usernameBtn.innerHTML = '<i class="ri-check-line text-emerald-400 text-[10px]"></i><span>Đã sao chép!</span>';
            setTimeout(() => {
                usernameBtn.innerHTML = originalContent;
            }, 1500);
        };

        const fallbackCopy = () => {
            try {
                const tmp = document.createElement('textarea');
                tmp.value = '@Bảo';
                tmp.style.position = 'fixed';
                tmp.style.opacity = '0';
                document.body.appendChild(tmp);
                tmp.select();
                document.execCommand('copy');
                document.body.removeChild(tmp);
                showCopiedFeedback();
            } catch (_) { }
        };

        usernameBtn.addEventListener('click', () => {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText('@Bảo').then(showCopiedFeedback).catch(fallbackCopy);
            } else {
                fallbackCopy();
            }
        });
    }

    // --------------------------------------------------------------------------
    // 7. HỆ THỐNG HẠT BỤI 3D CANVAS SIÊU NHẸ (DPR=1, 30FPS CHO MÁY YẾU)
    // --------------------------------------------------------------------------
    const particleCanvas = document.getElementById('bg-particles');
    let pCtx = null;
    let canvasW = window.innerWidth;
    let canvasH = window.innerHeight;
    let particles = [];
    let pointerNormX = 0;
    let pointerNormY = 0;
    let smoothParallaxX = 0;
    let smoothParallaxY = 0;

    function assignParticleColors() {
        const aura = PLAYLIST[currentIndex].aura;
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const hue = (aura.hueMin + p.hueOffset * (aura.hueMax - aura.hueMin)).toFixed(0);
            p.haloColor = `hsla(${hue}, 90%, 70%, ${(p.baseAlpha * 0.24).toFixed(2)})`;
            p.coreColor = `hsla(${hue}, 95%, 86%, ${p.baseAlpha.toFixed(2)})`;
        }
        particleColorsDirty = false;
    }

    function createParticle() {
        const z = 0.3 + Math.random() * 0.7;
        return {
            x: Math.random() * canvasW,
            y: Math.random() * canvasH,
            z,
            vx: (Math.random() - 0.5) * (0.42 * z),
            vy: -(0.22 + Math.random() * 0.45) * z,
            radius: 0.9 + z * 1.6,
            baseAlpha: 0.24 + z * 0.46,
            hueOffset: Math.random(),
            haloColor: 'rgba(168,85,247,0.16)',
            coreColor: 'rgba(233,213,255,0.65)'
        };
    }

    function initParticlesCanvas() {
        if (!particleCanvas || prefersReducedMotion) return;
        try {
            pCtx = particleCanvas.getContext('2d', { alpha: true });
            if (!pCtx) return;

            const resizeCanvas = () => {
                try {
                    // Khóa DPR = 1 để tiết kiệm 75% tải GPU trên màn hình DPI cao / máy yếu
                    canvasW = window.innerWidth;
                    canvasH = window.innerHeight;
                    particleCanvas.width = canvasW;
                    particleCanvas.height = canvasH;

                    const desiredCount = isTouchDevice || canvasW < 780 ? 12 : 22;
                    if (particles.length < desiredCount) {
                        while (particles.length < desiredCount) {
                            particles.push(createParticle());
                        }
                    } else if (particles.length > desiredCount) {
                        particles.length = desiredCount;
                    }
                    assignParticleColors();
                } catch (_) { }
            };

            resizeCanvas();
            window.addEventListener('resize', resizeCanvas, { passive: true });
        } catch (_) {
            pCtx = null;
        }
    }

    initParticlesCanvas();

    function renderParticlesStep(energyBoost) {
        if (!pCtx || !particles.length) return;
        try {
            if (particleColorsDirty) assignParticleColors();

            pCtx.clearRect(0, 0, canvasW, canvasH);

            smoothParallaxX += (pointerNormX * 14 - smoothParallaxX) * 0.08;
            smoothParallaxY += (pointerNormY * 10 - smoothParallaxY) * 0.08;

            const speedMult = 1 + energyBoost * 0.75;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i];
                p.x += p.vx * speedMult;
                p.y += p.vy * speedMult;

                if (p.y < -12) {
                    p.y = canvasH + 12;
                    p.x = Math.random() * canvasW;
                } else if (p.y > canvasH + 12) {
                    p.y = -12;
                }
                if (p.x < -12) p.x = canvasW + 12;
                if (p.x > canvasW + 12) p.x = -12;

                const drawX = p.x - smoothParallaxX * p.z;
                const drawY = p.y - smoothParallaxY * p.z;

                pCtx.beginPath();
                pCtx.arc(drawX, drawY, p.radius * 2.6, 0, Math.PI * 2);
                pCtx.fillStyle = p.haloColor;
                pCtx.fill();

                pCtx.beginPath();
                pCtx.arc(drawX, drawY, p.radius, 0, Math.PI * 2);
                pCtx.fillStyle = p.coreColor;
                pCtx.fill();
            }
        } catch (_) { }
    }

    // --------------------------------------------------------------------------
    // 8. CON TRỎ TỪ TÍNH, PARALLAX 3D & TÁN SẮC VIỀN KÍNH (CACHE RECT, 0 REFLOW)
    // --------------------------------------------------------------------------
    const cursorEl = document.getElementById('magneticCursor');
    const cursorRing = cursorEl ? cursorEl.querySelector('.cursor-ring') : null;
    const cursorDot = cursorEl ? cursorEl.querySelector('.cursor-dot') : null;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let isCursorVisible = false;
    let cursorNeedsUpdate = false;
    let pointerDirty = false;
    let hoveredMagneticCenter = null;

    let targetTiltX = 0;
    let targetTiltY = 0;
    let currentTiltX = 0;
    let currentTiltY = 0;
    let isMouseActive = false;

    function flushPointerGlassUpdates() {
        if (!pointerDirty) return;
        pointerDirty = false;

        if (!cachedCardRects.length) refreshCachedRects();

        for (let i = 0; i < cachedCardRects.length; i++) {
            const item = cachedCardRects[i];
            const rect = item.rect;
            const relX = mouseX - rect.left;
            const relY = mouseY - rect.top;

            const clampedX = Math.max(rect.left, Math.min(mouseX, rect.right));
            const clampedY = Math.max(rect.top, Math.min(mouseY, rect.bottom));
            const dist = Math.hypot(mouseX - clampedX, mouseY - clampedY);

            if (dist < 220) {
                item.el.style.setProperty('--border-x', `${relX.toFixed(0)}px`);
                item.el.style.setProperty('--border-y', `${relY.toFixed(0)}px`);
                const proximity = 1 - dist / 220;
                item.el.style.setProperty('--border-glow-opacity', (0.30 + proximity * 0.65).toFixed(2));
            } else {
                item.el.style.setProperty('--border-glow-opacity', '0.28');
            }
        }

        if (mainCardEl && cachedMainRect) {
            mainCardEl.style.setProperty('--sheen-x', `${(mouseX - cachedMainRect.left).toFixed(0)}px`);
            mainCardEl.style.setProperty('--sheen-y', `${(mouseY - cachedMainRect.top).toFixed(0)}px`);
            mainCardEl.style.setProperty('--sheen-opacity', '1');
        }
    }

    window.addEventListener('pointermove', (e) => {
        if (e.pointerType === 'touch') {
            if (!isTouchDevice) {
                isTouchDevice = true;
                document.body.classList.add('is-touch-device');
                targetTiltX = 0;
                targetTiltY = 0;
            }
            return;
        }

        if (!isDesktopInteractionEnabled()) {
            if (cursorEl && isCursorVisible) {
                isCursorVisible = false;
                cursorEl.classList.remove('is-visible', 'is-hovering', 'is-pressed');
            }
            return;
        }

        isMouseActive = true;
        mouseX = e.clientX;
        mouseY = e.clientY;
        pointerDirty = true;
        cursorNeedsUpdate = true;

        if (cursorEl && !isCursorVisible) {
            isCursorVisible = true;
            ringX = mouseX;
            ringY = mouseY;
            cursorEl.classList.add('is-visible');
        }

        const w = window.innerWidth || 1;
        const h = window.innerHeight || 1;
        pointerNormX = (mouseX - w / 2) / (w / 2);
        pointerNormY = (mouseY - h / 2) / (h / 2);

        if (!prefersReducedMotion) {
            targetTiltX = -pointerNormY * 4.5;
            targetTiltY = pointerNormX * 5.2;
        }
    }, { passive: true });

    window.addEventListener('touchstart', () => {
        if (!isTouchDevice) {
            isTouchDevice = true;
            document.body.classList.add('is-touch-device');
            targetTiltX = 0;
            targetTiltY = 0;
            currentTiltX = 0;
            currentTiltY = 0;
            if (cursorEl) cursorEl.classList.remove('is-visible');
        }
    }, { passive: true });

    window.addEventListener('resize', () => {
        refreshCachedRects();
        if (!isDesktopInteractionEnabled()) {
            isMouseActive = false;
            isCursorVisible = false;
            targetTiltX = 0;
            targetTiltY = 0;
            currentTiltX = 0;
            currentTiltY = 0;
            hoveredMagneticCenter = null;
            if (cursorEl) cursorEl.classList.remove('is-visible', 'is-hovering', 'is-pressed');
            if (mainCardEl) {
                mainCardEl.style.setProperty('--tilt-x', '0deg');
                mainCardEl.style.setProperty('--tilt-y', '0deg');
                mainCardEl.style.setProperty('--sheen-opacity', '0');
            }
        }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
        isMouseActive = false;
        isCursorVisible = false;
        cursorNeedsUpdate = false;
        pointerDirty = false;
        targetTiltX = 0;
        targetTiltY = 0;
        hoveredMagneticCenter = null;
        if (cursorEl) {
            cursorEl.classList.remove('is-visible', 'is-hovering', 'is-pressed');
        }
        if (mainCardEl) {
            mainCardEl.style.setProperty('--sheen-opacity', '0');
        }
        glassCards.forEach((cardEl) => {
            cardEl.style.setProperty('--border-glow-opacity', '0.32');
        });
    });

    window.addEventListener('mousedown', () => {
        if (isDesktopInteractionEnabled() && cursorEl) cursorEl.classList.add('is-pressed');
    }, { passive: true });

    window.addEventListener('mouseup', () => {
        if (cursorEl) cursorEl.classList.remove('is-pressed');
    }, { passive: true });

    const magneticTargets = document.querySelectorAll('.magnetic-target');
    magneticTargets.forEach((el) => {
        el.addEventListener('mouseenter', () => {
            if (!isDesktopInteractionEnabled()) return;
            const rect = el.getBoundingClientRect();
            hoveredMagneticCenter = {
                x: rect.left + rect.width / 2,
                y: rect.top + rect.height / 2
            };
            cursorNeedsUpdate = true;
            if (cursorEl) cursorEl.classList.add('is-hovering');
        });

        el.addEventListener('mouseleave', () => {
            hoveredMagneticCenter = null;
            cursorNeedsUpdate = true;
            if (cursorEl) cursorEl.classList.remove('is-hovering');
        });
    });

    // --------------------------------------------------------------------------
    // 9. HYBRID AUDIO VISUALIZER + COMBINED ENGINE (NGHỈ KHI ẨN TAB / NHÀN RỖI)
    // --------------------------------------------------------------------------
    let currentGlow = 0;
    let simPhase = 0;
    let lastParticleTime = 0;
    let isPageHidden = document.hidden;

    document.addEventListener('visibilitychange', () => {
        isPageHidden = document.hidden;
    });

    function updateHybridVisualizerAndGlow() {
        if (!isPlaying) return 0;

        let rawEnergy = 0;
        let usedRealFFT = false;
        const musicViewOpen = activeTarget === 'music' && spatialStage && spatialStage.classList.contains('is-expanded');

        // 1. Phổ tần số thực từ Web Audio API (khi chạy trên HTTP/HTTPS)
        if (visualizerMode === 'webaudio' && analyser && freqData) {
            try {
                analyser.getByteFrequencyData(freqData);
                let totalSum = 0;
                for (let i = 0; i < freqData.length; i++) {
                    totalSum += freqData[i];
                }

                if (totalSum > 8) {
                    silentFrameCount = 0;
                    usedRealFFT = true;

                    let bassSum = 0;
                    const bassCount = Math.min(6, freqData.length);
                    for (let b = 1; b <= bassCount; b++) {
                        bassSum += freqData[b];
                    }
                    rawEnergy = Math.min(1, (bassSum / (bassCount * 255)) * 1.15);

                    if (musicViewOpen) {
                        const barCount = vizBars.length;
                        for (let i = 0; i < barCount; i++) {
                            const binIndex = Math.min(freqData.length - 1, Math.floor((i / barCount) * 20) + 1);
                            const targetScale = Math.max(0.16, Math.min(1.0, 0.14 + (freqData[binIndex] / 255) * 0.95));
                            vizBarLevels[i] += (targetScale - vizBarLevels[i]) * 0.34;
                            vizBars[i].style.transform = `scaleY(${vizBarLevels[i].toFixed(2)})`;
                        }
                    }

                    for (let k = 0; k < quickSoundwaveBars.length; k++) {
                        const qBin = Math.min(freqData.length - 1, 2 + k * 4);
                        const qTarget = Math.max(0.28, Math.min(1.0, 0.25 + (freqData[qBin] / 255) * 0.85));
                        quickBarLevels[k] += (qTarget - quickBarLevels[k]) * 0.32;
                        quickSoundwaveBars[k].style.transform = `scaleY(${quickBarLevels[k].toFixed(2)})`;
                    }
                } else if (audio.currentTime > 0.35 && !audio.muted && audio.volume > 0.05) {
                    silentFrameCount++;
                    if (silentFrameCount > 55) {
                        visualizerMode = 'simulated';
                        setVisualizerBadge('simulated');
                    }
                }
            } catch (_) {
                visualizerMode = 'simulated';
                setVisualizerBadge('simulated');
            }
        }

        // 2. Giả lập nhịp thông minh theo BPM (Fallback khi mở trực tiếp file://)
        if (!usedRealFFT) {
            const trackBpm = (PLAYLIST[currentIndex] && PLAYLIST[currentIndex].bpm) || 118;
            const beatRadPerFrame = ((trackBpm / 60) * Math.PI * 2) / 60;
            simPhase += beatRadPerFrame;

            const kick = Math.pow(Math.max(0, Math.sin(simPhase)), 3);
            const subWave = 0.5 + 0.5 * Math.sin(simPhase * 0.5 + 0.8);
            rawEnergy = Math.max(0.14, Math.min(0.92, 0.22 + kick * 0.46 + subWave * 0.18));

            if (musicViewOpen) {
                const barCount = vizBars.length;
                const center = (barCount - 1) / 2;
                for (let i = 0; i < barCount; i++) {
                    const distFromCenter = Math.abs(i - center) / center;
                    const envelope = 1.0 - distFromCenter * 0.48;
                    const waveA = 0.5 + 0.5 * Math.sin(simPhase + i * 0.55);
                    const waveB = 0.5 + 0.5 * Math.cos(simPhase * 2.1 - i * 0.85);
                    const targetScale = Math.max(
                        0.18,
                        Math.min(1.0, 0.18 + (kick * 0.42 + waveA * 0.28 + waveB * 0.24) * envelope)
                    );
                    vizBarLevels[i] += (targetScale - vizBarLevels[i]) * 0.28;
                    vizBars[i].style.transform = `scaleY(${vizBarLevels[i].toFixed(2)})`;
                }
            }

            for (let k = 0; k < quickSoundwaveBars.length; k++) {
                const qWave = 0.5 + 0.5 * Math.sin(simPhase * 1.4 + k * 1.5);
                const qTarget = Math.max(0.30, Math.min(1.0, 0.30 + qWave * 0.55 + kick * 0.20));
                quickBarLevels[k] += (qTarget - quickBarLevels[k]) * 0.26;
                quickSoundwaveBars[k].style.transform = `scaleY(${quickBarLevels[k].toFixed(2)})`;
            }
        }

        // Hào quang chạy 100% trên GPU bằng opacity/scale (KHÔNG sửa box-shadow gây repaint)
        currentGlow += (rawEnergy - currentGlow) * 0.14;
        if (cardBeatGlowEl) {
            cardBeatGlowEl.style.opacity = (0.18 + currentGlow * 0.72).toFixed(2);
        }
        if (musicViewOpen && vinylAuraEl) {
            vinylAuraEl.style.opacity = (0.52 + currentGlow * 0.44).toFixed(2);
            vinylAuraEl.style.transform = `scale(${(0.98 + currentGlow * 0.09).toFixed(3)})`;
        }

        return currentGlow;
    }

    function updateMagneticCursorFrame() {
        if (!cursorNeedsUpdate || !isDesktopInteractionEnabled() || !cursorEl || !cursorRing || !cursorDot || !isCursorVisible) return;

        let targetRingX = mouseX;
        let targetRingY = mouseY;

        if (hoveredMagneticCenter) {
            targetRingX = mouseX + (hoveredMagneticCenter.x - mouseX) * 0.26;
            targetRingY = mouseY + (hoveredMagneticCenter.y - mouseY) * 0.26;
        }

        ringX += (targetRingX - ringX) * 0.22;
        ringY += (targetRingY - ringY) * 0.22;

        cursorRing.style.transform = `translate3d(${ringX.toFixed(1)}px, ${ringY.toFixed(1)}px, 0)`;
        cursorDot.style.transform = `translate3d(${mouseX.toFixed(1)}px, ${mouseY.toFixed(1)}px, 0)`;

        if (Math.abs(targetRingX - ringX) < 0.15 && Math.abs(targetRingY - ringY) < 0.15) {
            cursorNeedsUpdate = false;
        }
    }

    function renderVisualEngine(timestamp) {
        if (!isPageHidden) {
            // 1. Cập nhật tán sắc viền kính (chỉ khi chuột thực sự di chuyển)
            if (pointerDirty) {
                flushPointerGlassUpdates();
            }

            // 2. Magnetic Parallax 3D (dừng ghi DOM khi đã hội tụ & khi đang spring Split-View)
            if (!isAnimatingSplit && isDesktopInteractionEnabled() && !prefersReducedMotion) {
                const dx = targetTiltX - currentTiltX;
                const dy = targetTiltY - currentTiltY;
                if (Math.abs(dx) > 0.02 || Math.abs(dy) > 0.02) {
                    const lerpFactor = isMouseActive ? 0.14 : 0.08;
                    currentTiltX += dx * lerpFactor;
                    currentTiltY += dy * lerpFactor;
                    if (mainCardEl) {
                        mainCardEl.style.setProperty('--tilt-x', `${currentTiltX.toFixed(2)}deg`);
                        mainCardEl.style.setProperty('--tilt-y', `${currentTiltY.toFixed(2)}deg`);
                    }
                }
            }

            // 3. Hybrid Audio Visualizer & GPU Opacity Beat Glow
            const energy = updateHybridVisualizerAndGlow();

            // 4. Hạt bụi không gian 3D Canvas giới hạn 30 FPS cho máy yếu
            if (timestamp - lastParticleTime >= 33) {
                lastParticleTime = timestamp;
                renderParticlesStep(energy);
            }

            // 5. Con trỏ từ tính phát sáng
            updateMagneticCursorFrame();
        }

        requestAnimationFrame(renderVisualEngine);
    }

    requestAnimationFrame(renderVisualEngine);

    // --------------------------------------------------------------------------
    // 10. TACTILE UX: ELASTIC PRESS (DÙNG CLASS .is-pressing KHÔNG ĐỤNG .is-active)
    // --------------------------------------------------------------------------
    const tapElements = document.querySelectorAll('.ios-tap, .avatar-circle');
    tapElements.forEach((el) => {
        el.addEventListener('pointerdown', () => {
            el.classList.add('is-pressing');
        }, { passive: true });
        const removePressing = () => el.classList.remove('is-pressing');
        el.addEventListener('pointerup', removePressing);
        el.addEventListener('pointercancel', removePressing);
        el.addEventListener('pointerleave', removePressing);
    });
});
