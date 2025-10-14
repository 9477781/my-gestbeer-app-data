export interface BeerDetails {
  id: number;
  name_ja: string;
  name_en: string;
  type: string;
  abv: string;
  ibu?: number;
  price_us_pint: number;
  price_us_pint_happy_hour?: number;
  price_uk_half_pint: number;
  production_area_ja: string;
  production_area_en: string;
  brewery_ja: string;
  brewery_en: string;
  features_ja: string[];
  features_en: string[];
  image_url: string;
}

export interface GuestBeerMasterData {
  stores: Record<string, string>; // store name -> store URL
  beers: (BeerDetails & { available_at: string[] })[];
}
