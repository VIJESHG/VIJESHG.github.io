// --- Live Menu Bar Date & Time ---
function updateMenuClock() {
    const now = new Date();
    const options = { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' };
    document.getElementById('menu-clock').innerText = now.toLocaleDateString('en-US', options).replace(',', '');
  }
  setInterval(updateMenuClock, 1000);
  updateMenuClock();
  
  // --- Live Analog Clock & Calendar Widget ---
  function updateWidgets() {
    const now = new Date();
  
    // Calendar
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    document.getElementById('cal-day').innerText = days[now.getDay()];
    document.getElementById('cal-month').innerText = months[now.getMonth()];
    document.getElementById('cal-date').innerText = now.getDate();
  
    // Clock Hands
    const secs = now.getSeconds();
    const mins = now.getMinutes();
    const hrs = now.getHours();
  
    document.getElementById('sec-hand').style.transform = `rotate(${secs * 6}deg)`;
    document.getElementById('min-hand').style.transform = `rotate(${mins * 6 + secs * 0.1}deg)`;
    document.getElementById('hour-hand').style.transform = `rotate(${hrs * 30 + mins * 0.5}deg)`;
  }
  setInterval(updateWidgets, 1000);
  updateWidgets();
  
  // --- Window Toggling & Dragging Logic ---
  let zIndex = 100;
  
  function openWindow(id) {
    const win = document.getElementById(id);
    win.classList.remove('hidden');
    bringToFront(win);
  }
  
  function closeWindow(id) {
    const win = document.getElementById(id);
    win.classList.add('hidden');
  }
    // Toggle Maximize / Restore Window
  function toggleMaximize(id) {
    const win = document.getElementById(id);
    win.classList.toggle('maximized');
  }
  function bringToFront(win) {
    zIndex++;
    win.style.zIndex = zIndex;
  }
  
  // Make Windows Draggable
  document.querySelectorAll('.mac-window').forEach(win => {
    const header = win.querySelector('.window-header');
    let isDragging = false, offsetX = 0, offsetY = 0;
  
    win.addEventListener('mousedown', () => bringToFront(win));
  
    header.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - win.offsetLeft;
      offsetY = e.clientY - win.offsetTop;
    });
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      win.style.left = `${e.clientX - offsetX}px`;
      win.style.top = `${Math.max(28, e.clientY - offsetY)}px`;
    });
  
    document.addEventListener('mouseup', () => isDragging = false);
  });

  // Toggle VG Brand Dropdown Menu
function toggleBrandMenu(event) {
    event.stopPropagation(); // Prevents click from bubbling up and instantly closing menu
    const dropdown = document.getElementById('brand-dropdown');
    const wrapper = document.querySelector('.brand-menu-wrapper');
    
    dropdown.classList.toggle('hidden');
    wrapper.classList.toggle('active');
  }
  
  // Close Dropdown Menu when clicking anywhere outside
  document.addEventListener('click', (event) => {
    const dropdown = document.getElementById('brand-dropdown');
    const wrapper = document.querySelector('.brand-menu-wrapper');
    
    if (dropdown && !dropdown.classList.contains('hidden')) {
      dropdown.classList.add('hidden');
      if (wrapper) wrapper.classList.remove('active');
    }
  });

  // --- Make Widget Cards Draggable Anywhere ---
document.querySelectorAll('.widget').forEach(widget => {
    let isDragging = false;
    let offsetX = 0, offsetY = 0;
  
    widget.addEventListener('mousedown', (e) => {
      isDragging = true;
      widget.style.zIndex = 500; // Bring currently dragged widget to front
      offsetX = e.clientX - widget.offsetLeft;
      offsetY = e.clientY - widget.offsetTop;
    });
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
  
      const newX = e.clientX - offsetX;
      const newY = e.clientY - offsetY;
  
      // Prevent dragging above top menu bar (28px height)
      widget.style.left = `${newX}px`;
      widget.style.top = `${Math.max(28, newY)}px`;
    });
  
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        widget.style.zIndex = 10;
      }
    });
  });

  // --- Make Desktop Folders & Files Draggable ---
