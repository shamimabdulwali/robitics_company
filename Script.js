document.addEventListener('DOMContentLoaded', () => {

    /* --- 1. WEB AUDIO API SYNTHESIZER SOUND SYSTEM --- */
    let audioCtx = null;
    let audioEnabled = true;

    function initAudio() {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
    }

    function playCyberSound(freq = 800, type = 'sine', duration = 0.08) {
        if (!audioEnabled) return;
        initAudio();
        if (audioCtx.state === 'suspended') audioCtx.resume();

        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.05, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start();
        osc.stop(audioCtx.currentTime + duration);
    }

    const audioToggleBtn = document.getElementById('audioToggleBtn');
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            audioEnabled = !audioEnabled;
            audioToggleBtn.innerHTML = audioEnabled ? 
                '<i class="fa-solid fa-volume-high"></i> AUDIO SYNTH: ON' : 
                '<i class="fa-solid fa-volume-xmark"></i> AUDIO SYNTH: OFF';
            playCyberSound( audioEnabled ? 1200 : 300, 'square', 0.15 );
        });
    }

    /* --- 2. MULTI-LAYER ADVANCED 3D THREE.JS WEBGL SYSTEM --- */
    const container = document.getElementById('webgl-container');
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Dynamic 3D Cursor Point Light System
    const cursorPointLight = new THREE.PointLight(0x00f0ff, 3, 50);
    scene.add(cursorPointLight);

    const cursorPointLight2 = new THREE.PointLight(0xff007f, 2, 50);
    scene.add(cursorPointLight2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    // Group to hold all central 3D core meshes
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Central 3D Torus Knot Geometry
    const torusGeometry = new THREE.TorusKnotGeometry(8, 2.2, 120, 16);
    const torusMaterial = new THREE.MeshPhongMaterial({
        color: 0x00f0ff,
        emissive: 0x002244,
        wireframe: true,
        transparent: true,
        opacity: 0.6,
        shininess: 100
    });
    const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
    coreGroup.add(torusKnot);

    // 2. Outer Wireframe Sphere Grid
    const sphereGeometry = new THREE.SphereGeometry(14, 24, 24);
    const sphereMaterial = new THREE.MeshBasicMaterial({
        color: 0xff007f,
        wireframe: true,
        transparent: true,
        opacity: 0.15
    });
    const sphereWire = new THREE.Mesh(sphereGeometry, sphereMaterial);
    coreGroup.add(sphereWire);

    // 3. Dual Holographic Orbital Rings
    const ringGeo1 = new THREE.RingGeometry(18, 18.3, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({ color: 0x00f0ff, side: THREE.DoubleSide, transparent: true, opacity: 0.4 });
    const ring1 = new THREE.Mesh(ringGeo1, ringMat1);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ringGeo2 = new THREE.RingGeometry(21, 21.2, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({ color: 0xa855f7, side: THREE.DoubleSide, transparent: true, opacity: 0.3 });
    const ring2 = new THREE.Mesh(ringGeo2, ringMat2);
    ring2.rotation.y = Math.PI / 4;
    coreGroup.add(ring2);

    // 4. Volumetric 3D Particle Cloud Field (1,200 dynamic depth nodes)
    const particleCount = 1200;
    const particlesGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 120;
        positions[i + 1] = (Math.random() - 0.5) * 120;
        positions[i + 2] = (Math.random() - 0.5) * 120;
        scales[i / 3] = Math.random();
    }

    particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particlesMat = new THREE.PointsMaterial({
        color: 0x00f0ff,
        size: 0.6,
        transparent: true,
        opacity: 0.7,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particleSystem);

    // Interactive 3D Cursor Coordinate Syncing
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2) * 0.001;
        mouseY = (e.clientY - window.innerHeight / 2) * 0.001;

        // Project cursor position to 3D light vectors
        const vector = new THREE.Vector3(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY / window.innerHeight) * 2 + 1,
            0.5
        );
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));

        cursorPointLight.position.copy(pos);
        cursorPointLight2.position.set(-pos.x, -pos.y, pos.z);
    });

    // Main 3D Rendering & Animation Loop
    let clock = new THREE.Clock();

    function animate3D() {
        requestAnimationFrame(animate3D);
        const elapsedTime = clock.getElapsedTime();

        // Rotate central geometries
        torusKnot.rotation.x = elapsedTime * 0.4;
        torusKnot.rotation.y = elapsedTime * 0.2;

        sphereWire.rotation.y = -elapsedTime * 0.1;

        ring1.rotation.z = elapsedTime * 0.3;
        ring2.rotation.z = -elapsedTime * 0.2;

        particleSystem.rotation.y = elapsedTime * 0.05;

        // Reactive Mouse Smooth Parallax Interactivity
        targetX = mouseX * 25;
        targetY = -mouseY * 25;

        coreGroup.rotation.y += (mouseX * 2 - coreGroup.rotation.y) * 0.05;
        coreGroup.rotation.x += (-mouseY * 2 - coreGroup.rotation.x) * 0.05;

        camera.position.x += (targetX - camera.position.x) * 0.04;
        camera.position.y += (targetY - camera.position.y) * 0.04;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    }
    animate3D();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    /* --- 3. 3D CARD PARALLAX TILT EFFECT --- */
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            card.style.transform = `perspective(1000px) rotateX(${-y / 12}deg) rotateY(${x / 12}deg) translateY(-5px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)`;
        });
    });

    /* --- 4. MAGNETIC BUTTON ENGINE (PHYSICAL CURSOR ATTRACTION) --- */
    const magneticBtns = document.querySelectorAll('.btn-cyber, .nav-item, .social-btn');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const btnX = e.clientX - rect.left - rect.width / 2;
            const btnY = e.clientY - rect.top - rect.height / 2;

            btn.style.transform = `translate(${btnX * 0.35}px, ${btnY * 0.35}px) scale(1.05)`;
        });

        btn.addEventListener('mouseleave', () => {
            btn.style.transform = `translate(0px, 0px) scale(1)`;
        });
    });

    /* --- 5. BIOMETRIC CANVAS PARTICLE BURST SPARK ENGINE --- */
    const canvas = document.createElement('canvas');
    canvas.id = 'particle-spark-canvas';
    canvas.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;pointer-events:none;z-index:9999;';
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    let particles = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class SparkParticle {
        constructor(x, y) {
            this.x = x;
            this.y = y;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 8;
            this.speedY = (Math.random() - 0.5) * 8;
            this.color = Math.random() > 0.5 ? '#00f0ff' : '#ff007f';
            this.life = 1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.04;
        }

        draw() {
            ctx.save();
            ctx.globalAlpha = this.life;
            ctx.fillStyle = this.color;
            ctx.shadowBlur = 10;
            ctx.shadowColor = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        }
    }

    function triggerSparkBurst(x, y) {
        for (let i = 0; i < 12; i++) {
            particles.push(new SparkParticle(x, y));
        }
    }

    const sparkTargets = document.querySelectorAll('.futuristic-card, .btn-cyber, .team-card');
    sparkTargets.forEach(target => {
        target.addEventListener('mouseenter', (e) => {
            const rect = target.getBoundingClientRect();
            triggerSparkBurst(rect.left + rect.width / 2, rect.top + rect.height / 2);
        });
    });

    function renderParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].update();
            particles[i].draw();

            if (particles[i].life <= 0) {
                particles.splice(i, 1);
            }
        }
        requestAnimationFrame(renderParticles);
    }
    renderParticles();

    /* --- 6. MULTI-LAYER CURSOR & AUDIO LISTENERS --- */
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');
    const cursorLaser = document.querySelector('.cursor-laser');

    window.addEventListener('mousemove', (e) => {
        const x = e.clientX;
        const y = e.clientY;

        cursorDot.style.left = `${x}px`;
        cursorDot.style.top = `${y}px`;

        cursorLaser.style.left = `${x}px`;
        cursorLaser.style.top = `${y}px`;

        cursorOutline.animate({
            left: `${x}px`,
            top: `${y}px`
        }, { duration: 300, fill: "forwards" });
    });

    const interactiveElems = document.querySelectorAll('a, button, .futuristic-card, input');
    interactiveElems.forEach(elem => {
        elem.addEventListener('mouseenter', () => {
            playCyberSound(900, 'sine', 0.05);
            cursorOutline.style.width = '60px';
            cursorOutline.style.height = '60px';
        });

        elem.addEventListener('mouseleave', () => {
            cursorOutline.style.width = '36px';
            cursorOutline.style.height = '36px';
        });

        elem.addEventListener('click', () => {
            playCyberSound(1400, 'square', 0.08);
        });
    });

    /* --- 7. TAB NAVIGATION CONTROLLER --- */
    const navItems = document.querySelectorAll('.nav-item, .footer-link');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetTab = item.getAttribute('data-tab') || item.getAttribute('href').replace('#', '');

            if (document.getElementById(targetTab)) {
                e.preventDefault();

                document.querySelectorAll('.nav-item').forEach(nav => nav.classList.remove('active'));
                const activeNav = document.querySelector(`.nav-item[data-tab="${targetTab}"]`);
                if (activeNav) activeNav.classList.add('active');

                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === targetTab) {
                        content.classList.add('active');
                    }
                });

                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        });
    });

    /* --- 8. STATS NUMBER COUNTER ANIMATION --- */
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const updateCount = () => {
            const target = +counter.getAttribute('data-target');
            const count = +counter.innerText;
            const speed = target / 50;

            if (count < target) {
                counter.innerText = (count + speed).toFixed(2);
                setTimeout(updateCount, 30);
            } else {
                counter.innerText = target;
            }
        };
        updateCount();
    });

    /* --- 9. FORM SUBMISSION --- */
    const joinForm = document.getElementById('joinForm');
    if (joinForm) {
        joinForm.addEventListener('submit', (e) => {
            e.preventDefault();
            playCyberSound(1800, 'sawtooth', 0.2);
            alert('SYSTEM TRANSMISSION SUCCESSFUL // KEY ACCESS GRANTED.');
            joinForm.reset();
        });
    }
});