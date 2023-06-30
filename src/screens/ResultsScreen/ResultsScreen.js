import {useNavigation, useRoute} from "@react-navigation/native";
import {observer} from "mobx-react-lite";
import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, ScrollView, Image, Switch} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ScreenWrapper} from "ui/components/ScreenWrapper/ScreenWrapper";
import {eventLogoImgUrl, thumbImgUrl} from "api/api";
import {
  configureAnimation,
  defaultPaddingX,
  defaultPaddingY,
  getStorageData,
  px, removeStoreData,
  screenWidth,
  storeData
} from "lib/features";
import {SCREEN_IMAGE, SCREEN_MAIN} from "lib/router";
import {$loader} from "store/loader";
import {$media} from "store/media";
import {$results} from "store/results";
import {Button} from "ui/components/Buttons/Button";
import {RoundedButton} from "ui/components/Buttons/RoundedButton";
import {FullLogo} from "ui/components/FullLogo/FullLogo";
import {Header} from "ui/components/Header/Header";
import {ImageWrapper} from "ui/components/ImageWrapper/ImageWrapper";
import {SpacingX} from "ui/components/Spacing/SpacingX";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {TouchableOpacity} from "ui/components/TouchableOpacity/TouchableOpacity";
import {Caption} from "ui/components/Typography/Caption";
import {Title} from "ui/components/Typography/Title";

import Gear from "assets/icons/Gear.svg";
import {Div} from "ui/components/Div/Div";
import {Subhead} from "ui/components/Typography/Subhead";
import Success from "../../assets/icons/Success.svg";
import Unsuccess from "../../assets/icons/Unsuccess.svg";
import {CheckoutSuccessModal} from "../../modals/checkoutSuccessModal";
import {EventModal} from "../../modals/EventModal";
import {$snackbar} from "../../store/snackbar";
import {$user} from "../../store/user";
import {Toggle} from "../../ui/components/Toggle/Toggle";


