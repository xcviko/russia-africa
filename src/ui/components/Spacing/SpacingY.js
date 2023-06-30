import React from 'react';
import {View} from 'react-native';
import {px} from "lib/features";

const SpacingY = ({size}) => {
  return (
    <View style={{width: '100%', height: px(size)}} />
  );
};

export {SpacingY};