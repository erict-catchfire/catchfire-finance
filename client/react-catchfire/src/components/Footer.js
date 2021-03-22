import React from 'react';

export const Footer = ( {footerHeight, innerWidth, innerHeight} ) => {
    return (
       <div className="Footer">
         <svg width={innerWidth} height={footerHeight}> 
            {/* <rect width={innerWidth} height={footerHeight}/> */}
         </svg>
       </div>
    )
}