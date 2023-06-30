import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet} from 'react-native';
import {ModalWrapper} from "ui/components/ModalWrapper/ModalWrapper";
import {Title} from "ui/components/Typography/Title";
import {Caption} from "ui/components/Typography/Caption";
import {configureAnimation, defaultPaddingY, px, screenHeight} from "lib/features";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {Button} from "ui/components/Buttons/Button";
import {observer} from "mobx-react-lite";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {$promocode} from "store/promocode";
import {TextInput} from "react-native-gesture-handler";
import {$cart} from "../store/cart";
import {$results} from "../store/results";
import {Subhead} from "../ui/components/Typography/Subhead";


const PromocodeModal = observer(({}) => {
  const modalRef = useRef(null);
  const inputRef = useRef(null);
  const [value, setValue] = useState($promocode.value);

  const insets = useSafeAreaInsets();

  const snapPoints = [
    screenHeight - insets.top
  ];

  useEffect(() => {
    if ($promocode.isOpened) {
      modalRef.current?.snapToIndex(0);
      inputRef.current?.focus();
      return;
    }
    modalRef.current?.close();
  }, [$promocode.isOpened]);

  const toApplyPromocode = () => {
    configureAnimation();
    if (value) {
      $promocode.checkPromo(value);
      return;
    }
    $promocode.setWarningMessage('Введите промо-код');
  }

  const onChange = (index) => {
    if (index === -1) {
      $promocode.setOpened(false)
    }
  };

  return (
    <ModalWrapper
      modalRef={modalRef}
      contentStyle={styles.container}
      snapPoints={snapPoints}
      onChange={onChange}
      initialSnapIndex={0}
      enablePanDownToClose
      enableContentPanning
    >
      <View style={styles.content}>
        <Subhead color={'lightGray'}>
          Введите промо-код
        </Subhead>
        <SpacingY size={12} />
        <TextInput
          ref={inputRef}
          style={[
            styles.input,
            {borderColor: $promocode.warningMessage ? ($promocode.isApplied ? '#0DC268' : '#F33737') : '#929DB2'}
          ]}
          onChangeText={setValue}
          onSubmitEditing={toApplyPromocode}
          value={value}
          placeholderTextColor="#5A6882"
          keyboardType="default"
          autoCapitalize="none"
          autoCompleteType="off" // Отключение автозаполнения
          spellCheck={false}
          autoCorrect={false}
          autoComplete={'off'}
        />
        <SpacingY size={12} />
        <SpacingY size={8} />
        <Caption level={2} color={$promocode.isApplied ? 'lightGreen' : 'red'}>
          {$promocode.warningMessage}
        </Caption>
      </View>
      <View>
        <Button
          style={{
            borderRadius: 0,
            paddingVertical: px(20)
          }}
          stretched
          onPress={toApplyPromocode}
        >
          <Title color={'light'} level={4} weight={2}>Применить</Title>
        </Button>
        <SpacingY size={insets.bottom + defaultPaddingY} />
      </View>
    </ModalWrapper>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontSize: px(32),
    fontWeight: '600',
    height: px(45),
    backgroundColor: 'transparent',
    borderWidth: 0,
  }
});

export {PromocodeModal};
