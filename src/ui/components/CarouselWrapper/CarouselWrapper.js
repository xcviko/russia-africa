import React, {useRef, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import Carousel from "react-native-snap-carousel";
import {contentMaxWidth, defaultPaddingX} from "lib/features";
import {$loader} from "store/loader";
import {SCREEN_MAIN} from "lib/router";
import {useNavigation} from "@react-navigation/native";
import {Title} from "../Typography/Title";
import {SpacingY} from "../Spacing/SpacingY";
import {Subhead} from "../Typography/Subhead";
import {Button} from "../Buttons/Button";
import {SpacingX} from "../Spacing/SpacingX";

import QR from "assets/icons/QR.svg";
import {$user} from "store/user";

const carouselItems = [
  {
    title: <>
      <Text>Найди свой</Text>
      <Text>{'\n'}</Text>
      <Text>лучший кадр</Text>
      <Text>{'\n'}</Text>
      <Text>на мероприятии</Text>
    </>,
    button: 'Начать работу'
  },
  {
    title: <>
        <Text>Как работает</Text>
        <Text>{'\n'}</Text>
        <Text>приложение?</Text>
      </>,
    description: 'Наша платформа позволит вам найти ваши фотографии со всех прошедших  саммитов Россия-Африка',
    icon: <QR />,
    button: 'Сканировать фото'
  },
];
const CarouselWrapper = ({openTermsModal}) => {
    const carouselRef = useRef(null);
  const navigation = useNavigation();
  const [slideIndex, setSlideIndex] = useState(0);

  const handlePress = () => {
    if (slideIndex === 1) {
        if ($user.termsOfUseAccepted) {
            $loader.setLoader(true, true);
            setTimeout(() => navigation.navigate(SCREEN_MAIN));
            return;
        }
        openTermsModal()
    }
    carouselRef.current?.snapToNext();
  };

  return (
    <View style={styles.container}>
      <Carousel
        ref={carouselRef}
        data={carouselItems}
        renderItem={({item}) => (
          <View style={styles.slide}>
            <Title style={{
              fontSize: 40,
              textAlign: 'center'
            }} color={'light'}>
              {item.title}
            </Title>
            {item.description && (
              <>
                <SpacingY size={16} />
                <Subhead
                  style={{
                    opacity: 0.8,
                    textAlign: 'center'
                }}
                  color={'light'}
                  weight={2}>
                  {item.description}
                </Subhead>
              </>
            )}
            <SpacingY size={40} />
            <Button
              size={'l'}
              background={'green'}
              onPress={handlePress}
            >
              <View style={{flexDirection: 'row'}}>
                {item.icon && (
                  <><QR /><SpacingX size={10} /></>
                )}
                <Subhead weight={2} color={'light'}>
                  {item.button}
                </Subhead>
              </View>
            </Button>
          </View>
        )}
        sliderWidth={contentMaxWidth}
        itemWidth={contentMaxWidth}
        inactiveSlideScale={1}
        inactiveSlideOpacity={1}
        scrollEnabled={false}
        onSnapToItem={(index) => setSlideIndex(index)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
      flex: 1,
      alignItems: 'center'
  },
  slide: {
    flexGrow: 1,
    marginHorizontal: defaultPaddingX,
    justifyContent: 'flex-end'
  }
});

export {CarouselWrapper};