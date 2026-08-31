/* =====================================================
   HER VOICE — MEMORY VAULT
===================================================== */


/* =====================================================
   CONFIG
===================================================== */

const TOTAL_VOICES = 45;


/*
    अगर तुम्हारे पास 55 से ज्यादा हैं,
    बस इसे बढ़ा दो:

    const TOTAL_VOICES = 80;

    फिर voice56.mp4 ... voice80.mp4
    automatically generate हो जाएंगी.
*/


/* =====================================================
   AUTOMATIC MEMORY GENERATION
===================================================== */

const memories = [];


for (let i = 1; i <= TOTAL_VOICES; i++) {

    memories.push({

        id: i,

        title:
            `Voice Memory ${String(i).padStart(2, "0")}`,

        date:
            "VOICE MEMORY",

        description:
            "A little voice message worth remembering.",

        audio:
            `audio/voice${i}.mp4`,

        duration:
            0

    });

}


/* =====================================================
   ELEMENTS
===================================================== */

const audio =
    document.getElementById("audio");

const memoryGrid =
    document.getElementById("memoryGrid");

const searchInput =
    document.getElementById("searchInput");

const emptyState =
    document.getElementById("emptyState");

const loadMore =
    document.getElementById("loadMore");

const player =
    document.getElementById("player");

const playerTitle =
    document.getElementById("playerTitle");

const playerMeta =
    document.getElementById("playerMeta");

const playerPlay =
    document.getElementById("playerPlay");

const playerCurrent =
    document.getElementById("playerCurrent");

const playerDuration =
    document.getElementById("playerDuration");

const progressFill =
    document.getElementById("progressFill");

const progressTrack =
    document.getElementById("progressTrack");

const totalCounter =
    document.getElementById("totalCounter");

const heroMemoryCount =
    document.getElementById("heroMemoryCount");

const toast =
    document.getElementById("toast");

const randomOverlay =
    document.getElementById("randomOverlay");

const randomNumber =
    document.getElementById("randomNumber");

const randomTitle =
    document.getElementById("randomTitle");

const randomDescription =
    document.getElementById("randomDescription");


/* =====================================================
   STATE
===================================================== */

let currentIndex = -1;

let currentFilter = "all";

let searchTerm = "";

let newestFirst = false;

let visibleCount = 12;

let randomIndex = 0;


let favorites =
    JSON.parse(
        localStorage.getItem(
            "herVoiceFavorites"
        )
    ) || [];


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(seconds) {

    seconds =
        Number(seconds) || 0;


    const minutes =
        Math.floor(
            seconds / 60
        );


    const secs =
        Math.floor(
            seconds % 60
        );


    return (
        String(minutes)
            .padStart(2, "0")
        +
        ":"
        +
        String(secs)
            .padStart(2, "0")
    );

}


/* =====================================================
   CREATE RANDOM WAVEFORM
===================================================== */

function createWave() {

    let html = "";


    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const height =
            8 +
            Math.random() * 38;


        html += `
            <span
                style="
                    height:${height}px;
                ">
            </span>
        `;

    }


    return html;

}


/* =====================================================
   LOAD ACTUAL AUDIO DURATIONS
===================================================== */

async function loadDurations() {

    for (
        let i = 0;
        i < memories.length;
        i++
    ) {

        const memory =
            memories[i];


        try {

            const tempAudio =
                new Audio();


            tempAudio.preload =
                "metadata";


            await new Promise(
                (resolve) => {

                    tempAudio.onloadedmetadata =
                        () => {

                            memory.duration =
                                tempAudio.duration;
                            tempAudio.removeAttribute("src");
                            tempAudio.load();
                            resolve();

                        };


                    tempAudio.onerror =
                        () => {

                            memory.duration =
                                0;
                            tempAudio.removeAttribute("src");
                            tempAudio.load();
                            resolve();

                        };


                    tempAudio.src =
                        memory.audio;

                }
            );

        } catch (error) {

            console.warn(
                `Could not load ${memory.audio}`,
                error
            );

        }

    }


    renderMemories();

}


