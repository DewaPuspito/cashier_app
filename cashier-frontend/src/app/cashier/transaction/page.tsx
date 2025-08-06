import { Navbar } from '@/components/organisms/Navbar';
import { TransactionFormTemplate } from '@/components/templates/TransactionFormTemplate';
import { ShiftGuard } from '@/components/molecules/ShiftGuard';

export default function TransactionPage() {
  return (
    <ShiftGuard>
      <div className="min-h-screen bg-gray-50 pt-20">
          <Navbar />
          <TransactionFormTemplate />
      </div>
    </ShiftGuard>
)
}
