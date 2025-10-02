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
    const size = Math.random() * 20 + 20; // Size between 20 and 40
    const x = Math.random() * canvas.width;
    const y = -size;
    const speed = Math.random() * 2 + 1; // Speed between 1 and 3
    hearts.push(new Heart(x, y, size, speed));
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    hearts.forEach((heart, index) => {
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

    // Check if a heart was clicked
    hearts.forEach((heart, index) => {
        const distance = Math.sqrt(Math.pow(x - (heart.x + heart.size / 2), 2) + Math.pow(y - (heart.y + heart.size / 2), 2));
        if (distance < heart.size / 2) {
            hearts.splice(index, 1); // Remove the heart
            score++;
            scoreEl.textContent = `Score: ${score}`;
            
            // Check if goal is reached
            if (score >= goal) {
                window.location.href = 'letter.html'; // Redirect to the letter page
            }
        }
    });
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

animate();