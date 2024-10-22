import AppHeader from '@components/AppHeader';
import AvatarField from '@ui/AvatarField';
import colors from '@utils/colors';
import {FC} from 'react';
import {View, StyleSheet, Text, Pressable, TextInput} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AppButton from '@ui/AppButton';
import {useDispatch} from 'react-redux';
import {
  updateBusyState,
  updateLoggedInState,
  updateProfile,
} from '../../store/auth';
import {getClient} from '../../api/client';
import {Keys, removeFromAsyncStorage} from '@utils/asyncStorage';
import catchAsyncError from '../../api/catchError';
import {upldateNotification} from '../../store/notification';

interface Props {}

const ProfileSettings: FC<Props> = props => {
  const dispatch = useDispatch();
  const handleLogout = async (fromAll?: boolean) => {
    dispatch(updateBusyState(true));
    try {
      const endpoint = '/auth/log-out?fromAll=' + (fromAll ? 'yes' : '');
      const client = await getClient();
      await client.post(endpoint);
      await removeFromAsyncStorage(Keys.AUTH_TOKEN);
      dispatch(updateProfile(null));
      dispatch(updateLoggedInState(false));
    } catch (error) {
      const errorMessage = catchAsyncError(error);
      dispatch(upldateNotification({message: errorMessage, type: 'error'}));
    }
    dispatch(updateBusyState(false));
  };
  return (
    <View style={styles.container}>
      <AppHeader title="Settings" />

      {/* <View style={styles.titleContainer}>
        <Text style={styles.title}>Profile Settings</Text>
      </View> */}

      {/* <View style={styles.settingOptionsContainer}>
        <View style={styles.avatarContainer}>
          <AvatarField />
          <Pressable style={styles.paddingLeft}>
            <Text style={styles.linkText}>Update Profile Image</Text>
          </Pressable>
        </View>
        <View style={styles.emailConainer}>
          <Text style={styles.email}>john@email.com</Text>
          <MaterialIcon name="verified" size={15} color={colors.SECONDARY} />
        </View>
        <TextInput style={styles.nameInput} value={'John'} />
      </View> */}

      {/* <View style={styles.marginTop}>
        <AppButton title="Update" borderRadius={100} />
      </View> */}

      <View style={styles.titleContainer}>
        <Text style={styles.title}>Logout</Text>
      </View>

      <View style={styles.settingOptionsContainer}>
        {/* <Pressable onPress={() => handleLogout(true)} style={styles.logoutBtn}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.logoutBtnTitle}>Logout From All</Text>
        </Pressable> */}
        <Pressable onPress={() => handleLogout()} style={styles.logoutBtn}>
          <AntDesign name="logout" size={20} color={colors.CONTRAST} />
          <Text style={styles.logoutBtnTitle}>Logout From Account</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  titleContainer: {
    borderBottomWidth: 0.5,
    borderBottomColor: colors.SECONDARY,
    paddingBottom: 5,
    marginTop: 15,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 23,
    color: colors.SECONDARY,
  },
  settingOptionsContainer: {
    marginTop: 15,
    paddingLeft: 15,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    color: colors.SECONDARY,
    fontStyle: 'italic',
  },
  paddingLeft: {
    paddingLeft: 15,
  },
  nameInput: {
    color: colors.CONTRAST,
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    borderWidth: 0.5,
    borderColor: colors.CONTRAST,
    borderRadius: 7,
    marginTop: 15,
  },
  emailConainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  email: {
    color: colors.CONTRAST,
    marginRight: 10,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  logoutBtnTitle: {
    color: colors.CONTRAST,
    fontSize: 18,
    marginLeft: 5,
  },
  marginTop: {
    marginTop: 15,
  },
});

export default ProfileSettings;
