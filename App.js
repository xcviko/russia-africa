import React, {useEffect} from 'react';
import {SafeAreaProvider} from "react-native-safe-area-context";
import {SCREEN_CHECKOUT, SCREEN_IMAGE, SCREEN_MAIN, SCREEN_RESULTS, SCREEN_SPLASH, SCREEN_TEST} from "./src/lib/router";
import {NavigationContainer} from "@react-navigation/native";
import {createNativeStackNavigator} from "@react-navigation/native-stack";
import {CheckoutScreen} from "./src/screens/CheckoutScreen/CheckoutScreen";
import {ResultsScreen} from "./src/screens/ResultsScreen/ResultsScreen";
import {TestScreen} from "./src/screens/TestScreen";
import {SplashScreen} from "./src/screens/SplashScreen/SplashScreen";
import {MainScreen} from "./src/screens/MainScreen/MainScreen";
import {LogBox, Platform} from 'react-native';
import {ImageScreen} from "./src/screens/ImageScreen/ImageScreen";
import {gestureHandlerRootHOC} from "react-native-gesture-handler";
import {$loader} from "./src/store/loader";
import {observer} from "mobx-react-lite";
import * as NavigationBar from 'expo-navigation-bar';
import {startUpdateFlow} from "@gurukumparan/react-native-android-inapp-updates";

import * as Notifications from 'expo-notifications';
import Constants from "expo-constants";
import {$user} from "./src/store/user";

// ViewPropTypes используется в какой-то библиотеке. Можно игнорировать, пока React Native не будет обновлен.
LogBox.ignoreLogs(['ViewPropTypes will be removed from React Native, along with all other PropTypes. We recommend that you migrate away from PropTypes and switch to a type system like TypeScript. If you need to continue using ViewPropTypes, migrate to the \'deprecated-react-native-prop-types\' package.']);

// temp
LogBox.ignoreLogs(['[Reanimated] Mismatch between JavaScript part and native part of Reanimated (2.16.0 vs. 2.14.4). Did you forget to re-build the app after upgrading react-native-reanimated? If you use Expo Go, you must downgrade to 2.14.4 which is bundled into Expo SDK.']);
LogBox.ignoreLogs(['Cannot update a component (`observerComponent`) while rendering a different component (`observerComponent`). To locate the bad setState() call inside `observerComponent`, follow the stack trace as described in https://reactjs.org/link/setstate-in-render']);
LogBox.ignoreLogs(['`setBackgroundColorAsync` is only available on Android']);
LogBox.ignoreLogs(['Did not receive response to shouldStartLoad in time, defaulting to YES']);

const App = observer(() => {
  const Stack = createNativeStackNavigator();

  NavigationBar.setBackgroundColorAsync('#000').then(r => console.log(r))

  useEffect(() => {
    $loader.setLoader(true, true);

    // Start the update flow
    (async () => {
      try {
        const result = await startUpdateFlow('immediate');
        console.log('update result:', result);
      } catch (e) {
        console.log('update error:', e);
      }
    })();
  }, [])

  useEffect(() => {
    $loader.setLoader(true, true);

    registerForPushNotificationsAsync().then((token) => {
      $user.setToken(token)
    });
  }, []);

  useEffect(() => {
    console.log('$user.token:', $user.token);
  }, [$user.token])

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });

  async function registerForPushNotificationsAsync() {
    let token;
    if (Constants.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return token;
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={SCREEN_SPLASH}
          // initialRouteName={SCREEN_TEST}
          screenOptions={{headerShown: false}}
        >
          {/*debug*/}
          <Stack.Screen name={SCREEN_TEST} component={TestScreen} />

          {/*main flow*/}
          <Stack.Screen name={SCREEN_SPLASH} component={SplashScreen} />
          <Stack.Screen name={SCREEN_MAIN} component={MainScreen} />
          <Stack.Screen name={SCREEN_RESULTS} component={ResultsScreen} />
          <Stack.Screen name={SCREEN_IMAGE} component={ImageScreen} />
          <Stack.Screen name={SCREEN_CHECKOUT} component={CheckoutScreen} />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
});

export default gestureHandlerRootHOC(App);
