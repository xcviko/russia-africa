import {flow, types} from "mobx-state-tree";
import {$loader} from "./loader";

import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';
import * as Notifications from 'expo-notifications';

import Success from 'assets/icons/Success.svg';
import {$snackbar} from "./snackbar";
import {SpacingX} from "ui/components/Spacing/SpacingX";
import {Caption} from "ui/components/Typography/Caption";


export const $media = types
  .model({
    imagePath: types.optional(types.string, ''),
  })
  .actions((self) => ({
    setImagePath(path) {
      self.imagePath = path;
    },

    sendNotification: flow(function* (title, description) {
      console.log('sendNotification called')
      const hasPermission = yield self.requestNotificationsPermission();

      if (hasPermission) {
        yield Notifications.scheduleNotificationAsync({
          content: {
            title,
            body: description,
          },
          trigger: null,
        });

        console.log('sendNotification yielded');
      } else {
        console.error('Notification permission not granted');
      }
    }),

    requestMediaLibraryPermission: flow(function* () {
      const { status } = yield MediaLibrary.requestPermissionsAsync();
      return status === 'granted';
    }),

    requestNotificationsPermission: flow(function* () {
      const { status } = yield Notifications.requestPermissionsAsync();
      return status === 'granted';
    }),

    getOrCreateAlbumAsync: flow(function* (albumName, asset) {
      const { status } = yield MediaLibrary.getPermissionsAsync();

      if (status !== 'granted') {
        yield MediaLibrary.requestPermissionsAsync();
      }

      let album = yield MediaLibrary.getAlbumAsync(albumName);

      if (!album) {
        album = yield MediaLibrary.createAlbumAsync(albumName, asset, false);
      }

      return album;
    }),

    downloadFilesAndSaveToGallery: flow(function* (fileUrls) {
      $loader.setLoader(true, true, 'Загрузка фото...');
      try {
        for (const fileUrl of fileUrls) {
          const fileName = fileUrl.split('/').pop();
          const fileUri = FileSystem.documentDirectory + fileName;

          const { status, uri } = yield FileSystem.downloadAsync(fileUrl, fileUri);

          if (status === 200) {
            console.log('File saved to', uri);

            // Запрос разрешения на доступ к медиатеке устройства
            const hasPermission = yield self.requestMediaLibraryPermission();

            if (hasPermission) {
              // Ассет для файла
              const asset = yield MediaLibrary.createAssetAsync(uri);

              // Получение или создание альбома с передачей ассета
              const album = yield self.getOrCreateAlbumAsync('Facebank', asset);

              // Сохранение файла в альбом
              yield MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
              console.log('File saved to gallery in "Facebank" album');

              setTimeout(() => $snackbar.setActive(true, <><Success /><SpacingX size={9}/><Caption weight={2}>{fileUrls.length > 1 ? 'Фотографии скачаны' : 'Фотография скачана'}</Caption></>));
              /*self.sendNotification('Фотография скачана', 'Фотография успешно скачана и сохранена в галерее')*/
            } else {
              console.error('Media library permission not granted');
            }
          } else {
            console.error('Failed to download file:', status);
          }
        }
      } catch (error) {
        console.error(error);
      }
      finally {
        $loader.setLoader(false);
      }
    })
  }))
  .create();
