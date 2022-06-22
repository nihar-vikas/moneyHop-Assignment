/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import styles from './styles.module.css';
import Logo from '../../assets/logo-nav.png';
import { GetGlobalContext } from "../globalContext";
import { debounce } from "../../lib/debounce";
import searchIcon from '../../assets/searchIcon.svg';
import { useLocation, useNavigate } from "react-router-dom";

const Header = () => {
    const navigation = useNavigate();
    const search = useLocation().search;
    const searchParm = new URLSearchParams(search).get('parms') || '';
    const { state, dispatch, fetchGif } = GetGlobalContext();
    const [suggestionList, setSuggestionList] = useState([]);

    const fetchSearchSuggestions = async (searchVal) => {
        try {
            const response = await fetch(`${state?.searchSuggestionURL}${searchVal}?api_key=${process.env.REACT_APP_ENV}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setSuggestionList(data?.data);
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        fetchGif(true, searchParm);
        dispatch({ type: 'SET_SEARCH_VALUE', payload: searchParm });
    }, []);

    const handleSearch = useCallback(debounce((e) => {
        fetchGif(true, e.target.value);
        if (!e.target.value) {
            setSuggestionList([]);
            navigation('/');
            return;
        }
        navigation(`?parms=${e.target.value}`);
    }, 500), []);

    const handleSuggestions = useCallback(debounce((e) => {
        fetchSearchSuggestions(e.target.value);
    }, 100), []);

    return (
        <div className={styles.headerMain}>
            <div className={styles.header}>
                <img src={Logo} alt="logo" className={styles.headerLogo} />
                <div className={styles.headerSearchDiv}>
                    <input
                        type="text"
                        list="searchBoxId"
                        autoCapitalize="off"
                        autoCorrect="off"
                        autoComplete="off"
                        className={styles.headerInputBox}
                        value={state?.searchValue}
                        placeholder="Search All GIFs"
                        onChange={(e) => {
                            dispatch({ type: 'SET_SEARCH_VALUE', payload: e.target.value.trimLeft() });
                            handleSearch(e);
                            handleSuggestions(e);
                        }}
                    />
                    <datalist autoComplete="off" id="searchBoxId" className={styles.dataList}>
                        <select className={styles.dataList}>
                            {suggestionList?.map((item, index) => (
                                <option className={styles.dataListOption} value={item?.name} data-valueObj={item?.name} key={index}>{item?.name}</option>
                            ))}
                        </select>
                    </datalist>
                    <button className={styles.searchButton} disabled={!state?.searchValue} onClick={() => fetchGif(true, state?.searchValue)}>
                        <img src={searchIcon} alt="searchIcon" />
                    </button>
                </div>
            </div>
        </div >
    );
};

export default Header;
