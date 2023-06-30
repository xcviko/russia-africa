import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, BackHandler} from 'react-native';
import {ScreenWrapper} from "ui/components/ScreenWrapper/ScreenWrapper";
import {Title} from "ui/components/Typography/Title";
import {Header} from "ui/components/Header/Header";
import {RoundedButton} from "ui/components/Buttons/RoundedButton";
import {useNavigation} from "@react-navigation/native";
import {SCREEN_MAIN, SCREEN_RESULTS} from "lib/router";
import {Button} from "ui/components/Buttons/Button";
import {Subhead} from "ui/components/Typography/Subhead";
import {
  configureAnimation,
  contentMaxWidth,
  defaultPaddingX,
  defaultPaddingY,
  px,
  screenWidth
} from "lib/features";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {$media} from "store/media";
import {observer} from "mobx-react-lite";
import {$results} from "store/results";
import {compressedImgUrl, fullImgUrl} from "api/api";
import ImageViewer from 'react-native-image-zoom-viewer';
import {Loader} from "ui/components/Loader/Loader";
import {ImageInfoModal} from "modals/ImageInfoModal";
import {$promocode} from "store/promocode";

import ChevronLeft from 'assets/icons/ChevronLeft.svg';
import Info from 'assets/icons/Info.svg';
import {$cart} from "store/cart";
import {SpacingX} from "../../ui/components/Spacing/SpacingX";
import {Caption} from "../../ui/components/Typography/Caption";


const ImageScreen = observer(({}) => {
  const modalInfoRef = useRef(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const openModal = () => modalInfoRef.current?.snapToIndex(0);
  const closeModal = () => modalInfoRef.current?.close();

  let images = [];
  $results.allImages?.forEach((r)=>{
    images.push({
      id:r.id,
      url: compressedImgUrl(r.uuid, true),
      author: r.author,
      authorInn: r.authorInn,
      authorOrg: r.authorOrg,
      price: r.price,
      discountPrice: $promocode.isApplied && $promocode.getPriceWithDiscount(r.price),
      freeHeight: true});
  });
  let currentIndex = $results.getFullSizeImageIndex;
  let currentItem = $results.fullSizeImage;

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      toBack,
    );

    return () => backHandler.remove();
  }, []);

  const toBack = () => {
    setTimeout(() => {
      if ($results.fullSizeImage.isPicked) {
        $results.togglePicked($results.fullSizeImage.id);
      }
      navigation.navigate(SCREEN_RESULTS, {fromImageScreen: true})
    })
    return true;
  }

  const toCheckout = (index) => {
    configureAnimation();
    $cart.setOpened(true);
    $results.setFullSize(images[index].id);
    if (!$results.fullSizeImage.isPicked) {
      $results.togglePicked($results.fullSizeImage.id, true);
    }
  }

  const downloadImage = (index) => {
    $media.downloadFilesAndSaveToGallery([images[index].url])
  }

  const loader = () => {
    return (
        <View style={styles.loaderWrapper}>
          <Loader style={styles.loader} />
        </View>
    )
  }

  const header = (index) => {
    return (
        <>
          <Header
            style={{
              position: 'absolute',
              left: 0,
              top: insets.top + defaultPaddingY,
              width: '100%',
              zIndex: 2,
            }}
            before={
              <RoundedButton
                background={'transparent'}
                onPress={toBack}
              >
                <ChevronLeft style={styles.shadow} />
              </RoundedButton>
            }
            title={
              <Subhead key={currentIndex} withShadow color={'light'}>
                {`Артикул: ${images[index].id}`}
              </Subhead>
            }
            after={
              <RoundedButton
                background={'transparent'}
                onPress={openModal}
              >
                <Info style={styles.shadow}/>
              </RoundedButton>
            }
            withHorizontalPadding
          />
        </>
    )
  }

  const footer = (index) => {
    return (
        <View style={{
          alignItems: 'center',
          width: screenWidth,
        }}>
          <View style={[
            styles.bottomSheet,
            {paddingBottom: insets.bottom + defaultPaddingY}
          ]}>
            <Button
              onPress={() => Number(images[index].price) ? toCheckout(index) : downloadImage(index)}
              childrenStyle={[{
                flexDirection: 'row',
                width: '100%',
                alignItems: 'center',
                justifyContent: ($promocode.isApplied && !!Number(images[index].price)) ? 'space-between' : 'center'
              }]}
              style={{justifyContent: 'normal'}}
            >
              {!Number(images[index].price) ? (
                <Title color={'light'} level={4} weight={2}>Скачать бесплатно</Title>
              ) : (
                $promocode.isApplied ? (
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Title color={'light'} level={4} weight={2}>
                      {`Купить за ${$promocode.getPriceWithDiscount(images[index].price)} ₽ `}
                    </Title>
                    <Title style={{color: '#D4E2E8', textDecorationLine: 'line-through'}} level={5} weight={2}>
                      {`${images[index].price} ₽`}
                    </Title>
                  </View>
                ) : (
                  <Title color={'light'} level={4} weight={2}>
                    {`Купить за ${images[index].price} ₽`}
                  </Title>
                )
              )}

              {($promocode.isApplied && !!Number(images[index].price)) && (
                <View style={{
                  paddingHorizontal: px(8),
                  paddingVertical: px(12),
                  borderRadius: px(8),
                  backgroundColor: '#3A6F71'
                }}>
                  <Caption color={'light'} level={1} weight={2}>Скидка {$promocode.getDiscountValueWithType}</Caption>
                </View>
              )}
            </Button>
          </View>
        </View>
    )
  }

  return (
    <ScreenWrapper
      modals={
          <ImageInfoModal
            currentItem={currentItem}
            modalRef={modalInfoRef}
            closeModal={closeModal}
          />
      }
      style={styles.container}
      withHorizontalPadding={false}
      withPaddingTop={false}
    >
      <View style={styles.mediaWrapper}>
        {images.length>0 && (
            <ImageViewer
                style={{
                  flex: 1,
                  width: '100%',
                  borderRadius: 0
                }}
                imageUrls={images}
                renderIndicator={()=>null}
                index={currentIndex}
                onSwipeDown={() => {
                  toBack()
                }}
                useNativeDriver={true}
                // flipThreshold={Dimensions.get('window').width/4}
                // maxOverflow={Dimensions.get('window').width}
                // pageAnimateTime={200}
                saveToLocalByLongPress={false}
                menus={false}
                loadingRender={loader}
                menuContext={{}}
                enableSwipeDown={true}
                renderHeader={index => header(index)}
                renderFooter={index => footer(index)}
            />
          )}
      </View>
    </ScreenWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1E1E1E'
  },
  bottomSheet: {
    paddingTop: px(16),
    paddingHorizontal: defaultPaddingX,
    backgroundColor: '#FFF',
    borderTopLeftRadius: px(16),
    borderTopRightRadius: px(16),
    width: contentMaxWidth
  },
  mediaWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // borderBottomLeftRadius: px(24),
    // borderBottomRightRadius: px(24),
    overflow: 'hidden',
    width: '100%',
    position: 'relative'
  },
  media: {
    flex: 1,
    // aspectRatio: 3 / 4,
  },
  buttons: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    width: '100%'
  },
  columnsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  column: {
    flexDirection: 'column',
    width: '50%'
  },
  image: {
    width: '100%',
    borderRadius: px(16),
    marginBottom: px(16),
    height: px(200),
    resizeMode: 'cover'
  },
  shadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 5,
  }
});

export {ImageScreen};
