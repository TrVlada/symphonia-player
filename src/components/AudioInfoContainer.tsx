import AppLink from '@ui/AppLink';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Pressable} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useSelector} from 'react-redux';
import {getPlayerState} from '../store/player';

interface Props {
  visible: boolean;
  closeHandler(state: boolean): void;
}

const AudioInfoContainer: FC<Props> = ({visible, closeHandler}) => {
  const {onGoingAudio} = useSelector(getPlayerState);
  if (!visible) return null;

  const handleClose = () => {
    closeHandler(!visible);
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.closeBtn} onPress={handleClose}>
        <AntDesign name="close" color={colors.CONTRAST} size={24} />
      </Pressable>
      <ScrollView>
        <View>
          <View style={styles.titleContainer}>
            <Text style={styles.titleContainer}>{onGoingAudio?.title}</Text>
          </View>
          <View style={styles.ownerInfo}>
            <Text style={styles.title}>Category: </Text>
            <Text style={styles.info}>{onGoingAudio?.category}</Text>
          </View>
          <View style={styles.ownerInfo}>
            <Text style={styles.title}>Creator: </Text>
            <Text style={styles.info}>{onGoingAudio?.owner.name || ''}</Text>
          </View>
          <View style={styles.descContainer}></View>
          <View style={styles.titleContainer}>
            <Text style={styles.description}>DESCRIPTION</Text>
            <Text style={styles.about}>{onGoingAudio?.about}</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.PRIMARY,
    zIndex: 1,
    padding: 10,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 45,
    height: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 17,
    color: colors.CONTRAST,
    // fontWeight: 'bold',
    paddingVertical: 5,
  },
  about: {
    fontSize: 15,
    color: colors.CONTRAST,
    paddingVertical: 5,
  },
  ownerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    alignItems: 'center', // Центрирование по горизонтали
    marginVertical: 5, // Вертикальные отступы
    color: colors.CONTRAST,
    fontSize: 20,
    fontWeight: 'bold',
  },
  info: {
    color: colors.SECONDARY,
    fontWeight: 'bold',
  },
  descContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    // marginTop: 15,
  },
  description: {
    fontSize: 15,
    color: '#666666',
    fontWeight: 'bold',
    paddingVertical: 5,
  },
});

export default AudioInfoContainer;
