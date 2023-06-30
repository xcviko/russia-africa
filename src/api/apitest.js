import axios from "axios";

const createPayment = () => {
  let json = {
    photos: [95777, 95778],
    payerId: '24701'
  };
  const data = encodeURIComponent(JSON.stringify(json))

  axios
    .post("https://facebank.store/api/packs/create", data)
    .then((response) => {
      console.log("status:", response.status);
      switch (response.status) {
        case 204:
          return null;
        case 200:
          console.log("data:", response.data);
          return response.data;
        default:
          throw new Error(`${response.status}`);
      }
    })
    .catch((error) => {
      console.error(error);
    });
};
/*createPayment();*/
