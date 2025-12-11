import React from 'react';
import ChevronDownSvg from './chevron-down.svg';
import HorizontalDotsSvg from './horizontal-dots.svg';

// Export as React components using img tags
export const ChevronDownIcon: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img src={ChevronDownSvg} alt="chevron down" {...props} />
);

export const HorizontaLDots: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = (props) => (
  <img src={HorizontalDotsSvg} alt="horizontal dots" {...props} />
);
