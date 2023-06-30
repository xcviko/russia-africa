import React, {useEffect, useRef} from 'react';
import {View, StyleSheet, Animated, Image, Text, Easing} from 'react-native';
import {px, screenHeight, screenWidth} from "lib/features";

import {LinearGradient} from 'expo-linear-gradient';

import Africa from 'assets/icons/Africa.svg';

const SplashStartAnimation = ({}) => {
  const toTop = useRef(new Animated.Value(screenHeight)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const toLeft = useRef(new Animated.Value(0)).current;
  const toRight = useRef(new Animated.Value(-228)).current;

  const toMidBottom = useRef(new Animated.Value(screenHeight * 2)).current;
  const componentOpacity = useRef(new Animated.Value(1)).current;


  useEffect(() => {
    setTimeout(() => {
      Animated.timing(toTop, {
        toValue: 0,
        duration: 1000,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 500)

    setTimeout(() => {
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 750,
        easing: Easing.inOut(Easing.ease),
        useNativeDriver: true,
      }).start();
    }, 2500)

    setTimeout(() => {
      Animated.timing(
        toLeft,
        {
          toValue: -120,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }
      ).start();
    }, 2500);

    setTimeout(() => {
      Animated.timing(
        toRight,
        {
          toValue: 76,
          duration: 750,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }
      ).start();
    }, 2500);

    setTimeout(() => {
      Animated.timing(
        toMidBottom,
        {
          toValue: screenHeight / 2 + 166,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }
      ).start();
    }, 3500);

    setTimeout(() => {
      Animated.timing(
        componentOpacity,
        {
          toValue: 0,
          duration: 500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }
      ).start();
    }, 6000);
  }, []);

  return (
    <Animated.View style={[
      styles.container,
      {opacity: componentOpacity}
    ]}>

      <LinearGradient
        // Array of positions and colors
        colors={['#008CD3', '#006AB5']}
        start={{x: 0, y: 0}}
        end={{x: 1, y: 0}}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute'
        }}
      />

      <View style={styles.logo}>
        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          overflow: 'hidden'
        }}>
          <Animated.View style={[
            {opacity: textOpacity},
            {transform: [{translateX: toRight}]}
          ]}>
            <Image
              style={{
                width: px(228),
                height: '100%'
              }}
              source={require('assets/images/LogoText.png')}
            />
          </Animated.View>
        </View>

        <View style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Animated.View style={[
            {transform: [
                {translateX: toLeft},
                {translateY: toTop}
              ]}
          ]}>
            <Image
              style={{
                width: px(72),
                height: px(72)
              }}
              source={require('assets/images/Logo.png')}
            />
          </Animated.View>
        </View>
      </View>

      <Animated.View style={[
        styles.africaWrapper,
        {transform: [{translateY: toMidBottom}]}
      ]}>
        <Africa />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    width: '100%',
    height: '100%',
    pointerEvents: 'none'
  },
  logo: {
    width: px(304),
    height: px(64),
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },
  background: {},
  group: {
    flexDirection: 'row'
  },
  block: {
    width: 150,
    height: 200,
    borderRadius: 20,
    margin: 10
  },
  africaWrapper: {
    position: 'absolute',
    justifyContent: 'flex-end'
  }
});

export {SplashStartAnimation};
