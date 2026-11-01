import React from 'react';
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from 'formik';
import * as Yup from 'yup';
import { X } from 'lucide-react';
import { useInventory } from '../context/InventoryContext';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormValues {
  categoryName: string;
}

export default function CategoryModal({ isOpen, onClose }: CategoryModalProps) {
  const { addCategory, categories } = useInventory();

  if (!isOpen) return null;

  const validationSchema = Yup.object().shape({
    categoryName: Yup.string()
      .trim()
      .min(2, 'Category name must be at least 2 characters')
      .required('Category name is required')
      .test('unique-category', 'Category already exists', function (value) {
        if (!value) return true;
        return !categories.some(cat => cat.toLowerCase() === value.toLowerCase());
      }),
  });

  const handleSubmit = (values: FormValues, { setSubmitting, resetForm }: FormikHelpers<FormValues>) => {
    const success = addCategory(values.categoryName);
    setSubmitting(false);
    if (success) {
      resetForm();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col transition-all duration-300 transform scale-100">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            Create Custom Category
          </h2>
          <button 
            onClick={onClose} 
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={{ categoryName: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, touched, errors }) => (
            <Form className="flex flex-col p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Category Name
                </label>
                <Field
                  type="text"
                  name="categoryName"
                  placeholder="e.g. Kitchenware"
                  className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-slate-50 dark:bg-slate-950/40 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all ${
                    touched.categoryName && errors.categoryName
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                />
                <div className="mt-1 text-xs text-red-500">
                  <ErrorMessage name="categoryName" />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium rounded-xl border border-slate-200 dark:border-slate-855 hover:bg-slate-55/65 dark:hover:bg-slate-800/80 text-slate-605 dark:text-slate-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 text-sm font-semibold rounded-xl bg-violet-600 hover:bg-violet-700 active:scale-98 text-white shadow-lg shadow-violet-550/20 disabled:opacity-50 disabled:scale-100 transition-all"
                >
                  {isSubmitting ? 'Creating...' : 'Add Category'}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
