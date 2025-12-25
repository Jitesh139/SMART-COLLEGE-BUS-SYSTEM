/**
 * Antigravity Cursor Effect
 * Adds a connected particle network that reacts to mouse movement.
 */

(function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    // Style the canvas to be a background overlay
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.pointerEvents = 'none'; // Allow clicks to pass through
    canvas.style.zIndex = '0'; // Background layer
    // Actually, z-index -1 is safer for valid clicks, but if we want "sparkles" on top, we need high z-index with pointer-events: none.

    document.body.appendChild(canvas);

    let particles = [];
    const particleCount = 60; // Number of particles
    const connectionDistance = 150; // Distance to connect lines
    const mouseDistance = 200; // Distance for mouse interaction
    let w, h;

    const mouse = {
        x: null,
        y: null
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.x;
        mouse.y = e.y;
    });
    window.addEventListener('mouseout', () => {
        mouse.x = undefined;
        mouse.y = undefined;
    });

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 1; // Velocity X
            this.vy = (Math.random() - 0.5) * 1; // Velocity Y
            this.size = 2; // Particle size
            this.color = getComputedStyle(document.documentElement).getPropertyValue('--primary-color').trim() || '#1a73e8';
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;

            // Mouse interaction (Repel or Attract? Let's do a gentle attraction/connection)
            // Actually, just standard float is best, the lines do the work.
        }

        draw() {
            ctx.beginPath();
            ctx.globalAlpha = 0.6; // Semi-transparent particles
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.globalAlpha = 1.0; // Reset
        }
    }

    function init() {
        resize();
        particles = [];
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
        animate();
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        // Update and draw particles
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect to other particles
            for (let j = i; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    ctx.beginPath();
                    ctx.strokeStyle = particles[i].color; // Use particle color
                    ctx.lineWidth = 0.5;
                    ctx.globalAlpha = 1 - distance / connectionDistance; // Fade out based on distance
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                    ctx.globalAlpha = 1; // Reset alpha
                }
            }

            // Connect to mouse
            if (mouse.x != undefined && mouse.y != undefined) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    // Draw line to mouse
                    ctx.beginPath();
                    ctx.strokeStyle = particles[i].color;
                    ctx.lineWidth = 0.8;
                    ctx.globalAlpha = 1 - distance / mouseDistance;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                    ctx.globalAlpha = 1;

                    // Optional: Slight attraction to mouse for "Antigravity" feel
                    if (distance < mouseDistance) {
                        particles[i].vx += (mouse.x - particles[i].x) * 0.0001;
                        particles[i].vy += (mouse.y - particles[i].y) * 0.0001;
                    }
                }
            }
        }

        requestAnimationFrame(animate);
    }

    // Initialize after a slight delay to ensure CSS variables are loaded
    setTimeout(init, 100);

})();
