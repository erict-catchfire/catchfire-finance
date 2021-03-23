import React from 'react';

export const Header = ( {headerHeight, innerWidth, innerHeight} ) => {
    return (
       <div className="Header">
         <svg width={innerWidth} height={headerHeight}> 
            {/* <rect width={innerWidth} height={headerHeight}/> */}
         </svg>
         Am I a Frontend Dev Yet?
       </div>
    )
}