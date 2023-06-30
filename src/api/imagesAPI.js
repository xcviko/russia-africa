import { instance } from "./api";
import { response } from "./mocks/imagesMock";

export const imagesAPI = {
  search_all(photo) {
    const formData = new FormData();
    formData.append('photo', {
      uri: photo,
      type: 'image/*',
      name: 'photo.jpg'
    });

    // return new Promise((resolve, reject) => {
    //   setTimeout(() => {
    //     resolve(response);
    //   }, 1000);
    // });

    return instance.post(`search`, formData)
      .then(response => {
        console.log('status:', response.status);
        switch (response.status) {
          case 204:
            return null;
          case 200:
            return response.data;
          default:
            throw new Error(`Ошибка при отправке запроса, статус: ${response.status}`);
        }
      })
  },
  search_events(photo, token) {
    const formData = new FormData();
    formData.append('photo', {
      uri: photo,
      type: 'image/*',
      name: 'photo.jpg',
    });
    formData.append('userToken', token);

    return instance.post(`mb/search`, formData)
    .then(response => {
      console.log('status:', response.status);
      switch (response.status) {
        case 204:
          return null;
        case 200:
          return response.data;
        default:
          throw new Error(`Ошибка при отправке запроса, статус: ${response.status}`);
      }
    })
  }
}
