import Storage from './Storage.js';

const Schedule = {
    render: () => {
        const container = document.createElement('div');
        container.className = 'schedule-component';

        container.innerHTML = `
            <div class="topbar-component flex justify-between items-center mb-4">
                <div id="dateRangeLabel" class="text-sm text-gray-400"></div>
            </div>
            
            <div class="tabs-sub mb-4 border-b border-gray-200 flex">
                <button class="sub-tab-btn active p-2 px-4 text-sm font-medium border-b-2 border-brand-500" data-subtab="schedule">Schedule</button>
                <button class="sub-tab-btn p-2 px-4 text-sm font-medium border-b-2 border-transparent text-gray-400" data-subtab="dashboard">Dashboard</button>
            </div>

            <!-- SCHEDULE PANEL -->
            <div class="panel-sub active" id="panel-schedule">
                <div class="controls-row flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div class="legend flex flex-wrap gap-2" id="legend"></div>
                    <select class="week-select bg-white border border-gray-200 rounded-lg p-1 px-2 text-sm" id="weekSelect"></select>
                </div>
                <div class="gantt-container overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div class="week-card-header p-3 bg-gray-50 border-b border-gray-200 font-semibold text-sm" id="weekCardHeader"></div>
                    <div class="gantt-scroll overflow-x-auto p-2">
                        <div class="gantt grid" id="gantt"></div>
                    </div>
                </div>
            </div>

            <!-- DASHBOARD PANEL -->
            <div class="panel-sub hidden" id="panel-dashboard">
                <div class="dash-container">
                    <div class="dash-grid grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div class="dash-card bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="text-sm font-semibold mb-3 flex items-center gap-2"><span>⚙️</span> Date Range</h3>
                            <div class="date-row flex gap-4">
                                <div class="flex-1 text-xs font-semibold text-gray-400 flex flex-col gap-1">
                                    <label>START DATE</label>
                                    <input type="date" id="inputStartDate" class="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-800"/>
                                </div>
                                <div class="flex-1 text-xs font-semibold text-gray-400 flex flex-col gap-1">
                                    <label>END DATE</label>
                                    <input type="date" id="inputEndDate" class="w-full border border-gray-200 rounded-lg p-2 text-sm text-gray-800"/>
                                </div>
                            </div>
                            <div class="date-info text-[10px] text-gray-400 mt-2" id="dateInfo"></div>
                        </div>
                        
                        <div class="dash-card bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="text-sm font-semibold mb-3 flex items-center gap-2"><span>🏷️</span> Manage Tags</h3>
                            <div class="tag-mgmt-row flex gap-2">
                                <input type="text" id="newTagInput" placeholder="New tag name..." class="flex-1 border border-gray-200 rounded-lg p-2 text-sm"/>
                                <button class="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-semibold" id="addTagBtn">Add Tag</button>
                            </div>
                            <div class="existing-tags flex flex-wrap gap-2 mt-4" id="existingTags"></div>
                        </div>
                        
                        <div class="dash-card bg-white p-4 rounded-xl border border-gray-200 shadow-sm col-span-1 lg:col-span-2">
                            <div class="dash-card-header flex justify-between items-center mb-4">
                                <h3 class="text-sm font-semibold flex items-center gap-2"><span>📋</span> Category Tags & Goals</h3>
                                <div class="flex items-center gap-2">
                                    <select class="chart-week-select bg-white border border-gray-200 rounded-lg p-1 px-2 text-sm" id="chartWeekSelect"></select>
                                    <button class="bg-gray-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1" id="refreshBtn">↻ Refresh</button>
                                </div>
                            </div>
                            <table class="tag-table w-full text-xs text-left">
                                <thead class="border-b border-gray-100">
                                    <tr class="text-gray-400 uppercase tracking-wider">
                                        <th class="py-2 w-6"></th>
                                        <th class="py-2">Category</th>
                                        <th class="py-2">Tags</th>
                                        <th class="py-2 w-20">Goal (h)</th>
                                        <th class="py-2 w-8"></th>
                                    </tr>
                                </thead>
                                <tbody id="tagTableBody"></tbody>
                            </table>
                            <div class="add-cat-row flex gap-2 mt-4 pt-4 border-t border-gray-100">
                                <input type="text" id="newCatName" placeholder="New category name..." class="flex-1 border border-gray-200 rounded-lg p-2 text-sm"/>
                                <input type="color" id="newCatColor" value="#c8dbe8" class="w-10 h-10 border border-gray-200 rounded-lg p-1 cursor-pointer"/>
                                <button class="bg-gray-800 text-white px-4 py-2 rounded-lg text-xs font-semibold" id="addCatBtn">+ Add Category</button>
                            </div>
                        </div>
                        
                        <div class="dash-card bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="text-sm font-semibold mb-3 flex items-center gap-2"><span>📊</span> Hours by Category</h3>
                            <div id="chartCategory"></div>
                        </div>
                        
                        <div class="dash-card bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                            <h3 class="text-sm font-semibold mb-3 flex items-center gap-2"><span>📈</span> Hours by Tag</h3>
                            <div id="chartTag"></div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- MODAL OVERLAY -->
            <div class="modal-overlay fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] hidden items-center justify-center p-4" id="modalOverlay">
                <div class="modal bg-white rounded-2xl border border-gray-200 shadow-2xl p-6 w-full max-w-sm">
                    <h3 class="text-lg font-bold mb-4">Add Event</h3>
                    
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">NAME</label>
                    <input type="text" id="modalName" placeholder="e.g. Meeting" class="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm mb-4 outline-none focus:border-brand-500"/>
                    
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">TIME</label>
                    <div class="time-picker-row flex items-center justify-center gap-4 mb-4">
                        <div class="scroll-picker flex flex-col items-center">
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="shUp">▲</button>
                            <div class="sp-val text-xl font-bold py-1" id="shVal">8</div>
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="shDn">▼</button>
                        </div>
                        <span class="text-xl font-bold text-gray-300">:</span>
                        <div class="scroll-picker flex flex-col items-center">
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="smUp">▲</button>
                            <div class="sp-val text-xl font-bold py-1" id="smVal">00</div>
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="smDn">▼</button>
                        </div>
                        <span class="text-xl font-bold text-gray-300 mx-1">—</span>
                        <div class="scroll-picker flex flex-col items-center">
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="ehUp">▲</button>
                            <div class="sp-val text-xl font-bold py-1" id="ehVal">9</div>
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="ehDn">▼</button>
                        </div>
                        <span class="text-xl font-bold text-gray-300">:</span>
                        <div class="scroll-picker flex flex-col items-center">
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="emUp">▲</button>
                            <div class="sp-val text-xl font-bold py-1" id="emVal">00</div>
                            <button class="sp-btn p-1 text-gray-400 hover:text-gray-800" id="emDn">▼</button>
                        </div>
                    </div>
                    
                    <label class="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">EVENT</label>
                    <div class="toggle-section mt-1">
                        <div class="text-[10px] text-gray-400 font-bold mb-1">TAG</div>
                        <div class="toggle-group flex flex-wrap gap-1 mb-3" id="modalTagToggles"></div>
                        <div class="text-[10px] text-gray-400 font-bold mb-1">CATEGORY</div>
                        <div class="toggle-group flex flex-wrap gap-1" id="modalCatToggles"></div>
                    </div>
                    
                    <div class="modal-actions flex gap-3 mt-8">
                        <button class="flex-1 p-3 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50" id="btnCancel">Cancel</button>
                        <button class="flex-1 p-3 rounded-xl bg-gray-900 text-white text-sm font-semibold hover:bg-black" id="btnAdd">Add</button>
                    </div>
                </div>
            </div>

            <!-- CONFIRM OVERLAY -->
            <div class="confirm-overlay fixed inset-0 bg-black/20 backdrop-blur-sm z-[200] hidden items-center justify-center p-4" id="confirmOverlay">
                <div class="confirm-box bg-white rounded-2xl border border-gray-200 shadow-2xl p-8 w-full max-w-xs text-center">
                    <p class="text-sm text-gray-600 mb-6 leading-relaxed" id="confirmMsg"></p>
                    <div class="confirm-actions flex gap-3">
                        <button class="flex-1 p-2.5 rounded-xl border border-gray-200 text-sm font-semibold hover:bg-gray-50" id="confirmNo">Cancel</button>
                        <button class="flex-1 p-2.5 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600" id="confirmYes">Delete</button>
                    </div>
                </div>
            </div>

            <div class="drag-time-indicator fixed bg-gray-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hidden pointer-events-none z-[300]" id="dragIndicator"></div>
        `;

        return container;
    },

    afterRender: () => {
        // Logic from schedule.js adapted as a module
        const HOUR_START = 5, HOUR_COUNT = 20, SNAP = 1 / 6;
        const HOURS = []; for (let i = 0; i < HOUR_COUNT; i++)HOURS.push((HOUR_START + i) % 24);
        const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        const MN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        function hourToOffset(h) { let m = h < HOUR_START ? h + 24 : h; return m - HOUR_START; }
        function fT(t) { const h = ((Math.floor(t) % 24) + 24) % 24, m = Math.round((t - Math.floor(t)) * 60); return `${h}:${m.toString().padStart(2, '0')}`; }
        function fTM(m) { const h = m % 24, mm = Math.round((m - Math.floor(m)) * 60); return `${Math.floor(h)}:${mm.toString().padStart(2, '0')}`; }
        function fDS(d) { return `${MN[d.getMonth()]} ${d.getDate()}`; }
        function pD(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
        function monOf(d) { const dt = new Date(d); const day = dt.getDay(); dt.setDate(dt.getDate() - (day === 0 ? 6 : day - 1)); return dt; }
        function addD(d, n) { const r = new Date(d); r.setDate(r.getDate() + n); return r; }
        function uid() { return crypto.randomUUID(); }
        function slugify(s) { return s.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 16); }

        const DEF_CATS = [
            { key: 'intern', label: 'Internship', bg: '#dce9f3', tags: ['work'], goals: {} },
            { key: 'course', label: 'Course', bg: '#ddeade', tags: ['study'], goals: {} },
            { key: 'french', label: 'French Class', bg: '#f5e6d3', tags: ['study'], goals: {} },
            { key: 'gym', label: 'Gym', bg: '#f3dce1', tags: ['health'], goals: {} },
            { key: 'dentist', label: 'Dentist', bg: '#f3d5d5', tags: ['health'], goals: {} },
            { key: 'writing', label: 'Writing / Prep', bg: '#e5ddf0', tags: ['study'], goals: {} },
            { key: 'tutor', label: 'Tutoring', bg: '#f2eacc', tags: ['work'], goals: {} },
            { key: 'cram', label: 'Cram School', bg: '#d3ece2', tags: ['work'], goals: {} },
            { key: 'buffer', label: 'Commute / Buffer', bg: '#eaeaea', tags: ['other'], goals: {} },
        ];
        const DEF_TAGS = ['work', 'study', 'health', 'other'];

        const SK = 'schedule_app_v6';
        let D = { startDate: '', endDate: '', categories: [], tags: [], weekEvents: [] };

        function cWeeks() {
            const s = monOf(pD(D.startDate)), e = pD(D.endDate), w = [];
            let c = new Date(s);
            while (c <= e) { const we = addD(c, 6); w.push({ start: new Date(c), end: we > e ? new Date(e) : we }); c = addD(c, 7); }
            return w;
        }
        function save() { Storage.save(SK, D); }
        function load() {
            const r = Storage.get(SK);
            if (r) { D = r; if (!D.tags) D.tags = DEF_TAGS; D.categories.forEach(c => { if (!c.goals) c.goals = {}; }); return; }
            const today = new Date(), s = monOf(today);
            D.startDate = today.toISOString().split('T')[0]; D.endDate = addD(s, 27).toISOString().split('T')[0];
            D.categories = JSON.parse(JSON.stringify(DEF_CATS)); D.tags = [...DEF_TAGS];
            D.weekEvents = cWeeks().map((_, i) => defEv(i)); save();
        }
        function defEv(wi) {
            const ev = [], p = (d, s, e, c, l) => ev.push({ day: d, start: s, end: e, cls: c, label: l, id: uid() });
            p(1, 9, 10, 'buffer', 'Commute'); p(1, 10, 19, 'intern', 'Internship'); p(1, 19, 20, 'buffer', 'Dinner'); p(1, 21, 23, 'writing', 'Writing / Prep');
            p(2, 9, 10, 'buffer', 'Commute'); p(2, 10, 19, 'intern', 'Internship'); p(2, 19, 20, 'buffer', 'Dinner'); p(2, 21, 23, 'writing', 'Writing / Prep');
            if (wi % 2 === 0) { p(3, 14, 15, 'buffer', 'Commute'); p(3, 15, 16, 'dentist', 'Dentist'); p(3, 16, 17, 'buffer', 'Buffer'); }
            p(3, 17, 18, 'gym', 'Gym'); p(3, 18, 19, 'buffer', 'Dinner'); p(3, 19, 22, 'french', 'French Class');
            p(4, 9, 10, 'buffer', 'Commute'); p(4, 10, 19, 'intern', 'Internship'); p(4, 19, 20, 'buffer', 'Dinner'); p(4, 20, 21, 'tutor', 'Tutoring'); p(4, 21, 23, 'writing', 'Writing / Prep');
            p(5, 8, 9, 'buffer', 'Commute'); p(5, 9, 16, 'course', 'Course'); p(5, 16, 18, 'writing', 'Writing / Prep');
            p(6, 10, 12, 'writing', 'Writing / Prep'); p(6, 14, 18, 'writing', 'Writing / Prep'); p(6, 20, 21, 'tutor', 'Tutoring');
            p(7, 11.5, 12.5, 'buffer', 'Commute'); p(7, 12.5, 15, 'cram', 'Cram School'); p(7, 15, 16, 'buffer', 'Buffer'); p(7, 16, 18, 'writing', 'Writing / Prep'); p(7, 20, 21, 'tutor', 'Tutoring');
            return ev;
        }

        function calcH(ev) { let s = ev.start, e = ev.end; if (e <= s) e += 24; return e - s; }

        function calcCatHours(weekIdx) {
            const catH = {}; D.categories.forEach(c => { catH[c.key] = 0; });
            const src = weekIdx === -1 ? D.weekEvents : (D.weekEvents[weekIdx] ? [D.weekEvents[weekIdx]] : []);
            src.forEach(wk => { (wk || []).forEach(ev => { if (catH[ev.cls] !== undefined) catH[ev.cls] += calcH(ev); }); });
            return catH;
        }

        // Elements
        const legendEl = document.getElementById('legend');
        const wSel = document.getElementById('weekSelect');
        const ganttEl = document.getElementById('gantt'), headerEl = document.getElementById('weekCardHeader'), drLabel = document.getElementById('dateRangeLabel');
        const dI = document.getElementById('dragIndicator');
        const mOv = document.getElementById('modalOverlay'), mNm = document.getElementById('modalName');
        const mTT = document.getElementById('modalTagToggles'), mCT = document.getElementById('modalCatToggles');
        const cfOv = document.getElementById('confirmOverlay'), cfMsg = document.getElementById('confirmMsg');
        const iSD = document.getElementById('inputStartDate'), iED = document.getElementById('inputEndDate'), dInfo = document.getElementById('dateInfo');
        const newTagIn = document.getElementById('newTagInput'), existTagsEl = document.getElementById('existingTags');
        const tTB = document.getElementById('tagTableBody');
        const cWS = document.getElementById('chartWeekSelect');
        const cCatEl = document.getElementById('chartCategory'), cTagEl = document.getElementById('chartTag');
        const shV = document.getElementById('shVal'), smV = document.getElementById('smVal'), ehV = document.getElementById('ehVal'), emV = document.getElementById('emVal');

        let curW = 0, chartWeek = 0, mDay = 1, selTag = '', selCat = '', dragRow = null, cfCb = null;
        let tpSH = 8, tpSM = 0, tpEH = 9, tpEM = 0;

        function renderLegend() {
            if (!legendEl) return;
            legendEl.innerHTML = '';
            const catH = calcCatHours(curW);
            D.categories.forEach(c => {
                const it = document.createElement('div');
                it.className = 'flex flex-col items-center bg-gray-50 border border-gray-100 rounded-xl p-1 px-3 min-w-[60px] cursor-default transition-all hover:bg-white hover:shadow-sm';
                const cur = Math.round((catH[c.key] || 0) * 10) / 10;
                const goal = c.goals && c.goals[curW] ? c.goals[curW] : null;
                let progressTxt = `${cur}h`;
                if (goal !== null && goal > 0) progressTxt = `${cur}/${goal}h`;
                it.innerHTML = `
                <div class="flex items-center gap-1.5 text-[10px] font-bold text-gray-600 truncate max-w-[80px]">
                    <span class="w-2 h-2 rounded-full" style="background:${c.bg}"></span>
                    ${c.label}
                </div>
                <div class="text-[9px] text-gray-400 font-medium">${progressTxt}</div>
            `;
                legendEl.appendChild(it);
            });
        }

        function rebuildWSel() {
            const w = cWeeks(); wSel.innerHTML = '';
            w.forEach((_, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `Week ${i + 1}`; wSel.appendChild(o); });
            if (curW >= w.length) curW = Math.max(0, w.length - 1); wSel.value = curW;
        }

        function renderSched() {
            const weeks = cWeeks(); if (!weeks.length) return;
            const wi = curW, wk = weeks[wi]; if (!wk) return;
            while (D.weekEvents.length < weeks.length) D.weekEvents.push([]);
            if (drLabel) drLabel.textContent = `${fDS(pD(D.startDate))} — ${fDS(pD(D.endDate))}`;
            if (headerEl) headerEl.innerHTML = `Week ${wi + 1} <span>${fDS(wk.start)} — ${fDS(wk.end)}</span>`;
            ganttEl.innerHTML = ''; ganttEl.style.gridTemplateColumns = `48px repeat(${HOUR_COUNT},1fr)`;
            const corner = document.createElement('div'); corner.className = 'text-[9px] text-gray-400 font-bold uppercase tracking-widest flex items-center justify-center border-b border-gray-100 p-2'; corner.textContent = 'DAY'; ganttEl.appendChild(corner);
            HOURS.forEach(h => {
                const th = document.createElement('div');
                th.className = 'text-[9px] text-gray-400 font-bold flex items-center justify-center border-b border-gray-100 p-2';
                th.textContent = `${h}:00`; ganttEl.appendChild(th);
            });
            for (let d = 1; d <= 7; d++) {
                const dt = addD(wk.start, d - 1);
                const dl = document.createElement('div');
                dl.className = 'flex flex-col items-center justify-center p-2 border-b border-gray-100 bg-gray-50/50';
                dl.innerHTML = `<span class="text-[10px] font-bold text-gray-600">${DAY_LABELS[d - 1]}</span><span class="text-[8px] text-gray-400">${dt.getMonth() + 1}/${dt.getDate()}</span>`;
                ganttEl.appendChild(dl);
                const row = document.createElement('div'); row.className = 'day-row grid-column-2 border-b border-gray-100 relative h-12 flex';
                row.style.gridColumn = '2 / -1';
                row.dataset.day = d;
                for (let i = 0; i < HOUR_COUNT; i++) {
                    const c = document.createElement('div');
                    c.className = 'flex-1 border-r border-gray-100/30 cursor-crosshair hover:bg-brand-50/20 transition-colors';
                    c.addEventListener('click', () => openModal(d, i)); row.appendChild(c);
                }
                (D.weekEvents[wi] || []).filter(e => e.day === d).forEach(ev => {
                    const oS = hourToOffset(ev.start), oE = hourToOffset(ev.end);
                    if (oS < 0 || oE <= oS || oS >= HOUR_COUNT) return;
                    const cat = D.categories.find(c => c.key === ev.cls);
                    const el = document.createElement('div');
                    el.className = `absolute top-1 bottom-1 rounded-lg flex items-center justify-center text-[9px] font-bold px-3 cursor-grab z-10 shadow-sm border border-black/5 overflow-hidden group`;
                    el.style.left = `${(oS / HOUR_COUNT) * 100}%`; el.style.width = `${((oE - oS) / HOUR_COUNT) * 100}%`;
                    el.style.backgroundColor = cat ? cat.bg : '#eee';
                    el.style.color = 'rgba(0,0,0,0.6)';
                    el.innerHTML = `
                <span class="absolute left-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-30 cursor-ew-resize bg-black resize-left"></span>
                <span class="truncate">${ev.label}</span>
                <div class="tooltip absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-gray-900 text-white text-[8px] p-1.5 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                    ${ev.label} | ${fT(ev.start)}–${fT(ev.end)}
                </div>
                <button class="delete-btn absolute right-1 top-1 w-4 h-4 bg-black/10 text-black hover:bg-black/20 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                <span class="absolute right-0 top-0 bottom-0 w-1 opacity-0 group-hover:opacity-30 cursor-ew-resize bg-black resize-right"></span>
              `;
                    el.querySelector('.delete-btn').addEventListener('click', e => {
                        e.stopPropagation();
                        D.weekEvents[wi] = D.weekEvents[wi].filter(x => x.id !== ev.id);
                        save(); renderSched(); renderLegend();
                    });
                    setupDrag(el, ev, row); setupResize(el.querySelector('.resize-left'), ev, 'left', row); setupResize(el.querySelector('.resize-right'), ev, 'right', row);
                    row.appendChild(el);
                });
                ganttEl.appendChild(row);
            }
        }

        function setupDrag(el, ev, row) {
            let sx, os, oe, rw;
            el.addEventListener('mousedown', e => {
                if (e.target.classList.contains('resize-left') || e.target.classList.contains('resize-right') || e.target.classList.contains('delete-btn')) return;
                e.preventDefault(); e.stopPropagation(); sx = e.clientX; os = hourToOffset(ev.start); oe = hourToOffset(ev.end); rw = row.getBoundingClientRect().width; el.classList.add('opacity-50', 'cursor-grabbing');
                document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
            });
            function mv(e) {
                const dx = e.clientX - sx, dO = (dx / rw) * HOUR_COUNT, dur = oe - os;
                let ns = Math.round((os + dO) / SNAP) * SNAP; ns = Math.max(0, Math.min(HOUR_COUNT - dur, ns)); const ne = ns + dur;
                el.style.left = `${(ns / HOUR_COUNT) * 100}%`;
                const mS = HOUR_START + ns, mE = HOUR_START + ne;
                const tt = el.querySelector('.tooltip');
                if (tt) tt.textContent = `${ev.label} | ${fTM(mS)}–${fTM(mE)}`;
                el._pS = ns; el._pE = ne;
                dI.style.display = 'block'; dI.style.left = `${e.clientX + 12}px`; dI.style.top = `${e.clientY - 28}px`; dI.textContent = `${fTM(mS)} – ${fTM(mE)}`;
            }
            function up() {
                document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up);
                el.classList.remove('opacity-50', 'cursor-grabbing'); dI.style.display = 'none';
                if (el._pS !== undefined) { const ms = HOUR_START + el._pS, me = HOUR_START + el._pE; ev.start = ms >= 24 ? ms - 24 : ms; ev.end = me >= 24 ? me - 24 : me; delete el._pS; delete el._pE; save(); renderSched(); renderLegend(); }
            }
        }

        function setupResize(h, ev, side, row) {
            let sx, oo, rw, pEl;
            h.addEventListener('mousedown', e => {
                e.preventDefault(); e.stopPropagation(); sx = e.clientX; rw = row.getBoundingClientRect().width; pEl = h.closest('.event'); pEl.classList.add('opacity-50');
                oo = side === 'left' ? hourToOffset(ev.start) : hourToOffset(ev.end);
                document.addEventListener('mousemove', mv); document.addEventListener('mouseup', up);
            });
            function mv(e) {
                const dx = e.clientX - sx, dO = (dx / rw) * HOUR_COUNT;
                let nO = Math.round((oo + dO) / SNAP) * SNAP; nO = Math.max(0, Math.min(HOUR_COUNT, nO));
                if (side === 'left') {
                    const eO = hourToOffset(ev.end); if (nO >= eO - SNAP) nO = eO - SNAP; if (nO < 0) nO = 0;
                    pEl.style.left = `${(nO / HOUR_COUNT) * 100}%`; pEl.style.width = `${((eO - nO) / HOUR_COUNT) * 100}%`;
                    const mS = HOUR_START + nO, mE = HOUR_START + eO;
                    const tt = pEl.querySelector('.tooltip');
                    if (tt) tt.textContent = `${ev.label} | ${fTM(mS)}–${fTM(mE)}`; dI.textContent = `${fTM(mS)} – ${fTM(mE)}`;
                } else {
                    const sO = hourToOffset(ev.start); if (nO <= sO + SNAP) nO = sO + SNAP; if (nO > HOUR_COUNT) nO = HOUR_COUNT;
                    pEl.style.width = `${((nO - sO) / HOUR_COUNT) * 100}%`;
                    const mS = HOUR_START + sO, mE = HOUR_START + nO;
                    const tt = pEl.querySelector('.tooltip');
                    if (tt) tt.textContent = `${ev.label} | ${fTM(mS)}–${fTM(mE)}`; dI.textContent = `${fTM(mS)} – ${fTM(mE)}`;
                }
                pEl._pO = nO; dI.style.display = 'block'; dI.style.left = `${e.clientX + 12}px`; dI.style.top = `${e.clientY - 28}px`;
            }
            function up() {
                document.removeEventListener('mousemove', mv); document.removeEventListener('mouseup', up);
                pEl.classList.remove('opacity-50'); dI.style.display = 'none';
                if (pEl._pO !== undefined) { const mp = HOUR_START + pEl._pO, rH = mp >= 24 ? mp - 24 : mp; if (side === 'left') ev.start = rH; else ev.end = rH; delete pEl._pO; save(); renderSched(); renderLegend(); }
            }
        }

        function wrapH(h) { if (h > 24) return 5; if (h < 5) return 24; return h; }
        function wrapM(m) { if (m >= 60) return 0; if (m < 0) return 55; return m; }
        function renderTP() {
            shV.textContent = tpSH % 24; smV.textContent = tpSM.toString().padStart(2, '0');
            ehV.textContent = tpEH % 24; emV.textContent = tpEM.toString().padStart(2, '0');
        }

        function buildModalToggles() {
            mTT.innerHTML = '';
            const allP = document.createElement('div');
            allP.className = 'px-3 py-1 bg-gray-50 border rounded-lg text-[10px] font-bold cursor-pointer transition-all ' + (selTag === '' ? 'border-brand-500 text-brand-700 bg-brand-50' : 'border-gray-100 text-gray-400');
            allP.textContent = 'ALL'; allP.addEventListener('click', () => { selTag = ''; buildModalToggles(); });
            mTT.appendChild(allP);
            D.tags.forEach(tag => {
                const p = document.createElement('div');
                p.className = 'px-3 py-1 bg-gray-50 border rounded-lg text-[10px] font-bold cursor-pointer transition-all ' + (selTag === tag ? 'border-brand-500 text-brand-700 bg-brand-50' : 'border-gray-100 text-gray-400');
                p.textContent = tag.toUpperCase(); p.addEventListener('click', () => { selTag = tag; buildModalToggles(); });
                mTT.appendChild(p);
            });
            mCT.innerHTML = '';
            const filtered = selTag ? D.categories.filter(c => (c.tags || []).includes(selTag)) : D.categories;
            filtered.forEach(c => {
                const p = document.createElement('div');
                p.className = 'flex items-center gap-1.5 px-3 py-1 bg-gray-50 border rounded-lg text-[10px] font-bold cursor-pointer transition-all ' + (selCat === c.key ? 'border-gray-800 text-gray-800 bg-gray-100' : 'border-gray-100 text-gray-400');
                p.innerHTML = `<span class="w-2 h-2 rounded-full" style="background:${c.bg}"></span>${c.label}`;
                p.addEventListener('click', () => { selCat = c.key; if (!mNm.value) mNm.value = c.label; buildModalToggles(); });
                mCT.appendChild(p);
            });
        }

        function openModal(day, hi) {
            mDay = day; tpSH = HOUR_START + hi; tpSM = 0; tpEH = Math.min(tpSH + 1, 25); tpEM = 0; renderTP();
            mNm.value = ''; selTag = ''; selCat = D.categories[0]?.key || ''; buildModalToggles();
            mOv.classList.replace('hidden', 'flex'); setTimeout(() => mNm.focus(), 80);
        }
        function closeModal() { mOv.classList.replace('flex', 'hidden'); }

        function showConfirm(msg, cb) { cfMsg.textContent = msg; cfCb = cb; cfOv.classList.replace('hidden', 'flex'); }
        function closeConfirm() { cfOv.classList.replace('flex', 'hidden'); cfCb = null; }

        function onDateChange() {
            const s = iSD.value, e = iED.value; if (!s || !e) return;
            if (e < s) { dInfo.textContent = '⚠ End date must be after start date.'; return; }
            D.startDate = s; D.endDate = e;
            const nw = cWeeks(); while (D.weekEvents.length < nw.length) D.weekEvents.push([]);
            if (D.weekEvents.length > nw.length) D.weekEvents.length = nw.length;
            save(); rebuildWSel(); rebuildChartWSel(); dInfo.textContent = `${nw.length} week${nw.length !== 1 ? 's' : ''} total`;
            if (drLabel) drLabel.textContent = `${fDS(pD(s))} — ${fDS(pD(e))}`;
            renderSched(); renderLegend(); renderCharts();
        }

        function renderExistingTags() {
            if (!existTagsEl) return;
            existTagsEl.innerHTML = '';
            D.tags.forEach(tag => {
                const el = document.createElement('div');
                el.className = 'flex items-center gap-1.5 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg text-[10px] font-bold text-gray-500';
                el.innerHTML = `${tag.toUpperCase()}<button class="hover:text-red-500 transition-colors">✕</button>`;
                el.querySelector('button').addEventListener('click', () => {
                    showConfirm(`Delete tag "${tag}"? It will be removed from all categories.`, () => {
                        D.tags = D.tags.filter(t => t !== tag); D.categories.forEach(c => { c.tags = (c.tags || []).filter(t => t !== tag); });
                        save(); renderExistingTags(); renderTagTable(); renderCharts();
                    });
                });
                existTagsEl.appendChild(el);
            });
        }

        function rebuildChartWSel() {
            if (!cWS) return;
            const w = cWeeks(); cWS.innerHTML = '';
            w.forEach((_, i) => { const o = document.createElement('option'); o.value = i; o.textContent = `Week ${i + 1}`; cWS.appendChild(o); });
            if (chartWeek >= w.length) chartWeek = Math.max(0, w.length - 1);
            cWS.value = chartWeek;
        }

        function renderTagTable() {
            if (!tTB) return;
            tTB.innerHTML = '';
            D.categories.forEach((cat, idx) => {
                const tr = document.createElement('tr'); tr.draggable = true; tr.dataset.idx = idx; tr.className = 'border-b border-gray-50 group';
                const tdH = document.createElement('td'); tdH.innerHTML = '<span class="text-gray-200 group-hover:text-gray-400 cursor-grab active:cursor-grabbing">⠿</span>'; tdH.className = 'py-3';
                const tdC = document.createElement('td'); tdC.innerHTML = `<div class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded-full" style="background:${cat.bg}"></span>${cat.label}</div>`; tdC.className = 'font-semibold py-3';
                const tdT = document.createElement('td'); tdT.className = 'py-3';
                const chips = document.createElement('div'); chips.className = 'flex flex-wrap gap-1.5 items-center';
                (cat.tags || []).forEach(tag => {
                    const ch = document.createElement('div');
                    ch.className = 'flex items-center gap-1 px-1.5 py-0.5 bg-gray-50 border border-gray-100 rounded text-[9px] font-bold text-gray-400';
                    ch.innerHTML = `${tag.toUpperCase()}<button class="hover:text-red-500 transition-colors">✕</button>`;
                    ch.querySelector('button').addEventListener('click', () => {
                        showConfirm(`Remove tag "${tag}" from "${cat.label}"?`, () => {
                            cat.tags = cat.tags.filter(t => t !== tag); save(); renderTagTable(); renderCharts();
                        });
                    });
                    chips.appendChild(ch);
                });
                const inp = document.createElement('input'); inp.className = 'bg-transparent border-b border-gray-100 w-12 outline-none focus:border-gray-300 transition-all placeholder:text-gray-300 text-[10px] ml-1 px-1'; inp.placeholder = '+tag';
                inp.addEventListener('keydown', e => {
                    if (e.key === 'Enter') {
                        const v = inp.value.trim().toLowerCase();
                        if (v && !(cat.tags || []).includes(v)) {
                            if (!cat.tags) cat.tags = []; cat.tags.push(v);
                            if (!D.tags.includes(v)) D.tags.push(v);
                            save(); renderTagTable(); renderExistingTags(); renderCharts();
                        }
                        inp.value = '';
                    }
                });
                chips.appendChild(inp); tdT.appendChild(chips);

                const tdG = document.createElement('td'); tdG.className = 'py-3';
                const gi = document.createElement('input'); gi.className = 'w-14 border border-gray-100 rounded bg-gray-50/50 p-1 text-center font-bold text-gray-600 outline-none focus:border-brand-300'; gi.type = 'number'; gi.min = '0'; gi.step = '0.5';
                gi.value = cat.goals && cat.goals[chartWeek] ? cat.goals[chartWeek] : '';
                gi.placeholder = '—';
                gi.addEventListener('change', () => {
                    if (!cat.goals) cat.goals = {};
                    const val = parseFloat(gi.value);
                    if (isNaN(val) || val <= 0) { delete cat.goals[chartWeek]; } else { cat.goals[chartWeek] = val; }
                    save();
                });
                tdG.appendChild(gi);

                const tdD = document.createElement('td'); tdD.className = 'py-3 text-right';
                const db = document.createElement('button'); db.className = 'text-gray-200 hover:text-red-400 transition-colors'; db.textContent = '✕';
                db.addEventListener('click', () => {
                    showConfirm(`Delete category "${cat.label}"?`, () => {
                        D.categories.splice(idx, 1); save(); renderTagTable(); renderLegend(); renderCharts();
                    });
                });
                tdD.appendChild(db);

                tr.appendChild(tdH); tr.appendChild(tdC); tr.appendChild(tdT); tr.appendChild(tdG); tr.appendChild(tdD);

                tr.addEventListener('dragstart', e => { dragRow = idx; tr.classList.add('opacity-30'); e.dataTransfer.effectAllowed = 'move'; });
                tr.addEventListener('dragend', () => { tr.classList.remove('opacity-30'); dragRow = null; });
                tr.addEventListener('dragover', e => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; });
                tr.addEventListener('drop', e => {
                    e.preventDefault(); if (dragRow === null || dragRow === idx) return;
                    const moved = D.categories.splice(dragRow, 1)[0]; D.categories.splice(idx, 0, moved);
                    dragRow = null; save(); renderTagTable(); renderLegend(); renderCharts();
                });
                tTB.appendChild(tr);
            });
        }

        function renderCharts() {
            if (!cCatEl) return;
            const catH = calcCatHours(chartWeek);
            const maxC = Math.max(...Object.values(catH), 1);
            cCatEl.innerHTML = '';
            D.categories.forEach(c => {
                const h = catH[c.key] || 0;
                const goal = c.goals && c.goals[chartWeek] ? c.goals[chartWeek] : null;
                const row = document.createElement('div'); row.className = 'flex items-center gap-3 mb-2';
                const pct = (h / maxC) * 100;
                let goalLine = '';
                let valTxt = `${Math.round(h * 10) / 10}h`;
                if (goal !== null && goal > 0) {
                    const goalPct = Math.min((goal / maxC) * 100, 100);
                    goalLine = `<div class="absolute top-0 bottom-0 w-0.5 bg-gray-900/40 z-10" style="left:${goalPct}%"></div>`;
                    valTxt = `${Math.round(h * 10) / 10}/${goal}h`;
                }
                row.innerHTML = `
                <div class="w-20 text-[10px] font-bold text-gray-500 text-right truncate flex-shrink-0">${c.label}</div>
                <div class="flex-1 h-5 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 relative">
                    ${goalLine}
                    <div class="h-full rounded-lg transition-all" style="width:${pct}%;background:${c.bg}"></div>
                </div>
                <div class="w-12 text-[10px] font-bold text-gray-800">${valTxt}</div>
            `;
                cCatEl.appendChild(row);
            });

            if (!cTagEl) return;
            const tagH = {}; D.categories.forEach(c => { (c.tags || []).forEach(t => { if (!tagH[t]) tagH[t] = 0; tagH[t] += catH[c.key] || 0; }); });
            const tags = Object.keys(tagH).sort(), maxT = Math.max(...Object.values(tagH), 1);
            cTagEl.innerHTML = '';
            if (!tags.length) { cTagEl.innerHTML = '<div class="text-[10px] text-gray-400 py-4 text-center">No tags defined yet.</div>'; return; }
            const tClr = { work: '#dce9f3', study: '#e5ddf0', health: '#f3dce1', other: '#eaeaea' };
            const oc = ['#f5e6d3', '#f2eacc', '#d3ece2', '#ddeade']; let ci = 0;
            tags.forEach(t => {
                const h = tagH[t] || 0, bg = tClr[t] || (oc[ci++ % oc.length]);
                const row = document.createElement('div'); row.className = 'flex items-center gap-3 mb-2';
                row.innerHTML = `
                <div class="w-20 text-[10px] font-bold text-gray-500 text-right uppercase tracking-wider truncate flex-shrink-0">${t}</div>
                <div class="flex-1 h-5 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 flex items-center">
                    <div class="h-full rounded-lg transition-all" style="width:${(h / maxT) * 100}%;background:${bg}"></div>
                </div>
                <div class="w-12 text-[10px] font-bold text-gray-800">${Math.round(h * 10) / 10}h</div>
            `;
                cTagEl.appendChild(row);
            });
        }

        function initEventListeners() {
            const container = document.querySelector('.schedule-component');
            if (!container) return;

            // Tabs
            container.querySelectorAll('.sub-tab-btn').forEach(b => {
                b.addEventListener('click', () => {
                    container.querySelectorAll('.sub-tab-btn').forEach(x => x.classList.remove('active', 'text-brand-700', 'border-brand-500'));
                    container.querySelectorAll('.sub-tab-btn').forEach(x => x.classList.add('text-gray-400', 'border-transparent'));
                    container.querySelectorAll('.panel-sub').forEach(x => x.classList.add('hidden'));

                    b.classList.add('active', 'text-brand-700', 'border-brand-500');
                    b.classList.remove('text-gray-400', 'border-transparent');
                    container.querySelector('#panel-' + b.dataset.subtab).classList.remove('hidden');
                    if (b.dataset.subtab === 'dashboard') {
                        rebuildChartWSel(); renderExistingTags(); renderTagTable(); renderCharts();
                        iSD.value = D.startDate; iED.value = D.endDate;
                        const w = cWeeks(); if (dInfo) dInfo.textContent = `${w.length} week${w.length !== 1 ? 's' : ''} total`;
                    }
                });
            });

            // Time Picker
            document.getElementById('shUp').addEventListener('click', () => { tpSH = wrapH(tpSH + 1); renderTP(); });
            document.getElementById('shDn').addEventListener('click', () => { tpSH = wrapH(tpSH - 1); renderTP(); });
            document.getElementById('smUp').addEventListener('click', () => { tpSM += 5; if (tpSM >= 60) { tpSM = 0; tpSH = wrapH(tpSH + 1); } renderTP(); });
            document.getElementById('smDn').addEventListener('click', () => { tpSM -= 5; if (tpSM < 0) { tpSM = 55; tpSH = wrapH(tpSH - 1); } renderTP(); });
            document.getElementById('ehUp').addEventListener('click', () => { tpEH = wrapH(tpEH + 1); renderTP(); });
            document.getElementById('ehDn').addEventListener('click', () => { tpEH = wrapH(tpEH - 1); renderTP(); });
            document.getElementById('emUp').addEventListener('click', () => { tpEM += 5; if (tpEM >= 60) { tpEM = 0; tpEH = wrapH(tpEH + 1); } renderTP(); });
            document.getElementById('emDn').addEventListener('click', () => { tpEM -= 5; if (tpEM < 0) { tpEM = 55; tpEH = wrapH(tpEH - 1); } renderTP(); });

            // Modal
            document.getElementById('btnCancel').addEventListener('click', closeModal);
            mOv.addEventListener('click', e => { if (e.target === mOv) closeModal(); });
            document.getElementById('btnAdd').addEventListener('click', () => {
                const sv = tpSH + tpSM / 60, ev = tpEH + tpEM / 60;
                if (ev <= sv) { alert('End time must be after start time.'); return; }
                const nm = mNm.value.trim() || D.categories.find(c => c.key === selCat)?.label || 'Event';
                const w = cWeeks(); while (D.weekEvents.length < w.length) D.weekEvents.push([]);
                D.weekEvents[curW].push({ day: mDay, start: sv >= 24 ? sv - 24 : sv, end: ev >= 24 ? ev - 24 : ev, cls: selCat, label: nm, id: uid() });
                save(); closeModal(); renderSched(); renderLegend();
            });

            // Confirm
            document.getElementById('confirmNo').addEventListener('click', closeConfirm);
            cfOv.addEventListener('click', e => { if (e.target === cfOv) closeConfirm(); });
            document.getElementById('confirmYes').addEventListener('click', () => { if (cfCb) cfCb(); closeConfirm(); });

            // Dashboard
            iSD.addEventListener('change', onDateChange); iED.addEventListener('change', onDateChange);
            document.getElementById('addTagBtn').addEventListener('click', () => {
                const v = newTagIn.value.trim().toLowerCase();
                if (!v) return; if (D.tags.includes(v)) { newTagIn.value = ''; return; }
                D.tags.push(v); newTagIn.value = ''; save(); renderExistingTags(); renderTagTable(); renderCharts();
            });
            cWS.addEventListener('change', () => { chartWeek = parseInt(cWS.value); renderTagTable(); renderCharts(); });
            document.getElementById('addCatBtn').addEventListener('click', () => {
                const name = document.getElementById('newCatName').value.trim();
                const color = document.getElementById('newCatColor').value;
                if (!name) return;
                const key = slugify(name) || 'cat_' + Date.now();
                if (D.categories.some(c => c.key === key)) { alert('Similar name exists.'); return; }
                D.categories.push({ key, label: name, bg: color, tags: [], goals: {} });
                document.getElementById('newCatName').value = '';
                save(); renderTagTable(); renderLegend(); renderCharts();
            });
            document.getElementById('refreshBtn').addEventListener('click', () => {
                renderSched(); renderLegend(); renderCharts(); renderTagTable();
            });
            wSel.addEventListener('change', () => { curW = parseInt(wSel.value); renderSched(); renderLegend(); });
        }

        // Initialize
        load();
        initEventListeners();
        renderLegend();
        rebuildWSel();
        renderSched();
    }
};

export default Schedule;