/* =====================================================
   GET FILTERED MEMORIES
===================================================== */

function getFilteredMemories() {

    let result =
        memories.map(
            memory => ({
                ...memory
            })
        );


    /* Search */

    if (searchTerm) {

        result =
            result.filter(
                memory => {

                    const text =
                        (
                            memory.title
                            +
                            " "
                            +
                            memory.description
                            +
                            " "
                            +
                            memory.date
                        )
                        .toLowerCase();


                    return text.includes(
                        searchTerm
                    );

                }
            );

    }


    /* Favorites */

    if (
        currentFilter ===
        "favorites"
    ) {

        result =
            result.filter(
                memory =>
                    favorites.includes(
                        memory.id
                    )
            );

    }


    /* Short */

    if (
        currentFilter ===
        "short"
    ) {

        result =
            result.filter(
                memory =>
                    memory.duration > 0 &&
                    memory.duration < 60
            );

    }


    /* Long */

    if (
        currentFilter ===
        "long"
    ) {

        result =
            result.filter(
                memory =>
                    memory.duration >= 60
            );

    }


    /* Sorting */

    result.sort(
        (a, b) => {

            return newestFirst
                ? b.id - a.id
                : a.id - b.id;

        }
    );


    return result;

}


/* =====================================================
   RENDER MEMORY CARDS
===================================================== */

function renderMemories() {

    const filtered =
        getFilteredMemories();


    memoryGrid.innerHTML =
        "";


    const visible =
        filtered.slice(
            0,
            visibleCount
        );


    /* Empty */

    if (
        visible.length === 0
    ) {

        emptyState.classList.add(
            "show"
        );

    } else {

        emptyState.classList.remove(
            "show"
        );

    }


    /* Cards */

    visible.forEach(
        (
            memory,
            displayIndex
        ) => {

            const isFavorite =
                favorites.includes(
                    memory.id
                );


            const card =
                document.createElement(
                    "article"
                );


            card.className =
                "memory-card";


            card.dataset.index =
                memory.id;


            const durationText =
                memory.duration
                    ? formatTime(
                        memory.duration
                    )
                    : "--:--";


            card.innerHTML = `

                <div class="card-top">

                    <span class="card-number">
                        ${String(
                            memory.id
                        ).padStart(2, "0")}
                    </span>

                    <button
                        class="favorite ${
                            isFavorite
                                ? "active"
                                : ""
                        }"
                        data-favorite="${
                            memory.id
                        }"
                        type="button"
                        aria-label="Favorite"
                    >
                        ${
                            isFavorite
                                ? "♥"
                                : "♡"
                        }
                    </button>

                </div>


                <div class="card-visual">

                    <div class="card-wave">

                        ${createWave()}

                    </div>

                </div>


                <span class="card-date">
                    ${memory.date}
                </span>


                <h3 class="card-title">
                    ${memory.title}
                </h3>


                <p class="card-description">
                    ${memory.description}
                </p>


                <div class="card-footer">

                    <span class="card-duration">
                        ${durationText}
                    </span>

                    <button
                        class="card-play"
                        data-play="${memory.id}"
                        type="button"
                        aria-label="Play"
                    >
                        ▶
                    </button>

                </div>

            `;


            memoryGrid.appendChild(
                card
            );


            /* Entrance animation */

            setTimeout(
                () => {

                    card.classList.add(
                        "visible"
                    );

                },
                displayIndex * 45
            );

        }
    );


    /* Load more */

    if (
        visible.length <
        filtered.length
    ) {

        loadMore.style.display =
            "block";

    } else {

        loadMore.style.display =
            "none";

    }


    updatePlayingCard();

}


/* =====================================================
   MEMORY GRID CLICK
===================================================== */

