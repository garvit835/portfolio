/* =========================================
   GARVIT RANKA | GSAP ANIMATIONS & LOGIC
   ========================================= */

// Register GSAP Plugins
gsap.registerPlugin(ScrollTrigger);

// =========================================
// 1. Preloader / Terminal Typing
// =========================================
const terminalText = "Initializing cybersecurity protocols...\nConnecting to garvit835 network...\nBypass successful.\nWelcome to the secure server.";
const typeWriterElem = document.getElementById('typewriter-text');
let typingStarted = false;

window.addEventListener('load', () => {
  if (!typingStarted && typeWriterElem) {
    typingStarted = true;
    let i = 0;
    typeWriterElem.innerHTML = '';

    function typeWriter() {
      if (i < terminalText.length) {
        if (terminalText.charAt(i) === '\n') {
          typeWriterElem.innerHTML += '<br>';
        } else {
          typeWriterElem.innerHTML += terminalText.charAt(i);
        }
        i++;
        setTimeout(typeWriter, 30); // typing speed
      } else {
        // Hide terminal cursor after typing
        const mainCursor = document.getElementById('terminal-cursor-main');
        if (mainCursor) mainCursor.style.display = 'none';

        // Show audio prompt
        const promptLine = document.getElementById('preloader-prompt');
        const promptInput = document.getElementById('preloader-input');
        if (promptLine && promptInput) {
          promptLine.style.display = 'flex';
          promptInput.focus();

          promptInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
              const choice = promptInput.value.toLowerCase();
              if (choice === 'y') {
                isMuted = false;
                isMediaPausedManually = false;
                bgAudio.currentTime = 0;
                bgAudio.play().catch(e => { });
                updateSoundUI();
                updateMediaUI();
                exitPreloader();
              } else if (choice === 'n') {
                isMuted = true;
                updateSoundUI();
                updateMediaUI();
                exitPreloader();
              }
            }
          });
        } else {
          setTimeout(exitPreloader, 500);
        }
      }
    }
    typeWriter();
  } else {
    exitPreloader();
  }
});

function exitPreloader() {
  const tl = gsap.timeline();
  tl.to('#preloader', {
    yPercent: -100,
    duration: 0.8,
    ease: 'expo.inOut'
  })
    .from('.hero .split-text', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out'
    }, '-=0.4')
    .from('.hero .fade-up', {
      y: 20,
      opacity: 0,
      duration: 0.6,
      stagger: 0.15,
      onComplete: () => {
        document.querySelector('.sound-controls')?.classList.add('visible');
        loadVideo();
        heroType();
      }
    }, '-=0.5');
}

// =========================================
// 2. Custom Cursor & Magnetic Effect
// =========================================
const cursor = document.querySelector('.cursor');
const follower = document.querySelector('.cursor-follower');
const magnetics = document.querySelectorAll('.magnetic');

let mouseX = 0, mouseY = 0;
let cursorX = 0, cursorY = 0;
let followerX = 0, followerY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Render cursor
gsap.ticker.add(() => {
  // Main cursor immediate
  cursorX += (mouseX - cursorX) * 0.5;
  cursorY += (mouseY - cursorY) * 0.5;
  gsap.set(cursor, { x: cursorX, y: cursorY });

  // Follower delayed
  followerX += (mouseX - followerX) * 0.15;
  followerY += (mouseY - followerY) * 0.15;
  gsap.set(follower, { x: followerX, y: followerY });
});

// Magnetic + Cursor: delegated so it works on dynamic elements (modal, skill tags, etc.)
const interactiveSelector = '.magnetic, .skill-tag, .cert-company-card, .modal-close, .tech-tags span, .sound-toggle, button, a, .glass-btn';

document.addEventListener('mousemove', (e) => {
  const el = e.target.closest(interactiveSelector);
  if (el) {
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.3, ease: 'power2.out' });
    cursor.classList.add('active');
    follower.classList.add('active');
  }
});

document.addEventListener('mouseleave', (e) => {
  const el = e.target.closest(interactiveSelector);
  if (el) {
    gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    cursor.classList.remove('active');
    follower.classList.remove('active');
  }
}, true);

