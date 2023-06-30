import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated, BackHandler, Image} from 'react-native';
import {ScreenWrapper} from "ui/components/ScreenWrapper/ScreenWrapper";
import {Title} from "ui/components/Typography/Title";
import {RoundedButton} from "ui/components/Buttons/RoundedButton";
import {Camera} from "expo-camera";
import {Button} from "ui/components/Buttons/Button";
import {Subhead} from "ui/components/Typography/Subhead";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {defaultPaddingX, defaultPaddingY, px, screenWidth} from "lib/features";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {$media} from "store/media";
import {observer} from "mobx-react-lite";
import {Caption} from "ui/components/Typography/Caption";
import {Div} from "ui/components/Div/Div";
import {$results} from "store/results";
import {$loader} from "store/loader";
import {ImageWrapper} from "ui/components/ImageWrapper/ImageWrapper";
import {SCREEN_MAIN, SCREEN_RESULTS, SCREEN_SPLASH} from "lib/router";
import {useNavigation} from "@react-navigation/native";
import {Header} from "ui/components/Header/Header";
import {CameraCorners} from "ui/components/CameraCorners/CameraCorners";
import {CartModal} from "modals/CartModal";

import RectangularTip from 'assets/icons/RectangularTip.svg';
import {FullLogo} from "ui/components/FullLogo/FullLogo";
import {TouchableOpacity} from "ui/components/TouchableOpacity/TouchableOpacity";
import {albumImgUrl} from "../../api/api";

const MainScreen = observer(({fromImageScreen}) => {
  const modalCartRef = useRef(null);
  const cameraRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [cameraHeight, setCameraHeight] = useState(0);
  const [cameraWidth, setCameraWidth] = useState(0);
  const [hasPermission, setHasPermission] = useState(null);
  const [type] = useState(Camera.Constants.Type.front);
  const [flashMode] = useState(Camera.Constants.FlashMode.off);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      toBack,
    );

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    $loader.setLoader(true, true);
    setTimeout(() => $loader.setLoader(false), 1000);

    requestCameraPermission();

    setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start(() => {
        setTimeout(() => {
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }).start();
        }, 10000);
      });
    }, 3000)
  }, []);

  useEffect(() => {
    if (fromImageScreen) {
      $loader.setLoader(false);
    }
  }, [fromImageScreen]);


  const requestCameraPermission = async () => {
    setHasPermission(null);
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  const toBack = () => {
    navigation.navigate(SCREEN_SPLASH);
    retakePicture();
    $results.setModalIndex(-1);
    return true;
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      const {uri} = await cameraRef.current?.takePictureAsync();
      $media.setImagePath(uri);
      // $media.setImagePath('https://i.imgur.com/YWRTrGo.jpg');

      $loader.setLoader(true, true, 'Идет поиск...');
      await $results.searchImages();
      navigation.navigate(SCREEN_RESULTS);
    }
  };

  const retakePicture = () => {
    $media.setImagePath('');
    $results.setModalIndex(-1);
  }

  return (
    <ScreenWrapper
      style={styles.container}
      withHorizontalPadding={false}
      withPaddingTop={false}
    >
      {hasPermission ? (
        <>
          {$loader.setLoader(false)}
          <Header
            style={[
              {
                marginTop: insets.top + defaultPaddingY,
                marginBottom: defaultPaddingY,
              },
              $media.imagePath && {opacity: 0, pointerEvents: 'none'}
            ]}
            title={
              <TouchableOpacity onPress={toBack}>
                <FullLogo color={'light'} />
              </TouchableOpacity>
            }
            withHorizontalPadding
          />
          <View style={styles.mediaWrapper}>
            {$media.imagePath ? (
              <ImageWrapper withLoader={false} style={styles.mediaCaptured} uri={$media.imagePath} />
            ) : (
              <>
                <Camera
                  onLayout={(e) => {
                      setCameraHeight(e.nativeEvent.layout.height);
                      setCameraWidth(e.nativeEvent.layout.width);
                  }}
                  ref={cameraRef}
                  style={styles.media}
                  type={type}
                  flashMode={flashMode}
                />
                <View style={{
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <CameraCorners cameraWidth={cameraWidth} cameraHeight={cameraHeight} />
                  <Animated.View style={{
                    height: px(55),
                    alignItems: 'center',
                    marginBottom: px(22),
                    opacity: fadeAnim,
                    position: 'absolute',
                    bottom: px(-8)
                  }}>
                    <RectangularTip style={{ position: 'absolute'}} />
                    <View style={{height: px(40), justifyContent: 'center'}}>
                      <Caption level={2} color={'light'}>Нажмите, чтобы продолжить</Caption>
                    </View>
                  </Animated.View>
                </View>
              </>
            )}
          </View>
          <View style={[
            styles.buttonsContainer,
            {paddingBottom: insets.bottom + defaultPaddingY},
            $media.imagePath && {opacity: 0, pointerEvents: 'none'}
          ]}>
            <Div>
              <View style={[
                styles.buttons
              ]}>
                <RoundedButton
                  size={'l'}
                  background={'transparent'}
                  onPress={takePicture}
                >
                  <Image
                    style={{
                      width: px(72),
                      height: px(72)
                    }}
                    source={require('assets/images/ReShot.png')}
                  />
                </RoundedButton>
              </View>

            </Div>
          </View>
        </>
      ) : (
          <View style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: defaultPaddingX
          }}>
            {hasPermission === null ? (
              <>{$loader.setLoader(true, true)}</>
            ) : (
              <>
                {$loader.setLoader(false)}
                <Title color={'light'}>Нет доступа к камере</Title>
                <SpacingY size={10}/>
                <Subhead
                  style={{textAlign: 'center'}}
                  color={'light'}
                >
                  Нажмите на кнопку ниже или разрешите через настройки приложения
                </Subhead>
                <SpacingY size={25}/>
                <Button background={'light'} size={'s'} onPress={requestCameraPermission}>
                  <Subhead weight={2}>Запросить ещё раз</Subhead>
                </Button>
              </>
            )}
        </View>
      )}
    </ScreenWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#010101',
    /*flex: 1,
    justifyContent: 'center',
    alignItems: 'center'*/
  },
  mediaWrapper: {
    flex: 1,
    alignItems: 'center',
    // borderBottomLeftRadius: px(24),
    // borderBottomRightRadius: px(24),
    borderRadius: px(24),
    overflow: 'hidden'
  },
  media: {
    width: '100%',
    height: '100%',
    aspectRatio: 3 / 4, // соотношение сторон изображения
  },
  mediaCaptured: {
    width: '100%',
    height: '100%',
    aspectRatio: 3 / 4, // соотношение сторон изображения
    transform: [{rotateY: '180deg'}]
  },
  buttonsContainer: {
    paddingTop: px(16),
    backgroundColor: '#010101',
    alignItems: 'center',
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%'
  }
});

export {MainScreen};
