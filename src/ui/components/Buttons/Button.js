import React from 'react';
import {StyleSheet} from 'react-native';
import {px} from "lib/features";
import {TouchableOpacity} from "../TouchableOpacity/TouchableOpacity";

const Button = ({
                  children,
                  size = 'm',
                  background = 'green',
                  lowercase,
                  stretched,
                  rounded,
                  style,
                  ...restProps
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles[`size_${size}`],
        styles[`background_${background}`],
        lowercase && {textTransform: 'lowercase'},
        stretched && {width: '100%'},
        rounded && {borderRadius: 200},
        style
      ]}
      {...restProps}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row'
  },

  size_s: {
    padding: px(10),
    borderRadius: px(8)
  },
  size_m: {
    padding: px(14),
    borderRadius: px(8)
  },
  size_l: {
    padding: px(14),
    borderRadius: px(16)
  },

  background_light: {backgroundColor: '#FFF'},
  background_dark: {backgroundColor: '#212122'},
  background_gray: {backgroundColor: '#F5F5F5'},
  background_lightGray: {backgroundColor: '#F2F3F7'},
  background_green: {backgroundColor: '#F06E0C'},
  background_transparentDark: {backgroundColor: 'rgba(255, 255, 255, 0.25)'},
});

export {Button};
