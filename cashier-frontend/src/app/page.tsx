import { Navbar } from "@/components/organisms/navbar"
import { Button } from "@/components/atomics/Button";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-4 text-blue-700">Selamat datang di KasirApp</h1>
        <p className="text-lg text-gray-700 mb-6">Aplikasi kasir modern untuk usaha Anda.</p>
        <Link href="/login">
          <Button>Login Sekarang</Button>
        </Link>
      </main>
    </div>
  );
}
