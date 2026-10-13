import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth } from '../firebase'

function Signup() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSignup(event) {
    event.preventDefault()
    setMessage('')
    setLoading(true)

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )

      await updateProfile(result.user, {
        displayName: name
      })

      setMessage('Account created successfully!')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-8"
      >
        <h1 className="text-3xl font-bold text-[#800000]">
          Create an Account
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 mt-4 border rounded-md"
          required
        />

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
          minLength={6}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full px-4 py-2 mt-4 bg-[#800000] text-white rounded-md hover:bg-[#a52a2a] disabled:opacity-50"
        >
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>

        {message && (
          <p className="mt-4 break-words" role="status">
            {message}
          </p>
        )}

        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-[#800000] underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  )
}

export default Signup
