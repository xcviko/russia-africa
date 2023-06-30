import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Image} from 'react-native';
import ImageZoom from 'react-native-image-pan-zoom';
import {debounce} from "lib/debounce";

const ImageWrapper = ({
                        uri,
                        withZoom = false,
                        withPointerEvents = true,
                        withLoader = true,
                        width,
                        height,
                        style,
                        cover = false,
                        setSizes,
                        ...restProps
}) => {
  const imageZoomRef = useRef(null);
  // const [loading, setLoading] = useState(true);
  const [minScale, setMinScale] = useState(1);
  const [maxScale, setMaxScale] = useState(3);
  const [centerOn, setCenterOn] = useState({x: 1, y: 1, scale: 1, duration: 100});

  // useEffect(() => {
  //   if (!uri) {
  //     setLoading(true);
  //   }
  // }, [uri]);

  useEffect(() => {
    handleReset();
  }, [withPointerEvents]);

  const handleReset = () => {
    setMinScale(1);
    setMaxScale(3);
    setCenterOn({x: 1, y: 1, scale: 1, duration: 100});
    imageZoomRef.current?.reset();
  };

  const handleLoad = (event) => {
    if (uri) {
      // setLoading(false);
      if (setSizes) {
        const {width, height} = event.nativeEvent.source;
        setSizes({width, height});
      }
    }
  };

  const [posX, setPosX] = useState(1);
  const [posY, setPosY] = useState(1);

  const handleMove = useCallback(debounce((p) => {
    setPosX(p.positionX);
    setPosY(p.positionY);
  }, 200), []);

  const getImage = () => {
    return (
      <Image
        style={cover?styles.imageCover:styles.imageContain}
        onLoad={handleLoad}
        source={{uri: uri}}
        {...restProps}
      />
      /*<View style={[
        styles.image,
        {backgroundColor: 'red'}
      ]} />*/
    )
  }
  return (
    <View
      style={[
        styles.container,
        style
      ]}
      pointerEvents={withPointerEvents ? 'auto' : 'none'}
    >
      {withZoom ? (
        <ImageZoom
          ref={imageZoomRef}
          style={styles.map}
          cropWidth={width}
          cropHeight={height}
          imageWidth={width}
          imageHeight={height}
          enableCenterFocus={false}
          minScale={minScale}
          maxScale={maxScale}
          centerOn={centerOn}
          onMove={handleMove}
        >
          {getImage()}
        </ImageZoom>
      ) : getImage()}
      {/*{(loading && withLoader) && (*/}
      {/*  <View style={styles.loaderWrapper}>*/}
      {/*    <Loader style={styles.loader} />*/}
      {/*  </View>*/}
      {/*)}*/}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden'
  },
  imageContain: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain'
  },
  imageCover: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover'
  },
  loaderWrapper: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export {ImageWrapper};
