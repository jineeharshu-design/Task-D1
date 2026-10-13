import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../firebase'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleLogin(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate('/')
    } catch (error) {
      setMessage('Login failed. Please check your email and password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-8"
      >
        <h1 className="text-3xl font-bold text-[#800000]">
          Login
        </h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mt-4 border rounded-md"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mt-4 border rounded-md"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 mt-4 bg-[#800000] text-white rounded-md hover:bg-[#a52a2a] disabled:opacity-50"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {message && (
          <p className="mt-4 text-center text-red-700" role="alert">
            {message}
          </p>
        )}

        <p className="mt-4 text-center">
          Don't have an account?{' '}
          <Link to="/signup" className="text-[#800000] underline">
            Sign up
          </Link>
        </p>

        <p className="mt-4 text-center">
          Forgot your password?{' '}
          <Link to="/reset-password" className="text-[#800000] underline">
            Reset Password
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Login
