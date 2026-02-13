import Storage from './Storage.js';

const DailyReport = {
    render: () => {
        const container = document.createElement('div');
        container.className = 'max-w-5xl mx-auto bg-white border border-gray-300 p-4 shadow-inner text-gray-800 font-sans';

        // Load settings and date
        const settings = Storage.get('app_settings') || {};
        const currentDateStr = settings.last_daily_date || new Date().toISOString().split('T')[0];
        const dataKey = `daily_v3_${currentDateStr}`;
        const activeData = Storage.get(dataKey) || {};

        container.innerHTML = `
            <div class="mx-auto">
                <!-- Top Header Section -->
                <div class="flex flex-wrap justify-between items-center gap-4 mb-6 border-b-2 border-accent-yellow pb-3">
                    <div class="bg-accent-yellow px-5 py-2 rounded-xl font-bold text-xl shadow-sm border border-yellow-300 whitespace-nowrap">
                        我的日報表 <span class="text-sm font-normal ml-1">標準版</span>
                    </div>
                    
                    <!-- Simplified Date Picker with Glassmorphism -->
                    <div class="flex items-center space-x-3">
                        <div class="relative group cursor-pointer">
                            <div class="absolute inset-0 bg-white/30 backdrop-blur-md rounded-xl border border-white/20 shadow-sm pointer-events-none group-hover:bg-white/40 transition-colors"></div>
                            <div class="relative flex items-center px-4 py-2 pointer-events-none">
                                <i data-lucide="calendar" class="w-5 h-5 text-gray-700 mr-2"></i>
                                <div class="text-xl font-bold text-gray-800 tracking-tight">
                                    <span id="display_full_date"></span>
                                </div>
                            </div>
                            <input type="date" id="report_date_picker" value="${currentDateStr}" 
                                class="absolute inset-0 opacity-0 pointer-events-none invisible h-0 w-0">
                        </div>
                    </div>
                </div>

                <!-- Power Phrase -->
                <div class="mb-6 flex items-center">
                    <span class="text-sm font-bold mr-3 whitespace-nowrap">提振精神的一句話：</span>
                    <input type="text" id="daily_spirit" 
                        class="flex-grow border-b border-gray-300 focus:outline-none focus:border-brand-500 py-1 px-2 text-gray-700 text-sm"
                        placeholder="Enter your power phrase..." value="${activeData.daily_spirit || ''}">
                </div>

                <!-- Dreams and Hopes Bar -->
                <div class="mb-6">
                    <div class="bg-accent-yellow bg-opacity-30 border-t border-b border-accent-yellow py-1 text-center font-bold text-sm tracking-widest text-gray-700">
                        夢想 ∙ 希望
                    </div>
                    <textarea id="daily_dreams" rows="2" 
                        class="w-full border-b border-gray-200 py-2 text-center focus:outline-none resize-none overflow-hidden text-sm"
                        placeholder="What are your dreams and hopes?">${activeData.daily_dreams || ''}</textarea>
                </div>

                <!-- Main Table Body (14 Column Grid) -->
                <div class="grid grid-cols-14 border border-gray-600 relative overflow-visible" style="border-bottom: 0;">
                    
                    <!-- Current Time Line (Spanning cols 1-4: Time + Plan) -->
                    <div id="current-time-line" class="absolute left-0 right-0 z-50 pointer-events-none hidden" style="height: 2px;">
                        <div class="absolute left-0 top-0 h-[2px] flex items-center" style="width: 28.57%;"> <!-- (4/14 * 100) -->
                             <!-- Glassmorphic Time Badge (Vertically Centered on Line) -->
                             <div id="time-badge" class="absolute left-[6px] top-1/2 -translate-y-1/2 bg-red-500/10 backdrop-blur-md text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm border border-red-500/30 whitespace-nowrap min-w-[50px] text-center z-50">
                                12:31 PM
                             </div>
                             <!-- The actual red line -->
                             <div id="timeline-line-inner" class="w-full h-full bg-red-500 transition-opacity duration-300"></div>
                        </div>
                    </div>

                <!-- Table Header Row -->
                <div class="col-span-1 border-r border-b border-gray-600 bg-gray-50 p-2 text-xs font-bold text-center">時間</div>
                <div class="col-span-3 border-r border-b border-gray-600 bg-accent-yellow/10 p-2 text-xs font-bold text-center">今日預定</div>
                <div class="col-span-3 border-r border-b border-gray-600 bg-brand-50/10 p-2 text-xs font-bold text-center">實際結果</div>
                <div class="col-span-3 border-r border-b border-gray-600 bg-gray-50 p-2 text-xs font-bold text-center flex items-center justify-center space-x-1">
                    <span>空檔任務</span>
                    <i data-lucide="check-square" class="w-3.5 h-3.5"></i>
                </div>
                <div class="col-span-2 border-r border-b border-gray-600 bg-gray-50 p-2 text-xs font-bold text-center">耗時任務</div>
                <div class="col-span-2 border-b border-gray-600 bg-gray-50 p-2 text-xs font-bold text-center">期限</div>

                <!-- 7:00 - 11:00 (Full Width rows) -->
                ${renderRows(activeData, 7, 11, true)}

                <!-- 12:00 row starts the sidebar spanning -->
                ${renderRow12AndSidebar(activeData)}

                <!-- 13:00 - 16:00 (Only first 10 columns as sidebar is spanned) -->
                ${renderRows(activeData, 13, 16, false)}

                <!-- 17:00 - 22:00 (Transition) -->
                ${renderLowerRows(activeData)}
            </div>

            <!-- Bottom Reflection Section (Act & Review) -->
            <div class="grid grid-cols-2 border border-gray-600 border-t-0">
                <div class="border-r border-b border-gray-400 p-2 min-h-[120px]">
                    <div class="bg-accent-yellow bg-opacity-20 text-xs font-bold border-b border-gray-200 mb-1.5 text-left">順利的事 (Good job) ∙ 感謝</div>
                    <textarea id="reflect_good" class="w-full h-24 text-sm resize-none focus:outline-none bg-transparent">${activeData.reflect_good || ''}</textarea>
                </div>
                <div class="border-b border-gray-400 p-2 min-h-[120px]">
                    <div class="bg-accent-yellow bg-opacity-20 text-xs font-bold border-b border-gray-200 mb-1.5 text-left">規則化</div>
                    <textarea id="reflect_system" class="w-full h-24 text-sm resize-none focus:outline-none bg-transparent">${activeData.reflect_system || ''}</textarea>
                </div>
                <div class="border-r border-b border-gray-400 p-2 min-h-[120px]">
                    <div class="bg-accent-yellow bg-opacity-20 text-xs font-bold border-b border-gray-200 mb-1.5 text-left">不順利的事 (Bad job) ∙ 反省</div>
                    <textarea id="reflect_bad" class="w-full h-24 text-sm resize-none focus:outline-none bg-transparent">${activeData.reflect_bad || ''}</textarea>
                </div>
                <div class="border-b border-gray-400 p-2 min-h-[120px]">
                    <div class="bg-accent-yellow bg-opacity-20 text-xs font-bold border-b border-gray-200 mb-1.5 text-left">改善方法</div>
                    <textarea id="reflect_improve" class="w-full h-24 text-sm resize-none focus:outline-none bg-transparent">${activeData.reflect_improve || ''}</textarea>
                </div>
                <div class="border-r border-gray-600 p-2 min-h-[100px]">
                    <div class="bg-accent-yellow bg-opacity-20 text-xs font-bold border-b border-gray-200 mb-1.5 text-left">鼓勵 ∙ 為自己加油</div>
                    <textarea id="reflect_encourage" class="w-full h-16 text-sm resize-none focus:outline-none bg-transparent">${activeData.reflect_encourage || ''}</textarea>
                </div>
                <div class="p-2 min-h-[100px]">
                    <div class="bg-accent-yellow bg-opacity-20 text-xs font-bold border-b border-gray-200 mb-1.5 text-left">備忘錄</div>
                    <textarea id="reflect_memo" class="w-full h-16 text-sm resize-none focus:outline-none bg-transparent">${activeData.reflect_memo || ''}</textarea>
                </div>
                </div>
            </div>
        `;

        // Initialize functionality
        setTimeout(() => {
            const inputs = container.querySelectorAll('textarea, input');
            inputs.forEach(input => {
                if (input.id === 'report_date_picker') return;

                const eventType = input.type === 'checkbox' ? 'change' : 'input';
                input.addEventListener(eventType, (e) => {
                    const id = e.target.id || e.target.getAttribute('data-id');
                    if (!id) return;
                    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
                    const data = Storage.get(dataKey) || {};
                    data[id] = value;
                    Storage.save(dataKey, data);

                    // Dynamic styling for Gap Task checkboxes
                    if (id.startsWith('check_')) {
                        const hour = id.split('_')[1];
                        const gapInput = container.querySelector(`[data-id="gap_${hour}"]`);
                        if (gapInput) {
                            if (value) {
                                gapInput.classList.add('line-through', 'text-gray-400');
                                gapInput.classList.remove('text-gray-800');
                            } else {
                                gapInput.classList.remove('line-through', 'text-gray-400');
                                gapInput.classList.add('text-gray-800');
                            }
                        }
                    }

                    // Update timeline transparency if editing a plan
                    if (id.startsWith('plan_')) {
                        updateTimeLine();
                    }
                });
            });

            // Date Picker Logic
            const datePickerContainer = document.getElementById('report_date_picker').parentElement;
            datePickerContainer.addEventListener('click', () => {
                const picker = document.getElementById('report_date_picker');
                if (picker.showPicker) {
                    picker.showPicker();
                } else {
                    picker.focus();
                    picker.click();
                }
            });

            document.getElementById('report_date_picker').addEventListener('change', (e) => {
                const settings = Storage.get('app_settings') || {};
                settings.last_daily_date = e.target.value;
                Storage.save('app_settings', settings);
                window.dispatchEvent(new CustomEvent('render-tab', { detail: 'Daily Report' }));
            });

            // Set dynamic labels
            const d = new Date(currentDateStr);
            const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
            const dayName = days[d.getDay()];
            const fullDateStr = `${currentDateStr} ${dayName}`;
            document.getElementById('display_full_date').textContent = fullDateStr;

            // Update Time Line
            updateTimeLine();
            setInterval(updateTimeLine, 60000);

            if (window.lucide) window.lucide.createIcons();
        }, 0);

        return container;
    }
};