const ResultsScreen = observer(({fromImageScreen}) => {
  const modalEventRef = useRef(null);
  const checkoutSuccessModalRef = useRef(null);
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const route = useRoute();
  const routeProps = route.params || {};

  const [settingsVisibility, setSettingsVisibility] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const [notificationsSwitch, setNotificationsSwitch] = useState(false);
  const [notificationsSwitchDisabled, setNotificationsSwitchDisabled] = useState(false);

  useEffect(() => {
    if (routeProps.toOpenCheckoutSuccessModal) {
      openCheckoutSuccessModal();
    }
  }, [routeProps.toOpenCheckoutSuccessModal])

  const toggleNotifications = () => {
    // configureAnimation();

    setNotificationsSwitchDisabled(true);
    let newState = !notificationsSwitch; // предполагается, что notificationsSwitch - это текущее состояние

    $user.toggleNotifications(newState).then((response) => {
      setNotificationsSwitchDisabled(false);

      if (response) {
        setNotificationsSwitch(newState);
        if (newState) {
          storeData('notificationsSwitch', 'true').then()
        } else {
          removeStoreData('notificationsSwitch').then()
        }
        $snackbar.setActive(true, <><Success /><SpacingX size={9}/><Caption weight={2}>{newState ? 'Вы подписались на уведомления' : 'Вы отписались от уведомлений'}</Caption></>);
      } else {
        $snackbar.setActive(true, <><Unsuccess /><SpacingX size={9}/><Caption weight={2}>{newState ? 'Не удалось подписаться' : 'Не удалось отписаться'}</Caption></>);
      }
    }).catch(() => {
      setNotificationsSwitchDisabled(false);
      // обработка ошибок
    });
  }

  useEffect(() => {
    (async () => {
      const localNotificationsSwitch = await getStorageData('notificationsSwitch');
      setNotificationsSwitch(!!localNotificationsSwitch);
    })()
  }, [])


  const openModalEvent = (event) => {
    setSelectedEvent(event);
    modalEventRef.current?.snapToIndex(0);
  }
  const openCheckoutSuccessModal = () => {
    checkoutSuccessModalRef.current?.snapToIndex(0);
  }

  useEffect(() => {
    if (fromImageScreen) {
      $loader.setLoader(false);
    }
  }, [fromImageScreen]);

  const showAllPhotos = () => {
    $results.setImages($results.allImages);
    $results.setModalIndex(0);
  }

  const retakePicture = () => {
    $media.setImagePath('');
    $results.setModalIndex(-1);
    $results.setAllImages(null);
    $results.setImages(null);
    navigation.navigate(SCREEN_MAIN)
  }

  const showImageFullSize = (id) => {
    setTimeout(() => {
      $results.setFullSize(id);
      navigation.navigate(SCREEN_IMAGE);
    }, 1);
  }

  const toggleSettings = () => {
    configureAnimation();
    setSettingsVisibility((prevState) => {
      return !prevState;
    });
  }

  return (
    <ScreenWrapper
      style={styles.container}
      withHorizontalPadding={false}
      withPaddingTop={false}
      modals={
        <>
          <EventModal modalRef={modalEventRef} event={selectedEvent} />
          <CheckoutSuccessModal modalRef={checkoutSuccessModalRef} />
        </>
      }
    >
      <ScrollView
        stickyFooterIndices={[1]}
      >
        <SpacingY size={insets.top + defaultPaddingY} />
        <Header
          style={{zIndex: 1}}
          onLayout={e => setHeaderHeight(e.nativeEvent.layout.height)}
          title={
            <FullLogo />
          }
          after={
            <View>
              <RoundedButton
                onPress={toggleSettings}
                background={'transparent'}
              >
                <Gear />
              </RoundedButton>
              {settingsVisibility && (
                <View style={[
                  styles.settingsPopup,
                  {top: headerHeight + defaultPaddingY / 2}
                ]}>
                  <View
                    style={{
                      padding: defaultPaddingX / 2
                    }}
                  >
                    <Title level={3}>Настройки</Title>
                    <SpacingY size={defaultPaddingY / 2} />
                    <View style={styles.settingsOption}>
                      <Subhead>Уведомлять о новых фото</Subhead>
                      <SpacingX size={defaultPaddingX} />
                      <Toggle value={notificationsSwitch} onPress={toggleNotifications} disabled={notificationsSwitchDisabled} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          }
          withHorizontalPadding
        />
        <SpacingY size={defaultPaddingY * 2} />
        {!$loader.isToggled && (
          <>
            <Div style={{alignItems: $results.allImages ? 'flex-start' : 'center'}}>
              <Title level={2}>
                {$results.allImages ? 'Все найденные фото' : 'Ничего не найдено'}
              </Title>
            </Div>
            <SpacingY size={defaultPaddingY} />
            {$results.allImages && (
              <>
                <ScrollView
                  style={styles.row}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                >
                  <SpacingX size={defaultPaddingX - 5} />
                  {$results.allImages.map((image, i) => {
                    if (i < 5) {
                      return (
                        <TouchableOpacity
                          key={image.id}
                          style={styles.imageWrapper}
                          onPress={() => {showImageFullSize(image.id)}}
                        >
                          <ImageWrapper
                            cover
                            style={[
                              styles.image,
                              {height: 200}
                            ]}
                            uri={thumbImgUrl(image.uuid)}
                          />
                          <SpacingY size={10} />
                          <Caption
                            style={styles.description}
                            numberOfLines={1}
                            ellipsizeMode='tail'
                            level={3}
                            weight={2}
                          >
                            {image.author}
                          </Caption>
                        </TouchableOpacity>
                      );
                    } else {
                      return null;
                    }
                  })}
                  <SpacingX size={defaultPaddingX - px(5)} />
                </ScrollView>
                <SpacingY size={defaultPaddingY} />
                <Div style={{
                  flexDirection: 'row',
                  justifyContent: 'center'
                }}>
                  <Button
                    style={{borderRadius: 50}}
                    onPress={showAllPhotos}
                    stretched
                  >
                    <Caption
                      ellipsizeMode='tail'
                      color={'light'}
                      level={3}
                      weight={2}
                    >
                      Смотреть все ({$results.allImages.length})
                    </Caption>
                  </Button>
                </Div>

                <SpacingY size={defaultPaddingY * 2} />
                {$results.events && (
                  <Div>
                    <Title level={2}>
                      Найденные фото с мероприятий
                    </Title>
                    <SpacingY size={defaultPaddingY} />
                    {$results.events.map((event) => {
                      return (
                        <TouchableOpacity
                          key={event.id}
                          style={{marginBottom: px(11)}}
                          onPress={() => openModalEvent(event)}
                        >
                          <View style={styles.eventWithoutThumbWrapper}>
                            <SpacingX size={12} />
                            <View style={styles.eventData}>
                              <Subhead level={3} weight={2}>
                                {event.nameRu}
                              </Subhead>
                              <SpacingY size={12} />
                              <Subhead weight={2}>
                                {`${event.photoTotal} фото`}
                              </Subhead>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </Div>
                )}
                <SpacingY size={defaultPaddingY} />
              </>
            )}
            <SpacingY size={insets.bottom + defaultPaddingY + px(72)} />
          </>
        )}
      </ScrollView>
      <View style={{position: 'absolute', bottom: 0, alignSelf: 'center', marginBottom: insets.bottom + defaultPaddingY}}>
        <TouchableOpacity onPress={retakePicture}>
          <Image
            style={styles.reshot}
            source={require('assets/images/ReShot.png')}
          />
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'flex-start'
  },
  row: {
    flexDirection: 'row',
  },
  imageWrapper: {
    marginHorizontal: px(5),
  },
  image: {
    borderRadius: px(16),
    width: px(327),
    height: px(202),
  },
  description: {
    width: px(327),
  },
  reshot: {
    width: px(72),
    height: px(72),
    alignSelf: 'center'
  },
  eventWithoutThumbWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F6',
    paddingVertical: px(16),
    paddingHorizontal: px(24),
    borderRadius: px(24)
  },
  eventLogo: {
    width: px(56),
    aspectRatio: 1,
    resizeMode: 'contain',
  },
  eventData: {
    justifyContent: 'space-between'
  },
  settingsPopup: {
    position: 'absolute',
    right: 0,
    width: px(290),
    backgroundColor: '#fff',
    borderRadius: px(16),
    shadowColor: "#000",
    shadowOffset: {
      width: -5,
      height: 15,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 3,
  },
  settingsOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});

export {ResultsScreen};