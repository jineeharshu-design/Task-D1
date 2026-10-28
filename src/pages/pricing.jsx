import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from '../context/authContext.jsx'

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
        const userRef = doc(db, 'users', user.uid)
        const userSnapshot = await getDoc(userRef)

        if (userSnapshot.exists()) {
          setPlan(userSnapshot.data().plan || 'Free')
        } else {
          setPlan('Free')
        }
      } catch (error) {
        console.error('Could not load plan:', error)
        setErrorMessage('Could not load your plan. Please refresh the page.')
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
      const userRef = doc(db, 'users', user.uid)

      // Save only the plan status, not payment details.
      await setDoc(
        userRef,
        {
          name: user.displayName || '',
          email: user.email || '',
          plan: 'Paid',
          upgradedAt: new Date(),
        },
        { merge: true }
      )

      setPlan('Paid')
      setMessage('Your plan has been upgraded to Paid!')
      closeModal()
    } catch (error) {
      console.error('Upgrade failed:', error)
      setErrorMessage(
        'Could not update your plan. Check your Firestore rules and try again.'
      )
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
              <section className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
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
              </section>

              {/* Paid plan */}
              <section className="rounded-2xl border-2 border-[#800000] bg-white p-8 shadow-sm">
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
              </section>
            </div>

            {/* Plan comparison */}
            <section className="mt-12 overflow-x-auto">
              <h2 className="mb-5 text-2xl font-bold text-[#800000]">
                Compare Plans
              </h2>

              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-[#800000] text-white">
                    <th className="p-4">Features</th>
                    <th className="p-4 text-center">Free</th>
                    <th className="p-4 text-center">Paid</th>
                  </tr>
                </thead>

                <tbody>
                  {features.map(([feature, free, paid]) => (
                    <tr key={feature} className="border-b border-gray-200">
                      <td className="p-4">{feature}</td>
                      <td className="p-4 text-center">
                        {free ? '✓' : '—'}
                      </td>
                      <td className="p-4 text-center">
                        {paid ? '✓' : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
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
              Demo form only. No real payment will be taken. Use dummy
              payment details, not your real card information.
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

