import { CashierFormTemplate } from '@/components/templates/CashierFormTemplate';
import { Navbar } from '@/components/organisms/Navbar';

export default function CreateCashierPage() {
return (
    <div className="min-h-screen bg-gray-50 pt-20">
        <Navbar />
        <CashierFormTemplate mode="create" />;
    </div>
    )
}