// app/components/common/CountrySelector.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import useCountryStore from "@/app/hooks/useCountryStore";
import { countries } from "@/app/lib/data/countries";
import { Country } from "@/app/hooks/useCountryStore";

interface CountrySelectorProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CountryGroup {
  region: string;
  countries: Country[];
}

export function CountrySelector({ isOpen, onClose }: CountrySelectorProps) {
  const { setCountry, currentCountry } = useCountryStore();
  const [selectedCountry, setSelectedCountry] = useState<string>(
    currentCountry?.code || "SN"
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Grouper les pays par région
  const groupedCountries: CountryGroup[] = [
    {
      region: "Afrique de l'Ouest - Zone FCFA",
      countries: countries.filter((c) => ["SN", "CI", "BJ", "BF", "ML", "NE", "TG", "GW"].includes(c.code)),
    },
    {
      region: "Afrique Centrale - Zone FCFA",
      countries: countries.filter((c) => ["CM", "GA", "CG", "TD", "CF", "GQ"].includes(c.code)),
    },
    {
      region: "Afrique de l'Ouest (hors FCFA)",
      countries: countries.filter((c) => ["NG", "GH", "LR", "SL", "GM", "GN", "CV"].includes(c.code)),
    },
    {
      region: "Afrique du Nord",
      countries: countries.filter((c) => ["MA", "DZ", "TN", "LY", "EG", "SD"].includes(c.code)),
    },
    {
      region: "Europe",
      countries: countries.filter((c) => ["FR", "DE", "IT", "GB", "ES"].includes(c.code)),
    },
    {
      region: "Autres régions",
      countries: countries.filter(c => 
        !["SN", "CI", "BJ", "BF", "ML", "NE", "TG", "GW", 
          "CM", "GA", "CG", "TD", "CF", "GQ", 
          "NG", "GH", "LR", "SL", "GM", "GN", "CV",
          "MA", "DZ", "TN", "LY", "EG", "SD",
          "FR", "DE", "IT", "GB", "ES"].includes(c.code)
      )
    }
  ];

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country.code);
    setCountry(country);
    
    // Stockage local pour la persistance
    localStorage.setItem(
      "userCountry",
      JSON.stringify({
        code: country.code,
        name: country.name,
        currency: country.currency,
        flag: country.flag,
      })
    );

    onClose();
  };

  const filteredGroups = groupedCountries.map((group) => ({
    ...group,
    countries: group.countries.filter(
      (country) =>
        country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        country.code.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  }));

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xl p-6 bg-white">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            Choisir un pays / région
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-600">
            Sélectionnez votre pays/région pour voir les prix dans votre devise locale
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher un pays..."
              className="pl-10 bg-white border-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Liste des pays par région */}
          <div className="max-h-[400px] overflow-y-auto pr-2">
            {filteredGroups.map((group) => (
              group.countries.length > 0 && (
                <div key={group.region} className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-500 mb-3">
                    {group.region}
                  </h3>
                  <div className="grid grid-cols-1 gap-2">
                    {group.countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => handleCountryChange(country)}
                        className={`flex items-center justify-between w-full p-3 rounded-lg transition-colors ${
                          selectedCountry === country.code
                            ? "bg-[#0f4c81] text-white"
                            : "hover:bg-gray-50 text-gray-700"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{country.flag}</span>
                          <span className="font-medium">{country.name}</span>
                        </div>
                        <span className="text-sm opacity-80">
                          {country.currency?.symbol}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}