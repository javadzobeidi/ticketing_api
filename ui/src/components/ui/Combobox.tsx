import { Combobox } from "@base-ui-components/react/combobox";
import { useState, useMemo, useEffect } from "react";

interface Option {
  [key: string]: any;
}

interface Props {
  options: Option[];
  placeholder?: string;
  value: string | null;
  onChange: (value: string | null) => void;
  idKey?: string;
  titleKey?: string;
  // New Prop: Key to find description in the option object
  descriptionKey?: string; 
  isLoading: boolean;
  inputClass?: string;
  // New Prop: Toggle search functionality
  isSearchable?: boolean; 
}

export function ComboboxField({
  options,
  placeholder,
  value,
  onChange,
  idKey = 'id',
  titleKey = 'title',
  descriptionKey = '', // Default to 'description'
  isLoading,
  inputClass,
  isSearchable = false // Default to searchable
}: Props) {
  
  const selectedOption = options.find((o) => o[idKey] === value);

  // State for the search query text
  const [query, setQuery] = useState(selectedOption?.[titleKey] || "");

  // Sync local input text if the parent 'value' changes
  useEffect(() => {
    if (selectedOption) {
      setQuery(selectedOption[titleKey]);
    } else if (value === null) {
      setQuery("");
    }
  }, [value, selectedOption, titleKey]);

  // Filter options based on the query AND isSearchable prop
  const filteredOptions = useMemo(() => {
    // If search is disabled, always return full list
    if (!isSearchable) return options; 
    
    if (!query) return options;
    return options.filter((option) =>
      String(option[titleKey]).toLowerCase().includes(query.toLowerCase())
    );
  }, [options, query, titleKey, isSearchable]);

  return (
    <div className="relative w-full ">
      <Combobox.Root
        onValueChange={(current) => {
          const selected = options.find((o) => o[idKey] === current);
          if (selected) {
            onChange(selected[idKey]);
            setQuery(selected[titleKey]);
          } else {
            onChange(null);
          }
        }}
      >
        <div className="flex flex-col gap-1 z-50 cursor-pointer ">
          <div className="relative flex items-center">
            <Combobox.Input
              placeholder={placeholder}
              // If not searchable, make input readOnly so keyboard doesn't open/type
              readOnly={!isSearchable} 
              className={`
                w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900
                placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none 
                ${!isSearchable ? 'cursor-pointer selection:bg-transparent' : ''} 
                ${inputClass}
              `}
              value={query}
              onChange={(e) => {
                // Only update query if searchable
                if (isSearchable) setQuery(e.target.value);
              }}
            />
            <Combobox.Trigger className="
                absolute left-2 flex h-5 w-5 items-center justify-center text-gray-500
                hover:text-blue-600
            " >
              {isLoading ?
                <Combobox.Icon className="ml-6 h-4 w-4" >
                  <><svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg></>
                </Combobox.Icon> : <Combobox.Icon className="h-4 w-4" />
              }
            </Combobox.Trigger>
          </div>
        </div>

        <Combobox.Portal>
          <Combobox.Positioner sideOffset={6} className="z-50">
            <Combobox.Popup
              className="
                mt-1 max-h-52 w-[var(--anchor-width)] overflow-y-auto rounded-lg border border-gray-200
                bg-white shadow-lg text-sm 
              "
            >
              <Combobox.Arrow className="fill-white stroke-gray-200" />
              
              {!isLoading && filteredOptions.length === 0 && (
                <div className="p-3 text-gray-400 text-sm">
                   هیچ موردی یافت نشد.
                </div>
              )}

              <Combobox.List className="divide-y divide-gray-100">
                {filteredOptions.map((option) => (
                  <Combobox.Item
                    key={option[idKey]}
                    value={option[idKey]}
                    className="
                      cursor-default px-3 py-2 hover:bg-gray-100
                      data-[highlighted]:bg-blue-100 data-[highlighted]:text-blue-900
                    "
                  >
                    <div className="flex items-center justify-between">
                      {/* Flex Column for Title + Description */}
                      <div className="flex flex-col text-right">
                        <span className="font-medium text-gray-900">
                            {option[titleKey]}
                        </span>
                        
                        {/* Render Description only if it exists */}
                        {option[descriptionKey] && (
                            <span className="text-xs text-gray-500 mt-0.5">
                                {option[descriptionKey]}
                            </span>
                        )}
                      </div>

                      <Combobox.ItemIndicator className="text-blue-600">✓</Combobox.ItemIndicator>
                    </div>
                  </Combobox.Item>
                ))}
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </div>
  );
}