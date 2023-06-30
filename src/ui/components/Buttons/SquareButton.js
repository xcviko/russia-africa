import React from 'react';
import {StyleSheet} from 'react-native';
import {px} from "lib/features";
import {TouchableOpacity} from "../TouchableOpacity/TouchableOpacity";

const SquareButton = ({
                  children,
                  size = 's',
                  background = 'lightTransparent',
                  style,
                  ...restProps
                }) => {
  return (
    <TouchableOpacity
      style={[
        style,
        styles.container,
        styles[`size_${size}`],
        styles[`background_${background}`],
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
    alignItems: 'center'
  },

  size_s: {
    borderRadius: px(8),
    width: px(44),
    height: px(44)
  },

  background_lightTransparent: {
    backgroundColor: 'rgba(255, 255, 255, 0.32)'
  },
  background_gray: {
    backgroundColor: '#F5F5F5'
  },
  background_transparent: {
    backgroundColor: 'transparent'
  },
});

export {SquareButton};
