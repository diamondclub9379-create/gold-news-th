"use client";

import { useState } from "react";

interface VideoCardProps {
  videoId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  channelTitle: string;
  publishedAt: string;
  featured?: boolean;
}

export default function VideoCard({
  videoId,
  title,
  description,
  thumbnailUrl,
  channelTitle,
  publishedAt,
  featured = false,
}: VideoCardProps) {
  const [playing, setPlaying] = useState(false);

  const date = new Date(publishedAt).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  if (featured) {
    return (
      <article className="relative bg-gradient-to-br from-gray-900 via-gray-900 to-red-950/20 border border-red-700/20 rounded-2xl overflow-hidden shadow-lg shadow-black/20">
        <div className="aspect-video bg-black overflow-hidden relative">
          {playing ? (
            <iframe
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
              title={title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <button
              onClick={() => setPlaying(true)}
              className="w-full h-full relative group cursor-pointer"
            >
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-7 h-7 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
        <div className="p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-red-500/15 text-red-400 border border-red-500/20 flex items-center gap-1.5">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/></svg>
              วิดีโอ
            </span>
            <span className="text-xs text-gray-500">{channelTitle}</span>
            <span className="text-xs text-gray-600 ml-auto">{date}</span>
          </div>
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            <h2 className="text-2xl font-bold text-gray-50 hover:text-red-400 transition-colors leading-snug">
              {title}
            </h2>
          </a>
          {description && (
            <p className="text-base text-gray-400 mt-3 line-clamp-2 leading-relaxed">
              {description}
            </p>
          )}
        </div>
      </article>
    );
  }

  return (
    <article className="h-full bg-gray-900/80 border border-gray-800/80 rounded-xl overflow-hidden hover:border-red-700/40 hover:bg-gray-900 transition-all duration-200 hover:shadow-lg hover:shadow-red-900/5 group">
      <div className="aspect-video bg-black overflow-hidden relative">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="w-full h-full relative cursor-pointer"
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <svg className="w-5 h-5 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="p-4">
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
          <h2 className="text-[15px] font-semibold text-gray-100 hover:text-red-400 transition-colors leading-snug line-clamp-2">
            {title}
          </h2>
        </a>
        {description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[11px] text-gray-500">{channelTitle}</span>
          <time className="text-[11px] text-gray-600 ml-auto">{date}</time>
        </div>
      </div>
    </article>
  );
}
