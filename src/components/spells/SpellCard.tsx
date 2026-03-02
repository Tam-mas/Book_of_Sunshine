'use client';

import { Star } from 'lucide-react';
import { useSpellStore, Spell } from '@/store/useSpellStore';
import clsx from 'clsx';

export default function SpellCard({ spell }: { spell: Spell }) {
    const { starredSpells, toggleStar } = useSpellStore();
    const isStarred = starredSpells.includes(spell.id);

    return (
        <div className="bg-neutral-800/80 border border-neutral-700/50 rounded-xl overflow-hidden shadow-xl mb-4 text-sm flex flex-col">
            {/* Header */}
            <div className="bg-neutral-900 p-4 border-b border-neutral-700/50 flex justify-between items-start">
                <div>
                    <h3 className="text-xl font-bold text-amber-500 font-serif tracking-wide">{spell.name}</h3>
                    <p className="text-neutral-400 italic mt-0.5">
                        {spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} • {spell.school}
                        {spell.isCustom && ' (Custom)'}
                    </p>
                </div>
                <button
                    onClick={() => toggleStar(spell.id)}
                    className={clsx(
                        'p-2 rounded-full transition-colors',
                        isStarred ? 'text-amber-500 bg-amber-500/10' : 'text-neutral-500 hover:text-amber-400 hover:bg-neutral-800'
                    )}
                    aria-label={isStarred ? 'Remove from spellbook' : 'Add to spellbook'}
                >
                    <Star className={clsx('w-6 h-6', isStarred && 'fill-current')} />
                </button>
            </div>

            {/* Meta Info */}
            <div className="p-4 grid grid-cols-2 gap-y-3 gap-x-4 border-b border-neutral-700/50 bg-neutral-800/50">
                <div>
                    <span className="text-neutral-500 font-semibold block text-xs uppercase tracking-wider mb-0.5">Casting Time</span>
                    <span className="text-neutral-200">{spell.casting_time || spell.action_type}</span>
                </div>
                <div>
                    <span className="text-neutral-500 font-semibold block text-xs uppercase tracking-wider mb-0.5">Range</span>
                    <span className="text-neutral-200">{spell.range || 'N/A'}</span>
                </div>
                <div>
                    <span className="text-neutral-500 font-semibold block text-xs uppercase tracking-wider mb-0.5">Components</span>
                    <span className="text-neutral-200">{spell.components || 'V, S'}</span>
                </div>
                <div>
                    <span className="text-neutral-500 font-semibold block text-xs uppercase tracking-wider mb-0.5">Duration</span>
                    <span className="text-neutral-200">
                        {spell.concentration && <span className="font-bold text-amber-500 mr-1">C</span>}
                        {spell.duration || 'Instantaneous'}
                    </span>
                </div>
            </div>

            {/* Spell Text */}
            <div className="p-4 text-neutral-300 leading-relaxed space-y-3">
                {spell.text.split('\n').filter(Boolean).map((para, i) => (
                    <p key={i}>{para}</p>
                ))}
            </div>
        </div>
    );
}
