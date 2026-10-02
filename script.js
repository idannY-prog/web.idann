// =========================================================
// DATA & VARIABEL GLOBAL
// =========================================================

// Data Video / Galeri Dokumentasi & Manasik
const videoData = [
    {
        title: "📺 Manasik Umroh: Tata Cara & Doa Thawaf",
        question: "Panduan ringkas pelaksanaan thawaf mengelilingi Ka'bah sebanyak 7 kali.",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ" // Ganti dengan URL embed video Anda
    },
    {
        title: "📺 Dokumentasi Keberangkatan Jamaah Al-Hijrah",
        question: "Suasana pelepasan dan perjalanan jamaah menuju Madinah Al-Munawwarah.",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        title: "📺 Ziarah Kota Madinah & Masjid Nabawi",
        question: "Mengunjungi Raudhah, Makam Rasulullah SAW, dan Masjid Quba.",
        embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

// Data Kuis / Mengenal Tempat Suci
const quizData = [
    {
        image: "https://images.unsplash.com/photo-1591604466107-ec97de577aff?q=80&w=800", // Gambar Ka'bah
        instruction: "Tempat suci apakah ini?",
        answer: ["kabah", "ka'bah", "kaabah", "masjidil haram"]
    },
    {
        image: "https://images.unsplash.com/photo-1565552645632-d725f8bfc19a?q=80&w=800", // Gambar Masjid Nabawi
        instruction: "Masjid apakah yang memiliki kubah hijau ini?",
        answer: ["masjid nabawi", "nabawi"]
    },
    {
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&w=800", // Gambar Jabal Rahmah / Arafah
        instruction: "Bukit tempat bertemunya Nabi Adam dan Hawa adalah?",
        answer: ["jabal rahmah", "arafah", "padang arafah"]
    }
];

let currentVideoIndex = 0;
let currentQuizIndex = 0;

// =========================================================
// NAVIGASI HALAMAN (SINGLE PAGE APPLICATION)
// =========================================================

function showPage(pageId) {
    // Sembunyikan semua section
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.style.display = 'none';
    });

    // Tampilkan section yang dipilih
    const selectedPage = document.getElementById(`page-${pageId}`);
    if (selectedPage) {
        selectedPage.style.display = 'block';
    }

    // Load konten sesuai halaman
    if (pageId === 'video') {
        loadVideo(currentVideoIndex);
    } else if (pageId === 'game') {
        loadQuiz(currentQuizIndex);
    }

    // Scroll otomatis ke atas
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// =========================================================
// LOGIKA GALERI & VIDEO MANASIK
// =========================================================

function loadVideo(index) {
    const videoTitle = document.getElementById('video-title');
    const videoQuestion = document.getElementById('video-question');
    const videoContainer = document.getElementById('video-container');

    if (videoData[index]) {
        videoTitle.innerText = videoData[index].title;
        videoQuestion.innerText = videoData[index].question;
        
        // Tampilkan video via iframe
        videoContainer.innerHTML = `
            <iframe width="100%" height="100%" 
                src="${videoData[index].embedUrl}" 
                title="${videoData[index].title}" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    }
}

function nextVideo() {
    if (currentVideoIndex < videoData.length - 1) {
        currentVideoIndex++;
        loadVideo(currentVideoIndex);
    } else {
        alert("Anda telah melihat semua video dokumentasi.");
    }
}

function prevVideo() {
    if (currentVideoIndex > 0) {
        currentVideoIndex--;
        loadVideo(currentVideoIndex);
    }
}

// =========================================================
// LOGIKA KUIS / MENGENAL TEMPAT SUCI (PENGECAN SUARA)
// =========================================================

function loadQuiz(index) {
    const mainImg = document.getElementById('main-img');
    const gameInstruction = document.getElementById('game-instruction');
    const statusText = document.getElementById('status');
    const feedbackText = document.getElementById('feedback');
    const btnNext = document.getElementById('btn-next');

    if (quizData[index]) {
        mainImg.src = quizData[index].image;
        gameInstruction.innerText = quizData[index].instruction;
        statusText.innerText = "Tekan mikrofon, lalu sebutkan jawabannya!";
        feedbackText.innerText = "";
        btnNext.style.display = 'none';
    }
}

function repeatInstruction() {
    const gameInstruction = document.getElementById('game-instruction').innerText;
    
    // Fitur Text-to-Speech (Suara membaca instruksi)
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(gameInstruction);
        utterance.lang = 'id-ID';
        window.speechSynthesis.speak(utterance);
    }
}

function nextLevel() {
    if (currentQuizIndex < quizData.length - 1) {
        currentQuizIndex++;
        loadQuiz(currentQuizIndex);
    } else {
        alert("Alhamdulillah! Anda telah menyelesaikan seluruh sesi kuis kesiapan umroh.");
        currentQuizIndex = 0;
        showPage('home');
    }
}

// FITUR WEB SPEECH RECOGNITION (MIKROFON)
function startVoiceRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const statusText = document.getElementById('status');
    const feedbackText = document.getElementById('feedback');
    const btnNext = document.getElementById('btn-next');

    if (!SpeechRecognition) {
        alert("Browser Anda tidak mendukung pengenalan suara. Silakan gunakan Google Chrome.");
        return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'id-ID';
    recognition.interimResults = false;

    statusText.innerText = "Mendengarkan... Silakan bicara sekarang.";

    recognition.start();

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript.toLowerCase().trim();
        statusText.innerText = `Anda menyebutkan: "${transcript}"`;

        const correctAnswers = quizData[currentQuizIndex].answer;
        const isCorrect = correctAnswers.some(ans => transcript.includes(ans));

        if (isCorrect) {
            feedbackText.style.color = "#27ae60";
            feedbackText.innerText = "Masya Allah, jawaban Anda Benar! 🎉";
            btnNext.style.display = 'inline-block';
        } else {
            feedbackText.style.color = "#e74c3c";
            feedbackText.innerText = "Afwan (maaf), jawaban kurang tepat. Coba lagi ya!";
        }
    };

    recognition.onerror = function() {
        statusText.innerText = "Gagal mendengarkan. Silakan tekan tombol mic dan coba lagi.";
    };
}

// =========================================================
// INISIALISASI EVENT LISTENERS
// =========================================================

document.addEventListener('DOMContentLoaded', () => {
    // Jalankan halaman home secara default saat web pertama dibuka
    showPage('home');

    // Event click tombol mic
    const btnMic = document.getElementById('btn-mic');
    if (btnMic) {
        btnMic.addEventListener('click', startVoiceRecognition);
    }
});