// Keep static magnetic buttons working too for non-delegated cases
magnetics.forEach(btn => {
  btn.addEventListener('mouseleave', function () {
    gsap.to(this, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.3)' });
    cursor.classList.remove('active');
    follower.classList.remove('active');
  });
});

// =========================================
// 3. Play Video Only On Scroll (lazy + manual pause aware)
// =========================================
let isScrolling;
const scrollVideo = document.getElementById('scroll-video');

// Lazy-load the video after preloader exits (called from exitPreloader)
function loadVideo() {
  if (scrollVideo && scrollVideo.dataset.src) {
    scrollVideo.src = scrollVideo.dataset.src;
    scrollVideo.load();
  }
}

window.addEventListener('scroll', () => {
  if (isMediaPausedManually || !scrollVideo) return;
  window.clearTimeout(isScrolling);
  if (scrollVideo.paused) {
    scrollVideo.play().catch(e => { });
  }
  isScrolling = setTimeout(() => {
    scrollVideo.pause();
  }, 150);
});

// =========================================
// 3a. Matrix Rain Canvas
// =========================================
const matrixCanvas = document.getElementById('matrix-canvas');
const ctx = matrixCanvas.getContext('2d');
const matrixChars = 'アイウエオカキクケコサシスセソタチツテト0123456789ABCDEF</>{}[]';

let matrixCols, drops;

function initMatrix() {
  matrixCanvas.width = window.innerWidth;
  matrixCanvas.height = window.innerHeight;
  matrixCols = Math.floor(window.innerWidth / 18);
  drops = Array(matrixCols).fill(1);
}

function drawMatrix() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
  ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
  ctx.fillStyle = '#00f0ff';
  ctx.font = '13px monospace';
  for (let i = 0; i < drops.length; i++) {
    const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
    ctx.fillStyle = drops[i] * 18 < matrixCanvas.height * 0.2 ? '#ffffff' : '#00f0ff';
    ctx.globalAlpha = Math.random() * 0.5 + 0.3;
    ctx.fillText(char, i * 18, drops[i] * 18);
    ctx.globalAlpha = 1;
    if (drops[i] * 18 > matrixCanvas.height && Math.random() > 0.975) {
      drops[i] = 0;
    }
    drops[i]++;
  }
}

initMatrix();
window.addEventListener('resize', initMatrix);
setInterval(drawMatrix, 50);

// =========================================
// 3b. Hero Typewriter Effect
// =========================================
const heroTypewriter = document.getElementById('hero-typewriter');
const heroTypePhrases = [
  'Breaking, building, securing.',
  'Full-stack developer.',
  'Cloud architect in the making.',
  'Exploring vulnerabilities.',
  'Shipping production-grade apps.',
  'Securing systems at scale.',
  'From frontend to firewall.',
  'Hacking the future.',
];
let heroPhraseIndex = 0, heroCharIndex = 0, heroDeleting = false;

function heroType() {
  if (!heroTypewriter) return;
  const phrase = heroTypePhrases[heroPhraseIndex];
  if (!heroDeleting) {
    heroTypewriter.textContent = phrase.slice(0, ++heroCharIndex);
    if (heroCharIndex === phrase.length) {
      heroDeleting = true;
      setTimeout(heroType, 2200);
      return;
    }
  } else {
    heroTypewriter.textContent = phrase.slice(0, --heroCharIndex);
    if (heroCharIndex === 0) {
      heroDeleting = false;
      heroPhraseIndex = (heroPhraseIndex + 1) % heroTypePhrases.length;
    }
  }
  setTimeout(heroType, heroDeleting ? 45 : 80);
}

// Started in exitPreloader after hero appears

// =========================================
// 3c. Active Nav Highlight on Scroll
// =========================================
const navSections = ['about', 'projects', 'skills', 'contact'];

navSections.forEach(id => {
  ScrollTrigger.create({
    trigger: `#${id}`,
    start: 'top center',
    end: 'bottom center',
    onEnter: () => setActiveNav(id),
    onEnterBack: () => setActiveNav(id),
  });
});

function setActiveNav(id) {
  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('nav-active'));
  const activeLink = document.getElementById(`nav-${id}`);
  if (activeLink) activeLink.classList.add('nav-active');
}


// =========================================
// 4. Section & Text Reveals
// =========================================
const fadeUps = document.querySelectorAll('section:not(.hero) .fade-up');

