"use client";
import React from "react";
import Button from "../SharedComponents/Button";
import { buildAssetUrl } from "@/utils/apiBase";

interface ProductDetailsProps {
  product: any;
  onClose: () => void;
}

export default function ProductDetails({ product, onClose }: ProductDetailsProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">{product.title}</h2>
          <Button
            text="×"
            btnType="button"
            className="text-gray-500 hover:text-gray-700 text-2xl"
            onClick={onClose}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Product Images</h3>
            {product.imgCover && (
              <div className="mb-3">
                <h4 className="font-medium mb-1">Cover Image</h4>
                <img
                  src={buildAssetUrl(product.imgCover)}
                  alt="Cover"
                  className="w-full h-40 object-cover rounded border-2 border-blue-500"
                />
              </div>
            )}
            {product.images && product.images.length > 0 ? (
              <div>
                <h4 className="font-medium mb-2">All Images</h4>
                <div className="grid grid-cols-2 gap-2">
                  {product.images.map((imageUrl: string, idx: number) => (
                    <img
                      key={idx}
                      src={buildAssetUrl(imageUrl)}
                      alt={`Product ${idx + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              </div>
            ) : (
              !product.imgCover && <p className="text-gray-500">No images available</p>
            )}
          </div>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Description</h3>
              <p className="text-gray-700">{product.description}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {product.brand && (
                <div>
                  <h4 className="font-semibold">Brand</h4>
                  <p>{product.brand}</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold">Category</h4>
                <p>{product.category}</p>
              </div>
              <div>
                <h4 className="font-semibold">Price</h4>
                <p>${product.price}</p>
              </div>
              {product.discount && (
                <div>
                  <h4 className="font-semibold">Discount</h4>
                  <p>{product.discount}%</p>
                </div>
              )}
              <div>
                <h4 className="font-semibold">New Product</h4>
                <p>{product.new ? "Yes" : "No"}</p>
              </div>
              <div>
                <h4 className="font-semibold">On Sale</h4>
                <p>{product.sale ? "Yes" : "No"}</p>
              </div>
            </div>
          </div>
        </div>
        
        {product.variants && product.variants.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Variants</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {product.variants.map((variant: any, idx: number) => (
                <div key={idx} className="border p-3 rounded">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    {variant.id && <div><strong>ID:</strong> {variant.id}</div>}
                    {variant.sku && <div><strong>SKU:</strong> {variant.sku}</div>}
                    {variant.size && <div><strong>Size:</strong> {variant.size}</div>}
                    {variant.color && <div><strong>Color:</strong> {variant.color}</div>}
                    {variant.image_id !== null && <div><strong>Image Index:</strong> {variant.image_id}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-6 flex justify-end">
          <Button
            text="Close"
            btnType="button"
            className="bg-gray-500 text-white px-6 py-2 rounded"
            onClick={onClose}
          />
        </div>
      </div>
    </div>
  );
}