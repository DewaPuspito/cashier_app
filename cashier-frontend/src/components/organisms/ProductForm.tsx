'use client';

import { Input } from '../atomics/Input';
import { Button } from '../atomics/Button';
import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { Category, ProductFormData } from '@/types/product';
import { uploadImage } from '@/lib/cloudinary';

interface ProductFormProps {
  initialData?: {
    name: string;
    price: number;
    stock: number;
    category: Category;
    imageUrl: string;
  };
  onSubmit: (data: ProductFormData) => void;
}

export const ProductForm = ({ initialData, onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: 0,
    stock: 0,
    category: Category.FOOD,
    imageUrl: '',
  });
  const [imageUrl, setImageUrl] = useState<string>("");

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        price: initialData.price,
        stock: initialData.stock,
        category: initialData.category,
        imageUrl: initialData.imageUrl,
      });
    }
  }, [initialData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
  
    try {
      const uploadedUrl = await uploadImage(file);
      setImageUrl(uploadedUrl);
      setFormData((prev) => ({
        ...prev,
        imageUrl: uploadedUrl,
      }));
    } catch (err) {
      console.error("Failed to upload image:", err);
    }
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
  
    try {
      const finalData: ProductFormData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
        imageUrl,
      };
  
      console.log('Final submitted data:', finalData);
      onSubmit(finalData);
    } catch (error) {
      console.error('Image upload failed:', error);
    }
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
        required
        className="bg-gray-500 border border-black"
      />
      {formData.imageUrl && (
        <div className="mt-2">
          <img 
            src={formData.imageUrl} 
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
