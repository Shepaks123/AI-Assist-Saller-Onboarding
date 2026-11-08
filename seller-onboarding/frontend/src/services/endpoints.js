// ⚠ PROPOSED routes. The backend developer must confirm them.
// To change one, edit it HERE only – no other file hardcodes a URL.
// The shared prefix (default "/api") can be changed with VITE_API_PREFIX in .env.
const PREFIX = import.meta.env.VITE_API_PREFIX ?? '/api';

export const ENDPOINTS = {
  auth: {
    register: `${PREFIX}/auth/register`, // POST
    login: `${PREFIX}/auth/login`, // POST
  },
  seller: {
    profile: `${PREFIX}/seller/profile`, // GET, PUT
  },
  onboarding: {
    status: `${PREFIX}/onboarding/status`, // GET
    draft: `${PREFIX}/onboarding/draft`, // PUT (save progress)
    submit: `${PREFIX}/onboarding/submit`, // POST
  },
  documents: {
    upload: `${PREFIX}/documents/upload`, // POST (multipart/form-data)
  },
  ai: {
    chat: `${PREFIX}/ai/chat`, // POST
  },
};
