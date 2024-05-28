import AppModal from '@ui/AppModal';
import {FC} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPlaylistModalState,
  updatePlaylistVisbility,
} from '../store/playlistModal';
import {useFetchPlaylistAudios} from '../hooks/query';
import AudioListItem from '@ui/AudioListItem';
import {FlatList} from 'react-native-gesture-handler';
import colors from '@utils/colors';
import useAudioController from '../hooks/useAudioController';
import {getPlayerState} from '../store/player';

interface Props {}

const PlaylistAudioModal: FC<Props> = props => {
  const {visible, selectedListId} = useSelector(getPlaylistModalState);
  const dispatch = useDispatch();
  const {data, isLoading} = useFetchPlaylistAudios(selectedListId || '');
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const handleClose = () => {
    dispatch(updatePlaylistVisbility(false));
  };

  return (
    <AppModal visible={visible} onRequestClose={handleClose}>
      <Text style={styles.title}>{data?.title}</Text>
      <FlatList
        contentContainerStyle={styles.container}
        data={data?.audios}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <AudioListItem
              onPress={() => onAudioPress(item, data?.audios || [])}
              isPlaying={onGoingAudio?.id === item.id}
              audio={item}
            />
          );
        }}
      />
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  title: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
  },
});
export default PlaylistAudioModal;
