import React, {useCallback} from 'react';
import {StyleSheet} from 'react-native';
import {contentMaxWidth, defaultPaddingX, px, screenWidth} from "lib/features";
import BottomSheet, {BottomSheetBackdrop, BottomSheetScrollView} from "@gorhom/bottom-sheet";

const ModalWrapper = ({
                        children,
                        containerStyle,
                        contentStyle,
                        header,
                        modalRef,
                        index = -1,
                        backdropAppearIndex = 0,
                        backdropDisappearIndex = -1,
                        pressBehavior = 'close',
                        withScroll = false,

                        ...restProps
}) => {
  const backdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        opacity={0.6}
        appearsOnIndex={backdropAppearIndex}
        disappearsOnIndex={backdropDisappearIndex}
        pressBehavior={pressBehavior}
      />
    ),
    []
  );

  return (
    <BottomSheet
      ref={modalRef}
      style={{alignItems: 'center'}}
      handleStyle={styles.handle}
      handleIndicatorStyle={styles.indicator}
      backgroundStyle={[
        styles.container,
        containerStyle
      ]}
      backdropComponent={backdrop}
      index={index}
      {...restProps}
    >
      <BottomSheetScrollView
        scrollEnabled={withScroll}
        contentContainerStyle={contentStyle}
        style={styles.content}
      >
        {children}
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  modal: {},
  handle: {
    height: px(defaultPaddingX) + 10,
    width: '100%',
    position: 'absolute',
    top: -10,
    justifyContent: 'center',
  },
  indicator: {
    /*backgroundColor: '#fff',
    opacity: 0.6,
    top: -18,*/
    opacity: 0
  },
  container: {
    backgroundColor: 'transparent',
  },
  content: {
    width: contentMaxWidth,
    marginHorizontal: screenWidth === contentMaxWidth ? 0 : (screenWidth - contentMaxWidth) / 2,
    backgroundColor: '#FFF',
    borderTopLeftRadius: px(24),
    borderTopRightRadius: px(24),
    borderBottomLeftRadius: px(0),
    borderBottomRightRadius: px(0),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 5,
  }
});

export {ModalWrapper};
