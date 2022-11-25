import { Box, Button, Center, Code, FlatList, Heading, HStack, Input, Link, Spinner, Stack, StatusBar, Text, VStack } from 'native-base';
import React, { useReducer } from 'react';
import AnimeCard from '../components/AnimeCard';
import Anime, { AnimeInterface } from '../models/Anime';
import MyAnimeListApi from '../services/MyAnimeListApi';
import customTheme from '../theme';
import { markedsAnimesinitialState, markedsAnimesReducer } from '../reducers/markedsAnimes';
import { useGlobalReducer } from '../App';


const sleep = (timeout: number | undefined) => new Promise<void>(res => {
    setTimeout(() => {
        res();
    }, timeout);
});

//const cons = true;

const HomeTab = () => {
    const [ animes, setAnimes ] = React.useState<AnimeInterface[]>([]);
    const [ animeSearch, setAnimeSearch ] = React.useState<string>('');
    const [ currentSearch, setCurrentSearch ] = React.useState<string>('');
    const [ loading, setLoading ] = React.useState<boolean>(false);
    
    const {markedsAnimesState, markedsAnimesDispatch} = useGlobalReducer();

    const getAnimes = async () => {
        try{
            setLoading(true);
            const animeData = await MyAnimeListApi.httpGet("/v2/anime/ranking?ranking_type=bypopularity&limit=50&fields=popularity");
            const animesList = Anime.fromJson(animeData, markedsAnimesState);
            setAnimes(animesList);
            setLoading(false);
        }catch(e: any){
            console.log({ error: e.message });
        }
    }
    const searchAsync = async () => {
        if(animeSearch != currentSearch){
            console.log({ animeSearch, currentSearch })
            setCurrentSearch(animeSearch);
            if(!animeSearch || animeSearch == ''){
                getAnimes();
            }else{
                setLoading(true);
                const animeData = await MyAnimeListApi.httpGet(`/v2/anime?q=${animeSearch}&limit=50&fields=popularity`);
                console.log({ animeSearch });
                const animesList = Anime.orderByRelevance(Anime.fromJson(animeData, markedsAnimesState), animeSearch);
                setAnimes(animesList);
                setLoading(false);
            }
        }
        await sleep(500);
    }
    React.useEffect(() => {
        getAnimes();
    }, []);

    React.useEffect(() => {
        if(markedsAnimesState.forceReload){
            setCurrentSearch('');
            setAnimeSearch('');
            getAnimes();
            markedsAnimesDispatch({type: 'setReloaded'});
        }
    }, [markedsAnimesState.forceReload]);

    React.useEffect(() => {
        searchAsync();
    }, [animeSearch]);

    const markAnime = (anime: AnimeInterface) => {
        Anime.markAnime(anime, markedsAnimesDispatch, markedsAnimesState);
    }

    const unmarkAnime = (anime: AnimeInterface) => {
        Anime.unmarkAnime(anime, markedsAnimesDispatch, markedsAnimesState);
    }

    const renderAnimeCard = (item: AnimeInterface) => {
        return (
            <AnimeCard
            anime={item}
            bottomButtons={(
                <HStack space={2}  justifyContent="center">
                    <Button>Avaliar</Button>
                    {!Anime.isMarked(item, markedsAnimesState) ? (
                        <Button onPress={() => { markAnime(item) }}>Marcar</Button>
                    ) : (
                        <Button onPress={() => { unmarkAnime(item) }}>Desmarcar</Button>
                    )}
                </HStack>
            )}
            />
        )
    }
    return (
        <Stack
        _dark={{ bg: 'blueGray.900' }}
        _light={{ bg: 'blueGray.50' }}
        px={1.5}
        flex={1}>
            <Box w="full" _dark={{ bg: 'blueGray.900' }} px={1.5} mt="1" mb="1">
                <Input w="full" placeholder='Pesquisar Anime' value={animeSearch} onChangeText={(text) => setAnimeSearch(text)} />
            </Box>
            {!loading ? (
                <FlatList
                    data={animes}
                    numColumns={2}
                    renderItem={({ item }) => renderAnimeCard(item)}
                    keyExtractor={(item) => item.id}
                />
            ) : (
                    <Stack mt="2" alignItems="center">
                        <Spinner accessibilityLabel="Carregando animes" />
                        <Heading color="primary.500" fontSize="md">
                        Carregando...
                        </Heading>
                    </Stack>
            )}
      </Stack>
    )
}

export default HomeTab;