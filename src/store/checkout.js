import {useNavigation} from "@react-navigation/native";
import {flow, types} from "mobx-state-tree";
import {checkoutAPI} from "api/checkoutAPI";
import {SCREEN_CHECKOUT} from "../lib/router";
import {$user} from "./user";
import {$results} from "./results";
import {$loader} from "./loader";
import {Linking} from "react-native";
import {mobilePaymentUrl, packUrl} from "api/api";
import {$promocode} from "./promocode";

const OrderInfoModel = types.model({
  id: types.string,
  uuid: types.string,
  total: types.number
});

export const $checkout = types
  .model({
    isOpened: types.optional(types.boolean, false),
    email: types.optional(types.string, ''),
    orderInfo: types.optional(OrderInfoModel, {
      id: '',
      uuid: '',
      total: 0
    })
  })
  .actions((self) => ({
    setOpened(value) {
      self.isOpened = !!value;
    },
    setEmail(value) {
      self.email = value;
    },
    setOrderInfo(pack) {
      self.orderInfo = {
        ...self.orderInfo,
        id: pack.id.toString(),
        uuid: pack.uuid,
        total: pack.total || 0
      };
    },
    paymentRedirect(navigation) {
      if (!self.orderInfo.total) {
        // Linking.openURL(mobilePaymentUrl(self.orderInfo.id, self.email));
        navigation.navigate(SCREEN_CHECKOUT, {uri: mobilePaymentUrl(self.orderInfo.id, self.email)})
        return;
      }
      // Linking.openURL(packUrl(self.orderInfo.uuid));
      navigation.navigate(SCREEN_CHECKOUT, {uri: packUrl(self.orderInfo.uuid)})
    },


    createOrder: flow(function* (navigation) {
      try {
        $loader.setLoader(true, true);

        const data = yield checkoutAPI.createOrder($results.getPickedImagesIds, $user.id, $promocode.value);
        self.setOrderInfo(data.pack);
        self.paymentRedirect(navigation);

        $loader.setLoader(false);
      } catch (error) {
        console.error(error);
      }
    })
  }))
  .create();
