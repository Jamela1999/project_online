import Storage from './Storage.js';

const MyMap = {
    render: () => {
        const container = document.createElement('div');
        container.className = 'space-y-8 animate-fade-in';

        container.innerHTML = `
            <div class="mx-auto">
                <div class="text-center mb-8">
                    <h2 class="text-2xl font-bold text-gray-800">My Map</h2>
                    <p class="text-gray-500">Visualize your future: 1, 3, and 5 years from now.</p>
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <!-- Headers -->
                     <div class="hidden md:block col-span-2">
                        <div class="grid grid-cols-3 gap-4 text-center font-semibold text-gray-600">
                            <div class="col-span-1">Timeline</div>
                            <div class="col-span-1">Ideal - Career/Sales</div>
                            <div class="col-span-1">Dream - Personal/Home</div>
                        </div>
                    </div>

                    <!-- 5 Years -->
                    ${renderRow('5 Years', '5y')}
                    
                    <!-- 3 Years -->
                    ${renderRow('3 Years', '3y')}
                    
                    <!-- 1 Year -->
                    ${renderRow('1 Year', '1y')}
                </div>

                <div class="mt-8 p-4 bg-brand-50 rounded-xl border border-brand-100 mb-6">
                    <h3 class="font-bold text-brand-800 mb-2">Describing Work & Personal Dreams</h3>
                    <p class="text-sm text-brand-600">
                        Write down what your work and life will look like in 1, 3, and 5 years. 
                        "Want to buy OO", "Want to achieve OO" - all desires are OK.
                    </p>
                </div>
            </div>
        `;

        // Add event listeners for auto-saving
        setTimeout(() => {
            const inputs = container.querySelectorAll('textarea');
            inputs.forEach(input => {
                input.addEventListener('input', (e) => {
                    const id = e.target.id;
                    const value = e.target.value;
                    const data = Storage.get('mymap_data') || {};
                    data[id] = value;
                    Storage.save('mymap_data', data);
                });
            });
        }, 0);

        return container;
    },

    afterRender: () => {
        // Load saved data
        const data = Storage.get('mymap_data') || {};
        Object.keys(data).forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = data[id];
        });
    }
};

function renderRow(label, prefix) {
    return `
        <div class="md:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4 border-b border-gray-100 pb-8 last:border-0">
            <div class="flex items-center justify-center bg-accent-yellow/30 bg-opacity-50 rounded-lg p-4 h-full min-h-[100px]">
                <span class="text-lg font-bold text-gray-800">${label}</span>
            </div>
            <div class="relative group">
                <label class="block md:hidden text-sm font-medium text-gray-500 mb-1">Ideal</label>
                <textarea 
                    id="${prefix}_ideal" 
                    class="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 resize-none group-hover:bg-white group-hover:shadow-md"
                    placeholder="E.g., Wanted position, sales target..."
                ></textarea>
            </div>
            <div class="relative group">
                <label class="block md:hidden text-sm font-medium text-gray-500 mb-1">Dream</label>
                <textarea 
                    id="${prefix}_dream" 
                    class="w-full h-32 p-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all duration-200 resize-none group-hover:bg-white group-hover:shadow-md"
                    placeholder="E.g., Want to buy house, Want OO..."
                ></textarea>
            </div>
        </div>
    `;
}

export default MyMap;
