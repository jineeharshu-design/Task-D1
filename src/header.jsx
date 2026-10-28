import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from './context/authContext.jsx'

function Header() {
    let [search, setsearch] =useState("")
    const { user, loading, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogout() {
    try {
        await logout()
        navigate('/login')
    } catch (error) {
        console.error('Logout failed:', error)
        alert('Unable to log out. Please try again.')
    } }
    
    function handlechange(event){
        let value = event.target.value;
        setsearch(value)
    }
    return (
        <header className="mx-4 mt-4 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4">

            <Link
                to="/"
                className="text-3xl font-bold text-[#800000]"
            >
                DEV@Deakin
            </Link>

            <div className="flex flex-wrap items-center gap-4">

            <input  
                type="text" 
                placeholder='Search' 
                value={search} 
                onChange={handlechange}
            />

            <Link
                to="/post"
                className="rounded-xl bg-[#800000] px-5 py-3 text-lg text-white hover:bg-[#600000]"
            >
                Post
            </Link>

            {!loading && (
                user ? (
                    <>
                        <span>
                            Hi, {user.name}
                        </span>

                        <button
                            type="button"
                            onClick={handleLogout}
                            className="rounded-xl bg-[#800000] px-5 py-3 text-lg text-white hover:bg-[#600000]"
                        >
                            Logout
                        </button>

                        <Link 
                            to="/pricing"
                            className="rounded-xl bg-[#800000] px-5 py-3 text-lg text-white hover:bg-[#600000]"
                        >
                            Pricing
                        </Link>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="rounded-xl bg-[#800000] px-5 py-3 text-lg text-white hover:bg-[#600000]"
                        >
                            Login
                        </Link>
                    </>
                )
            )}
        </div> </div>
        </header>
    )
}

export default Header


