import { instance } from "./api";
import { response } from "./mocks/promocodeMock";

export const promocodeAPI = {
  checkPromo(promocode) {

    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(response);
    //   }, 1000);
    // });

    return instance.get(`promo/check?promo=${promocode}`)
      .then(response => {
        const responseWithWarning = (warning) => ({
          'status': response.status,
          'warning': warning,
          'data': response.data
        });

        switch (response.status) {
          case 204:
            return responseWithWarning('Промо-код не существует');
          case 226:
            return responseWithWarning('Промо-код уже использован');
          case 403:
            return responseWithWarning('Промо-код истёк');
          case 200:
            return responseWithWarning('Промо-код успешно применён');
          default:
            throw new Error(`asdasdsdsad${response.status}`);
        }
      })
  }
}
