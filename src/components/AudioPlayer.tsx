import AppLink from '@ui/AppLink';
import AppModal from '@ui/AppModal';
import colors from '@utils/colors';
import React, {FC, useState} from 'react';
import {
  View,
  StyleSheet,
  Image,
  Text,
  Pressable,
  ScrollView,
} from 'react-native';
import {useProgress} from 'react-native-track-player';
import {useDispatch, useSelector} from 'react-redux';
import {getPlayerState} from '../store/player';
import formatDuration from 'format-duration';
import Slider from '@react-native-community/slider';
import useAudioController from '../hooks/useAudioController';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import PlayerControler from '@ui/PlayerController';
import PlayPauseBtn from '@ui/PlayPauseBtn';
import Loader from '@ui/Loader';
import AudioInfoContainer from './AudioInfoContainer';

interface Props {
  visible: boolean;
  onRequestClose(): void;
}

const fromattedDuration = (duration = 0) => {
  return formatDuration(duration, {
    leading: true,
  });
};

const AudioPlayer: FC<Props> = ({visible, onRequestClose}) => {
  const [showAudioInfo, setShowAudioInfo] = useState(false);
  const {onGoingAudio} = useSelector(getPlayerState);
  const {
    isPalying,
    isBusy,
    onNextPress,
    onPreviousPress,
    seekTo,
    togglePlayPause,
  } = useAudioController();
  const poster = onGoingAudio?.poster;
  const source = poster ? {uri: poster} : require('../assets/music.png');

  const {duration, position} = useProgress();
  const dispatch = useDispatch();

  const handleOnNextPress = async () => {
    await onNextPress();
  };

  const handleOnPreviousPress = async () => {
    await onPreviousPress();
  };

  const updateSeek = async (value: number) => {
    await seekTo(value);
    if (!isPalying) {
      togglePlayPause();
    }
  };

  return (
    <AppModal animation visible={visible} onRequestClose={onRequestClose}>
      <View style={styles.container}>
        <Pressable
          onPress={() => setShowAudioInfo(true)}
          style={styles.infoBtn}>
          <AntDesign name="infocirlceo" color={colors.CONTRAST} size={24} />
        </Pressable>
        <AudioInfoContainer
          visible={showAudioInfo}
          closeHandler={setShowAudioInfo}
        />
        <Image source={source} style={styles.poster} />
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{onGoingAudio?.title}</Text>

          <AppLink title={onGoingAudio?.owner.name || ''} />

          <View style={styles.durationContainer}>
            <Text style={styles.duration}>
              {fromattedDuration(position * 1000)}
            </Text>
            <Text style={styles.duration}>
              {fromattedDuration(duration * 1000)}
            </Text>
          </View>

          <Slider
            minimumValue={0}
            maximumValue={duration}
            minimumTrackTintColor={colors.CONTRAST}
            maximumTrackTintColor={colors.INACTIVE_CONTRAST}
            value={position}
            onSlidingComplete={updateSeek}
          />

          <View style={styles.controles}>
            {/* Previous */}
            <PlayerControler onPress={handleOnPreviousPress} ignoreContainer>
              <AntDesign
                name="stepbackward"
                size={30}
                color={colors.CONTRAST}
              />
            </PlayerControler>

            {/* Play Pause */}
            <PlayerControler>
              {isBusy ? (
                <Loader color={colors.PRIMARY} />
              ) : (
                <PlayPauseBtn
                  playing={isPalying}
                  onPress={togglePlayPause}
                  color={colors.PRIMARY}
                />
              )}
            </PlayerControler>

            {/* Next */}
            <PlayerControler onPress={handleOnNextPress} ignoreContainer>
              <AntDesign name="stepforward" size={30} color={colors.CONTRAST} />
            </PlayerControler>
          </View>
          {/* Info */}
          {/* <View style={styles.containerSecond}>
            <ScrollView contentContainerStyle={{flexGrow: 1}}>
              <Text style={styles.title}>Info: </Text>
              <View>
                <Text style={styles.about}>{onGoingAudio?.about}</Text>
              </View>
            </ScrollView>
          </View> */}
        </View>
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    padding: 20,
  },
  containerSecond: {
    marginTop: 5,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  contentContainer: {
    width: '100%',
    flex: 1,
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.CONTRAST,
  },
  durationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  duration: {
    color: colors.CONTRAST,
  },
  controles: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginLeft: 80,
    marginRight: 80,
  },
  infoBtn: {
    position: 'absolute',
    right: 10,
    top: 10,
  },
  //Info
  about: {
    fontSize: 14,
    color: colors.CONTRAST,
    paddingVertical: 5,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default AudioPlayer;
