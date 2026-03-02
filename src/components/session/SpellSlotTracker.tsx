'use client';

import { useSpellStore } from '@/store/useSpellStore';
import { RotateCcw } from 'lucide-react';

const FULL_CASTER_SLOTS: Record<number, number[]> = {
    1: [2, 0, 0, 0, 0, 0, 0, 0, 0],
    2: [3, 0, 0, 0, 0, 0, 0, 0, 0],
    3: [4, 2, 0, 0, 0, 0, 0, 0, 0],
    4: [4, 3, 0, 0, 0, 0, 0, 0, 0],
    5: [4, 3, 2, 0, 0, 0, 0, 0, 0],
    6: [4, 3, 3, 0, 0, 0, 0, 0, 0],
    7: [4, 3, 3, 1, 0, 0, 0, 0, 0],
    8: [4, 3, 3, 2, 0, 0, 0, 0, 0],
    9: [4, 3, 3, 3, 1, 0, 0, 0, 0],
    10: [4, 3, 3, 3, 2, 0, 0, 0, 0],
    11: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    12: [4, 3, 3, 3, 2, 1, 0, 0, 0],
    13: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    14: [4, 3, 3, 3, 2, 1, 1, 0, 0],
    15: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    16: [4, 3, 3, 3, 2, 1, 1, 1, 0],
    17: [4, 3, 3, 3, 2, 1, 1, 1, 1],
    18: [4, 3, 3, 3, 3, 1, 1, 1, 1],
    19: [4, 3, 3, 3, 3, 2, 1, 1, 1],
    20: [4, 3, 3, 3, 3, 2, 2, 1, 1]
};

export default function SpellSlotTracker() {
    const { spellSlots, toggleSpellSlot, resetSpellSlots, characterLevel, setCharacterLevel } = useSpellStore();

    // Use a client hydration check to ensure the server mismatch does not happen
    if (!spellSlots) return null;

    return (
        <div className="bg-neutral-800/80 p-5 rounded-xl border border-neutral-700/50 shadow-lg mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-4">
                    <h2 className="text-xl font-bold text-amber-500 font-serif">Spell Slots</h2>
                    <select
                        value={characterLevel || 20}
                        onChange={(e) => setCharacterLevel(parseInt(e.target.value))}
                        className="bg-neutral-900 text-amber-500 border border-neutral-700 rounded-lg px-2 py-1 text-sm outline-none focus:border-amber-500/50 cursor-pointer"
                    >
                        {Array.from({ length: 20 }, (_, i) => i + 1).map((lvl) => (
                            <option key={lvl} value={lvl}>Level {lvl}</option>
                        ))}
                    </select>
                </div>
                <button
                    onClick={resetSpellSlots}
                    className="flex justify-center items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition-colors bg-neutral-900/50 px-3 py-1.5 rounded-lg"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>Long Rest</span>
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {Object.entries(spellSlots).map(([levelStr, slots]) => {
                    const numLevel = parseInt(levelStr);
                    const currentLevel = characterLevel || 20;
                    const maxSlotsForLevel = FULL_CASTER_SLOTS[currentLevel]?.[numLevel - 1] || 0;

                    if (maxSlotsForLevel === 0) return null;

                    const displaySlots = slots.slice(0, maxSlotsForLevel);

                    return (
                        <div key={levelStr} className="flex items-center justify-between border-b border-neutral-700/50 pb-2 last:border-0 lg:border-none lg:pb-0">
                            <span className="text-neutral-300 font-medium text-sm whitespace-nowrap pr-2">Level {numLevel}</span>
                            <div className="flex gap-2">
                                {displaySlots.map((isUsed, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleSpellSlot(numLevel, index)}
                                        aria-label={`Toggle level ${numLevel} spell slot`}
                                        className={`w-6 h-6 rounded-md border-2 transition-all ${isUsed
                                            ? 'bg-neutral-600 border-neutral-500' // Used (dimmed)
                                            : 'bg-amber-500/20 border-amber-500 hover:bg-amber-500/40' // Available
                                            }`}
                                    >
                                        {isUsed && (
                                            <svg className="w-full h-full text-neutral-400 p-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
