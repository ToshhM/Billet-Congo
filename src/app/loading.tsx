export default function GlobalLoading() {
    return (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/70 backdrop-blur-md">
            <div className="flex flex-col items-center gap-5">
                {/* Modern glowing spinner */}
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 rounded-full border-2 border-accent-500/10"></div>
                    <div className="absolute inset-0 rounded-full border-2 border-t-accent-500 border-r-accent-500/50 animate-spin"></div>
                    <div className="absolute inset-2 rounded-full border border-primary-500/10"></div>
                    <div className="absolute inset-2 rounded-full border-t border-b border-primary-400/40 animate-spin [animation-duration:1.5s] [animation-direction:reverse]"></div>
                </div>
                {/* Text styling */}
                <div className="text-xs font-semibold tracking-[0.2em] text-accent-400 uppercase animate-pulse">
                    Chargement
                </div>
            </div>
        </div>
    );
}
