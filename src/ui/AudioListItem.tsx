import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Pressable, Image, Text} from 'react-native';
import {AudioData} from '../@types/audio';
import PlayAnimation from './PlayAnimation';

interface Props {
  audio: AudioData;
  onPress?(): void;
  isPlaying?: boolean;
}

const AudioListItem: FC<Props> = ({audio, isPlaying = false, onPress}) => {
  const getSource = (poster?: string) => {
    return poster ? {uri: poster} : require('../assets/music_small.png');
  };
  return (
    <Pressable onPress={onPress} style={styles.listItem}>
      <View>
        <Image source={getSource(audio.poster)} style={styles.poster} />
        <PlayAnimation visible={isPlaying} iconSize={40} />
      </View>
      <View style={styles.titleContainer}>
        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
          {audio.title}
        </Text>
        <Text style={styles.owner} numberOfLines={1} ellipsizeMode="tail">
          {audio.owner.name}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  //   listItem: {
  //     flexDirection: 'row',
  //     backgroundColor: colors.LIGHT_GREY,
  //     marginBottom: 15,
  //     borderRadius: 5,
  //   },
  listItem: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    marginBottom: 15,
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.15)',
    borderWidth: 1,
  },
  titleContainer: {
    flex: 1,
    padding: 5,
  },
  poster: {
    width: 50,
    height: 50,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: '700',
  },
  owner: {
    color: colors.SECONDARY,
    fontWeight: '700',
  },
});

export default AudioListItem;
