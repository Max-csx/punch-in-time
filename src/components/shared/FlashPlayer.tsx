import { useEffect, useRef, useState, useCallback } from 'react';
import { cn } from "@/lib/utils";
import { useTheme } from '@/lib/theme-provider';
import { AlertCircle, Loader2, Play, Maximize, Minimize } from 'lucide-react';

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

// 检测是否为移动端
const isMobile = () => {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent.toLowerCase());
};

// 检测屏幕方向
const getOrientation = () => {
  return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
};

export default function FlashPlayer({ url, className, autoPlay = true }: FlashPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const objectRef = useRef<HTMLObjectElement>(null);
  const { theme } = useTheme();
  const isTech = theme === 'tech';
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [retryCount, setRetryCount] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [orientation, setOrientation] = useState(getOrientation());
  const [showControls, setShowControls] = useState(true);

  const fullUrl = url

  // 监听屏幕方向变化
  useEffect(() => {
    const handleOrientationChange = () => {
      setOrientation(getOrientation());
    };

    window.addEventListener('resize', handleOrientationChange);
    // 移动端监听方向变化
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, []);

  // 初始化 Ruffle
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

  // 全屏切换
  const toggleFullscreen = useCallback(async () => {
    if (!containerRef.current) return;

    try {
      if (!document.fullscreenElement) {
        // 进入全屏
        if (containerRef.current.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          // Safari
          await (containerRef.current as any).webkitRequestFullscreen();
        } else if ((containerRef.current as any).webkitEnterFullscreen) {
          // iOS Safari
          await (containerRef.current as any).webkitEnterFullscreen();
        }
        
        // 移动端尝试锁定横屏
        if (isMobile() && 'screen' in window && 'orientation' in screen) {
          try {
            await (screen.orientation as any).lock('landscape');
          } catch {
            // 某些浏览器不支持或拒绝锁定
          }
        }
        
        setIsFullscreen(true);
      } else {
        // 退出全屏
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        }
        
        // 解锁屏幕方向
        if ('screen' in window && 'orientation' in screen) {
          try {
            (screen.orientation as any).unlock();
          } catch {
            // 忽略错误
          }
        }
        
        setIsFullscreen(false);
      }
    } catch (err) {
      console.error('Fullscreen toggle failed:', err);
    }
  }, []);

  // 监听全屏变化
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const handleRetry = () => {
    setRetryCount(c => c + 1);
  };

  // 自动隐藏控制按钮
  useEffect(() => {
    if (status !== 'ready' || !isFullscreen) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    
    const showAndHide = () => {
      setShowControls(true);
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    };

    showAndHide();

    const handleInteraction = () => showAndHide();
    containerRef.current?.addEventListener('mousemove', handleInteraction);
    containerRef.current?.addEventListener('touchstart', handleInteraction);

    return () => {
      clearTimeout(hideTimer);
      containerRef.current?.removeEventListener('mousemove', handleInteraction);
      containerRef.current?.removeEventListener('touchstart', handleInteraction);
    };
  }, [status, isFullscreen]);

  // 移动端全屏时强制横屏显示
  const shouldRotateToLandscape = isMobile() && isFullscreen && orientation === 'portrait';

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative overflow-hidden rounded-2xl border transition-all aspect-video flex items-center justify-center group",
        isTech ? "border-white/10" : "border-slate-200",
        isFullscreen && "rounded-none border-none",
        className
      )}
      style={isFullscreen ? {
        background: '#000',
        ...(shouldRotateToLandscape && {
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vh',
          height: '100vw',
          transform: 'rotate(90deg) translateX(50%)',
          transformOrigin: 'top right',
        })
      } : undefined}
    >
      {/* Ruffle object - 使用标准 embed 方式 */}
      {status === 'ready' && (
        <object
          key={fullUrl}
          ref={objectRef}
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
            // allowScriptAccess="always"
            // allowFullScreen="true"
            // autoPlay={autoPlay ? 'true' : 'false'}
          />
        </object>
      )}

      {/* 全屏按钮 */}
      {status === 'ready' && (
        <button
          onClick={toggleFullscreen}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-lg transition-all z-10",
            "bg-black/50 hover:bg-black/70 text-white",
            showControls || !isFullscreen ? "opacity-100" : "opacity-0 pointer-events-none"
          )}
          title={isFullscreen ? "退出全屏" : "全屏播放"}
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </button>
      )}

      {/* 移动端横屏提示 */}
      {status === 'ready' && isMobile() && !isFullscreen && orientation === 'portrait' && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-full bg-black/50 text-white text-xs flex items-center gap-1.5 z-10">
          <svg className="w-4 h-4 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="2" width="16" height="20" rx="2" />
            <path d="M12 18h.01" />
          </svg>
          <span>横屏观看效果更佳</span>
        </div>
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
      {status === 'ready' && !autoPlay && !isFullscreen && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center transition-transform group-hover:scale-110">
            <Play className="w-8 h-8 text-white fill-white" />
          </div>
        </div>
      )}
    </div>
  );
}
