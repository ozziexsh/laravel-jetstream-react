import { usePage } from '@inertiajs/react';
import { InertiaSharedProps } from '@/types';

export default function useTypedPage<T = {}>() {
  return usePage<InertiaSharedProps<T>>();
}
