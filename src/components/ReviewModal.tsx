import React, { useState } from 'react';
import { X, Star, CheckCircle } from 'lucide-react';
import { Product } from '../types';

interface ReviewModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitReview: (review: {
    productId: string;
    productName: string;
    customerName: string;
    city: string;
    rating: number;
    comment: string;
    verifiedPurchase: boolean;
  }) => void;
}

export const ReviewModal: React.FC<ReviewModalProps> = ({
  product,
  isOpen,
  onClose,
  onSubmitReview,
}) => {
  if (!isOpen || !product) return null;

  const [rating, setRating] = useState(5);
  const [customerName, setCustomerName] = useState('');
  const [city, setCity] = useState('Islamabad');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !comment.trim()) return;

    onSubmitReview({
      productId: product.id,
      productName: product.name,
      customerName: customerName.trim(),
      city: city.trim(),
      rating,
      comment: comment.trim(),
      verifiedPurchase: true,
    });

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          onClick={onClose}
          className="fixed inset-0 bg-[#282326]/60 backdrop-blur-xs transition-opacity"
        />

        <div className="relative inline-block w-full max-w-md bg-[#FFFDF9] rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all my-8 p-6 border border-[#282326]/10">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-stone-100 text-stone-500"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {submitted ? (
            <div className="py-8 text-center">
              <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
              <h3 className="font-serif text-lg font-bold text-[#282326]">
                Thank you for your feedback!
              </h3>
              <p className="text-xs text-[#5E555A] mt-1">
                Your review for {product.name} has been received.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <span className="text-[11px] font-semibold text-[#A9874F] uppercase tracking-wider">
                  Customer Feedback
                </span>
                <h3 className="font-serif text-lg font-bold text-[#282326] mt-0.5">
                  Write a Review
                </h3>
                <p className="text-xs text-stone-500 mt-1 line-clamp-1">
                  {product.name}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Star selection */}
                <div>
                  <label className="block text-xs font-semibold text-[#282326] mb-1.5">
                    Your Rating:
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 hover:scale-110 transition-transform"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= rating
                              ? 'text-[#C5A46D] fill-[#C5A46D]'
                              : 'text-stone-300'
                          }`}
                        />
                      </button>
                    ))}
                    <span className="text-xs font-semibold text-[#282326] ml-2">
                      {rating} / 5 Stars
                    </span>
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#282326] mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ayesha Khan"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
                  />
                </div>

                {/* City */}
                <div>
                  <label className="block text-xs font-semibold text-[#282326] mb-1">
                    City / Neighborhood *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Islamabad, F-7 or Rawalpindi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-xs font-semibold text-[#282326] mb-1">
                    Your Review & Experience *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Share shade accuracy, skin feel, wear time, or packaging quality..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-[#FAF7F2] border border-stone-200 rounded-xl px-3 py-2 text-xs text-[#282326] focus:outline-none focus:border-[#C8798D]"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full bg-[#282326] hover:bg-[#C8798D] text-white py-2.5 px-4 rounded-xl text-xs font-bold transition-colors shadow-sm"
                  >
                    Submit Authentic Review
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
