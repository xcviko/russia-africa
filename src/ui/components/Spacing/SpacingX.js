import React from 'react';
import {View} from 'react-native';
import {px} from "lib/features";

const SpacingX = ({size}) => {
  return (
    <View style={{width: px(size)}} />
  );
};

export {SpacingX};