import { createContext, useContext, useEffect, useRef, useState } from "react";
import {
  resolveMediaUrl,
  getPlayerState,
  loadPlayerSong,
  playRemote,
  pauseRemote,
  nextRemote,
  previousRemote,
  seekRemote,
} from "../lib/api";

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const audioRef = useRef(new Audio());
  const stateRef = useRef({ queue: [], currentSong: null });
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    function onTimeUpdate() {
      setProgress(audio.currentTime || 0);
    }

    function onLoadedMetadata() {
      setDuration(audio.duration || 0);
    }

    function onEnded() {
      const { queue: activeQueue, currentSong: activeSong } = stateRef.current;
      if (!activeQueue.length || activeSong == null) {
        return;
      }
      const currentIndex = activeQueue.findIndex((song) => song.id === activeSong.id);
      const nextSong = activeQueue[currentIndex + 1];
      if (!nextSong) {
        setIsPlaying(false);
        return;
      }
      loadAndPlay(nextSong, activeQueue);
    }

    function onPlay() {
      setIsPlaying(true);
    }

    function onPause() {
      setIsPlaying(false);
    }

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
    };
  }, []);

  useEffect(() => {
    stateRef.current = { queue, currentSong };
  }, [queue, currentSong]);

  useEffect(() => {
    let active = true;
    getPlayerState()
      .then((serverState) => {
        if (!active || !serverState) return;
        setCurrentSong(serverState.currentSong || null);
        setQueue(serverState.queue || []);
        setIsPlaying(Boolean(serverState.playing));
        setProgress(serverState.progress || 0);
        setDuration(serverState.duration || 0);
      })
      .catch(() => {
        // silent fallback to local state
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  async function loadAndPlay(song, nextQueue) {
    const audio = audioRef.current;
    const queueSource = nextQueue?.length ? nextQueue : queue.length ? queue : [song];
    setQueue(queueSource);
    setCurrentSong(song);
    setProgress(0);

    loadPlayerSong(song.id, queueSource.map((item) => item.id)).catch(() => {});

    audio.src = resolveMediaUrl(song.streamUrl || song.fileUrl);
    try {
      await audio.play();
      setIsPlaying(true);
      playRemote().catch(() => {});
    } catch (error) {
      setIsPlaying(false);
    }
  }

  async function playSong(song, nextQueue) {
    if (currentSong?.id === song.id) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
        pauseRemote().catch(() => {});
      } else {
        await audioRef.current.play();
        setIsPlaying(true);
        playRemote().catch(() => {});
      }
      return;
    }
    await loadAndPlay(song, nextQueue);
  }

  function togglePlayback() {
    if (!currentSong) {
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
      pauseRemote().catch(() => {});
      return;
    }
    audioRef.current.play()
      .then(() => {
        setIsPlaying(true);
        playRemote().catch(() => {});
      })
      .catch(() => {
        setIsPlaying(false);
      });
  }

  function getCurrentIndex() {
    return queue.findIndex((song) => song.id === currentSong?.id);
  }

  function playNext() {
    if (!queue.length || currentSong == null) {
      return;
    }
    nextRemote()
      .then((updatedState) => {
        if (updatedState?.currentSong) {
          const updatedSong = updatedState.currentSong;
          const nextSong = queue.find((s) => s.id === updatedSong.id);
          if (nextSong) {
            loadAndPlay(nextSong, queue);
          }
        }
      })
      .catch(() => {
        const nextIndex = getCurrentIndex() + 1;
        if (nextIndex >= queue.length) {
          audioRef.current.pause();
          setIsPlaying(false);
          return;
        }
        loadAndPlay(queue[nextIndex], queue);
      });
  }

  function playPrevious() {
    if (!queue.length || currentSong == null) {
      return;
    }
    previousRemote()
      .then((updatedState) => {
        if (updatedState?.currentSong) {
          const updatedSong = updatedState.currentSong;
          const previousSong = queue.find((s) => s.id === updatedSong.id);
          if (previousSong) {
            loadAndPlay(previousSong, queue);
          }
        }
      })
      .catch(() => {
        const previousIndex = Math.max(0, getCurrentIndex() - 1);
        loadAndPlay(queue[previousIndex], queue);
      });
  }

  function seekTo(nextProgress) {
    audioRef.current.currentTime = nextProgress;
    setProgress(nextProgress);
    seekRemote(nextProgress).catch(() => {});
  }

  function changeVolume(nextVolume) {
    setVolume(nextVolume);
  }

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        queue,
        isPlaying,
        progress,
        duration,
        volume,
        isExpanded,
        playSong,
        togglePlayback,
        playNext,
        playPrevious,
        seekTo,
        setVolume: changeVolume,
        setQueue,
        setExpanded: setIsExpanded,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const context = useContext(PlayerContext);
  if (!context) {
    throw new Error("usePlayer must be used within PlayerProvider");
  }
  return context;
}
