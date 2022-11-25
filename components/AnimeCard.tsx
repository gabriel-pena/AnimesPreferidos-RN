import { AspectRatio, Box, Center, Heading, Image, Stack } from 'native-base';
import React from 'react';
import { Dimensions } from 'react-native';
import { AnimeInterface } from '../models/Anime';


interface AnimeCardInterface {
  anime: AnimeInterface,
  bottomButtons: React.Component|Element,
}

const AnimeCard = ({ anime, bottomButtons } : AnimeCardInterface) => {
  const { title, main_picture } = anime;
  const width = Dimensions.get('window').width;
  return (
    <Box
      width={(width/2) - 18}
      margin={1.5}
      rounded="lg"
      overflow="hidden"
      borderColor="coolGray.200"
      borderWidth="1"
      _dark={{
        borderColor: "coolGray.600",
        backgroundColor: "gray.700",
      }}
      _web={{
        shadow: 2,
        borderWidth: 0,
      }}
      _light={{
        backgroundColor: "gray.50",
      }}
    >
      <Box>
        <AspectRatio w="100%" ratio={3 / 4}>
          <Image
            source={{
              uri: main_picture?.medium ? main_picture?.medium : '',
            }}
            alt="image"
          />
        </AspectRatio>
      </Box>
      <Stack p="4" space={3}>
        <Stack space={2}>
          <Heading numberOfLines={1} size="sm" ml="-1">
            {title}
          </Heading>
        </Stack>
        {bottomButtons}
      </Stack>
    </Box>
  );
};

export default AnimeCard; 