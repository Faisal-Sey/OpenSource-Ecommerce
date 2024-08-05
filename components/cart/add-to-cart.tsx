'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import LoadingDots from 'components/loading-dots';
import {ProductItem, ProductSize} from 'lib/shopify/types';
import { useSearchParams } from 'next/navigation';
import { useFormState, useFormStatus } from 'react-dom';
import {getAllParams, isObjectLengthValid} from "../../utils/single-product";

function SubmitButton({
  availableForSale,
  selectedVariant,
  optionKeys
}: {
  availableForSale: boolean;
  selectedVariant: Record<string, string>;
  optionKeys: string[];
}) {
  const { pending } = useFormStatus();
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (!availableForSale) {
    return (
      <button aria-disabled className={clsx(buttonClasses, disabledClasses)}>
        Out Of Stock
      </button>
    );
  }

  if (!isObjectLengthValid(selectedVariant, optionKeys.length)) {
    return (
      <button
        aria-label="Please select an option"
        aria-disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        <div className="absolute left-0 ml-4">
          <PlusIcon className="h-5" />
        </div>
        Add To Cart
      </button>
    );
  }

  return (
    <button
      onClick={(e: React.FormEvent<HTMLButtonElement>) => {
        if (pending) e.preventDefault();
      }}
      aria-label="Add to cart"
      aria-disabled={pending}
      className={clsx(buttonClasses, {
        'hover:opacity-90': true,
        [disabledClasses]: pending
      })}
    >
      <div className="absolute left-0 ml-4">
        {pending ? <LoadingDots className="mb-3 bg-white" /> : <PlusIcon className="h-5" />}
      </div>
      Add To Cart
    </button>
  );
}

export function AddToCart({
  product
}: {
  product: ProductItem;
}) {
  const [message, formAction] = useFormState(addItem, null);
  const searchParams = useSearchParams();

  const selectedVariant = getAllParams(searchParams.entries());
  const defaultOptions = product.sizes.find(
      (elt: ProductSize) => elt.color.title === "Default");
  const optionKeys = Object.keys(defaultOptions || {}).filter(
      (elt: string) => !["id", "disabled"].includes(elt)
  );
  // const actionWithVariant = formAction.bind(null, selectedVariantId);
  const actionWithVariant = formAction.bind(null, {selectedVariant, optionKeys, product});

  return (
    <form action={actionWithVariant}>
      <SubmitButton
          availableForSale={product.for_sale}
          selectedVariant={selectedVariant}
          optionKeys={optionKeys}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
