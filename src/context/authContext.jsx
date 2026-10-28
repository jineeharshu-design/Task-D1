
import { createContext, useContext, useEffect, useState } from 'react'

const AuthContext = createContext(null)

const API_URL = import.meta.env.VITE_API_URL;

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function checkLogin() {
            const token = localStorage.getItem('token')

            if (!token) {
                setUser(null)
                setLoading(false)
                return
            }

            try {
                const response = await fetch(`${API_URL}/api/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })

                if (!response.ok) {
                    localStorage.removeItem('token')
                    setUser(null)
                    return
                }

                const data = await response.json()
                setUser(data.user)
            } catch (error) {
                console.error('Error checking login:', error)
                setUser(null)
            } finally {
                setLoading(false)
            }
        }

        checkLogin()
    }, [])

    async function login(email, password) {
        const response = await fetch(`${API_URL}/api/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Login failed.')
        }

        localStorage.setItem('token', data.token)
        setUser(data.user)

        return data.user
    }

    async function register(name, email, password) {
        const response = await fetch(`${API_URL}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        })

        const data = await response.json()

        if (!response.ok) {
            throw new Error(data.message || 'Registration failed.')
        }

        return data.user
    }

    async function logout() {
        localStorage.removeItem('token')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    return useContext(AuthContext)
}