document.querySelectorAll('.desktop-icon').forEach(icon => {
    let isDragging = false;
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;
    let hasDragged = false;
  
    icon.addEventListener('mousedown', (e) => {
      isDragging = true;
      hasDragged = false;
      startX = e.clientX;
      startY = e.clientY;
  
      // Calculate mouse position relative to folder element
      offsetX = e.clientX - icon.getBoundingClientRect().left;
      offsetY = e.clientY - icon.getBoundingClientRect().top;
      
      icon.style.zIndex = 600; // Bring currently dragged icon to front
    });
  
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
  
      // Check if mouse moved enough to count as a drag (not a simple click)
      if (Math.abs(e.clientX - startX) > 4 || Math.abs(e.clientY - startY) > 4) {
        hasDragged = true;
      }
  
      // Set new coordinates (converted to left/top positioning)
      const newLeft = e.clientX - offsetX;
      const newTop = Math.max(28, e.clientY - offsetY); // Keep below menu bar
  
      icon.style.left = `${newLeft}px`;
      icon.style.top = `${newTop}px`;
      icon.style.right = 'auto'; // Clear original CSS 'right' property once moved
    });
  
    document.addEventListener('mouseup', () => {
      if (isDragging) {
        isDragging = false;
        icon.style.zIndex = 20;
      }
    });
  
    // Prevent opening the window if the user was dragging the folder
    icon.addEventListener('click', (e) => {
      if (hasDragged) {
        e.stopPropagation();
        e.preventDefault();
      }
    }, true);
  });
// Copy Email to Clipboard Function
function copyEmail(emailAddress, buttonEl) {
    navigator.clipboard.writeText(emailAddress).then(() => {
      const label = buttonEl.querySelector('.btn-label');
      const originalText = label.innerText;
      
      label.innerText = 'Copied! ✓';
      buttonEl.style.background = '#34c759';
      buttonEl.style.color = 'white';
  
      setTimeout(() => {
        label.innerText = originalText;
        buttonEl.style.background = '';
        buttonEl.style.color = '';
      }, 2000);
    });
  }

  // --- Generic Link Handler (Prevents opening link while dragging) ---
let isIconDragging = false;

function openDesktopShortcut(url, target = '_blank') {
  if (!isIconDragging) {
    window.open(url, target);
  }
}

// --- Universal Drag-and-Drop for ALL Desktop Icons ---
function initDesktopIcons() {
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    let startX = 0, startY = 0;
    let offsetX = 0, offsetY = 0;
    let hasDragged = false;

    icon.addEventListener('mousedown', (e) => {
      hasDragged = false;
      isIconDragging = false;
      startX = e.clientX;
      startY = e.clientY;

      offsetX = e.clientX - icon.getBoundingClientRect().left;
      offsetY = e.clientY - icon.getBoundingClientRect().top;

      icon.style.zIndex = 600; // Bring active icon to front

      const onMouseMove = (moveEvent) => {
        // Detect movement threshold to differentiate between click vs drag
        if (Math.abs(moveEvent.clientX - startX) > 4 || Math.abs(moveEvent.clientY - startY) > 4) {
          hasDragged = true;
          isIconDragging = true;
        }

        if (hasDragged) {
          const newLeft = moveEvent.clientX - offsetX;
          const newTop = Math.max(28, moveEvent.clientY - offsetY); // Stay below menu bar

          icon.style.left = `${newLeft}px`;
          icon.style.top = `${newTop}px`;
          icon.style.right = 'auto'; // Clear CSS 'right' positioning
        }
      };

      const onMouseUp = () => {
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
        icon.style.zIndex = 20;

        // Reset drag lock after small delay so click handler doesn't trigger
        setTimeout(() => { isIconDragging = false; }, 50);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    });
  });
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDesktopIcons);

// --- macOS QuickTime Video Modal Engine ---
function playVideoDemo(videoRawUrl, title = 'Video Demo') {
    const videoWin = document.getElementById('video-window');
    const videoPlayer = document.getElementById('demo-video-player');
    const videoTitle = document.getElementById('video-window-title');
  
    if (videoWin && videoPlayer) {
      videoTitle.innerText = `QuickTime Player — ${title}`;
      videoPlayer.src = videoRawUrl;
      
      // Bring window to top layer & display
      videoWin.classList.remove('hidden');
      videoWin.style.zIndex = 1000;
      
      // Auto play
      videoPlayer.play().catch(err => console.log('Autoplay deferred:', err));
    }
  }
  
  function closeVideoModal() {
    const videoWin = document.getElementById('video-window');
    const videoPlayer = document.getElementById('demo-video-player');
  
    if (videoPlayer) {
      videoPlayer.pause();
      videoPlayer.src = ''; // Stop video buffering in background
    }
    if (videoWin) {
      videoWin.classList.add('hidden');
    }
  }

  // --- macOS Interactive Terminal Logic ---
