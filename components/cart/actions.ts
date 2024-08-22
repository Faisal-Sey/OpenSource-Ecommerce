'use server';

import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import {addItemToCart, createCart, getCart, removeCartItem, updateCartItem} from "../../lib/axios";
import {isObjectLengthValid} from "../../utils/single-product";
import {ProductItem} from "../../lib/shopify/types";
import {UpdateCartItem} from "../../lib/axios/types";

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
      console.log("cart", cart);
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
        image_id: product.images[parseInt(image || "0")]?.id || null,
        quantity: 1,
        product_size: selectedVariant
      }
      await addItemToCart(cartId, cartInfo);
    }
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, cartItemId: string) {
  try {
    await removeCartItem(cartItemId);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    cartItemId: string,
    cartItemInfo: UpdateCartItem
  }
) {
  if (payload.cartItemInfo.quantity <= 0) {
    await removeCartItem(payload.cartItemId);
    return;
  }

  try {
    await updateCartItem(payload.cartItemId, payload.cartItemInfo);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error updating item quantity';
  }
}
