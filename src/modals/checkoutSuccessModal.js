import {observer} from "mobx-react-lite";
import React, {useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import ArrowLeft from "../assets/icons/ArrowLeft.svg";
import Cross from "../assets/icons/Cross.svg";
import {defaultPaddingY} from "../lib/features";
import {$checkout} from "../store/checkout";
import {Button} from "../ui/components/Buttons/Button";
import {RoundedButton} from "../ui/components/Buttons/RoundedButton";
import {Div} from "../ui/components/Div/Div";
import {Header} from "../ui/components/Header/Header";
import {ModalWrapper} from "../ui/components/ModalWrapper/ModalWrapper";
import {SpacingY} from "../ui/components/Spacing/SpacingY";
import {Subhead} from "../ui/components/Typography/Subhead";
import {Title} from "../ui/components/Typography/Title";

import SuccessWithOpacity from "assets/icons/SuccessWithOpacity.svg";

const CheckoutSuccessModal = observer(({modalRef}) => {
  // states:
  const [contentHeight, setContentHeight] = useState('1%');

  // refs:
  // effects:
  // constants (other hooks, etc.):
  const insets = useSafeAreaInsets();

  const closeModal = () => modalRef.current?.close();

  // functions:

  return (
    <ModalWrapper
      modalRef={modalRef}
      snapPoints={[contentHeight]}
      enablePanDownToClose
    >
      <Div onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <SpacingY size={defaultPaddingY * 1.5} />
        <SuccessWithOpacity />
        <SpacingY size={16} />
        <Title level={2}>Оплата прошла успешно</Title>
        <SpacingY size={16} />
        <View style={{flexDirection: 'row'}}>
          <Subhead weight={2}>
            {`Благодарим вас за покупку фотоматериалов из Фейсбанка, фотографии и чек мы отправили на эту почту:`} <Text style={{color: '#319396'}}>{$checkout.email}</Text>
          </Subhead>
        </View>
        <SpacingY size={defaultPaddingY} />
        <Button background={'lightGray'} onPress={closeModal}>
          <Title level={4} weight={2}>Понятно</Title>
        </Button>
        <SpacingY size={insets.bottom + defaultPaddingY} />
      </Div>
    </ModalWrapper>
  );
});

const styles = StyleSheet.create({
  container: {},
});

export {CheckoutSuccessModal};