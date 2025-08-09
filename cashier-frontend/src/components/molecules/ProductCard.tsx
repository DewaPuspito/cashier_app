import Image from 'next/image';
import { Product } from '@/types/product';
import { Button } from '../atomics/Button';

interface Props {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export const ProductCard = ({ product, onEdit, onDelete }: Props) => {
  const { name, category, stock, imageUrl, price, id } = product;

  const formatCategory = (category: string) => {
    return category
      .toLowerCase()
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
      <Image
        src={
          imageUrl ||
          'https://i.pinimg.com/736x/2a/86/a5/2a86a560f0559704310d98fc32bd3d32.jpg'
        }
        alt={name}
        width={320}
        height={200}
        className="w-full h-48 object-cover object-center"
      />
      <div className="p-4 flex flex-col flex-1">
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-500">{formatCategory(category)}</p>
        <p className="text-sm text-gray-500">Stock: {stock}</p>
        <p className="mt-auto text-blue-600 text-lg font-bold mt-2">
          Rp {price.toLocaleString()}
        </p>

        <div className="mt-4 flex gap-2">
          <Button variant="secondary" onClick={() => onEdit(product)}>
            Edit
          </Button>
          <Button variant="danger" onClick={() => onDelete(id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};