const terminalInput = document.getElementById('terminal-input');
const terminalOutput = document.getElementById('terminal-output');

if (terminalInput) {
  terminalInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const command = this.value.trim();
      this.value = '';
      executeTerminalCommand(command);
    }
  });
}

function focusTerminalInput() {
  const input = document.getElementById('terminal-input');
  if (input) input.focus();
}

function executeTerminalCommand(cmd) {
  if (!terminalOutput) return;

  // Render command line prompt entry
  const commandLine = document.createElement('div');
  commandLine.className = 'term-command-row';
  commandLine.innerHTML = `<span class="prompt">vijesh@macbook ~ %</span> <span>${escapeHtml(cmd)}</span>`;
  terminalOutput.appendChild(commandLine);

  const lowerCmd = cmd.toLowerCase().trim();
  let responseHTML = '';

  switch (lowerCmd) {
    case 'help':
      responseHTML = `
        <div class="term-output-text">
          <span class="term-highlight">Available Commands:</span><br>
          • <b class="term-success">about</b>    : Summary & technical background<br>
          • <b class="term-success">skills</b>   : Languages, tools, & frameworks<br>
          • <b class="term-success">projects</b> : High-level summary of engineering works<br>
          • <b class="term-success">contact</b>  : Email and profile links<br>
          • <b class="term-success">clear</b>    : Clear terminal screen<br>
          • <b class="term-success">date</b>     : Print system date and time<br>
          • <b class="term-success">whoami</b>   : Output current shell identity
        </div>`;
      break;

    case 'about':
    case 'whoami':
      responseHTML = `
        <div class="term-output-text">
          <b>Vijesh Ghandare</b> — Staff Software Engineer<br>
          Specializing in end-to-end fullstack development (React, Angular, Spring Boot, Node.js) and autonomous Agentic AI systems (LangGraph, MCP Protocol).
        </div>`;
      break;

    case 'skills':
      responseHTML = `
        <div class="term-output-text">
          <span class="term-highlight">Languages:</span> Java, Python, C/C++, JavaScript, SQL<br>
          <span class="term-highlight">Fullstack:</span> ReactJS, Angular, Node.js, Spring Boot, Microservices<br>
          <span class="term-highlight">Agentic AI:</span> LangGraph, MCP Protocol, GenAI, LLM Orchestration<br>
          <span class="term-highlight">Cloud & DevOps:</span> Kubernetes, Docker, System Design
        </div>`;
      break;

    case 'projects':
      responseHTML = `
        <div class="term-output-text">
          1. <b class="term-success">Fullstack Nexus</b> — Interactive Fullstack System Design Platform<br>
          2. <b class="term-success">SnapReadAI</b> — Chrome Extension for Gemini LLM Summarization<br>
          3. <b class="term-success">K8s Troubleshooting Agent</b> — LangGraph + MCP Autonomous DevOps Agent<br>
          4. <b class="term-success">PracticalJava</b> — Core Java Architecture & Concurrency Practices<br>
          5. <b class="term-success">MyCalci</b> — Arbitrary-precision BigInt Linux CLI Calculator
        </div>`;
      break;

    case 'contact':
      responseHTML = `
        <div class="term-output-text">
          • <b>Email:</b> mail.vijeshg@gmail.com<br>
          • <b>GitHub:</b> https://github.com/vijeshg<br>
          • <b>LinkedIn:</b> https://www.linkedin.com/in/vijeshg/
        </div>`;
      break;

    case 'date':
      responseHTML = `<div class="term-output-text">${new Date().toString()}</div>`;
      break;

    case 'clear':
      terminalOutput.innerHTML = '';
      return;

    case 'sudo':
    case 'sudo su':
      responseHTML = `<div class="term-output-text term-error">Permission denied: 'vijesh' holds all root access! 🛡️</div>`;
      break;

    case '':
      return;

    default:
      responseHTML = `<div class="term-output-text term-error">zsh: command not found: ${escapeHtml(cmd)}. Type <span class="term-highlight">'help'</span> for a list of commands.</div>`;
  }

  const responseContainer = document.createElement('div');
  responseContainer.innerHTML = responseHTML;
  terminalOutput.appendChild(responseContainer);

  // Auto-scroll to bottom
  const termBody = document.querySelector('.terminal-body');
  if (termBody) {
    termBody.scrollTop = termBody.scrollHeight;
  }
}

