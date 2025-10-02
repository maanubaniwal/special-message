// Check which page we're on
const isIndexPage = document.getElementById('hearts-canvas') !== null;
const isLetterPage = document.getElementById('our-song-container') !== null; // Note: this ID is no longer used, but logic is kept for structure

// Global variable to hold the audio object
let song = null;

if (isIndexPage) {
    // --- CODE FOR THE HEARTS GAME (index.html) ---
    const canvas = document.getElementById('hearts-canvas');
    const ctx = canvas.getContext('2d');
    const scoreEl = document.getElementById('score');

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let hearts = [];
    let score = 0;
    const goal = 10;

    function Heart(x, y, size, speed) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speed = speed;
    }

    Heart.prototype.draw = function() {
        ctx.fillStyle = 'red';
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.size / 4);
        ctx.quadraticCurveTo(this.x, this.y, this.x + this.size / 4, this.y);
        ctx.quadraticCurveTo(this.x + this.size / 2, this.y, this.x + this.size / 2, this.y + this.size / 4);
        ctx.quadraticCurveTo(this.x + this.size / 2, this.y, this.x + (this.size * 3) / 4, this.y);
        ctx.quadraticCurveTo(this.x + this.size, this.y, this.x + this.size, this.y + this.size / 4);
        ctx.quadraticCurveTo(this.x + this.size, this.y + this.size / 2, this.x + (this.size * 3) / 4, this.y + (this.size * 3) / 4);
        ctx.lineTo(this.x + this.size / 2, this.y + this.size);
        ctx.lineTo(this.x + this.size / 4, this.y + (this.size * 3) / 4);
        ctx.quadraticCurveTo(this.x, this.y + this.size / 2, this.x, this.y + this.size / 4);
        ctx.fill();
    };

    Heart.prototype.update = function() {
        this.y += this.speed;
        if (this.y > canvas.height) {
            this.y = -this.size;
            this.x = Math.random() * canvas.width;
        }
    };

    function createHeart() {
        const size = Math.random() * 20 + 20;
        const x = Math.random() * canvas.width;
        const y = -size;
        const speed = Math.random() * 2 + 1;
        hearts.push(new Heart(x, y, size, speed));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        hearts.forEach((heart) => {
            heart.update();
            heart.draw();
        });
        requestAnimationFrame(animate);
    }

    setInterval(createHeart, 300);

    canvas.addEventListener('click', (event) => {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        hearts.forEach((heart, index) => {
            const distance = Math.sqrt(Math.pow(x - (heart.x + heart.size / 2), 2) + Math.pow(y - (heart.y + heart.size / 2), 2));
            if (distance < heart.size / 2) {
                hearts.splice(index, 1);
                score++;
                scoreEl.textContent = `Score: ${score}`;
                if (score >= goal) {
                    showModal();
                }
            }
        });
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    function showModal() {
        fetch('letter.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const letterBox = doc.querySelector('.message-box.letter');
                
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'modal-overlay';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                modalContent.innerHTML = letterBox.innerHTML;
                
                const closeModalBtn = document.createElement('button');
                closeModalBtn.id = 'close-modal-btn';
                closeModalBtn.textContent = 'Close';
                
                modalContent.appendChild(closeModalBtn);
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);
                
                modalOverlay.style.display = 'flex';
                
                setupModalEventListeners();

                closeModalBtn.addEventListener('click', () => {
                    if (song) {
                        song.pause();
                        song = null; // Clean up the song object
                    }
                    modalOverlay.remove();
                });
            });
    }

    function setupModalEventListeners() {
        const playBtn = document.getElementById('play-music-btn');

        if (playBtn) {
            playBtn.addEventListener('click', () => {
                // If the song hasn't been created yet, create it
                if (!song) {
                    song = new Audio('breathless.mp3');
                    song.loop = true;
                    song.currentTime = 1:05;
                }
                
                // Play or pause the song
                if (song.paused) {
                    song.play();
                    playBtn.textContent = '⏸️ Pause Song';
                } else {
                    song.pause();
                    playBtn.textContent = '▶️ Play Our Song';
                }
            });
        }
    }
    
    animate();

}


