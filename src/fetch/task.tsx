import axios from "axios";

export async function FetchTaskCreate(token: string, values: any) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://213.130.144.85:1010/workspaces/' + values.workspace_id + '/tasks',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        data: values
    };

    // response.data.categories

    return axios(config)
        .then(response => {
            return response.data.categories as Task[];
        })
        .catch(error => {
            console.error(error);
        });
}