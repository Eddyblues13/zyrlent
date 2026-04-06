import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'
import api from '../../lib/axios'

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

        let attempts = 0
        const maxAttempts = 4
        const retryDelay = 3000 // 3 seconds between retries

        const verifyPayment = async () => {
            attempts++
            try {
                const response = await api.post('/api/wallet/korapay/verify', { reference })

                if (response.data.success) {
                    setStatus('success')
                    setMessage(response.data.message || 'Payment successful! Wallet funded.')
                    setTimeout(() => navigate('/user/fund-wallet'), 3000)
                } else {
                    // If still processing and we have retries left, try again
                    const msg = response.data.message || ''
                    if (msg.toLowerCase().includes('processing') && attempts < maxAttempts) {
                        setMessage(`Payment is still being processed... (attempt ${attempts}/${maxAttempts})`)
                        setTimeout(verifyPayment, retryDelay)
                    } else {
                        setStatus('failed')
                        setMessage(msg || 'Payment verification failed.')
                    }
                }
            } catch (error) {
                const errorMsg = error.response?.data?.message || ''
                // If still processing or a temporary error, retry
                if (attempts < maxAttempts && (errorMsg.toLowerCase().includes('processing') || error.response?.status === 502)) {
                    setMessage(`Payment is still being processed... (attempt ${attempts}/${maxAttempts})`)
                    setTimeout(verifyPayment, retryDelay)
                } else {
                    setStatus('failed')
                    setMessage(errorMsg || 'The payment was cancelled or verification failed.')
                }
            }
        }

        // Small delay before first verify to give KoraPay time to finalize
        const timer = setTimeout(verifyPayment, 1500)
        return () => clearTimeout(timer)
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
