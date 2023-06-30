import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import {Div} from "ui/components/Div/Div";
import {Header} from "ui/components/Header/Header";
import {Title} from "ui/components/Typography/Title";
import {RoundedButton} from "ui/components/Buttons/RoundedButton";
import {SpacingY} from "ui/components/Spacing/SpacingY";
import {Subhead} from "ui/components/Typography/Subhead";
import {defaultPaddingY} from "lib/features";
import {ModalWrapper} from "ui/components/ModalWrapper/ModalWrapper";
import {observer} from "mobx-react-lite";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import Cross from "assets/icons/Cross.svg";

const ImageInfoModal = observer(({currentItem, modalRef, closeModal}) => {
  const insets = useSafeAreaInsets();

  const [contentHeight, setContentHeight] = useState('1%');

  return (
    <ModalWrapper
      modalRef={modalRef}
      snapPoints={[contentHeight]}
      enablePanDownToClose
    >
      <Div onLayout={e => setContentHeight(e.nativeEvent.layout.height)}>
        <SpacingY size={defaultPaddingY} />
        <Header
          title={<Title level={2}>Информация о фото</Title>}
          after={<RoundedButton onPress={closeModal}><Cross /></RoundedButton>}
        />
        <SpacingY size={30} />
        <Subhead color={'darkGray'}>Фотограф</Subhead>
        <SpacingY size={14} />
        <Subhead weight={2}>{currentItem.authorOrg!==''?currentItem.authorOrg:currentItem.author}</Subhead>
        { currentItem.authorInn!=='' && (
            <>
              <SpacingY size={34} />
              <Subhead color={'darkGray'}>ИНН</Subhead>
              <SpacingY size={14} />
              <Subhead weight={2}>{currentItem.authorInn}</Subhead>
            </>
        )}
        <SpacingY size={insets.bottom + defaultPaddingY} />
      </Div>
    </ModalWrapper>
  );
});

const styles = StyleSheet.create({
  container: {},
});

export {ImageInfoModal};
