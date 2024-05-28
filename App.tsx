import {NavigationContainer} from '@react-navigation/native';
import LostPassword from '@views/auth/LostPassword';
import SignIn from '@views/auth/SignIn';
import Verification from '@views/auth/Verification';
import AuthNavigator from './src/navigation/AuthNavigator.tsx';
import {Provider} from 'react-redux';
import store from './src/store';
import AppNavigator from './src/navigation/index.tsx';
import AppCotnainer from '@components/AppContainer.tsx';
import {Query, QueryClient, QueryClientProvider} from 'react-query';

const queryClient = new QueryClient();
const App = () => {
  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <AppCotnainer>
          <AppNavigator />
        </AppCotnainer>
      </QueryClientProvider>
    </Provider>
  );
};

export default App;
