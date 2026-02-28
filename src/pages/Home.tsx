import { Button } from "@/components/ui/button"
import { Feather } from "lucide-react"
import { cn } from "@/lib/utils"
import { useTheme } from '@/lib/theme-provider'
import { useNavigate } from 'react-router-dom'
import POEMS from '@/data/poems.json'

export default function Home() {
  const { theme } = useTheme();
  const isTech = theme === 'tech';
  const navigate = useNavigate();

  // 获取第一个未完成考试的诗词ID
  const getFirstUncompletedPoemId = () => {
    const completedPoems = JSON.parse(localStorage.getItem('completedPoems') || '[]');
    const uncompletedPoem = POEMS.find(poem => !completedPoems.includes(poem.id));
    return uncompletedPoem?.id || 1;
  };

  const handleStartLearning = () => {
    const poemId = getFirstUncompletedPoemId();
    navigate(`/punch-in?poemId=${poemId}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-700 min-h-[80vh]">
      {/* 顶部状态栏 (Hero Section) */}
      <header className="w-full max-w-4xl flex flex-col items-center px-4 text-center">
        <div className="flex flex-col items-center gap-10">
          <div className={cn(
            "w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500",
            isTech ? "bg-primary/20 text-primary shadow-[0_0_30px_rgba(124,58,237,0.2)]" : "bg-black text-white shadow-xl"
          )}>
            <Feather className="w-10 h-10" />
          </div>
          
          <h1 className={cn(
            "text-[56px] md:text-[84px] font-extrabold tracking-tighter leading-[1] flex flex-col items-center gap-2",
            isTech ? "text-white" : "text-[#111827]"
          )}>
            {isTech ? (
              <span>星辰伴读，静谧入心</span>
            ) : (
              <>
                <span>沐浴晨光，</span>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#ff8000] via-[#ffcc00] to-[#00cc88]">开启诗意一天。</span>
              </>
            )}
          </h1>
          
          <p className={cn(
            "max-w-2xl text-[20px] md:text-[24px] font-medium leading-relaxed opacity-80",
            isTech ? "text-[#e5e5e5]" : "text-[#374151]"
          )}>
            {isTech 
              ? "小小诗人为您提供静谧的夜间研习环境，专注于深度阅读与感悟。" 
              : "小小诗人伴您开启明媚的晨间诵读，感受古诗词的律动与美好。"}
          </p>
          
          <div className="flex flex-wrap justify-center gap-6 mt-12">
            <Button
              onClick={handleStartLearning}
              className={cn(
                "h-[64px] px-12 rounded-2xl text-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center gap-3",
                isTech 
                  ? "bg-primary text-white shadow-[0_0_40px_rgba(124,58,237,0.4)] hover:bg-primary/90" 
                  : "bg-black text-white shadow-2xl hover:bg-[#1a1a1a]"
              )}
            >
              <Feather className="w-6 h-6" />
              开始学习
            </Button>
            
            <Button 
              onClick={() => navigate('/stats')}
              variant="outline" 
              className={cn(
                "h-[64px] px-12 rounded-2xl text-xl font-bold transition-all border-2 hover:scale-105 active:scale-95",
                isTech 
                  ? "border-white/10 bg-white/5 text-white hover:bg-white/10" 
                  : "border-slate-200 bg-white text-[#111827] hover:bg-slate-50 shadow-sm"
              )}
            >
              查看成就
            </Button>
          </div>
        </div>

        {/* 底部装饰文案 */}
        <div className={cn(
          "mt-32 flex flex-col items-center gap-2 opacity-30",
          isTech ? "text-white" : "text-black"
        )}>
          <div className={cn("h-px w-12", isTech ? "bg-white" : "bg-black")} />
          <p className="text-[12px] font-bold uppercase tracking-[0.5em]">LITTLE POET VERSION 1.0</p>
        </div>
      </header>
    </div>
  )
}
