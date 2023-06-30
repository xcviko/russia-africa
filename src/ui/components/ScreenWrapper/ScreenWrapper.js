import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {defaultPaddingX} from "lib/features";
import {$loader} from "store/loader";
import {observer} from "mobx-react-lite";
import {CheckoutModal} from "modals/CheckoutModal";
import {ResultsModal} from "modals/ResultsModal";
import {ResultsBottomModal} from "modals/ResultsBottomModal";
import {CartModal} from "modals/CartModal";
import {PromocodeModal} from "modals/PromocodeModal";
import {LoaderWrapper} from "../LoaderWrapper/LoaderWrapper";
import {Snackbar} from "../Snackbar/Snackbar";

const ScreenWrapper = observer(({
                                  children,
                                  outOfSafeArea,
                                  modals,
                                  background,
                                  withHorizontalPadding = true,
                                  withPaddingTop = true,
                                  withTabbar = true,
                                  withModals = true,
                                  style,
                                  ...restProps
                                }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.content,
          withHorizontalPadding && styles.withHorizontalPadding,
          withPaddingTop && {paddingTop: insets.top},
          style
        ]}
        {...restProps}
      >
        {children}
        {withModals && (
          <>
            {modals}
            <ResultsModal />
            <ResultsBottomModal />
            <CartModal />
            <PromocodeModal />
            <CheckoutModal />
          </>
        )}
      </View>
      {outOfSafeArea}

      {$loader.isToggled && (
        <LoaderWrapper
          isTransparent={$loader.isTransparent}
          withoutBackground={$loader.withoutBackground}
          title={$loader.title}
        />
      )}

      <Snackbar />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    backgroundColor: '#FFF'
  },
  withHorizontalPadding: {
    paddingHorizontal: defaultPaddingX,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  }
});

export {ScreenWrapper};
