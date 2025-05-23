// Mobile menu toggle
        const mobileMenuButton = document.getElementById('mobile-menu-button');
        const mobileMenu = document.getElementById('mobile-menu');
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.add('hidden');
            });
        });
        
        // Smooth scrolling (for within-page links if any)
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                // Prevent default if it's truly an internal link
                if (this.pathname === window.location.pathname && this.hash) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);

                    if (targetElement) {
                        const navbarHeight = document.querySelector('nav').offsetHeight || 60; 
                        const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                        const offsetPosition = elementPosition - navbarHeight;
                        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
                    }
                }
                // Allow default behavior for links to other pages (like index.html#...)
            });
        });

        document.getElementById('currentYear').textContent = new Date().getFullYear();

        // --- 3D Abstract Shapes Animation ---
        const heroHeader = document.getElementById('home');
        const canvas = document.getElementById('hero-3d-canvas');

        if (heroHeader && canvas && typeof THREE !== 'undefined') {
            console.log("[3D Init] Elements found. Initializing...");
            let scene, camera, renderer, shapesGroup;
            let mouseX = 0, mouseY = 0;

            function init3D() {
                console.log("[3D Init] init3D called.");
                scene = new THREE.Scene();

                const aspect = heroHeader.clientWidth / heroHeader.clientHeight;
                camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100); 
                camera.position.z = 5; 
                console.log("[3D Init] Camera created. Aspect:", aspect);

                try {
                    renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true }); 
                    renderer.setSize(heroHeader.clientWidth, heroHeader.clientHeight);
                    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
                    console.log("[3D Init] Renderer created.");
                } catch (e) {
                    console.error("[3D Init] Error creating WebGLRenderer:", e);
                    return; 
                }

                const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); 
                scene.add(ambientLight);
                const pointLight = new THREE.PointLight(0xffffff, 0.6, 100); 
                pointLight.position.set(5, 5, 5);
                scene.add(pointLight);
                console.log("[3D Init] Lights added.");

                shapesGroup = new THREE.Group();
                
                const shapeMaterial = new THREE.MeshStandardMaterial({
                    color: 0xadc9ff, 
                    metalness: 0.1,
                    roughness: 0.6,
                    transparent: true,
                    opacity: 0.85
                });

                const geometry1 = new THREE.TorusKnotGeometry(0.8, 0.25, 100, 16); 
                const shape1 = new THREE.Mesh(geometry1, shapeMaterial);
                shape1.position.set(-1, 0.5, 0);
                shapesGroup.add(shape1);

                const geometry2 = new THREE.SphereGeometry(0.5, 32, 32); 
                const shape2 = new THREE.Mesh(geometry2, shapeMaterial.clone()); 
                shape2.position.set(1.5, -0.3, -1);
                shapesGroup.add(shape2);
                
                const geometry3 = new THREE.IcosahedronGeometry(0.6, 0); 
                const shape3 = new THREE.Mesh(geometry3, shapeMaterial.clone());
                shape3.position.set(0, -0.8, 1);
                shapesGroup.add(shape3);

                scene.add(shapesGroup);
                console.log("[3D Init] Shapes created and added.");

                heroHeader.addEventListener('mousemove', onMouseMove, false);
                window.addEventListener('resize', onWindowResize, false);
                console.log("[3D Init] Event listeners added.");
                
                animate3D(); 
                console.log("[3D Init] Animation loop started.");
            }

            function onWindowResize() {
                if (!renderer || !camera || !heroHeader) return;
                console.log("[3D Resize] Resizing...");
                camera.aspect = heroHeader.clientWidth / heroHeader.clientHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(heroHeader.clientWidth, heroHeader.clientHeight);
                renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }

            function onMouseMove(event) {
                if (!heroHeader) return;
                const rect = heroHeader.getBoundingClientRect();
                mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouseY = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
            }
            
            let clock = new THREE.Clock(); 

            function animate3D() {
                if (!scene || !camera || !renderer || !shapesGroup) {
                    console.warn("[3D Animate] Missing essential objects. Halting.");
                    return; 
                }
                requestAnimationFrame(animate3D);

                const elapsedTime = clock.getElapsedTime();

                shapesGroup.rotation.y = elapsedTime * 0.1;
                shapesGroup.rotation.x = elapsedTime * 0.05;

                camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02; 
                camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.02;
                camera.lookAt(scene.position); 

                try {
                    renderer.render(scene, camera);
                } catch (e) {
                    console.error("[3D Animate] Error during rendering:", e);
                }
            }
            
            // --- Initialization Trigger ---
             window.addEventListener('load', () => {
                 console.log("[3D Init Trigger] Window loaded. Calling init3D.");
                 if (!scene) { 
                    init3D(); 
                 }
            });
            if (document.readyState === 'complete') {
                 console.log("[3D Init Trigger] Document already complete. Calling init3D (fallback).");
                 if (!scene) { 
                    init3D(); 
                 }
            }

        } else {
            console.warn("Three.js library or hero/canvas elements not found. 3D animation disabled.");
            if (typeof THREE === 'undefined') console.error("THREE is undefined!");
            if (!heroHeader) console.error("heroHeader element not found!");
            if (!canvas) console.error("hero-3d-canvas element not found!");
        }