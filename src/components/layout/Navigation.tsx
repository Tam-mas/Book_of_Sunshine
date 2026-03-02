'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, Scroll, PlusCircle, Settings } from 'lucide-react';
import clsx from 'clsx';

export default function Navigation() {
    const pathname = usePathname();

    const links = [
        { href: '/', label: 'Library', icon: BookOpen },
        { href: '/session', label: 'Session', icon: Scroll },
        { href: '/add', label: 'Add', icon: PlusCircle },
        { href: '/export', label: 'Export', icon: Settings },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-neutral-900 border-t border-neutral-800 z-50 text-neutral-400">
            <div className="max-w-md mx-auto flex justify-between items-center px-6 py-3">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive = pathname === link.href;
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={clsx(
                                'flex flex-col items-center gap-1 transition-colors',
                                isActive ? 'text-amber-500' : 'hover:text-amber-400'
                            )}
                        >
                            <Icon size={24} />
                            <span className="text-[10px] font-medium uppercase tracking-wider">{link.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
