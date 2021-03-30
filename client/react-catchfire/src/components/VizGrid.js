import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux'


const GetPriceData = tickers => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const request = {
            "tickers" : tickers
        }
        console.log("POST")
        fetch("/getPrice", {
            method : "POST",
            headers : {
                        "Content-Type" : "application/json"
            },
            body: JSON.stringify(request)
            }).then( response => response.json().then(data => {
                        setData(data)
                    }
                )
            )
    }, [tickers]);
       
    return data;
}

export const VizGrid = ( ) => {
    const keywords = useSelector(state => state.keywords)

    let data = GetPriceData(keywords);

    return (
       <div className="VizGrid">
           <div className="Viz0"> 
                <div>
                    Viz0
                </div>
                <div>
                    {
                        keywords.map(ticker => {
                            return (
                            <div key={ticker}>
                                <div> {ticker} </div>
                                <div> {data[ticker]} </div>
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