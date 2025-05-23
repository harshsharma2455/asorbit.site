// maths.js - Specific JavaScript for the maths.html page

document.addEventListener('DOMContentLoaded', () => {
    // Mobile menu toggle for maths page
    const mobileMenuButtonMaths = document.getElementById('mobile-menu-button-maths');
    const mobileMenuMaths = document.getElementById('mobile-menu-maths');

    if (mobileMenuButtonMaths && mobileMenuMaths) {
        mobileMenuButtonMaths.addEventListener('click', () => {
            mobileMenuMaths.classList.toggle('hidden');
        });
        mobileMenuMaths.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuMaths.classList.add('hidden'); // Hide menu on link click
            });
        });
    } else {
        console.warn("Maths page mobile menu elements not found.");
    }

    // Set current year in footer for maths page
    const currentYearMathsEl = document.getElementById('currentYearMaths');
    if (currentYearMathsEl) {
        currentYearMathsEl.textContent = new Date().getFullYear();
    }

    // Smooth scrolling for maths page (inherited from main script.js if #links are internal to maths.html)
    // If links point to index.html#section, main script.js should handle it.
    // If this page has its own internal #links, uncomment and adapt the smooth scroll logic from main script.
    console.log("Maths page DOMContentLoaded: Mobile menu, footer year initialized.");
});

// --- Maths Page Canvas Animation: Graphs and Functions ---
window.addEventListener('load', () => {
    console.log("Maths page window.load: Attempting to initialize hero canvas animation.");

    const mathsHeroElement = document.getElementById('maths-hero');
    const canvas = document.getElementById('maths-hero-canvas');

    if (!mathsHeroElement || !canvas) {
        console.error("Maths hero element or canvas not found for animation.");
        return;
    }

    const ctx = canvas.getContext('2d');
    let animationFrameId = null;
    let functions = [];
    const functionColors = ['rgba(79, 70, 229, 0.7)', 'rgba(124, 58, 237, 0.7)', 'rgba(168, 85, 247, 0.7)', 'rgba(29, 78, 216, 0.7)'];
    let time = 0;

    function setCanvasDimensions() {
        canvas.width = mathsHeroElement.clientWidth;
        canvas.height = mathsHeroElement.clientHeight;
    }
    setCanvasDimensions();

    // Define some mathematical functions
    // These will be drawn from x = 0 to canvas.width
    // y will be scaled and offset to fit canvas.height
    const mathFunctions = [
        { func: (x, t) => Math.sin(x * 0.02 + t * 0.05) * (canvas.height / 6) + Math.cos(x * 0.03 - t*0.03) * (canvas.height / 8) , name: 'sineWaveCombo' },
        { func: (x, t) => Math.tan(x * 0.01 + t * 0.02) * 10, name: 'tanWave', clip: true }, // tan can go to infinity, needs clipping/scaling
        { func: (x, t) => (x * 0.05 - canvas.width *0.05 /2 )**2 * 0.01 - canvas.height/4 + Math.sin(t*0.1)*20, name: 'parabola' },
        { func: (x, t) => Math.log(x * 0.1 + 1 + Math.abs(Math.sin(t*0.05)*10) ) * 30 , name: 'logCurve'},
        { func: (x, t) => Math.random() * 10 - 5 + Math.sin(x * 0.03 + t * 0.06) * (canvas.height / 10), name: 'noisySine' }
    ];

    function initializeFunctions() {
        functions = [];
        const numFunctions = Math.min(4, mathFunctions.length); // Draw up to 4 functions

        for (let i = 0; i < numFunctions; i++) {
            const funcIndex = Math.floor(Math.random() * mathFunctions.length);
            const selectedFunc = mathFunctions[funcIndex];
            
            // Avoid duplicates if possible (simple check)
            if (functions.find(f => f.name === selectedFunc.name)) {
                 if (functions.length < mathFunctions.length) i--; // try again if we have more unique functions
                 continue;
            }

            functions.push({
                func: selectedFunc.func,
                name: selectedFunc.name,
                clip: selectedFunc.clip || false,
                color: functionColors[i % functionColors.length],
                lineWidth: Math.random() * 1.5 + 1, // 1 to 2.5
                startX: Math.random() * (canvas.width / 2), // Start drawing from a random x
                speed: Math.random() * 0.5 + 0.2 // How fast the drawing "progresses"
            });
        }
        console.log(`[Maths Canvas Init] Initialized ${functions.length} functions.`);
    }

    function drawGrid() {
        const gridSize = 50;
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(199, 210, 254, 0.3)'; // Light indigo grid
        ctx.lineWidth = 0.5;

        for (let x = 0; x <= canvas.width; x += gridSize) {
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
        }
        for (let y = 0; y <= canvas.height; y += gridSize) {
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
        }
        ctx.stroke();
    }

    function drawFunctions() {
        time += 0.01; // Increment time for animation

        functions.forEach(f_obj => {
            ctx.beginPath();
            ctx.strokeStyle = f_obj.color;
            ctx.lineWidth = f_obj.lineWidth;
            let firstPoint = true;

            for (let x = 0; x < canvas.width; x += 2) { // Plot points every 2 pixels for performance
                // Apply function and scale/offset y to be in the middle of the canvas
                let y_raw = f_obj.func(x, time);
                let y = canvas.height / 2 - y_raw; // Center around vertical middle

                if (f_obj.clip) { // Basic clipping for functions like tan
                    if (y < 0 || y > canvas.height || Math.abs(y_raw) > canvas.height * 2) { // If y is way off, break path
                        if (!firstPoint) ctx.stroke(); // Draw what we have so far
                        ctx.beginPath();             // Start a new path segment
                        firstPoint = true;
                        continue;
                    }
                }
                
                if (firstPoint) {
                    ctx.moveTo(x, y);
                    firstPoint = false;
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.stroke();
        });
    }
    
    let lastFrameTime = 0;
    const fps = 20; // Control the animation framerate
    const frameInterval = 1000 / fps;

    function animate(currentTime) {
        animationFrameId = requestAnimationFrame(animate);
        const elapsed = currentTime - lastFrameTime;

        if (elapsed > frameInterval) {
            lastFrameTime = currentTime - (elapsed % frameInterval);
            
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            drawGrid();
            drawFunctions();
        }
    }

    function handleResize() {
        if (animationFrameId) {
            cancelAnimationFrame(animationFrameId);
        }
        setCanvasDimensions();
        initializeFunctions(); // Re-initialize based on new dimensions if needed
        if (canvas.width > 0 && canvas.height > 0) {
            animate(0); // Restart animation
            console.log(`[Maths Canvas Resize] Canvas resized to ${canvas.width}x${canvas.height}. Functions animation (re)started.`);
        }
    }

    // Initial setup
    if (canvas.width > 0 && canvas.height > 0) {
        initializeFunctions();
        animate(0);
        window.addEventListener('resize', handleResize);
        console.log("[Maths Canvas Init] Functions animation started.");
    } else {
        console.warn("[Maths Canvas Init] Hero element has zero dimensions on load. Animation might not display correctly until resize.");
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
                    if (functions.length === 0) {
                         console.log("[Maths Canvas Init] Hero element now has dimensions. Initializing animation via resize handler.");
                         handleResize();
                    }
                    resizeObserver.unobserve(mathsHeroElement);
                }
            }
        });
        resizeObserver.observe(mathsHeroElement);
    }
});