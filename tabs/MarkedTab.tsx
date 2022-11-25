import { AlertDialog, Button, Center, Code, FlatList, Heading, HStack, Link, StatusBar, Text, VStack } from 'native-base';
import React from 'react';
import { useGlobalReducer } from '../App';
import AnimeCard from '../components/AnimeCard';
import Anime, { AnimeInterface } from '../models/Anime';
import customTheme from '../theme';

const MarkedTab = () => {
    const { markedsAnimesState, markedsAnimesDispatch } = useGlobalReducer();
    const animes = markedsAnimesState?.markeds ? markedsAnimesState.markeds : [];

    const [isOpen, setIsOpen] = React.useState(false);
    const [currentAnime, setCurrentAnime] = React.useState<AnimeInterface|null>(null);

    const onClose = () => {
        setIsOpen(false)
        setCurrentAnime(null);
    };

    const cancelRef = React.useRef(null);

    const unmarkAnime = () => {
        if(currentAnime){
            Anime.unmarkAnime(currentAnime, markedsAnimesDispatch, markedsAnimesState, true);
        }
        onClose();
    }

    const renderAnimeCard = (item: AnimeInterface) => {
      return (
          <AnimeCard
            anime={item}
            bottomButtons={(
                <HStack space={2}  justifyContent="center">
                    <Button>Avaliar</Button>
                    <Button onPress={() => { showUnmark(item) }}>Desmarcar</Button>
                </HStack>
            )}
            />
        )
    }

    const showUnmark = (anime: AnimeInterface) => {
        setCurrentAnime(anime);
        setIsOpen(true);
    }

    const renderUnmarkDialog = () => {
        return (
            <AlertDialog leastDestructiveRef={cancelRef} isOpen={isOpen} onClose={onClose}>
                <AlertDialog.Content>
                <AlertDialog.CloseButton />
                <AlertDialog.Header>Tem certeza?</AlertDialog.Header>
                <AlertDialog.Body>
                    Isso não pode ser revertido, tem certeza de que deseja desmarcar o anime {`${currentAnime?.title}`} ?
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    <Button.Group space={2}>
                    <Button variant="unstyled" colorScheme="coolGray" onPress={onClose} ref={cancelRef}>
                        Não
                    </Button>
                    <Button colorScheme="danger" onPress={unmarkAnime}>
                        Sim
                    </Button>
                    </Button.Group>
                </AlertDialog.Footer>
                </AlertDialog.Content>
            </AlertDialog>
        )
    }

    return (
        <Center
        _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        px={1.5}
        flex={1}>

       <FlatList
            data={animes}
            numColumns={2}
            renderItem={({ item }) => renderAnimeCard(item)}
            keyExtractor={(item) => item.id}
        />
        {renderUnmarkDialog()}
      </Center>
    )
}

export default MarkedTab;