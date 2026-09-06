export const SUBSCRIPTION_PLANS = [
    {
        id: 'daily',
        name: '1-Day Access Pass',
        duration: '24 Hours',
        durationDays: 1,
        price: 1,
        planId: '26801220000007963',
        offerCode: '9916310061',
        popular: true,
        features: [
            'Full 24-Hour Unlimited Access',
            'Instant Access (Ends strictly after 24 hours)',
            'Ultra HD Streaming Quality',
            'Mobile & Desktop Access',
            '100% Ad-Free Experience',
        ],
    },
];
export const getPlanById = (id) => SUBSCRIPTION_PLANS.find((plan) => plan.id === id) || SUBSCRIPTION_PLANS[0];
export const getPlanByOfferCode = (offerCode) => SUBSCRIPTION_PLANS.find((plan) => plan.offerCode === offerCode) || SUBSCRIPTION_PLANS[0];

