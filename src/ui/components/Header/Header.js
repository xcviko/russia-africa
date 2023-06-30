import React from 'react';
import {StyleSheet, View} from 'react-native';
import {defaultPaddingX, px} from "lib/features";

const Header = ({
                  before,
                  title,
                  after,
                  titleCentered,
                  withHorizontalPadding,
                  style,
                  children,

                  ...restProps
}) => {
  const renderTitle = () => {
    return React.cloneElement(title, {
      style: [
        titleCentered && { textAlign: 'center' },
        title.props.style
      ]
    });
  };

  return (
    <View
      style={[
        withHorizontalPadding && styles.withHorizontalPadding,
        style
      ]}
      {...restProps}
    >
      {children}
      <View style={[styles.container]}>
        {before && <View>{before}</View>}
        <View style={[
          styles.title,
          titleCentered && styles.titleCentered
        ]}>
          {title && renderTitle()}
        </View>
        <View>{after}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  title: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCentered: {
    /*position: 'absolute',*/ // todo
    textAlign: 'center',
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: px(50)
  },
  withHorizontalPadding: {
    paddingHorizontal: defaultPaddingX
  }
});

export {Header};