function escapeHtml(text) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// --- macOS Control Center & Wallpaper Switcher ---

const wallpaperURLs = {
   'default': 'assets/wallpaper.jpg',
  'monterey-dark': 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2000&auto=format&fit=crop',
  'sonoma-light': 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=2000&auto=format&fit=crop',
 
};

function toggleControlCenter() {
  const panel = document.getElementById('control-center-panel');
  if (panel) {
    panel.classList.toggle('hidden');
  }
}

// Close panel when clicking outside
document.addEventListener('click', function (e) {
  const trigger = document.getElementById('control-center-trigger');
  const panel = document.getElementById('control-center-panel');
  
  if (panel && trigger && !panel.classList.contains('hidden')) {
    if (!panel.contains(e.target) && !trigger.contains(e.target)) {
      panel.classList.add('hidden');
    }
  }
});

function setWallpaper(theme) {
  const selectedURL = wallpaperURLs[theme];
  if (!selectedURL) return;

  // Apply wallpaper image to body/desktop background
  document.body.style.backgroundImage = `url('${selectedURL}')`;
  document.body.style.backgroundSize = 'cover';
  document.body.style.backgroundPosition = 'center';
  document.body.style.backgroundAttachment = 'fixed';

  // Save choice to localStorage
  localStorage.setItem('macOS-wallpaper', theme);

  // Update active status on UI buttons
  document.querySelectorAll('.wallpaper-card').forEach(card => {
    if (card.getAttribute('data-theme') === theme) {
      card.classList.add('active');
    } else {
      card.classList.remove('active');
    }
  });
}

// Initialize saved wallpaper on initial page load
document.addEventListener('DOMContentLoaded', () => {
  const savedWallpaper = localStorage.getItem('macOS-wallpaper') || 'default';
  setWallpaper(savedWallpaper);
});

// --- Good Reads App Data & Logic ---

const docsList = [
  // {
  //   id: 'agentic-ai-spec',
  //   title: 'Agentic AI Systems',
  //   type: 'md',
  //   content: `# Agentic AI Architecture\n\n> System Spec v2026\n\n### Overview\nThis document outlines multi-agent orchestration pipelines using tool-calling patterns and distributed state management.\n\n\`\`\`javascript\nconst agent = new Agent({ role: 'Architect', tools: [searchTool, codeExecutor] });\nawait agent.execute(task);\n\`\`\`\n\n* High-throughput routing\n* Sub-second tool latency\n* Built for fault tolerance`
  // },
  {
    id: 'microservice-readme',
    title: 'Microservices Architecture Patterns',
    type: 'README',
    url: 'https://raw.githubusercontent.com/VIJESHG/MicroServiceArchitectureLearning/main/README.md'
  },
  {
    id: 'practical-java-readme',
    title: 'Practical Java',
    type: 'README',
    url: 'https://raw.githubusercontent.com/VIJESHG/PracticalJava/main/README.md'
  }
  // {
  //   id: 'engineering-notes',
  //   title: 'Engineering Principles',
  //   type: 'txt',
  //   content: `ENGINEERING PHILOSOPHY (2026)\n\n1. Simplicity over unnecessary abstraction.\n2. Optimize for readability and maintainability.\n3. Measure before optimizing performance.\n4. Design resilient systems with clear failure modes.`
  // }
];

function initGoodReadsApp() {
  const fileListContainer = document.getElementById('reader-file-list');
  if (!fileListContainer) return;

  fileListContainer.innerHTML = '';

  docsList.forEach((doc, index) => {
    const li = document.createElement('li');
    li.className = `file-item ${index === 0 ? 'active' : ''}`;
    li.innerHTML = `
      <span>${doc.title}</span>
      <span class="file-tag">${doc.type}</span>
    `;
    li.onclick = () => loadDocument(doc, li);
    fileListContainer.appendChild(li);
  });

  // Load first document on start
  if (docsList.length > 0) {
    loadDocument(docsList[0], fileListContainer.children[0]);
  }
}

