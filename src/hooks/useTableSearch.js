import { useState, useMemo } from "react";

export function useTableSearch(initialData = [], searchKeys = [], additionalFilter = null) {
  const [searchText, setSearchText] = useState("");

  const filteredData = useMemo(() => {
    let filtered = initialData || [];

    if (searchText) {
      const lowerSearch = searchText.toLowerCase();
      filtered = filtered.filter((item) => {
        return searchKeys.some((key) => {
          const val = item[key];
          return val && String(val).toLowerCase().includes(lowerSearch);
        });
      });
    }
    
    if (additionalFilter) {
      filtered = filtered.filter(additionalFilter);
    }
    
    return filtered;
  }, [initialData, searchText, JSON.stringify(searchKeys), additionalFilter]);

  const handleSearch = (value) => {
    setSearchText(value);
  };

  return { filteredData, searchText, handleSearch };
}
