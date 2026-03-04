'use client';

import { useSpellStore } from '@/store/useSpellStore';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

const CLASSES = [
    'All Classes',
    'Artificer',
    'Bard',
    'Cleric',
    'Druid',
    'Paladin',
    'Ranger',
    'Sorcerer',
    'Warlock',
    'Wizard',
];

export default function ClassFilter() {
    const { profiles, activeProfileId, setSelectedClass } = useSpellStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const activeProfile = profiles[activeProfileId];
    const selectedClass = isClient && activeProfile ? activeProfile.selectedClass : 'All Classes';

    return (
        <div className="relative mb-6">
            <div className="flex overflow-x-auto hide-scrollbar gap-2 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
                {CLASSES.map((cls) => (
                    <button
                        key={cls}
                        onClick={() => setSelectedClass(cls)}
                        className={clsx(
                            'whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors duration-200 border',
                            selectedClass === cls
                                ? 'bg-amber-500 text-neutral-900 border-amber-500 shadow-md'
                                : 'bg-neutral-800 text-neutral-400 border-neutral-700/50 hover:bg-neutral-700 hover:text-neutral-200'
                        )}
                    >
                        {cls}
                    </button>
                ))}
            </div>
            {/* Optional gradient fade for right edge scroll hint on mobile */}
            <div className="absolute right-0 top-0 bottom-2 w-8 bg-gradient-to-l from-neutral-900 to-transparent pointer-events-none sm:hidden" />
        </div>
    );
}
