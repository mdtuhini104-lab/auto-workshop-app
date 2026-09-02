const fs = require('fs');
const path = require('path');

const targetFiles = [
    'src/app/quotations/inspections/new/page.tsx',
    'src/app/workshop/job-cards/[id]/page.tsx',
    'src/app/peoples/customers/add/page.tsx',
    'src/app/master-data/items/add/page.tsx',
    'src/app/master-data/categories/add/page.tsx',
    'src/app/master-data/services/add/page.tsx',
    'src/app/master-data/units/add/page.tsx',
    'src/app/master-data/workshops/add/page.tsx',
    'src/app/master-data/departments/add/page.tsx'
];

const newContainer = 'bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-gray-200 dark:border-slate-800 p-8';
const newInput = 'block w-full rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500';

const replacements = [
    // Container replacements (various forms)
    { regex: /bg-white\s+dark:bg-gray-800\s+rounded-xl\s+shadow-sm\s+border\s+border-gray-200\s+dark:border-gray-700\s+p-[68](\s+h-fit)?/g, replacement: newContainer },
    { regex: /bg-white\s+dark:bg-gray-800\s+rounded-xl\s+shadow-sm\s+border\s+border-gray-200\s+dark:border-gray-700\s+overflow-hidden/g, replacement: newContainer },
    
    // Input replacements (greedy matching common input class structures)
    { regex: /block\s+w-full\s+(md:w-1\/2\s+)?rounded-md\s+border\s+border-gray-300[\s\S]*?transition-colors(?:\s+placeholder-gray-400)?/g, replacement: 'block w-full $1rounded-lg border border-gray-300 dark:border-slate-700 py-3 px-4 text-base focus:border-[#004e89] focus:ring-[#004e89] bg-white dark:bg-slate-800 transition-colors text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500' },
    { regex: /block\s+w-full\s+rounded-md\s+border-gray-300[\s\S]*?transition-colors/g, replacement: newInput },

    // Typography
    { regex: /text-gray-900\s+dark:text-gray-100/g, replacement: 'text-slate-900 dark:text-slate-100' },
    { regex: /text-gray-900\s+dark:text-white/g, replacement: 'text-slate-900 dark:text-slate-100' },
    { regex: /text-gray-800\s+dark:text-gray-200/g, replacement: 'text-slate-900 dark:text-slate-100' },
    { regex: /text-gray-700\s+dark:text-gray-300/g, replacement: 'text-slate-900 dark:text-slate-100' },
    { regex: /text-gray-500\s+dark:text-gray-400/g, replacement: 'text-slate-500 dark:text-slate-400' },
    
    // Primary Button
    { regex: /bg-\[#004e89\]\s+text-white\s+font-medium\s+hover:bg-blue-800\s+transition-colors(\s+focus:outline-none\s+focus:ring-2\s+focus:ring-offset-2\s+focus:ring-blue-500\s+disabled:opacity-50)?/g, replacement: 'bg-[#004e89] hover:bg-blue-800 text-white font-medium transition-colors text-base shadow-sm' },
    { regex: /bg-\[#004e89\]\s+hover:bg-blue-800\s+text-white\s+text-sm/g, replacement: 'bg-[#004e89] hover:bg-blue-800 text-white text-base shadow-sm' },
    
    // Cancel Button
    { regex: /text-slate-900\s+dark:text-slate-100\s+font-medium\s+hover:bg-gray-50\s+dark:hover:bg-gray-700\s+transition-colors(\s+focus:outline-none\s+focus:ring-2\s+focus:ring-offset-2\s+focus:ring-gray-500)?/g, replacement: 'text-slate-600 dark:text-slate-400 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors font-medium text-base' }
];

targetFiles.forEach(file => {
    const fullPath = path.join(__dirname, file);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf8');
        
        replacements.forEach(r => {
            content = content.replace(r.regex, r.replacement);
        });

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Processed:', file);
    } else {
        console.log('File not found:', file);
    }
});