function updateTimeLine() {
    const timeLine = document.getElementById('current-time-line');
    if (!timeLine) return;

    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const startHour = 7;
    const endHour = 22;
    const rowHeight = 28.5;
    const headerHeight = 31.5;

    if (hour >= startHour && hour <= endHour) {
        const offsetHours = hour - startHour;
        const totalMinutes = offsetHours * 60 + min;

        const topPos = headerHeight + (totalMinutes * (rowHeight / 60));
        timeLine.style.top = `${topPos}px`;
        timeLine.style.display = 'block';

        // Update badge text and line transparency
        const badge = document.getElementById('time-badge');
        const lineInner = document.getElementById('timeline-line-inner');

        if (badge) {
            const displayHour = hour % 12 || 12;
            const ampm = hour >= 12 ? 'PM' : 'AM';
            const displayMin = String(min).padStart(2, '0');
            badge.textContent = `${displayHour}:${displayMin} ${ampm}`;
        }

        if (lineInner) {
            // Find the input for the current hour's plan
            const planInput = document.querySelector(`[data-id="plan_${hour}"]`);
            const hasContent = planInput && planInput.value.trim() !== '';
            lineInner.style.opacity = hasContent ? '0.4' : '1';
        }
    } else {
        timeLine.style.display = 'none';
    }
}

