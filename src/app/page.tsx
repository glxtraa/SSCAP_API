// SSCAP API - Vercel Blob Implementation
export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SSCAP API Server</h1>
      <p>Data reception server for SSCAP systems.</p>
      <ul style={{ marginBottom: '2rem' }}>
        <li>POST /api/utilizado</li>
        <li>POST /api/captado</li>
        <li>POST /api/nivel</li>
      </ul>

      <div style={{ marginTop: '2rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
        <a 
          href="/api/download" 
          download 
          style={{
            display: 'inline-block',
            padding: '0.8rem 1.5rem',
            backgroundColor: '#0070f3',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '5px',
            fontWeight: 'bold'
          }}
        >
          Download All Data (.json)
        </a>
        <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
          Note: This will fetch all records from your Vercel Blob store.
        </p>
      </div>
    </main>
  );
}
