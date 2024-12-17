import Link from 'next/link'

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Welcome to Your Crypto Portfolio</h1>
      <p className="text-xl mb-8 text-[#787774] dark:text-gray-300">Track your crypto investments with ease.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/trades" className="block p-6 bg-[#f7f7f7] rounded-lg hover:bg-[#eaeaea] transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
          <h2 className="text-2xl font-semibold mb-2 text-[#37352f] dark:text-white">Record Trades</h2>
          <p className="text-[#787774] dark:text-gray-300">Log your cryptocurrency transactions.</p>
        </Link>
        <Link href="/portfolio" className="block p-6 bg-[#f7f7f7] rounded-lg hover:bg-[#eaeaea] transition-colors dark:bg-gray-800 dark:hover:bg-gray-700">
          <h2 className="text-2xl font-semibold mb-2 text-[#37352f] dark:text-white">View Portfolio</h2>
          <p className="text-[#787774] dark:text-gray-300">See your current holdings and performance.</p>
        </Link>
      </div>
    </div>
  )
}
