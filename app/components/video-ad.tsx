'use client';

import { useRef, useState } from 'react';

export default function VideoAd() {
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  function handlePlay() {
    setPlaying(true);
    requestAnimationFrame(() => {
      videoRef.current?.play();
    });
  }

  function handleEnded() {
    setPlaying(false);
  }

  return (
    <section className="relative overflow-hidden rounded-card border border-border aspect-[16/9] sm:aspect-[21/9] bg-surface group">
      {!playing ? (
        <button
          type="button"
          onClick={handlePlay}
          className="relative block h-full w-full cursor-pointer text-left"
        >
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/bento/press-shot.jpg)' }}
          />
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 h-full p-7 sm:p-12 flex flex-col justify-between text-white">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-accent" />
              <span className="label-caps text-white/80">Nothing(R) · 2026</span>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="label-caps text-white/70 mb-1">Phone (4a) · Advertisement</p>
                <p className="text-lg font-display tracking-tight">Watch the film</p>
              </div>
              <div className="h-14 w-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6 text-black ml-0.5">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </div>
        </button>
      ) : (
        <video
          ref={videoRef}
          muted
          playsInline
          controls
          className="absolute inset-0 h-full w-full object-cover"
          onEnded={handleEnded}
        >
          <source src="/video/NothingPhone4a4.mp4" type="video/mp4" />
        </video>
      )}
    </section>
  );
}
