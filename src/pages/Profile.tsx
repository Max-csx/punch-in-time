import { useTheme } from '@/lib/theme-provider'
import { Settings, Bell, Info, Palette, Shield, Zap, Feather, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Profile() {
  const { theme, setTheme } = useTheme();
  const isTech = theme === 'tech';

  return (
    <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="w-full max-w-4xl mb-12 px-4 pt-8">
        <div className="flex flex-col gap-2 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isTech ? "bg-primary" : "bg-black"
            )} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em]",
              isTech ? "text-primary" : "text-[#374151]"
            )}>
              {isTech ? "夜晚模式" : "白天模式 / 账户设置"}
            </span>
          </div>
          <h1 className={cn(
            "text-4xl md:text-5xl font-black tracking-tighter",
            isTech ? "text-white" : "text-[#111827]"
          )}>
            {isTech ? "静谧夜研习中心" : "明媚日账户"}
          </h1>
        </div>
      </header>

      <div className="w-full max-w-4xl space-y-8 px-4 pb-24">
        {/* 用户信息卡片 */}
        <div className={cn(
          "p-10 rounded-[12px] flex flex-col md:flex-row items-center gap-10 relative overflow-hidden border transition-all",
          isTech 
            ? "bg-[#1a1a1a] border-white/5" 
            : "bg-white border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        )}>
          {isTech && <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full" />}
          
          <div className={cn(
            "w-32 h-32 rounded-xl p-1 border-2 shrink-0 transition-all",
            isTech ? "border-primary/30" : "border-slate-100"
          )}>
            <div className={cn(
              "w-full h-full rounded-lg flex items-center justify-center relative overflow-hidden",
              isTech ? "bg-white/5" : "bg-slate-50"
            )}>
              <Feather className={cn("w-16 h-16", isTech ? "text-primary" : "text-black")} />
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent to-white/10" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left space-y-4">
            <div>
              <h2 className={cn(
                "text-3xl font-black tracking-tight",
                isTech ? "text-white" : "text-[#111827]"
              )}>首席研习官</h2>
              <p className={cn(
                "text-sm font-mono uppercase tracking-[0.2em] mt-1",
                isTech ? "text-primary" : "text-[#374151]"
              )}>ID: 0x7E2_POET_SYNC</p>
            </div>
            <div className="flex flex-wrap justify-center md:justify-start gap-3">
              {[
                { label: 'Pro 勋章', icon: Shield },
                { label: '已认证', icon: Zap },
              ].map((tag, i) => (
                <div key={i} className={cn(
                  "flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border",
                  isTech ? "bg-primary/10 border-primary/20 text-primary" : "bg-slate-100 border-slate-200 text-[#374151]"
                )}>
                  <tag.icon className="w-3 h-3" />
                  {tag.label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 通用设置项 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: '通知提醒', icon: Bell, value: '已开启' },
            { label: '云端同步', icon: Zap, value: '活跃' },
            { label: '偏好设置', icon: Settings, value: '标准' },
            { label: '关于与文档', icon: Info, value: 'v1.0.0' },
          ].map((item, i) => (
            <div key={i} className={cn(
              "p-6 rounded-xl border flex items-center justify-between transition-all",
              isTech 
                ? "bg-[#1a1a1a] border-white/5 hover:border-white/10" 
                : "bg-white border-slate-200 hover:border-slate-300"
            )}>
              <div className="flex items-center gap-4">
                <item.icon className={cn("w-4 h-4", isTech ? "text-[#b3b3b3]" : "text-[#374151]")} />
                <span className={cn("text-sm font-bold", isTech ? "text-white" : "text-[#111827]")}>{item.label}</span>
              </div>
              <span className={cn(
                "text-[10px] font-mono font-bold uppercase tracking-widest",
                isTech ? "text-primary" : "text-[#374151]"
              )}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
