import { NavLink, Outlet } from 'react-router-dom'
import { Home, BarChart2, BookOpen, User, Feather, Sun, Moon, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme-provider'

const navItems = [
  { to: '/', icon: Home, label: '首页' },
  { to: '/stats', icon: BarChart2, label: '统计' },
  { to: '/library', icon: BookOpen, label: '诗库' },
  { to: '/profile', icon: User, label: '我的' },
]

export default function AppLayout() {
  const { theme, mode, toggleMode } = useTheme();
  const isTech = theme === 'tech';

  return (
    <div className={cn(
      "min-h-screen flex flex-col font-sans selection:bg-primary/30 transition-colors duration-500",
      isTech ? "bg-[#0a0a0a] text-white" : "bg-white text-[#111827]"
    )}>
      {/* 装饰性背景 */}
      <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-background">
        {isTech ? (
          <>
            {/* 科技风：深邃星空与手绘氛围云影 */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0f172a] to-[#0a0a0a]" />
            <div className="absolute inset-0 opacity-40 mix-blend-screen">
              {/* 模拟手绘云影与星空光晕 */}
              <div className="absolute top-[10%] left-[-10%] w-[80%] h-[60%] bg-purple-900/20 blur-[120px] rounded-[100%] animate-pulse" />
              <div className="absolute bottom-[5%] right-[-10%] w-[70%] h-[50%] bg-blue-900/20 blur-[120px] rounded-[100%] animate-pulse delay-700" />
              <div className="absolute top-[30%] right-[10%] w-[40%] h-[40%] bg-pink-900/10 blur-[100px] rounded-full" />
            </div>
            {/* 半透明遮罩层以提升文字可读性 */}
            <div className="absolute inset-0 bg-black/40" />
            {/* 极简网格线 */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
          </>
        ) : (
          <>
            {/* Vercel/Runway AI 极简风格：纯白底 + 放射状彩色渐变背景 */}
            <div className="absolute inset-0 bg-white" />
            
            {/* 中央放射状彩色渐变 (橙 → 黄 → 绿 → 青) */}
            <div className="absolute top-[15%] left-1/2 -translate-x-1/2 w-[800px] h-[600px] opacity-[0.25] pointer-events-none">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#ff8000_0%,#ffcc00_25%,#00cc88_50%,#00bbff_75%,transparent_100%)] blur-[120px] animate-pulse duration-[10s]" />
            </div>

            {/* 极简细线几何背景 (放射状同心圆) */}
            <svg className="absolute inset-0 w-full h-full opacity-[0.05]" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="radial-lines" cx="50%" cy="35%" r="50%">
                  <stop offset="0%" stopColor="#000" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
              </defs>
              <g stroke="currentColor" fill="none" strokeWidth="0.5">
                {[...Array(20)].map((_, i) => (
                  <circle key={i} cx="50%" cy="35%" r={(i + 1) * 40} />
                ))}
                {[...Array(36)].map((_, i) => (
                  <line 
                    key={i} 
                    x1="50%" y1="35%" 
                    x2={50 + 100 * Math.cos((i * 10 * Math.PI) / 180) + "%"} 
                    y2={35 + 100 * Math.sin((i * 10 * Math.PI) / 180) + "%"} 
                  />
                ))}
              </g>
            </svg>

            {/* 顶部极细装饰线 */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
          </>
        )}
      </div>

      {/* Web 顶部导航 */}
      <header className={cn(
        "hidden md:flex sticky top-0 z-40 w-full backdrop-blur-xl h-16 items-center justify-center px-8 border-b transition-all",
        isTech ? "bg-[#0a0a0a]/80 border-white/5" : "bg-white/60 border-primary/20"
      )}>
        <nav className="flex items-center gap-12 max-w-6xl w-full justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-8 h-8 flex items-center justify-center transition-all",
              isTech ? "bg-primary rounded-full" : "bg-black rounded-lg"
            )}>
              <Feather className={cn(
                "w-4 h-4",
                isTech ? "text-white" : "text-white"
              )} />
            </div>
            <div className={cn(
              "text-xl font-black tracking-tight transition-colors",
              isTech ? "text-white" : "text-[#111827]"
            )}>
              小小诗人
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    cn(
                      "relative flex items-center gap-2 text-sm font-semibold transition-all py-2",
                      isTech 
                        ? isActive 
                          ? "text-primary" 
                          : "text-white hover:text-primary"
                        : isActive
                          ? "text-[#111827] border-b-2 border-black"
                          : "text-[#374151] hover:text-[#111827]"
                    )
                  }
                >
                  <item.icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* 主题/日夜切换器 - 单图标循环模式 */}
            <div className="ml-4">
              <button
                onClick={toggleMode}
                className={cn(
                  "flex flex-col items-center justify-center w-10 h-10 rounded-full border transition-all relative group",
                  isTech ? "bg-white/5 border-white/10 text-primary hover:bg-white/10" : "bg-slate-100 border-slate-200 text-black hover:bg-slate-200"
                )}
                title={mode === 'auto' ? "当前模式：自适应 (点击切换至日间)" : mode === 'day' ? "当前模式：日间 (点击切换至夜间)" : "当前模式：夜间 (点击切换至自适应)"}
              >
                {mode === 'auto' ? (
                  <>
                    <Sparkles className="w-5 h-5 animate-pulse" />
                    <span className="absolute -top-1 -right-1 text-[8px] font-black bg-primary text-white px-1 rounded-full border border-background scale-75">AUTO</span>
                  </>
                ) : mode === 'day' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* 页面内容主体 */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 md:px-8 py-6 md:py-10 mb-20 md:mb-0">
        <div className="h-full flex flex-col">
          <Outlet />
        </div>
      </main>

      {/* App 底部 Tab 导航 */}
      <nav className={cn(
        "md:hidden fixed bottom-6 left-4 right-4 z-40 backdrop-blur-2xl border px-2 py-2 flex items-center justify-around shadow-2xl transition-all",
        isTech 
          ? "bg-card/80 border-white/10 rounded-[2rem]" 
          : "bg-white/90 border-primary/20 rounded-[2.5rem]"
      )}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              cn(
                "flex flex-col items-center gap-1 transition-all duration-300 flex-1 py-3 rounded-[1.5rem] relative overflow-hidden",
                isActive 
                  ? isTech ? "text-primary" : "text-primary"
                  : "text-muted-foreground/60"
              )
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <div className={cn(
                    "absolute inset-0 animate-in fade-in duration-500",
                    isTech ? "bg-primary/10" : "bg-primary/10"
                  )} />
                )}
                <item.icon className={cn(
                  "w-6 h-6 z-10", 
                  isActive 
                    ? isTech 
                      ? "stroke-[2.5px] drop-shadow-[0_0_8px_rgba(0,255,242,0.5)]" 
                      : "stroke-[3px] scale-110" 
                    : "stroke-[2px]"
                )} />
                <span className={cn(
                  "text-[10px] font-black z-10 tracking-widest uppercase", 
                  isActive ? "opacity-100" : "opacity-50"
                )}>
                  {item.label}
                </span>
              </>
            )}
          </NavLink>
        ))}

        {/* 移动端主题切换器 */}
        <button
          onClick={toggleMode}
          className={cn(
            "flex flex-col items-center gap-1 transition-all duration-300 flex-1 py-3 rounded-[1.5rem] relative",
            isTech ? "text-primary" : "text-black"
          )}
        >
          {mode === 'auto' ? (
            <>
              <Sparkles className="w-6 h-6 stroke-[2.5px] animate-pulse" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-100 flex items-center gap-1">
                <span className="text-[8px] bg-primary/20 text-primary px-1 rounded-[4px]">AUTO</span>
              </span>
            </>
          ) : mode === 'day' ? (
            <>
              <Sun className="w-6 h-6 stroke-[3px]" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-100">
                日间
              </span>
            </>
          ) : (
            <>
              <Moon className="w-6 h-6 stroke-[2.5px]" />
              <span className="text-[10px] font-black tracking-widest uppercase opacity-100">
                夜间
              </span>
            </>
          )}
        </button>
      </nav>
    </div>
  )
}
