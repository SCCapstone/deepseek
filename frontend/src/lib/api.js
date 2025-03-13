const api = async (method, url, variables = null) => {
    const options = {
        method: method,
        credentials: 'include',
        headers: {},
    }

    // Add Content-Type header and body for methods that send data
    if (method === 'POST') {
        // if the data is already FormData, no need to convert to JSON
        if (variables instanceof FormData) {
            options.body = variables;
        }
        else {
            // if the data is a normal JS object, send the data as a JSON string
            options.body = JSON.stringify(variables);
            options.headers['Content-Type'] = 'application/json';
        }
    }
    
    try {
        // attempting to contact server
        const res = await fetch(import.meta.env.VITE_API_URL + url, options);
    
        let data;
        try {
            data = await res.json();
        } catch (err) {
            // returning an error if the response is not in valid JSON format
            return { error: 'Invalid response from server', data: null, message: null }; 
        }
        
        if (res.ok) {
            return { data: data?.data || null, message: data?.message, error: null };
        } else {
            if (res.status === 401) {
                window.location.href = '/login';
            }
            return { error: data?.message || 'An error occurred', data: null, message: null };
        }
    } catch (e) {
        return { error: 'Network or server error', data: null, message: null };
    }
    
}

export default {
    get: (url) => api('GET', url),
    post: (url, variables) => api('POST', url, variables),
}