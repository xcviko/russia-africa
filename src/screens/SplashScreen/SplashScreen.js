import {useNavigation} from "@react-navigation/native";
import {observer} from "mobx-react-lite";
import React, {useEffect, useRef, useState} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {ScreenWrapper} from "ui/components/ScreenWrapper/ScreenWrapper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {defaultPaddingX, defaultPaddingY, getStorageData, px, storeData} from "lib/features";
import {$splash} from "store/splash";
import {$loader} from "store/loader";
import {SplashBackground} from "ui/components/SplashBackground/SplashBackground";
import {CarouselWrapper} from "ui/components/CarouselWrapper/CarouselWrapper";
import Info from "assets/icons/Info.svg";
import {SCREEN_MAIN} from "lib/router";
import {$user} from "store/user";
import {SpacingX} from "ui/components/Spacing/SpacingX";
import {Button} from "ui/components/Buttons/Button";
import {TermsOfUseModal} from "modals/TermsOfUseModal";
import {FullLogo} from "ui/components/FullLogo/FullLogo";
import {SplashStartAnimation} from "../../ui/components/SplashStartAnimation/SplashStartAnimation";

const SplashScreen = observer(({}) => {
  const [isTermsAccepted, setTermsAccepted] = useState(null);
  const termsRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isTermsAccepted) {
      (async () => {
        const termsValue = await getStorageData('isTermsAccepted');
        console.log('termsValue:', termsValue);
        setTermsAccepted(termsValue);
      })()
    }
  }, [])

  useEffect(() => {
    $loader.setLoader(false);
  }, [$splash.isSplashShown])

  const openTermsModal = () => {
    console.log('terms on')
    termsRef.current?.snapToIndex(0)
  }
  const closeTermsModal = () => {
    setShowButton(false);
    termsRef.current?.close();
  }

  const confirmTerms = () => {
    $user.setTermsOfUseAccepted()
    closeTermsModal();
    storeData('isTermsAccepted', 'true').then();
    $loader.setLoader(true, true);
    setTimeout(() => navigation.navigate(SCREEN_MAIN));
  };

  return (
    <ScreenWrapper
      style={styles.container}
      withHorizontalPadding={false}
      withPaddingTop={false}
      withModals={false}
      modals={<></>}
    >
      <View style={styles.backgroundContainer}>
        <SplashBackground style={styles.background} />
        <View style={styles.splashOverlayWrapper}>
          <Image
            style={styles.background}
            source={require('assets/images/SplashOverlay.png')}
          />
        </View>
      </View>
      <View
        style={[
          styles.content,
          {
            paddingTop: insets.top + defaultPaddingY,
            paddingBottom: insets.bottom + defaultPaddingY
          }
        ]}
      >
        <View style={styles.logoWrapper}>
          <FullLogo color={'light'} />
          <Button
              background={'red'}
              onPress={openTermsModal}
          ><><Info /><SpacingX size={10} /></></Button>

        </View>
        <CarouselWrapper openTermsModal={() => {
          if (!isTermsAccepted) {
            setShowButton(true);
            openTermsModal();
          } else {
            navigation.navigate(SCREEN_MAIN);
          }
        }}/>
      </View>
      <TermsOfUseModal modalRef={termsRef} onConfirm={confirmTerms} onClose={closeTermsModal} showButton={!$user.termsOfUseAccepted && showButton} />
      <SplashStartAnimation />
    </ScreenWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#212122'
  },
  backgroundContainer: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0
  },
  splashOverlayWrapper: {
    flex: 1,
    justifyContent: 'flex-end'
  },
  background: {
    width: '100%',
    height: '65%',
    resizeMode: 'cover',
    position: 'absolute'
  },

  logoWrapper: {
    paddingHorizontal: defaultPaddingX,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  logo: {
    width: px(152),
    height: px(39),
  },
  content: {
    flex: 1
  },
});

export {SplashScreen};
