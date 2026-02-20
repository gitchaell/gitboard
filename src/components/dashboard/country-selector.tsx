'use client'

import * as React from 'react'
import { Check, ChevronsUpDown, Search } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Country, City } from 'country-state-city'
import type { ICountry, ICity } from 'country-state-city'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

type CountryOption = Omit<ICountry, 'flag' | 'latitude' | 'longitude' | 'timezones' | 'phonecode' | 'currency'> | {
  name: 'Global';
  isoCode: 'global';
};


export function CountrySelector() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const countries = React.useMemo<CountryOption[]>(() => [{ name: 'Global', isoCode: 'global' }, ...Country.getAllCountries()], []);
  
  const [countryOpen, setCountryOpen] = React.useState(false)
  const [cityOpen, setCityOpen] = React.useState(false)

  const [cities, setCities] = React.useState<ICity[]>([]);

  // Initialize state from URL params
  const initialCountryName = searchParams.get('country') || 'Global';
  const initialCityName = searchParams.get('city') || '';

  const [selectedCountry, setSelectedCountry] = React.useState<CountryOption | undefined>(
    countries.find(c => c.name === initialCountryName)
  );
  const [selectedCity, setSelectedCity] = React.useState<ICity | { name: string } | null>(
    initialCityName ? { name: initialCityName } : null
  );
  
  React.useEffect(() => {
    if (selectedCountry && selectedCountry.isoCode !== 'global') {
      const countryCities = City.getCitiesOfCountry(selectedCountry.isoCode);
      setCities(countryCities || []);
    } else {
      setCities([]);
    }
  }, [selectedCountry]);
  
  const handleSearch = () => {
      const params = new URLSearchParams();
      if (selectedCountry && selectedCountry.name !== 'Global') {
          params.set('country', selectedCountry.name);
      }
      if (selectedCity?.name) {
          params.set('city', selectedCity.name);
      }
      router.push(`?${params.toString()}`);
  }

  const handleCountrySelect = (country: CountryOption) => {
    setSelectedCountry(country);
    setSelectedCity(null); // Reset city
    setCountryOpen(false);
    // If global is selected, we can navigate immediately
    if (country.isoCode === 'global') {
        router.push('/');
    }
  }

  const handleCitySelect = (city: ICity) => {
    setSelectedCity(city);
    setCityOpen(false);
  }

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2">
        <Popover open={countryOpen} onOpenChange={setCountryOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={countryOpen}
                className="w-full sm:w-[200px] justify-between bg-card/75 backdrop-blur-sm"
                >
                <span className="truncate">{selectedCountry?.name || 'Select country...'}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                <CommandInput placeholder="Search country..." />
                <CommandList>
                    <CommandEmpty>No country found.</CommandEmpty>
                    <CommandGroup>
                    {countries.map((country) => (
                        <CommandItem
                        key={country.isoCode}
                        value={country.name}
                        onSelect={() => handleCountrySelect(country as CountryOption)}
                        >
                        <Check
                            className={cn(
                            'mr-2 h-4 w-4',
                            selectedCountry?.isoCode === country.isoCode ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                        {country.name}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        
        <Popover open={cityOpen} onOpenChange={setCityOpen}>
            <PopoverTrigger asChild>
                <Button
                variant="outline"
                role="combobox"
                aria-expanded={cityOpen}
                className="w-full sm:w-[200px] justify-between bg-card/75 backdrop-blur-sm"
                disabled={!selectedCountry || selectedCountry.isoCode === 'global' || cities.length === 0}
                >
                <span className="truncate">{selectedCity?.name || 'Select city...'}</span>
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                <CommandInput placeholder="Search city..." />
                <CommandList>
                    <CommandEmpty>No city found.</CommandEmpty>
                    <CommandGroup>
                    {cities.map((city) => (
                        <CommandItem
                        key={`${city.name}-${city.countryCode}-${city.stateCode}`}
                        value={city.name}
                        onSelect={() => handleCitySelect(city)}
                        >
                        <Check
                            className={cn(
                            'mr-2 h-4 w-4',
                            selectedCity?.name === city.name ? 'opacity-100' : 'opacity-0'
                            )}
                        />
                        {city.name}
                        </CommandItem>
                    ))}
                    </CommandGroup>
                </CommandList>
                </Command>
            </PopoverContent>
        </Popover>

        <Button onClick={handleSearch}>
            <Search className="h-4 w-4 mr-2" /> Search
        </Button>
    </div>
  )
}
