import { instance } from "./api";

export const checkoutAPI = {
  createOrder(photos, payerId, promocode) {
    const json = {
      "photos": photos,
      "payerId": payerId,
      "promo": promocode
    }
    const data = encodeURIComponent(JSON.stringify(json));

    return instance.get(`packs/create-mob?pack=${data}`)
      .then(response => {
        console.log('status:', response.status);
        switch (response.status) {
          case 204:
            return null;
          case 200:
            return response.data;
          default:
            throw new Error(`${response.status}`);
        }
      })
  }
}
