import { Link } from 'react-router-dom'

function Footer() {
    return (
        <>
            <section className="bg-blue-200 mx-auto mt-10 flex items-center justify-between px-4 py-2">

                <p className="text-[18px] font-bold text-[#111]">
                SIGN UP FOR OUR DAILY INSIDER
                </p>

                <form
                    className="bg-blue-200 mx-auto mt-10 flex items-center justify-between px-4 py-2"
                    action="/subscribe"
                    method="post"
                >

                <input
                    className="border-2 border-gray-700 bg-white px-4 py-3 text-lg"
                    name="email"
                    type="email"
                    id="email"
                    placeholder="Enter your email"
                    required
                />

                <button
                    className="bg-gray-500 px-4 py-3 text-lg"
                    type="submit"
                >
                    Subscribe
                </button>

                </form>

                <p id="message"></p>
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
