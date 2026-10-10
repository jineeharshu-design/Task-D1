import { Link } from 'react-router-dom'
import { useState } from 'react'

function Header() {
    let [search, setsearch] =useState("")
    
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

            <input  type="text" placeholder='Search' value={search} onChange={handlechange}/>

            <button 
                className="rounded-xl bg-[#800000] px-5 py-3 text-lg text-white hover:bg-[#600000]">
                Post
            </button>

            <Link
                to="/login"
                className="rounded-xl bg-[#800000] px-5 py-3 text-lg text-white hover:bg-[#600000]"
            >
                Login
            </Link>
        </div> </div>
        </header>
    )
}

export default Header
