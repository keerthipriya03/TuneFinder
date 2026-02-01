export default function SongCard({ song, onPlay, onLike, isLiked }) {
  return (
    <div className="bg-zinc-900 p-4 rounded hover:bg-zinc-800 transition relative">
      
      {/* ❤️ Like */}
      <button
        onClick={onLike}
        className={`absolute top-2 right-2 text-xl ${
          isLiked ? "text-green-500" : "text-gray-400"
        }`}
      >
        ❤️
      </button>

      <img
        src={song.image || song.album?.images?.[0]?.url}
        className="w-full rounded mb-3"
      />

      <h3 className="font-semibold text-sm truncate">
        {song.trackName || song.title}
      </h3>

      <p className="text-xs text-gray-400 truncate">
        {song.artistName || song.artists?.[0]?.name}
      </p>

      <button
        onClick={onPlay}
        className="mt-3 w-full bg-green-500 text-black py-2 rounded font-semibold"
      >
        Play ▶
      </button>
    </div>
  );
}

