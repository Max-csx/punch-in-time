import { useTheme } from '@/lib/theme-provider'
import { BarChart2, TrendingUp, Calendar, Trophy, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export default function Stats() {
  const { theme } = useTheme();
  const isTech = theme === 'tech';

  const stats = [
    { label: '累计诵读', value: '42', unit: '首', icon: Trophy, trend: '本周 +5' },
    { label: '连续打卡', value: '12', unit: '天', icon: Calendar, trend: '个人最佳' },
    { label: '研习月份', value: '2', unit: '月', icon: BarChart2, trend: '稳定进行' },
    { label: '超越同侪', value: '88', unit: '%', icon: TrendingUp, trend: '前 12%' },
  ];

  // 模拟最近 7 天的数据
  const recentActivity = [
    { day: '周一', count: 1, status: 'completed' },
    { day: '周二', count: 1, status: 'completed' },
    { day: '周三', count: 0, status: 'missed' },
    { day: '周四', count: 1, status: 'completed' },
    { day: '周五', count: 1, status: 'completed' },
    { day: '周六', count: 1, status: 'completed' },
    { day: '周日', count: 1, status: 'completed' },
  ];

  return (
    <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="w-full max-w-4xl mb-12 px-4 pt-8">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full animate-pulse",
              isTech ? "bg-primary" : "bg-[#00cc88]"
            )} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em]",
              isTech ? "text-primary" : "text-[#374151]"
            )}>
              {isTech ? "研习数据统计" : "成长轨迹 / 研习表现"}
            </span>
          </div>
          <h1 className={cn(
            "text-4xl md:text-5xl font-black tracking-tighter",
            isTech ? "text-white" : "text-[#111827]"
          )}>
            {isTech ? "诵读成果统计" : "我的成长点滴"}
          </h1>
        </div>
      </header>

      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 px-4">
        {stats.map((stat, i) => (
          <div key={i} className={cn(
            "p-8 rounded-[12px] flex flex-col gap-4 transition-all border group",
            isTech 
              ? "bg-[#1a1a1a] border-white/5 hover:border-primary/50" 
              : "bg-white border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          )}>
            <div className="flex justify-between items-start">
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center transition-colors",
                isTech ? "bg-white/5 text-primary group-hover:bg-primary/10" : "bg-slate-50 text-[#111827] group-hover:bg-slate-100"
              )}>
                <stat.icon className="w-6 h-6" />
              </div>
              <span className={cn(
                "text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-full",
                isTech ? "bg-primary/10 text-primary" : "bg-emerald-50 text-emerald-600"
              )}>{stat.trend}</span>
            </div>
            <div className="space-y-1">
              <p className={cn(
                "text-[11px] font-bold uppercase tracking-wider",
                isTech ? "text-[#b3b3b3]" : "text-[#374151]"
              )}>{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <span className={cn(
                  "text-4xl font-black tracking-tighter",
                  isTech ? "text-white" : "text-[#111827]"
                )}>{stat.value}</span>
                <span className={cn(
                  "text-xs font-bold",
                  isTech ? "text-[#b3b3b3]" : "text-[#374151]"
                )}>{stat.unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 最近活动图表 */}
      <div className="w-full max-w-4xl mt-12 px-4 pb-24">
        <div className={cn(
          "w-full rounded-[12px] border p-10 space-y-8",
          isTech 
            ? "bg-[#1a1a1a] border-white/5" 
            : "bg-white border-slate-200 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
        )}>
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "text-xl font-bold tracking-tight",
              isTech ? "text-white" : "text-[#111827]"
            )}>每周打卡分布</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">已诵读</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-muted" />
                <span className="text-[10px] font-bold uppercase text-muted-foreground">未完成</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-4 h-48 items-end">
            {recentActivity.map((day, i) => (
              <div key={i} className="flex flex-col items-center gap-4 group">
                <div className="relative w-full flex justify-center">
                  <div 
                    className={cn(
                      "w-full max-w-[40px] rounded-t-lg transition-all duration-500",
                      day.status === 'completed' 
                        ? isTech ? "bg-primary shadow-[0_0_15px_rgba(124,58,237,0.3)]" : "bg-black"
                        : "bg-muted opacity-20"
                    )}
                    style={{ height: day.count ? '140px' : '20px' }}
                  />
                  {day.status === 'completed' && (
                    <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 className={cn("w-5 h-5", isTech ? "text-primary" : "text-black")} />
                    </div>
                  )}
                </div>
                <span className={cn(
                  "text-[10px] font-bold uppercase tracking-widest",
                  isTech ? "text-[#b3b3b3]" : "text-[#374151]"
                )}>{day.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
