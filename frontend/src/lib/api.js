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
        const res = await fetch(import.meta.env.VITE_API_URL + url, options);
    
        let data;
        try {
            data = await res.json();
        } catch (err) {
            return { error: 'Invalid response from server', data: null, message: null }; // Ensure we return an empty array if no data
        }
        
        if (res.ok) {
            return { data: data?.data || null, message: data?.message, error: null }; // Return empty array on error
        } else {
            return { error: data?.message || 'An error occurred', data: null, message: null };
        }
    } catch (e) {
        return { error: 'Network or server error', data: null, message: null }; // Return empty array on network error
    }
    
}

export default {
    get: (url) => api('GET', url),
    post: (url, variables) => api('POST', url, variables),
    patch: (url, variables) => api('PATCH', url, variables),
    delete: (url) => api('DELETE', url),
}