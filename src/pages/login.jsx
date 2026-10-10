function Login() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-[#800000]">
          Login
        </h1>

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
            Login
        </button>

        <p className="mt-4 text-center">
          Don't have an account? <a href="/signup" className="text-[#800000]">Sign up</a>
        </p>

        <p className="mt-4 text-center">
          Forgot your password? <a href="/reset-password" className="text-[#800000]">Reset Password</a>
        </p>

      </div>
    </div>
  )
}

export default Login

