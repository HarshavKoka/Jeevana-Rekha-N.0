'use client';

const CATEGORY_COLORS: Record<string, string> = {
    trending: 'bg-red-600',
    fire: 'bg-orange-500',
    cinema: 'bg-purple-600',
    sports: 'bg-green-600',
    politics: 'bg-blue-600',
    business: 'bg-amber-600',
    jobs: 'bg-teal-600',
    technology: 'bg-cyan-600',
    spiritual: 'bg-indigo-600',
    defense: 'bg-slate-700',
};

const CATEGORY_LABELS: Record<string, Record<string, string>> = {
    trending: { te: 'ట్రెండింగ్', en: 'Trending' },
    fire: { te: 'ఫైర్', en: 'Fire' },
    cinema: { te: 'సినిమా', en: 'Cinema' },
    sports: { te: 'స్పోర్ట్స్', en: 'Sports' },
    politics: { te: 'రాజకీయాలు', en: 'Politics' },
    business: { te: 'బిజినెస్', en: 'Business' },
    jobs: { te: 'ఉద్యోగాలు', en: 'Jobs' },
    technology: { te: 'టెక్నాలజీ', en: 'Technology' },
    spiritual: { te: 'ఆధ్యాత్మికం', en: 'Spiritual' },
    defense: { te: 'రక్షణ', en: 'Defense' },
};

export default function CategoryBadge({ category, label, color }: { category?: string; label?: string; color?: string }) {
    const displayLabel = label || (category ? CATEGORY_LABELS[category]?.te || category : '');
    const bgColor = color || (category ? CATEGORY_COLORS[category] || 'bg-primary' : 'bg-primary');

    return (
        <span className={`${bgColor} text-white px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-[0.1em] shadow-sm transform-gpu transition-all duration-300 hover:scale-110`}>
            {displayLabel}
        </span>
    );
}
