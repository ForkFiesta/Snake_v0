// Mock Supabase client for testing
const mockClient = {
  from: () => ({
    select: () => mockClient.from(),
    insert: () => mockClient.from(),
    update: () => mockClient.from(),
    delete: () => mockClient.from(),
    eq: () => mockClient.from(),
    gt: () => mockClient.from(),
    lt: () => mockClient.from(),
    order: () => mockClient.from(),
    limit: () => mockClient.from(),
    single: () => Promise.resolve({ data: null, error: null }),
    then: () => Promise.resolve({ data: [], error: null }),
  }),
  
  auth: {
    getUser: () => Promise.resolve({ 
      data: { user: { id: 'test-user-id' } }, 
      error: null 
    }),
    signIn: () => Promise.resolve({ 
      data: { user: { id: 'test-user-id' } }, 
      error: null 
    }),
    signOut: () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({
      data: { subscription: { unsubscribe: () => {} } }
    }),
  },
  
  channel: () => ({
    on: () => mockClient.channel(),
    subscribe: () => Promise.resolve({ status: 'SUBSCRIBED' }),
    unsubscribe: () => Promise.resolve({ status: 'CLOSED' }),
  }),
  
  removeChannel: () => {},
}

export const createClient = () => mockClient

// This will be used by Jest's module mocking system
export default mockClient 