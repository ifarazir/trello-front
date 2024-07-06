import axios from "axios";

export async function FetchUserIndex(
    token: string
) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://213.130.144.85:1010/users',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    // response.data.categories

    return axios(config)
        .then(response => {
            return response.data as User[];
        })
        .catch(error => {
            console.error(error);
        });
}