memoryGrid.addEventListener(
    "click",
    event => {

        const favoriteButton =
            event.target.closest(
                "[data-favorite]"
            );


        const playButton =
            event.target.closest(
                "[data-play]"
            );


        /* Favorite */

        if (favoriteButton) {

            const id =
                Number(
                    favoriteButton
                        .dataset
                        .favorite
                );


            toggleFavorite(id);

            return;

        }


        /* Play */

        if (playButton) {

            const id =
                Number(
                    playButton
                        .dataset
                        .play
                );


            const index =
                memories.findIndex(
                    memory =>
                        memory.id === id
                );


            if (index !== -1) {

                loadMemory(index);

                playMemory();

            }

        }

    }
);


/* =====================================================
   FAVORITES
===================================================== */

function toggleFavorite(id) {

    const exists =
        favorites.includes(id);


    if (exists) {

        favorites =
            favorites.filter(
                item =>
                    item !== id
            );


        showToast(
            "Removed from favorites"
        );

    } else {

        favorites.push(id);


        showToast(
            "Added to favorites"
        );

    }


    localStorage.setItem(
        "herVoiceFavorites",
        JSON.stringify(
            favorites
        )
    );


    renderMemories();

}


/* =====================================================
   LOAD MEMORY
===================================================== */

function loadMemory(index) {

    if (
        index < 0 ||
        index >= memories.length
    ) {

        return;

    }


    currentIndex =
        index;


    const memory =
        memories[index];


    audio.src =
        memory.audio;


    playerTitle.textContent =
        memory.title;


    playerMeta.textContent =
        memory.duration
            ? `${memory.date} · ${
                formatTime(
                    memory.duration
                )
            }`
            : memory.date;


    playerDuration.textContent =
        memory.duration
            ? formatTime(
                memory.duration
            )
            : "--:--";


    playerCurrent.textContent =
        "00:00";


    progressFill.style.width =
        "0%";


    player.classList.add(
        "show"
    );


    updatePlayingCard();


    showToast(
        `Memory ${
            String(
                memory.id
            ).padStart(2, "0")
        } selected`
    );

}


/* =====================================================
   PLAY
===================================================== */

function playMemory() {

    if (
        currentIndex === -1
    ) {

        loadMemory(0);

    }


    audio.play()
        .catch(
            error => {

                console.error(
                    error
                );


                showToast(
                    "Unable to play this file"
                );

            }
        );

}


/* =====================================================
   PAUSE
===================================================== */

function pauseMemory() {

    audio.pause();

}


/* =====================================================
   PLAYER PLAY BUTTON
===================================================== */

playerPlay.addEventListener(
    "click",
    () => {

        if (
            currentIndex === -1
        ) {

            loadMemory(0);

            playMemory();

            return;

        }


        if (
            audio.paused
        ) {

            playMemory();

        } else {

            pauseMemory();

        }

    }
);


/* =====================================================
   AUDIO PLAY
===================================================== */

audio.addEventListener(
    "play",
    () => {

        playerPlay.textContent =
            "❚❚";


        player.classList.add(
            "playing"
        );


        updatePlayingCard();

    }
);


/* =====================================================
   AUDIO PAUSE
===================================================== */

audio.addEventListener(
    "pause",
    () => {

        playerPlay.textContent =
            "▶";


        player.classList.remove(
            "playing"
        );


        updatePlayingCard();

    }
);


/* =====================================================
   AUDIO METADATA
===================================================== */

audio.addEventListener(
    "loadedmetadata",
    () => {

        if (
            audio.duration &&
            currentIndex !== -1
        ) {

            memories[
                currentIndex
            ].duration =
                audio.duration;


            playerDuration.textContent =
                formatTime(
                    audio.duration
                );

            const card = document.querySelector(`.memory-card[data-index="${memories[currentIndex].id}"]`);
            if (card) {
                const durationEl = card.querySelector('.card-duration');
                if (durationEl) {
                    durationEl.textContent = formatTime(audio.duration);
                }
            }
        }
    }
);


/* =====================================================
   AUDIO TIME UPDATE
===================================================== */

audio.addEventListener(
    "timeupdate",
    () => {

        if (
            !audio.duration
        ) {

            return;

        }


        const percent =
            (
                audio.currentTime /
                audio.duration
            ) * 100;


        progressFill.style.width =
            `${percent}%`;


        playerCurrent.textContent =
            formatTime(
                audio.currentTime
            );

    }
);


