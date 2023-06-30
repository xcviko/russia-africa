import {flow, types} from "mobx-state-tree";
import {promocodeAPI} from "api/promocodeAPI";
import {$loader} from "./loader";

export const $promocode = types
  .model({
    isOpened: types.optional(types.boolean, false),
    isApplied: types.optional(types.boolean, false),
    value: types.optional(types.string, ''),
    discountType: types.optional(types.string, ''),
    discountValue: types.optional(types.string, ''),

    warningMessage: types.optional(types.string, '')
  })
  .views((self) => ({
    get getDiscountValueWithType() {
      switch (self.discountType) {
        case 'percent': {
          return `${self.discountValue}%`;
        }
        case 'price': {
          return `${self.discountValue} ₽`;
        }
        default: {
          return self.discountType;
        }
      }
    }
  }))
  .actions((self) => ({
    setOpened(value) {
      self.isOpened = !!value;
    },
    setPromocode(isApplied, value = '', discountType = '', discountValue = '') {
      self.isApplied = !!isApplied;
      self.value = value;
      self.discountType = discountType;
      self.discountValue = discountValue;
    },

    setWarningMessage(value) {
      self.warningMessage = value;
    },

    getPriceWithDiscount(value) {
      switch (self.discountType) {
        case 'percent': {
          const total = Number(value) - Number(value) * (self.discountValue / 100);
          return parseFloat(total.toFixed(1));
        }
        case 'price': {
          const total = Number(value) - self.discountValue;
          return total > 0 ? parseFloat(total.toFixed(1)) : 0;
        }
        default: {
          return Number(value);
        }
      }
    },

    checkPromo: flow(function* (promocode) {
      try {
        $loader.setLoader(true, true);
        const response = yield promocodeAPI.checkPromo(promocode);

        if (response.status === 200) {
          $promocode.setPromocode(true, promocode, response.data.type, response.data.value);
        } else {
          $promocode.setPromocode(false);
        }

        $promocode.setWarningMessage(response.warning);
        $loader.setLoader(false);
      } catch (error) {
        console.error(error);
        $loader.setLoader(false);
      }
    })
  }))
  .create();
