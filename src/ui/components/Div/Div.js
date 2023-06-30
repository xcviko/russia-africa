import React from 'react';
import {View, StyleSheet} from 'react-native';
import {defaultPaddingX} from "lib/features";

const Div = ({children, style, ...restProps}) => {
  return (
    <View
      style={[
        styles.container,
        style
      ]}
      {...restProps}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: defaultPaddingX
  },
});

export {Div};