function renderRows(savedData, start, end, includeSidebar) {
    let html = '';
    for (let h = start; h <= end; h++) {
        html += `
            <div class="col-span-1 border-r border-b border-gray-600 flex items-center justify-center text-[10px] h-[28.5px] bg-gray-50/20 relative z-20 text-gray-500 font-medium">
                ${formatHourLabel(h)}
            </div>
            <div class="col-span-3 border-r border-b border-gray-600 relative z-20">
                <input type="text" data-id="plan_${h}" class="w-full h-full text-sm px-1.5 focus:outline-none bg-transparent" value="${savedData[`plan_${h}`] || ''}">
            </div>
            <div class="col-span-3 border-r border-b border-gray-600 relative z-20">
                <input type="text" data-id="actual_${h}" class="w-full h-full text-sm px-1.5 focus:outline-none bg-transparent" value="${savedData[`actual_${h}`] || ''}">
            </div>
            <div class="col-span-3 border-r border-b border-gray-600 flex items-center pr-1.5 relative z-20">
                <input type="text" data-id="gap_${h}" 
                    class="flex-grow h-full text-sm px-1.5 focus:outline-none bg-transparent ${savedData[`check_${h}`] ? 'line-through text-gray-400' : 'text-gray-800'}" 
                    value="${savedData[`gap_${h}`] || ''}">
                <input type="checkbox" data-id="check_${h}" class="w-4 h-4 cursor-pointer ml-1" ${savedData[`check_${h}`] ? 'checked' : ''}>
            </div>
            ${includeSidebar ? `
                <div class="col-span-2 border-r border-b border-gray-600">
                    <input type="text" data-id="time_task_${h}" class="w-full h-full text-[13px] px-1.5 focus:outline-none bg-transparent" value="${savedData[`time_task_${h}`] || ''}">
                </div>
                <div class="col-span-2 border-b border-gray-600">
                    <input type="date" data-id="deadline_${h}" class="w-full h-full text-[11px] px-1 focus:outline-none bg-transparent border-0" value="${savedData[`deadline_${h}`] || ''}">
                </div>
            ` : ''}
        `;
    }
    return html;
}

