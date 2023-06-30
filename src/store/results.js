import {flow, getSnapshot, types} from "mobx-state-tree";
import {imagesAPI} from "api/imagesAPI";
import Success from "../assets/icons/Success.svg";
import {SpacingX} from "../ui/components/Spacing/SpacingX";
import {Caption} from "../ui/components/Typography/Caption";
import {$loader} from "./loader";
import {$media} from "./media";
import {$snackbar} from "./snackbar";
import {$user} from "./user";

const ImageModel = {
  id: types.string,
  uuid: types.string,
  price: types.string,
  author: types.string,
  authorInn: types.string,
  authorOrg: types.string,
  album: types.string,
  event: types.string
}

const AlbumModel = {
  id: types.string,
  photoTotal: types.number,
  nameRu: types.string,
  nameEn: types.string,
  thumbnail: types.string,
  photos: types.optional(types.maybeNull(types.array(types.model(ImageModel))), null)
}

const EventModel = {
  id: types.string,
  photoTotal: types.number,
  nameRu: types.string,
  nameEn: types.string,
  albums: types.optional(types.maybeNull(types.array(types.model(AlbumModel))), null)
}

export const $results = types
  .model({
    modalIndex: types.optional(types.number, -1),
    multipleSelect: types.optional(types.boolean, false),
    allImages: types.optional(types.maybeNull(types.array(types.model(ImageModel))), null),
    images: types.optional(types.maybeNull(types.frozen([])), null),
    events: types.optional(types.maybeNull(types.array(types.model(EventModel))), null),
    fullSizeImage: types.optional(types.frozen(), {}),
    pickedImages: types.array(types.string),
    isTipShown: types.optional(types.boolean, false)
  })
  .views(self => ({
    get getFullSizeImageIndex() {
      if (!self.fullSizeImage) {
        return -1;
      }

      for (let i = 0; i < self.allImages.length; i++) {
        if (self.allImages[i].id === self.fullSizeImage.id) {
          return i;
        }
      }
      return -1;
    },
    get getPickedImagesCount() {
      return self.pickedImages.length;
    },
    get getPickedImagesTotal() {
      let total = 0;
      self.allImages?.forEach(image => {
        if (self.pickedImages.includes(image.id)) {
          total = total + parseInt(image.price, 10);
        }
      });
      return total;
    },
    get getPickedImagesIds() {
      return self.pickedImages;
    },
    get getPickedImagesUuids() {
      let uuids = [];
      self.allImages?.forEach(image => {
        if (self.pickedImages.includes(image.id)) {
          uuids.push(image.uuid)
        }
      });
      return uuids;
    },
  }))
  .actions((self) => ({
    setModalIndex(value) {
      self.modalIndex = value;
    },
    setPickedImages(value) {
      self.pickedImages = value;
    },

    setAllImages(images) {
      const imagesData = [];

      images?.forEach(image => {
        imagesData.push({
          id: image.id.toString(),
          uuid: image.uuid,
          price: Math.floor(image.price).toString(),
          author: image.author ? image.author : "",
          authorOrg: image.authorOrg ? image.authorOrg : "",
          authorInn: image.authorInn ? image.authorInn : "",
          album: image.album ? image.album : "",
          event: image.event ? image.event : ""
        });
      });
      self.allImages = imagesData.length ? imagesData : null;
    },

    setImages(images) {
      self.images = images ? [...images] : null;
    },

    setEvents(events) {
      const eventsData = [];

      events?.forEach(event => {
        const albumsData = [];

        event.albums?.forEach(album => {
          const imagesData = [];

          album.photos?.forEach(photo => {
            imagesData.push({
              id: photo.id.toString(),
              uuid: photo.uuid,
              price: Math.floor(photo.price).toString(),
              author: photo.author ? photo.author : "",
              authorOrg: photo.authorOrg ? photo.authorOrg : "",
              authorInn: photo.authorInn ? photo.authorInn : "",
              album: photo.album ? photo.album : "",
              event: photo.event ? photo.event : ""
            });
          });

          albumsData.push({
            id: album.id.toString(),
            photoTotal: album.photoTotal,
            nameRu: album.nameRu,
            nameEn: album.nameEn,
            thumbnail: album.thumbnail,
            photos: imagesData.length ? imagesData : null
          });
        });

        eventsData.push({
          id: event.id.toString(),
          photoTotal: event.photoTotal,
          nameRu: event.nameRu,
          nameEn: event.nameEn,
          albums: albumsData.length ? albumsData : null
        });
      });

      self.events = eventsData.length ? eventsData : null;
    },

    togglePicked(id, toSet = false) {
      console.log('togglePicked called, id:', id)
      if (!toSet && self.pickedImages.includes(id)) {
        self.pickedImages = self.pickedImages.filter(el => el !== id);
      } else {
        self.pickedImages = [...self.pickedImages, id];
      }
    },
    setFullSize(id) {
      const image = self.allImages.find((image) => image.id === id);
      self.fullSizeImage = getSnapshot(image);
    },
    clearFullSize() {
      self.fullSizeImage = {};
    },
    setMultipleSelect(value, withoutSnackbar = false) {
      self.multipleSelect = !!value;

      if (!self.multipleSelect) {
        self.clearAllPicked(withoutSnackbar);
      }
    },
    setTipShown(value) {
      self.isTipShown = !!value;
    },

    clearAllPicked(withoutSnackbar = false) {
      self.pickedImages = [];
      if (!withoutSnackbar) {
        $snackbar.setActive(true, <><Success /><SpacingX size={9}/><Caption weight={2}>Корзина очищена</Caption></>);
      }
    },

    searchImages: flow(function* () {
      try {
        const data = yield imagesAPI.search_all($media.imagePath);
        const data_events = yield imagesAPI.search_events($media.imagePath, $user.token);

        setTimeout(() => {
          $results.setAllImages(data?.photos);
          $user.setId(data?.payer);

          $results.setEvents(data_events?.events);

          $loader.setLoader(false)
        }, 1000)
      } catch (error) {
        console.error(error);
      }
    })
  }))
  .create();
