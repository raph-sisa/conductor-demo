import React, { useState, useEffect } from 'react'
import { testConnection } from './lib/supabase'

const ConnectionTest = () => {
  const [connectionStatus, setConnectionStatus] = useState('testing')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const runTest = async () => {
      try {
        const result = await testConnection()
        setConnectionStatus(result.success ? 'success' : 'error')
        setMessage(result.message)
      } catch (error) {
        setConnectionStatus('error')
        setMessage(error.message)
      }
    }

    runTest()
  }, [])

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'testing': return '#fbbf24'
      case 'success': return '#10b981'
      case 'error': return '#ef4444'
      default: return '#6b7280'
    }
  }

  const getStatusIcon = () => {
    switch (connectionStatus) {
      case 'testing': return '🔍'
      case 'success': return '✅'
      case 'error': return '❌'
      default: return '⚪'
    }
  }

  return (
    <div style={{ 
      padding: '20px', 
      borderRadius: '8px', 
      border: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      margin: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#374151' }}>
        Supabase Connection Test
      </h3>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '10px',
        marginBottom: '10px'
      }}>
        <span style={{ fontSize: '20px' }}>{getStatusIcon()}</span>
        <span style={{ 
          fontWeight: 'bold', 
          color: getStatusColor(),
          textTransform: 'capitalize'
        }}>
          {connectionStatus}
        </span>
      </div>
      
      <p style={{ 
        margin: '10px 0', 
        color: '#6b7280',
        fontSize: '14px'
      }}>
        {message}
      </p>
      
      <div style={{ 
        fontSize: '12px', 
        color: '#9ca3af',
        marginTop: '15px',
        padding: '10px',
        backgroundColor: '#f3f4f6',
        borderRadius: '4px'
      }}>
        <strong>Environment Variables:</strong><br />
        Supabase URL: {process.env.REACT_APP_SUPABASE_URL || 'Not set'}<br />
        Supabase Key: {process.env.REACT_APP_SUPABASE_ANON_KEY ? 'Set' : 'Not set'}
      </div>
      
      {connectionStatus === 'error' && (
        <div style={{ 
          fontSize: '12px', 
          color: '#dc2626',
          marginTop: '10px',
          padding: '10px',
          backgroundColor: '#fef2f2',
          borderRadius: '4px',
          border: '1px solid #fecaca'
        }}>
          <strong>Troubleshooting:</strong><br />
          1. Create a Supabase project at https://supabase.com<br />
          2. Update .env.local with your actual credentials<br />
          3. Make sure to restart your development server
        </div>
      )}
    </div>
  )
}

export default ConnectionTest