fadeUps.forEach(elem => {
  gsap.fromTo(elem,
    {
      y: 50,
      opacity: 0
    },
    {
      y: 0,
      opacity: 1,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: elem,
        start: 'top 85%',
        toggleActions: 'play none none reverse'
      }
    }
  );
});

// Navbar glass effect & hide/show on scroll
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
let lastNavScrollY = window.scrollY;

function closeMobileMenu() {
  if (window.innerWidth <= 768 && navLinks && navLinks.style.display === 'flex') {
    navLinks.style.display = 'none';
  }
}

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;

  // Close mobile menu on scroll
  closeMobileMenu();

  // Glass effect
  if (currentScrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Hide on scroll down, show on scroll up
  if (currentScrollY > lastNavScrollY && currentScrollY > 150) {
    // Scrolling down & past top -> hide
    navbar.style.transform = 'translateY(-100%)';
  } else {
    // Scrolling up or at top -> show
    navbar.style.transform = 'translateY(0)';
  }

  lastNavScrollY = currentScrollY;
});

// Mobile Hamburger toggle (simple)
if (hamburger) {
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent document click from triggering immediately
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    if (navLinks.style.display === 'flex') {
      navLinks.style.flexDirection = 'column';
      navLinks.style.position = 'absolute';
      navLinks.style.top = '100%';
      navLinks.style.left = '0';
      navLinks.style.width = '100%';
      navLinks.style.background = 'rgba(5, 5, 5, 0.95)';
      navLinks.style.padding = '2rem';
      navLinks.style.backdropFilter = 'blur(10px)';
    }
  });
}

// Close mobile menu if clicked outside
document.addEventListener('click', (e) => {
  if (window.innerWidth <= 768 && navLinks && navLinks.style.display === 'flex') {
    if (!navbar.contains(e.target)) {
      closeMobileMenu();
    }
  }
});

// Clear mobile styles on resize to desktop
window.addEventListener('resize', () => {
  if (window.innerWidth > 768 && navLinks) {
    navLinks.style.display = '';
    navLinks.style.flexDirection = '';
    navLinks.style.position = '';
    navLinks.style.top = '';
    navLinks.style.left = '';
    navLinks.style.width = '';
    navLinks.style.background = '';
    navLinks.style.padding = '';
    navLinks.style.backdropFilter = '';
  }
});

// =========================================
// 5. Sound Controller (MP3 Assets)
// =========================================
const bgAudio = new Audio('assets/audio/bg.mp3');
bgAudio.loop = true;
bgAudio.volume = 0.5; // Increased from 0.3

const clickAudio = new Audio('assets/audio/click.mp3');
clickAudio.volume = 1.0; // Maximized for impact

const hoverAudio = new Audio('assets/audio/hover.mp3');
hoverAudio.volume = 0.6;

const moveAudio = new Audio('assets/audio/move.mp3');
moveAudio.loop = true;
moveAudio.volume = 0.2; // Set to 20% as requested

let isMuted = true;
let moveTimeout;

// Helper to check for mobile/touch devices
const isTouchDevice = () => window.matchMedia("(hover: none)").matches;

function playSound(type) {
  if (isMuted) return;

  if (type === 'click') {
    clickAudio.currentTime = 0;
    clickAudio.play().catch(e => { });
  } else if (type === 'hover') {
    if (isTouchDevice()) return; // Skip hover sound on mobile
    bgAudio.pause();
    hoverAudio.currentTime = 0;
    hoverAudio.play().catch(e => { });
  } else if (type === 'stopHover') {
    if (isTouchDevice()) return; // Skip on mobile
    hoverAudio.pause();
    hoverAudio.currentTime = 0;
    if (!isMuted && !isMediaPausedManually) {
      bgAudio.play().catch(e => { });
    }
  }
}

// Mouse movement sound logic (Throttled & Subtle)
window.addEventListener('mousemove', () => {
  if (isMuted || isTouchDevice()) return; // Skip on mobile

  if (moveAudio.paused) {
    moveAudio.play().catch(e => { });
  }

  clearTimeout(moveTimeout);
  moveTimeout = setTimeout(() => {
    moveAudio.pause();
  }, 100);
});

