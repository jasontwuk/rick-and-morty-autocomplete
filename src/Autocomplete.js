import React, { useState, useEffect, useRef } from 'react';
import { fetchCharacters } from './utilities/api';
import clsx from "clsx";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

const Autocomplete = ({ onSelect }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [error, setError] = useState('');
  const inputDivRef = useRef(null);
  const inputRef = useRef(null);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // *** Note: handle fetch characters & update suggestions
  useEffect(() => {
    // *** Note: scroll to the top of #suggestionsList (when "query" change)
    scrollToTopOfList();

    // *** Note: remove leading and trailing spaces for "query"
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 1) {
      // *** Note: reset suggestions
      setSuggestions([]);
      // *** Note: reset error
      setError('');
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const characters = await fetchCharacters(query);
        setSuggestions(characters);
        setError(characters.length === 0 ? 'Sorry, no characters found.' : '');
      } catch (err) {
        // *** Note: display error from api.js
        setError(err.message); 
        // *** Note: reset suggestions
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [query]);

  // *** Note: handle clicks outside the Autocomplete component
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (inputDivRef.current && !inputDivRef.current.contains(event.target)) {
        // *** Note: reset query
        setQuery('');
        // *** Note: reset suggestions
        setSuggestions([]); 

        // *** Note: scroll to the top of #suggestionsList
        scrollToTopOfList();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleItemClick = (item) => {
    onSelect(item);
    // *** Note: reset query
    setQuery('');
    // *** Note: reset suggestions
    setSuggestions([]);
    // *** Note: scroll to the top of #suggestionsList
    scrollToTopOfList();
  }

  const handleBtnClick = () => {
    // *** Note: reset query
    setQuery('');
    // *** Note: reset suggestions
    setSuggestions([]);
    // *** Note: reset error
    setError('');
    // *** Note: scroll to the top of #suggestionsList
    scrollToTopOfList();
  }

  const handleKeydown = (event) => {
    if (suggestions.length === 0) return;
    // console.log(event.key);
    
    switch (event.key) {
      case 'Escape':
        event.preventDefault();
        // *** Note: move focus to inputRef element
        inputRef.current.focus();
        handleItemClick();
        break;

      case 'Tab':
        event.preventDefault();
        break;

      case 'ArrowDown': 
        if(selectedIndex < 0) {
          // *** Note: when selectedIndex = -1, we want to set it the second item of the list
          setSelectedIndex(selectedIndex + 2);
        } else {
          setSelectedIndex((prevIndex) => 
              prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
          );
        }

        if(selectedIndex < 1 || selectedIndex === suggestions.length - 1) {
          // *** Note: disable "ArrowDown" when focus is on the first two characters
          event.preventDefault();

          // *** Note: scroll to the "top" of the list
          scrollToTopOfList();
        }
        break;

      case 'ArrowUp': 
        setSelectedIndex((prevIndex) => 
            prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
        );

        if(selectedIndex < 1 || selectedIndex === suggestions.length - 1) {
          // *** Note: disable "ArrowUp" when focus is on the last two characters
          event.preventDefault();

          // *** Note: scroll to the "bottom" of the list
          scrollToBottomOfList();
        }
        break;

      case 'Enter':
        // *** Note: display the selected item
        if(selectedIndex < 0) {
          handleItemClick(suggestions[0]);
        } else {
          handleItemClick(suggestions[selectedIndex]);
        }
        break;

      default:
        break;
    }
  }

  // *** Note: scroll to the top of #suggestionsList after a new fetch
  const scrollToTopOfList = () => {
    const suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.scrollTop = 0;
  }

  // *** Note: scroll to the top of #suggestionsList
  const scrollToBottomOfList = () => {
    const suggestionsList = document.getElementById("suggestionsList");
    suggestionsList.scrollTop = 1000;
  }

  return (
    <div className="flex flex-col gap-2 w-full relative" ref={inputDivRef}>
      <div className="relative text-gray-500 focus-within:text-gray-900">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            // *** Note: reset selectedIndex when typing
            setSelectedIndex(-1); 
          }}
          placeholder="Search characters..."
          className={clsx(
            "py-2 px-4 border-2 border-gray-400 rounded-md w-full pl-14",
            // +++ Note: focus-visible
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500",
          )}
          ref={inputRef}
        />

        <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-[14px] left-6" />

        {query && (
          <button onClick={() => handleBtnClick()} className={clsx(
            "w-5 h-5 absolute top-3 right-6 text-gray-500 hover:text-red-400",
            // +++ Note: focus-visible
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-yellow-500 focus-visible:rounded-full focus-visible:text-red-400",
          )}>
            <FontAwesomeIcon icon={faCircleXmark} className="w-5 h-5 shrink-0" />
          </button>
        )}
      </div>

      {/* Note: error message */}
      {error && <p className="p-2 text-red-600">{error}</p>}

      <ul 
        id="suggestionsList" 
        className={clsx(
          "flex-col max-h-80 overflow-y-scroll p-2 border border-gray-200 bg-opacity-95 rounded-md gap-0 absolute top-14 left-0 w-full bg-gray-100 shadow-md",
          suggestions.length > 0 ? "flex" : "hidden",
        )}
      >
        {suggestions.map((char, index) => (
          <li 
            key={char.id} 
            onClick={() => handleItemClick(char)} 
            onKeyDown={(event) => handleKeydown(event, char)}
            className={clsx(
              "flex gap-3 items-center cursor-pointer hover:bg-yellow-200 p-2 rounded-md",
              // +++ Note: focus-visible
              "focus-visible:outline-0",
              // +++ Note: focus style for the first item
              selectedIndex <= 0 && "focus-visible:bg-yellow-200",
              // +++ Note: focus style for the rest of the items 
              (selectedIndex === index && selectedIndex !== 0) ? 'bg-yellow-200' : '',
            )}
            // +++ Note: make this <li> focusable in keyboard navigation
            tabIndex="0" 
          >
            <img src={char.image} alt={char.name} className="block w-8 h-8" />

            {char.name}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Autocomplete;
