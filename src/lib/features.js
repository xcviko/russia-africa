import AsyncStorage from "@react-native-async-storage/async-storage";
import {Dimensions, LayoutAnimation} from 'react-native';

export const screenWidth = Dimensions.get('screen').width;
export const screenHeight = Dimensions.get('screen').height;

export const contentMaxWidth = screenWidth > 430 ? 430 : screenWidth;

// базовая высота макета
const defaultHeight = 812;

export const px = (value) => {
  /*return screenHeight * value / defaultHeight;*/
  return value;
}

export const defaultPaddingX = px(24);
export const defaultPaddingY = px(24);

export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Склонение числительных
 * @param number
 * @param titles [один, два, пять]
 * @param withCount
 */
export const wordCase = (number, titles, withCount = true) => {
  const cases = [2, 0, 1, 1, 1, 2];
  const label = titles[(number % 100 > 4 && number % 100 < 20)
    ? 2
    : cases[(number % 10 < 5) ? number % 10 : 5]];
  return withCount ? `${number} ${label}` : label;
};


export const isEmptyObj = (obj) => {
  return Object.keys(obj).length === 0;
}

export const configureAnimation = () => {
  LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
}

// Сохранить данные в localstorage
export const storeData = async (key, value) => {
  console.log('storeData', key, value)
  try {
    await AsyncStorage.setItem(key, value)
  } catch (e) {
    console.error(e);
  }
}

// Получить данные из localstorage
export const getStorageData = async (key) => {
  console.log('getStorageData', key)
  try {
    return await AsyncStorage.getItem(key);
  } catch(e) {
    console.error(e);
  }
}

// Удалить данные из localstorage
export const removeStoreData = async (key) => {
  console.log('removeStoreData', key)
  try {
    return await AsyncStorage.removeItem(key);
  } catch(e) {
    console.error(e);
  }
}