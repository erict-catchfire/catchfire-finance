import React, {useEffect, useState} from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useDispatch} from 'react-redux'
import { setKeywords } from '../actions'

const GetTickers = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch("/getTickers").then(response => {
            response.json().then(data => {
                const toSet = [];
                for(const ticker in data){
                    toSet.push(
                        {
                           key: ticker,
                           content: data[ticker].longName,
                           text: ticker,
                           value: ticker,
                           label: ticker     
                        }
                    )
                }
                setData(toSet)
            });
        });
    }, []);
       
    return data;
}

export const Searchbar = () => {
    const dispatch = useDispatch();

    const tickers = GetTickers();   

    const onChangeSearchBar = ( e , {value} ) => {
        //e.persist();
        dispatch(setKeywords(value))
    }

    return (
        <Dropdown
            placeholder='Home'
            fluid
            multiple
            search
            selection
            closeOnChange
            onChange={onChangeSearchBar}
            options={tickers}
            loading={tickers.length===0}
            scrolling
        />
    )
}