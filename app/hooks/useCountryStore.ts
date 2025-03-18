// app/hooks/useCountryStore.ts
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { countries } from "@/app/lib/data/countries";

interface Currency {
  code: string;
  symbol: string;
  rate: number;
}

export interface Country {
  code: string;
  name: string;
  flag: string;
  currency?: Currency;
}

interface CountryStore {
  currentCountry: Country | null;
  setCountry: (country: Country) => void;
  convertPrice: (price: number) => {
    value: number;
    formatted: string;
  };
}

export const getDefaultCountry = async (): Promise<Country> => {
  try {
    // Par défaut, utilisez le Sénégal
    let defaultCountry = countries.find(c => c.code === 'SN');
    
    // Essayez de détecter le pays via IP si possible
    try {
      const response = await fetch("https://ipapi.co/json/");
      const data = await response.json();
      
      if (data && data.country_code) {
        const detectedCountry = countries.find(c => c.code === data.country_code);
        if (detectedCountry) {
          defaultCountry = detectedCountry;
        }
      }
    } catch (error) {
      console.error("Erreur lors de la détection du pays:", error);
    }
    
    if (!defaultCountry) {
      defaultCountry = {
        code: "SN",
        name: "Sénégal",
        flag: "🇸🇳",
        currency: {
          code: "XOF",
          symbol: "FCFA",
          rate: 1
        }
      };
    }
    
    return defaultCountry;
  } catch (error) {
    // Pays par défaut en cas d'erreur
    return {
      code: "SN",
      name: "Sénégal",
      flag: "🇸🇳",
      currency: {
        code: "XOF",
        symbol: "FCFA",
        rate: 1,
      },
    };
  }
};

export const useCountryStore = create<CountryStore>()(
  persist(
    (set, get) => ({
      currentCountry: null,
      setCountry: (country) => set({ currentCountry: country }),
      convertPrice: (price) => {
        if (isNaN(price)) {
          return { value: 0, formatted: "N/A" };
        }

        const country = get().currentCountry;
        if (!country || !country.currency) {
          return {
            value: price,
            formatted: `${price.toLocaleString()} FCFA`
          };
        }

        if (country.currency.code === "XOF") {
          return {
            value: price,
            formatted: `${price.toLocaleString()} ${country.currency.symbol}`
          };
        }

        // Conversion depuis FCFA vers la devise cible
        const convertedValue = Math.round(price / country.currency.rate);
        return {
          value: convertedValue,
          formatted: country.currency.code === "EUR" 
            ? `${convertedValue.toLocaleString()} ${country.currency.symbol}` 
            : `${country.currency.symbol}${convertedValue.toLocaleString()}`
        };
      },
    }),
    {
      name: "country-store",
      onRehydrateStorage: () => {
        return async (state) => {
          if (!state?.currentCountry) {
            const country = await getDefaultCountry();
            if (state?.setCountry) {
              state.setCountry(country);
            }
          }
        };
      },
    }
  )
);

export default useCountryStore;