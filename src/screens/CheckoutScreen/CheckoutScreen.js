import {useNavigation, useRoute} from "@react-navigation/native";
import React, {useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import WebView from "react-native-webview";
import ArrowLeft from "../../assets/icons/ArrowLeft.svg";
import {defaultPaddingY, px} from "../../lib/features";
import {SCREEN_RESULTS} from "../../lib/router";
import {RoundedButton} from "../../ui/components/Buttons/RoundedButton";
import {Div} from "../../ui/components/Div/Div";
import {Header} from "../../ui/components/Header/Header";
import {SpacingY} from "../../ui/components/Spacing/SpacingY";

import { URL } from 'react-native-url-polyfill';

function parseURL(url) {
  const parsedURL = new URL(url);

  return {
    protocolName: parsedURL.protocol,
    hostname: parsedURL.hostname,
    pathname: parsedURL.pathname,
    search: parsedURL.search,
    hash: parsedURL.hash,
  };
}

function parseSearch(search) {
  const params = {};

  // Удаляем символ "?" из строки параметров
  const searchWithoutQuestionMark = search.replace('?', '');

  // Разделяем строку параметров на массив параметров
  const paramArray = searchWithoutQuestionMark.split('&');

  // Разделяем каждый параметр на ключ и значение
  paramArray.forEach(param => {
    const [key, value] = param.split('=');
    params[key] = value;
  });

  return params;
}

const CheckoutScreen = () => {
  // states:
  // refs:
  // effects:
  // constants (other hooks, etc.):
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {uri} = route.params;

  // functions:

  return (
    <View style={styles.container}>
      <View style={[
        styles.contentWrapper,
        {paddingTop: insets.top + defaultPaddingY, paddingBottom: insets.bottom}
      ]}>
        <Div>
          <Header
            before={
              <View>
                <RoundedButton
                  background={'transparent'}
                  onPress={() => navigation.navigate(SCREEN_RESULTS)}
                >
                  <ArrowLeft />
                </RoundedButton>
              </View>
            }
          />
        </Div>
        <SpacingY size={defaultPaddingY} />
        <WebView
          style={styles.content}
          source={{uri: uri}}
          onNavigationStateChange={(navState) => {
            const hostnameBlacklist = ['m.vk.com', 't.me', 'instagram.com', 'api.whatsapp.com'];

            const parsedURL = parseURL(navState.url);

            const protocolName = parsedURL.protocolName;
            const hostname = parsedURL.hostname;
            const pathname = parsedURL.pathname;
            const search = parseSearch(parsedURL.search);
            const hash = parsedURL.hash;

            if (hostnameBlacklist.includes(hostname)) {
              return false;
            }

            if (pathname === '/pack' && search.id) {
              navigation.navigate(SCREEN_RESULTS, {toOpenCheckoutSuccessModal: Math.floor(Math.random() * 10000000000)})
            }

            console.log('protocolName:', protocolName)
            console.log('hostname:', hostname)
            console.log('pathname:', pathname)
            console.log('search:', search)
            console.log('hash:', hash)
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgb(246,250,255)'
  },
  contentWrapper: {
    flex: 1
  },
  content: {
    borderRadius: px(24)
  }
});

export {CheckoutScreen};