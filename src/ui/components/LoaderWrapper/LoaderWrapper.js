import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Loader} from "../Loader/Loader";
import {SpacingY} from "../Spacing/SpacingY";
import {Div} from "../Div/Div";
import {Title} from "../Typography/Title";

const LoaderWrapper = ({isTransparent = false, title = null, withoutBackground}) => {
  return (
    <View style={styles.container}>
      <View
        style={[
          styles.background,
          isTransparent && {opacity: 0.6},
          withoutBackground && {opacity: 0}
        ]}
      />
      <Loader />
      {title && (
        <>
          <SpacingY size={10} />
          <Div>
            <Title
              style={{textAlign: 'center'}}
              withShadow
              color={'light'}
              level={2}
            >{title}</Title>
          </Div>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    /*pointerEvents: 'none',*/
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    backgroundColor: '#1E1E1E'
  }
});

export {LoaderWrapper};
