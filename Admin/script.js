// ============================================
// ADMIN PANEL - JAVASCRIPT FUNCTIONALITY
// ============================================

// ============================================
// PAGE NAVIGATION
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize event listeners
    initializeMenuNavigation();
    initializeThemeToggle();
    initializeMenuToggle();
    initializeCalendar();
    initializeCharts();
});

function initializeMenuNavigation() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all items
            menuItems.forEach(m => m.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Get the page ID from data attribute
            const pageId = this.getAttribute('data-page');
            
            // Hide all pages
            const pages = document.querySelectorAll('.page-content');
            pages.forEach(page => page.classList.remove('active'));
            
            // Show selected page
            const selectedPage = document.getElementById(pageId);
            if (selectedPage) {
                selectedPage.classList.add('active');
            }
            
            // Close sidebar on mobile
            const sidebar = document.querySelector('.sidebar');
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('open');
            }
        });
    });
}

// ============================================
// THEME TOGGLE
// ============================================

function initializeThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-mode');
        
        // Save preference
        const isDarkMode = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    });
}

// ============================================
// MOBILE MENU TOGGLE
// ============================================

function initializeMenuToggle() {
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');
    
    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('open');
    });
    
    // Close sidebar when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.sidebar') && !e.target.closest('.menu-toggle')) {
            sidebar.classList.remove('open');
        }
    });
}

// ============================================
// CALENDAR FUNCTIONALITY
// ============================================

function initializeCalendar() {
    const calendarGrid = document.getElementById('calendarGrid');
    const currentMonthElement = document.getElementById('currentMonth');
    
    if (!calendarGrid) return;
    
    let currentDate = new Date();
    
    function renderCalendar() {
        calendarGrid.innerHTML = '';
        
        // Get first day of month and number of days
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        
        // Update month display
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
                          'July', 'August', 'September', 'October', 'November', 'December'];
        currentMonthElement.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        
        // Add empty cells for days before month starts
        for (let i = 0; i < startingDayOfWeek; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day other-month';
            emptyDay.textContent = '';
            calendarGrid.appendChild(emptyDay);
        }
        
        // Add days of month
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;
            
            // Highlight today
            if (day === today.getDate() && 
                currentDate.getMonth() === today.getMonth() && 
                currentDate.getFullYear() === today.getFullYear()) {
                dayElement.classList.add('today');
            }
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    // Initial render
    renderCalendar();
    
    // Calendar navigation
    const navButtons = document.querySelectorAll('.calendar-nav');
    navButtons[0].addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    navButtons[1].addEventListener('click', function() {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

// ============================================
// SIMPLE CHARTS
// ============================================

function initializeCharts() {
    drawCompletionChart();
    drawPriorityChart();
}

function drawCompletionChart() {
    const canvas = document.getElementById('completionChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim();
    ctx.fillRect(0, 0, width, height);
    
    // Sample data
    const data = [65, 72, 68, 75, 82, 78, 85];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    // Chart dimensions
    const padding = 40;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;
    const barWidth = chartWidth / data.length;
    const maxValue = Math.max(...data);
    
    // Draw grid lines
    ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color').trim();
    ctx.lineWidth = 1;
    
    for (let i = 0; i <= 5; i++) {
        const y = padding + (chartHeight / 5) * i;
        ctx.beginPath();
        ctx.moveTo(padding, y);
        ctx.lineTo(width - padding, y);
        ctx.stroke();
    }
    
    // Draw bars
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, '#7C3AED');
    gradient.addColorStop(1, '#3B82F6');
    
    data.forEach((value, index) => {
        const barHeight = (value / maxValue) * chartHeight;
        const x = padding + index * barWidth + barWidth * 0.1;
        const y = height - padding - barHeight;
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, barWidth * 0.8, barHeight);
    });
    
    // Draw labels
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'center';
    
    labels.forEach((label, index) => {
        const x = padding + index * barWidth + barWidth / 2;
        ctx.fillText(label, x, height - padding + 20);
    });
}

function drawPriorityChart() {
    const canvas = document.getElementById('priorityChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear canvas
    ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim();
    ctx.fillRect(0, 0, width, height);
    
    // Pie chart data
    const data = [45, 30, 25]; // High, Medium, Low
    const colors = ['#EF4444', '#F59E0B', '#10B981'];
    const labels = ['High', 'Medium', 'Low'];
    
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 3;
    
    let currentAngle = -Math.PI / 2;
    
    data.forEach((value, index) => {
        const sliceAngle = (value / 100) * Math.PI * 2;
        
        // Draw slice
        ctx.fillStyle = colors[index];
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.arc(centerX, centerY, radius, currentAngle, currentAngle + sliceAngle);
        ctx.closePath();
        ctx.fill();
        
        // Draw label
        const labelAngle = currentAngle + sliceAngle / 2;
        const labelX = centerX + Math.cos(labelAngle) * (radius * 0.7);
        const labelY = centerY + Math.sin(labelAngle) * (radius * 0.7);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(value + '%', labelX, labelY);
        
        currentAngle += sliceAngle;
    });
    
    // Draw legend
    const legendX = width - 120;
    const legendY = 20;
    
    labels.forEach((label, index) => {
        ctx.fillStyle = colors[index];
        ctx.fillRect(legendX, legendY + index * 25, 12, 12);
        
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText(label + ' (' + data[index] + '%)', legendX + 20, legendY + index * 25 + 10);
    });
}

// ============================================
// SEARCH FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-bar input');
    
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            const searchTerm = e.target.value.toLowerCase();
            
            // Search in tasks
            const taskItems = document.querySelectorAll('.task-item');
            taskItems.forEach(item => {
                const taskTitle = item.querySelector('.task-info h4').textContent.toLowerCase();
                if (taskTitle.includes(searchTerm) || searchTerm === '') {
                    item.style.display = 'flex';
                } else {
                    item.style.display = 'none';
                }
            });
        });
    }
});

