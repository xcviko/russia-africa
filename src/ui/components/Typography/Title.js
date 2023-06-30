import React from 'react';
import {StyleSheet, Text} from 'react-native';
import {px} from "lib/features";

// level: 1 | 2 | 3 | 4
// weight: 1 | 2 | 3
// color: 'dark' | 'light' | 'gray' | 'lightGray' | 'darkGray' | 'red' | 'lightGreen'
// lowercase?: boolean
// withShadow?: boolean

const Title = ({
                 level = 1,
                 weight = 1,
                 color = 'dark',
                 lowercase,
                 withShadow,
                 style,
                 children,
                 ...restProps
}) => {
  return (
    <Text
      style={[
        styles.text,
        styles[`level_${level}`],
        styles[`weight_${weight}`],
        styles[`color_${color}`],
        lowercase && styles.lowercase,
        withShadow && styles.withShadow,
        style,
      ]}
      {...restProps}
    >
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {},
  lowercase: {textTransform: 'lowercase'},

  level_1: {fontSize: px(24)},
  level_2: {fontSize: px(20)},
  level_3: {fontSize: px(18)},
  level_4: {fontSize: px(17)},

  weight_1: {fontWeight: '600'},
  weight_2: {fontWeight: '500'},
  weight_3: {fontWeight: '400'},

  color_dark: {color: '#212122'},
  color_light: {color: '#FFF'},
  color_gray: {color: '#F2F3F7'},
  color_lightGray: {color: '#929DB2'},
  color_darkGray: {color: '#5A6882'},
  color_red: {color: '#F33737'},
  color_lightGreen: {color: '#0DC268'},

  withShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 2, height: 1 },
    textShadowRadius: 2
  }
});

export {Title};
