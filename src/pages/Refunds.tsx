import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import logo from '@/assets/logo.png';

const Refunds = () => {
    return (
        <div className="min-h-screen bg-slate-950">
            <header className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="flex items-center">
                        <img src={logo} alt="Foliogen" className="h-10 w-auto" />
                    </Link>
                    <Link
                        to="/"
                        className="flex items-center gap-2 text-sm font-medium text-slate-400 transition-colors hover:text-white">
                        <ArrowLeft className="h-4 w-4" />
                        Back to Home
                    </Link>
                </div>
            </header>

            <main className="container mx-auto px-4 py-16 max-w-3xl">
                <h1 className="text-4xl font-bold text-white mb-8">Refund & Cancellation Policy</h1>

                <div className="prose prose-invert prose-slate max-w-none">
                    <p className="text-slate-300 text-lg mb-8">
                        Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </p>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Subscriptions & Billing</h2>
                        <p className="text-slate-400 leading-relaxed">
                            Foliogen operates on a prepaid subscription basis. Our services are billed in advance on a monthly or annual basis, depending on the plan you select.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">2. The ₹199 Pro Plan Exceptions</h2>
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 mb-4">
                            <p className="text-slate-300 font-medium mb-2">₹199 Pro Plan Non-Refundable Nature</p>
                            <p className="text-slate-400 text-sm">
                                Due to the heavily discounted and accessible nature of the <strong>₹199 Pro plan</strong>, payments made towards this tier are strictly <strong>non-refundable</strong>. Access is granted immediately upon payment validation, and the subscription will remain active until the end of the current billing cycle.
                            </p>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Indian Consumer Law Compliance</h2>
                        <p className="text-slate-400 leading-relaxed mb-4">
                            In accordance with the <strong>Consumer Protection (E-Commerce) Rules, 2020</strong> in India, you have the right to transparent billing and service delivery.
                        </p>
                        <ul className="list-disc list-inside text-slate-400 space-y-2">
                            <li>Cancellations can be made at any point before your next billing cycle.</li>
                            <li>If you experience a failed transaction but the amount was deducted (e.g. via UPI or Cards), our payment gateway automatically processes a refund within 5-7 business days.</li>
                            <li>You will continue to have access to your purchased tier until the end of your billing cycle post-cancellation.</li>
                        </ul>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Dispute Resolution</h2>
                        <p className="text-slate-400 leading-relaxed">
                            For any billing disputes or payment failures, please reach out to our support team at <strong>admin@foliogen.in</strong>. We aim to resolve all financial discrepancies within 48 business hours.
                        </p>
                    </section>
                </div>
            </main>

            <footer className="border-t border-white/10 bg-slate-950 py-8">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm text-slate-500">
                        © {new Date().getFullYear()} Foliogen. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Refunds;
