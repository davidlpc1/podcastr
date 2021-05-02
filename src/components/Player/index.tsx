import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import Slider from "rc-slider";
import { motion } from 'framer-motion';

import "rc-slider/assets/index.css";

import { usePlayer } from "../../contexts/PlayerContext";

import styles from "./styles.module.scss";
import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [isPlayerOpen, setIsPlayerOpen] = useState(true);

  const {
    episodeList,
    currentEpisodeIndex,
    isPlaying,
    isLooping,
    isShuffling,
    tooglePlay,
    toogleLoop,
    toogleShuffle,
    setPlayingState,
    playNext,
    playPrevious,
    hasNext,
    hasPrevious,
    clearPlayerState,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  function setupProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", () => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded() {
    if (hasNext) playNext();
    else {
      clearPlayerState();
    }
  }

  function togglePlayer() {
    setIsPlayerOpen(!isPlayerOpen);
  }

  const episode = episodeList[currentEpisodeIndex];

  return (
    <>
      {!isPlayerOpen && (
        <img
          className={styles.closeImage}
          src="/close.svg"
          alt="Abrir"
          title="Abrir"
          onClick={togglePlayer}
        />
      )}
      <motion.div
       transition={{ delay: 0.3, duration: 0.5 }}
        className={isPlayerOpen ? styles.playerContainer : styles.closed}
        variants={{
          show: { opacity: 1, y: "0" },
          hidden: { opacity: 0, y: "100%" },
        }}
        initial="hidden"
        animate="show"
      >
        <img
          className={styles.closeImage}
          src="/close.svg"
          alt="Fechar"
          title="Fechar"
          onClick={togglePlayer}
        />
        <header>
          <img src="/playing.svg" alt="Tocando agora" />
          <strong>Tocando agora</strong>
        </header>

        {episode ? (
          <div className={styles.currentEpisode}>
            <Image
              width={592}
              height={592}
              src={episode.thumbnail}
              objectFit="cover"
            />
            <strong>{episode.title}</strong>
            <span>{episode.members}</span>
          </div>
        ) : (
          <div className={styles.emptyPlayer}>
            <strong>Selecione um podcast para ouvir</strong>
          </div>
        )}

        <footer className={!episode ? styles.empty : ""}>
          <div className={styles.progress}>
            <span>{convertDurationToTimeString(progress)}</span>
            <div className={styles.slider}>
              {episode ? (
                <Slider
                  trackStyle={{ backgroundColor: "#04d361" }}
                  railStyle={{ backgroundColor: "#9f75ff" }}
                  handleStyle={{ borderColor: "#04d361", borderWidth: 4 }}
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                />
              ) : (
                <div className={styles.emptySlider} />
              )}
            </div>
            <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
          </div>

          {episode && (
            <audio
              src={episode.url}
              autoPlay
              loop={isLooping}
              ref={audioRef}
              onEnded={handleEpisodeEnded}
              onPlay={() => setPlayingState(true)}
              onPause={() => setPlayingState(false)}
              onLoadedMetadata={setupProgressListener}
            />
          )}

          <div className={styles.buttons}>
            <button
              onClick={toogleShuffle}
              type="button"
              disabled={!episode || episodeList.length === 1}
              title="Embaralhar"
              className={isShuffling ? styles.isActive : ""}
            >
              <img src="/shuffle.svg" alt="Embaralhar" />
            </button>
            <button
              type="button"
              title="Tocar anterior"
              disabled={!episode || !hasPrevious}
            >
              <img
                src="/play-previous.svg"
                alt="Tocar anterior"
                onClick={playPrevious}
              />
            </button>
            <button
              type="button"
              className={styles.playButton}
              disabled={!episode}
              onClick={tooglePlay}
            >
              {isPlaying ? (
                <img src="/pause.svg" alt="Pausar" />
              ) : (
                <img src="/play.svg" alt="Tocar" />
              )}
            </button>
            <button
              type="button"
              title="Tocar próxima"
              disabled={!episode || !hasNext}
              onClick={playNext}
            >
              <img src="/play-next.svg" alt="Tocar próxima" />
            </button>
            <button
              className={isLooping ? styles.isActive : ""}
              onClick={toogleLoop}
              type="button"
              title="Repetir"
              disabled={!episode}
            >
              <img src="/repeat.svg" alt="Repetir" />
            </button>
          </div>
        </footer>
      </motion.div>
    </>
  );
}
