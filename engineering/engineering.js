// engineering.js - Specific JavaScript for the engineering.html page

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle for eng page
    const mobileMenuButtonEng = document.getElementById('mobile-menu-button-eng');
    const mobileMenuEng = document.getElementById('mobile-menu-eng');

    if (mobileMenuButtonEng && mobileMenuEng) {
        mobileMenuButtonEng.addEventListener('click', () => {
            mobileMenuEng.classList.toggle('hidden');
        });
        mobileMenuEng.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuEng.classList.add('hidden');
            });
        });
    } else {
        console.warn("Engineering page mobile menu elements not found.");
    }

    // Set current year in footer for eng page
    const currentYearEngEl = document.getElementById('currentYearEng');
    if (currentYearEngEl) {
        currentYearEngEl.textContent = new Date().getFullYear();
    }
    console.log("Engineering page DOMContentLoaded: Mobile menu, footer year initialized.");
});

// --- Engineering Page "Rotating Gears" Canvas Animation ---
window.addEventListener('load', () => {
    console.log("Engineering page window.load: Attempting to initialize hero canvas animation.");

    const engHeroElement = document.getElementById('eng-hero');
    const canvas = document.getElementById('eng-hero-canvas');

    if (!engHeroElement || !canvas) {
        console.error("Engineering hero element or canvas not found for animation.");
        return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;

    function setCanvasDimensions() {
        canvas.width = engHeroElement.clientWidth;
        canvas.height = engHeroElement.clientHeight;
    }
    setCanvasDimensions();

    const gearColor = 'rgba(71, 85, 105, 0.7)'; // slate-500 with opacity
    const gearTeethColor = 'rgba(100, 116, 139, 0.7)'; // slate-400 with opacity
    const gears = [];
    const numGears = Math.min(20, Math.floor((canvas.width * canvas.height) / 25000)); // Adjust density


    class Gear {
        constructor(x, y, radius, teeth, speed, direction) {
            this.x = x;
            this.y = y;
            this.radius = radius; // Outer radius
            this.innerRadius = radius * 0.7; // Inner radius for the main body
            this.teeth = teeth;
            this.speed = speed; // Radians per frame
            this.direction = direction; // 1 for clockwise, -1 for counter-clockwise
            this.angle = Math.random() * Math.PI * 2; // Initial random angle
            this.toothHeight = radius * 0.15;
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);

            // Draw teeth
            ctx.beginPath();
            for (let i = 0; i < this.teeth; i++) {
                const angleStep = (Math.PI * 2) / this.teeth;
                const currentAngle = i * angleStep;
                
                ctx.moveTo(this.radius * Math.cos(currentAngle), this.radius * Math.sin(currentAngle));
                ctx.lineTo((this.radius + this.toothHeight) * Math.cos(currentAngle + angleStep / 3), (this.radius + this.toothHeight) * Math.sin(currentAngle + angleStep / 3));
                ctx.lineTo((this.radius + this.toothHeight) * Math.cos(currentAngle + (angleStep * 2) / 3), (this.radius + this.toothHeight) * Math.sin(currentAngle + (angleStep * 2) / 3));
                ctx.lineTo(this.radius * Math.cos(currentAngle + angleStep), this.radius * Math.sin(currentAngle + angleStep));
            }
            ctx.fillStyle = gearTeethColor;
            ctx.fill();
            
            // Draw main body
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2, false);
            ctx.fillStyle = gearColor;
            ctx.fill();

            // Draw inner hole (optional)
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2, false);
            ctx.fillStyle = engHeroElement.style.backgroundColor || '#0f172a'; // Match hero bg
            ctx.fill();
            
            ctx.restore();
        }

        update() {
            this.angle += this.speed * this.direction;
        }
    }

    function initGears() {
        gears.length = 0; // Clear existing gears
        for (let i = 0; i < numGears; i++) {
            const radius = Math.random() * 30 + 20; // Random radius (20-50)
            const x = Math.random() * (canvas.width - radius * 2) + radius;
            const y = Math.random() * (canvas.height - radius * 2) + radius;
            const teeth = Math.floor(radius / 3) + 5; // More teeth for larger gears
            const speed = (Math.random() * 0.01 + 0.002) * (Math.random() < 0.3 ? -1 : 1); // Random speed and initial direction
            const direction = Math.random() < 0.5 ? 1 : -1;
            gears.push(new Gear(x, y, radius, teeth, speed, direction));
        }
        console.log(`[Gears Init] Initialized ${gears.length} gears.`);
    }


    function animateGears() {
        animationFrameId = requestAnimationFrame(animateGears);
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        gears.forEach(gear => {
            gear.update();
            gear.draw();
        });
    }

    function handleResize() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        setCanvasDimensions();
        initGears();
        if (canvas.width > 0 && canvas.height > 0) {
            animateGears();
            console.log(`[Gears Canvas Resize] Canvas resized to ${canvas.width}x${canvas.height}. Gears animation (re)started.`);
        }
    }

    if (canvas.width > 0 && canvas.height > 0) {
        initGears();
        animateGears();
        window.addEventListener('resize', handleResize);
        console.log("[Gears Canvas Init] Gears animation started.");
    } else {
        console.warn("[Gears Canvas Init] Hero element has zero dimensions on load. Animation might not display correctly until resize.");
         const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    if (gears.length === 0) {
                         console.log("[Gears Canvas Init] Hero element now has dimensions. Initializing animation via resize handler.");
                         handleResize();
                    }
                    resizeObserver.unobserve(engHeroElement);
                }
            }
        });
        resizeObserver.observe(engHeroElement);
    }
});