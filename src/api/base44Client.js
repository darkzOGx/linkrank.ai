import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client without authentication requirement for public SEO audit tool
export const base44 = createClient({
  appId: "68a647b36e5b61a4707601be", 
  requiresAuth: false // Allow public access for SEO audit functionality
});
