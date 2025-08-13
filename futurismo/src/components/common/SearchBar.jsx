import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const SearchBar = ({ searchQuery, setSearchQuery, onSearch, className = '', variant = 'default' }) => {
  const { t } = useTranslation();

  // Mobile-first responsive classes
  const baseClasses = "w-full";
  const variantClasses = {
    default: "block",
    mobile: "block",
    compact: "hidden sm:block"
  };

  return (
    <form onSubmit={onSearch} className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <div className="relative w-full">
        <MagnifyingGlassIcon className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('search.searchServices')}
          className="
            w-full
            pl-8 sm:pl-10 
            pr-3 sm:pr-4 
            py-2 sm:py-2.5 
            text-sm sm:text-base
            border border-gray-300 
            rounded-lg 
            focus:ring-2 focus:ring-primary focus:border-primary
            focus:outline-none
            transition-all duration-200
            placeholder:text-gray-400 placeholder:text-sm sm:placeholder:text-base
            bg-white
            shadow-sm
            hover:border-gray-400
          "
        />
      </div>
    </form>
  );
};

SearchBar.propTypes = {
  searchQuery: PropTypes.string.isRequired,
  setSearchQuery: PropTypes.func.isRequired,
  onSearch: PropTypes.func.isRequired,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['default', 'mobile', 'compact'])
};

export default SearchBar;