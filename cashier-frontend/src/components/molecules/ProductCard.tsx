import Image from 'next/image';
import { Product } from '@/types/product';

interface Props {
  product: Product;
}

export const ProductCard = ({ product }: Props) => {
  const { name, category, stock, imageUrl, price } = product;

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
        <p className="text-sm text-gray-500">{category}</p>
        <p className="text-sm text-gray-500">Stock: {stock}</p>
        <p className="mt-auto text-blue-600 text-lg font-bold mt-2">
          Rp {price.toLocaleString()}
        </p>
      </div>
    </div>
  );
};
