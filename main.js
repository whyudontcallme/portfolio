/**
 * PORTFOLIO CLIENT APPLICATION
 * Features:
 *  - Matrix Rain Background Canvas Animation
 *  - Theme Switcher (Cyberpunk <-> Modern Tech Glass) with LocalStorage
 *  - Typewriter Hero Terminal Simulation
 *  - Interactive Interactive CLI Drawer (Easter Egg & Navigation)
 *  - Project Category Filters
 *  - Copy to Clipboard with Toast Notification
 *  - Mobile Navigation Burger
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initMatrixCanvas();
  initHeroTypewriter();
  initProjectFilters();
  initCliTerminal();
  initCopyEmail();
  initMobileNav();
});

/* ==========================================================================
   1. THEME MANAGEMENT
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('theme-toggle');
  const label = document.getElementById('theme-label');
  const savedTheme = localStorage.getItem('muso_portfolio_theme') || 'cyberpunk';

  applyTheme(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'cyberpunk' ? 'glass' : 'cyberpunk';
      applyTheme(next);
      localStorage.setItem('muso_portfolio_theme', next);
      showToast(`Тема переключена на: ${next === 'cyberpunk' ? 'Cyberpunk Mode' : 'Modern Glass'}`);
    });
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    if (label) {
      label.textContent = theme === 'cyberpunk' ? 'Cyberpunk' : 'Modern Glass';
    }
  }
}

/* ==========================================================================
   2. MATRIX RAIN CANVAS ANIMATION
   ========================================================================== */
function initMatrixCanvas() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  const characters = '01ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz<>/{}=+*#$@%&!?:';
  const fontSize = 14;
  let columns = Math.floor(width / fontSize);
  let drops = Array(columns).fill(1);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    columns = Math.floor(width / fontSize);
    drops = Array(columns).fill(1);
  });

  function draw() {
    const isCyberpunk = document.documentElement.getAttribute('data-theme') === 'cyberpunk';

    // Background trail
    ctx.fillStyle = isCyberpunk ? 'rgba(7, 9, 11, 0.08)' : 'rgba(10, 11, 16, 0.2)';
    ctx.fillRect(0, 0, width, height);

    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
      const text = characters.charAt(Math.floor(Math.random() * characters.length));
      
      // Cyberpunk neon green vs Glass neon indigo
      if (isCyberpunk) {
        ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : '#00ff66';
      } else {
        ctx.fillStyle = Math.random() > 0.95 ? '#ffffff' : 'rgba(99, 102, 241, 0.6)';
      }

      ctx.fillText(text, i * fontSize, drops[i] * fontSize);

      if (drops[i] * fontSize > height && Math.random() > 0.975) {
        drops[i] = 0;
      }
      drops[i]++;
    }

    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}

/* ==========================================================================
   3. HERO TERMINAL TYPEWRITER
   ========================================================================== */
function initHeroTypewriter() {
  const typewriterEl = document.getElementById('hero-typewriter');
  if (!typewriterEl) return;

  const phrases = [
    'curl -I https://whyudontcallme.dev',
    'python3 -m ai_augmented_workflow',
    'open to work: full-stack developer',
    't.me/byecash --ready-for-collab',
    'breaking things ethically & building systems',
    'echo "AI as force-multiplier, not a crutch"'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;
  let typingSpeed = 70;

  function type() {
    const currentPhrase = phrases[phraseIdx];

    if (isDeleting) {
      typewriterEl.textContent = currentPhrase.substring(0, charIdx - 1);
      charIdx--;
      typingSpeed = 35;
    } else {
      typewriterEl.textContent = currentPhrase.substring(0, charIdx + 1);
      charIdx++;
      typingSpeed = 85;
    }

    if (!isDeleting && charIdx === currentPhrase.length) {
      typingSpeed = 1800; // Pause at end of line
      isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
      isDeleting = false;
      phraseIdx = (phraseIdx + 1) % phrases.length;
      typingSpeed = 450;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* ==========================================================================
   4. PROJECT CATEGORY FILTERS
   ========================================================================== */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 20);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 200);
        }
      });
    });
  });
}

/* ==========================================================================
   5. INTERACTIVE CLI TERMINAL (Drawer / Modal)
   ========================================================================== */
