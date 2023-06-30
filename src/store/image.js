import {types} from "mobx-state-tree";

export const $image = types
  .model({
    isViewMode: types.optional(types.boolean, false)
  })
  .actions((self) => ({
    setViewMode(value) {
      self.isViewMode = !!value;
    },

  }))
  .create();
