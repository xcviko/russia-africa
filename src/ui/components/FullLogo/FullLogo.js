import React from 'react';
import {View, StyleSheet, Image} from 'react-native';
import {px} from "lib/features";
import {SpacingX} from "../Spacing/SpacingX";
import {Caption} from "../Typography/Caption";
import {Subhead} from "../Typography/Subhead";

const FullLogo = ({}) => {

  return (
    <View style={{flexDirection: 'row', alignItems: 'center'}}>
      <Image
        style={{
          width: px(230),
          height: px(15),
        }}
        source={require('assets/images/FullLogo.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {}
});

export {FullLogo};