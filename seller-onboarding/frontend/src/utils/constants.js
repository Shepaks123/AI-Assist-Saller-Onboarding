// Shared constants. Nothing secret here.
export const TOKEN_KEY = 'sp_token';

export const STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
};

export const BUSINESS_TYPES = [
  { value: 'sole', label: 'Sole proprietorship' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'individual', label: 'Individual seller (no registered business)' },
];

export const CATEGORIES = [
  { id: 'fashion', label: 'Fashion & apparel', hint: 'Clothing, shoes, bags' },
  { id: 'electronics', label: 'Electronics', hint: 'Phones, audio, accessories' },
  { id: 'home', label: 'Home & living', hint: 'Furniture, decor, kitchen' },
  { id: 'beauty', label: 'Beauty & personal care', hint: 'Skincare, makeup, grooming' },
  { id: 'food', label: 'Food & beverage', hint: 'Packaged food, snacks, drinks' },
  { id: 'toys', label: 'Toys & hobbies', hint: 'Games, crafts, collectibles' },
  { id: 'sports', label: 'Sports & outdoors', hint: 'Fitness, camping, cycling' },
  { id: 'health', label: 'Health & wellness', hint: 'Supplements, medical supplies' },
];

// Examples only – confirm the real list with the platform's seller policy.
export const DOCUMENT_TYPES = [
  {
    key: 'governmentId',
    label: 'Government-issued ID',
    description: 'A valid ID of the account owner. Both name and photo must be readable.',
    required: true,
  },
  {
    key: 'businessRegistration',
    label: 'Business registration certificate',
    description: 'For example a DTI or SEC certificate. Individual sellers can skip this.',
    required: true,
  },
  {
    key: 'taxCertificate',
    label: 'Tax registration certificate',
    description: 'Proof that your business is registered for tax (for example a BIR certificate).',
    required: true,
  },
  {
    key: 'proofOfAddress',
    label: 'Proof of business address',
    description: 'A utility bill or lease from the last 3 months. Optional but speeds up review.',
    required: false,
  },
];

export const FILE_RULES = {
  maxBytes: 5 * 1024 * 1024,
  accept: ['application/pdf', 'image/jpeg', 'image/png'],
  acceptLabel: 'PDF, JPG or PNG up to 5 MB',
};
