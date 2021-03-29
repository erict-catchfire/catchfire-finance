import React from 'react';
import { useSelector } from 'react-redux'

export const VizGrid = ( ) => {
    const keywords = useSelector(state => state.keywords)

    return (
       <div className="VizGrid">
           <div className="Viz0"> 
                <div>
                    Viz0
                </div>
                <div>
                    {
                        keywords.map(ticker => {
                            console.log(ticker)
                            return (
                            <div key={ticker}>
                                <div> {ticker} </div>
                            </div> 
                            )
                        })
                    }
                </div>
           </div>
           <div className="Viz1"> 
                <div>
                    Viz1
                </div>
                <div>
                    {keywords}
                </div>
           </div>
           <div className="Viz2"> 
                <div>
                    Viz2
                </div>
                <div>
                    {keywords}
                </div>
           </div>
           <div className="Viz3"> 
                <div>
                    Viz3
                </div>
                <div>
                    {keywords}
                </div>
           </div>
           <div className="Viz4"> 
                <div>
                    Viz4
                </div>
                <div>
                    {keywords}
                </div>
           </div>
       </div>
    )
}