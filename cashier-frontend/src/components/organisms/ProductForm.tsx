'use client';

import { Input } from '../atomics/Input';
import { Button } from '../atomics/Button';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Category, ProductFormData } from '@/types/product';

interface ProductFormProps {
  initialData?: ProductFormData;
  onSubmit: (data: FormData) => void;
}

export const ProductForm = ({ initialData, onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    stock: 0,
    category: Category.FOOD,
    imageUrl: '',
  });

  const [imagePreviewUrl, setImagePreviewUrl] = useState<string>('');

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (typeof initialData.imageUrl === 'string') {
        setImagePreviewUrl(initialData.imageUrl);
      }
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value,
    });
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData({
      ...formData,
      imageUrl: file,
    });
    setImagePreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('price', String(formData.price));
    data.append('stock', String(formData.stock));
    data.append('category', formData.category);

    if (formData.imageUrl instanceof File) {
      data.append('imageUrl', formData.imageUrl);
    }

    onSubmit(data);
  };

  const isUpdate = Boolean(initialData);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Name"
        name="name"
        placeholder="Enter product name"
        value={formData.name}
        onChange={handleChange}
        required
      />
      <Input
        label="Price"
        name="price"
        type="number"
        placeholder="Enter price"
        value={formData.price}
        onChange={handleChange}
        required
      />
      <Input
        label="Stock"
        name="stock"
        type="number"
        placeholder="Enter stock"
        value={formData.stock}
        onChange={handleChange}
        required={!isUpdate}
      />
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300 text-gray-900"
        >
          {Object.values(Category).map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>
      <Input
        label="Product Image"
        name="imageUrl"
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        required={!isUpdate}
      />
      {imagePreviewUrl && (
        <div className="mt-2">
          <img
            src={imagePreviewUrl}
            alt="Preview"
            className="w-32 h-32 object-cover rounded-lg"
          />
        </div>
      )}
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="submit">{isUpdate ? 'Update' : 'Add'}</Button>
      </div>
    </form>
  );
};