function renderRow12AndSidebar(savedData) {
    return `
        <!-- Row 12:00 -->
        <div class="col-span-1 border-r border-b border-gray-600 flex items-center justify-center text-[10px] h-[28.5px] bg-gray-50/20 relative z-20 text-gray-500 font-medium">
            12 PM
        </div>
        <div class="col-span-3 border-r border-b border-gray-600 relative z-20">
            <input type="text" data-id="plan_12" class="w-full h-full text-sm px-1.5 focus:outline-none bg-transparent" value="${savedData.plan_12 || ''}">
        </div>
        <div class="col-span-3 border-r border-b border-gray-600 relative z-20">
            <input type="text" data-id="actual_12" class="w-full h-full text-sm px-1.5 focus:outline-none bg-transparent" value="${savedData.actual_12 || ''}">
        </div>
        <div class="col-span-3 border-r border-b border-gray-600 flex items-center pr-1.5 relative z-20">
            <input type="text" data-id="gap_12" 
                class="flex-grow h-full text-sm px-1.5 focus:outline-none bg-transparent ${savedData.check_12 ? 'line-through text-gray-400' : 'text-gray-800'}" 
                value="${savedData.gap_12 || ''}">
            <input type="checkbox" data-id="check_12" class="w-4 h-4 cursor-pointer ml-1" ${savedData.check_12 ? 'checked' : ''}>
        </div>
        
        <!-- Monthly To-dos Independent Box (Spanning 5 rows from 12:00 to 16:00) -->
        <div class="col-span-4 row-span-5 border-b border-gray-600 flex flex-col bg-white overflow-hidden p-2">
            <div class="bg-accent-yellow bg-opacity-20 text-[11px] font-bold text-center border-b border-gray-300 mb-1">本月想做的事</div>
            <textarea id="monthly_todos" class="flex-grow w-full text-sm leading-tight resize-none focus:outline-none bg-transparent">${savedData.monthly_todos || ''}</textarea>
        </div>
    `;
}

function renderLowerRows(savedData) {
    let html = '';
    const hours = [17, 18, 19, 20, 21, 22];
    hours.forEach((h, idx) => {
        html += `
            <div class="col-span-1 border-r border-b border-gray-600 flex items-center justify-center text-[10px] h-[28.5px] bg-gray-50/20 text-gray-500 font-medium">${formatHourLabel(h)}</div>
            <div class="col-span-3 border-r border-b border-gray-600">
                <input type="text" data-id="plan_${h}" class="w-full h-full text-sm px-1.5 focus:outline-none bg-transparent" value="${savedData[`plan_${h}`] || ''}">
            </div>
            <div class="col-span-3 border-r border-b border-gray-600">
                <input type="text" data-id="actual_${h}" class="w-full h-full text-sm px-1.5 focus:outline-none bg-transparent" value="${savedData[`actual_${h}`] || ''}">
            </div>
            
            ${idx === 0 ? `
                <div class="col-span-7 row-span-3 border-b border-gray-600 flex flex-col p-2 bg-white relative overflow-hidden">
                    <div class="bg-accent-yellow bg-opacity-20 text-[11px] font-bold text-center border-b border-gray-300 mb-1 relative z-10">今日目標</div>
                    <textarea id="today_goal" class="flex-grow w-full text-sm leading-tight resize-none focus:outline-none bg-transparent relative z-20">${savedData.today_goal || ''}</textarea>
                </div>
            ` : ''}
            ${idx === 3 ? `
                <div class="col-span-7 row-span-3 border-b border-gray-600 flex flex-col p-2 bg-white relative overflow-hidden">
                    <div class="bg-accent-yellow bg-opacity-20 text-[11px] font-bold text-center border-b border-gray-300 mb-1 relative z-10">今日結果</div>
                    <textarea id="today_result" class="flex-grow w-full text-sm leading-tight resize-none focus:outline-none bg-transparent relative z-20">${savedData.today_result || ''}</textarea>
                </div>
            ` : ''}
        `;
    });
    return html;
}

function formatHourLabel(h) {
    const displayHour = h % 12 || 12;
    const ampm = h >= 12 ? 'PM' : 'AM';
    return `${displayHour} ${ampm}`;
}

export default DailyReport;
