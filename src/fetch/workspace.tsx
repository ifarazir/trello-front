import axios from "axios";

export async function FetchWorkspaceIndex(
    token: string
) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://213.130.144.85:1010/workspaces',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    // response.data.categories

    return axios(config)
        .then(response => {
            return response.data as Workspace[];
        })
        .catch(error => {
            console.error(error);
        });
}

export async function FetchWorkspaceSingle(
    token: string,
    id: string
) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://213.130.144.85:1010/workspaces/' + id,
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    // response.data.categories

    return axios(config)
        .then(response => {
            return response.data as Workspace;
        })
        .catch(error => {
            console.error(error);
        });
}

export async function FetchWorkspaceTasks(
    token: string,
    id: string
) {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://213.130.144.85:1010/workspaces/' + id + '/tasks',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        }
    };

    // response.data.categories

    return axios(config)
        .then(response => {
            return response.data as any;
        })
        .catch(error => {
            console.error(error);
        });
}


export async function FetchWorkspaceCreate(
    token: string,
    name: string,
    description: string,
    users: number[]
) {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://213.130.144.85:1010/workspaces',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Bearer ' + token
        },
        data: {
            name: name,
            description: description,
            users: users
        }
    };

    // response.data.categories

    return axios(config)
        .then(response => {
            return response.data.categories as Workspace[];
        })
        .catch(error => {
            console.error(error);
        });
}