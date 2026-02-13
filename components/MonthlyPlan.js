import Storage from './Storage.js';

const MonthlyPlan = {
    render: () => {
        const container = document.createElement('div');
        container.className = 'space-y-6 animate-fade-in pb-12';

        // Header with Month Selector
        const currentDate = new Date();
        const initialMonth = currentDate.getMonth(); // 0-11

        container.innerHTML = `
            <div class="mx-auto">
                <div class="flex flex-col md:flex-row justify-between items-center mb-6">
                    <div class="text-center md:text-left mb-4 md:mb-0">
                        <h2 class="text-2xl font-bold text-gray-800">Monthly Plan</h2>
                        <p class="text-gray-500 text-sm">Track your daily progress for the month.</p>
                    </div>
                    
                    <div class="flex items-center space-x-3 bg-white p-2 rounded-lg shadow-sm border border-gray-100">
                        <!-- Today Button -->
                        <button id="today_btn" class="px-4 py-1.5 bg-brand-500 text-white rounded-md text-sm font-medium hover:bg-brand-600 transition-colors shadow-sm">
                            Today
                        </button>
                        <div class="h-6 w-[1px] bg-gray-200"></div>
                        <select id="month_selector" class="bg-transparent text-gray-700 font-medium focus:outline-none cursor-pointer">
                            ${renderMonthOptions(initialMonth)}
                        </select>
                    </div>
                </div>

                <!-- List Header (Sticky) -->
                <div class="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-500 border-b border-gray-200 pb-2 hidden md:grid sticky top-[64px] z-40 bg-white pt-2 shadow-sm">
                    <div class="col-span-1 text-center">Date</div>
                    <div class="col-span-2">Morning (7:00~)</div>
                    <div class="col-span-2">Afternoon (12:00~)</div>
                    <div class="col-span-2">Evening (17:00~)</div>
                    <div class="col-span-5">Summary / Notes</div>
                </div>

                <div id="days_container" class="space-y-2 pb-6">
                    <!-- Days will be injected here -->
                </div>
            </div>
        `;

        // Event Listeners for Selector
        setTimeout(() => {
            const selector = container.querySelector('#month_selector');
            const daysContainer = container.querySelector('#days_container');
            const todayBtn = container.querySelector('#today_btn');
            const timeBadge = container.querySelector('#time-badge');

            // Initial render of days
            renderDays(daysContainer, initialMonth);

            selector.addEventListener('change', (e) => {
                renderDays(daysContainer, parseInt(e.target.value));
            });

            // Today button logic
            todayBtn.addEventListener('click', () => {
                const now = new Date();
                const currentMonth = now.getMonth();
                const currentDay = now.getDate();

                if (parseInt(selector.value) !== currentMonth) {
                    selector.value = currentMonth;
                    renderDays(daysContainer, currentMonth);
                }

                setTimeout(() => {
                    const targetRow = container.querySelector(`[data-day-row="${currentDay}"]`);
                    if (targetRow) {
                        targetRow.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        targetRow.classList.add('row-highlight');
                        setTimeout(() => {
                            targetRow.classList.remove('row-highlight');
                        }, 1000);
                    }
                }, 50);
            });
        }, 0);

        return container;
    },

    afterRender: () => {
        // Data loading is handled within renderDays to ensure dynamic content is ready
    }
};

function renderMonthOptions(selectedMonth) {
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return months.map((m, i) => `
        <option value="${i}" ${i === selectedMonth ? 'selected' : ''}>${m}</option>
    `).join('');
}

