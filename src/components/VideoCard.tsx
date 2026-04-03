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
    day: "numeric",
    month: "short",
  });

  const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;

  if (featured) {
    return (
      <article className="border border-gray-700 rounded-sm overflow-hidden bg-gray-950">
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
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                <div className="w-14 h-14 bg-red-600 rounded-sm flex items-center justify-center">
                  <svg className="w-6 h-6 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
        <div className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] px-1.5 py-0.5 rounded-sm bg-red-500/10 text-red-400 border border-red-500/20 uppercase">
              VIDEO
            </span>
            <span className="font-mono text-[10px] text-gray-600">{channelTitle}</span>
            <span className="font-mono text-[10px] text-gray-600 ml-auto">{date}</span>
          </div>
          <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
            <h2 className="text-lg font-bold text-gray-100 hover:text-amber-400 transition-colors leading-snug">
              {title}
            </h2>
          </a>
          {description && (
            <p className="text-sm text-gray-500 mt-2 line-clamp-2">{description}</p>
          )}
        </div>
      </article>
    );
  }

  // Non-featured: Compact horizontal
  return (
    <article className="flex items-start gap-3 p-3 border-b border-gray-800 last:border-b-0 hover:bg-gray-900/50 transition-colors">
      <div className="w-28 sm:w-36 shrink-0 aspect-video bg-black rounded-sm overflow-hidden relative">
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
            className="w-full h-full relative cursor-pointer group"
          >
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors flex items-center justify-center">
              <div className="w-8 h-8 bg-red-600 rounded-sm flex items-center justify-center">
                <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <a href={youtubeUrl} target="_blank" rel="noopener noreferrer">
          <h3 className="text-[13px] font-medium text-gray-200 hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
            {title}
          </h3>
        </a>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="font-mono text-[10px] text-gray-600">{channelTitle}</span>
          <span className="text-gray-700">|</span>
          <span className="font-mono text-[10px] text-gray-600">{date}</span>
        </div>
      </div>
    </article>
  );
}
