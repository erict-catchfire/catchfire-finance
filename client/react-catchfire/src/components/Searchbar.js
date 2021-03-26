import React from 'react';
import { Dropdown } from 'semantic-ui-react';

export const Searchbar = ( {options} ) => {
    return (
        <Dropdown
            placeholder='Home'
            fluid
            multiple
            search
            selection
            options={options}
            scrolling
            keepOnScreen={true}
        />
    )
}