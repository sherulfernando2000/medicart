import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { X, RefreshCw } from 'lucide-react';
import { generateSKU } from '../utils/skuGenerator';
import { useInventory } from '../context/InventoryContext';
import { Product } from '../types';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit: Product | null;
}

interface FormValues {
  name: string;
  sku: string;
  category: string;
  price: number | '';
  stock: number | '';
}

export default function ProductModal({ isOpen, onClose, productToEdit }: ProductModalProps) {
  const { addProduct, editProduct, products, categories } = useInventory();
  
  if (!isOpen) return null;

  const isEditing = !!productToEdit;

  // Validation Schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .trim()
      .min(3, 'Product name must be at least 3 characters')
      .required('Product name is required'),
    sku: Yup.string()
      .trim()
      .matches(/^PRD-[A-Z0-9]{6}$/, 'SKU must follow the format PRD-XXXXXX (6 capital alphanumeric characters)')
      .required('Product SKU is required')
      .test('unique-sku', 'This SKU is already in use by another product', function (value) {
        if (isEditing) return true; // SKU cannot be changed during editing
        return !products.some(p => p.sku.toUpperCase() === value?.toUpperCase());
      }),
    category: Yup.string()
      .required('Please select a category'),
    price: Yup.number()
      .typeError('Price must be a number')
      .positive('Price must be greater than zero')
      .required('Price is required'),
    stock: Yup.number()
      .typeError('Stock quantity must be a number')
      .integer('Stock quantity must be an integer')
      .min(0, 'Stock quantity cannot be less than 0')
      .required('Stock quantity is required'),
  });

  const initialValues: FormValues = productToEdit
    ? {
        name: productToEdit.name,
        sku: productToEdit.sku,
        category: productToEdit.category,
        price: productToEdit.price,
        stock: productToEdit.stock,
      }
    : {
        name: '',
        sku: generateSKU(),
        category: categories[0] || '',
        price: '',
        stock: '',
      };

  const handleSubmit = (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    let success = false;
    
    const submissionData = {
      name: values.name,
      sku: values.sku,
      category: values.category,
      price: Number(values.price),
      stock: Number(values.stock),
    };

    if (isEditing && productToEdit) {
      success = editProduct(productToEdit.sku, submissionData);
    } else {
      success = addProduct(submissionData);
    }

    setSubmitting(false);
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            {isEditing ? 'Edit Product Details' : 'Add New Product'}
          </h2>
          <button 
            onClick={onClose} 
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Container */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting, setFieldValue, touched, errors }) => (
            <Form className="flex flex-col p-6 space-y-5">
              
              {/* Product SKU */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product ID / SKU
                </label>
                <div className="relative flex items-stretch">
                  <Field
                    type="text"
                    name="sku"
                    disabled={isEditing}
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
                      isEditing 
                        ? 'opacity-60 cursor-not-allowed border-slate-200 dark:border-slate-800' 
                        : touched.sku && errors.sku
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  {!isEditing && (
                    <button
                      type="button"
                      onClick={() => setFieldValue('sku', generateSKU())}
                      title="Regenerate unique SKU"
                      className="ml-2 px-3.5 flex items-center justify-center bg-violet-100 hover:bg-violet-200 text-violet-700 dark:bg-violet-955/60 dark:hover:bg-violet-900/60 dark:text-violet-305 rounded-xl transition-all border border-violet-200/50 dark:border-violet-850/50"
                    >
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="mt-1 text-xs text-red-500">
                  <ErrorMessage name="sku" />
                </div>
              </div>

              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Product Name
                </label>
                <Field
                  type="text"
                  name="name"
                  placeholder="e.g. Ergonomic Office Chair"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
                    touched.name && errors.name
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                <div className="mt-1 text-xs text-red-500">
                  <ErrorMessage name="name" />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category
                </label>
                <Field
                  as="select"
                  name="category"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
                    touched.category && errors.category
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </Field>
                <div className="mt-1 text-xs text-red-500">
                  <ErrorMessage name="category" />
                </div>
              </div>

              {/* Two Column Row: Price & Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Price ($)
                  </label>
                  <Field
                    type="number"
                    name="price"
                    step="0.01"
                    placeholder="29.99"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
                      touched.price && errors.price
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  <div className="mt-1 text-xs text-red-500">
                    <ErrorMessage name="price" />
                  </div>
                </div>

                {/* Stock Quantity */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Stock Quantity
                  </label>
                  <Field
                    type="number"
                    name="stock"
                    placeholder="10"
                    className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
                      touched.stock && errors.stock
                        ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  />
                  <div className="mt-1 text-xs text-red-500">
                    <ErrorMessage name="stock" />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-55/60 dark:hover:bg-slate-800/80 text-slate-600 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-750 active:scale-98 text-white shadow-lg shadow-violet-550/20 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  {isSubmitting ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Product'}
                </button>
              </div>

            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
