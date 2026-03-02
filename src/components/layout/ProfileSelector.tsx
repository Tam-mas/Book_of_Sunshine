'use client';

import { useSpellStore } from '@/store/useSpellStore';
import { useState, useEffect } from 'react';
import { Users, Plus, Trash2 } from 'lucide-react';
import clsx from 'clsx';

export default function ProfileSelector() {
    const { profiles, activeProfileId, switchProfile, createProfile, deleteProfile } = useSpellStore();
    const [isOpen, setIsOpen] = useState(false);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    if (!isClient) return null;

    const activeProfile = profiles[activeProfileId];

    // We shouldn't render anything if there's no active profile yet (e.g. initial load before hydration finishes)
    if (!activeProfile) return null;

    const handleCreate = () => {
        const name = prompt('Enter a name for your new character:');
        if (name && name.trim()) {
            createProfile(name.trim());
            setIsOpen(false);
        }
    };

    const handleDelete = (id: string, name: string) => {
        if (Object.keys(profiles).length <= 1) {
            alert("You cannot delete your only character profile.");
            return;
        }

        if (confirm(`Are you sure you want to delete the character "${name}"? This action cannot be undone.`)) {
            deleteProfile(id);
        }
    };

    return (
        <div className="relative z-50">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-neutral-900 border border-neutral-700 hover:border-amber-500/50 px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
            >
                <Users className="w-4 h-4 text-amber-500" />
                <span className="text-neutral-200 truncate max-w-[120px]">{activeProfile.name}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute top-full lg:left-0 right-0 mt-2 w-64 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-neutral-700 bg-neutral-900/50">
                            <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Your Characters</h3>
                        </div>

                        <div className="max-h-60 overflow-y-auto">
                            {Object.values(profiles).map((profile) => (
                                <div
                                    key={profile.id}
                                    className={clsx(
                                        "flex items-center justify-between p-3 border-b border-neutral-700/50 hover:bg-neutral-700/30 transition-colors group cursor-pointer",
                                        activeProfileId === profile.id ? "bg-amber-500/10" : ""
                                    )}
                                    // Make the whole row clickable to switch
                                    onClick={(e) => {
                                        // Ignore if they clicked the trash icon
                                        if ((e.target as HTMLElement).closest('button')) return;
                                        switchProfile(profile.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <div className="flex flex-col">
                                        <span className={clsx(
                                            "font-medium",
                                            activeProfileId === profile.id ? "text-amber-500" : "text-neutral-200"
                                        )}>
                                            {profile.name}
                                        </span>
                                        <span className="text-xs text-neutral-500">Level {profile.characterLevel}</span>
                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(profile.id, profile.name);
                                        }}
                                        className="text-neutral-500 hover:text-red-400 p-1 rounded transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-0"
                                        disabled={Object.keys(profiles).length <= 1}
                                        title="Delete Character"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <div className="p-2 bg-neutral-900/50 border-t border-neutral-700">
                            <button
                                onClick={handleCreate}
                                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-neutral-300 hover:text-amber-500 hover:bg-neutral-800 rounded-lg transition-colors"
                            >
                                <Plus className="w-4 h-4" />
                                Create New Character
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
