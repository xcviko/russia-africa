import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, Text, StyleSheet, Animated} from 'react-native';
import {ModalWrapper} from "ui/components/ModalWrapper/ModalWrapper";
import {Title} from "ui/components/Typography/Title";
import {$results} from "store/results";
import {Div} from "ui/components/Div/Div";
import {Header} from "ui/components/Header/Header";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {
  configureAnimation,
  defaultPaddingX,
  defaultPaddingY,
  getStorageData,
  px,
  screenHeight,
  storeData
} from "lib/features";
import {TouchableOpacity} from "ui/components/TouchableOpacity/TouchableOpacity";
import {Caption} from "ui/components/Typography/Caption";
import {Subhead} from "ui/components/Typography/Subhead";
import {SCREEN_IMAGE} from "lib/router";
import {useNavigation} from "@react-navigation/native";
import {fullImgUrl, thumbImgUrl} from "api/api";
import {Link} from "ui/components/Link/Link";
import {observer} from "mobx-react-lite";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ImageWrapper} from "ui/components/ImageWrapper/ImageWrapper";
import ArrowLeft from "../assets/icons/ArrowLeft.svg";
import {Button} from "../ui/components/Buttons/Button";
import {RoundedButton} from "../ui/components/Buttons/RoundedButton";
import {ResultsBottomModal} from "./ResultsBottomModal";
import {$cart} from "store/cart";
import {$media} from "store/media";
import {Loader} from "ui/components/Loader/Loader";

