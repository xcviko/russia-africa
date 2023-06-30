import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {ModalWrapper} from "ui/components/ModalWrapper/ModalWrapper";
import {Title} from "ui/components/Typography/Title";
import {Header} from "ui/components/Header/Header";
import {RoundedButton} from "ui/components/Buttons/RoundedButton";
import {Div} from "ui/components/Div/Div";
import {Caption} from "ui/components/Typography/Caption";
import {Link} from "ui/components/Link/Link";
import {SpacingX} from "ui/components/Spacing/SpacingX";
import {fullImgUrl, thumbImgUrl} from "api/api";
import {configureAnimation, defaultPaddingY, px, screenHeight, wordCase} from "lib/features";
import {Subhead} from "ui/components/Typography/Subhead";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {Button} from "ui/components/Buttons/Button";
import {$results} from "store/results";
import {observer} from "mobx-react-lite";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {$checkout} from "store/checkout";
import {$cart} from "store/cart";
import {$media} from "store/media";
import {$promocode} from "store/promocode";
import {TextInput} from "react-native-gesture-handler";

import ChevronRight from "assets/icons/ChevronRight.svg";
import Trash from 'assets/icons/Trash.svg';
import ArrowLeft from "../assets/icons/ArrowLeft.svg";
import Success from "../assets/icons/Success.svg";
import {$snackbar} from "../store/snackbar";
import {TouchableOpacity} from "../ui/components/TouchableOpacity/TouchableOpacity";
import {PromocodeModal} from "./PromocodeModal";

