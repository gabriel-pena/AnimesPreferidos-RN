import AsyncStorage from '@react-native-async-storage/async-storage';

export interface AnimePictureInterface{
    medium: string|null;
    large: string|null;
}

export interface AnimeInterface {
    id: number;
    title: string;
    popularity: number|null;
    main_picture: AnimePictureInterface|null;
}


class Anime{
    static fromJson(animesJson: any, markedsAnimesState:any = null) : AnimeInterface[]{
        let animes = animesJson.map((animeJs: any) => {
            const anime: AnimeInterface = {
                id: animeJs.node.id,
                title: animeJs.node.title,
                main_picture: {
                    medium: animeJs.node.main_picture?.medium,
                    large: animeJs.node.main_picture?.large,
                },
                popularity: animeJs.node?.popularity,
            };
            return anime;
        });
        if(markedsAnimesState && markedsAnimesState.markeds){
            animes = animes.filter((anime: AnimeInterface) => {
                return markedsAnimesState.markeds.find((animeFind: AnimeInterface) => anime.id == animeFind.id ) ? false : true;
            });
        }
        return animes;
    }
    static orderByRelevance(animes: AnimeInterface[], searchString: string) : AnimeInterface[]{
        let newAnimes = [...animes];
        console.log([ newAnimes[0], newAnimes[1] ])
        
        newAnimes.sort((a,b) => {
            const aPop = a.popularity ? a.popularity : 0;
            const bPop = b.popularity ? b.popularity : 0;
            return aPop - bPop;
        });
        if(searchString){
            newAnimes.sort((a,b) => {
               const hasSearchA = a.title.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 ? 1 : 0;
               const hasSearchB = b.title.toLowerCase().indexOf(searchString.toLowerCase()) >= 0 ? 1 : 0;
               return hasSearchB - hasSearchA;
            });
        }
        return newAnimes;
    }
    static toJson(animes: AnimeInterface[]) : any[] {
        return animes.map((anime: AnimeInterface) => {
            return {
                ...anime,
            }
        });
    }
    static async markAnime(anime: AnimeInterface, dispatch: any, markedsAnimesState: any) {
        let markedsAnimes = [];
        //console.log({ markedsAnimesState });
        if(!markedsAnimesState.loaded){
            const markedsAnimesJson = await AsyncStorage.getItem('markedsAnimes');
            markedsAnimes = markedsAnimesJson ? JSON.parse(markedsAnimesJson) : [];
        }else{
            //console.log("carregado");
            markedsAnimes = [...markedsAnimesState.markeds];
        }
        markedsAnimes.push(anime);
        dispatch({ type: 'updateAll', value: markedsAnimes});
        await AsyncStorage.setItem('markedsAnimes', JSON.stringify(markedsAnimes));
    }
    static async unmarkAnime(anime: AnimeInterface, dispatch: any, markedsAnimesState: any, forceReload = false) {
        let markedsAnimes = [];
        if(!markedsAnimesState.loaded){
            const markedsAnimesJson = await AsyncStorage.getItem('markedsAnimes');
            markedsAnimes = markedsAnimesJson ? JSON.parse(markedsAnimesJson) : [];
        }else{
            markedsAnimes = [...markedsAnimesState.markeds];
        }
        const newMarkedsAnimes = markedsAnimes.filter((mAni: AnimeInterface) => mAni.id != anime.id);
        dispatch({ type: 'updateAll', value: newMarkedsAnimes, forceReload});
        await AsyncStorage.setItem('markedsAnimes', JSON.stringify(newMarkedsAnimes));
    }
    static async getMarkedsAnimes(dispatch: any) {
        const markedsAnimesJson = await AsyncStorage.getItem('markedsAnimes');
        const markedsAnimes = markedsAnimesJson ? JSON.parse(markedsAnimesJson) : [];
        dispatch({ type: 'updateAll', value: markedsAnimes});
    }
    static isMarked(anime: AnimeInterface, markedsAnimesState: any){
        return markedsAnimesState.markeds.find((mAni: any) => mAni.id == anime.id) ? true : false;
    }
}

export default Anime;