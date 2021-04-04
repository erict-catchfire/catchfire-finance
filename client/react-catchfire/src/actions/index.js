export const setKeywords = keywords => {
    return {
        type : 'SET',
        payload : keywords
    }
}

export const toggleTableDimmer = () => {
    return {
        type : 'TOGGLE_TABLE_DIMMER'
    }
}

export const unsetTableDimmer = () => {
    return {
        type : 'UNSET_TABLE_DIMMER'
    }
}