/* =====================================================
   AUDIO ENDED
===================================================== */

audio.addEventListener(
    "ended",
    () => {

        playerPlay.textContent =
            "▶";


        player.classList.remove(
            "playing"
        );


        updatePlayingCard();


        /* Automatically play next */

        if (
            currentIndex <
            memories.length - 1
        ) {

            loadMemory(
                currentIndex + 1
            );


            playMemory();

        }

    }
);


/* =====================================================
   NEXT
===================================================== */

document
    .getElementById("nextBtn")
    .addEventListener(
        "click",
        () => {

            if (
                !memories.length
            ) {

                return;

            }


            let next =
                currentIndex + 1;


            if (
                next >=
                memories.length
            ) {

                next = 0;

            }


            loadMemory(next);

            playMemory();

        }
    );


/* =====================================================
   PREVIOUS
===================================================== */

document
    .getElementById("prevBtn")
    .addEventListener(
        "click",
        () => {

            if (
                !memories.length
            ) {

                return;

            }


            let previous =
                currentIndex - 1;


            if (
                previous < 0
            ) {

                previous =
                    memories.length - 1;

            }


            loadMemory(previous);

            playMemory();

        }
    );


/* =====================================================
   PROGRESS SEEK
===================================================== */

progressTrack.addEventListener(
    "click",
    event => {

        if (
            !audio.duration
        ) {

            return;

        }


        const rect =
            progressTrack
                .getBoundingClientRect();


        const percent =
            (
                event.clientX -
                rect.left
            ) / rect.width;


        audio.currentTime =
            percent *
            audio.duration;

    }
);


/* =====================================================
   UPDATE PLAYING CARD
===================================================== */

function updatePlayingCard() {

    document
        .querySelectorAll(
            ".memory-card"
        )
        .forEach(
            card => {

                const id =
                    Number(
                        card.dataset.index
                    );


                const memory =
                    memories.find(
                        item =>
                            item.id === id
                    );


                if (!memory) {
                    return;
                }


                card.classList.toggle(
                    "playing",
                    id ===
                        memories[
                            currentIndex
                        ]?.id
                    &&
                    !audio.paused
                );

            }
        );

}


/* =====================================================
   SEARCH
===================================================== */

searchInput.addEventListener(
    "input",
    event => {

        searchTerm =
            event.target.value
                .toLowerCase()
                .trim();


        visibleCount =
            12;


        renderMemories();

    }
);


/* =====================================================
   FILTERS
===================================================== */

document
    .querySelectorAll(
        ".filter"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    document
                        .querySelectorAll(
                            ".filter"
                        )
                        .forEach(
                            btn =>
                                btn.classList
                                    .remove(
                                        "active"
                                    )
                        );


                    button.classList.add(
                        "active"
                    );


                    currentFilter =
                        button.dataset.filter;


                    visibleCount =
                        12;


                    renderMemories();

                }
            );

        }
    );


/* =====================================================
   SORT
===================================================== */

document
    .getElementById("sortBtn")
    .addEventListener(
        "click",
        () => {

            newestFirst =
                !newestFirst;


            document
                .getElementById(
                    "sortBtn"
                )
                .childNodes[0]
                .textContent =
                newestFirst
                    ? "NEWEST "
                    : "OLDEST ";


            renderMemories();

        }
    );


/* =====================================================
   LOAD MORE
===================================================== */

loadMore.addEventListener(
    "click",
    () => {

        visibleCount += 12;

        renderMemories();

    }
);


/* =====================================================
   EXPLORE
===================================================== */

document
    .getElementById("exploreBtn")
    .addEventListener(
        "click",
        () => {

            document
                .getElementById(
                    "collection"
                )
                .scrollIntoView({
                    behavior: "smooth"
                });

        }
    );


/* =====================================================
   RANDOM MEMORY
===================================================== */

document
    .getElementById("randomBtn")
    .addEventListener(
        "click",
        openRandom
    );


