import type { VariantConfigExtended } from '@/types/variant-extended';
import { DEFAULT_PANELS, DEFAULT_MAP_LAYERS, MOBILE_DEFAULT_MAP_LAYERS } from '../panels';

export const VARIANT_CONFIG: VariantConfigExtended = {
    name: 'sports',
    description: 'Global Sports & Events Intelligence',
    panels: DEFAULT_PANELS,
    mapLayers: DEFAULT_MAP_LAYERS,
    mobileMapLayers: MOBILE_DEFAULT_MAP_LAYERS,
    theme: 'dark',
};
