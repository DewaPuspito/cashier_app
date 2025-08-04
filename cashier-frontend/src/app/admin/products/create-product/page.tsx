import { ProductFormTemplate } from "@/components/templates/AdminProductFormTemplate";
import { Navbar } from '@/components/organisms/Navbar';

export default function CreateCashierPage() {
return (
    <div className="min-h-screen bg-gray-50">
        <Navbar />
        <ProductFormTemplate mode="create" />;
    </div>
)
}
