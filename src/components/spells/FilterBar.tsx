'use client';

import { Search, FilterX } from 'lucide-react';
import clsx from 'clsx';

export type FilterState = {
    search: string;
    level: string; // 'all' or '0' - '9'
    actionType: string; // 'all', 'Action', 'Bonus Action', 'Reaction'
    concentration: string; // 'all', 'yes', 'no'
};

interface FilterBarProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

export default function FilterBar({ filters, setFilters }: FilterBarProps) {
    const updateFilter = (key: keyof FilterState, value: string) => {
        setFilters({ ...filters, [key]: value });
    };

    const clearFilters = () => {
        setFilters({ search: '', level: 'all', actionType: 'all', concentration: 'all' });
    };

    return (
        <div className="bg-neutral-800/80 p-4 rounded-xl border border-neutral-700/50 space-y-4 mb-6 sticky top-4 z-40 shadow-lg backdrop-blur-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search spells..."
                    value={filters.search}
                    onChange={(e) => updateFilter('search', e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-700 rounded-lg py-2 pl-10 pr-4 text-neutral-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <select
                    value={filters.level}
                    onChange={(e) => updateFilter('level', e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                    <option value="all">All Levels</option>
                    <option value="0">Cantrip</option>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                        <option key={lvl} value={lvl.toString()}>Level {lvl}</option>
                    ))}
                </select>

                <select
                    value={filters.actionType}
                    onChange={(e) => updateFilter('actionType', e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                    <option value="all">Any Action Type</option>
                    <option value="Action">Action</option>
                    <option value="Bonus Action">Bonus Action</option>
                    <option value="Reaction">Reaction</option>
                </select>

                <select
                    value={filters.concentration}
                    onChange={(e) => updateFilter('concentration', e.target.value)}
                    className="bg-neutral-900 border border-neutral-700 rounded-lg px-3 py-2 text-sm text-neutral-200 focus:outline-none focus:border-amber-500"
                >
                    <option value="all">Concentration: Any</option>
                    <option value="yes">Concentration: Yes</option>
                    <option value="no">Concentration: No</option>
                </select>

                <button
                    onClick={clearFilters}
                    className="flex items-center justify-center gap-2 bg-neutral-700/50 hover:bg-neutral-700 text-neutral-300 py-2 rounded-lg text-sm transition-colors border border-transparent hover:border-neutral-600"
                >
                    <FilterX className="w-4 h-4" />
                    <span>Clear Filters</span>
                </button>
            </div>
        </div>
    );
}
