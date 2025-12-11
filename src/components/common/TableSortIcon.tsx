import React from 'react';

interface TableSortIconProps {
  order?: 'ASC' | 'DESC' | 'NONE';
}

export const TableSortIcon: React.FC<TableSortIconProps> = ({ order = 'NONE' }) => {
  const activeColor = 'black';
  const inactiveColor = '#A7AEB4';

  return (
    <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Arrow Up */}
      <path
        d="M4.65162 7.33405H12.3496C12.9243 7.33405 13.2296 6.65405 12.8476 6.22405L8.99895 1.89405C8.93653 1.82358 8.85986 1.76717 8.77401 1.72854C8.68816 1.6899 8.5951 1.66992 8.50096 1.66992C8.40682 1.66992 8.31375 1.6899 8.2279 1.72854C8.14205 1.76717 8.06538 1.82358 8.00295 1.89405L4.15295 6.22405C3.77095 6.65405 4.07629 7.33405 4.65162 7.33405Z"
        fill={order === 'ASC' ? activeColor : inactiveColor}
      />
      {/* Arrow Down */}
      <path
        d="M8.00229 14.1067C8.06472 14.1772 8.14139 14.2336 8.22723 14.2722C8.31308 14.3109 8.40615 14.3308 8.50029 14.3308C8.59443 14.3308 8.6875 14.3109 8.77334 14.2722C8.85919 14.2336 8.93586 14.1772 8.99829 14.1067L12.847 9.77671C13.2296 9.34738 12.9243 8.66738 12.349 8.66738H4.65162C4.07695 8.66738 3.77162 9.34738 4.15362 9.77738L8.00229 14.1067Z"
        fill={order === 'DESC' ? activeColor : inactiveColor}
      />
    </svg>
  );
};
