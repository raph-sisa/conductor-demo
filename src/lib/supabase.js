import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please check your .env.local file and ensure you have:\n' +
    '- REACT_APP_SUPABASE_URL\n' +
    '- REACT_APP_SUPABASE_ANON_KEY'
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // Configure auth settings
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  // Additional client options can be added here
  realtime: {
    // Enable realtime features if needed
    enabled: true
  }
})

// Helper function to test the connection
export const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('_test').select('*').limit(1)
    
    if (error) {
      // If we get a permission error, it means we're connected but the table doesn't exist
      // This is expected for a new project
      if (error.code === 'PGRST116' || error.message.includes('relation "_test" does not exist')) {
        console.log('✅ Supabase connection successful!')
        return { success: true, message: 'Connection successful' }
      }
      throw error
    }
    
    console.log('✅ Supabase connection successful!')
    return { success: true, message: 'Connection successful', data }
  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    return { success: false, message: error.message, error }
  }
}

// Export default client
export default supabase