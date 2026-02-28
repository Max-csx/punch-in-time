import { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { useTheme } from '@/lib/theme-provider';
import { AlertCircle, Loader2, Play } from 'lucide-react';

interface FlashPlayerProps {
  url: string;
  className?: string;
  autoPlay?: boolean;
}

// 初始化 Ruffle
const initRuffle = (): Promise<void> => {
  return new Promise((resolve, reject) => {
    // 检查是否已加载
    if ((window as any).RufflePlayer) {
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://unpkg.com/@ruffle-rs/ruffle@latest/ruffle.js';
    script.onload = () => resolve();
    script.onerror = () => {
      // 如果 CDN 失败，尝试备用方案
      const fallbackScript = document.createElement('script');
      fallbackScript.src = 'https://cdn.jsdelivr.net/npm/@ruffle-rs/ruffle@latest/ruffle.js';
      fallbackScript.onload = () => resolve();
      fallbackScript.onerror = () => reject(new Error('Ruffle failed to load'));
      document.head.appendChild(fallbackScript);
    };
    document.head.appendChild(script);
  });
};

export default function FlashPlayer({ url, className, autoPlay = true }: FlashPlayerProps) {
  const containerRef = useRef<HTMLObjectElement>(null);
  const { theme } = useTheme();
  const isTech = theme === 'tech';
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);

  const fullUrl = url.startsWith('http') ? url : `${window.location.origin}${url}`;
  console.log('[FlashPlayer] URL:', fullUrl);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        await initRuffle();
        if (isMounted) {
          setStatus('ready');
        }
      } catch (err) {
        console.error("Failed to load Ruffle:", err);
        if (isMounted) setStatus('error');
      }
    };

    setStatus('loading');
    init();

    return () => {
      isMounted = false;
    };
  }, [retryCount]);

  const handleRetry = () => {
    setRetryCount(c => c + 1);
  };

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border transition-all aspect-video flex items-center justify-center",
      isTech ? "border-white/10" : "border-slate-200",
      className
    )}>
      {/* Ruffle object - 使用标准 embed 方式 */}
      {status === 'ready' && (
        <object
          ref={containerRef}
          type="application/x-shockwave-flash"
          data={fullUrl}
          className="w-full h-full"
          style={{ background: '#000' }}
        >
          <param name="movie" value={fullUrl} />
          <param name="quality" value="high" />
          <param name="allowScriptAccess" value="always" />
          <param name="allowFullScreen" value="true" />
          {autoPlay ? (
            <param name="autoplay" value="true" />
          ) : (
            <param name="autoplay" value="false" />
          )}
          <embed
            src={fullUrl}
            type="application/x-shockwave-flash"
            className="w-full h-full"
            style={{ background: '#000' }}
            quality="high"
            allowScriptAccess="always"
            allowFullScreen="true"
            autoPlay={autoPlay ? 'true' : 'false'}
          />
        </object>
      )}

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
            onClick={handleRetry}
            className="mt-4 px-6 py-2 rounded-lg bg-primary text-white text-xs font-bold uppercase tracking-widest hover:opacity-90 transition-all"
          >
            重试
          </button>
        </div>
      )}

      {/* 封面提示（非自动播放） */}
      {status === 'ready' && !autoPlay && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      )}
    </div>
  );
}