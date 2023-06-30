import React, {useEffect, useRef, useState} from 'react';
import {View, StyleSheet, Animated} from 'react-native';
import {TouchableOpacity} from '../TouchableOpacity/TouchableOpacity';
import {$snackbar} from 'store/snackbar';
import {observer} from "mobx-react-lite";
import {defaultPaddingX, px} from "lib/features";

import Cross from "assets/icons/Cross.svg";

const Snackbar = observer(() => {
  const hideTimeoutRef = useRef(null);
  const [snackbarHeight, setSnackbarHeight] = useState(100);
  const bottomAnim = useRef(new Animated.Value(-snackbarHeight)).current;

  const onLayout = (event) => {
    setSnackbarHeight(event.nativeEvent.layout.height);
  };

  useEffect(() => {
    if ($snackbar.isToggled) {
      show();
      return;
    }
    hide();
  }, [$snackbar.isToggled]);

  const show = () => {
    Animated.timing(bottomAnim, {
      toValue: defaultPaddingX,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
      if (!$snackbar.withoutHide) {
        hideTimeoutRef.current = setTimeout(hide, 5000);
      }
    });
  };

  const hide = () => {
    Animated.timing(bottomAnim, {
      toValue: -(snackbarHeight * 2),
      duration: 300,
      useNativeDriver: false,
    }).start();
    $snackbar.setActive(false);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        withRipple={false}
        style={styles.snackbar}
        onPress={hide}
      >
        <Animated.View
          onLayout={onLayout}
          style={[
            styles.content,
            {
              bottom: bottomAnim,
            },
          ]}
        >
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {$snackbar.content}
          </View>
          <Cross />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  snackbar: {
    width: '100%',
    paddingHorizontal: defaultPaddingX
  },
  content: {
    width: '100%',
    padding: px(13),
    backgroundColor: '#F2F3F7',
    borderRadius: px(12),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
});

export { Snackbar };
