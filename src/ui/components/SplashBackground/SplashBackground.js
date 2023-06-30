import React, {useEffect, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Animated, LayoutAnimation, Image} from 'react-native';

import splash_1 from 'assets/images/splash/splash1.png';
import splash_2 from 'assets/images/splash/splash2.png';
import splash_3 from 'assets/images/splash/splash3.png';
import splash_4 from 'assets/images/splash/splash4.png';
import splash_5 from 'assets/images/splash/splash5.png';
import splash_6 from 'assets/images/splash/splash6.png';
import splash_7 from 'assets/images/splash/splash7.png';
import splash_8 from 'assets/images/splash/splash8.png';
import splash_9 from 'assets/images/splash/splash9.png';

const SplashBackground = React.memo(({style}) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);
  const [animToggled, setAnimToggled] = useState(false);

  const animPoint = (value, duration) => {
    return Animated.timing(slideAnim, {
      toValue: value,
      duration: duration,
      useNativeDriver: true,
    });
  }

  // анимация
  useEffect(() => {
    if (contentHeight && !animToggled) {
      setAnimToggled(true);

      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

      const animation = () => {
        animPoint(-contentHeight * 0.2, 4000).start(() => {
          setTimeout(() => {
            animPoint(-contentHeight * 0.45, 3000).start(() => {
              setTimeout(() => {
                animPoint(-contentHeight * 0.3, 4000).start(() => {
                  setTimeout(() => {
                    animPoint(0, 3000).start()
                  }, 3000);
                })
              }, 2000);
            })
          }, 2500);
        });
      }

      setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }).start();
      }, 500);

      setTimeout(animation, 1000);

      setInterval(() => {
        animation();
      }, 27000);
    }
  }, [contentHeight]);

  const Group = ({images}) => {
    return (
      <Animated.View style={[
        styles.group,
        {opacity: fadeAnim}
      ]}>
        {images.map((image, index) => {
          return (
            <Image
              key={index.toString()}
              style={styles.block}
              source={image}
            />
          )
        })}
      </Animated.View>
    )
  }

  return (
    <View style={[
      styles.container,
      style
    ]}>
      <Animated.View
        style={[
          styles.background,
          {transform: [{translateY: slideAnim}]}
        ]}
        onLayout={e => setContentHeight(e.nativeEvent.layout.height)}
      >
        <Group images={[splash_4, splash_9, splash_4, splash_5, splash_3, splash_9, splash_5]} />
        <Group images={[splash_2, splash_6, splash_7, splash_1, splash_6, splash_8, splash_1]} />
        <Group images={[splash_8, splash_1, splash_8, splash_2, splash_3, splash_4, splash_3]} />
        <Group images={[splash_3, splash_7, splash_6, splash_9, splash_6, splash_2, splash_7]} />
        <Group images={[splash_9, splash_2, splash_3, splash_8, splash_5, splash_4, splash_9]} />
        <Group images={[splash_7, splash_6, splash_1, splash_7, splash_2, splash_7, splash_2]} />
        <Group images={[splash_4, splash_5, splash_3, splash_4, splash_6, splash_1, splash_4]} />
        <Group images={[splash_1, splash_4, splash_7, splash_1, splash_7, splash_5, splash_3]} />
        <Group images={[splash_5, splash_9, splash_6, splash_3, splash_9, splash_1, splash_8]} />
        <Group images={[splash_6, splash_3, splash_7, splash_2, splash_1, splash_6, splash_4]} />
      </Animated.View>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // transform: 'rotate(-17deg)',
    alignItems: 'center',
  },
  background: {},
  group: {
    flexDirection: 'row'
  },
  block: {
    width: 160,
    height: 215,
    borderRadius: 12,
    margin: 6
  }
});

export {SplashBackground};
