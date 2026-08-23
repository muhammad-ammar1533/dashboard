// Dashboard Data
const dashboardData = {
    totalEarnings: 12450,
    currentLevel: 5,
    levelProgress: 65,
    monthlyData: [
        { month: 'Jan', earnings: 2100 },
        { month: 'Feb', earnings: 2400 },
        { month: 'Mar', earnings: 2800 },
        { month: 'Apr', earnings: 2200 },
        { month: 'May', earnings: 3100 },
        { month: 'Jun', earnings: 2900 },
        { month: 'Jul', earnings: 3400 },
        { month: 'Aug', earnings: 3240 },
        { month: 'Sep', earnings: 2600 },
        { month: 'Oct', earnings: 3050 },
        { month: 'Nov', earnings: 2800 },
        { month: 'Dec', earnings: 2960 }
    ],
    earningDays: [5, 12, 18, 23, 28] // Example days with earnings
};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', () => {
    initializeStats();
    initializeChart();
    initializeCalendar();
    initializeLevels();
});

// Initialize Stats
function initializeStats() {
    document.getElementById('totalEarnings').textContent = formatCurrency(dashboardData.totalEarnings);
    document.getElementById('monthEarnings').textContent = formatCurrency(dashboardData.monthlyData[7].earnings);
    document.getElementById('levelNumber').textContent = dashboardData.currentLevel;
    document.getElementById('progressPercent').textContent = dashboardData.levelProgress;
    document.getElementById('levelProgress').style.width = dashboardData.levelProgress + '%';
}

// Format Currency
function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}

// Initialize Chart
let chart = null;

function initializeChart() {
    const ctx = document.getElementById('earningsChart').getContext('2d');
    
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: dashboardData.monthlyData.map(d => d.month),
            datasets: [{
                label: 'Monthly Earnings',
                data: dashboardData.monthlyData.map(d => d.earnings),
                borderColor: '#3b82f6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 5,
                pointBackgroundColor: '#3b82f6',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointHoverRadius: 7,
                pointHoverBackgroundColor: '#60a5fa'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#cbd5e1',
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(15, 33, 56, 0.9)',
                    titleColor: '#ffffff',
                    bodyColor: '#cbd5e1',
                    borderColor: '#3b82f6',
                    borderWidth: 1,
                    padding: 10,
                    callbacks: {
                        label: function(context) {
                            return '$' + formatCurrency(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(59, 130, 246, 0.1)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#cbd5e1',
                        callback: function(value) {
                            return '$' + formatCurrency(value);
                        }
                    }
                },
                x: {
                    grid: {
                        display: false,
                        drawBorder: false
                    },
                    ticks: {
                        color: '#cbd5e1'
                    }
                }
            }
        }
    });
}

// Calendar Functions
let currentDate = new Date();

function initializeCalendar() {
    renderCalendar();
    
    document.getElementById('prevMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const calendar = document.getElementById('calendar');
    calendar.innerHTML = '';
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // Update month display
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    document.getElementById('currentMonth').textContent = `${monthNames[month]} ${year}`;
    
    // Get first day of month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    
    // Add previous month's days
    for (let i = firstDay - 1; i >= 0; i--) {
        const dayDiv = createCalendarDay(daysInPrevMonth - i, true);
        calendar.appendChild(dayDiv);
    }
    
    // Add current month's days
    const today = new Date();
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = createCalendarDay(day, false);
        
        // Highlight today
        if (day === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            dayDiv.classList.add('today');
        }
        
        // Highlight earning days
        if (dashboardData.earningDays.includes(day)) {
            dayDiv.classList.add('earning-day');
            dayDiv.title = `Earned $${dashboardData.monthlyData[month].earnings / 5}`;
        }
        
        calendar.appendChild(dayDiv);
    }
    
    // Add next month's days
    const totalCells = calendar.children.length;
    const remainingCells = 42 - totalCells;
    for (let day = 1; day <= remainingCells; day++) {
        const dayDiv = createCalendarDay(day, true);
        calendar.appendChild(dayDiv);
    }
}

function createCalendarDay(day, isOtherMonth) {
    const dayDiv = document.createElement('div');
    dayDiv.className = 'calendar-day';
    dayDiv.textContent = day;
    
    if (isOtherMonth) {
        dayDiv.classList.add('other-month');
    }
    
    return dayDiv;
}

// Initialize Levels
function initializeLevels() {
    const levelItems = document.querySelectorAll('.level-item');
    
    levelItems.forEach((item, index) => {
        const levelNum = index + 1;
        
        if (levelNum < dashboardData.currentLevel) {
            item.classList.remove('locked');
            item.classList.add('unlocked');
        }
        
        item.addEventListener('click', () => {
            if (!item.classList.contains('locked')) {
                showLevelDetails(levelNum);
            }
        });
        
        // Add hover tooltip
        item.addEventListener('mouseenter', () => {
            if (!item.classList.contains('locked')) {
                const tooltip = createTooltip(levelNum);
                item.appendChild(tooltip);
            }
        });
        
        item.addEventListener('mouseleave', () => {
            const tooltip = item.querySelector('.level-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
}

function createTooltip(level) {
    const tooltip = document.createElement('div');
    tooltip.className = 'level-tooltip';
    tooltip.textContent = `Level ${level}`;
    tooltip.style.cssText = `
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(0, 0, 0, 0.9);
        color: #60a5fa;
        padding: 0.5rem 1rem;
        border-radius: 0.5rem;
        white-space: nowrap;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
        z-index: 1000;
    `;
    return tooltip;
}

function showLevelDetails(level) {
    const levelNames = [
        'Starter',
        'Beginner',
        'Amateur',
        'Professional',
        'Expert',
        'Master',
        'Legend',
        'God Tier'
    ];
    
    const levelBenefits = [
        'Access to basic features',
        'Learn earning strategies',
        'Join community forums',
        'Get professional tools',
        'Priority support',
        'Exclusive masterclasses',
        'VIP perks',
        'Lifetime premium access'
    ];
    
    alert(`Level ${level} - ${levelNames[level - 1]}\n\nBenefits:\n${levelBenefits[level - 1]}`);
}

// Animate stats on load
window.addEventListener('load', () => {
    animateStatValues();
});

function animateStatValues() {
    const totalElem = document.getElementById('totalEarnings');
    const monthElem = document.getElementById('monthEarnings');
    
    animateNumber(totalElem, 0, dashboardData.totalEarnings, 1500);
    animateNumber(monthElem, 0, dashboardData.monthlyData[7].earnings, 1500);
}

function animateNumber(element, start, end, duration) {
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        
        element.textContent = formatCurrency(Math.round(current));
    }, 16);
}

// Add interactivity to stat cards
document.querySelectorAll('.stat-card').forEach(card => {
    card.addEventListener('click', function() {
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = '';
        }, 150);
    });
});

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        document.getElementById('prevMonth').click();
    } else if (e.key === 'ArrowRight') {
        document.getElementById('nextMonth').click();
    }
});

// Live clock update (optional)
function updateTime() {
    const now = new Date();
    // You can add a time display if needed
}

setInterval(updateTime, 1000);