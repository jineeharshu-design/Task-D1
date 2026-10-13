// import { useState } from 'react'
// import { Link } from 'react-router-dom'
// import { sendPasswordResetEmail } from 'firebase/auth'
// import { auth } from '../firebase'

// function ResetPassword() {
//   const [email, setEmail] = useState('')
//   const [message, setMessage] = useState('')
//   const [loading, setLoading] = useState(false)

//   async function handleReset(event) {
//     event.preventDefault()
//     setMessage('')
//     setLoading(true)

//     try {
//       await sendPasswordResetEmail(auth, email)
//       setMessage('Password reset email sent! Check your inbox.')
//     } catch (error) {
//       setMessage('Could not send reset email. Check the email address and try again.')
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="min-h-screen flex justify-center items-center">
//       <form
//         onSubmit={handleReset}
//         className="w-full max-w-md p-8"
//       >
//         <h1 className="text-3xl font-bold text-[#800000]">
//           Reset Password
//         </h1>

//         <p className="mt-3">
//           Enter your email address to receive a password reset link.
//         </p>

//         <input
//           type="email"
//           placeholder="Your email address"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full px-4 py-2 mt-4 border rounded-md"
//           required
//         />

//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full px-4 py-2 mt-4 bg-[#800000] text-white rounded-md disabled:opacity-50"
//         >
//           {loading ? 'Sending...' : 'Send Reset Link'}
//         </button>

//         {message && (
//           <p className="mt-4 break-words" role="status">
//             {message}
//           </p>
//         )}

//         <p className="mt-4 text-center">
//           <Link to="/login" className="text-[#800000] underline">
//             Back to Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   )
// }

// export default ResetPassword
