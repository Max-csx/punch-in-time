import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star, Share2, CheckCircle2, X, Feather, ChevronLeft, Image as ImageIcon, PlayCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import POEMS from "@/data/poems.json"
import { useTheme } from '@/lib/theme-provider'
import { useNavigate } from 'react-router-dom'
import FlashPlayer from '@/components/shared/FlashPlayer'

export default function PunchIn() {
  const { theme } = useTheme();
  const isTech = theme === 'tech';
  const navigate = useNavigate();
  const [poem, setPoem] = useState(POEMS[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [punchedIn, setPunchedIn] = useState(false);
  const [isExamining, setIsExamining] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  // 模拟每天轮换，确保与首页一致
  useEffect(() => {
    const validPoems = POEMS.filter(p => p.content && p.content.length > 0);
    const day = new Date().getDate();
    const month = new Date().getMonth();
    const index = (day + month * 31) % validPoems.length;
    setPoem(validPoems[0]);
  }, []);

  // 为当前诗词生成 4 张模拟图片（使用 Unsplash 关键词）
  const examImages = useMemo(() => {
    const keywords = [
      poem.title.slice(0, 2),
      "nature",
      "mountain",
      "river",
      "ink painting",
      "chinese culture",
      "ancient"
    ];
    // 随机打乱关键词并取 4 个
    const shuffled = [...keywords].sort(() => 0.5 - Math.random()).slice(0, 4);
    return shuffled.map((kw, i) => ({
      id: i,
      url: `https://images.unsplash.com/photo-1500000000000?auto=format&fit=crop&w=400&q=80&sig=${i}&keyword=${encodeURIComponent(kw)}`, // 这里的 sig 保证图片不同
      // 实际上 unsplash 的随机图片可以用 source.unsplash.com (已废弃) 或特定的 id
      // 这里我们用带随机种子的高质量占位图
      src: `https://picsum.photos/seed/${poem.title}-${i}/400/400`
    }));
  }, [poem.title]);

  const handleStartExam = () => {
    setIsExamining(true);
  };

  const handleSelectImage = (id: number) => {
    // 模拟考试逻辑：这里默认第一张是“正确”的，但为了体验，点击任意图片均视为完成
    setIsExamining(false);
    setPunchedIn(true);
    setShowSuccess(true);
  };

  const handleShare = () => {
    const text = `[小小诗人] 🌟 宝贝今天背会了《${poem.title}》！学习进度已同步，打卡成功！📖`;
    alert(`[模拟分享至微信群]\n\n内容如下：\n${text}`);
  };

  return (
    <div className="flex-1 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-700 max-w-5xl mx-auto w-full">
      {/* 顶部返回与标题 */}
      <header className="w-full mb-12 px-4 pt-8 flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => isExamining ? setIsExamining(false) : navigate('/')}
          className={cn(
            "gap-2 hover:bg-transparent px-0",
            isTech ? "text-primary hover:text-primary/80" : "text-black hover:opacity-70"
          )}
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-bold">{isExamining ? "返回诵读" : "返回首页"}</span>
        </Button>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full",
              isTech ? "bg-primary animate-pulse" : "bg-black"
            )} />
            <span className={cn(
              "text-[10px] font-bold uppercase tracking-[0.3em]",
              isTech ? "text-primary" : "text-[#374151]"
            )}>
              {isExamining ? "Final Examination" : "Study Protocol"}
            </span>
          </div>
          <h1 className={cn(
            "text-2xl font-black tracking-tighter",
            isTech ? "text-white" : "text-[#111827]"
          )}>
            {isExamining ? "意境考核" : "诵读打卡"}
          </h1>
        </div>
      </header>

      <main className="w-full flex-1 flex flex-col gap-12 px-4 pb-24">
        {!isExamining ? (
          <>
            {/* 动画播放器 */}
            {showFlash && (
              <div className="animate-in fade-in zoom-in duration-500 w-full max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h3 className={cn("text-lg font-bold flex items-center gap-2", isTech ? "text-primary" : "text-black")}>
                    <PlayCircle className="w-5 h-5" /> 诗词动画研习
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => setShowFlash(false)}
                    className={cn(isTech ? "text-white/40 hover:text-white" : "text-slate-400 hover:text-black")}
                  >
                    <X className="w-4 h-4 mr-2" /> 关闭动画
                  </Button>
                </div>
                <FlashPlayer url="/swf/1.swf" className="shadow-2xl" />
              </div>
            )}

            {/* 诗词卡片展示 */}
            <div className="relative group">
              {!showFlash && (
                <div className="absolute top-4 right-4 z-10">
                  <Button 
                    onClick={() => setShowFlash(true)}
                    variant="outline"
                    className={cn(
                      "h-10 rounded-full gap-2 border shadow-sm transition-all hover:scale-105 active:scale-95",
                      isTech 
                        ? "bg-[#1a1a1a] border-white/10 text-primary hover:bg-[#2a2a2a]" 
                        : "bg-white border-slate-200 text-black hover:bg-slate-50"
                    )}
                  >
                    <PlayCircle className="w-4 h-4" />
                    观看动画
                  </Button>
                </div>
              )}
              {isTech ? (
                <div className="absolute -inset-4 rounded-[3rem] blur-3xl opacity-10 transition-all duration-700 group-hover:opacity-20 bg-primary" />
              ) : (
                <div className="absolute -inset-8 rounded-[4rem] bg-gradient-to-r from-[#ff8000]/5 via-[#00cc88]/5 to-[#00bbff]/5 blur-2xl" />
              )}
              
              <Card className={cn(
                "relative border overflow-hidden flex flex-col transition-all duration-700 min-h-[500px]",
                isTech 
                  ? "bg-[#1a1a1a] border-white/10 rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.3)]" 
                  : "bg-white border-slate-200 rounded-[12px] shadow-[0_8px_30px_rgba(0,0,0,0.04)]"
              )}>
                <CardContent className="p-12 md:p-20 flex-1 flex flex-col items-center justify-center text-center relative">
                  <div className="space-y-12 my-auto relative w-full">
                    <div className="space-y-4">
                      <p className={cn(
                        "text-xs font-bold uppercase tracking-[0.4em]",
                        isTech ? "text-[#b3b3b3]" : "text-[#374151]"
                      )}>今日诵读</p>
                      <h2 className={cn(
                        "text-4xl md:text-7xl font-black tracking-tighter leading-none",
                        isTech ? "text-white" : "text-[#111827]"
                      )}>
                        {poem.title}
                      </h2>
                      <div className="flex flex-col items-center gap-2 pt-2">
                        <div className={cn("h-px w-12", isTech ? "bg-white/10" : "bg-slate-200")} />
                        <p className={cn(
                          "text-xl md:text-2xl font-bold tracking-tighter",
                          isTech ? "text-[#b3b3b3]" : "text-[#374151]"
                        )}>
                          {poem.author}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6 py-4">
                      {poem.content?.map((line, index) => (
                        <p key={index} className={cn(
                          "text-2xl md:text-5xl font-bold leading-tight tracking-tight",
                          isTech ? "text-white" : "text-[#111827]"
                        )}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col items-center gap-8">
              {!punchedIn ? (
                <div className="w-full group relative max-w-2xl">
                  <div className={cn(
                    "absolute -inset-1 rounded-full blur transition duration-1000 group-hover:duration-200",
                    isTech ? "bg-primary/30 opacity-0 group-hover:opacity-100" : "bg-black opacity-5 group-hover:opacity-10"
                  )} />
                  <Button 
                    onClick={handleStartExam}
                    className={cn(
                      "relative w-full h-20 md:h-24 rounded-xl border text-2xl md:text-3xl font-bold tracking-tighter gap-4 transition-all active:scale-[0.99]",
                      isTech 
                        ? "bg-primary text-white border-transparent hover:opacity-90 shadow-[0_0_20px_rgba(124,58,237,0.3)]" 
                        : "bg-black text-white border-transparent hover:bg-[#1a1a1a] shadow-xl"
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-lg flex items-center justify-center",
                      isTech ? "bg-white/20" : "bg-white/10"
                    )}>
                      <Feather className="w-6 h-6 text-white" />
                    </div>
                    开始考试
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6 w-full animate-in fade-in zoom-in duration-700 max-w-2xl">
                  <div className={cn(
                    "w-full p-px rounded-xl overflow-hidden",
                    isTech ? "bg-white/10" : "bg-slate-200"
                  )}>
                    <div className={cn(
                      "py-6 text-center",
                      isTech ? "bg-[#1a1a1a] backdrop-blur-sm" : "bg-white/50 backdrop-blur-md"
                    )}>
                      <p className={cn(
                        "font-bold text-lg flex items-center justify-center gap-3",
                        isTech ? "text-primary" : "text-[#111827]"
                      )}>
                        <CheckCircle2 className="w-6 h-6" /> 今日任务已达成
                      </p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleShare}
                    variant="outline"
                    className={cn(
                      "w-full h-16 rounded-xl font-bold gap-3 text-xl border transition-all hover:scale-[1.02]",
                      isTech 
                        ? "border-white/5 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white" 
                        : "border-slate-200 bg-white hover:bg-slate-50 text-[#111827] shadow-sm"
                    )}
                  >
                    <Share2 className="w-6 h-6" />
                    分享足迹
                  </Button>
                </div>
              )}
            </div>
          </>
        ) : (
          /* 考试 UI */
          <div className="flex flex-col items-center gap-12 w-full animate-in zoom-in duration-500">
            <div className="text-center space-y-4">
              <h2 className={cn(
                "text-3xl md:text-4xl font-black tracking-tight",
                isTech ? "text-white" : "text-[#111827]"
              )}>找出最符合古诗语境的图片</h2>
              <p className={cn(
                "text-lg font-medium opacity-60",
                isTech ? "text-white" : "text-black"
              )}>《{poem.title}》- {poem.author}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-8 w-full max-w-4xl px-4">
              {examImages.map((img) => (
                <button
                  key={img.id}
                  onClick={() => handleSelectImage(img.id)}
                  className={cn(
                    "relative aspect-square rounded-2xl overflow-hidden border-4 transition-all group active:scale-95",
                    isTech ? "border-white/5 hover:border-primary" : "border-slate-100 hover:border-black"
                  )}
                >
                  <img 
                    src={img.src} 
                    alt="exam-option" 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className={cn(
                    "absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border",
                    isTech ? "bg-[#1a1a1a] text-white border-white/10" : "bg-white text-black border-slate-200"
                  )}>
                    {String.fromCharCode(65 + img.id)}
                  </div>
                </button>
              ))}
            </div>

            <div className={cn(
              "p-6 rounded-xl border flex items-center gap-4 max-w-2xl w-full",
              isTech ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
            )}>
              <ImageIcon className={cn("w-6 h-6", isTech ? "text-primary" : "text-black")} />
              <p className={cn("text-sm font-medium", isTech ? "text-slate-400" : "text-slate-600")}>
                提示：仔细品味诗句中的景物描写，选择意境最贴切的一张。
              </p>
            </div>
          </div>
        )}
      </main>

      {/* 成功弹窗 */}
      {showSuccess && (
        <div className="fixed inset-0 bg-white/80 backdrop-blur-xl z-[100] flex items-center justify-center p-6 animate-in fade-in duration-500">
          <div className="relative group max-w-lg w-full">
            <div className={cn(
              "relative border p-12 md:p-16 flex flex-col items-center text-center shadow-2xl transition-all",
              isTech 
                ? "bg-[#1a1a1a] border-white/10 rounded-xl" 
                : "bg-white border-slate-200 rounded-[12px]"
            )}>
              <button 
                onClick={() => setShowSuccess(false)}
                className={cn(
                  "absolute top-6 right-6 p-2 rounded-full transition-all hover:rotate-90",
                  isTech ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-600"
                )}
              >
                <X className="w-5 h-5" />
              </button>

              <div className={cn(
                "w-24 h-24 rounded-xl flex items-center justify-center mb-8 relative overflow-hidden",
                isTech ? "bg-primary/10" : "bg-black"
              )}>
                <Feather className="w-12 h-12 text-white" />
                <div className={cn(
                  "absolute inset-0 rounded-xl border animate-ping opacity-10",
                  isTech ? "border-primary" : "border-black"
                )} />
              </div>

              <h3 className={cn(
                "text-3xl font-black mb-3 tracking-tighter",
                isTech ? "text-white" : "text-[#111827]"
              )}>研习达成</h3>
              <p className={cn(
                "text-lg font-medium mb-10 leading-relaxed px-4",
                isTech ? "text-[#b3b3b3]" : "text-[#374151]"
              )}>
                宝贝今天背会了《{poem.title}》！<br/>
                学习足迹已同步，快分享给家人看看吧。
              </p>

              <Button 
                onClick={handleShare}
                className={cn(
                  "w-full h-16 rounded-xl font-black text-2xl shadow-2xl transition-all hover:scale-[1.05] active:scale-95 flex items-center justify-center gap-3",
                  isTech 
                    ? "bg-primary text-white shadow-primary/30 hover:opacity-90" 
                    : "bg-[#07C160] text-white shadow-emerald-500/20 hover:bg-[#06ad56]"
                )}
              >
                <Share2 className="w-6 h-6" />
                一键分享微信群
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
