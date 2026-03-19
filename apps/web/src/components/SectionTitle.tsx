export default function SectionTitle({ title }: { title: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-primary rounded-full"></div>
            <h2 className="text-2xl md:text-3xl font-bold font-te tracking-tight text-gray-900 dark:text-white">
                {title}
            </h2>
        </div>
    );
}
