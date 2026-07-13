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
  toggleMute: () => void;
};

const BackgroundMusicContext =
  createContext<BackgroundMusicContextValue | null>(null);

export function useBackgroundMusic() {
  return useContext(BackgroundMusicContext);
}

const SRC = "/audio/prologue.mp3";
const VOLUME = 0.42;

/**
 * Site-wide looping score. Browsers often block unmuted autoplay —
 * we try on load, then unlock on the first user gesture.
 */
export function BackgroundMusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const mutedRef = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);

  const tryPlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || mutedRef.current) return false;
    audio.volume = VOLUME;
    audio.muted = false;
    try {
      await audio.play();
      return true;
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    const audio = new Audio(SRC);
    audio.loop = true;
    audio.preload = "auto";
    audio.volume = VOLUME;
    audioRef.current = audio;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    const unlock = () => {
      if (mutedRef.current) return;
      void tryPlay();
    };

    // Defer autoplay attempt so it isn't a sync setState-in-effect.
    const boot = window.setTimeout(() => {
      void tryPlay();
    }, 0);

    window.addEventListener("pointerdown", unlock, { passive: true });
    window.addEventListener("keydown", unlock);

    return () => {
      window.clearTimeout(boot);
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      audioRef.current = null;
    };
  }, [tryPlay]);

  useEffect(() => {
    mutedRef.current = muted;
    const audio = audioRef.current;
    if (!audio) return;

    if (muted) {
      audio.muted = true;
      audio.pause();
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
    () => ({ playing, muted, toggleMute }),
    [playing, muted, toggleMute],
  );

  return (
    <BackgroundMusicContext.Provider value={value}>
      {children}
    </BackgroundMusicContext.Provider>
  );
}

export function MusicToggle({ className = "" }: { className?: string }) {
  const music = useBackgroundMusic();
  if (!music) return null;

  return (
    <button
      type="button"
      onClick={music.toggleMute}
      className={`focus-ring display text-[0.65rem] tracking-[0.18em] uppercase text-muted transition-colors hover:text-foreground ${className}`}
      aria-pressed={!music.muted}
      aria-label={
        music.muted ? "Unmute background music" : "Mute background music"
      }
      title={music.muted ? "Music off" : "Music on"}
    >
      {music.muted ? "Music off" : "Music"}
    </button>
  );
}
