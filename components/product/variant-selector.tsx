'use client';

import clsx from 'clsx';
import {ProductSize} from 'lib/shopify/types';
import {createUrl} from 'lib/utils';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {getAvailableFilters, getProductDescriptionFilters} from "../../utils/single-product";
import {useState} from "react";


export function VariantSelector({
                                    options,
   }: {
    options: ProductSize[];
}) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const defaultOptions = options.find(
        (elt: ProductSize) => elt.color.title === "Default");
    const otherOptions = options.filter(
        (elt: ProductSize) => elt.color.title !== "Default");
    const optionKeys = Object.keys(defaultOptions || {}).filter(
        (elt: string) => !["id", "disabled"].includes(elt)
    );

    let defaultFilters: string[] = [];
    if (defaultOptions) {
        defaultFilters = getAvailableFilters("", options, "");
    }

    const [availableOptions, setAvailableOptions] = useState<string[]>(
        defaultFilters
    );

    const setAvailableFilters = (option: string, value: string) => {
        const available = getAvailableFilters(option, options, value);
        setAvailableOptions(available);
    }

    const addRouteParam = (option: string, value: string) => {
        setAvailableFilters(option, value);
        const optionSearchParams = new URLSearchParams(searchParams.toString());
        optionSearchParams.set(option?.toLowerCase(), value);
        const optionUrl = createUrl(pathname, optionSearchParams);
        router.push(optionUrl);
    }

    return optionKeys.map((option, index) => {
        const optionValues = getProductDescriptionFilters(
            option,
            defaultOptions ? defaultOptions[option] : [],
            otherOptions
        )
        return (
            <dl className="mb-8" key={`${option}-${index}`}>
                {optionValues.length ?
                    <dt className="mb-4 text-sm uppercase tracking-wide">{option}</dt>
                : null}
            <dd className="flex flex-wrap gap-3">
                {optionValues.map((value) => {

                    const isActive = searchParams.get(option?.toLowerCase()) === value?.title;
                    const isAvailableForSale = availableOptions?.includes(value.title);

                    return (
                        <button
                            key={value.id}
                            aria-disabled={!isAvailableForSale}
                            disabled={!isAvailableForSale}
                            onClick={() => {
                                addRouteParam(option, value.title);
                            }}
                            title={`${option} ${value.title}${!isAvailableForSale ? ' (Out of Stock)' : ''}`}
                            className={clsx(
                                'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                                {
                                    'cursor-default ring-2 ring-blue-600': isActive,
                                    'ring-1 ring-transparent transition duration-300 ease-in-out hover:scale-110 hover:ring-blue-600 ':
                                        !isActive && isAvailableForSale,
                                    'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 before:dark:bg-neutral-700':
                                        !isAvailableForSale
                                }
                            )}
                        >
                            {value.title}
                        </button>
                    );
                })}
            </dd>
        </dl>
        );
    });

}