const CartModal = observer(({}) => {
  const modalRef = useRef(null);
  const [contentTopHeight, setContentTopHeight] = useState('1%');
  const [contentBottomHeight, setContentBottomHeight] = useState('1%');

  const insets = useSafeAreaInsets();

  const snapPoints = [
    '100%'
  ];

  useEffect(() => {
    if ($cart.isOpened) {
      modalRef.current?.snapToIndex(0);
      return;
    }
    modalRef.current?.close();
  }, [$cart.isOpened]);

  const onChange = (index) => {
    if (index === -1) {
      $cart.setOpened(false);
      // $results.clearAllPicked();
    }
  };

  const toCheckout = () => {
    if (Number($results.getPickedImagesTotal)) {
      modalRef.current?.close();
      $cart.setOpened(false);
      $checkout.setOpened(true);
      return;
    }
    const urls = [];
    $results.getPickedImagesUuids.forEach((uuid) => {
      urls.push(fullImgUrl(uuid));
    })

    $media.downloadFilesAndSaveToGallery(urls).then(() => {
      $results.clearAllPicked();
      $results.setMultipleSelect(false);
    })
  }

  useEffect(() => {
    if (!$results.getPickedImagesCount) {
      modalRef.current?.close();
    }
  }, [$results.getPickedImagesCount]);


  return (
    <ModalWrapper
      modalRef={modalRef}
      contentStyle={[
        styles.container,
        {flex: contentTopHeight + contentBottomHeight >= screenHeight ? 0 : 1}
      ]}
      onChange={onChange}
      snapPoints={snapPoints}
      initialSnapIndex={0}
      enableContentPanning
      withScroll
    >
      <View onLayout={e => setContentTopHeight(e.nativeEvent.layout.height)}>
        <SpacingY size={insets.top + defaultPaddingY} />
        <Header
          title={
            <View style={{}}>
              <RoundedButton
                background={'transparent'}
                onPress={() => modalRef.current?.close()}
              >
                <ArrowLeft />
              </RoundedButton>
              <SpacingY size={15} />
              <Title>
                Корзина
              </Title>
            </View>
          }
          after={
            <Button rounded background={'gray'} onPress={() => $results.clearAllPicked()}>
              <Caption style={{opacity: 0}} level={3} weight={2} color={'light'}>
                Выбрать несколько
              </Caption>
              <View style={{position: 'absolute', justifySelf: 'center', alignSelf: 'center'}}>
                <Caption
                  level={3}
                  weight={2}
                  color={'red'}
                >
                  Очистить
                </Caption>
              </View>
            </Button>
          }
          withHorizontalPadding
        />

        <SpacingY size={15} />

        <Div style={styles.items}>
          {$results.allImages?.filter(image => $results.pickedImages.includes(image.id)).map(image => (
            <View key={image.id} style={styles.item}>
              <View style={{flexDirection: 'row', height: '100%'}}>
                <Image
                  style={styles.image}
                  source={{uri: thumbImgUrl(image.uuid)}}
                />
                <SpacingX size={12} />
                <View style={{height: '100%', justifyContent: 'space-between'}}>
                  <Subhead>Артикул: {image.id}</Subhead>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Subhead
                      style={($promocode.isApplied && Number(image.price)) && {textDecorationLine: 'line-through'}} //
                      level={($promocode.isApplied && Number(image.price)) ? 2 : 1}
                      color={($promocode.isApplied && Number(image.price)) ? 'lightGray' : 'dark'}
                      weight={1}
                    >
                      {image.price} ₽
                    </Subhead>
                    {($promocode.isApplied && !!Number(image.price)) && (
                      <>
                        <SpacingX size={5} />
                        <Subhead level={2} weight={1}>
                          {$promocode.getPriceWithDiscount(image.price)} ₽
                        </Subhead>
                      </>
                    )}
                  </View>
                </View>
              </View>
              <RoundedButton background={'transparent'} onPress={() => {
                configureAnimation();
                $results.togglePicked(image.id);
                $snackbar.setActive(true, <><Success /><SpacingX size={9}/><Caption weight={2}>Удалено из корзины</Caption></>);
              }}><Trash /></RoundedButton>
            </View>
          ))}
        </Div>
        <View style={{height: 1, width: '100%', backgroundColor: '#EFEDF0'}} />
      </View>

      <View onLayout={e => setContentBottomHeight(e.nativeEvent.layout.height)}>
        <SpacingY size={12} />
        <TouchableOpacity onPress={() => {
          $promocode.setOpened(true);
        }}>
          <View style={{height: 1, width: '100%', backgroundColor: '#EFEDF0'}} />
          <SpacingY size={20} />
          <Div>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <View>
                <Subhead>Промо-код</Subhead>
                {($promocode.isApplied && $promocode.warningMessage) && (
                  <>
                    <SpacingY size={10} />
                    <Caption level={2} color={'lightGreen'}>{$promocode.warningMessage}</Caption>
                  </>
                )}
              </View>
              <ChevronRight />
            </View>
          </Div>
          <SpacingY size={20} />
          <View style={{height: 1, width: '100%', backgroundColor: '#EFEDF0'}} />
        </TouchableOpacity>

        <SpacingY size={28} />

        <Div style={styles.footer}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <View style={{flexDirection: 'row'}}>
              <Subhead color={'darkGray'} weight={2}>Всего: </Subhead>
              <Subhead weight={2}>{wordCase($results.getPickedImagesCount, ['фотография', 'фотографии', 'фотографий'])}</Subhead>
            </View>
            {$promocode.isApplied && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center'
              }}>
                <Title style={{fontSize: px(24)}}>
                  {$results.getPickedImagesTotal}
                </Title>
                <Title style={{fontSize: px(19)}}> ₽</Title>
              </View>
            )}
          </View>

          {$promocode.isApplied && (
            <>
              <SpacingY size={10} />
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Title level={2}>Промо-код:</Title>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center'
                }}>
                  <Title style={{textDecorationLine: 'line-through'}} level={2} color={'lightGray'}>
                    -{$promocode.getDiscountValueWithType || '0%'}
                  </Title>
                </View>
              </View>
            </>
          )}

          <SpacingY size={10} />

          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <Title level={2}>Итог:</Title>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center'
            }}>
              <Title style={{fontSize: px(28)}}>
                {$promocode.isApplied ?
                  $promocode.getPriceWithDiscount($results.getPickedImagesTotal)
                  : $results.getPickedImagesTotal}
              </Title>
              <Title style={{fontSize: px(19)}}> ₽</Title>
            </View>
          </View>

          <SpacingY size={16} />
          <Button onPress={toCheckout}>
            <Subhead weight={2} color={'light'}>{Number($results.getPickedImagesTotal) ? 'Перейти к оформлению' : `Скачать фото (${$results.getPickedImagesCount} шт.)`}</Subhead>
          </Button>
        </Div>
        <SpacingY size={insets.bottom + defaultPaddingY} />
      </View>
    </ModalWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  items: {

  },
  item: {
    height: px(56),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: px(15)
  },
  image: {
    width: px(56),
    height: '100%',
    borderRadius: px(16),
    resizeMode: 'cover',
    // backgroundColor: 'red'
  },
  footer: {

  },
  input: {
    height: px(44),
    paddingVertical: px(10),
    paddingHorizontal: px(12),
    backgroundColor: '#F1F5F6',
    borderRadius: px(8),
    borderWidth: 1,
    borderStyle: 'solid',
  }
});

export {CartModal};
