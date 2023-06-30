import {types, flow} from "mobx-state-tree";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const $splash = types
  .model({
    isSplashShown: types.optional(types.maybeNull(types.boolean), null),
  })
  .actions((self) => ({
    setSplashShown: flow(function* (value) {
      self.isSplashShown = !!value;
      // сохраняем значение в хранилище
      yield AsyncStorage.setItem('isSplashShown', JSON.stringify(self.isSplashShown));
    }),

    update: flow(function* () {
      const value = yield AsyncStorage.getItem('isSplashShown');
      if (value !== null) {
        self.setSplashShown(JSON.parse(value));
        return;
      }
      self.setSplashShown(false)
    })
  }))
  .create();
