const URL = 'https://renderapi.cartender.co'
export const WORDPRESS_URL = 'https://studio.cartender.co/wp-json'

export const apiRoutes = {
    auth: '/users/authenticate',
    projects: '/projects',
    profile: '/client/profile',
}

export const wpRoutes = {
    auth: '/cartender/v1/auth',
    profile: '/wp/v1/users/me',
    dealership: '/acf/v3/dealership',
}

const headerPrefix = {
    'Content-Type': 'application/json',
}

export const post = async (path, body, header) => {
    const response = await fetch(`${URL}${path}`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            ...headerPrefix,
            ...header,
        },
    })

    return await response.json()
}

export const get = async (path, header) => {
    const response = await fetch(`${URL}${path}`, {
        method: 'GET',
        headers: {
            ...header,
        },
    })

    return await response.json()
}

export const api = async (url, method, body, headers) => {
    const response = await fetch(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
        headers: { ...headers, ...headerPrefix },
    })

    console.log(response)
    const json = await response.json()
    console.log(json)

    if (!response.ok) {
        throw new Error(json.message || 'Server error')
    }

    return json
}