function openRandom() {

    if (
        !memories.length
    ) {

        return;

    }


    randomIndex =
        Math.floor(
            Math.random() *
            memories.length
        );


    const memory =
        memories[randomIndex];


    randomNumber.textContent =
        String(
            memory.id
        ).padStart(2, "0");


    randomTitle.textContent =
        memory.title;


    randomDescription.textContent =
        memory.description;


    randomOverlay.classList.add(
        "show"
    );

}


/* =====================================================
   RANDOM PLAY
===================================================== */

document
    .getElementById("randomPlay")
    .addEventListener(
        "click",
        () => {

            loadMemory(
                randomIndex
            );


            playMemory();


            randomOverlay.classList.remove(
                "show"
            );

        }
    );


/* =====================================================
   CLOSE RANDOM
===================================================== */

document
    .getElementById("closeRandom")
    .addEventListener(
        "click",
        () => {

            randomOverlay.classList.remove(
                "show"
            );

        }
    );


randomOverlay.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            randomOverlay
        ) {

            randomOverlay.classList.remove(
                "show"
            );

        }

    }
);


/* =====================================================
   KEYBOARD SHORTCUTS
===================================================== */

document.addEventListener(
    "keydown",
    event => {

        /* Ctrl + K */

        if (
            (event.ctrlKey ||
                event.metaKey)
            &&
            event.key.toLowerCase()
                === "k"
        ) {

            event.preventDefault();

            searchInput.focus();

        }


        /* Space */

        if (
            event.code === "Space"
            &&
            document.activeElement !==
                searchInput
            &&
            document.activeElement !==
                document.getElementById("titlePlay")
        ) {

            event.preventDefault();


            if (
                currentIndex === -1
            ) {

                loadMemory(0);

                playMemory();

            } else if (
                audio.paused
            ) {

                playMemory();

            } else {

                pauseMemory();

            }

        }


        /* Right */

        if (
            event.key ===
            "ArrowRight"
            &&
            currentIndex !== -1
        ) {

            audio.currentTime += 5;

        }


        /* Left */

        if (
            event.key ===
            "ArrowLeft"
            &&
            currentIndex !== -1
        ) {

            audio.currentTime -= 5;

        }

    }
);


/* =====================================================
   TOAST
===================================================== */

let toastTimer;


function showToast(message) {

    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    clearTimeout(
        toastTimer
    );


    toastTimer =
        setTimeout(
            () => {

                toast.classList.remove(
                    "show"
                );

            },
            1800
        );

}


/* =====================================================
   HERO VISUALIZER
===================================================== */

const visualizer =
    document.getElementById(
        "visualizerBars"
    );


for (
    let i = 0;
    i < 75;
    i++
) {

    const bar =
        document.createElement(
            "span"
        );


    bar.style.height =
        `${
            5 +
            Math.random() * 30
        }px`;


    bar.style.animationDelay =
        `${
            Math.random() * 1.2
        }s`;


    visualizer.appendChild(
        bar
    );

}


/* =====================================================
   PARTICLES
===================================================== */

const particleCanvas =
    document.getElementById(
        "particles"
    );


const particleCtx =
    particleCanvas.getContext(
        "2d"
    );


let particles = [];


function resizeParticles() {

    particleCanvas.width =
        window.innerWidth;


    particleCanvas.height =
        window.innerHeight;

}


function createParticles() {

    particles = [];


    for (
        let i = 0;
        i < 45;
        i++
    ) {

        particles.push({

            x:
                Math.random() *
                window.innerWidth,

            y:
                Math.random() *
                window.innerHeight,

            radius:
                Math.random() * 1.4,

            speed:
                .08 +
                Math.random() * .25,

            opacity:
                .1 +
                Math.random() * .35

        });

    }

}


