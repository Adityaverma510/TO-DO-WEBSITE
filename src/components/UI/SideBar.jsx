import { useNavigate } from "react-router-dom";

const Sidebar = ({ lists = [], tags = [], tasksCount }) => {
    const navigate = useNavigate();
    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white p-6 shadow-lg rounded-r-lg flex flex-col justify-between z-50">
            <div>
                {/* Menu Header */}
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-semibold text-gray-800">Menu</h2>
                    <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
                        {/* Hamburger icon */}
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
                        </svg>
                    </button>
                </div>

                {/* Search Bar */}
                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        {/* Search icon */}
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                    </div>
                </div>

                {/* Tasks Section */}
                <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">TASKS</h3>
                    <ul>
                        <li onClick={() => navigate('/upcoming')} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                                <span className="mr-3 text-gray-600">≫</span> {/* Custom arrow for "Upcoming" */}
                                <span className="text-gray-800">Upcoming</span>
                            </div>
                            <span className="text-sm text-gray-500">12</span>
                        </li>
                        <li onClick={() => navigate('/today')} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-100 text-blue-600 font-medium cursor-pointer">
                            <div className="flex items-center">
                                {/* Calendar icon for "Today" */}
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>Today</span>
                            </div>
                            <span className="text-sm text-blue-600">{tasksCount}</span>
                        </li>
                        <li onClick={() => navigate('/calendar')} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                                {/* Calendar icon for "Calendar" */}
                                <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span className="text-gray-800">Calendar</span>
                            </div>
                        </li>
                        <li onClick={() => navigate('/sticky-wall')} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <div className="flex items-center">
                                {/* Sticky note icon for "Sticky Wall" */}
                                <svg className="w-5 h-5 mr-3 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                                </svg>
                                <span className="text-gray-800">Sticky Wall</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Lists Section */}
                <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">LISTS</h3>
                    <ul>
                        {lists.map(list => (
                            <li key={list.id} className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                                <div className="flex items-center">
                                    <span className={`w-3 h-3 rounded-full mr-3 ${list.color}`}></span>
                                    <span className="text-gray-800">{list.name}</span>
                                </div>
                                <span className="text-sm text-gray-500">{list.count}</span>
                            </li>
                        ))}
                        <li className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600">
                            {/* Plus icon for "Add New List" */}
                            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            <span>Add New List</span>
                        </li>
                    </ul>
                </div>

                {/* Tags Section */}
                <div className="mb-8">
                    <h3 className="text-xs uppercase tracking-wider text-gray-500 mb-4">TAGS</h3>
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <span key={tag.id} className={`px-3 py-1 rounded-full text-sm ${tag.color} cursor-pointer`}>
                                {tag.name}
                            </span>
                        ))}
                        <span className="px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-700 cursor-pointer">
                            {/* Plus icon for "Add Tag" */}
                            <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                            </svg>
                            Add Tag
                        </span>
                    </div>
                </div>
            </div>

            {/* Bottom Section (Settings and Sign out) */}
            <div>
                <ul>
                    <li className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600">
                        {/* Settings icon */}
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        <span>Settings</span>
                    </li>
                    <li className="flex items-center py-2 px-3 rounded-lg hover:bg-gray-50 cursor-pointer text-gray-600">
                        {/* Sign out icon */}
                        <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                        </svg>
                        <span>Sign out</span>
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;