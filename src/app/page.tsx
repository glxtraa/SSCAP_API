export default function Home() {
  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SSCAP API Server</h1>
      <p>Data reception server for SSCAP systems.</p>
      <ul>
        <li>POST /api/utilizado</li>
        <li>POST /api/captado</li>
        <li>POST /api/nivel</li>
      </ul>
    </main>
  );
}
