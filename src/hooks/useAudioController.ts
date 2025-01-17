import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  State,
  Track,
  usePlaybackState,
} from 'react-native-track-player';
import {AudioData} from '../@types/audio';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPlayerState,
  updateOnGoingAudio,
  updateOnGoingList,
} from '../store/player';
import deepEqual from 'deep-equal';
import {useEffect} from 'react';

let isReady = false;

const updateQueue = async (data: AudioData[]) => {
  const lists: Track[] = data.map(item => {
    return {
      id: item.id,
      title: item.title,
      url: item.file,
      artwork: item.poster || require('../assets/music_small.png'),
      artist: item.owner.name,
      genre: item.category,
      isLiveStream: true,
    };
  });
  await TrackPlayer.add([...lists]);
};

const useAudioController = () => {
  const {state: playbackState} = usePlaybackState() as {state?: State};
  const {onGoingAudio, onGoingList} = useSelector(getPlayerState);
  const dispatch = useDispatch();

  const isPalyerReady = playbackState !== State.None;
  const isPalying = playbackState == State.Playing;
  const isPaused = playbackState == State.Paused;
  const isBusy =
    playbackState === State.Buffering || playbackState === State.Connecting;

  const onAudioPress = async (item: AudioData, data: AudioData[]) => {
    if (!isPalyerReady) {
      // Playing audio for the first time.
      await updateQueue(data);
      dispatch(updateOnGoingAudio(item));
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      return dispatch(updateOnGoingList(data));
    }

    if (playbackState === State.Playing && onGoingAudio?.id === item.id) {
      // same audio is already playing (handle pause)
      return await TrackPlayer.pause();
    }
    if (playbackState === State.Paused && onGoingAudio?.id === item.id) {
      // same audio no need to load resume
      return await TrackPlayer.play();
    }
    if (onGoingAudio?.id !== item.id) {
      // new audio from same list
      await TrackPlayer.pause();
      const index = data.findIndex(audio => audio.id === item.id);
      await TrackPlayer.skip(index);
      await TrackPlayer.play();
      dispatch(updateOnGoingAudio(item));
    }
  };

  const togglePlayPause = async () => {
    if (isPalying) await TrackPlayer.pause();
    if (isPaused) await TrackPlayer.play();
  };
  const seekTo = async (position: number) => {
    await TrackPlayer.seekTo(position);
  };

  const skipTo = async (sec: number) => {
    const {position: currentPosition} = await TrackPlayer.getProgress();
    await TrackPlayer.seekTo(currentPosition + sec);
  };

  const onNextPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();
    if (currentIndex === null) return;

    const nextIndex = currentIndex + 1;

    const nextAudio = currentList[nextIndex];
    if (nextAudio) {
      await TrackPlayer.skipToNext();
      dispatch(updateOnGoingAudio(onGoingList[nextIndex]));
    }
  };

  const onPreviousPress = async () => {
    const currentList = await TrackPlayer.getQueue();
    const currentIndex = await TrackPlayer.getCurrentTrack();
    if (currentIndex === null) return;

    const preIndex = currentIndex - 1;

    const nextAudio = currentList[preIndex];
    if (nextAudio) {
      await TrackPlayer.skipToPrevious();
      dispatch(updateOnGoingAudio(onGoingList[preIndex]));
    }
  };

  useEffect(() => {
    const setupPlayer = async () => {
      if (isReady) return;

      await TrackPlayer.setupPlayer();
      await TrackPlayer.updateOptions({
        android: {
          appKilledPlaybackBehavior:
            AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
        },
        capabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
        compactCapabilities: [
          Capability.Play,
          Capability.Pause,
          Capability.SkipToNext,
          Capability.SkipToPrevious,
        ],
      });
    };

    setupPlayer();
    isReady = true;
  }, []);

  return {
    onAudioPress,
    seekTo,
    isPalyerReady,
    isPalying,
    skipTo,
    togglePlayPause,
    onNextPress,
    onPreviousPress,
    isBusy,
  };
};

export default useAudioController;
