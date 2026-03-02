'use client';

import { useSpellStore } from '@/store/useSpellStore';
import { RotateCcw } from 'lucide-react';

export default function SpellSlotTracker() {
    const { spellSlots, toggleSpellSlot, resetSpellSlots } = useSpellStore();

    // Use a client hydration check to ensure the server mismatch does not happen
    if (!spellSlots) return null;

    return (
        <div className="bg-neutral-800/80 p-5 rounded-xl border border-neutral-700/50 shadow-lg mb-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-amber-500 font-serif">Spell Slots</h2>
                <button
                    onClick={resetSpellSlots}
                    className="flex items-center gap-2 text-sm text-neutral-400 hover:text-amber-400 transition-colors bg-neutral-900/50 px-3 py-1.5 rounded-lg"
                >
                    <RotateCcw className="w-4 h-4" />
                    <span>Long Rest (Reset)</span>
                </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4">
                {Object.entries(spellSlots).map(([level, slots]) => {
                    const numLevel = parseInt(level);
                    return (
                        <div key={level} className="flex items-center justify-between border-b border-neutral-700/50 pb-2 last:border-0 lg:border-none lg:pb-0">
                            <span className="text-neutral-300 font-medium text-sm">Level {level}</span>
                            <div className="flex gap-2">
                                {slots.map((isUsed, index) => (
                                    <button
                                        key={index}
                                        onClick={() => toggleSpellSlot(numLevel, index)}
                                        aria-label={`Toggle level ${level} spell slot`}
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
