import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
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
import {albumImgUrl, fullImgUrl, thumbImgUrl} from "api/api";
import {Link} from "ui/components/Link/Link";
import {observer} from "mobx-react-lite";
import {useSafeAreaInsets} from "react-native-safe-area-context";

import ArrowLeft from "../assets/icons/ArrowLeft.svg";
import {Button} from "../ui/components/Buttons/Button";
import {RoundedButton} from "../ui/components/Buttons/RoundedButton";
import {ResultsBottomModal} from "./ResultsBottomModal";
import {$cart} from "store/cart";
import {$media} from "store/media";
import {Loader} from "ui/components/Loader/Loader";

const EventModal = observer(({modalRef, event}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [contentHeight, setContentHeight] = useState('1%');

  const snapPoints = useMemo(() => {
    return [
      '100%'
    ];
  }, [contentHeight, insets.bottom, insets.top]);

  const toAlbum = (album) => {
    $results.setImages(album.photos);
    $results.setModalIndex(0);
  }

  return (
    <>
      <ModalWrapper
        modalRef={modalRef}
        snapPoints={snapPoints}
        // onChange={onChange}
        pressBehavior={0}
        withScroll
      >
        <SpacingY size={insets.top + defaultPaddingY} />
        <Div onLayout={e => {
          contentHeight === '1%' && setContentHeight(e.nativeEvent.layout.height)
        }}>
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
                  Альбомы мероприятия
                </Title>
              </View>
            }
          />

          <SpacingY size={defaultPaddingY * 2 - 8} />
          {event?.albums.map(album => {
            return (
              <TouchableOpacity
                style={styles.imageWrapper}
                key={album.id}
                onPress={() => toAlbum(album)}
              >
                <View style={styles.loaderWrapper}>
                  <Loader size={1.5} />
                </View>
                <Image
                  style={styles.image}
                  source={{uri: albumImgUrl(album.thumbnail)}}
                />
                <SpacingY size={10} />
                <Caption
                  style={styles.description}
                  numberOfLines={1}
                  ellipsizeMode='tail'
                  level={3}
                  weight={2}
                >
                  {album.nameRu}
                </Caption>
              </TouchableOpacity>
            )
          })}
        </Div>
        <SpacingY size={insets.bottom + defaultPaddingY} />
      </ModalWrapper>
    </>
  );
});

const styles = StyleSheet.create({
  imageWrapper: {
    marginVertical: px(8)
  },
  image: {
    width: '100%',
    height: px(202),
    borderRadius: px(16)
  },
  loaderWrapper: {
    width: '100%',
    height: px(202),
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center'
  }
});

export {EventModal};
