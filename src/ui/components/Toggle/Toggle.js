import React from 'react';
import {View, StyleSheet} from 'react-native';
import {px} from "../../../lib/features";
import {TouchableOpacity} from "../TouchableOpacity/TouchableOpacity";

const Toggle = ({value, onPress, disabled}) => {
  // states:
  // refs:
  // effects:
  // constants (other hooks, etc.):
  // functions:

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      style={[
        styles.container,
        disabled && {opacity: 0.5},
        {
          backgroundColor: value ? '#319396' : '#BBBCC4',
          alignItems: value ? 'flex-end' : 'flex-start'
        }
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <View style={styles.circle} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: px(40),
    padding: px(2),
    borderRadius: px(50),
    justifyContent: 'center'
  },
  circle: {
    width: px(20),
    height: px(20),
    borderRadius: px(50),
    backgroundColor: '#FFF'
  }
});

export {Toggle};