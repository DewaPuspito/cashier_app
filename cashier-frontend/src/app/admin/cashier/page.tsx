import { AdminCashierTemplate } from '@/components/templates/CashierTemplate';
import { Navbar } from '@/components/organisms/Navbar';

export default function CashierPage() {
return (
    <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <AdminCashierTemplate />
    </div>
);
}