function renderDays(container, monthIndex) {
    container.innerHTML = '';
    const year = new Date().getFullYear();
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

    // Load Data for this month
    const monthKey = `monthly_data_${monthIndex}`;
    const savedData = Storage.get(monthKey) || {};

    for (let i = 1; i <= daysInMonth; i++) {
        const dayRow = document.createElement('div');
        dayRow.className = 'grid grid-cols-1 md:grid-cols-12 gap-2 p-3 bg-white rounded-lg border border-gray-100 items-start hover:shadow-sm transition-shadow duration-200 group relative';
        dayRow.setAttribute('data-day-row', i);

        // Check if there is daily report content for this day
        const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
        const dailyDataKey = `daily_v3_${dateStr}`;
        const dailyData = Storage.get(dailyDataKey) || {};

        // Content exists if any key has a value that is NOT empty (checkbox false or empty string)
        const hasDailyContent = Object.values(dailyData).some(val => {
            if (typeof val === 'string') return val.trim() !== '';
            if (typeof val === 'boolean') return val === true;
            return false;
        });
        const btnClass = hasDailyContent
            ? 'bg-accent-yellow text-yellow-800 border-yellow-400 hover:bg-yellow-300'
            : 'bg-brand-50 text-brand-600 border-brand-100 hover:bg-brand-100';

        // Date Badge
        dayRow.innerHTML = `
            <div class="col-span-1 flex md:justify-center items-center mb-2 md:mb-0">
                <button type="button" data-jump-date="${dateStr}" class="w-8 h-8 rounded-full ${btnClass} font-bold flex items-center justify-center text-sm border transition-colors shadow-sm cursor-pointer" title="${hasDailyContent ? 'Go to Daily Report' : 'Day ' + i}">
                    ${i}
                </button>
                <span class="md:hidden ml-2 font-medium text-gray-700">Day ${i}</span>
            </div>

            <!-- Mobile: Stacked inputs. Desktop: Grid columns -->
            <div class="col-span-11 grid grid-cols-1 md:grid-cols-11 gap-2 w-full">
                <!-- Morning -->
                <div class="md:col-span-2 relative">
                    <label class="block md:hidden text-xs text-gray-400 mb-1">Morning (7:00~)</label>
                    <input type="text" data-day="${i}" data-field="morning" 
                        class="w-full bg-gray-50 border-0 rounded px-2 py-1 text-sm focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
                        placeholder="Morning task..." value="${savedData[`day_${i}_morning`] || ''}">
                </div>
                
                <!-- Afternoon -->
                <div class="md:col-span-2 relative">
                    <label class="block md:hidden text-xs text-gray-400 mb-1">Afternoon (12:00~)</label>
                    <input type="text" data-day="${i}" data-field="afternoon"
                        class="w-full bg-gray-50 border-0 rounded px-2 py-1 text-sm focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
                        placeholder="Afternoon task..." value="${savedData[`day_${i}_afternoon`] || ''}">
                </div>

                <!-- Evening -->
                <div class="md:col-span-2 relative">
                    <label class="block md:hidden text-xs text-gray-400 mb-1">Evening (17:00~)</label>
                    <input type="text" data-day="${i}" data-field="evening"
                        class="w-full bg-gray-50 border-0 rounded px-2 py-1 text-sm focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
                        placeholder="Evening task..." value="${savedData[`day_${i}_evening`] || ''}">
                </div>

                <!-- Summary -->
                <div class="md:col-span-5 relative">
                    <label class="block md:hidden text-xs text-gray-400 mb-1">Summary</label>
                    <input type="text" data-day="${i}" data-field="summary"
                        class="w-full bg-gray-50 border-0 rounded px-2 py-1 text-sm focus:bg-white focus:ring-1 focus:ring-brand-500 transition-colors"
                        placeholder="Daily note..." value="${savedData[`day_${i}_summary`] || ''}">
                </div>
            </div>
        `;

        container.appendChild(dayRow);
    }

    // Attach listeners to new inputs
    const inputs = container.querySelectorAll('input');
    inputs.forEach(input => {
        input.addEventListener('change', (e) => {
            const day = e.target.getAttribute('data-day');
            const field = e.target.getAttribute('data-field');
            const val = e.target.value;

            // Reload fresh data to avoid overwrites
            const currentData = Storage.get(monthKey) || {};
            currentData[`day_${day}_${field}`] = val;
            Storage.save(monthKey, currentData);
        });
    });

    // Attach listeners to jump-date buttons
    const jumpButtons = container.querySelectorAll('[data-jump-date]');
    jumpButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            const date = e.currentTarget.getAttribute('data-jump-date');
            if (date) {
                // Update settings to target this date
                const settings = Storage.get('app_settings') || {};
                settings.last_daily_date = date;
                Storage.save('app_settings', settings);

                // Switch to Daily Report tab using the global function
                if (window.switchTab) {
                    window.switchTab('daily');
                } else {
                    // Fallback: try clicking the button
                    const navDaily = Array.from(document.querySelectorAll('button')).find(btn =>
                        btn.querySelector('i[data-lucide="calendar-check"]')
                    );
                    if (navDaily) {
                        navDaily.click();
                    }
                }
            }
        });
    });
}

export default MonthlyPlan;
