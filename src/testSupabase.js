// Simple test script to verify Supabase connection
// Run this with: node -r dotenv/config src/testSupabase.js

import { testConnection } from './lib/supabase.js'

async function runTest() {
  console.log('🔍 Testing Supabase connection...')
  console.log('📡 Supabase URL:', process.env.REACT_APP_SUPABASE_URL || 'Not set')
  console.log('🔑 Supabase Key:', process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set')
  console.log('---')
  
  const result = await testConnection()
  
  if (result.success) {
    console.log('✅ Test passed! Supabase is configured correctly.')
    console.log('📝 Message:', result.message)
  } else {
    console.log('❌ Test failed!')
    console.log('📝 Error:', result.message)
    console.log('💡 Make sure to:')
    console.log('   1. Create a Supabase project at https://supabase.com')
    console.log('   2. Update .env.local with your actual credentials')
    console.log('   3. Install dependencies with npm install')
  }
}

runTest().catch(console.error)