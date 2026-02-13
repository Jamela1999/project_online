import Storage from './Storage.js';

const YearlyPlan = {
    render: () => {
        const container = document.createElement('div');
        container.className = 'space-y-6 animate-fade-in';

        container.innerHTML = `
            <div class="mx-auto">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-800">Yearly Plan</h2>
                    <div class="mt-4 max-w-2xl mx-auto">
                         <input type="text" id="yearly_goal" 
                            class="w-full text-center text-lg p-3 border-b-2 border-accent-yellow bg-transparent focus:outline-none focus:border-brand-500 transition-colors"
                            placeholder="Enter your main goal for the year..."
                        >
                    </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    ${renderMonths()}
                </div>
                 
                 <div class="mt-8 p-4 bg-gray-50 rounded-xl mb-6">
                    <h3 class="font-bold text-gray-700 mb-2">Planning the Future</h3>
                    <p class="text-sm text-gray-500">
                       Always keep the year's schedule in mind. When you think of "Things I want to do", write them down.
                    </p>
                </div>
            </div>
        `;

        // Event listeners
        setTimeout(() => {
            const inputs = container.querySelectorAll('textarea, input');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    const data = Storage.get('yearly_data') || {};
                    data[id] = value;
                    Storage.save('yearly_data', data);
                });
            });
        }, 0);

        return container;
    },

    afterRender: () => {
        const data = Storage.get('yearly_data') || {};
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data[id];
        });
    }
};

function renderMonths() {
    const months = [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
    ];

    return months.map((month, index) => `
        <div class="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col h-48">
            <div class="flex items-center mb-2">
                <span class="w-8 h-8 flex items-center justify-center bg-accent-yellow text-xs font-bold rounded-full mr-2">${index + 1}</span>
                <h4 class="font-medium text-gray-700">${month}</h4>
            </div>
            <textarea 
                id="month_${index + 1}"
                class="flex-grow w-full p-2 text-sm bg-gray-50 border-0 rounded-md resize-none focus:ring-1 focus:ring-brand-500"
                placeholder="Key milestones..."
            ></textarea>
        </div>
    `).join('');
}

export default YearlyPlan;
