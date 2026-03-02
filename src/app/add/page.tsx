'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSpellStore, Spell } from '@/store/useSpellStore';
import { PlusCircle, Search } from 'lucide-react';

export default function AddSpellPage() {
    const { addCustomSpell, _migrateLegacyData } = useSpellStore();
    const router = useRouter();

    useEffect(() => {
        _migrateLegacyData();
    }, [_migrateLegacyData]);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        level: 0,
        school: '',
        action_type: 'Action',
        range: '',
        components: '',
        duration: '',
        concentration: false,
        text: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        // TypeScript check for checkbox
        const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : name === 'level' ? parseInt(value) : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.text) return;

        const newSpell: Spell = {
            id: `custom-${Date.now()}`,
            ...formData,
            casting_time: formData.action_type,
            isCustom: true,
        };

        addCustomSpell(newSpell);
        setSuccess(true);

        setTimeout(() => {
            setSuccess(false);
            setFormData({
                name: '',
                level: 0,
                school: '',
                action_type: 'Action',
                range: '',
                components: '',
                duration: '',
                concentration: false,
                text: '',
            });
        }, 2000);
    };

    return (
        <main className="min-h-screen pb-10">
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold text-amber-500 font-serif tracking-tight">Add Custom Spell</h1>
                <p className="text-neutral-400 mt-1">Scribe your own machinations</p>
            </div>

            <div className="bg-neutral-800/80 p-6 rounded-xl border border-neutral-700/50 shadow-lg max-w-2xl">
                {success ? (
                    <div className="bg-green-500/20 text-green-400 p-4 rounded-lg font-bold flex items-center gap-3">
                        <PlusCircle className="w-5 h-5 bg-green-500/0 rounded-full text-green-400" />
                        Spell Successfully Scribed!
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-neutral-300 mb-1">Spell Name *</label>
                                <input required type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-neutral-300 mb-1">Level</label>
                                <select name="level" value={formData.level} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500">
                                    <option value={0}>Cantrip</option>
                                    {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((lvl) => (
                                        <option key={lvl} value={lvl}>Level {lvl}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-300 mb-1">Action Type</label>
                                <select name="action_type" value={formData.action_type} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500">
                                    <option value="Action">Action</option>
                                    <option value="Bonus Action">Bonus Action</option>
                                    <option value="Reaction">Reaction</option>
                                    <option value="Minute">Minute</option>
                                    <option value="Hour">Hour</option>
                                    <option value="Special">Special</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-300 mb-1">Duration</label>
                                <input type="text" name="duration" placeholder="e.g. 1 minute" value={formData.duration} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-300 mb-1">School of Magic</label>
                                <input type="text" name="school" placeholder="e.g. Evocation" value={formData.school} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-neutral-300 mb-1">Range</label>
                                <input type="text" name="range" placeholder="e.g. 120 feet" value={formData.range} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-neutral-300 mb-1">Components</label>
                                <input type="text" name="components" placeholder="e.g. V, S, M (a pinch of diamond dust)" value={formData.components} onChange={handleChange} className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 focus:outline-none focus:border-amber-500" />
                            </div>

                            <div className="md:col-span-2 flex items-center mt-2">
                                <input type="checkbox" name="concentration" id="concentration" checked={formData.concentration} onChange={handleChange} className="w-5 h-5 bg-neutral-900 border-neutral-700 rounded text-amber-500 focus:ring-amber-500 focus:ring-offset-neutral-800" />
                                <label htmlFor="concentration" className="ml-3 text-sm font-bold text-neutral-300">Requires Concentration</label>
                            </div>
                        </div>

                        <div className="mt-4">
                            <label className="block text-sm font-bold text-neutral-300 mb-1">Spell Text *</label>
                            <textarea required name="text" rows={8} value={formData.text} onChange={handleChange} placeholder="Describe the effects of your spell..." className="w-full bg-neutral-900 border border-neutral-700 rounded-lg p-3 text-neutral-200 focus:outline-none focus:border-amber-500 font-sans"></textarea>
                        </div>

                        <button type="submit" className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-neutral-900 font-bold rounded-lg transition-colors flex justify-center items-center gap-2 mt-6">
                            <PlusCircle className="w-5 h-5" />
                            Scribe Spell into Local Storage
                        </button>
                    </form>
                )}
            </div>
        </main>
    );
}