function animateParticles() {

    particleCtx.clearRect(
        0,
        0,
        particleCanvas.width,
        particleCanvas.height
    );


    particles.forEach(
        p => {

            p.y -= p.speed;


            if (
                p.y < 0
            ) {

                p.y =
                    window.innerHeight;

            }


            particleCtx.globalAlpha =
                p.opacity;


            particleCtx.beginPath();


            particleCtx.arc(
                p.x,
                p.y,
                p.radius,
                0,
                Math.PI * 2
            );


            particleCtx.fillStyle =
                "#ffffff";


            particleCtx.fill();

        }
    );


    requestAnimationFrame(
        animateParticles
    );

}


/* =====================================================
   COUNTERS
===================================================== */

function updateCounters() {

    const count =
        memories.length;


    totalCounter.textContent =
        `${String(count).padStart(2, "0")} ${
            count === 1
                ? "MEMORY"
                : "MEMORIES"
        }`;


    heroMemoryCount.textContent =
        String(count)
            .padStart(2, "0");

}


/* =====================================================
   RENDER WITHOUT RESETTING LOAD COUNT
===================================================== */

function renderMememoriesWithoutReset() {

    const oldVisible =
        visibleCount;


    renderMemories();


    visibleCount =
        oldVisible;

}


/* =====================================================
   INITIALIZE
===================================================== */

updateCounters();

renderMemories();

resizeParticles();

createParticles();

animateParticles();


/*
    Actual duration load.

    यह background में सभी
    voice files की metadata पढ़ेगा.
*/

loadDurations();


/* Resize */

window.addEventListener(
    "resize",
    () => {

        resizeParticles();

        createParticles();

    }
);
/* =====================================================
   PASSWORD PROTECTION — ADVANCED
===================================================== */

/*  Apna password yaha change karo  */
const CORRECT_PASSWORD = "naincy";

const lockScreen = document.getElementById("passwordOverlay");
const lockCard = document.getElementById("lockCard");
const lockInputWrap = document.getElementById("lockInputWrap");
const passwordInput = document.getElementById("passwordInput");
const passwordSubmit = document.getElementById("passwordSubmit");
const passwordError = document.getElementById("passwordError");
const lockStatus = document.getElementById("lockStatus");
const capsWarning = document.getElementById("capsWarning");
const togglePassword = document.getElementById("togglePassword");
const lockEmblem = document.getElementById("lockEmblem");
const progressBar = document.getElementById("progressBar");
const lockDots = document.getElementById("lockDots");
const lockIcon = document.getElementById("lockIcon");

const C_CIRC = 339.2919;   // 2 * PI * 54
let hasEnteredLock = false;

document.body.classList.add("locked");
if (passwordInput) passwordInput.focus();

/* ---------- live progress ring + dots + status ---------- */
function updateIndicators() {
    const val = passwordInput.value;
    const len = val.length;
    const pct = Math.min(len / CORRECT_PASSWORD.length, 1);
    if (progressBar) progressBar.style.strokeDashoffset = String(C_CIRC * (1 - pct));

    if (lockDots && lockDots.children.length) {
        const dots = [...lockDots.children];
        dots.forEach((d, i) => d.classList.toggle("on", i < Math.min(len, dots.length)));
        if (len > 0 && len >= CORRECT_PASSWORD.length) {
            dots.forEach(d => d.classList.toggle("right", val === CORRECT_PASSWORD));
        }
    }

    if (lockStatus) {
        if (len === 0) {
            lockStatus.textContent = "";
            lockStatus.className = "lock-status";
        } else if (val === CORRECT_PASSWORD) {
            lockStatus.textContent = "✓ ACCESS READY";
            lockStatus.className = "lock-status ok";
        } else if (CORRECT_PASSWORD.startsWith(val)) {
            lockStatus.textContent = "…";
            lockStatus.className = "lock-status";
        } else {
            lockStatus.textContent = "✕ WRONG";
            lockStatus.className = "lock-status err";
        }
    }
}

/* ---------- caps lock ---------- */
function showCaps() {
    if (capsWarning) capsWarning.classList.add("show");
}
function hideCaps() {
    if (capsWarning) capsWarning.classList.remove("show");
}
if (passwordInput) {
    passwordInput.addEventListener("keyup", e => {
        const caps = e.getModifierState ? e.getModifierState("CapsLock") : false;
        caps ? showCaps() : hideCaps();
    });
    passwordInput.addEventListener("blur", hideCaps);
    passwordInput.addEventListener("input", updateIndicators);
}

