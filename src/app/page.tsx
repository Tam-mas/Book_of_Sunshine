'use client';

import { useState, useMemo, useEffect } from 'react';
import SpellCard from '@/components/spells/SpellCard';
import FilterBar, { FilterState } from '@/components/spells/FilterBar';
import spellsDataRaw from 'public/spells.json';
import { useSpellStore, Spell, normalizeSpell } from '@/store/useSpellStore';

export default function Home() {
  const { profiles, activeProfileId, _migrateLegacyData } = useSpellStore();
  const [isClient, setIsClient] = useState(false);

  // Avoid hydration mismatch for persisted localStorage states
  useEffect(() => {
    _migrateLegacyData();
    setIsClient(true);
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
      if (filters.level !== 'all' && spell.level.toString() !== filters.level) return false;

      // Action Type Match
      if (filters.actionType !== 'all' && spell.action_type !== filters.actionType) return false;

      // Concentration Match
      if (filters.concentration !== 'all') {
        const wantsConcentration = filters.concentration === 'yes';
        if (spell.concentration !== wantsConcentration) return false;
      }

      return true;
    });
  }, [allSpells, filters]);

  return (
    <main className="min-h-screen">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-extrabold text-amber-500 font-serif tracking-tight">New Sunshine</h1>
          <p className="text-neutral-400 mt-1">Still got it</p>
        </div>
      </div>

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
