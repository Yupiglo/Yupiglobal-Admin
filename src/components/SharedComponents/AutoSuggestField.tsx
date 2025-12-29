import React, { useEffect, useRef, useState } from "react";


interface AutoSuggestFieldProps {
  value: string; // ← this will hold the selected ID
  onChange: (value: string) => void;
  suggestions: { id: string; name: string }[];
}
const AutoSuggestField: React.FC<AutoSuggestFieldProps> = ({ value, onChange, suggestions }) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<typeof suggestions>([]);
  const [inputText, setInputText] = useState(""); // track what user types
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const selected = suggestions.find(sug => sug.id === value);
    setInputText(selected?.name ?? "");
  }, [value, suggestions]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
        const matched = suggestions.find(sug =>
          sug.name.toLowerCase() === inputText.trim().toLowerCase()
        );
        if (matched) {
          onChange(matched.id);
        } else {
          setInputText("");
          onChange(""); // clear invalid
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [inputText, suggestions, onChange]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setInputText(text);

    if (text.trim() === "") {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    } else {
      const filtered = suggestions.filter(sug =>
        sug.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredSuggestions(filtered);
      setShowSuggestions(true);
    }
  };

  const handleSuggestionClick = (sug: { id: string; name: string }) => {
    setInputText(sug.name);
    onChange(sug.id);
    setShowSuggestions(false);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input
        type="text"
        value={inputText}
        onChange={handleInputChange}
        className="w-full border border-gray-300 rounded-md px-3 py-1 text-sm italic-placeholder"
        placeholder="Search Acc. Name"
        onFocus={() => {
          if (inputText) {
            const filtered = suggestions.filter(sug =>
              sug.name.toLowerCase().includes(inputText.toLowerCase())
            );
            setFilteredSuggestions(filtered);
            setShowSuggestions(true);
          }
          setIsOpen(true);
        }}
      />
      {(showSuggestions || isOpen) && (
        <ul className="absolute z-10 bg-white border border-gray-300 w-full mt-1 max-h-40 overflow-y-auto rounded-md shadow-sm text-sm">
          {filteredSuggestions.length > 0 ? (
            filteredSuggestions.map((sug, idx) => (
              <li key={idx+""}>
                <button
                  type="button"
                  className="w-full text-left px-3 py-1 hover:bg-blue-100 cursor-pointer"
                  onClick={() => handleSuggestionClick(sug)}
                >
                  {sug.name}
                </button>
              </li>
            ))
          ) : (
            <li className="px-3 py-1 text-gray-500 italic">No Account Name/Sub Ledger found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default AutoSuggestField;
