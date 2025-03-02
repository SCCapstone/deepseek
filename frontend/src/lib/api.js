const api = async (method, url, variables = null) => {
    const options = {
        method: method.toUpperCase(),
        credentials: 'include',
        headers: {},
    }

    // Add Content-Type header and body for methods that send data
    if (['POST', 'PATCH', 'PUT'].includes(options.method) && variables) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify(variables);
    }

    try {
        const res = await fetch(process.env.REACT_APP_API_URL + url, options);
        const data = await res.json();
        
        if (res.ok) {
            return {
                data: data.data || null, // Ensure we return an empty array if no data
                message: data.message,
                error: null 
            }
        } else {
            return { 
                error: data.message || 'An error occurred', 
                data: null, // Return empty array on error
                message: null
            }
        }
    } catch (e) {
        return { 
            error: 'Network or server error',
            data: null, // Return empty array on network error
            message: null
        }
    }
}

export default {
    get: (url) => api('GET', url),
    post: (url, variables) => api('POST', url, variables),
    patch: (url, variables) => api('PATCH', url, variables),
    delete: (url) => api('DELETE', url),
}