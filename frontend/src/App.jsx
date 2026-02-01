import { useEffect, useState, useRef } from "react";
import SongCard from "./components/SongCard";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("pop");
  const [currentSong, setCurrentSong] = useState(null);
  const audioRef = useRef(null);

  const [lyrics, setLyrics] = useState("");
  const [lyricsLoading, setLyricsLoading] = useState(false);

  const [library, setLibrary] = useState(() => {
    return JSON.parse(localStorage.getItem("myLibrary")) || [];
  });


  /* ================== HELPERS ================== */

  const normalizeSong = (song) => ({
    id: song.trackId || song.id,
    name: song.trackName || song.title,
    artist: song.artistName || song.artists?.[0]?.name,
    image:
      song.artworkUrl100 ||
      song.image ||
      song.album?.images?.[0]?.url,
    previewUrl: song.previewUrl || song.preview_url || null,
  });

  /* ================== API ================== */

  const fetchSongs = () => {
    setLoading(true);
    fetch(`http://localhost:3000/search?q=${search}`)
      .then((res) => res.json())
      .then((data) => {
        setSongs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  

  /* ================== LIBRARY ================== */

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("myLibrary")) || [];
    setLibrary(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem("myLibrary", JSON.stringify(library));
  }, [library]);

  const toggleLibrary = (song) => {
    // const normalized = normalizeSong(song);
    // const exists = library.some((item) => item.id === normalized.id);

    setLibrary((prevLibrary) => {
      const exists = prevLibrary.some((item) => item.id === song.id);

      if (exists) {
        // Remove the song if it already exists
        return prevLibrary.filter((item) => item.id !== song.id);
      } else {
        // Add the song
        return [...prevLibrary, {
          id: song.id,
          name: song.title,
          artist: song.artist,
          image: song.image
        }];
      }
    });
  };

  // Check if a song is in favourites
  const isFavourited = (song) => {
    return library.some((item) => item.id === song.id);
  };
  /* ================== PLAYER ================== */

  const playSong = (song) => {
    const normalized = normalizeSong(song);
    setCurrentSong(normalized);

    fetchLyrics(normalized.artist, normalized.name);

    setTimeout(() => audioRef.current?.play(), 100);
  };


  const fetchLyrics = async (artist, title) => {
    setLyricsLoading(true);
    setLyrics("");

    try {
      const res = await fetch(
        `https://api.lyrics.ovh/v1/${artist}/${title}`
      );
      const data = await res.json();

      setLyrics(data.lyrics || "Lyrics not found.");
    } catch (error) {
      setLyrics("Lyrics not available.");
    } finally {
      setLyricsLoading(false);
    }
  };


  const togglePlay = () => {
    if (!audioRef.current) return;
    audioRef.current.paused
      ? audioRef.current.play()
      : audioRef.current.pause();
  };

  /* ================== UI ================== */

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 right-0 h-16 bg-zinc-900 flex items-center px-4 md:px-6 z-40">
        <div className="flex-1 flex justify-center md:justify-start">
          <div className="flex w-full md:w-1/2">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search songs..."
              className="flex-1 px-4 py-2 text-black rounded-l"
            />
            <button
              onClick={fetchSongs}
              className="bg-green-500 px-6 py-2 rounded-r text-black font-semibold"
            >
              Search
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3 ml-auto">
          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-black font-bold">
            U
          </div>
          <span className="text-sm hidden md:inline">Profile</span>
        </div>
      </header>

      {/* BODY */}
      <div className="flex flex-1 pt-16">
        {/* SIDEBAR */}
        <aside className="w-72 bg-zinc-900 p-4 border-r border-zinc-800 fixed top-16 bottom-20 overflow-y-auto hidden md:block">
          <h2 className="text-lg font-semibold mb-4">📚 My Library</h2>

          {/* Lyrics */}
          <div className="mt-6 border-t border-zinc-700 pt-4">
            <h3 className="text-sm font-semibold mb-2">🎤 Lyrics</h3>
            {lyricsLoading ? (
              <p className="text-gray-400 text-sm">Loading lyrics...</p>
            ) : (
              <div className="text-xs text-gray-300 whitespace-pre-line max-h-40 overflow-y-auto">
                {lyrics || "Select a song to view lyrics"}
              </div>
            )}
          </div>

          {/* Favourites */}
          <div className="mt-6">
            {library.length === 0 ? (
              <p className="text-gray-400 text-sm">No favourites yet</p>
            ) : (
              <div className="space-y-3 overflow-y-auto max-h-[50vh] pr-2">
                {library.map((song) => (
                  <div
                    key={song.id}
                    onClick={() => playSong(song)}
                    className="flex items-center gap-3 cursor-pointer hover:bg-zinc-800 p-2 rounded transition-colors"
                  >
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-10 h-10 rounded"
                    />
                    <div className="overflow-hidden">
                      <p className="text-sm truncate">{song.title}</p>
                      <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                    </div>
                    <span className="ml-auto text-red-500">❤️</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        {/* MAIN */}
        <main className="ml-0 md:ml-72 pt-20 pb-24 px-4 md:px-6 flex-1">
          <h2 className="text-2xl font-semibold mb-6">Albums</h2>

          {loading ? (
            <p className="text-gray-400">Loading songs...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {songs.map((song) => (
                <div
                  key={song.id}
                  className="bg-zinc-900 p-3 rounded-lg cursor-pointer hover:bg-zinc-800 transition-colors"
                >
                  <div className="relative">
                    <img
                      src={song.image}
                      alt={song.title}
                      className="w-full h-40 object-cover rounded"
                      onClick={() => playSong(song)}
                    />
                    <button
                      onClick={() => toggleLibrary(song)}
                      className="absolute top-2 right-2 text-xl"
                    >
                      {library.some((item) => item.id === song.id) ? "❤️" : "🤍"}
                    </button>
                  </div>
                  <p className="text-sm truncate mt-2">{song.title}</p>
                  <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="fixed bottom-0 left-0 right-0 h-20 bg-zinc-900 border-t border-zinc-800 flex flex-col md:flex-row items-center px-4 md:px-6 z-50">
        {currentSong ? (
          <>
            <div className="flex items-center w-full md:w-1/3 mb-2 md:mb-0">
              <img
                src={currentSong.image}
                className="w-14 h-14 rounded mr-4"
              />
              <div>
                <p className="font-semibold text-sm truncate">{currentsong.title}</p>
                <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
              </div>
            </div>

            <div className="flex flex-col items-center w-full md:w-1/3 mb-2 md:mb-0">
              <button
                onClick={togglePlay}
                className="bg-white text-black px-4 py-1 rounded-full"
              >
                ▶ / ⏸
              </button>
              <div className="w-full h-1 bg-zinc-700 rounded mt-2">
                <div className="w-1/3 h-full bg-white rounded"></div>
              </div>
            </div>

            <div className="flex justify-end w-full md:w-1/3">
              <button
                onClick={() => toggleLibrary(currentSong)}
                className={`text-xl ${
                  library.some((item) => item.id === currentSong.id)
                    ? "text-red-500"
                    : "text-gray-400"
                }`}
              >
                ❤️
              </button>
            </div>

            {currentSong.previewUrl && <audio ref={audioRef} src={currentSong.previewUrl} />}
          </>
        ) : (
          <p className="text-gray-400">Select a song to play</p>
        )}
      </footer>
    </div>
  );
}
