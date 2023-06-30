import { instance } from "./api";

export const notificationsAPI = {
  notify(token, value) {
    const formData = new FormData();
    formData.append('value', value);

    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(true);
    //   }, 1000);
    // });

    return instance.get(`notification/${token}?value=${value}`)
    .then(response => {
      switch (response.status) {
        case 405:
          return false;
        case 200:
          return true;
        default:
          console.log(`error: ${response.status}`);
      }
    })
  }
}
