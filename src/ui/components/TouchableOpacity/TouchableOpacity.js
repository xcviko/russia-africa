import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableNativeFeedback
} from 'react-native';

const TouchableOpacity = ({
                            withRipple = true,
                            children,
                            disabled,
                            hidden,
                            style,
                            childrenStyle,
                            ...restProps
}) => {
  const [scaleAnim] = useState(new Animated.Value(1));

  const handlePress = (value) => {
    Animated.spring(scaleAnim, {
      toValue: value,
      delay: 0,
      useNativeDriver: true,
    }).start();
  };

  const animatedStyle = {
    transform: [{scale: scaleAnim}],
  };

  const onPressIn = () => handlePress(0.95);
  const onPressOut = () => handlePress(1);

  return (
    <TouchableNativeFeedback
      background={withRipple ? TouchableNativeFeedback.SelectableBackground() : null}
      activeOpacity={1}
      onPressIn={onPressIn}
      onPressOut={onPressOut}
      useForeground={true}
      disabled={disabled}
      pointerEvents={disabled ? 'none' : 'all'}
      {...restProps}
    >
      <Animated.View
        style={[
          styles.container,
          animatedStyle,
          hidden && {opacity: 0},
          style
        ]}
      >
        <View style={childrenStyle}>{children}</View>
      </Animated.View>
    </TouchableNativeFeedback>
  );
};

const styles = StyleSheet.create({
  container: {},
});

export {TouchableOpacity};
