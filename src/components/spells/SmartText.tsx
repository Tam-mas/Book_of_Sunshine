'use client';

import { useMemo, useState } from 'react';
import glossaryData from 'public/glossary.json';
import { useSpellStore } from '@/store/useSpellStore';
import { X } from 'lucide-react';

interface GlossaryDef {
    name: string;
    description: string;
    category: string;
}

const glossaryMap = new Map<string, GlossaryDef>();
glossaryData.forEach(def => {
    glossaryMap.set(def.name.toLowerCase(), def);
});

const sortedTerms = glossaryData.map(d => d.name).sort((a, b) => b.length - a.length);
const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const termsPattern = sortedTerms.map(escapeRegex).join('|');
// Global, case-insensitive, word boundary regex
const termsRegex = new RegExp(`\\b(${termsPattern})\\b`, 'gi');

export default function SmartText({ text }: { text: string }) {
    const { showGlossary } = useSpellStore();
    const [activeTerm, setActiveTerm] = useState<GlossaryDef | null>(null);

    const paragraphs = useMemo(() => {
        const paras = text.split('\n').filter(Boolean);

        // Helper to render basic markdown bold syntax for when glossary is off
        const renderBold = (str: string) => {
            return str.split(/(\*\*.*?\*\*)/g).map((s, idx) => {
                if (s.startsWith('**') && s.endsWith('**')) {
                    return <strong key={`b-${idx}`} className="text-neutral-200 font-bold">{s.slice(2, -2)}</strong>;
                }
                return s;
            });
        };

        if (!showGlossary) {
            return paras.map((para, i) => <p key={i}>{renderBold(para)}</p>);
        }

        const seen = new Set<string>();

        return paras.map((para, i) => {
            const parts = para.split(termsRegex);
            const nodes = [];

            // Helper to render basic markdown bold syntax
            const renderBold = (str: string) => {
                return str.split(/(\*\*.*?\*\*)/g).map((s, idx) => {
                    if (s.startsWith('**') && s.endsWith('**')) {
                        return <strong key={idx} className="text-neutral-200 font-bold">{s.slice(2, -2)}</strong>;
                    }
                    return s;
                });
            };

            for (let j = 0; j < parts.length; j++) {
                const part = parts[j];
                // parts array structure: [text, match, text, match, text]
                // So odd indices are matches
                if (j % 2 === 1) {
                    const key = part.toLowerCase();
                    if (!seen.has(key)) {
                        seen.add(key);
                        const def = glossaryMap.get(key)!;
                        nodes.push(
                            <span
                                key={j}
                                className="relative inline-block group cursor-pointer text-amber-500/90 hover:text-amber-400 border-b border-dotted border-amber-500/50 hover:border-amber-400 transition-colors"
                                onClick={() => setActiveTerm(def)}
                            >
                                {part}
                                {/* Desktop Tooltip */}
                                <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-4 bg-neutral-900 border border-neutral-700/80 shadow-[0_8px_30px_rgb(0,0,0,0.5)] rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 z-20 hidden md:block pointer-events-none text-left">
                                    <span className="block font-bold font-serif text-amber-500 text-lg tracking-wide mb-1 leading-tight">{def.name}</span>
                                    <span className="block text-[10px] text-neutral-500 uppercase tracking-widest mb-3">{def.category}</span>
                                    <span className="block text-sm text-neutral-300 font-normal leading-relaxed">{def.description}</span>
                                    {/* Arrow */}
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-px border-8 border-transparent border-t-neutral-700/80" />
                                    <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[2px] border-8 border-transparent border-t-neutral-900" />
                                </span>
                            </span>
                        );
                    } else {
                        nodes.push(...renderBold(part));
                    }
                } else {
                    nodes.push(...renderBold(part));
                }
            }
            return <p key={i}>{nodes}</p>;
        });
    }, [text, showGlossary]);

    return (
        <>
            <div className="space-y-3">
                {paragraphs}
            </div>

            {/* Mobile Drawer */}
            {activeTerm && (
                <div className="fixed inset-0 z-[100] flex flex-col justify-end pointer-events-none md:hidden pt-20">
                    <div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-auto transition-opacity"
                        onClick={() => setActiveTerm(null)}
                    />
                    <div
                        className="relative bg-neutral-900 border-t border-neutral-700/50 p-6 rounded-t-3xl pointer-events-auto shadow-2xl pb-10 transition-transform animate-in slide-in-from-bottom"
                    >
                        <button
                            className="absolute top-5 right-5 text-neutral-500 hover:text-white transition-colors bg-neutral-800/50 rounded-full p-1"
                            onClick={() => setActiveTerm(null)}
                        >
                            <X size={20} />
                        </button>
                        <h3 className="text-2xl font-bold font-serif text-amber-500 tracking-wide pr-8">{activeTerm.name}</h3>
                        <p className="text-xs text-neutral-500 uppercase tracking-widest mb-4 mt-1">{activeTerm.category}</p>
                        <p className="text-neutral-300 leading-relaxed text-base">{activeTerm.description}</p>
                    </div>
                </div>
            )}
        </>
    );
}
