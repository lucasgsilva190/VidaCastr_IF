import { createContext, ReactNode, useContext, useState } from "react";

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
};

type PlayerContextData ={
    episodeList: Episode[];
    currentEpisodeIndex: number; 
    isPlaying: boolean;
    isLooping: boolean;
    isShuffling: boolean;
    play: (episode: Episode) => void;
    playList: (list: Episode[], index: number) => void;
    setPlayingState: (state: boolean) => void;
    togglePlay: () => void;
    toggleShuffle: () => void;
    toggleLoop: () => void;
    playNext: () => void;
    playPrevious: () => void;
    clearPlayerState: () => void;
    hasNext : boolean;
    hasPrevious: boolean;




}


export const PlayerContext = createContext ({} as PlayerContextData);

type PlayerContextProviderProps = {
    children: ReactNode;
}

export function PlayerContextProvider ({children}: PlayerContextProviderProps){
  const [episodeList, setEpisodeList] = useState ([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState (0);
  const [isPlaying, setIsPlaying] = useState (false);
  const [isLooping, setIsLooping] = useState (false);
  const [isShuffling, setIsShuffling] = useState (false);


  function play (episode) {
    setEpisodeList ([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index:number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay (){
    setIsPlaying(!isPlaying);
  }

  function toggleShuffle (){
    setIsShuffling(!isShuffling);
  }

  function toggleLoop(){
    setIsLooping(!isLooping);
  }

  function setPlayingState (state: boolean) {
    setIsPlaying(state);
  }

  function clearPlayerState (){
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || (currentEpisodeIndex + 1) < episodeList.length;

  function playPrevious() {
  

    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex (nextRandomEpisodeIndex)
    } else if (hasNext) {

    setCurrentEpisodeIndex(currentEpisodeIndex + 1);
  }
    
  }

  function playNext (){


    if(isShuffling){
      const previousRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex (previousRandomEpisodeIndex)
    } else if (hasPrevious) {

    setCurrentEpisodeIndex(currentEpisodeIndex - 1);
  }

}

  return (
    <PlayerContext.Provider 
    value={{
        episodeList,
        currentEpisodeIndex, 
        play, 
        isPlaying, 
        isShuffling,
        playNext,
        playPrevious,
        playList,
        togglePlay, 
        setPlayingState,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        toggleShuffle,
        clearPlayerState
        }}
    >
    {children}

    </PlayerContext.Provider>
  )
}


export const usePlayer = () => {
  return useContext(PlayerContext);
}