function initCliTerminal() {
  const drawer = document.getElementById('cli-drawer');
  const openBtn = document.getElementById('cli-open-btn');
  const heroTrigger = document.getElementById('hero-cli-trigger');
  const closeBtn = document.getElementById('cli-close-btn');
  const closeX = document.getElementById('cli-close-x');
  const input = document.getElementById('cli-input');
  const history = document.getElementById('cli-history');

  function openTerminal() {
    drawer.classList.add('active');
    drawer.setAttribute('aria-hidden', 'false');
    input.focus();
  }

  function closeTerminal() {
    drawer.classList.remove('active');
    drawer.setAttribute('aria-hidden', 'true');
  }

  if (openBtn) openBtn.addEventListener('click', openTerminal);
  if (heroTrigger) heroTrigger.addEventListener('click', openTerminal);
  if (closeBtn) closeBtn.addEventListener('click', closeTerminal);
  if (closeX) closeX.addEventListener('click', closeTerminal);

  // Close on backdrop click
  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) closeTerminal();
  });

  // Hotkey: Ctrl + ` or ESC to close
  window.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === '`') {
      e.preventDefault();
      if (drawer.classList.contains('active')) {
        closeTerminal();
      } else {
        openTerminal();
      }
    }
    if (e.key === 'Escape' && drawer.classList.contains('active')) {
      closeTerminal();
    }
  });

  // CLI Command processor
  if (input) {
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const rawCmd = input.value.trim();
        if (!rawCmd) return;
        executeCliCommand(rawCmd);
        input.value = '';
      }
    });
  }

  function executeCliCommand(cmdLine) {
    const args = cmdLine.toLowerCase().split(' ');
    const cmd = args[0];

    // Append user input to history
    const cmdEntry = document.createElement('div');
    cmdEntry.className = 'cli-entry-cmd';
    cmdEntry.innerHTML = `<span class="cmd-p">&gt;</span> ${escapeHtml(cmdLine)}`;
    history.appendChild(cmdEntry);

    const outEntry = document.createElement('div');
    outEntry.className = 'cli-entry-out';

    switch (cmd) {
      case 'help':
        outEntry.innerHTML = `
          <strong>Доступные команды:</strong><br>
          &bull; <span class="term-highlight">about</span> — кратко обо мне и подходе<br>
          &bull; <span class="term-highlight">skills</span> — список ключевых технологий<br>
          &bull; <span class="term-highlight">projects</span> — список проектов<br>
          &bull; <span class="term-highlight">ai</span> — почему ИИ не костыль, а мультипликатор<br>
          &bull; <span class="term-highlight">contact</span> — контакты (Telegram, Email, GitHub)<br>
          &bull; <span class="term-highlight">theme [cyber|glass]</span> — переключить визуальную тему<br>
          &bull; <span class="term-highlight">quote</span> — цитата Mr. Robot<br>
          &bull; <span class="term-highlight">clear</span> — очистить экран терминала<br>
          &bull; <span class="term-highlight">exit</span> — закрыть терминал
        `;
        break;

      case 'about':
      case 'whoami':
        outEntry.innerHTML = `
          <strong>Мусо Шокиров</strong>, 17 лет.<br>
          Full-Stack &amp; AI-Augmented Developer.<br>
          Санкт-Петербург. 35+ публичных репозиториев на GitHub.<br>
          Специализируюсь на интерактивном вебе, Telegram-ботах и системах со сложной бизнес-логикой.
        `;
        break;

      case 'skills':
        outEntry.innerHTML = `
          <strong>Стек:</strong><br>
          - <strong>Frontend:</strong> JavaScript (ES6+), HTML5/CSS3, WebGL/Three.js, Web Speech API, PWA<br>
          - <strong>Backend:</strong> Python, Telegram Business & Bot API, Node.js, Vercel Serverless<br>
          - <strong>AI-Augmented:</strong> Быстрый MVP-пайплайн, декомпозиция, автогенерация тестов, LLM APIs<br>
          - <strong>DevOps/Sec:</strong> Linux, Bash, Git, Docker, Kali, Network Audits
        `;
        break;

      case 'projects':
        outEntry.innerHTML = `
          <strong>Избранные проекты:</strong><br>
          1. <strong>Chronos:</strong> 3D визуализация потери времени на WebGL.<br>
          2. <strong>Voice-Translator:</strong> 16-языковой синхронный переводчик голоса.<br>
          3. <strong>Schedule PWA:</strong> Мобильное расписание с живым отсчетом пар.<br>
          4. <strong>All-Seeing TG Bot:</strong> Бизнес-бот трекинга удаленных сообщений.<br>
          5. <strong>IK-Sushka:</strong> Промышленная платформа с Vercel Serverless отправкой.<br>
          6. <strong>GAIA-RU:</strong> Корпоративный сайт с интерактивным ROI калькулятором.
        `;
        break;

      case 'ai':
        outEntry.innerHTML = `
          <em>"ИИ для меня — это экзоскелет, а не протез."</em><br>
          В 17 лет я использую LLM как высокоинтеллектуального парного программиста для автоматизации рутины, написания юнит-тестов и проверки архитектуры, сохраняя полный контроль за чистотой и надежностью кода.
        `;
        break;

      case 'contact':
      case 'contacts':
        outEntry.innerHTML = `
          &bull; Telegram: <a href="https://t.me/byecash" target="_blank" class="term-highlight">@byecash</a><br>
          &bull; GitHub: <a href="https://github.com/whyudontcallme" target="_blank" class="term-highlight">whyudontcallme</a><br>
          &bull; Email: <span class="term-highlight">whyudontcallme@gmail.com</span>
        `;
        break;

      case 'quote':
        outEntry.innerHTML = `
          <em style="color: var(--accent-secondary);">&ldquo;What if what we see isn't the real world, but just a guess of our minds? What if we're only seeing a distorted image that we'll never fully understand?&rdquo;</em><br>
          &mdash; Elliot Alderson [fsociety]
        `;
        break;

      case 'theme':
        if (args[1] === 'glass') {
          document.documentElement.setAttribute('data-theme', 'glass');
          localStorage.setItem('muso_portfolio_theme', 'glass');
          document.getElementById('theme-label').textContent = 'Modern Glass';
          outEntry.innerHTML = `Тема переключена на: <strong>Modern Glass</strong>`;
        } else if (args[1] === 'cyber' || args[1] === 'cyberpunk') {
          document.documentElement.setAttribute('data-theme', 'cyberpunk');
          localStorage.setItem('muso_portfolio_theme', 'cyberpunk');
          document.getElementById('theme-label').textContent = 'Cyberpunk';
          outEntry.innerHTML = `Тема переключена на: <strong>Cyberpunk Mode</strong>`;
        } else {
          outEntry.innerHTML = `Укажите тему: <code>theme cyber</code> или <code>theme glass</code>`;
        }
        break;

      case 'clear':
        history.innerHTML = '';
        return;

      case 'exit':
      case 'quit':
        closeTerminal();
        return;

      default:
        outEntry.innerHTML = `Команда не найдена: <code>${escapeHtml(cmd)}</code>. Введите <span class="term-highlight">help</span> для списка доступных команд.`;
    }

    history.appendChild(outEntry);
    history.scrollTop = history.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, (m) => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[m]));
  }
}

/* ==========================================================================
   6. COPY EMAIL & TOAST NOTIFICATION
   ========================================================================== */
function initCopyEmail() {
  const btn = document.getElementById('copy-email-btn');
  const emailText = document.getElementById('email-text');
  const copyStatus = document.getElementById('copy-status');

  if (btn && emailText) {
    btn.addEventListener('click', () => {
      const email = emailText.textContent.trim();
      navigator.clipboard.writeText(email).then(() => {
        showToast('Email скопирован в буфер обмена!');
        if (copyStatus) {
          const old = copyStatus.textContent;
          copyStatus.textContent = '✓ Скопировано!';
          setTimeout(() => {
            copyStatus.textContent = old;
          }, 2000);
        }
      }).catch(() => {
        showToast('Не удалось скопировать email');
      });
    });
  }
}

function showToast(message) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2600);
}

/* ==========================================================================
   7. MOBILE NAVIGATION BURGER
   ========================================================================== */
function initMobileNav() {
  const burger = document.getElementById('burger-btn');
  const nav = document.getElementById('main-nav');
  const navLinks = document.querySelectorAll('.nav-link');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      nav.classList.toggle('open');
    });

    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('open');
      });
    });
  }
}
