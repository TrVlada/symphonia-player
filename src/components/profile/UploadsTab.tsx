import colors from '@utils/colors';
import React, {FC} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import {useFetchUploadsByProfile} from '../../hooks/query';
import EmptyRecords from '@ui/EmptyRecords';
import AudioListItem from '@ui/AudioListItem';
import useAudioController from '../../hooks/useAudioController';
import {useSelector} from 'react-redux';
import {getPlayerState} from '../../store/player';
import {
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler';
import {useQueryClient} from 'react-query';

interface Props {}

const UploadsTab: FC<Props> = props => {
  const {onGoingAudio} = useSelector(getPlayerState);
  const {data, isLoading, isFetching} = useFetchUploadsByProfile();
  const {onAudioPress} = useAudioController();
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['uploads-by-profile']});
  };

  // if (isLoading) return <AudioListLoadingUI />;

  // if (!data?.length) return <EmptyRecords title="There is no audio!" />;

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
        {!data?.length ? <EmptyRecords title="There is no audio!" /> : null}
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

export default UploadsTab;
