'use server';

import { TAGS } from 'lib/constants';
import {removeFromCart, updateCart} from 'lib/shopify';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import {addToCart, createCart, getCart} from "../../lib/axios";
import {isObjectLengthValid} from "../../utils/single-product";
import {ProductItem} from "../../lib/shopify/types";

export async function addItem(
    prevState: any,
    {
      selectedVariant,
      optionKeys,
        product
    }: {
      selectedVariant: Record<string, string>;
      optionKeys: string[],
      product: ProductItem
    }
) {
  let cartId = cookies().get('cartId')?.value;
  let cart;

  if (cartId) {
    cart = await getCart(cartId);
  }

  if (!cartId || !cart) {
    cart = await createCart();
    if (cart) {
      cartId = cart.id as string;
      cookies().set('cartId', cartId);
    }
  }

  if (!isObjectLengthValid(selectedVariant, optionKeys.length)) {
    return 'Missing product variant ID';
  }

  try {
    if (cartId) {
      const image = selectedVariant?.image;
      delete selectedVariant?.image;
      const cartInfo = {
        product_id: product.id,
        total_amount: product.price,
        image_id: product.images[parseInt(image || "0")]?.id,
        quantity: 1,
        product_size: selectedVariant
      }
      await addToCart(cartId, cartInfo);
    }
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, lineId: string) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  try {
    await removeFromCart(cartId, [lineId]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    lineId: string;
    variantId: string;
    quantity: number;
  }
) {
  const cartId = cookies().get('cartId')?.value;

  if (!cartId) {
    return 'Missing cart ID';
  }

  const { lineId, variantId, quantity } = payload;

  try {
    if (quantity === 0) {
      await removeFromCart(cartId, [lineId]);
      revalidateTag(TAGS.cart);
      return;
    }

    await updateCart(cartId, [
      {
        id: lineId,
        merchandiseId: variantId,
        quantity
      }
    ]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
