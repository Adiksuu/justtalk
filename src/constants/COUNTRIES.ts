export const COUNTRIES = [
  { code: '+48', name: 'Poland', flag: '🇵🇱' },
  { code: '+1', name: 'United States', flag: '🇺🇸' },
  { code: '+44', name: 'United Kingdom', flag: '🇬🇧' },
  { code: '+49', name: 'Germany', flag: '🇩🇪' },
  { code: '+33', name: 'France', flag: '🇫🇷' },
  { code: '+39', name: 'Italy', flag: '🇮🇹' },
  { code: '+34', name: 'Spain', flag: '🇪🇸' },
  { code: '+1', name: 'Canada', flag: '🇨🇦' },
  { code: '+61', name: 'Australia', flag: '🇦🇺' },
]

export const getFilteredCountries = (searchQuery: string) => {
  return COUNTRIES.filter(country => 
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.includes(searchQuery)
  )
}