"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Maximize, Pause, Play, Volume2, VolumeX } from "lucide-react";

export function VideoPlayer({
  src,
  poster,
  captions,
  label,
}: {
  src?: string | null;
  poster?: string | null;
  captions?: string | null;
  label: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playPromiseRef = useRef<Promise<void> | null>(null);
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [error, setError] = useState(false);

  if (!src) {
    return (
      <div className="card relative grid aspect-video w-full place-items-center overflow-hidden p-8 text-center">
        {poster ? (
          <Image src={poster} alt="" fill className="object-cover opacity-35" sizes="(max-width: 1024px) 92vw, 620px" />
        ) : null}
        <div className="relative flex flex-col items-center gap-3">
          <span
            className="grid h-14 w-14 place-items-center rounded-full"
            style={{ background: "var(--accent)", color: "var(--accent-ink)" }}
            aria-hidden
          >
            <Play size={20} />
          </span>
          <span className="chip">Placeholder</span>
          <span className="max-w-xs text-xs leading-relaxed text-[var(--ink-muted)]">
            No video uploaded yet. Add the “About me” video from the admin dashboard
            (Profile → About video).
          </span>
        </div>
      </div>
    );
  }

  async function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    try {
      if (video.paused) {
        setStarted(true);
        const promise = video.play();
        playPromiseRef.current = promise;
        await promise;
        setPlaying(true);
      } else {
        if (playPromiseRef.current) {
          await playPromiseRef.current.catch(() => {});
        }
        video.pause();
        setPlaying(false);
      }
    } catch {
      setError(true);
    }
  }

  return (
    <figure className="card relative overflow-hidden">
      <div className="relative aspect-video w-full bg-black">
        <video
          ref={videoRef}
          className="h-full w-full object-cover"
          preload="none"
          playsInline
          poster={poster ?? undefined}
          muted={muted}
          controls={false}
          onEnded={() => setPlaying(false)}
          onError={() => setError(true)}
          aria-label={label}
        >
          <source src={src} />
          {captions && <track kind="captions" src={captions} srcLang="en" label="English" default />}
          Your browser does not support embedded video.
        </video>

        {!started && poster && (
          <Image src={poster} alt={`${label} thumbnail`} fill sizes="(max-width:768px) 100vw, 640px" className="object-cover" />
        )}

        {!started && (
          <button
            type="button"
            onClick={togglePlay}
            className="group absolute inset-0 grid place-items-center bg-black/35 transition-colors hover:bg-black/25"
            aria-label={`Play ${label}`}
          >
            <span className="grid h-16 w-16 place-items-center rounded-full bg-[var(--accent)] text-[var(--accent-ink)] shadow-xl transition-transform group-hover:scale-110">
              <Play size={22} className="translate-x-0.5" />
            </span>
          </button>
        )}

        {error && (
          <p className="absolute inset-x-0 bottom-0 bg-black/70 p-3 text-center text-xs text-white">
            This video could not be played. Try a different browser or re-upload the file.
          </p>
        )}
      </div>

      <div className="flex items-center gap-2 p-3">
        <button type="button" onClick={togglePlay} className="btn btn-ghost !px-3 !py-2" aria-label={playing ? "Pause" : "Play"}>
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button
          type="button"
          onClick={() => {
            const next = !muted;
            setMuted(next);
            if (videoRef.current) videoRef.current.muted = next;
          }}
          className="btn btn-ghost !px-3 !py-2"
          aria-label={muted ? "Unmute" : "Mute"}
        >
          {muted ? <VolumeX size={14} /> : <Volume2 size={14} />}
        </button>
        <button
          type="button"
          onClick={() => videoRef.current?.requestFullscreen?.()}
          className="btn btn-ghost !px-3 !py-2"
          aria-label="Fullscreen"
        >
          <Maximize size={14} />
        </button>
        <figcaption className="ml-auto pr-1 text-xs text-[var(--ink-muted)]">{label}</figcaption>
      </div>
    </figure>
  );
}
