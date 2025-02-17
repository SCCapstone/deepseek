const api = async (method, url, variables = null) => {
    const res = await fetch(process.env.REACT_APP_API_URL + url, {
        method: method,
        credentials: 'include',
        headers: (method === 'post' ? {'Content-Type': 'application/json'} : {}),
        body: (method === 'post' ? JSON.stringify(variables) : null),
    });
    if (res.ok) {
        const data = await res.json();
        return { data, error: null }
    }
    else {
        try {
            const data = await res.json();
            return { error: data.message, data: null }
        }
        catch (e) {
            return { error: res.statusText, data: null }
        }
    }
}

export default {
    get: (url) => api('get', url),
    post: (url, variables) => api('post', url, variables),
}