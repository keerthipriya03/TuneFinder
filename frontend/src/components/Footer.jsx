import React from 'react'

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 flex items-center px-6 z-50">
  
    {currentSong ? (
        <>
        {/* 🎵 Song Info */}
        <div className="flex items-center w-1/3">
            <img
            src={currentSong.artworkUrl60 || currentSong.album?.images?.[0]?.url}
            alt="cover"
            className="w-14 h-14 rounded mr-4"
            />
            <div>
            <p className="font-semibold text-sm truncate">
                {currentSong.trackName || currentSong.name}
            </p>
            <p className="text-xs text-gray-400 truncate">
                {currentSong.artistName || currentSong.artists?.[0]?.name}
            </p>
            </div>
        </div>

        {/* ▶️ Controls */}
        <div className="flex flex-col items-center w-1/3">
            <div className="flex gap-4">
            <button className="text-gray-400 hover:text-white">⏮️</button>

            <button
                onClick={togglePlay}
                className={`px-4 py-1 rounded-full ${
                currentSong.previewUrl
                    ? "bg-white text-black"
                    : "bg-gray-600 cursor-not-allowed"
                }`}
                disabled={!currentSong.previewUrl}
            >
                ▶ / ⏸
            </button>

            <button className="text-gray-400 hover:text-white">⏭️</button>
            </div>

            {/* Progress bar (UI only for now) */}
            <div className="w-full h-1 bg-zinc-700 rounded mt-2">
            <div className="w-1/3 h-full bg-white rounded"></div>
            </div>
        </div>

        {/* ❤️ Like */}
        <div className="flex justify-end w-1/3">
            <button className="text-gray-400 hover:text-green-500 text-xl">
            ❤️
            </button>
        </div>

        {/* 🔊 Audio */}
        {currentSong.previewUrl && (
            <audio ref={audioRef} src={currentSong.previewUrl} />
        )}
        </>
    ) : (
        <p className="text-gray-400">Select a song to play</p>
    )}
    </footer>
  )
}

export default Footer
