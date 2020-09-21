const URL = 'https://renderapi.cartender.co'
export const WORDPRESS_AUTH =
    'https://studio.cartender.co/wp-json/cartender/v1/auth'

const headerPrefix = {
    'Content-Type': 'application/json',
}

export const api = {
    auth: '/users/authenticate',
    projects: '/projects',
    profile: '/client/profile',
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

export const request = async (url, config) => {
    const response = await fetch(url, config)

    return await response.json()
}
