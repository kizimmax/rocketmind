"use client"

import * as React from "react"
import {
  Loader2,
  Maximize,
  Minimize,
  Pause,
  Play,
  Volume2,
  VolumeX,
} from "lucide-react"
import { cn } from "../../lib/utils"

// ── Types ──────────────────────────────────────────────────────────────────

export interface VideoPlayerProps
  extends Omit<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    "controls" | "onError"
  > {
  /** URL исходного видеофайла. Обязательный. */
  src: string
  /** Постер-картинка до старта воспроизведения. */
  poster?: string
  /** Классы для внешнего контейнера. */
  className?: string
  /** Расширение классов для самого `<video>`. По умолчанию object-contain. */
  videoClassName?: string
  /** Aspect-ratio контейнера до загрузки метаданных. Default: 16/9. */
  aspectRatio?: number
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00"
  const total = Math.floor(seconds)
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => String(n).padStart(2, "0")
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

const HIDE_CONTROLS_DELAY = 2000

// ── Component ──────────────────────────────────────────────────────────────

/**
 * VideoPlayer — кастомный плеер поверх HTML5 `<video>`.
 * Контролы: play/pause, scrubber, time, volume slider, fullscreen.
 * Клавиши: Space/K — play/pause, ←/→ — ±5s, ↑/↓ — громкость ±5%,
 * M — mute, F — fullscreen, Home/End — в начало/конец.
 * Контролы автоскрываются через 2s при воспроизведении, показываются
 * на hover/mousemove/focus. При паузе/на постере — всегда видны.
 */
export function VideoPlayer({
  src,
  poster,
  className,
  videoClassName,
  aspectRatio = 16 / 9,
  preload = "metadata",
  playsInline = true,
  ...rest
}: VideoPlayerProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const videoRef = React.useRef<HTMLVideoElement>(null)
  const hideTimerRef = React.useRef<number | null>(null)
  const wasPlayingBeforeScrubRef = React.useRef(false)

  const [isPlaying, setIsPlaying] = React.useState(false)
  const [isBuffering, setIsBuffering] = React.useState(false)
  const [isMuted, setIsMuted] = React.useState(false)
  const [volume, setVolume] = React.useState(1)
  const [currentTime, setCurrentTime] = React.useState(0)
  const [duration, setDuration] = React.useState(0)
  const [buffered, setBuffered] = React.useState(0)
  const [isFullscreen, setIsFullscreen] = React.useState(false)
  const [controlsVisible, setControlsVisible] = React.useState(true)
  const [hasStarted, setHasStarted] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [isScrubbing, setIsScrubbing] = React.useState(false)

  // Auto-hide controls while playing and mouse is idle.
  const scheduleHide = React.useCallback(() => {
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current)
    }
    hideTimerRef.current = window.setTimeout(() => {
      setControlsVisible(false)
    }, HIDE_CONTROLS_DELAY)
  }, [])

  const showControls = React.useCallback(() => {
    setControlsVisible(true)
    if (hideTimerRef.current !== null) {
      window.clearTimeout(hideTimerRef.current)
    }
    if (isPlaying && !isScrubbing) scheduleHide()
  }, [isPlaying, isScrubbing, scheduleHide])

  React.useEffect(() => {
    if (!isPlaying || isScrubbing) {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current)
      }
      setControlsVisible(true)
      return
    }
    scheduleHide()
    return () => {
      if (hideTimerRef.current !== null) {
        window.clearTimeout(hideTimerRef.current)
      }
    }
  }, [isPlaying, isScrubbing, scheduleHide])

  // Fullscreen sync across browsers.
  React.useEffect(() => {
    const onChange = () => {
      const fsEl =
        document.fullscreenElement ??
        (document as Document & { webkitFullscreenElement?: Element })
          .webkitFullscreenElement ??
        null
      setIsFullscreen(fsEl === containerRef.current)
    }
    document.addEventListener("fullscreenchange", onChange)
    document.addEventListener("webkitfullscreenchange", onChange)
    return () => {
      document.removeEventListener("fullscreenchange", onChange)
      document.removeEventListener("webkitfullscreenchange", onChange)
    }
  }, [])

  // ── Playback controls ────────────────────────────────────────────────────

  const togglePlay = React.useCallback(() => {
    const v = videoRef.current
    if (!v) return
    if (v.paused || v.ended) {
      v.play().catch(() => {
        /* autoplay / user-gesture policy — игнорируем, UI отразит paused. */
      })
    } else {
      v.pause()
    }
  }, [])

  const seekTo = React.useCallback((time: number) => {
    const v = videoRef.current
    if (!v || !Number.isFinite(v.duration)) return
    v.currentTime = clamp(time, 0, v.duration)
  }, [])

  const seekBy = React.useCallback(
    (delta: number) => {
      const v = videoRef.current
      if (!v) return
      seekTo(v.currentTime + delta)
    },
    [seekTo],
  )

  const setVolumeValue = React.useCallback((value: number) => {
    const v = videoRef.current
    if (!v) return
    const next = clamp(value, 0, 1)
    v.volume = next
    if (next > 0 && v.muted) v.muted = false
  }, [])

  const toggleMute = React.useCallback(() => {
    const v = videoRef.current
    if (!v) return
    v.muted = !v.muted
    if (!v.muted && v.volume === 0) {
      v.volume = 0.5
    }
  }, [])

  const toggleFullscreen = React.useCallback(() => {
    const el = containerRef.current as
      | (HTMLDivElement & {
          webkitRequestFullscreen?: () => Promise<void>
        })
      | null
    if (!el) return
    const doc = document as Document & {
      webkitFullscreenElement?: Element
      webkitExitFullscreen?: () => Promise<void>
    }
    const fsEl = document.fullscreenElement ?? doc.webkitFullscreenElement
    if (fsEl) {
      if (document.exitFullscreen) document.exitFullscreen().catch(() => {})
      else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen()
    } else {
      if (el.requestFullscreen) el.requestFullscreen().catch(() => {})
      else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    }
  }, [])

  // ── Scrubber handlers (pointer-based) ────────────────────────────────────

  const scrubberRef = React.useRef<HTMLDivElement>(null)

  const updateScrubFromPointer = React.useCallback(
    (clientX: number) => {
      const el = scrubberRef.current
      const v = videoRef.current
      if (!el || !v || !Number.isFinite(v.duration)) return
      const rect = el.getBoundingClientRect()
      const pct = clamp((clientX - rect.left) / rect.width, 0, 1)
      const nextTime = pct * v.duration
      setCurrentTime(nextTime) // оптимистичный апдейт пока pointer активен
      if (!isScrubbing) {
        v.currentTime = nextTime
      }
    },
    [isScrubbing],
  )

  const handleScrubPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v) return
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    wasPlayingBeforeScrubRef.current = !v.paused
    if (!v.paused) v.pause()
    setIsScrubbing(true)
    updateScrubFromPointer(e.clientX)
  }

  const handleScrubPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) return
    updateScrubFromPointer(e.clientX)
  }

  const handleScrubPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const v = videoRef.current
    if (!v) {
      setIsScrubbing(false)
      return
    }
    try {
      ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
    } catch {}
    const el = scrubberRef.current
    if (el && Number.isFinite(v.duration)) {
      const rect = el.getBoundingClientRect()
      const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1)
      v.currentTime = pct * v.duration
    }
    setIsScrubbing(false)
    if (wasPlayingBeforeScrubRef.current) {
      v.play().catch(() => {})
    }
  }

  // ── Volume slider (pointer) ──────────────────────────────────────────────

  const volumeRef = React.useRef<HTMLDivElement>(null)
  const [isVolScrubbing, setIsVolScrubbing] = React.useState(false)

  const updateVolumeFromPointer = React.useCallback(
    (clientX: number) => {
      const el = volumeRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const pct = clamp((clientX - rect.left) / rect.width, 0, 1)
      setVolumeValue(pct)
    },
    [setVolumeValue],
  )

  const handleVolPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    ;(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId)
    setIsVolScrubbing(true)
    updateVolumeFromPointer(e.clientX)
  }

  const handleVolPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isVolScrubbing) return
    updateVolumeFromPointer(e.clientX)
  }

  const handleVolPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    try {
      ;(e.currentTarget as HTMLDivElement).releasePointerCapture(e.pointerId)
    } catch {}
    setIsVolScrubbing(false)
  }

  // ── Keyboard shortcuts ───────────────────────────────────────────────────

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Не перехватываем, если фокус внутри textbox / select
    const tag = (e.target as HTMLElement).tagName?.toLowerCase()
    if (tag === "input" || tag === "textarea" || tag === "select") return
    const v = videoRef.current
    if (!v) return
    showControls()
    switch (e.key) {
      case " ":
      case "k":
      case "K":
        e.preventDefault()
        togglePlay()
        break
      case "ArrowLeft":
        e.preventDefault()
        seekBy(-5)
        break
      case "ArrowRight":
        e.preventDefault()
        seekBy(5)
        break
      case "ArrowUp":
        e.preventDefault()
        setVolumeValue(v.volume + 0.05)
        break
      case "ArrowDown":
        e.preventDefault()
        setVolumeValue(v.volume - 0.05)
        break
      case "m":
      case "M":
        e.preventDefault()
        toggleMute()
        break
      case "f":
      case "F":
        e.preventDefault()
        toggleFullscreen()
        break
      case "Home":
        e.preventDefault()
        seekTo(0)
        break
      case "End":
        e.preventDefault()
        if (Number.isFinite(v.duration)) seekTo(v.duration)
        break
      default:
        break
    }
  }

  // ── Video element event handlers ─────────────────────────────────────────

  const handlePlay = () => {
    setIsPlaying(true)
    setHasStarted(true)
  }
  const handlePause = () => setIsPlaying(false)
  const handleTimeUpdate = () => {
    const v = videoRef.current
    if (!v || isScrubbing) return
    setCurrentTime(v.currentTime)
  }
  const handleDurationChange = () => {
    const v = videoRef.current
    if (!v) return
    if (Number.isFinite(v.duration)) setDuration(v.duration)
  }
  const handleProgress = () => {
    const v = videoRef.current
    if (!v || v.buffered.length === 0 || !Number.isFinite(v.duration)) return
    setBuffered(v.buffered.end(v.buffered.length - 1))
  }
  const handleVolumeChange = () => {
    const v = videoRef.current
    if (!v) return
    setVolume(v.volume)
    setIsMuted(v.muted || v.volume === 0)
  }
  const handleWaiting = () => setIsBuffering(true)
  const handlePlaying = () => setIsBuffering(false)
  const handleCanPlay = () => setIsBuffering(false)
  const handleEnded = () => setIsPlaying(false)
  const handleVideoError = () => {
    setHasError(true)
    setIsBuffering(false)
  }

  // ── Derived UI ───────────────────────────────────────────────────────────

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedPct = duration > 0 ? (buffered / duration) * 100 : 0
  const volumePct = (isMuted ? 0 : volume) * 100
  const effectiveControlsVisible =
    controlsVisible || !isPlaying || isScrubbing || !hasStarted

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      onMouseMove={showControls}
      onMouseEnter={showControls}
      onMouseLeave={() => {
        if (isPlaying && !isScrubbing) setControlsVisible(false)
      }}
      onFocus={showControls}
      onContextMenu={(e) => e.preventDefault()}
      className={cn(
        "group/video relative w-full overflow-hidden bg-black",
        "rounded-[4px] outline-none",
        "focus-visible:ring-2 focus-visible:ring-[color:var(--rm-yellow-100)]",
        isFullscreen && "rounded-none",
        className,
      )}
      style={
        isFullscreen
          ? undefined
          : { aspectRatio: String(aspectRatio) }
      }
      data-state={isPlaying ? "playing" : "paused"}
    >
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        preload={preload}
        playsInline={playsInline}
        onClick={togglePlay}
        onPlay={handlePlay}
        onPause={handlePause}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onLoadedMetadata={handleDurationChange}
        onProgress={handleProgress}
        onVolumeChange={handleVolumeChange}
        onWaiting={handleWaiting}
        onPlaying={handlePlaying}
        onCanPlay={handleCanPlay}
        onEnded={handleEnded}
        onError={handleVideoError}
        className={cn(
          "absolute inset-0 h-full w-full cursor-pointer bg-black",
          "object-contain",
          videoClassName,
        )}
        {...rest}
      />

      {/* Центральная кнопка Play — показывается до старта или при паузе */}
      {!isPlaying && !isBuffering && !hasError && (
        <button
          type="button"
          aria-label="Воспроизвести"
          onClick={togglePlay}
          className={cn(
            "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
            "flex h-16 w-16 items-center justify-center rounded-full",
            "bg-[color:var(--rm-yellow-100)] text-[#0A0A0A]",
            "shadow-[0_4px_24px_rgba(0,0,0,0.35)]",
            "transition-transform duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
            "hover:scale-[1.06] active:scale-[0.98]",
          )}
        >
          <Play className="h-6 w-6 translate-x-[1px]" fill="currentColor" />
        </button>
      )}

      {/* Буферизация */}
      {isBuffering && !hasError && (
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader2 className="h-10 w-10 animate-spin text-[#F0F0F0]/90" />
        </div>
      )}

      {/* Ошибка */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 px-6 text-center">
          <p className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-12)] uppercase tracking-[0.02em] text-[#F0F0F0]">
            Видео не удалось загрузить
          </p>
        </div>
      )}

      {/* Controls bar */}
      <div
        className={cn(
          "pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-2 px-3 pb-3 pt-6 md:px-4 md:pb-4",
          "bg-gradient-to-t from-black/75 via-black/40 to-transparent",
          "transition-opacity duration-[var(--duration-standard)] ease-[var(--ease-standard)]",
          effectiveControlsVisible ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Scrubber */}
        <div
          ref={scrubberRef}
          role="slider"
          aria-label="Перемотка"
          aria-valuemin={0}
          aria-valuemax={duration || 0}
          aria-valuenow={currentTime}
          onPointerDown={handleScrubPointerDown}
          onPointerMove={handleScrubPointerMove}
          onPointerUp={handleScrubPointerUp}
          onPointerCancel={handleScrubPointerUp}
          className={cn(
            "pointer-events-auto group/bar relative h-3 cursor-pointer touch-none select-none",
            "flex items-center",
          )}
        >
          {/* Track */}
          <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/20 transition-[height] duration-[var(--duration-fast)] ease-[var(--ease-standard)] group-hover/bar:h-[5px] data-[scrub=true]:h-[5px]" data-scrub={isScrubbing}>
            {/* Buffered */}
            <div
              className="absolute inset-y-0 left-0 bg-white/35"
              style={{ width: `${bufferedPct}%` }}
            />
            {/* Played */}
            <div
              className="absolute inset-y-0 left-0 bg-[color:var(--rm-yellow-100)]"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          {/* Thumb */}
          <div
            className={cn(
              "absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[color:var(--rm-yellow-100)]",
              "shadow-[0_0_0_2px_rgba(0,0,0,0.25)]",
              "opacity-0 transition-opacity duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
              "group-hover/bar:opacity-100",
              isScrubbing && "opacity-100",
            )}
            style={{ left: `${progressPct}%` }}
          />
        </div>

        {/* Buttons row */}
        <div className="pointer-events-auto flex items-center gap-2 md:gap-3">
          <ControlButton onClick={togglePlay} label={isPlaying ? "Пауза" : "Воспроизвести"}>
            {isPlaying ? (
              <Pause className="h-4 w-4 md:h-5 md:w-5" fill="currentColor" />
            ) : (
              <Play className="h-4 w-4 translate-x-[1px] md:h-5 md:w-5" fill="currentColor" />
            )}
          </ControlButton>

          <span className="font-[family-name:var(--font-mono-family)] text-[length:var(--text-11)] uppercase tracking-[0.02em] text-[#F0F0F0] md:text-[length:var(--text-12)]">
            {formatTime(currentTime)}
            <span className="mx-1 text-[#F0F0F0]/50">/</span>
            {formatTime(duration)}
          </span>

          <div className="ml-auto flex items-center gap-2 md:gap-3">
            {/* Volume */}
            <div className="flex items-center gap-1">
              <ControlButton onClick={toggleMute} label={isMuted ? "Включить звук" : "Выключить звук"}>
                {isMuted || volume === 0 ? (
                  <VolumeX className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Volume2 className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </ControlButton>
              <div
                ref={volumeRef}
                role="slider"
                aria-label="Громкость"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={Math.round(volumePct)}
                onPointerDown={handleVolPointerDown}
                onPointerMove={handleVolPointerMove}
                onPointerUp={handleVolPointerUp}
                onPointerCancel={handleVolPointerUp}
                className="relative hidden h-3 w-[72px] cursor-pointer touch-none select-none items-center md:flex"
              >
                <div className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="absolute inset-y-0 left-0 bg-[#F0F0F0]"
                    style={{ width: `${volumePct}%` }}
                  />
                </div>
                <div
                  className="absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F0F0F0]"
                  style={{ left: `${volumePct}%` }}
                />
              </div>
            </div>

            <ControlButton
              onClick={toggleFullscreen}
              label={isFullscreen ? "Свернуть" : "На весь экран"}
            >
              {isFullscreen ? (
                <Minimize className="h-4 w-4 md:h-5 md:w-5" />
              ) : (
                <Maximize className="h-4 w-4 md:h-5 md:w-5" />
              )}
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Sub-components ─────────────────────────────────────────────────────────

function ControlButton({
  children,
  onClick,
  label,
}: {
  children: React.ReactNode
  onClick: () => void
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-[4px] text-[#F0F0F0]",
        "transition-colors duration-[var(--duration-fast)] ease-[var(--ease-standard)]",
        "hover:bg-white/10 hover:text-[color:var(--rm-yellow-100)]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--rm-yellow-100)]",
        "md:h-9 md:w-9",
      )}
    >
      {children}
    </button>
  )
}