const ResultsModal = observer(({}) => {
  const modalRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [localModalIndex, setLocalModalIndex] = useState(-1);
  const [contentHeight, setContentHeight] = useState('1%');
  const [tipHeight, setTipHeight] = useState(0);

  const [multipleSelect, setMultipleSelect] = useState(false);
  const [pickedImages, setPickedImages] = useState([]);

  const [pickedImagesTotal, setPickedImagesTotal] = useState(0);
  const [pickedImagesUrls, setPickedImagesUrls] = useState([]);

  useEffect(() => {
    setPickedImages($results.pickedImages);
  }, [$results.pickedImages.length]);

  useEffect(() => {
    let total = 0;
    let urls = [];

    if ($results.allImages?.length && pickedImages?.length) {
      $results.allImages.forEach(image => {
        if (pickedImages.includes(image.id)) {
          total += Number(image.price);
          urls.push(fullImgUrl(image.uuid));
        }
      })
    }

    setPickedImagesTotal(total);
    setPickedImagesUrls(urls);
  }, [pickedImages]);

  useEffect(() => {
    setMultipleSelect($results.multipleSelect);
  }, [$results.multipleSelect]);

  const showImageFullSize = (id) => {
    setTimeout(() => {
      $results.setFullSize(id);
      navigation.navigate(SCREEN_IMAGE);
    }, 1);
  }

  const toggleMultipleSelect = () => {
    setMultipleSelect(prevState => {
      if (prevState) {
        setPickedImages([]);
        return false;
      }
      return true;
    });
  }

  const onImagePress = (id, multipleSelect) => {
    if (multipleSelect) {
      setPickedImages(prevState => {
        if (prevState.includes(id)) {
          return prevState.filter(el => el !== id);
        } else {
          return [...prevState, id];
        }
      });
      return;
    }
    showImageFullSize(id);
  }

  const handleToCart = () => {
    if (pickedImagesTotal) {
      configureAnimation();
      $results.setPickedImages(pickedImages);
      $cart.setOpened(true);
      return;
    }

    $media.downloadFilesAndSaveToGallery(pickedImagesUrls).then(() => {
      setMultipleSelect(false);
      setPickedImages([]);
    })
  };

  useEffect(() => {
    console.log('$results.modalIndex', $results.modalIndex)
    if ($results.modalIndex >= 0) {
      modalRef.current?.snapToIndex($results.modalIndex);
      return;
    }
    modalRef.current?.close()
  }, [$results.modalIndex]);

  useEffect(() => {
    console.log('$results.isTipShown:', $results.isTipShown, tipHeight)
      if ($results.modalIndex >= 0 && !$results.isTipShown && tipHeight) {
        (async () => {
          const value = await getStorageData('isResultsTipShown');
          console.log('getted value!!!!!!!!!!!!', value)
          if (!value) {
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
            setTimeout(() => $results.setTipShown(true));
            storeData('isResultsTipShown', 'true').then();
          }
        })()
      }
  }, [$results.modalIndex, $results.isTipShown, tipHeight]);

  const closeTip = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(); //
  }

  const snapPoints = useMemo(() => {
    return [
      '100%'
    ];
  }, [contentHeight, insets.bottom, insets.top]);

  const onChange = (index) => setLocalModalIndex(index);

  const ratioImageHeight = (width, height) => {
    if (width && height) {
      if (width >= height) {
        return 130;
      }
      return 200;
    }
    return 130;
  }

  const ImageThumb = useMemo(() => {
    return ({image, multipleSelect, isPicked}) => {
      const [sizes, setSizes] = useState({});

      return (
        <TouchableOpacity
          style={{
            borderRadius: px(16),
            marginBottom: px(16),
            overflow: 'hidden'
          }}
          onPress={() => onImagePress(image.id, multipleSelect)}
        >
          <ImageWrapper
            cover
            style={[
              styles.image,
              {height: ratioImageHeight(sizes.width, sizes.height)}
            ]}
            setSizes={setSizes}
            uri={thumbImgUrl(image.uuid)}
          />
          <View style={styles.priceBadge}>
            <Caption level={2} weight={2} color={'dark'}>
              {`${image.price} ₽`}
            </Caption>
          </View>
          {multipleSelect && (
            <View style={[styles.checkboxBadge, isPicked && styles.checked]}>
              <View style={styles.checkedBadge}/>
            </View>
          )}
        </TouchableOpacity>
      )
    }
  }, []);


  return (
    <>
      <ModalWrapper
        modalRef={modalRef}
        snapPoints={snapPoints}
        onChange={onChange}
        pressBehavior={0}
        backdropAppearIndex={1}
        backdropDisappearIndex={0}
        withScroll
      >
        <SpacingY size={insets.top + defaultPaddingY} />
        <Div onLayout={e => {
          contentHeight === '1%' && setContentHeight(e.nativeEvent.layout.height)
        }}>
          {$results.images ? (
            <>
              <Header
                style={{
                  zIndex: 1
                }}
                title={
                  <View style={{}}>
                    <RoundedButton
                      background={'transparent'}
                      onPress={() => {$results.setModalIndex(-1)}}
                    >
                      <ArrowLeft />
                    </RoundedButton>
                    <SpacingY size={15} />
                    <Title>
                      Найденные фото
                    </Title>
                  </View>
                }
                after={
                  $results.images?.length > 1 ? (
                      <Button
                        rounded
                        onPress={toggleMultipleSelect}
                        background={!multipleSelect ? 'green' : 'lightGray'}
                      >
                        <Caption style={multipleSelect && {opacity: 0}} level={3} weight={2} color={'light'}>
                          Выбрать несколько
                        </Caption>
                        <View
                          style={[
                            {position: 'absolute', justifySelf: 'center', alignSelf: 'center', opacity: 0},
                            multipleSelect && {opacity: 1}
                          ]}
                        >
                          <Caption
                            level={3}
                            weight={2}
                            color={'red'}
                          >
                            Отменить
                          </Caption>
                        </View>
                      </Button>
                  ) : <></>
                }
                titleCentered={!$results.images?.length}
              >
                {$results.images?.length > 1 && <Animated.View
                  style={{
                    position: 'absolute',
                    right: 0,
                    bottom: -tipHeight,
                    opacity: fadeAnim
                  }}
                >
                  <Link
                    onLayout={e => {
                      setTipHeight(e.nativeEvent.layout.height)
                    }}
                    withRipple={false}
                    disabled={$results.images?.length === 1}
                    onPress={closeTip}
                  >
                    <View style={{alignItems: 'flex-end'}}>
                      <View style={{
                        width: 0,
                        height: 0,
                        backgroundColor: 'transparent',
                        borderStyle: 'solid',
                        borderLeftWidth: 10,
                        borderRightWidth: 10,
                        borderBottomWidth: 10,
                        borderLeftColor: 'transparent',
                        borderRightColor: 'transparent',
                        borderBottomColor: '#212122',
                        marginRight: '10%'
                      }}/>
                      <View
                        style={{
                          backgroundColor: '#212122',
                          borderRadius: px(10),
                          padding: px(9)
                        }}
                      >
                        <Caption color={'light'} level={2}>
                          Можно скачать сразу несколько фотографий
                        </Caption>
                      </View>
                    </View>
                  </Link>
                </Animated.View>}
              </Header>
              <SpacingY size={20} />
              {$results.images && (
                <View style={styles.columnsWrapper}>
                  <View style={[styles.column, {paddingRight: defaultPaddingX / 2}]}>
                    {$results.images.map((image, i) => {
                      if (i % 2 === 0) {
                        const isPicked = pickedImages.includes(image.id);

                        return (
                          <ImageThumb
                            key={image.id}
                            image={image}
                            isPicked={isPicked}
                            multipleSelect={multipleSelect}
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                  </View>
                  <View style={[styles.column, {paddingLeft: defaultPaddingX / 2}]}>
                    {$results.images.map((image, i) => {
                      if (i % 2 !== 0) {
                        const isPicked = pickedImages.includes(image.id);

                        return (
                          <ImageThumb
                            key={image.id}
                            image={image}
                            isPicked={isPicked}
                            multipleSelect={multipleSelect}
                          />
                        );
                      } else {
                        return null;
                      }
                    })}
                  </View>
                </View>
              )}

              <SpacingY size={pickedImages.length ? insets.bottom + defaultPaddingX * 4 : insets.bottom + 8} />
            </>
          ) : (
            <View style={{
              height: screenHeight * 0.6,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Loader />
            </View>
          )}
        </Div>
      </ModalWrapper>

      <ResultsBottomModal
        isParentOpened={localModalIndex >= 0}
        multipleSelect={multipleSelect}
        pickedImages={pickedImages}
        handleToCart={handleToCart}
        pickedImagesCount={pickedImages.length}
        pickedImagesTotal={pickedImagesTotal}
      />
    </>
  );
});

const styles = StyleSheet.create({
  container: {},
  priceBadge: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    paddingHorizontal: px(12),
    paddingVertical: px(10),
    borderRadius: px(12),
    backgroundColor: '#D4E2E8',
    flexDirection: 'row'
  },
  checkboxBadge: {
    position: 'absolute',
    right: 0,
    top: 0,
    padding: px(8),
    margin: px(8),
    borderRadius: px(50),
    backgroundColor: '#FFF'
  },
  checked: {
    backgroundColor: '#319396'
  },
  checkedBadge: {
    borderRadius: px(50),
    backgroundColor: '#FFF',
    width: px(8),
    height: px(8)
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
    height: px(200),
  }
});

export {ResultsModal};
