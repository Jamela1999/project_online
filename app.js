import MyMap from './components/MyMap.js?v=4';
import YearlyPlan from './components/YearlyPlan.js?v=4';
import MonthlyPlan from './components/MonthlyPlan.js?v=4';
import DailyReport from './components/DailyReport.js?v=4';

const tabs = [
    { id: 'daily', label: 'Daily Report', icon: 'calendar-check', component: DailyReport },
    { id: 'monthly', label: 'Monthly Plan', icon: 'calendar', component: MonthlyPlan },
    { id: 'yearly', label: 'Yearly Plan', icon: 'calendar-range', component: YearlyPlan },
    { id: 'mymap', label: 'My Map', icon: 'map', component: MyMap },
];

let currentTabId = 'daily';

function renderTabs() {
    const navContainer = document.getElementById('nav-tabs');
    navContainer.innerHTML = ''; // Clear existing tabs

    // Create container for tabs if not exists (in header)
    // Actually index.html has a specific spot for them.
    // Let's re-target the selection to match index.html structure properly.
    // In index.html: <nav ... id="nav-tabs">

    // We need to find the nav element in the header.
    const nav = document.getElementById('nav-tabs');
    nav.className = "flex space-x-4";
    nav.innerHTML = '';

    tabs.forEach(tab => {
        const button = document.createElement('button');
        const isActive = tab.id === currentTabId;

        button.className = `
            ${isActive
                ? 'bg-brand-50 text-brand-700'
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'}
            px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center
        `;

        button.innerHTML = `
            <i data-lucide="${tab.icon}" class="w-4 h-4 mr-2"></i>
            ${tab.label}
        `;

        button.onclick = () => switchTab(tab.id);
        nav.appendChild(button);
    });

    // Re-initialize icons
    lucide.createIcons();
}

function renderContent() {
    const appContainer = document.getElementById('app-container');
    appContainer.innerHTML = '';

    const activeTab = tabs.find(t => t.id === currentTabId);
    if (activeTab && activeTab.component) {
        // Render the component
        const content = activeTab.component.render();
        appContainer.appendChild(content);

        // Execute any after-render logic if the component has it
        if (activeTab.component.afterRender) {
            activeTab.component.afterRender();
        }
    }
}

// Global Event Listener for re-rendering tabs
window.addEventListener('render-tab', (e) => {
    const tabLabel = e.detail;
    const tab = tabs.find(t => t.label === tabLabel);
    if (tab) {
        renderContent();
    }
});

function switchTab(tabId) {
    currentTabId = tabId;
    renderTabs();
    renderContent();
    // Default to scrolling to top when switching tabs
    window.scrollTo({ top: 0, behavior: 'instant' });
}

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    // Expose switchTab globally so components can use it
    window.switchTab = switchTab;

    // Initial Render
    renderTabs();
    renderContent();
});
