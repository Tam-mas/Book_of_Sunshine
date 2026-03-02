'use client';

import { useMemo, useEffect, useState } from 'react';
import SpellCard from '@/components/spells/SpellCard';
import SpellSlotTracker from '@/components/session/SpellSlotTracker';
import { useSpellStore, Spell, normalizeSpell } from '@/store/useSpellStore';
import spellsDataRaw from 'public/spells.json';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function SessionPage() {
    const { starredSpells, customSpells } = useSpellStore();
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const activeSpells = useMemo(() => {
        if (!isClient) return [];
        const baseSpells = (spellsDataRaw as any).allSpells.map(normalizeSpell);
        const allSpells = [...baseSpells, ...customSpells];
        return allSpells.filter(spell => starredSpells.includes(spell.id));
    }, [starredSpells, customSpells, isClient]);

    if (!isClient) return null;

    return (
        <main className="min-h-screen">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-amber-500 font-serif tracking-tight">Active Session</h1>
                <p className="text-neutral-400 mt-1">Your Prepared Spellbook</p>
            </div>

            <SpellSlotTracker />

            <h2 className="text-xl font-bold text-neutral-200 border-b border-neutral-800 pb-2 mb-4 font-serif">Prepared Spells</h2>

            {activeSpells.length === 0 ? (
                <div className="text-center py-16 bg-neutral-800/20 rounded-xl border border-neutral-700/50 border-dashed">
                    <p className="text-neutral-500 mb-4">No spells prepared.</p>
                    <Link href="/" className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold py-2 px-6 rounded-lg transition-colors">
                        <BookOpen className="w-5 h-5" />
                        Browse Library
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {activeSpells.map((spell) => (
                        <SpellCard key={spell.id} spell={spell} />
                    ))}
                </div>
            )}
        </main>
    );
}
