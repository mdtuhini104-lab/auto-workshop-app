'use client';

import React from 'react';
import NotificationDropdown from './NotificationDropdown';
import UserMenuDropdown from './UserMenuDropdown';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm flex flex-col px-6 py-3 relative z-30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="md:hidden text-gray-500 hover:text-gray-700 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          
          {/* Live Vehicle Tracker Combobox */}
          <div className="relative">
            <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1.5 bg-gray-50 dark:bg-gray-700 focus-within:ring-1 focus-within:ring-[#004e89]">
              <svg className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Live Vehicle Tracker (Plate No)"
                className="bg-transparent border-none outline-none text-sm w-64 dark:text-white"
                onChange={(e) => {
                  if(e.target.value.length > 3) {
                     document.getElementById('tracker-timeline')?.classList.remove('hidden');
                  } else {
                     document.getElementById('tracker-timeline')?.classList.add('hidden');
                  }
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4 relative z-50">
          <NotificationDropdown />
          <UserMenuDropdown />
        </div>
      </div>
      
      {/* Tracker Timeline Component */}
      <div id="tracker-timeline" className="hidden mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 w-full overflow-x-auto pb-1">
         <div className="flex items-center space-x-2 min-w-max">
            {['Inspected', 'Quoted', 'Quote Approved', 'Work Ordered', 'Job Carded', 'Billed'].map((stage, idx) => {
               const isActive = idx <= 2; 
               return (
                 <React.Fragment key={stage}>
                   <div className={`flex items-center ${isActive ? 'text-[#004e89] font-semibold' : 'text-gray-400'}`}>
                     <div className={`h-6 w-6 rounded-full flex items-center justify-center text-xs mr-2 border-2 ${isActive ? 'border-[#004e89] bg-blue-50 dark:bg-blue-900/30' : 'border-gray-300 bg-gray-50 dark:bg-gray-800'}`}>
                       {isActive ? '✓' : (idx + 1)}
                     </div>
                     <span className="text-sm">{stage}</span>
                   </div>
                   {idx < 5 && (
                     <div className={`w-8 h-0.5 ${isActive ? 'bg-[#004e89]' : 'bg-gray-200 dark:bg-gray-700'}`}></div>
                   )}
                 </React.Fragment>
               )
            })}
         </div>
      </div>
    </header>
  );
}
