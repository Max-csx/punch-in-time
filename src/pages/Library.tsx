import { useState } from 'react'
import { useTheme } from '@/lib/theme-provider'
import { Lock, Search, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import POEMS from "@/data/poems.json"

export default function Library() {
  const { theme } = useTheme();
  const isTech = theme === 'tech';
  const [searchQuery, setSearchQuery] = useState("");

  // 过滤诗词
  const filteredPoems = POEMS.filter(poem => 
    poem.title.includes(searchQuery) || 
    poem.author.includes(searchQuery) ||
    poem.lines.some(line => line.includes(searchQuery))
  ).slice(0, 20); // 仅展示前 20 首以保持性能

  return (
    <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="w-full max-w-4xl mb-12 px-4 pt-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isTech ? "bg-primary animate-pulse" : "bg-black"
            )} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em]",
              isTech ? "text-primary" : "text-[#374151]"
            )}>
              {isTech ? "经典诗词档案" : "万卷书屋 / 经典集成"}
            </span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className={cn(
              "text-4xl md:text-5xl font-black tracking-tighter",
              isTech ? "text-white" : "text-[#111827]"
            )}>
              {isTech ? "全唐诗词库" : "经典诗词库"}
            </h1>
            <div className={cn(
              "flex items-center gap-3 px-4 py-2 rounded-lg border transition-all w-full md:w-80",
              isTech ? "bg-[#1a1a1a] border-white/10" : "bg-slate-50 border-slate-200"
            )}>
              <Search className="w-4 h-4 text-muted-foreground" />
              <input 
                type="text"
                placeholder="搜索标题、作者或诗句..."
                className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-muted-foreground/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="w-full max-w-4xl space-y-3 px-4 pb-24">
        {filteredPoems.length > 0 ? (
          filteredPoems.map((poem, i) => (
            <div key={i} className={cn(
              "p-6 rounded-[12px] flex items-center justify-between group transition-all border cursor-pointer",
              isTech 
                ? "bg-[#1a1a1a] border-white/5 hover:border-primary/50" 
                : "bg-white border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
            )}>
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center font-mono font-black text-lg border shrink-0",
                  isTech ? "bg-white/5 border-white/5 text-primary" : "bg-slate-50 border-slate-100 text-[#111827]"
                )}>
                  {(i + 1).toString().padStart(2, '0')}
                </div>
                <div className="flex flex-col">
                  <h3 className={cn(
                    "text-xl font-bold tracking-tight",
                    isTech ? "text-white" : "text-[#111827]"
                  )}>{poem.title}</h3>
                  <p className={cn(
                    "text-xs font-medium uppercase tracking-widest mt-1",
                    isTech ? "text-primary/70" : "text-muted-foreground"
                  )}>{poem.author}</p>
                </div>
              </div>
              <div className={cn(
                "flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity",
                isTech ? "text-primary" : "text-black"
              )}>
                <span className="text-[10px] font-bold uppercase tracking-widest hidden md:inline">开始研习</span>
                <ChevronRight className="w-5 h-5" />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground font-medium">未找到与 "{searchQuery}" 相关的结果</p>
          </div>
        )}

        {/* 底部未解锁预览 */}
        <div className="pt-8 space-y-3">
          <p className={cn(
            "text-[10px] font-bold uppercase tracking-[0.3em] mb-4 text-center",
            isTech ? "text-primary/50" : "text-slate-400"
          )}>更多模块即将上线</p>
          {[1, 2].map((i) => (
            <div key={i} className={cn(
              "p-6 rounded-[12px] flex items-center justify-between group transition-all cursor-not-allowed border opacity-30",
              isTech ? "bg-[#1a1a1a] border-white/5" : "bg-white border-slate-200"
            )}>
              <div className="flex items-center gap-6">
                <div className={cn(
                  "w-12 h-12 rounded-lg flex items-center justify-center font-mono font-black text-lg border",
                  isTech ? "bg-white/5 border-white/5" : "bg-slate-50"
                )}>
                  ??
                </div>
                <div className="space-y-2">
                  <div className={cn("h-4 w-32 rounded-full", isTech ? "bg-white/10" : "bg-slate-200")} />
                  <div className={cn("h-3 w-20 rounded-full", isTech ? "bg-white/5" : "bg-slate-100")} />
                </div>
              </div>
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </div>

      {/* 底部加载进度 */}
      <div className={cn(
        "fixed bottom-28 md:bottom-12 w-full max-w-4xl mx-4 p-8 rounded-[12px] text-center border transition-all z-20 backdrop-blur-md",
        isTech 
          ? "bg-[#1a1a1a]/80 border-white/10" 
          : "bg-white/80 border-slate-200 shadow-2xl"
      )}>
        <div className="flex justify-between mb-4">
          <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-[0.3em]">
            {isTech ? "数据节点：活跃" : "诗库同步状态"}
          </p>
          <p className="text-[10px] font-mono text-primary font-bold uppercase tracking-[0.3em]">
            已加载 {filteredPoems.length} / {POEMS.length}
          </p>
        </div>
        <div className={cn(
          "w-full h-1.5 rounded-full overflow-hidden",
          isTech ? "bg-white/5" : "bg-slate-100"
        )}>
          <div 
            className={cn(
              "h-full transition-all duration-1000 ease-out",
              isTech ? "bg-primary shadow-[0_0_15px_rgba(124,58,237,0.5)]" : "bg-black"
            )} 
            style={{ width: `${(filteredPoems.length / POEMS.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}
