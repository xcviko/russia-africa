import React from 'react';
import {View, StyleSheet} from 'react-native';
import {defaultPaddingX, screenWidth} from "lib/features";

import Silhouette from "assets/icons/Silhouette.svg";

const CameraCorners = ({cameraWidth, cameraHeight}) => {
  return (
   <View style={[
     styles.container,
     {paddingHorizontal: cameraWidth > screenWidth ? (cameraWidth - screenWidth) / 2 + defaultPaddingX : cameraWidth * 0.08},
     {opacity: cameraWidth && cameraHeight ? 1 : 0},
     {height: cameraHeight},
     {width: cameraWidth}
   ]}>
     <View style={styles.content}>
       <Silhouette />
     </View>
   </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    aspectRatio: 3 / 4,
    justifyContent: 'center'
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    aspectRatio: 1
  },
});

export {CameraCorners};