async function loadDocument(doc, element) {
  document.querySelectorAll('.file-item').forEach(item => item.classList.remove('active'));
  if (element) element.classList.add('active');

  document.getElementById('doc-title').innerText = doc.title;
  document.getElementById('doc-badge').innerText = `.${doc.type.toLowerCase()}`;
  
  const readerBody = document.getElementById('reader-body');
  readerBody.innerHTML = '<p class="placeholder-text">Loading content...</p>';

  let rawText = '';

  if (doc.url) {
    try {
      const response = await fetch(doc.url);
      if (!response.ok) throw new Error('Fetch failed');
      rawText = await response.text();
    } catch (err) {
      rawText = `> **Error loading document:** Could not fetch content from GitHub URL.`;
    }
  } else {
    rawText = doc.content || 'No content available.';
  }

  if (doc.type.toLowerCase() === 'txt') {
    readerBody.innerHTML = `<pre style="white-space: pre-wrap; font-family: inherit;">${rawText}</pre>`;
  } else {
    readerBody.innerHTML = typeof marked !== 'undefined' ? marked.parse(rawText) : rawText;
  }
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  initGoodReadsApp();
});

// --- macOS Lock Screen & Idle Screen Saver Logic ---

let isLocked = false;
let idleTimer = null;
const IDLE_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes of inactivity

function updateLockClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric' });

  const lockTimeEl = document.getElementById('lock-time');
  const lockDateEl = document.getElementById('lock-date');

  if (lockTimeEl) lockTimeEl.innerText = timeStr;
  if (lockDateEl) lockDateEl.innerText = dateStr;
}

function lockScreen() {
  const lockWin = document.getElementById('lock-screen');
  if (!lockWin) return;

  isLocked = true;
  updateLockClock();
  lockWin.classList.remove('hidden');

  const passInput = document.getElementById('lock-pass-input');
  if (passInput) {
    passInput.value = '';
    setTimeout(() => passInput.focus(), 100);
  }
}

function unlockScreen() {
  const lockWin = document.getElementById('lock-screen');
  if (!lockWin) return;

  isLocked = false;
  lockWin.classList.add('hidden');
  resetIdleTimer();
}

function resetIdleTimer() {
  if (isLocked) return;
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    lockScreen();
  }, IDLE_TIMEOUT_MS);
}

// Global Event Listeners for Lock Screen
document.addEventListener('DOMContentLoaded', () => {
  // Update lock clock every second
  setInterval(updateLockClock, 1000);

  // Initialize Idle Timer on User Activity
  ['mousemove', 'keydown', 'mousedown', 'touchstart'].forEach(evt => {
    window.addEventListener(evt, resetIdleTimer, { passive: true });
  });
  resetIdleTimer();

  // Press Enter key on Lock Screen password input to unlock
  const passInput = document.getElementById('lock-pass-input');
  if (passInput) {
    passInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        unlockScreen();
      }
    });
  }

  // Keyboard Shortcut: Cmd + L or Ctrl + L to Lock Screen instantly
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'l') {
      e.preventDefault();
      lockScreen();
    }
  });
});

// --- macOS Rolling Dice Random Launcher ---

// --- macOS On-Screen Rolling Dice Launcher ---

let isRolling = false;

function rollAndOpenRandomWindow(iconElement) {
  if (isRolling) return;
  isRolling = true;

  const overlay = document.getElementById('dice-overlay');
  const appIcon = iconElement ? iconElement.querySelector('.random-app-icon') : null;

  // 1. Animate small app icon
  if (appIcon) appIcon.classList.add('rolling');

  // 2. Trigger full-screen dice overlay
  if (overlay) {
    overlay.classList.remove('hidden');
    // Force reflow for CSS transition
    void overlay.offsetWidth;
    overlay.classList.add('visible');
  }

  // 3. Wait for tumble animation (1.1s) before revealing random window
  setTimeout(() => {
    const availableWindows = [
      'about-window',
      'projects-window',
      'contact-window',
      'terminal-window',
      'good-reads-window'
    ];

    const randomIndex = Math.floor(Math.random() * availableWindows.length);
    const selectedWindow = availableWindows[randomIndex];

    // Fade out overlay
    if (overlay) {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.classList.add('hidden'), 250);
    }

    // Open random window
    if (typeof openWindow === 'function') {
      openWindow(selectedWindow);
    }

    if (appIcon) appIcon.classList.remove('rolling');
    isRolling = false;
  }, 1100);
}