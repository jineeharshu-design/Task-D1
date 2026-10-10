function Signup() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-[#800000]">
          Create an Account
        </h1>

        <input
            type="text"
            placeholder="Full Name"
            className="w-full px-4 py-2 mt-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000]"
        />

        <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-2 mt-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000]"
        />

        <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 mt-4 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#800000]"
        />

        <button
            className="w-full px-4 py-2 mt-4 bg-[#800000] text-white rounded-md hover:bg-[#a52a2a]"
        >
            Sign Up
        </button>

        <p className="mt-4 text-center">
          Already have an account? <a href="/login" className="text-[#800000]">Login</a>
        </p>

      </div>
    </div>
  )
}

export default Signup

