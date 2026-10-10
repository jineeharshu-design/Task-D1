import { Link } from 'react-router-dom'

function Navigation() {
    return(
        <div className="text-[#800000] text-lg font-bold py-4 px-6 flex gap-6">
            
            <Link to = "/#about" >
                About
            </Link>

            <Link to = "/#work">
                Work
            </Link>

            <Link to = "/#contact">
                Contact
            </Link>

        </div>
    )
}

export default Navigation
