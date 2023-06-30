import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ModalWrapper} from "ui/components/ModalWrapper/ModalWrapper";
import {Title} from "ui/components/Typography/Title";
import {$cart} from "store/cart";
import {$checkout} from "store/checkout";
import {configureAnimation, defaultPaddingY, px, screenHeight, validateEmail, wordCase} from "lib/features";
import {Div} from "ui/components/Div/Div";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {Header} from "ui/components/Header/Header";
import {SpacingX} from "ui/components/Spacing/SpacingX";
import {$results} from "store/results";
import {Caption} from "ui/components/Typography/Caption";
import {RoundedButton} from "ui/components/Buttons/RoundedButton";
import {TextInput} from "react-native-gesture-handler";
import {observer} from "mobx-react-lite";
import {Subhead} from "ui/components/Typography/Subhead";
import {Button} from "ui/components/Buttons/Button";
import {useNavigation, useRoute} from "@react-navigation/native";
import {SCREEN_MAIN, SCREEN_RESULTS} from "lib/router";
import {$promocode} from "store/promocode";

import ArrowLeft from "assets/icons/ArrowLeft.svg";
import Cross from "assets/icons/Cross.svg";
import Success from "../assets/icons/Success.svg";
import {$snackbar} from "../store/snackbar";

const CheckoutModal = observer(({}) => {
  const modalRef = useRef();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const navigation = useNavigation();

  const [emailWarning, setEmailWarning] = useState(false);
  const [contentHeight, setContentHeight] = useState('1%');

  useEffect(() => {
    if ($checkout.isOpened) {
      openModal();
      return;
    }
    closeModal();
  }, [$checkout.isOpened]);

  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
  };

  const onChange = (index) => {
    if (index === -1) {
      $checkout.setOpened(false)
    }
  };

  const toBack = () => {
    closeModal();
    $cart.setOpened(true);
  }

  const toPay = () => {
    if (validateEmail($checkout.email)) {
      setEmailWarning(false);
      closeModal();
      $checkout.createOrder(navigation);

      setTimeout(() => {
        $results.setMultipleSelect(false, true);
        $results.setModalIndex(-1);
        // $checkout.setEmail('');
        if (route.name !== SCREEN_RESULTS) {
          navigation.navigate(SCREEN_RESULTS)
        }
      }, 500)
    } else {
      configureAnimation();
      setEmailWarning(true);
    }
  }

  const openModal = () => modalRef.current?.snapToIndex(0);
  const closeModal = () => modalRef.current?.close();

  const snapPoints = [
    '100%'
  ];

  return (
    <ModalWrapper
      modalRef={modalRef}
      contentStyle={styles.container}
      onContentSizeChange={handleContentSizeChange}
      onChange={onChange}
      snapPoints={snapPoints}
      initialSnapIndex={0}
      enableContentPanning
    >
      <Div>
        <SpacingY size={insets.top + defaultPaddingY} />
        <Header
          title={
            <View style={{}}>
              <RoundedButton
                background={'transparent'}
                onPress={toBack}
              >
                <ArrowLeft />
              </RoundedButton>
              <SpacingY size={15} />
              <Title>
                Оформление заказа
              </Title>
            </View>
          }
        />
        <SpacingY size={26} />
        <Caption level={2} color={'darkGray'}>
          Email для получения чека и фотографии
        </Caption>
        <SpacingY size={8} />
        <TextInput
          style={[
            styles.input,
            {borderColor: emailWarning ? '#F33737': '#929DB2'}
          ]}
          onChangeText={$checkout.setEmail}
          value={$checkout.email}
          autoCapitalize="none"
          autoCompleteType="off" // Отключение автозаполнения
          placeholder="example@mail.com"
          placeholderTextColor="#5A6882"
          keyboardType="default"
        />
        {emailWarning && (
          <>
            <SpacingY size={8} />
            <Caption level={'3'} color={'red'}>Введите валидный Email</Caption>
          </>
        )}
      </Div>

      <Div>
        <SpacingY size={28} />

        <View style={styles.footer}>
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
          <Button onPress={toPay}>
            <Subhead weight={2} color={'light'}>Оплатить</Subhead>
          </Button>
        </View>

        <SpacingY size={insets.bottom + defaultPaddingY} />
      </Div>
    </ModalWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between'
  },
  input: {
    height: px(44),
    paddingVertical: px(10),
    paddingHorizontal: px(12),
    backgroundColor: '#F1F5F6',
    borderRadius: px(8),
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: '#929DB2'
  }
});

export {CheckoutModal};
