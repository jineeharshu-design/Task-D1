function Contact() {
  return (
    <>
      <section id="contact" className="px-6 py-8 text-center">

        <h2 className="mb-6 text-2xl text-[#800000] font-bold">
          Contact Me
        </h2>

        <p className="mb-4">
          Feel free to reach out to me via email.
          <br />
          My email is harshita9033.ai25@chitkara.edu.in
        </p>

      </section>

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

          <div>
            <h3 className="text-2xl font-bold">
              Explore
            </h3>

            <p>Home</p>
            <p>Questions</p>
            <p>Articles</p>
            <p>Tutorials</p>
          </div>


          <div>
            <h3 className="text-2xl font-bold">
              Support
            </h3>

            <p>FAQs</p>
            <p>Help</p>
            <p>Contact Us</p>
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
  );
}

export default Contact;