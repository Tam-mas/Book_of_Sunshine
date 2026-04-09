'use client';

import { useState, useMemo, useEffect } from 'react';
import SpellCard from '@/components/spells/SpellCard';
import FilterBar, { FilterState } from '@/components/spells/FilterBar';
import ClassFilter from '@/components/spells/ClassFilter';
import spellsDataRaw from 'public/spells.json';
import { useSpellStore, Spell, normalizeSpell } from '@/store/useSpellStore';
import { Lacquer } from 'next/font/google';
import subtags from '@/data/subtags.json';

const lacquer = Lacquer({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

export default function Home() {
  const { profiles, activeProfileId, _migrateLegacyData } = useSpellStore();
  const [isClient, setIsClient] = useState(false);
  const [subtag, setSubtag] = useState('Still got it');

  // Avoid hydration mismatch for persisted localStorage states
  useEffect(() => {
    _migrateLegacyData();
    setIsClient(true);
    const randomIndex = Math.floor(Math.random() * subtags.length);
    setSubtag(subtags[randomIndex]);
  }, [_migrateLegacyData]);

  const [filters, setFilters] = useState<FilterState>({
    search: '',
    level: 'all',
    actionType: 'all',
    concentration: 'all',
  });

  const allSpells = useMemo(() => {
    // Combine base spells with user's custom spells
    const baseSpells = (spellsDataRaw as any).allSpells.map(normalizeSpell);
    const customSpells = isClient && profiles[activeProfileId] ? profiles[activeProfileId].customSpells : [];
    return [...baseSpells, ...customSpells];
  }, [profiles, activeProfileId, isClient]);

  const filteredSpells = useMemo(() => {
    return allSpells.filter((spell) => {
      // Search
      const searchMatch = spell.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        spell.text.toLowerCase().includes(filters.search.toLowerCase());
      if (!searchMatch) return false;

      // Level Match
      if (filters.level !== 'all' && String(spell.level) !== filters.level) return false;

      // Action Type Match
      if (filters.actionType !== 'all' && spell.action_type !== filters.actionType) return false;

      // Concentration Match
      if (filters.concentration !== 'all') {
        const wantsConcentration = filters.concentration === 'yes';
        if (spell.concentration !== wantsConcentration) return false;
      }

      // Class Match
      const activeProfile = isClient ? profiles[activeProfileId] : null;
      if (activeProfile && activeProfile.selectedClass !== 'All Classes') {
        const spellClasses = spell.classes?.split(',').map((c: string) => c.trim()) || [];
        if (!spellClasses.includes(activeProfile.selectedClass)) {
          return false;
        }
      }

      return true;
    });
  }, [allSpells, filters, profiles, activeProfileId, isClient]);

  return (
    <main className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className={`text-4xl text-amber-500 tracking-tight ${lacquer.className}`}>Book of Sunshine</h1>
          <p className="text-neutral-400 mt-1">{subtag}</p>
        </div>
      </div>

      <ClassFilter />

      <FilterBar filters={filters} setFilters={setFilters} />

      <div className="mb-4 text-sm text-neutral-400 font-medium">
        Showing {filteredSpells.length} spells
      </div>

      {filteredSpells.length === 0 ? (
        <div className="text-center py-20 bg-neutral-800/20 rounded-xl border border-neutral-700/50 border-dashed">
          <p className="text-neutral-500">No spells found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSpells.map((spell) => (
            <SpellCard key={spell.id} spell={spell} />
          ))}
        </div>
      )}
    </main>
  );
}
