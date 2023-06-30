import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet} from 'react-native';
import {Div} from "ui/components/Div/Div";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {Button} from "ui/components/Buttons/Button";
import {Subhead} from "ui/components/Typography/Subhead";
import {defaultPaddingY} from "lib/features";
import {ModalWrapper} from "ui/components/ModalWrapper/ModalWrapper";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {observer} from "mobx-react-lite";

const ResultsBottomModal = observer(({isParentOpened, multipleSelect, pickedImagesCount, pickedImagesTotal, handleToCart}) => {
  const modalRef = useRef(null);
  const insets = useSafeAreaInsets();

  const [contentHeight, setContentHeight] = useState('1%')

  useEffect(() => {
    if (multipleSelect && pickedImagesCount && isParentOpened) {
      modalRef.current?.snapToIndex(0);
      return;
    }
    modalRef.current?.close();
  }, [multipleSelect, pickedImagesCount, isParentOpened]);

  const snapPoints = [contentHeight];

  const handleContentSizeChange = (width, height) => {
    setContentHeight(height);
  };

  return (
    <ModalWrapper
      modalRef={modalRef}
      backdropDisappearIndex={0}
      snapPoints={snapPoints}
      initialSnapIndex={0}
      onContentSizeChange={handleContentSizeChange}
    >
      <Div onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <SpacingY size={16} />
        <Button
          style={!pickedImagesCount && {backgroundColor: '#F2F3F7'}}
          onPress={handleToCart}
        >
          <Subhead color={pickedImagesCount ? 'light' : 'dark'} weight={2}>
            {pickedImagesTotal ? (
              <>Перейти в корзину {pickedImagesCount ? `(${pickedImagesCount} шт.)` : null}</>
            ) : (
              <>Скачать фото {pickedImagesCount ? `(${pickedImagesCount} шт.)` : null}</>
              )}
          </Subhead>
        </Button>
        <SpacingY size={insets.bottom + defaultPaddingY} />
      </Div>
    </ModalWrapper>
  );
});

const styles = StyleSheet.create({
  container: {},
});

export {ResultsBottomModal};
