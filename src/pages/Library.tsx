import { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import { useTheme } from '@/lib/theme-provider';
import { Lock, Search, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import POEMS from '@/data/poems.json';
import { useNavigate } from 'react-router-dom';
import { Slider } from '@/components/ui/slider';

export default function Library() {
    const { theme } = useTheme();
    const isTech = theme === 'tech';
    const [searchQuery, setSearchQuery] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    const filteredPoems = useMemo(
        () =>
            POEMS.filter(
                poem =>
                    poem.title.includes(searchQuery) ||
                    poem.author.includes(searchQuery) ||
                    poem.content.some(line => line.includes(searchQuery))
            ),
        [searchQuery]
    );

    // 监听滚动更新进度
    const handleScroll = useCallback(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;
        const maxScroll = scrollHeight - clientHeight;
        const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        setScrollProgress(progress);
    }, []);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // slider 控制滚动
    const handleSliderChange = useCallback((value: number[]) => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollHeight, clientHeight } = container;
        const maxScroll = scrollHeight - clientHeight;
        const targetScroll = (value[0] / 100) * maxScroll;
        container.scrollTo({ top: targetScroll, behavior: 'auto' });
    }, []);

    return (
        <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
            <header className="w-full max-w-4xl mb-12 px-4 pt-8">
                <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                'w-2 h-2 rounded-full',
                                isTech ? 'bg-primary animate-pulse' : 'bg-black'
                            )}
                        />
                        <span
                            className={cn(
                                'text-[10px] font-bold uppercase tracking-[0.3em]',
                                isTech ? 'text-primary' : 'text-[#374151]'
                            )}
                        >
                            万卷书屋 / 经典集成
                        </span>
                    </div>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <h1
                            className={cn(
                                'text-4xl md:text-5xl font-black tracking-tighter',
                                isTech ? 'text-white' : 'text-[#111827]'
                            )}
                        >
                            经典诗词库
                        </h1>
                        <div
                            className={cn(
                                'flex items-center gap-3 px-4 py-2 rounded-lg border transition-all w-full md:w-80',
                                isTech
                                    ? 'bg-[#1a1a1a] border-white/10'
                                    : 'bg-slate-50 border-slate-200'
                            )}
                        >
                            <Search className="w-4 h-4 text-muted-foreground" />
                            <input
                                type="text"
                                placeholder="搜索标题、作者或诗句..."
                                aria-label="搜索标题、作者或诗句"
                                className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-muted-foreground/50"
                                value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
            </header>
            {/* 诗词库 */}
            <div
                ref={scrollContainerRef}
                className="w-full max-w-4xl space-y-3 px-4 pb-0 overflow-y-auto h-[calc(100vh-400px)] custom-scrollbar"
            >
                {filteredPoems.length > 0 ? (
                    filteredPoems.map((poem, i) => (
                        <div
                            onClick={() => navigate(`/punch-in?poemId=${poem?.id}`)}
                            key={poem?.id}
                            className={cn(
                                'p-5 rounded-[12px] flex items-center justify-between group transition-all border cursor-pointer',
                                isTech
                                    ? 'bg-[#1a1a1a] border-white/5 hover:border-primary/50'
                                    : 'bg-white border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
                            )}
                        >
                            <div className="flex items-center gap-6">
                                <div
                                    className={cn(
                                        'w-12 h-12 rounded-lg flex items-center justify-center font-mono font-black text-lg border shrink-0',
                                        isTech
                                            ? 'bg-white/5 border-white/5 text-primary'
                                            : 'bg-slate-50 border-slate-100 text-[#111827]'
                                    )}
                                >
                                    {(i + 1).toString().padStart(2, '0')}
                                </div>
                                <div className="flex flex-col">
                                    <h3
                                        className={cn(
                                            'text-xl font-bold tracking-tight',
                                            isTech ? 'text-white' : 'text-[#111827]'
                                        )}
                                    >
                                        {poem.title}
                                    </h3>
                                    <p
                                        className={cn(
                                            'text-xs font-medium uppercase tracking-widest mt-1',
                                            isTech ? 'text-primary/70' : 'text-muted-foreground'
                                        )}
                                    >
                                        {poem.author}
                                    </p>
                                </div>
                            </div>
                            <div
                                className={cn(
                                    'flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity',
                                    isTech ? 'text-primary' : 'text-black'
                                )}
                            >
                                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">
                                    开始研习
                                </span>
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-20">
                        <p className="text-muted-foreground font-medium">
                            未找到与 "{searchQuery}" 相关的结果
                        </p>
                    </div>
                )}
            </div>

            {/* 底部滚动控制 */}
            <div
                className={cn(
                    'fixed bottom-28 md:bottom-6 w-[80%] max-w-4xl p-3 md:p-6 rounded-[12px] border transition-all z-20 backdrop-blur-md left-1/2 -translate-x-1/2',
                    isTech
                        ? 'bg-[#1a1a1a]/80 border-white/10'
                        : 'bg-white/80 border-slate-200 shadow-2xl'
                )}
            >
                <div className="flex justify-between mb-1 md:mb-3">
                    <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.3em]">
                        {filteredPoems.length} / {POEMS.length}
                    </p>
                </div>
                <Slider
                    value={[scrollProgress]}
                    onValueChange={handleSliderChange}
                    max={100}
                    step={0.1}
                />
            </div>
        </div>
    );
}
