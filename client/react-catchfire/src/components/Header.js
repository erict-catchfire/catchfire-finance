import React from 'react';
import { Searchbar } from './Searchbar'
//import { Container } from 'semantic-ui-react';

const options = [
   {
      key: "AMAZ",
      content: "Amazon Corp.",
      text: "AMZN",
      value: "AMAZ",
      label: "AMAZ"
   },
   {
      key: "GOOG",
      content: "Google Corp.",
      text: "GOOG",
      value: "GOOG",
      label: "GOOG"
   },
   {
      key: "GME",
      content: "Gamestop Corp.",
      text: "GME",
      value: "GME",
      label: "GME"
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