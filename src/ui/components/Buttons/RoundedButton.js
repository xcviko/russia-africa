import React from 'react';
import {StyleSheet} from 'react-native';
import {px} from "lib/features";
import {TouchableOpacity} from "../TouchableOpacity/TouchableOpacity";

const RoundedButton = ({
                        children,
                        size = 's',
                        background = 'light',
                        disabled = false,
                        hidden = false,
                        style,
                        ...restProps
                      }) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        styles[`size_${size}`],
        styles[`background_${background}`],
        hidden && styles.hidden,
        style
      ]}
      disabled={disabled}
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
    overflow: 'hidden'
  },
  hidden: {
    opacity: 0
  },

  size_s: {
    borderRadius: px(50),
    width: px(32),
    height: px(32)
  },
  size_m: {
    borderRadius: px(50),
    width: px(35),
    height: px(35)
  },
  size_l: {
    borderRadius: px(100),
    width: px(72),
    height: px(72)
  },

  background_light: {backgroundColor: '#F1F5F6'},
  background_transparent: {backgroundColor: 'transparent'}
});

export {RoundedButton};
