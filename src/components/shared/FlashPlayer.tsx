import { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useTheme } from '@/lib/theme-provider';
import { AlertCircle, Loader2, Play } from 'lucide-react';

interface FlashPlayerProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
}

declare global {
  interface Window {
    RufflePlayer: any;
  }
}

export default function FlashPlayer({ url, className, autoPlay = true }: FlashPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<any>(null);
  const { theme } = useTheme();
  const isTech = theme === 'tech';
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');

  useEffect(() => {
    let isMounted = true;

    const initRuffle = async () => {
      if (!window.RufflePlayer) {
        console.error("Ruffle script not loaded");
        setStatus('error');
        return;
      }

      const ruffle = window.RufflePlayer.newest();
      const player = ruffle.createPlayer();
      
      // 强制 player 填满容器
      player.style.width = '100%';
      player.style.height = '100%';
      player.style.display = 'block';
      
      playerRef.current = player;

      if (containerRef.current) {
        containerRef.current.innerHTML = '';
        containerRef.current.appendChild(player);
        
        try {
          await player.load(url);
          if (isMounted) {
            setStatus('ready');
            if (autoPlay) {
              player.play();
            }
          }
        } catch (err) {
          console.error("Failed to load SWF:", err);
          if (isMounted) setStatus('error');
        }
      }
    };

    initRuffle();

    return () => {
      isMounted = false;
      if (playerRef.current) {
        playerRef.current.remove();
      }
    };
  }, [url, autoPlay]);

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border transition-all aspect-video flex items-center justify-center bg-black/5",
      isTech ? "border-white/10" : "border-slate-200",
      className
    )}>
      {/* Ruffle 容器 */}
      <div ref={containerRef} className="w-full h-full" />

      {/* 加载状态 */}
      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest animate-pulse">
            初始化 Flash 仿真器...
          </p>
        </div>
      )}

      {/* 错误状态 */}
      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm gap-4 text-center px-6">
          <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
            <AlertCircle className="w-6 h-6 text-destructive" />
          </div>
          <div className="space-y-1">
            <p className="font-bold text-lg">无法播放动画</p>
            <p className="text-xs text-muted-foreground">
              请检查 SWF 文件路径或您的网络连接
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
          >
            重试
          </button>
        </div>
      )}

      {/* 封面提示（非自动播放或准备就绪前） */}
      {status === 'ready' && !autoPlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group cursor-pointer" onClick={() => playerRef.current?.play()}>
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      )}
    </div>
  );
}
