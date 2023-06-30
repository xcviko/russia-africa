import {flow, types} from "mobx-state-tree";
import {imagesAPI} from "../api/imagesAPI";
import {notificationsAPI} from "../api/notifyAPI";
import Success from "../assets/icons/Success.svg";
import {SpacingX} from "../ui/components/Spacing/SpacingX";
import {Caption} from "../ui/components/Typography/Caption";
import {$loader} from "./loader";
import {$media} from "./media";
import {$snackbar} from "./snackbar";

export const $user = types
  .model({
    id: types.optional(types.string, ''),
    termsOfUseAccepted: types.optional(types.boolean, false),
    token: types.optional(types.string, '')
  })
  .actions((self) => ({
    setId(value) {
      self.id = value;
    },
    setTermsOfUseAccepted() {
      self.termsOfUseAccepted = true;
    },
    setToken(token) {
      self.token = token;
    },
    toggleNotifications: flow(function* (value) {
      try {
        const response = yield notificationsAPI.notify($user.token, value);

        return response;
      } catch (error) {
        console.error(error);
      }
    })
  }))
  .create();