// Sound Controls
const soundToggle = document.getElementById('sound-toggle');
const mediaToggle = document.getElementById('media-toggle');
let isMediaPausedManually = false;

function updateSoundUI() {
  const speakerOn = document.querySelector('.speaker-on');
  const speakerOff = document.querySelector('.speaker-off');
  if (speakerOn) speakerOn.style.display = isMuted ? 'none' : 'block';
  if (speakerOff) speakerOff.style.display = isMuted ? 'block' : 'none';
}

function updateMediaUI() {
  if (!mediaToggle) return;
  const mediaPause = mediaToggle.querySelector('.media-pause');
  const mediaPlay = mediaToggle.querySelector('.media-play');
  if (isMediaPausedManually) {
    mediaPause.style.display = 'none';
    mediaPlay.style.display = 'block';
  } else {
    mediaPause.style.display = 'block';
    mediaPlay.style.display = 'none';
  }
}

if (mediaToggle) {
  mediaToggle.addEventListener('click', () => {
    isMediaPausedManually = !isMediaPausedManually;

    if (isMediaPausedManually) {
      bgAudio.pause();
      if (scrollVideo) scrollVideo.pause();
    } else {
      if (!isMuted) bgAudio.play().catch(e => { });
      if (scrollVideo) scrollVideo.play().catch(e => { });
    }

    updateMediaUI();
    playSound('click');
  });
}

if (soundToggle) {
  soundToggle.addEventListener('click', () => {
    isMuted = !isMuted;

    if (!isMuted) {
      if (!isMediaPausedManually) bgAudio.play().catch(e => { });
    } else {
      bgAudio.pause();
      moveAudio.pause();
      hoverAudio.pause();
    }
    updateSoundUI();
    playSound('click');
  });
}

// Update scroll video logic to respect manual pause
window.addEventListener('scroll', () => {
  if (isMediaPausedManually || !scrollVideo) return;

  window.clearTimeout(isScrolling);
  if (scrollVideo.paused) {
    scrollVideo.play().catch(e => { });
  }
  isScrolling = setTimeout(() => {
    scrollVideo.pause();
  }, 150);
});

// Global sounds for magnetic elements
document.querySelectorAll('.magnetic').forEach(el => {
  el.addEventListener('mouseenter', () => playSound('hover'));
  el.addEventListener('mouseleave', () => playSound('stopHover'));
  el.addEventListener('click', () => playSound('click'));
});

