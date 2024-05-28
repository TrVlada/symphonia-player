import AudioListItem from '@ui/AudioListItem';
import EmptyRecords from '@ui/EmptyRecords';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler';
import {useQueryClient} from 'react-query';
import {useSelector} from 'react-redux';
import {useFetchFavorite} from '../../hooks/query';
import useAudioController from '../../hooks/useAudioController';
import {getPlayerState} from '../../store/player';
interface Props {}

const FavoriteTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {onAudioPress} = useAudioController();
  const {data, isLoading, isFetching} = useFetchFavorite();
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['favorite']});
  };

  // if (isLoading) return <AudioListLoadingUI />;

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
        {!data?.length ? (
          <EmptyRecords title="There is no favorite audio!" />
        ) : null}
        {data?.map(item => {
          return (
            <AudioListItem
              onPress={() => onAudioPress(item, data)}
              key={item.id}
              audio={item}
              isPlaying={onGoingAudio?.id === item.id}
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

export default FavoriteTab;
