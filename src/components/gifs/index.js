/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import styles from "./styles.module.css";
import { GetGlobalContext } from "../globalContext";
import GifCard from "./gifCard";
import loaderImage from "../../assets/loader.gif";

const Gifs = () => {
    const { state } = GetGlobalContext();
    return (
        <div className={styles.gifsMain}>
            <div className={styles.gifs}>
                {state?.gifs?.data?.map((gif, index) => (
                    <GifCard key={index} gif={gif} />
                ))}
                {state?.paginationLoader ? <div className={styles.paginationLoader}><img src={loaderImage} alt="loader" height="100px" width="150px" /></div> : null}
                {!state?.loader && state?.gifs?.data?.length === 0 ? (<h6 className={styles.message}>{state?.searchValue} is not found</h6>) : null}
            </div>
        </div>
    );
};

export default Gifs;
