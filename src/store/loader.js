import {types} from "mobx-state-tree";

export const $loader = types
  .model({
    isToggled: types.optional(types.boolean, false),
    isTransparent: types.optional(types.boolean, false),
    title: types.optional(types.string, ''),
    withoutBackground: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setLoader(value, isTransparent = false, title = '', withoutBackground = false) {
      self.isToggled = !!value;
      self.isTransparent = !!isTransparent;
      self.title = title;
      self.withoutBackground = !!withoutBackground;
    }
  }))
  .create();
