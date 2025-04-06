import React, { useState } from 'react';

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletBalance: number;
  onWithdraw: (amount: number, phoneNumber: string) => Promise<void>;
}

export default function WithdrawalModal({ isOpen, onClose, walletBalance, onWithdraw }: WithdrawalModalProps) {
  const [amount, setAmount] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const withdrawalAmount = parseFloat(amount);
    if (isNaN(withdrawalAmount)) {
      setError('Please enter a valid amount');
      return;
    }

    if (withdrawalAmount < 200) {
      setError('Minimum withdrawal amount is KES 200');
      return;
    }

    if (withdrawalAmount > walletBalance) {
      setError('Insufficient balance');
      return;
    }

    if (!phoneNumber.match(/^254[0-9]{9}$/)) {
      setError('Please enter a valid M-Pesa phone number (e.g., 254712345678)');
      return;
    }

    try {
      setLoading(true);
      await onWithdraw(withdrawalAmount, phoneNumber);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process withdrawal');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Withdraw to M-Pesa</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (KES)
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">KES</span>
              </div>
              <input
                type="number"
                name="amount"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-12 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="0.00"
                min="200"
                step="1"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">.00</span>
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">Minimum withdrawal: KES 200</p>
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
              M-Pesa Phone Number
            </label>
            <div className="relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-500 sm:text-sm">+</span>
              </div>
              <input
                type="tel"
                name="phone"
                id="phone"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="focus:ring-teal-500 focus:border-teal-500 block w-full pl-8 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="254712345678"
                pattern="^254[0-9]{9}$"
              />
            </div>
            <p className="mt-1 text-sm text-gray-500">Format: 254712345678</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Withdraw'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 