// =========================================
// 6. Skill Detail Modals & Tech Chips
// =========================================
const skillData = {
  "React 18": {
    desc: "The latest version of the world's most popular UI library.",
    tools: "Concurrent Rendering, Transitions API, Server Components.",
    projects: "TrainWise, Portfolio Redesign.",
    level: "Beginner"
  },
  "Node.js": {
    desc: "Scalable server-side JavaScript environment.",
    tools: "Express, Middleware, Streams, Event Loop optimization.",
    projects: "TrainWise Backend, Security Proxy APIs.",
    level: "Beginner"
  },
  "Supabase": {
    desc: "The open-source Firebase alternative.",
    tools: "PostgreSQL, Realtime, Auth, Row Level Security (RLS).",
    projects: "TrainWise Database & Auth.",
    level: "Intermediate"
  },
  "NVIDIA NIM": {
    desc: "High-performance inference microservices for LLMs.",
    tools: "Gemma-27B, Model Optimization, Low Latency Inference.",
    projects: "TrainWise AI Coach Integration.",
    level: "Beginner"
  },
  "Gemma-27B": {
    desc: "Advanced open-weight LLM by Google DeepMind.",
    tools: "Instruction Tuning, RAG, Safe Response Generation.",
    projects: "TrainWise Personalized AI Workouts.",
    level: "Beginner"
  },
  "Python": {
    desc: "The Swiss Army knife of cybersecurity and data science.",
    tools: "Sockets, Multithreading, Pandas, Scikit-learn.",
    projects: "Port Scanner, Data Analysis Tools.",
    level: "Intermediate"
  },
  "Sockets": {
    desc: "Low-level network communication interfaces.",
    tools: "TCP/UDP, Port Scanning, Banner Grabbing.",
    projects: "Multithreaded Port Scanner.",
    level: "Beginner"
  },
  "CLI": {
    desc: "Command Line Interfaces for efficient tool interaction.",
    tools: "Bash, Argparse, TUI (Terminal User Interfaces).",
    projects: "Port Scanner CLI, Server Ops Tools.",
    level: "Advanced"
  },
  "JavaScript": {
    desc: "The language of the web, used for both client and server-side logic.",
    tools: "ES6+, Async/Await, DOM Manipulation, Web APIs.",
    projects: "WebScore, Portfolio Logic, TrainWise Frontend.",
    level: "Beginner"
  },
  "HTML/CSS": {
    desc: "The fundamental building blocks of web structure and styling.",
    tools: "Semantic HTML5, CSS Grid, Flexbox, Animations (GSAP).",
    projects: "All projects, custom Design Systems.",
    level: "Advanced"
  },
  "APIs": {
    desc: "Application Programming Interfaces for data exchange.",
    tools: "REST, GraphQL, OAuth, Webhooks, API Security.",
    projects: "WebScore OSINT Integration, TrainWise NVIDIA Proxy.",
    level: "Intermediate"
  },
  "Cybersecurity": {
    desc: "Expertise in identifying vulnerabilities and securing infrastructure.",
    tools: "Nmap, Wireshark, Metasploit, Burp Suite, Python Sockets.",
    projects: "Port Scanner, WebScore, TrainWise API Proxy.",
    level: "Advanced"
  },
  "Full Stack Development": {
    desc: "Building scalable web applications with a focus on performance and UI/UX.",
    tools: "React 18, Node.js, Express, Supabase, PostgreSQL.",
    projects: "TrainWise, Portfolio Redesign, various SaaS MVPs.",
    level: "Beginner"
  },
  "Generative AI": {
    desc: "Integrating LLMs into production environments securely and efficiently.",
    tools: "NVIDIA NIM, Gemma-27B, Prompt Engineering, API Security.",
    projects: "TrainWise AI Coach, AI-driven security analysis tools.",
    level: "Intermediate/Advanced"
  }
};

function createModal() {
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.id = 'skill-modal';
  modal.innerHTML = `
    <div class="modal-content glass-panel">
      <button class="modal-close magnetic" id="close-modal">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
      <div class="modal-body" id="modal-body">
        <!-- Content injected here -->
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  const closeBtn = modal.querySelector('#close-modal');
  closeBtn.addEventListener('click', () => {
    modal.classList.remove('active');
    playSound('click');
  });

  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('active');
  });

  return modal;
}

const modal = createModal();

// Target tech tags and skill categories
document.addEventListener('click', (e) => {
  const target = e.target.closest('.tech-tags span, .skill-category');
  if (!target) return;

  const title = (target.tagName === 'SPAN') ? target.textContent.trim() : target.querySelector('h4').textContent.trim();
  const data = skillData[title];

  if (data) {
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <h3>${title}</h3>
      <div class="skill-detail-item">
        <div class="skill-detail-label">Description</div>
        <div class="skill-detail-value">${data.desc}</div>
      </div>
      <div class="skill-detail-item">
        <div class="skill-detail-label">Tools & Technologies</div>
        <div class="skill-detail-value">${data.tools}</div>
      </div>
      <div class="skill-detail-item">
        <div class="skill-detail-label">Key Projects</div>
        <div class="skill-detail-value">${data.projects}</div>
      </div>
      <div class="skill-detail-item">
        <div class="skill-detail-label">Experience Level</div>
        <div class="skill-detail-value">${data.level}</div>
      </div>
    `;
    modal.classList.add('active');
    playSound('click');
  }
});

// Sound for hover
document.addEventListener('mouseover', (e) => {
  const target = e.target.closest('.tech-tags span, .skill-category');
  if (target) {
    playSound('hover');
  }
});

