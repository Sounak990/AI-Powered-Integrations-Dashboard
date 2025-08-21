/* eslint-disable react/prop-types */
// AudioPlayer.js
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Pause, Play, VolumeX, Volume2 } from "lucide-react";
import React, { useRef, useState, useEffect } from "react";

import FastBackward5 from "../../../../assets/images/svg/fast-backward-5.svg";
import FastForward5 from "../../../../assets/images/svg/fast-forward-5.svg";

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const updateCurrentTime = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const updateDuration = () => {
    if (!isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  useEffect(() => {
    const audioElement = audioRef.current;
    if (audioElement) {
      audioElement.addEventListener("timeupdate", updateCurrentTime);
      audioElement.addEventListener("loadedmetadata", updateDuration);
    }

    return () => {
      if (audioElement) {
        audioElement.removeEventListener("timeupdate", updateCurrentTime);
        audioElement.removeEventListener("loadedmetadata", updateDuration);
      }
    };
  }, [audioUrl]);

  const getFileName = (url) => {
    try {
      const urlObject = new URL(url);
      const pathSegments = urlObject.pathname.split("/");
      return pathSegments[pathSegments.length - 1] || "unknown";
    } catch (error) {
      return url.split("/").pop().split("?")[0].split("#")[0] || "unknown";
    }
  };

  const skipTime = (seconds) => {
    const newTime = Math.min(
      Math.max(audioRef.current.currentTime + seconds, 0),
      duration
    );
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <Card className="bg-card-color w-full !border-none">
      <CardContent className="w-full flex flex-col gap-3">
        <div className="text-center text-green-400 mb-2">Recently Recorded</div>

        <div className="flex items-center justify-between mb-2">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={(e) => (audioRef.current.currentTime = e.target.value)}
          className="w-full mb-4 accent-primaryColor"
        />
        <div className="flex items-center relative justify-center gap-2">
          <Button
            variant="ghost"
            onClick={() => skipTime(-5)}
            className="p-2  rounded-full shadow-md focus:outline-none"
          >
            <img src={FastBackward5} className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            onClick={togglePlayPause}
            className="p-2 bg-white rounded-full shadow-md focus:outline-none"
          >
            {isPlaying ? (
              <Pause className="text-black" />
            ) : (
              <Play className="text-black" />
            )}
          </Button>
          <Button
            variant="ghost"
            onClick={() => skipTime(5)}
            className="p-2  rounded-full shadow-md focus:outline-none"
          >
            <img src={FastForward5} className="w-6 h-6" />
          </Button>
          <Button
            variant="ghost"
            onClick={toggleMute}
            className="p-2  rounded-full shadow-md focus:outline-none absolute right-0"
          >
            {isMuted ? (
              <VolumeX className="text-white" />
            ) : (
              <Volume2 className="text-white" />
            )}
          </Button>
        </div>
        <audio ref={audioRef} src={audioUrl} />
      </CardContent>
    </Card>
  );
};

export default AudioPlayer;
