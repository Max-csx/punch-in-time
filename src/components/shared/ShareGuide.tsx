import { useEffect, useState } from 'react'
import { X, MessageCircle, Link2, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme-provider'

interface ShareGuideProps {
  visible: boolean
  onClose: () => void
  title: string
  desc: string
}

// 检测是否在微信内
const isWechat = () => {
  const ua = navigator.userAgent.toLowerCase()
  return ua.includes('micromessenger')
}

// 检测是否在移动端
const isMobile = () => {
  return /android|iphone|ipad|ipod|mobile/i.test(navigator.userAgent.toLowerCase())
}

export default function ShareGuide({ visible, onClose, title, desc }: ShareGuideProps) {
  const { theme } = useTheme()
  const isTech = theme === 'tech'
  const [copied, setCopied] = useState(false)
  const [inWechat, setInWechat] = useState(false)
  const [isMobileDevice, setIsMobileDevice] = useState(false)

  useEffect(() => {
    setInWechat(isWechat())
    setIsMobileDevice(isMobile())
  }, [])

  // 复制链接
  const handleCopyLink = async () => {
    const url = window.location.href
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // 降级方案
      const textarea = document.createElement('textarea')
      textarea.value = url
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 尝试唤醒微信（仅 Android）
  const handleOpenWechat = () => {
    if (/android/i.test(navigator.userAgent)) {
      // Android 可以尝试通过 scheme 唤醒微信
      window.location.href = 'weixin://'
    } else {
      // iOS 无法直接唤醒，引导用户手动打开
      alert('请手动打开微信，将链接分享给好友')
    }
  }

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[200] flex items-end justify-center">
      {/* 遮罩层 */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* 弹窗主体 */}
      <div className={cn(
        "relative w-full max-w-lg rounded-t-3xl p-6 pb-8 animate-in slide-in-from-bottom duration-500",
        isTech ? "bg-[#1a1a1a] border-t border-white/10" : "bg-white"
      )}>
        {/* 关闭按钮 */}
        <button
          onClick={onClose}
          className={cn(
            "absolute top-4 right-4 p-2 rounded-full transition-all",
            isTech ? "bg-white/5 text-slate-400 hover:text-white" : "bg-slate-100 text-slate-400 hover:bg-slate-200"
          )}
        >
          <X className="w-5 h-5" />
        </button>

        {/* 标题 */}
        <div className="text-center mb-6">
          <h3 className={cn(
            "text-xl font-bold mb-2",
            isTech ? "text-white" : "text-[#111827]"
          )}>
            分享给好友
          </h3>
          <p className={cn(
            "text-sm",
            isTech ? "text-slate-400" : "text-slate-500"
          )}>
            {inWechat ? '点击右上角 ··· 分享到微信' : '选择分享方式'}
          </p>
        </div>

        {/* 分享预览卡片 */}
        <div className={cn(
          "rounded-xl p-4 mb-6 border",
          isTech ? "bg-white/5 border-white/10" : "bg-slate-50 border-slate-200"
        )}>
          <div className="flex gap-3">
            <div className={cn(
              "w-16 h-16 rounded-lg flex-shrink-0 flex items-center justify-center",
              isTech ? "bg-primary/20" : "bg-primary/10"
            )}>
              <span className="text-2xl">📖</span>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className={cn(
                "font-bold text-sm truncate mb-1",
                isTech ? "text-white" : "text-[#111827]"
              )}>
                {title}
              </h4>
              <p className={cn(
                "text-xs line-clamp-2",
                isTech ? "text-slate-400" : "text-slate-500"
              )}>
                {desc}
              </p>
              <p className={cn(
                "text-[10px] mt-1 truncate",
                isTech ? "text-slate-500" : "text-slate-400"
              )}>
                {window.location.origin}
              </p>
            </div>
          </div>
        </div>

        {/* 微信内引导 */}
        {inWechat && (
          <div className={cn(
            "rounded-xl p-4 mb-4 text-center",
            isTech ? "bg-[#07C160]/20" : "bg-[#07C160]/10"
          )}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#07C160] flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-white" />
              </div>
              <span className={cn(
                "font-bold",
                isTech ? "text-white" : "text-[#111827]"
              )}>
                微信分享指引
              </span>
            </div>
            <p className={cn(
              "text-sm",
              isTech ? "text-slate-300" : "text-slate-600"
            )}>
              点击右上角 <span className="font-bold">···</span> 按钮
              <br />
              选择「发送给朋友」或「分享到朋友圈」
            </p>
            {/* 箭头指示 */}
            <div className="absolute -top-2 right-8 text-white animate-bounce">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4l-8 8h5v8h6v-8h5z" transform="rotate(-90 12 12) translate(0 -20)" />
              </svg>
            </div>
          </div>
        )}

        {/* 分享按钮 */}
        <div className="flex flex-col gap-3">
          {/* 复制链接 */}
          <button
            onClick={handleCopyLink}
            className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all active:scale-95",
              isTech 
                ? "bg-white/5 border-white/10 hover:bg-white/10" 
                : "bg-slate-50 border-slate-200 hover:bg-slate-100"
            )}
          >
            {copied ? (
              <>
                <CheckCircle className="w-6 h-6 text-[#07C160]" />
                <span className="text-sm font-medium text-[#07C160]">已复制</span>
              </>
            ) : (
              <>
                <Link2 className={cn("w-6 h-6", isTech ? "text-slate-300" : "text-slate-600")} />
                <span className={cn(
                  "text-sm font-medium",
                  isTech ? "text-slate-300" : "text-slate-600"
                )}>复制链接</span>
              </>
            )}
          </button>

          {/* 打开微信（非微信环境） */}
          {!inWechat && isMobileDevice && (
            <button
              onClick={handleOpenWechat}
              className={cn(
                "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border transition-all active:scale-95",
                "bg-[#07C160]/10 border-[#07C160]/30 hover:bg-[#07C160]/20"
              )}
            >
              <MessageCircle className="w-6 h-6 text-[#07C160]" />
              <span className="text-sm font-medium text-[#07C160]">打开微信</span>
            </button>
          )}

          {/* 微信图标（微信环境显示） */}
          {inWechat && (
            <div className={cn(
              "flex flex-col items-center justify-center gap-2 p-4 rounded-xl border",
              isTech 
                ? "bg-white/5 border-white/10" 
                : "bg-slate-50 border-slate-200"
            )}>
              <MessageCircle className={cn("w-6 h-6", isTech ? "text-slate-400" : "text-slate-400")} />
              <span className={cn(
                "text-sm font-medium",
                isTech ? "text-slate-400" : "text-slate-400"
              )}>微信好友</span>
            </div>
          )}
        </div>

        {/* 提示 */}
        {!inWechat && (
          <p className={cn(
            "text-center text-xs mt-4",
            isTech ? "text-slate-500" : "text-slate-400"
          )}>
            复制链接后，可在微信中粘贴分享
          </p>
        )}
      </div>
    </div>
  )
}
