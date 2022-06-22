/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useRef, useState } from "react";
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
    const [openList, setOpenList] = useState(false);
    const dropdown = useRef(null);

    const fetchSearchSuggestions = async (searchVal) => {
        if (!searchVal) return;
        try {
            const response = await fetch(`${state?.searchSuggestionURL}${searchVal}?api_key=${process.env.REACT_APP_ENV}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            setSuggestionList(data?.data || []);
        } catch (error) {
            console.log(error?.response?.data?.message);
        }
    }

    useEffect(() => {
        fetchGif(true, searchParm);
        dispatch({ type: 'SET_SEARCH_VALUE', payload: searchParm });
    }, []);

    const handleSearch = (searchVal) => {
        fetchGif(true, searchVal);
        if (!searchVal) {
            setSuggestionList([]);
            navigation('/');
            return;
        }
        navigation(`?parms=${searchVal}`);
    }

    const handleSuggestions = useCallback(debounce((e) => {
        fetchSearchSuggestions(e.target.value);
    }, 100), []);

    useEffect(() => {
        if (!openList) return;
        function handleOutSideClick(event) {
            if (dropdown.current && !dropdown.current.contains(event.target)) {
                setOpenList(false);
            }
        }
        window.addEventListener("click", handleOutSideClick);
        return () => window.removeEventListener("click", handleOutSideClick);
    }, [openList]);

    const handleClear = (val) => {
        if (!val && searchParm) {
            fetchGif(true);
            setSuggestionList([]);
            navigation('/');
        }
    }

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
                        onKeyPress={(e) => e.key === 'Enter' ? handleSearch(state?.searchValue) : null}
                        className={styles.headerInputBox}
                        value={state?.searchValue}
                        placeholder="Search All GIFs"
                        onFocus={() => setOpenList(true)}
                        onBlur={(e) => handleClear(e.target.value)}
                        onClick={() => setOpenList(true)}
                        onChange={(e) => {
                            setOpenList(true);
                            dispatch({ type: 'SET_SEARCH_VALUE', payload: e.target.value.trimLeft() });
                            handleSuggestions(e);
                        }}
                    />
                    {suggestionList?.length > 0 && openList && state?.searchValue ? (
                        <div ref={dropdown} className={styles.suggestList}>
                            <h6 className={styles.suggestLabel}><img src={searchIcon} alt="searchIcon" height="15px" />&nbsp;&nbsp;&nbsp;Search suggestions</h6>
                            {suggestionList.map((item, index) => (
                                <div key={index} onClick={() => { dispatch({ type: 'SET_SEARCH_VALUE', payload: item?.name }); handleSearch(item?.name); setOpenList(false); }} className={styles.suggestListOption}>
                                    <div className={styles.suggestListOptionContent}>
                                        <h6 className={styles.suggestListName}>{item?.name}</h6>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : null}
                    <button className={styles.searchButton} disabled={!state?.searchValue} onClick={() => handleSearch(state?.searchValue)}>
                        <img src={searchIcon} alt="searchIcon" />
                    </button>
                </div>
            </div>
        </div >
    );
};

export default Header;
