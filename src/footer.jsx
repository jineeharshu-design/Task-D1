import { useState } from 'react'
import { Link } from 'react-router-dom'

const API_URL = import.meta.env.VITE_API_URL

function Footer() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubscribe = async (e) => {
        e.preventDefault()

        setLoading(true)

        try {
            const response = await fetch(`${API_URL}/subscribe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email })
            })

            const result = await response.text()

            if (!response.ok) {
                throw new Error(result || 'Subscription failed.')
            }

            alert(result)
            setEmail('')
        } catch (error) {
            alert(error.message || 'Something went wrong. Please try again.')
        } finally {
            setLoading(false)
        }
    }
    return (
        <>
            <section className="bg-blue-200 mx-auto mt-10 flex flex-col items-center justify-between gap-5 px-4 py-2">

                <p className="text-[18px] font-bold text-[#111]">
                    SIGN UP FOR OUR DAILY INSIDER
                </p>

                <form
                    className="flex flex-col sm:flex-row items-center gap-3"
                    onSubmit={handleSubscribe}
                >

                <input
                    className="border-2 border-gray-700 bg-white px-4 py-3 text-lg"
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button
                    className="bg-gray-500 px-4 py-3 text-lg"
                    type="submit"
                    disabled={loading}
                >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                </button>

                </form>
            </section>

            <div className="bg-blue-200 px-8 py-8">
                <hr className="my-6"></hr>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

                <div className="flex flex-col gap-2">
                    <h3 className="text-2xl font-bold">
                        Explore
                    </h3>

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/#gallery">
                        Gallery
                    </Link>

                    <Link to="/#articles">
                        Articles
                    </Link>
                    
                    <Link to="/#tutorials">
                        Tutorials
                    </Link>
                </div>


                <div>
                    <h3 className="text-2xl font-bold">
                        Support
                    </h3>

                    <p>FAQs</p>
                    <p>Help</p>
                    <Link to="/#contact">
                        Contact Us
                    </Link>
                </div>


                <div>
                    <h3 className="text-2xl font-bold">
                        Stay connected
                    </h3>

                    <div className="flex gap-3 mt-4 text-2xl">
                        <span>ⓕ</span>
                        <span>𝕏</span>
                        <span>◎</span>
                    </div>
                </div>

                </div>


                <div className="text-center mt-10">

                <h3 className="text-2xl font-bold">
                    DEV@Deakin 2026
                </h3>

                <div className="flex justify-center gap-10 mt-4">
                    <span>Privacy Policy</span>
                    <span>Terms</span>
                    <span>Code of Conduct</span>
                </div>

                </div>
            </div>
        </>
    )
}

export default Footer
