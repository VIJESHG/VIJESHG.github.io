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