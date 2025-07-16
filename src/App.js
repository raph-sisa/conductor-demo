import React from 'react'
import ConnectionTest from './ConnectionTest'

function App() {
  return (
    <div className="App">
      <header style={{ 
        textAlign: 'center', 
        padding: '20px',
        backgroundColor: '#f3f4f6',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <h1 style={{ 
          margin: 0, 
          color: '#1f2937',
          fontFamily: 'system-ui, sans-serif'
        }}>
          To-Do App Demo
        </h1>
        <p style={{ 
          margin: '5px 0 0 0', 
          color: '#6b7280',
          fontSize: '14px'
        }}>
          Supabase Configuration Test
        </p>
      </header>
      
      <main>
        <ConnectionTest />
        
        <div style={{ 
          padding: '20px', 
          margin: '20px',
          backgroundColor: '#eff6ff',
          borderRadius: '8px',
          border: '1px solid #bfdbfe'
        }}>
          <h3 style={{ 
            margin: '0 0 10px 0', 
            color: '#1e40af',
            fontFamily: 'system-ui, sans-serif'
          }}>
            Next Steps
          </h3>
          <ul style={{ 
            margin: 0, 
            color: '#1e40af',
            fontSize: '14px'
          }}>
            <li>Create your Supabase project at https://supabase.com</li>
            <li>Update .env.local with your actual project credentials</li>
            <li>Restart the development server</li>
            <li>Watch the connection test above turn green!</li>
          </ul>
        </div>
      </main>
    </div>
  )
}

export default App