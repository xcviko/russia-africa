import React from 'react';
import {StyleSheet} from 'react-native';
import {TouchableOpacity} from "../TouchableOpacity/TouchableOpacity";

const Link = ({
                children,
                style,
                underline,
                ...props
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.container,
        style
      ]}
      {...props}
    >
      {children}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {},
  text: {
    color: '#C60033'
  },
  underline: {
    textDecorationLine: 'underline'
  }
});

export {Link};
