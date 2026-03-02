'use client';

import { useSpellStore, Spell, normalizeSpell } from '@/store/useSpellStore';
import { Download, Upload, Printer } from 'lucide-react';
import { useRef, useState, useEffect, useMemo } from 'react';
import spellsDataRaw from 'public/spells.json';
import SpellCard from '@/components/spells/SpellCard';

export default function ExportPage() {
    const { profiles, activeProfileId, importData, _migrateLegacyData, showGlossary, setShowGlossary } = useSpellStore();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        _migrateLegacyData();
        setIsClient(true);
    }, [_migrateLegacyData]);

    const handleExport = () => {
        const dataStr = JSON.stringify({ profiles, activeProfileId }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = 'spellbound-backup.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                if (json.profiles && json.activeProfileId) {
                    importData(json);
                    alert('Spellbook profiles imported successfully!');
                } else {
                    alert('Invalid file format.');
                }
            } catch (error) {
                alert('Error parsing JSON file.');
            }
        };
        reader.readAsText(file);
    };

    const activeSpells = useMemo(() => {
        if (!isClient) return [];
        const profile = profiles[activeProfileId];
        if (!profile) return [];

        const baseSpells = (spellsDataRaw as any).allSpells.map(normalizeSpell);
        const allSpells = [...baseSpells, ...profile.customSpells];
        return allSpells.filter(s => profile.starredSpells.includes(s.id));
    }, [profiles, activeProfileId, isClient]);

    return (
        <main className="min-h-screen pb-10">
            <div className="mb-6 print:hidden">
                <h1 className="text-3xl font-extrabold text-amber-500 font-serif tracking-tight">Grimoire Management</h1>
                <p className="text-neutral-400 mt-1">Export, Import, and Print your spellbook</p>
            </div>

            <div className="bg-neutral-800/80 p-6 rounded-xl border border-neutral-700/50 shadow-lg text-left mb-8 print:hidden">
                <h2 className="text-xl font-bold text-neutral-200 mb-2 font-serif">Preferences</h2>
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-neutral-300 font-medium">Smart Glossary Links</p>
                        <p className="text-sm text-neutral-500 mt-1">Automatically highlight and define D&D terminology in spell descriptions.</p>
                    </div>
                    <button
                        onClick={() => setShowGlossary(!showGlossary)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 focus:ring-offset-neutral-900 ${showGlossary ? 'bg-amber-500' : 'bg-neutral-600'
                            }`}
                        aria-pressed={showGlossary}
                        aria-label="Toggle Glossary"
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${showGlossary ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 print:hidden">
                <div className="bg-neutral-800/80 p-6 rounded-xl border border-neutral-700/50 shadow-lg text-center flex flex-col items-center justify-center">
                    <Download className="w-12 h-12 text-amber-500 mb-4" />
                    <h2 className="text-xl font-bold text-neutral-200 mb-2">Backup Data</h2>
                    <p className="text-sm text-neutral-400 mb-6">Save your custom spells and starred lists to a local JSON file.</p>
                    <button onClick={handleExport} className="bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold py-2 px-6 rounded-lg transition-colors w-full group">
                        Export JSON
                    </button>
                </div>

                <div className="bg-neutral-800/80 p-6 rounded-xl border border-neutral-700/50 shadow-lg text-center flex flex-col items-center justify-center">
                    <Upload className="w-12 h-12 text-blue-500 mb-4" />
                    <h2 className="text-xl font-bold text-neutral-200 mb-2">Restore Data</h2>
                    <p className="text-sm text-neutral-400 mb-6">Load previously exported spellbook data from this device.</p>
                    <input type="file" accept=".json" className="hidden" ref={fileInputRef} onChange={handleImport} />
                    <button onClick={() => fileInputRef.current?.click()} className="bg-neutral-700 hover:bg-neutral-600 text-white font-bold py-2 px-6 rounded-lg transition-colors w-full">
                        Import JSON
                    </button>
                </div>
            </div>

            <div className="print:hidden mb-6 flex items-center justify-between border-b border-neutral-800 pb-4">
                <div>
                    <h2 className="text-2xl font-bold text-neutral-200 font-serif">Print View</h2>
                    <p className="text-sm text-neutral-400">Generate a physical spell deck</p>
                </div>
                <button onClick={() => window.print()} className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-bold">
                    <Printer className="w-4 h-4" />
                    Print PDF
                </button>
            </div>

            {/* Print Only View */}
            <div className="hidden print:block print:w-full print:bg-white text-black bg-white rounded-lg p-8 min-h-[500px]">
                {activeSpells.length === 0 ? (
                    <p className="text-gray-500 print:text-black">No prepared spells to print.</p>
                ) : (
                    <div className="grid grid-cols-2 gap-4 print:gap-8">
                        {activeSpells.map(spell => (
                            <div key={spell.id} className="border-2 border-gray-800 rounded-xl p-4 break-inside-avoid shadow-none text-black bg-white">
                                <div className="border-b-2 border-gray-800 pb-2 mb-2">
                                    <h3 className="text-xl font-bold font-serif">{spell.name}</h3>
                                    <p className="text-sm italic text-gray-700">{spell.level === 0 ? 'Cantrip' : `Level ${spell.level}`} • {spell.school}</p>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs font-medium mb-3">
                                    <div><span className="font-bold">Cast:</span> {spell.casting_time || spell.action_type}</div>
                                    <div><span className="font-bold">Range:</span> {spell.range}</div>
                                    <div><span className="font-bold">Comp:</span> {spell.components}</div>
                                    <div><span className="font-bold">Dur:</span> {spell.duration} {spell.concentration && '(C)'}</div>
                                </div>
                                <div className="text-sm leading-relaxed text-gray-800">
                                    {spell.text}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="block print:hidden text-center text-neutral-500 italic mt-8 text-sm">
                Use the print button above to preview the PDF deck layout!
            </div>
        </main>
    );
}
