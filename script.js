// Check which page we're on
const isIndexPage = document.getElementById('hearts-canvas') !== null;
const isLetterPage = document.getElementById('our-song') !== null;

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

    // Generate hearts periodically
    setInterval(createHeart, 300);

    // Game Logic: Catching hearts
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
                    // When goal is reached, show the modal instead of changing page
                    showModal();
                }
            }
        });
    });

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });

    // --- NEW MODAL CODE (index.html) ---
    function showModal() {
        // Fetch the content from letter.html
        fetch('letter.html')
            .then(response => response.text())
            .then(html => {
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html');
                const letterContent = doc.querySelector('.message-box.letter').innerHTML;
                
                // Create modal elements
                const modalOverlay = document.createElement('div');
                modalOverlay.className = 'modal-overlay';
                
                const modalContent = document.createElement('div');
                modalContent.className = 'modal-content';
                modalContent.innerHTML = letterContent;
                
                const closeModalBtn = document.createElement('button');
                closeModalBtn.id = 'close-modal-btn';
                closeModalBtn.textContent = 'Close';
                
                modalContent.appendChild(closeModalBtn);
                modalOverlay.appendChild(modalContent);
                document.body.appendChild(modalOverlay);
                
                // Show the modal
                modalOverlay.style.display = 'flex';
                
                // Add event listeners for the new content inside the modal
                setupModalEventListeners();

                // Close modal button
                closeModalBtn.addEventListener('click', () => {
                    modalOverlay.remove();
                });
            });
    }

    // Function to handle events inside the loaded modal
    function setupModalEventListeners() {
        const playBtn = document.getElementById('play-music-btn');
        const song = document.getElementById('our-song');

        if(playBtn && song) {
            playBtn.addEventListener('click', () => {
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

} else if (isLetterPage) {
    // --- CODE FOR THE MUSIC BUTTON (letter.html) ---
    const playBtn = document.getElementById('play-music-btn');
    const song = document.getElementById('our-song');

    playBtn.addEventListener('click', () => {
        if (song.paused) {
            song.play();
            playBtn.textContent = '⏸️ Pause Song';
        } else {
            song.pause();
            playBtn.textContent = '▶️ Play Our Song';
        }
    });
}
    canvas.height = window.innerHeight;
});


animate();
