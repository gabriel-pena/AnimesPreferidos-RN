import axios from 'axios';

class MyAnimeListApi{
    static clientId = process.env.API_KEY;
    static baseUrl = "https://api.myanimelist.net";

    static async httpGet(route: String){
        try {
            const res = await axios.get(`${this.baseUrl}${route}`, {
                headers: {
                    "X-MAL-CLIENT-ID": `${this.clientId}`,
                },
            });
            const jsonContent = res.data;
            if(jsonContent.data){
                return jsonContent.data;
            }
            throw new Error("Falha ao decodificar")
        }catch(e: any) {
            throw new Error(e.message);
        };
    }
}

export default MyAnimeListApi;