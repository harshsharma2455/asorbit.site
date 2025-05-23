// technology.js - Specific JavaScript for the technology.html page

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle for tech page
    const mobileMenuButtonTech = document.getElementById('mobile-menu-button-tech');
    const mobileMenuTech = document.getElementById('mobile-menu-tech');

    if (mobileMenuButtonTech && mobileMenuTech) {
        mobileMenuButtonTech.addEventListener('click', () => {
            mobileMenuTech.classList.toggle('hidden');
        });
        mobileMenuTech.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuTech.classList.add('hidden');
            });
        });
    } else {
        console.warn("Technology page mobile menu elements not found.");
    }

    // Set current year in footer for tech page
    const currentYearTechEl = document.getElementById('currentYearTech');
    if (currentYearTechEl) {
        currentYearTechEl.textContent = new Date().getFullYear();
    }

    // Smooth scrolling for tech page (if any #links are present)
    // This might be inherited from the main script.js if that script is global
    // and handles all anchor links. If not, you can duplicate the smooth scroll
    // logic from your main script.js or science.js here, targeting local anchors.
    console.log("Technology page DOMContentLoaded: Mobile menu, footer year initialized.");
});

// --- Tech Page "Matrix-style" Canvas Animation ---
window.addEventListener('load', () => {
    console.log("Technology page window.load: Attempting to initialize hero canvas animation.");

    const techHeroElement = document.getElementById('tech-hero');
    const canvas = document.getElementById('tech-hero-canvas');

    if (!techHeroElement || !canvas) {
        console.error("Tech hero element or canvas not found for animation.");
        return;
    }

    const ctx = canvas.getContext('2d');

    let animationFrameId = null;

    // Setting the canvas dimensions
    function setCanvasDimensions() {
        canvas.width = techHeroElement.clientWidth;
        canvas.height = techHeroElement.clientHeight;
    }
    setCanvasDimensions();

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
    const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const nums = '0123456789';
    const characters = katakana + latin + nums + 'PYTHONJAVASCRIPTHTMLCSSSQLGITDOCKERAI'; // Add more tech terms

    const fontSize = 16;
    let columns;
    let drops = []; // Stores the y-position of the last character for each column

    function initializeDrops() {
        columns = Math.floor(canvas.width / fontSize);
        drops = [];
        for (let x = 0; x < columns; x++) {
            drops[x] = 1 + Math.floor(Math.random() * (canvas.height / fontSize)); // Random start
        }
    }
    initializeDrops();


    function drawMatrix() {
        // Semi-transparent black background to create fading trail
        ctx.fillStyle = 'rgba(1, 4, 9, 0.1)'; // Corresponds to bg-almost-black with low opacity
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = '#3fb950'; // Green characters (Tailwind green-500 approx)
        ctx.font = fontSize + 'px "Fira Code", monospace';

        for (let i = 0; i < drops.length; i++) {
            const text = characters.charAt(Math.floor(Math.random() * characters.length));
            ctx.fillText(text, i * fontSize, drops[i] * fontSize);

            // Randomly reset drop to top if it's off screen or based on a random chance
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                drops[i] = 0;
            }
            drops[i]++;
        }
    }

    let lastTime = 0;
    const fps = 20; // Control the speed of the animation
    const interval = 1000 / fps;

    function animateMatrix(timestamp) {
        animationFrameId = requestAnimationFrame(animateMatrix);
        const deltaTime = timestamp - lastTime;

        if (deltaTime > interval) {
            lastTime = timestamp - (deltaTime % interval);
            drawMatrix();
        }
    }

    function handleResize() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        setCanvasDimensions();
        initializeDrops();
        if (canvas.width > 0 && canvas.height > 0) {
            animateMatrix(0); // Restart animation
             console.log(`[Tech Canvas Resize] Canvas resized to ${canvas.width}x${canvas.height}. Matrix animation (re)started.`);
        }
    }

    if (canvas.width > 0 && canvas.height > 0) {
        animateMatrix(0);
        window.addEventListener('resize', handleResize);
        console.log("[Tech Canvas Init] Matrix animation started.");
    } else {
        console.warn("[Tech Canvas Init] Hero element has zero dimensions on load. Animation might not display correctly until resize.");
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    if (drops.length === 0) {
                         console.log("[Tech Canvas Init] Hero element now has dimensions. Initializing animation via resize handler.");
                         handleResize();
                    }
                    resizeObserver.unobserve(techHeroElement);
                }
            }
        });
        resizeObserver.observe(techHeroElement);
    }
});