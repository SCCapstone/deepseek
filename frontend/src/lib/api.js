export async function loginUser(username, password) {
    const res = await fetch(process.env.REACT_APP_API_URL + '/login', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    if (res.ok) {
        const data = await res.json();
        return { error: null, user: data.user }
    }
    else {
        return { error: 'Could not authenticate user', user: null }
    }
}

export async function registerUser(email, username, password) {
    const res = await fetch(process.env.REACT_APP_API_URL + '/register', {
        method: 'POST',
        mode: 'cors',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password, email }),
    });

    if (res.ok) {
        const data = await res.json();
        return { error: null, user: data.user }
    }
    else {
        return { error: 'Could not authenticate user', user: null }
    }
}

export async function getProfile() {
    const res = await fetch(process.env.REACT_APP_API_URL + '/myprofile', {
        credentials: 'include',
    });

    if (res.ok) {
        const data = await res.json();
        return { error: null, user: data.user }
    }
    else {
        return { error: 'Could not fetch profile', data: null }
    }
}