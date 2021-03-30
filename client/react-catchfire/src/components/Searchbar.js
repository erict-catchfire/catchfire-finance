import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { useDispatch} from 'react-redux'
import { setKeywords } from '../actions'

export const Searchbar = ( {options} ) => {
    const dispatch = useDispatch();

    const onChangeSearchBar = ( e , {value} ) => {
        e.persist();
        dispatch(setKeywords(value))
    }

    return (
        <Dropdown
            placeholder='Home'
            fluid
            multiple
            search
            selection
            onChange={onChangeSearchBar}
            options={options}
            scrolling
            keepOnScreen={true}
        />
    )
}