document.addEventListener('mouseout', (e) => {
  const target = e.target.closest('.tech-tags span, .skill-category');
  if (target) {
    playSound('stopHover');
  }
});
// =========================================
// 7. Skill Tag Pop-up Data
// =========================================
const skillTagData = {
  'VAPT': { desc: 'Vulnerability Assessment and Penetration Testing — systematically finding and exploiting security flaws.', tools: 'Burp Suite, Nmap, Metasploit, OWASP ZAP', level: 'Beginner' },
  'IAM': { desc: 'Identity and Access Management in cloud and enterprise environments.', tools: 'Azure AD, OCI IAM, Role-Based Access Control', level: 'Intermediate' },
  'SIEM (Splunk)': { desc: 'Real-time monitoring and analysis of security events across infrastructure.', tools: 'Splunk, Log Analysis, Threat Detection', level: 'Beginner' },
  'Network Monitoring': { desc: 'Continuous observation of network traffic to detect anomalies and intrusions.', tools: 'Wireshark, Nmap, tcpdump, Zeek', level: 'Intermediate' },
  'Social Engineering': { desc: 'Human-based attack vectors including phishing and pretexting for red team ops.', tools: 'GoPhish, Social Engineering Toolkit (SET)', level: 'Intermediate' },
  'OWASP': { desc: 'Following the OWASP Top 10 to identify and mitigate web application vulnerabilities.', tools: 'OWASP ZAP, Burp Suite, DAST/SAST tools', level: 'Advanced' },
  'Nmap': { desc: 'Network scanner for host discovery, port scanning, and service fingerprinting.', tools: 'Nmap Scripting Engine (NSE), Zenmap', level: 'Advanced' },
  'Burp Suite': { desc: 'Industry-standard web application security testing platform.', tools: 'Intruder, Repeater, Scanner, Proxy', level: 'Advanced' },
  'Oracle Cloud (OCI)': { desc: 'Enterprise cloud platform for compute, storage, networking, and AI workloads.', tools: 'OCI Console, CLI, Terraform, Data Platform', level: 'Beginner' },
  'Microsoft Azure': { desc: 'Microsoft cloud platform for hosting, compute, identity, and security solutions.', tools: 'Azure Portal, ARM Templates, DevOps, CLI', level: 'Expert' },
  'Azure AI Services': { desc: 'Azure AI and ML services including Cognitive Services and Azure OpenAI.', tools: 'Azure OpenAI, Cognitive Services, AI Studio', level: 'Beginner' },
  'Python': { desc: 'Primary language for scripting, security tools, automation, and data analysis.', tools: 'FastAPI, Pandas, Scikit-learn, Sockets, Requests', level: 'Intermediate' },
  'JavaScript': { desc: 'Primary web language for interactive UIs and backend APIs.', tools: 'ES6+, DOM API, Fetch API, GSAP, Node.js', level: 'Intermediate' },
  'React 18': { desc: 'Modern UI library with Concurrent Rendering for fast web applications.', tools: 'Vite, React Router, Hooks, Context API', level: 'Beginner' },
  'Node.js': { desc: 'Server-side JavaScript runtime for scalable APIs and real-time apps.', tools: 'Express.js, Middleware, Streams, Rate Limiting', level: 'Beginner' },
  'Java': { desc: 'Object-oriented language for enterprise applications and system-level programming.', tools: 'OOP, Collections, JDBC, Maven', level: 'Beginner' },
  'C/C++': { desc: 'Low-level systems programming for performance-critical applications.', tools: 'Pointers, STL, GDB Debugger, Makefiles', level: 'Beginner' },
  'SQL': { desc: 'Structured Query Language for managing and querying relational databases.', tools: 'PostgreSQL, MySQL, Supabase, Query Optimization', level: 'Intermediate' },
  'HTML/CSS': { desc: 'Foundation of the web with responsive layouts and animations.', tools: 'CSS Grid, Flexbox, CSS Animations, GSAP', level: 'Advanced' },
  'REST APIs': { desc: 'Designing and consuming RESTful APIs following best practices.', tools: 'Postman, Fetch API, OAuth 2.0, JWT', level: 'Intermediate' },
  'Linux': { desc: 'Primary OS for security operations, server management, and development.', tools: 'Bash, SSH, Systemd, Kali Linux, Ubuntu', level: 'Intermediate' },
  'Postman': { desc: 'API development and testing platform for building and documenting HTTP APIs.', tools: 'Collections, Environments, Automated Tests', level: 'Intermediate' },
  'Git': { desc: 'Distributed version control for tracking code and collaborating on projects.', tools: 'GitHub, GitLab, Branching Strategies, PR Reviews', level: 'Intermediate' },
  'Supabase': { desc: 'Open-source Firebase alternative with PostgreSQL, realtime, and auth.', tools: 'Auth, Realtime, RLS Policies, Storage', level: 'Intermediate' },
  'Power BI': { desc: 'Microsoft BI platform for interactive data visualizations and dashboards.', tools: 'DAX, Power Query, Data Modeling, Reports', level: 'Beginner' },
};

