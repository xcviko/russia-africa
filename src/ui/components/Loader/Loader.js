import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Animated, Easing} from 'react-native';
import {px} from "lib/features";

import LoaderSpin from 'assets/icons/LoaderSpin.svg';

const Loader = ({
                  style,
                  size = 1
}) => {
  const [spinAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, [spinAnim]);

  const spin = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={[
      styles.container,
      {width: px(88 / size)},
      style
    ]}>
      <Animated.View style={{ transform: [{ rotate: spin }] }}>
        <LoaderSpin width={58 / size} height={58 / size} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    /*backgroundColor: 'rgba(0, 0, 0, 0.6)',*/
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: px(10)
  },
});

export {Loader};
