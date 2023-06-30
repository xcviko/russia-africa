import {types} from "mobx-state-tree";

export const $snackbar = types
  .model({
    isToggled: types.optional(types.boolean, false),
    content: types.optional(types.frozen(), <></>),
    withoutHide: types.optional(types.boolean, false),
  })
  .actions((self) => ({
    setActive(isToggled, content = null, withoutHide = false) {
      if (self.isToggled) {
        self.isToggled = false;

        if (isToggled) {
          setTimeout(() => {
            $snackbar.setToggled(true);
            $snackbar.setContent(content);
            $snackbar.setWithoutHide(withoutHide);
          }, 650);
        }
      } else {
        self.isToggled = isToggled;
        self.content = content;
        self.withoutHide = withoutHide;
      }
    },
    setToggled(value) {
      self.isToggled = !!value;
    },
    setContent(value) {
      self.content = value;
    },
    setWithoutHide(value) {
      self.withoutHide = value;
    },
  }))
  .create();
