import React, { createContext, useContext, useReducer } from 'react';

export const GlobalContext = createContext();

export const GetGlobalContext = () => {
    return useContext(GlobalContext);
}

const initialState = {
    gifs: {},
    searchValue: '',
    loader: false,
    paginationLoader: false,
    apiURL: `https://api.giphy.com/v1/gifs/trending?api_key=${process.env.REACT_APP_ENV}&limit=20`,
    searchURL: `https://api.giphy.com/v1/gifs/search?api_key=${process.env.REACT_APP_ENV}&limit=20`,
    searchSuggestionURL: 'https://api.giphy.com/v1/tags/related/',
}

const reducer = (state, action) => {
    switch (action.type) {
        case 'SET_GIFS':
            return { ...state, gifs: action.payload }
        case 'SET_SEARCH_VALUE':
            return { ...state, searchValue: action.payload }
        case 'SET_LOADER':
            return { ...state, loader: action.payload }
        case 'SET_PAGINATION_LOADER':
            return { ...state, paginationLoader: action.payload }
        default:
            return state;
    }
}

const GlobalContextProvider = ({ ...props }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchGif = async (clearData, searchVal = state.searchValue) => {
        clearData ? dispatch({ type: 'SET_LOADER', payload: true }) : dispatch({ type: 'SET_PAGINATION_LOADER', payload: true });
        const API = searchVal ? `${state?.searchURL}&q=${searchVal}&offset=${state?.gifs?.data?.length || 0}` : `${state?.apiURL}&offset=${state?.gifs?.data?.length || 0}`;
        try {
            const response = await fetch(API, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (clearData) {
                dispatch({ type: 'SET_GIFS', payload: data });
            } else {
                if (state?.gifs?.data?.length) {
                    dispatch({ type: 'SET_GIFS', payload: { data: [...state?.gifs?.data, ...data?.data], meta: { ...data?.meta }, pagination: { ...data?.pagination } } });
                }
            }
        } catch (error) {
            console.log(error?.response?.data?.message);
        } finally {
            clearData ? dispatch({ type: 'SET_LOADER', payload: false }) : dispatch({ type: 'SET_PAGINATION_LOADER', payload: false });
        }
    };

    return (
        <GlobalContext.Provider value={{ state, dispatch, fetchGif }}>
            {props.children}
        </GlobalContext.Provider>
    )
}

export default GlobalContextProvider;