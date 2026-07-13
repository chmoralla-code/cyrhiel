"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

type BackgroundMusicContextValue = {
  playing: boolean;
  muted: boolean;
  needsUnlock: boolean;
  toggleMute: () => void;
  unlock: () => void;
};

const BackgroundMusicContext =
  createContext<BackgroundMusicContextValue | null>(null);

export function useBackgroundMusic() {
  return useContext(BackgroundMusicContext);
}

const SRC = "/audio/prologue.mp3?v=1";
const VOLUME = 0.45;

/**
 * Looping site score. Chrome/Safari block unmuted autoplay until a gesture —
 * we autoplay when allowed, otherwise show a one-tap unlock gate.
 */
export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [needsUnlock, setNeedsUnlock] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || mutedRef.current) return false;

    audio.loop = true;
    audio.volume = VOLUME;
    audio.muted = false;

    try {
      // Some engines need an explicit load before the first play().
      if (audio.readyState < 2) {
        audio.load();
      }
      await audio.play();
      setNeedsUnlock(false);
      setPlaying(true);
      return true;
    } catch {
      setPlaying(false);
      setNeedsUnlock(true);
      return false;
    }
  }, []);

  const unlock = useCallback(() => {
    if (mutedRef.current) return;
    void tryPlay();
  }, [tryPlay]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onPlay = () => {
      setPlaying(true);
      setNeedsUnlock(false);
    };
    const onPause = () => setPlaying(false);
    const onCanPlay = () => {
      if (!mutedRef.current && audio.paused) void tryPlay();
    };

    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("canplaythrough", onCanPlay, { once: true });

    // Multiple autoplay attempts — policy checks can race with loading.
    const t0 = window.setTimeout(() => void tryPlay(), 0);
    const t1 = window.setTimeout(() => void tryPlay(), 250);
    const t2 = window.setTimeout(() => void tryPlay(), 1000);

    const onGesture = () => {
      if (mutedRef.current) return;
      void tryPlay();
    };

    // Capture so nav/links still count as the unlock gesture.
    window.addEventListener("pointerdown", onGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener("touchstart", onGesture, {
      capture: true,
      passive: true,
    });
    window.addEventListener("keydown", onGesture, { capture: true });

    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("pointerdown", onGesture, true);
      window.removeEventListener("touchstart", onGesture, true);
      window.removeEventListener("keydown", onGesture, true);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("canplaythrough", onCanPlay);
    };
  }, [tryPlay]);

  useEffect(() => {
    mutedRef.current = muted;
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      audio.muted = true;
      audio.pause();
      setNeedsUnlock(false);
      return;
    }

    audio.muted = false;
    const id = window.setTimeout(() => {
      void tryPlay();
    }, 0);
    return () => window.clearTimeout(id);
  }, [muted, tryPlay]);

  const toggleMute = useCallback(() => {
    setMuted((v) => !v);
  }, []);

  const value = useMemo(
    () => ({ playing, muted, needsUnlock, toggleMute, unlock }),
    [playing, muted, needsUnlock, toggleMute, unlock],
  );

  return (
    <BackgroundMusicContext.Provider value={value}>
      <audio
        ref={audioRef}
        src={SRC}
        loop
        preload="auto"
        playsInline
        // Hint autoplay; browsers may still require a gesture for sound.
        autoPlay
      />
      {children}
      {needsUnlock && !muted ? <MusicUnlockGate onUnlock={unlock} /> : null}
    </BackgroundMusicContext.Provider>
  );
}

function MusicUnlockGate({ onUnlock }: { onUnlock: () => void }) {
  return (
    <button
      type="button"
      onClick={onUnlock}
      className="focus-ring fixed inset-x-0 bottom-0 z-[70] border-t border-seam-strong bg-[rgba(5,5,5,0.94)] px-[clamp(1.25rem,5vw,4rem)] py-4 text-left transition-opacity hover:opacity-95"
      aria-label="Start background music"
    >
      <span className="display block text-[0.65rem] tracking-[0.2em] uppercase text-reactor">
        Soundtrack ready
      </span>
      <span className="display mt-1 block text-[0.8rem] font-semibold tracking-[0.16em] uppercase text-foreground">
        Tap anywhere here to start music
      </span>
    </button>
  );
}

export function MusicToggle({ className = "" }: { className?: string }) {
  const music = useBackgroundMusic();
  if (!music) return null;

  return (
    <button
      type="button"
      onClick={() => {
        if (music.needsUnlock && music.muted === false && !music.playing) {
          music.unlock();
          return;
        }
        music.toggleMute();
      }}
      className={`focus-ring display text-[0.65rem] tracking-[0.18em] uppercase text-muted transition-colors hover:text-foreground ${className}`}
      aria-pressed={!music.muted && music.playing}
      aria-label={
        music.muted
          ? "Unmute background music"
          : music.playing
            ? "Mute background music"
            : "Start background music"
      }
      title={
        music.muted ? "Music off" : music.playing ? "Music on" : "Start music"
      }
    >
      {music.muted ? "Music off" : music.playing ? "Music" : "Play music"}
    </button>
  );
}
