import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../services/api' // Assuming this is the standard configured axios instance

export default function VerifyKorapay() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const reference = searchParams.get('reference')

    const [status, setStatus] = useState('verifying') // verifying, success, failed
    const [message, setMessage] = useState('Verifying your payment...')

    useEffect(() => {
        if (!reference) {
            setStatus('failed')
            setMessage('No payment reference found.')
            return
        }

        const verifyPayment = async () => {
            try {
                const response = await api.post('/wallet/korapay/verify', { reference })

                if (response.data.success) {
                    setStatus('success')
                    setMessage(response.data.message || 'Payment successful! Wallet funded.')
                    // Automatically redirect to wallet after success
                    setTimeout(() => navigate('/user/fund-wallet'), 3000)
                } else {
                    setStatus('failed')
                    setMessage(response.data.message || 'Payment verification failed.')
                }
                // eslint-disable-next-line no-unused-vars
            } catch (error) {
                setStatus('failed')
                setMessage('The payment was cancelled or verification failed.')
            }
        }

        verifyPayment()
    }, [reference, navigate])

    return (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-xl p-8 text-center border border-gray-700">
                {status === 'verifying' && (
                    <div className="flex flex-col items-center">
                        <Loader2 className="h-16 w-16 text-yellow-500 animate-spin mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Verifying Payment</h2>
                        <p className="text-gray-400">Please wait while we confirm your transaction with Korapay.</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center">
                        <CheckCircle className="h-16 w-16 text-green-500 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Successful!</h2>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <button
                            onClick={() => navigate('/user/fund-wallet')}
                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
                        >
                            Return to Wallet
                        </button>
                    </div>
                )}

                {status === 'failed' && (
                    <div className="flex flex-col items-center">
                        <XCircle className="h-16 w-16 text-red-500 mb-6" />
                        <h2 className="text-2xl font-bold text-white mb-2">Payment Failed</h2>
                        <p className="text-gray-400 mb-6">{message}</p>
                        <button
                            onClick={() => navigate('/user/fund-wallet')}
                            className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors w-full"
                        >
                            Return to Wallet
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}
