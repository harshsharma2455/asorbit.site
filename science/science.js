// science.js - Specific JavaScript for the science.html page

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle for science page
    const mobileMenuButtonScience = document.getElementById('mobile-menu-button-science');
    const mobileMenuScience = document.getElementById('mobile-menu-science');

    if (mobileMenuButtonScience && mobileMenuScience) {
        mobileMenuButtonScience.addEventListener('click', () => {
            mobileMenuScience.classList.toggle('hidden');
        });
        mobileMenuScience.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuScience.classList.add('hidden');
            });
        });
    } else {
        console.warn("Science page mobile menu elements not found.");
    }

    // Set current year in footer for science page
    const currentYearScienceEl = document.getElementById('currentYearScience');
    if (currentYearScienceEl) {
        currentYearScienceEl.textContent = new Date().getFullYear();
    }

    // Smooth scrolling for science page
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if (this.pathname === window.location.pathname && this.hash) {
                e.preventDefault();
                const targetId = this.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    const navbar = document.querySelector('nav');
                    const navbarHeight = navbar ? navbar.offsetHeight : 60;
                    const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                    const offsetPosition = elementPosition - navbarHeight;
                    window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                }
            }
        });
    });
    console.log("Science page DOMContentLoaded: Mobile menu, footer, and smooth scroll initialized.");
});

// --- Science Page 2D Canvas Particle Animation ---
window.addEventListener('load', () => {
    console.log("Science page window.load: Attempting to initialize 2D canvas animation.");

    const scienceHeroElement = document.getElementById('science-hero');
    const canvas = document.getElementById('science-hero-2d-canvas');

    if (!scienceHeroElement || !canvas) {
        console.error("Science hero element or 2D canvas not found for animation.");
        return;
    }

    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationFrameId = null;

    // Mouse position
    const mouse = {
        x: null,
        y: null,
        radius: 80 // Interaction radius
    };

    window.addEventListener('mousemove', (event) => {
        const rect = scienceHeroElement.getBoundingClientRect(); // Use hero element for relative mouse position
        mouse.x = event.clientX - rect.left;
        mouse.y = event.clientY - rect.top;
    });
    scienceHeroElement.addEventListener('mouseleave', () => { // Reset mouse when it leaves the hero area
        mouse.x = undefined;
        mouse.y = undefined;
    });


    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
            this.baseX = this.x; // For returning to original spot (optional)
            this.baseY = this.y; // For returning to original spot (optional)
            this.density = (Math.random() * 30) + 1; // For mouse interaction
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            // Mouse interaction
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            let forceDirectionX = dx / distance;
            let forceDirectionY = dy / distance;
            
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance; // normalized force
            
            let directionX = forceDirectionX * force * this.density * 0.6; // Slower push
            let directionY = forceDirectionY * force * this.density * 0.6;

            if (distance < mouse.radius && mouse.x !== undefined) {
                this.x -= directionX;
                this.y -= directionY;
            } else {
                // Gently return to original general flow or a more complex behavior
                // For simplicity, we'll just let them continue their original path
            }

            // Move particle
            this.x += this.directionX;
            this.y += this.directionY;

            // Bounce off edges
            if (this.x + this.size > canvas.width || this.x - this.size < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y + this.size > canvas.height || this.y - this.size < 0) {
                this.directionY = -this.directionY;
            }
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.min(100, Math.floor((canvas.width * canvas.height) / 10000)); // Adjust density
        const colors = ['#89f7fe', '#66a6ff', '#80ffdb', '#72efdd']; // Cool, science-y colors

        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 3) + 1; // Particle size
            let x = (Math.random() * (canvas.width - size * 2) + size);
            let y = (Math.random() * (canvas.height - size * 2) + size);
            let directionX = (Math.random() * 0.4) - 0.2; // Slow movement
            let directionY = (Math.random() * 0.4) - 0.2;
            let color = colors[Math.floor(Math.random() * colors.length)];
            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
        console.log(`[2D Canvas Init] Initialized ${particlesArray.length} particles.`);
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a + 1; b < particlesArray.length; b++) { // Start b from a+1 to avoid duplicates and self-connection
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx*dx + dy*dy);

                if (distance < 80) { // Connection distance
                    opacityValue = 1 - (distance / 80);
                    ctx.strokeStyle = `rgba(140, 200, 255, ${opacityValue * 0.3})`; // Light blue connections, adjust opacity
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles(); // Optional: for a plexus effect
    }

    function handleResize() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId); // Stop animation during resize
        }
        canvas.width = scienceHeroElement.clientWidth;
        canvas.height = scienceHeroElement.clientHeight;
        initParticles(); // Re-initialize particles for new canvas size
        animate(); // Restart animation
        console.log(`[2D Canvas Resize] Canvas resized to ${canvas.width}x${canvas.height}. Particles reinitialized.`);
    }
    
    // Initial setup
    canvas.width = scienceHeroElement.clientWidth;
    canvas.height = scienceHeroElement.clientHeight;
    if (canvas.width > 0 && canvas.height > 0) {
        initParticles();
        animate();
        window.addEventListener('resize', handleResize);
        console.log("[2D Canvas Init] Particle animation started.");
    } else {
        console.warn("[2D Canvas Init] Hero element has zero dimensions on load. Animation might not display correctly until resize.");
        // Fallback or listener for when size becomes available
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    if (particlesArray.length === 0) { // Only init if not already done
                         console.log("[2D Canvas Init] Hero element now has dimensions. Initializing animation.");
                         handleResize(); // Use handleResize to set up everything
                    }
                    resizeObserver.unobserve(scienceHeroElement); // Stop observing once sized
                }
            }
        });
        resizeObserver.observe(scienceHeroElement);
    }
});