document.addEventListener('click', (e) => {
  const skillTag = e.target.closest('.skill-tag');
  if (!skillTag) return;
  const title = skillTag.textContent.trim();
  const data = skillTagData[title];
  if (!data) return;
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <h3>${title}</h3>
    <div class="skill-detail-item">
      <div class="skill-detail-label">What it is</div>
      <div class="skill-detail-value">${data.desc}</div>
    </div>
    <div class="skill-detail-item">
      <div class="skill-detail-label">Tools & Stack</div>
      <div class="skill-detail-value">${data.tools}</div>
    </div>
    <div class="skill-detail-item">
      <div class="skill-detail-label">Experience Level</div>
      <div class="skill-detail-value">${data.level}</div>
    </div>
  `;
  modal.classList.add('active');
  playSound('click');
});

document.addEventListener('mouseover', (e) => { if (e.target.closest('.skill-tag')) playSound('hover'); });
document.addEventListener('mouseout', (e) => { if (e.target.closest('.skill-tag')) playSound('stopHover'); });

// =========================================
// 8. Certification Company Modals
// =========================================
const certData = {
  google: {
    name: 'Google', color: '#4285F4',
    summary: "Google's professional cybersecurity program covering threat detection, SIEM tools, and incident response.",
    certs: ['Google Cybersecurity Career Certificate: 8-course program covering security operations, SIEM, Python automation, and incident response.']
  },
  microsoft: {
    name: 'Microsoft', color: '#00a4ef',
    summary: 'Certifications spanning security operations, cloud development, data analytics, and fundamentals.',
    certs: [
      'SC-200 Security Operations Analyst: Threat detection and response using Microsoft Sentinel and Defender.',
      'AZ-204 Developing Solutions for Azure: Cloud-native apps, Cosmos DB, and API Management.',
      'PL-300 Power BI Data Analyst: Data modeling, DAX, and interactive dashboards.',
      'AZ-900 Azure Fundamentals: Core cloud concepts and Azure service categories.',
      'AI-900 Azure AI Fundamentals: Machine learning, cognitive services, and responsible AI.',
      'PL-900 Power Platform Fundamentals: Power Apps, Power Automate, and Power BI overview.'
    ]
  },
  oracle: {
    name: 'Oracle', color: '#F80000',
    summary: 'OCI certifications validating cloud infrastructure, AI services, and data platform knowledge.',
    certs: [
      'OCI AI Foundations: AI and ML concepts on Oracle Cloud Infrastructure.',
      'OCI Data Platform Foundations: Data management, analytics, and lakehouses on OCI.',
      'OCI Foundations: Core infrastructure, networking, compute, and storage on Oracle Cloud.'
    ]
  },
  github: {
    name: 'GitHub', color: '#6e40c9',
    summary: "GitHub's official certification on version control, collaboration, and repository workflows.",
    certs: ['GitHub Fundamentals: Version control, branching, pull requests, Actions, and collaboration best practices.']
  }
};

document.querySelectorAll('.cert-company-card').forEach(card => {
  card.addEventListener('click', () => {
    const company = card.dataset.company;
    const data = certData[company];
    if (!data) return;
    const certListHTML = data.certs.map(c => `<li>${c}</li>`).join('');
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
      <h3 style="background: linear-gradient(135deg, ${data.color}, #a78bfa); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">${data.name} Certifications</h3>
      <div class="skill-detail-item">
        <div class="skill-detail-label">Overview</div>
        <div class="skill-detail-value">${data.summary}</div>
      </div>
      <div class="skill-detail-item">
        <div class="skill-detail-label">Certificates (${data.certs.length})</div>
        <ul class="cert-modal-list">${certListHTML}</ul>
      </div>
    `;
    modal.classList.add('active');
    playSound('click');
  });
  card.addEventListener('mouseenter', () => playSound('hover'));
  card.addEventListener('mouseleave', () => playSound('stopHover'));
});
