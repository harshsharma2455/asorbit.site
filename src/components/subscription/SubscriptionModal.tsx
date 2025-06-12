import React from 'react';
import Modal from '../ui/Modal';
import InteractiveButton from '../ui/InteractiveButton';
import type { NotificationFunction } from '../../types';

interface SubscriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentSubscription: 'free' | 'premium' | 'pro';
  onUpgrade: (plan: 'premium' | 'pro') => void;
  addNotification: NotificationFunction;
}

const plans = [
  {
    id: 'free' as const,
    name: 'Free',
    price: 0,
    interval: 'forever',
    description: 'Perfect for getting started',
    features: [
      '10 questions per day',
      '5 diagrams per day',
      '3 doubts per day',
      '2 papers per day',
      'Basic question types',
      'Simple diagrams'
    ],
    limitations: [
      'Limited daily usage',
      'Basic features only',
      'No priority support'
    ]
  },
  {
    id: 'premium' as const,
    name: 'Premium',
    price: 9.99,
    interval: 'month',
    description: 'For serious educators',
    features: [
      '50 questions per day',
      '25 diagrams per day',
      '15 doubts per day',
      '10 papers per day',
      'Advanced question types',
      'Complex diagrams',
      'Detailed solutions',
      'Export options',
      'Email support'
    ],
    popular: true
  },
  {
    id: 'pro' as const,
    name: 'Professional',
    price: 19.99,
    interval: 'month',
    description: 'For institutions and power users',
    features: [
      'Unlimited questions',
      'Unlimited diagrams',
      'Unlimited doubts',
      'Unlimited papers',
      'All features included',
      'Priority support',
      'Custom templates',
      'Bulk operations',
      'Advanced analytics',
      'API access'
    ]
  }
];

const SubscriptionModal: React.FC<SubscriptionModalProps> = ({
  isOpen,
  onClose,
  currentSubscription,
  onUpgrade,
  addNotification
}) => {
  const handleUpgrade = (planId: 'premium' | 'pro') => {
    // In a real app, this would integrate with RevenueCat or Stripe
    addNotification({
      type: 'info',
      title: 'Simulated Upgrade',
      message: `This is a demo. In production, this would process payment via RevenueCat.`,
      duration: 4000
    });
    
    onUpgrade(planId);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Choose Your Plan"
      size="xl"
    >
      <div className="space-y-6">
        <div className="text-center">
          <p className="text-slate-600">
            Unlock the full potential of ASORBIT with our premium plans
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative p-6 rounded-2xl border-2 transition-all duration-300 ${
                plan.popular
                  ? 'border-primary-500 bg-primary-50 transform scale-105'
                  : currentSubscription === plan.id
                  ? 'border-green-500 bg-green-50'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}

              {currentSubscription === plan.id && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                    Current Plan
                  </span>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2">{plan.name}</h3>
                <div className="mb-2">
                  <span className="text-3xl font-bold text-slate-900">
                    ${plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-slate-600">/{plan.interval}</span>
                  )}
                </div>
                <p className="text-slate-600 text-sm">{plan.description}</p>
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-slate-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {plan.limitations && (
                <ul className="space-y-2 mb-6">
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <svg className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span className="text-slate-600 text-sm">{limitation}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto">
                {currentSubscription === plan.id ? (
                  <div className="w-full py-3 text-center text-green-600 font-medium border-2 border-green-200 rounded-xl bg-green-50">
                    Current Plan
                  </div>
                ) : plan.id === 'free' ? (
                  <div className="w-full py-3 text-center text-slate-600 font-medium border-2 border-slate-200 rounded-xl">
                    Free Forever
                  </div>
                ) : (
                  <InteractiveButton
                    onClick={() => handleUpgrade(plan.id)}
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Upgrade to {plan.name}
                  </InteractiveButton>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-slate-500">
          <p>
            All plans include a 7-day free trial. Cancel anytime.
          </p>
          <p className="mt-1">
            Payments processed securely via RevenueCat.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default SubscriptionModal;