/* ---------- toggle password visibility ---------- */
if (togglePassword && passwordInput) {
    togglePassword.addEventListener("click", () => {
        const show = passwordInput.type === "password";
        passwordInput.type = show ? "text" : "password";
        lockInputWrap && lockInputWrap.classList.toggle("show", show);
        togglePassword.setAttribute("aria-label", show ? "Hide password" : "Show password");
        passwordInput.focus();
    });
}

/* ---------- sparkle burst ---------- */
function sparkleBurst() {
    const card = lockCard;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ["#d6a6ff", "#f5c9ff", "#7ef0c0", "#ffffff", "#9b8bff"];
    for (let i = 0; i < 28; i++) {
        const s = document.createElement("span");
        const size = 5 + Math.random() * 9;
        const dx = (Math.random() - 0.5) * 620;
        const dy = (Math.random() - 0.5) * 620;
        s.className = "sparkle";
        s.style.left = cx + "px";
        s.style.top = cy + "px";
        s.style.width = size + "px";
        s.style.height = size + "px";
        s.style.background = colors[Math.floor(Math.random() * colors.length)];
        s.style.boxShadow = "0 0 12px " + s.style.background;
        s.style.setProperty("--dx", dx + "px");
        s.style.setProperty("--dy", dy + "px");
        s.style.setProperty("--rot", (Math.random() * 360) + "deg");
        document.body.appendChild(s);
        setTimeout(() => s.remove(), 1100);
    }
}

/* ---------- unlock / error ---------- */
function unlock() {
    if (hasEnteredLock) return;
    passwordError.classList.remove("show");
    lockEmblem.classList.add("unlocked");
    lockCard.classList.add("success");
    hideCaps();
    sparkleBurst();

    setTimeout(() => {
        lockScreen.classList.add("hidden");
        document.body.classList.remove("locked");
        hasEnteredLock = true;
    }, 300);

    setTimeout(() => {
        lockScreen.style.display = "none";
        if (!document.querySelector("#audio .src")) {
            // no-op; audio is lazy
        }
    }, 1200);
}

function fail() {
    if (hasEnteredLock) return;
    passwordError.classList.add("show");
    lockCard.classList.remove("shake");
    void lockCard.offsetWidth;   // restart animation
    lockCard.classList.add("shake");
    lockStatus.textContent = "✕ ACCESS DENIED";
    lockStatus.className = "lock-status err";
    passwordInput.value = "";
    updateIndicators();
    passwordInput.focus();
    setTimeout(() => passwordError.classList.remove("show"), 2200);
}

function checkPassword() {
    if (passwordInput.value === CORRECT_PASSWORD) {
        unlock();
    } else {
        fail();
    }
}

if (passwordSubmit && passwordInput) {
    passwordSubmit.addEventListener("click", checkPassword);
    passwordInput.addEventListener("keypress", e => {
        if (e.key === "Enter") checkPassword();
    });
}

/* ---------- block global shortcuts while locked ---------- */
document.addEventListener(
    "keydown",
    e => {
        if (hasEnteredLock) return;
        // Freeze the app's keyboard shortcuts behind the lock screen.
        if (e.stopImmediatePropagation) e.stopImmediatePropagation();
        const k = (e.key || "").toLowerCase();
        if ((e.ctrlKey || e.metaKey) && k === "k") e.preventDefault();
        if (e.code === "Space" || k === "arrowright" || k === "arrowleft") e.preventDefault();
    },
    true   // capture phase — runs before the app's own shortcuts
);



/* =====================================================
   TITLE VOICE  —  "दोहे" hero play button
   plays: audio/dhumtedo.mp4
===================================================== */

