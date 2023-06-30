import {types} from "mobx-state-tree";

export const $cart = types
  .model({
    isOpened: types.optional(types.boolean, false)
  })
  .actions((self) => ({
    setOpened(value) {
      self.isOpened = !!value;
    }
  }))
  .create();
