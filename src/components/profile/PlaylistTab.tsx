import PlaylistItem from '@ui/PlaylistItem';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useFetchPlaylist} from '../../hooks/query';
import EmptyRecords from '@ui/EmptyRecords';
import {useDispatch} from 'react-redux';
import {
  updatePlaylistVisbility,
  updateSelectedListId,
} from '../../store/playlistModal';
import {Playlist} from '../../@types/audio';
import {useQueryClient} from 'react-query';
import {
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler';
import colors from '@utils/colors';

interface Props {}

const PlaylistTab: FC<Props> = props => {
  const {data, isLoading, isFetching} = useFetchPlaylist();
  const queryClient = useQueryClient();

  const dispatch = useDispatch();
  const handleOnListPress = (playlist: Playlist) => {
    dispatch(updateSelectedListId(playlist.id));
    dispatch(updatePlaylistVisbility(true));
  };

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['playlist']});
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleOnRefresh}
            tintColor={colors.CONTRAST}
          />
        }
        style={styles.container}>
        {!data?.length ? <EmptyRecords title="There is no playlist!" /> : null}
        {data?.map(playlist => {
          return (
            <PlaylistItem
              onPress={() => handleOnListPress(playlist)}
              key={playlist.id}
              playlist={playlist}
            />
          );
        })}
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export default PlaylistTab;
