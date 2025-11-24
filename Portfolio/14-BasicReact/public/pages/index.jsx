import Link from 'next/link';

export default function Home() {
  return (
    <main style={{padding: '2rem'}}>
      <h1>Basic React — Next Template</h1>
      <p>
        Demo page: <Link href="/demo-react">/demo-react</Link>
      </p>
    </main>
  );
}
