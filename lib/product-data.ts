import { apiClient } from "./api-client";

export interface Product {
  id: number;
  name: string;
  brand: string;
  vendor: string;
  ean: string;
  url: string;
  image: string;
  category: Array<{
    id: number;
    depth: number;
    name: string;
  }>;
  description: string | null;
  ingredients: string | null;
  current_price: number;
  current_unit_price: number;
  weight: number;
  weight_unit: string;
  store: {
    name: string;
    code: string;
    url: string;
    logo: string;
  };
  price_history: Array<{
    price: number;
    date: string;
  }>;
  allergens: Array<{
    code: string;
    display_name: string;
    contains: string;
  }>;
  nutrition: Array<{
    code: string;
    display_name: string;
    amount: number;
    unit: string;
  }>;
  labels: Array<{
    name: string;
    display_name: string;
    description?: string;
    icon?: {
      svg: string;
      png: string;
    };
  }>;
  created_at: string;
  updated_at: string;
}

export interface ApiResponse {
  data: Product[];
  meta?: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export async function fetchProducts(page = 1, size = 50): Promise<ApiResponse> {
  try {
    const data = await apiClient.getProducts(page, size);
    return {
      data: data?.data || [],
      meta: data?.meta || undefined,
    };
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
}

export async function searchProducts(
  query: string,
  page = 1,
  size = 50
): Promise<ApiResponse> {
  try {
    const data = await apiClient.searchProducts(query, page, size);
    return {
      data: data?.data || [],
      meta: data?.meta || undefined,
    };
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
}

// Keep some mock data as fallback
export const fallbackProducts: Product[] = [
  {
    id: 1881,
    name: "Monster Ultra White 0,5l boks",
    brand: "Monster",
    vendor: "Coca-cola europacific partners norge as",
    ean: "5060337502238",
    url: "https://joker.no/nettbutikk/varer/drikkevarer/energidrikk/monster-5060337502238",
    image: "https://bilder.ngdata.no/5060337502238/kmh/large.jpg",
    category: [
      {
        id: 26,
        depth: -1,
        name: "Drikke",
      },
      {
        id: 111,
        depth: 0,
        name: "Energidrikk",
      },
    ],
    description: null,
    ingredients:
      "Kullsyreholdig vann, syre (sitronsyre), taurin (0.4%), surhetsregulerende middel (natriumsitrater), aromaer, panax ginsengrot-ekstrakt (0.08%), søtstoffer (sukralose, acesulfam k), konserveringsmidler (sorbinsyre, bensoesyre), koffein (0.03%), vitaminer (niacin (vit b3), pantotensyre (vit b5), b6, b12), inositol.",
    current_price: 29.9,
    current_unit_price: 59.8,
    weight: 500,
    weight_unit: "ml",
    store: {
      name: "Joker",
      code: "JOKER_NO",
      url: "https://joker.no/nettbutikk/varer",
      logo: "https://kassal.app/logos/Joker.svg",
    },
    price_history: [
      {
        price: 29.9,
        date: "2025-05-19T07:00:20.000000Z",
      },
    ],
    allergens: [],
    nutrition: [],
    labels: [],
    created_at: "2022-01-09T18:29:23.000000Z",
    updated_at: "2025-05-19T07:00:20.000000Z",
  },
];