(function () {

    const titleAudio =
        document.getElementById("titleAudio");

    const titlePlay =
        document.getElementById("titlePlay");

    const titleWrap =
        document.querySelector(".title-voice");

    const titleLabel =
        document.getElementById("titleVoiceLabel");

    const titleTime =
        document.getElementById("titleVoiceTime");

    const titleBar =
        document.getElementById("titleProgressBar");


    if (!titleAudio || !titlePlay) {
        return;
    }


    const CIRCUMFERENCE = 289;

    const DEFAULT_LABEL = "Play the दोहा";


    /* ---------- helpers ---------- */

    function fmt(seconds) {

        if (
            !seconds ||
            !isFinite(seconds)
        ) {
            return "00:00";
        }

        const m =
            Math.floor(seconds / 60);

        const s =
            Math.floor(seconds % 60);

        return (
            String(m).padStart(2, "0") +
            ":" +
            String(s).padStart(2, "0")
        );

    }


    function setRing(ratio) {

        titleBar.style.strokeDashoffset =
            String(
                CIRCUMFERENCE -
                (CIRCUMFERENCE * (ratio || 0))
            );

    }


    /* ---------- metadata ---------- */

    titleAudio.addEventListener(
        "loadedmetadata",
        () => {

            titleTime.textContent =
                fmt(titleAudio.duration);

        }
    );


    /* ---------- play / pause toggle ---------- */

    titlePlay.addEventListener(
        "click",
        () => {

            if (titleAudio.paused) {

                /* stop the floating player first */

                try {

                    if (
                        typeof audio !== "undefined" &&
                        audio &&
                        !audio.paused
                    ) {
                        audio.pause();
                    }

                } catch (e) {}


                titleAudio.play()
                    .catch((err) => {

                        console.warn(
                            "Could not play audio/dhumtedo.mp4",
                            err
                        );

                        titleWrap.classList.add("is-error");

                        titleLabel.textContent =
                            "Audio not found";

                        if (typeof showToast === "function") {

                            showToast(
                                "audio/dhumtedo.mp4 not found"
                            );

                        }

                    });

            } else {

                titleAudio.pause();

            }

        }
    );


    /* ---------- state ---------- */

    titleAudio.addEventListener(
        "play",
        () => {

            titleWrap.classList.add("is-playing");

            titleWrap.classList.remove("is-error");

            titleLabel.textContent =
                "Now playing";

        }
    );


    titleAudio.addEventListener(
        "pause",
        () => {

            titleWrap.classList.remove("is-playing");

            titleLabel.textContent =
                DEFAULT_LABEL;

        }
    );


    titleAudio.addEventListener(
        "ended",
        () => {

            titleWrap.classList.remove("is-playing");

            titleLabel.textContent =
                DEFAULT_LABEL;

            titleAudio.currentTime = 0;

            setRing(0);

            titleTime.textContent =
                fmt(titleAudio.duration);

        }
    );


    titleAudio.addEventListener(
        "error",
        () => {

            titleWrap.classList.add("is-error");

            titleLabel.textContent =
                "Audio not found";

        }
    );


    /* ---------- progress ---------- */

    titleAudio.addEventListener(
        "timeupdate",
        () => {

            if (
                !titleAudio.duration ||
                !isFinite(titleAudio.duration)
            ) {
                return;
            }

            setRing(
                titleAudio.currentTime /
                titleAudio.duration
            );

            titleTime.textContent =
                fmt(
                    titleAudio.duration -
                    titleAudio.currentTime
                );

        }
    );


    /* ---------- never two voices at once ---------- */

    try {

        if (
            typeof audio !== "undefined" &&
            audio
        ) {

            audio.addEventListener(
                "play",
                () => {

                    if (!titleAudio.paused) {
                        titleAudio.pause();
                    }

                }
            );

        }

    } catch (e) {}

})();


// ─── SCROLL / NAV ─────────────────────────────────────────
function onScroll() {
  const nav = document.querySelector(".nav");
  const topBtn = document.querySelector(".back-to-top");
  const y = window.scrollY;
  if (nav) nav.classList.toggle("scrolled", y > 40);
  if (topBtn) topBtn.classList.toggle("show", y > 500);
}

window.addEventListener("scroll", onScroll);

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.scrollToTop = scrollToTop;