// ============================================
// NOTIFICATION BADGE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const notificationBtn = document.querySelector('.notification-btn');
    
    if (notificationBtn) {
        notificationBtn.addEventListener('click', function() {
            // Simple notification click handler
            alert('You have 3 new notifications!');
        });
    }
});

// ============================================
// TASK CHECKBOX FUNCTIONALITY
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const taskCheckboxes = document.querySelectorAll('.task-checkbox input');
    
    taskCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            
            if (this.checked) {
                taskItem.style.opacity = '0.6';
            } else {
                taskItem.style.opacity = '1';
            }
        });
    });
});

// ============================================
// BUTTON CLICK HANDLERS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Report download buttons
    const reportBtns = document.querySelectorAll('.report-btn');
    reportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            alert('Report download started!');
        });
    });
    
    // File action buttons
    const fileActionBtns = document.querySelectorAll('.file-action');
    fileActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const action = this.textContent.trim();
            alert(`${action} action triggered!`);
        });
    });
    
    // Save settings button
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            alert('Settings saved successfully!');
        });
    }
});

// ============================================
// RESPONSIVE ADJUSTMENTS
// ============================================

window.addEventListener('resize', function() {
    const sidebar = document.querySelector('.sidebar');
    
    if (window.innerWidth > 768) {
        sidebar.classList.remove('open');
    }
});

// ============================================
// PROFILE MENU (Optional Enhancement)
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const profileAvatar = document.querySelector('.profile-avatar');
    
    if (profileAvatar) {
        profileAvatar.addEventListener('click', function() {
            alert('Profile menu would open here');
        });
    }
});

// ============================================
// ACTIVITY PANEL CLOSE
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    const closePanel = document.querySelector('.close-panel');
    const rightPanel = document.querySelector('.right-panel');
    
    if (closePanel && rightPanel) {
        closePanel.addEventListener('click', function() {
            rightPanel.style.display = 'none';
        });
    }
});

// ============================================
// ANIMATION ON SCROLL
// ============================================

function addScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
            }
        });
    });
    
    const elements = document.querySelectorAll('.stat-card, .project-card, .team-card');
    elements.forEach(el => observer.observe(el));
}

document.addEventListener('DOMContentLoaded', addScrollAnimations);

// ============================================
// KEYBOARD SHORTCUTS
// ============================================

document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K for search focus
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.querySelector('.search-bar input');
        if (searchInput) {
            searchInput.focus();
        }
    }
    
    // Escape to close sidebar on mobile
    if (e.key === 'Escape') {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('open');
        }
    }
});

// ============================================
// UTILITY FUNCTIONS
// ============================================

function formatDate(date) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

function getInitials(name) {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
}

// ============================================
// INITIALIZATION
// ============================================

console.log('Admin Panel initialized successfully!');
