import AudioCard from '@ui/AudioCard';
import PulseAnimationContainer from '@ui/PulseAnimationContainer';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, ScrollView} from 'react-native';
import {useFetchLatestAudios} from '../hooks/query';
import GridView from '@ui/GridView';
import {AudioData} from 'src/@types/audio';
import {useSelector} from 'react-redux';
import {getPlayerState} from '../store/player';
import {useQueryClient} from 'react-query';
import {
  GestureHandlerRootView,
  RefreshControl,
} from 'react-native-gesture-handler';

interface Props {
  onAudioPress(item: AudioData, data: AudioData[]): void;
  onAudioLongPress(item: AudioData, data: AudioData[]): void;
}

const dummyData = new Array(4).fill('');

const LatestUploads: FC<Props> = ({onAudioLongPress, onAudioPress}) => {
  const {data = [], isLoading, isFetching} = useFetchLatestAudios();
  const {onGoingAudio} = useSelector(getPlayerState);
  const queryClient = useQueryClient();

  const handleOnRefresh = () => {
    queryClient.invalidateQueries({queryKey: ['latest-uploads']});
  };

  if (isLoading)
    return (
      <PulseAnimationContainer>
        <View>
          <View style={styles.dummyTitleView} />
          <GridView
            col={3}
            data={dummyData}
            renderItem={item => {
              return <View style={styles.dummyAudioView} />;
            }}
          />
        </View>
      </PulseAnimationContainer>
    );

  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.title}>Latest Uploads</Text>
  //       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
  //         {data?.map(item => {
  //           return (
  //             <AudioCard
  //               key={item.id}
  //               title={item.title}
  //               poster={item.poster}
  //               onPress={() => onAudioPress(item, data)}
  //               onLongPress={() => onAudioLongPress(item, data)}
  //             />
  //           );
  //         })}
  //       </ScrollView>
  //     </View>
  //   );

  return (
    <GestureHandlerRootView>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetching}
            onRefresh={handleOnRefresh}
            tintColor={colors.CONTRAST}
          />
        }>
        <View>
          <Text style={styles.title}>Latest Uploads</Text>
          <GridView
            col={3}
            data={data || []}
            renderItem={item => {
              return (
                <AudioCard
                  title={item.title}
                  poster={item.poster}
                  onPress={() => onAudioPress(item, data)}
                  onLongPress={() => onAudioLongPress(item, data)}
                  containerStyle={{width: '100%'}}
                  playing={onGoingAudio?.id === item.id}
                />
              );
            }}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  // container: {
  //   padding: 10,
  // },
  title: {
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  dummyTitleView: {
    height: 20,
    width: 150,
    backgroundColor: colors.INACTIVE_CONTRAST,
    marginBottom: 15,
    borderRadius: 5,
  },
  dummyAudioView: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.INACTIVE_CONTRAST,
    borderRadius: 5,
  },
  dummyAudioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  audioTitle: {
    color: colors.CONTRAST,
    fontWeight: '500',
    fontSize: 16,
    marginTop: 5,
  },
  poster: {width: '100%', aspectRatio: 1, borderRadius: 7},
});

export default LatestUploads;
