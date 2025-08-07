import React from 'react';
import { Product } from '@/types/product';
import { TransactionItemInput } from '@/types/transaction';
import { Input } from '@/components/atomics/Input';
import { Button } from '@/components/atomics/Button';
import ReactSelect from 'react-select';

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
      <ReactSelect
        className="w-1/2 text-black border-black"
        value={products
          .map((product) => ({
            value: product.id,
            label: product.name,
          }))
          .find((option) => option.value === selectedProductId) || null}
        onChange={(selectedOption) =>
          onChange({
            productId: selectedOption?.value || '',
            quantity,
          })
        }
        options={products.map((product) => ({
          value: product.id,
          label: product.name,
        }))}
        placeholder="Select a product"
        isSearchable
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
