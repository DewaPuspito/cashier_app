import React from 'react';
import { Product } from '@/types/product';
import { TransactionItemInput } from '@/types/transaction';
import { Input } from '@/components/atomics/Input';
import { Select } from '@/components/atomics/Select';
import { Button } from '@/components/atomics/Button';

export interface ProductRowProps {
  index: number;
  products: Product[];
  selectedProductId: string;
  quantity: number;
  onChange: (updatedItem: TransactionItemInput) => void;
  onRemove: () => void;
  disableRemove?: boolean;
}

export const ProductRow: React.FC<ProductRowProps> = ({
  products,
  selectedProductId,
  quantity,
  onChange,
  onRemove,
  disableRemove = false,
}) => {
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ productId: selectedProductId, quantity: parseInt(e.target.value) || 1 });
  };

  return (
    <div className="flex items-center space-x-4">
      <Select
        value={selectedProductId}
        onChange={(e) =>
          onChange({
            productId: e.target.value,
            quantity,
          })
        }
        options={[
          { value: '', label: 'Select a product' },
          ...products.map((product) => ({
            value: product.id,
            label: product.name,
          })),
        ]}
        className="border rounded px-2 py-1 text-black"
      />


      <Input
        type="number"
        min={1}
        value={quantity}
        onChange={handleQuantityChange}
        className="w-1/4"
      />

      {!disableRemove && (
        <Button variant="danger" onClick={onRemove}>
          Remove
        </Button>
      )}
    </div>
  );
};
