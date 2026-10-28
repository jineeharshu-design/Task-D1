import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
// import { doc, getDoc, setDoc } from 'firebase/firestore'
// import { db } from '../firebase'
import { useAuth } from '../context/authContext.jsx'

const API_URL = import.meta.env.VITE_API_URL

function Pricing() {
  const { user } = useAuth()

  const [plan, setPlan] = useState('Free')
  const [loadingPlan, setLoadingPlan] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [payment, setPayment] = useState({
    name: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  // Read the user's plan from Firestore.
  useEffect(() => {
    async function loadPlan() {
      if (!user) {
        setPlan('Free')
        setLoadingPlan(false)
        return
      }

      setLoadingPlan(true)
      setErrorMessage('')

      try {
        const token = localStorage.getItem('token')
        
        if (!token) {
          setPlan('Free')
          setErrorMessage('Please log in to load your plan.')
          return
        }

        const response = await fetch(`${API_URL}/api/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || 'Could not load your plan.')
        }

        setPlan(data.user.plan || 'Free')
      } catch (error) {
        console.error('Could not load plan:', error)
        setErrorMessage('Could not load your plan. Please try again.')
      } finally {
        setLoadingPlan(false)
      }
    }

    loadPlan()
  }, [user])

  function handlePaymentChange(event) {
    const { name, value } = event.target

    setPayment((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  function closeModal() {
    setShowModal(false)
    setPayment({
      name: '',
      cardNumber: '',
      expiry: '',
      cvv: '',
    })
  }

  async function handleUpgrade(event) {
    event.preventDefault()
    setMessage('')
    setErrorMessage('')

    if (!user) {
      setErrorMessage('Please log in before upgrading.')
      return
    }

    if (plan === 'Paid') {
      setErrorMessage('You are already on the Paid plan.')
      return
    }

    // Demo-only validation. No payment is processed.
    const cardDigits = payment.cardNumber.replace(/\s/g, '')

    if (!payment.name.trim()) {
      setErrorMessage('Please enter the cardholder name.')
      return
    }

    if (!/^\d{12,19}$/.test(cardDigits)) {
      setErrorMessage('Enter a valid demo card number using 12–19 digits.')
      return
    }

    // checks the expiry date format
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(payment.expiry)) {
      setErrorMessage('Enter a valid expiry date in MM/YY format.')
      return
    }

    // checks whether the card has expired
    const [month, year] = payment.expiry.split('/')
    const expiryMonth = Number(month)
    const expiryYear = 2000 + Number(year)

    const today = new Date()
    const currentMonth = today.getMonth() + 1
    const currentYear = today.getFullYear()

    if (
      expiryYear < currentYear ||
      (expiryYear === currentYear && expiryMonth < currentMonth)
    ) {
      setErrorMessage('This card has expired. Please enter a valid expiry date.')
      return
    }

    if (!/^\d{3,4}$/.test(payment.cvv)) {
      setErrorMessage('Enter a 3 or 4 digit demo security code.')
      return
    }

    setSaving(true)

    try {
      const token = localStorage.getItem('token')
      // const userRef = doc(db, 'users', user.uid)

      if (!token) {
        throw new Error('Your session has expired. Please log in again.')
      }

      const response = await fetch(`${API_URL}/api/upgrade`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Could not update your plan.')
      }

      // // Save only the plan status, not payment details.
      // await setDoc(
      //   userRef,
      //   {
      //     name: user.displayName || '',
      //     email: user.email || '',
      //     plan: 'Paid',
      //     upgradedAt: new Date(),
      //   },
      //   { merge: true }
      // )

      setPlan(data.plan || 'Paid')
      setMessage('Your demo plan has been upgraded to Paid!')
      closeModal()
    } catch (error) {
      console.error('Upgrade failed:', error)
      setErrorMessage(error.message || 'Could not update your plan.')
    } finally {
      setSaving(false)
    }
  }


  const features = [
    ['Browse articles and tutorials', true, true],
    ['Create and publish posts', true, true],
    ['Access learning resources', true, true],
    ['Priority support', false, true],
    ['Advanced learning resources', false, true],
  ]

  return (
    <main className="min-h-screen px-4 py-12">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-center text-4xl font-bold text-[#800000]">
          Choose Your Plan
        </h1>

        <p className="mt-4 text-center text-gray-600">
          Choose the plan that suits your learning needs.
        </p>

        {message && (
          <p role="status" className="mt-6 text-center text-green-700">
            {message}
          </p>
        )}

        {errorMessage && !showModal && (
          <p role="alert" className="mt-6 text-center text-red-700">
            {errorMessage}
          </p>
        )}

        {loadingPlan ? (
          <p className="mt-8 text-center">Loading your plan...</p>
        ) : (
          <>
            <div className="mt-10 grid gap-8 md:grid-cols-2">
              {/* Free plan */}
              <section className="flex flex-col rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#800000]">
                  Free Plan
                </h2>

                <p className="mt-3 text-4xl font-bold">
                  $0
                  <span className="text-base font-normal text-gray-500">
                    {' '}/ month
                  </span>
                </p>

                <p className="mt-4 text-gray-600">
                  Get started with the essential features.
                </p>

                <p className="mt-6 rounded-lg bg-gray-100 p-3 text-center font-semibold">
                  {plan === 'Free' ? 'Your Current Plan' : 'Free Plan'}
                </p>

                <div className="mt-6 flex-1">
                  <h3 className="mb-4 font-bold text-gray-800">
                    What's included
                  </h3>

                  <ul className="space-y-4">
                    {features.map(([feature, free]) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className={free ? 'font-bold text-green-700' : 'text-gray-400'}>
                          {free ? '✓' : '—'}
                        </span>
                        <span className={free ? 'text-gray-700' : 'text-gray-400'}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* Paid plan */}
              <section className="flex flex-col rounded-2xl border-2 border-[#800000] bg-white p-8 shadow-sm">
                <h2 className="text-2xl font-bold text-[#800000]">
                  Paid Plan
                </h2>

                <p className="mt-3 text-4xl font-bold">
                  $9.99
                  <span className="text-base font-normal text-gray-500">
                    {' '}/ month
                  </span>
                </p>

                <p className="mt-4 text-gray-600">
                  Get additional features to support your learning.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setErrorMessage('')
                    setShowModal(true)
                  }}
                  disabled={plan === 'Paid'}
                  className="mt-6 w-full rounded-xl bg-[#800000] px-5 py-3 font-semibold text-white hover:bg-[#600000] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {plan === 'Paid' ? 'Already on Paid Plan' : 'Upgrade Plan'}
                </button>

                <div className="mt-6 flex-1">
                  <h3 className="mb-4 font-bold text-gray-800">
                    What's included
                  </h3>

                  <ul className="space-y-4">
                    {features.map(([feature, free, paid]) => (
                      <li key={feature} className="flex items-start gap-3">
                        <span className="font-bold text-green-700">
                          {paid ? '✓' : '—'}
                        </span>
                        <span className="text-gray-700">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </>
        )}
      </div>

      {/* Demo payment modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleUpgrade}
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg"
          >
            <h2 className="text-2xl font-bold text-[#800000]">
              Upgrade to Paid
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Demo form. No real payment will be taken
            </p>

            <label className="mt-5 block font-medium" htmlFor="cardName">
              Cardholder name
            </label>
            <input
              id="cardName"
              name="name"
              type="text"
              autoComplete="off"
              value={payment.name}
              onChange={handlePaymentChange}
              className="mt-1 w-full rounded-md border p-3"
              required
            />

            <label className="mt-4 block font-medium" htmlFor="cardNumber">
              Demo card number
            </label>
            <input
              id="cardNumber"
              name="cardNumber"
              type="text"
              inputMode="numeric"
              autoComplete="off"
              value={payment.cardNumber}
              onChange={handlePaymentChange}
              placeholder="Digits only"
              className="mt-1 w-full rounded-md border p-3"
              required
            />

            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label className="block font-medium" htmlFor="expiry">
                  Expiry (MM/YY)
                </label>
                <input
                  id="expiry"
                  name="expiry"
                  type="text"
                  autoComplete="off"
                  value={payment.expiry}
                  onChange={handlePaymentChange}
                  placeholder="MM/YY"
                  className="mt-1 w-full rounded-md border p-3"
                  required
                />
              </div>

              <div>
                <label className="block font-medium" htmlFor="cvv">
                  Demo security code
                </label>
                <input
                  id="cvv"
                  name="cvv"
                  type="password"
                  inputMode="numeric"
                  autoComplete="off"
                  value={payment.cvv}
                  onChange={handlePaymentChange}
                  className="mt-1 w-full rounded-md border p-3"
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <p role="alert" className="mt-4 text-sm text-red-700">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={saving}
              className="mt-6 w-full rounded-xl bg-[#800000] px-5 py-3 font-semibold text-white hover:bg-[#600000] disabled:opacity-50"
            >
              {saving ? 'Updating plan...' : 'Confirm Demo Upgrade'}
            </button>

            <button
              type="button"
              onClick={closeModal}
              disabled={saving}
              className="mt-3 w-full rounded-xl border border-gray-300 px-5 py-3 hover:bg-gray-100"
            >
              Cancel
            </button>
          </form>
        </div>
      )}
    </main>
  )
}

export default Pricing

