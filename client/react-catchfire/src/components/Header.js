import React from 'react';
import { Searchbar } from './Searchbar'
//import { Container } from 'semantic-ui-react';

const options = [
   {
      key: "AMAZ",
      text: "Amazon Corp. (AMZN)",
      value: "AMAZ"
   },
   {
      key: "GOOG",
      text: "Google Corp. (GOOG)",
      value: "GOOG"
   },
   {
      key: "GME",
      text: "Gamestop Corp. (GME)",
      value: "GME"
   }
]

export const Header = ( {logoWidth, logoHeight} ) => {
    return (
      <div className="Header">
         <div>
            <svg width={logoWidth} height={logoHeight}> 
              { <rect width={logoWidth} height={logoHeight}/> }
            </svg>
         </div>
         <div className="Searchbar"> 
            <Searchbar
               options={options}
            />
         </div>
         <div className="HeaderLinks"> 
            <div>
               Link 0 
            </div>
            <div>
               Link 1 
            </div>
            <div>
               Link 2 
            </div>     
            <div>
               Link 3
            </div>                    
         </div>
      </div>
    )
}