let statusMisi = { misi1: false, misi2: false, misi3: false, misi4: false };
let musicPlaying = false;

// Kustomisasi Dialog Piko bertema Etnomatematika Banjar
const ucapanPiko = {
    start: "Selamat datang di Bumi Lambung Mangkurat! Amun sudah siap, yuk klik Misi 1 gasan memulai petualangan angka kita!",
    misi2Ready: "Bungasnya! Kamu dapet hadiah [🤠 Topi] di lemari! Yuk lanjut buka Misi 2, kita intip aktivitas Pasar Terapung! 🚣‍♂️",
    misi3Ready: "Luar biasa! Aksesoris [👓 Kacamata] tebuka! Sekarang kita nonton bioskop edukasi di Misi 3! 🎬",
    misi4Ready: "Satu langkah lagi wal! Aksesoris [👑 Mahkota] tebuka! Ayo uji wawasan wadai Banjar kita di Wordwall Misi 4! ⚔️",
    tamat: "KADADA TANDINGNYA! Kamu tamat 100% dan resmi jadi Jawara Matematika Banjar! Piko himung banar! 👑🏆"
};

// --- EFEK BURST PARTIKEL KLIK ---
window.addEventListener('click', function (e) {
    if(e.target.classList.contains('close-btn') || e.target.closest('.modal-content')) return;

    const colors = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ff4757', '#2ed573'];
    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.classList.add('click-particle');
        
        particle.style.left = `${e.pageX}px`;
        particle.style.top = `${e.pageY}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 40 + 20;
        particle.style.setProperty('--mx', `${Math.cos(angle) * velocity}px`);
        particle.style.setProperty('--my', `${Math.sin(angle) * velocity}px`);
        
        document.body.appendChild(particle);
        setTimeout(() => { particle.remove(); }, 600);
    }
});

// --- KONTROL MUSIK LATAR ---
function toggleMusik() {
    const music = document.getElementById("bg-music");
    const btn = document.getElementById("btn-music");
    
    if (!musicPlaying) {
        music.volume = 0.15;
        music.play().then(() => {
            musicPlaying = true;
            btn.innerHTML = "🔊 Musik On";
            btn.style.borderColor = "#10b981";
            btn.style.color = "#047857";
        }).catch(err => alert("Silakan klik sembarang area di layar terlebih dahulu, baru aktifkan musik!"));
    } else {
        music.pause();
        musicPlaying = false;
        btn.innerHTML = "🔇 Musik Off";
        btn.style.borderColor = "#cbd5e1";
        btn.style.color = "#4a5568";
    }
}

function playSound(id) {
    const sound = document.getElementById(id);
    sound.currentTime = 0;
    sound.play().catch(e => {});
}

// --- LOGIKA UTAMA MISI BERANTAI ---
function bukaMisi(modalId, nomorMisi) {
    playSound("sound-pop");
    document.getElementById(modalId).style.display = "flex";
    
    if (!statusMisi[`misi${nomorMisi}`]) {
        statusMisi[`misi${nomorMisi}`] = true;
        
        document.getElementById(`btn-misi${nomorMisi}`).classList.remove("pulse-active");
        
        const badge = document.getElementById(`badge-misi${nomorMisi}`);
        badge.innerHTML = "⭐";
        badge.classList.add("badge-clear");
        
        setTimeout(() => { playSound("sound-star"); }, 250);

        if (nomorMisi < 4) {
            const berikutnya = nomorMisi + 1;
            const btnBerikutnya = document.getElementById(`btn-misi${berikutnya}`);
            
            if(btnBerikutnya.classList.contains("locked")) {
                btnBerikutnya.classList.remove("locked");
                document.getElementById(`badge-misi${berikutnya}`).innerHTML = "🔓";
                btnBerikutnya.classList.add("pulse-active");
            }
        }
        
        updateSistemGame(nomorMisi);
    }
}

function selesaiMisiEmpat(event) {
    if(!statusMisi.misi1 || !statusMisi.misi2 || !statusMisi.misi3) {
        event.preventDefault();
        return;
    }
    if (!statusMisi.misi4) {
        statusMisi.misi4 = true;
        document.getElementById("btn-misi4").classList.remove("pulse-active");
        
        const badge = document.getElementById("badge-misi4");
        badge.innerHTML = "👑";
        badge.classList.add("badge-clear");
        
        playSound("sound-star");
        updateSistemGame(4);
    }
}

// --- UPDATE SKOR, BAR PROGRES, & LEMARI BAJU ---
function updateSistemGame(misiSelesaiBarusan) {
    let totalBintang = 0;
    if (statusMisi.misi1) totalBintang++;
    if (statusMisi.misi2) totalBintang++;
    if (statusMisi.misi3) totalBintang++;
    if (statusMisi.misi4) totalBintang++;

    document.getElementById("star-total").innerHTML = `⭐ ${totalBintang}/4`;

    let hasilPersen = (totalBintang / 4) * 100;
    const progressBar = document.getElementById("my-progress-bar");
    progressBar.style.width = `${hasilPersen}%`;
    progressBar.innerHTML = `${hasilPersen}%`;

    document.getElementById("wardrobe").style.display = "block";
    if(misiSelesaiBarusan === 1) document.getElementById("skin-topi").classList.remove("locked-skin");
    if(misiSelesaiBarusan === 2) document.getElementById("skin-kacamata").classList.remove("locked-skin");
    if(misiSelesaiBarusan === 3) document.getElementById("skin-mahkota").classList.remove("locked-skin");

    const pikoText = document.getElementById("piko-speech");
    if (totalBintang === 1) pikoText.innerHTML = ucapanPiko.misi2Ready;
    else if (totalBintang === 2) pikoText.innerHTML = ucapanPiko.misi3Ready;
    else if (totalBintang === 3) pikoText.innerHTML = ucapanPiko.misi4Ready;
    else if (totalBintang === 4) {
        pikoText.innerHTML = ucapanPiko.tamat;
        setTimeout(() => {
            playSound("sound-success");
            confetti({ particleCount: 160, spread: 90, origin: { y: 0.6 } });
        }, 500);
    }
}

// --- LEPAS PASANG AKSESORIS PIKO ---
function pakeAksesoris(emojiItem, slotId, btnId) {
    if(document.getElementById(btnId).classList.contains("locked-skin")) return;

    playSound("sound-dress");
    
    const slot = document.getElementById(slotId);
    const btn = document.getElementById(btnId);

    if(slot.innerHTML === emojiItem) {
        slot.innerHTML = "";
        btn.classList.remove("active-skin");
    } else {
        if(slotId === 'piko-hat') {
            document.getElementById("piko-hat").innerHTML = "";
            document.getElementById("skin-topi").classList.remove("active-skin");
            document.getElementById("skin-mahkota").classList.remove("active-skin");
        }

        slot.innerHTML = emojiItem;
        btn.classList.add("active-skin");
    }
}

function bukaMisiInfo(modalId) { 
    playSound("sound-pop"); 
    document.getElementById(modalId).style.display = "flex"; 
}

function tutupModal(modalId) {
    document.getElementById(modalId).style.display = "none";
    if(modalId === 'modal-video') {
        const iframe = document.querySelector('#modal-video iframe');
        iframe.src = iframe.src; 
    }
}

window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = "none";
            if(modal.id === 'modal-video') {
                const iframe = document.querySelector('#modal-video iframe');
                iframe.src = iframe.src;
            }
        }
    });
}