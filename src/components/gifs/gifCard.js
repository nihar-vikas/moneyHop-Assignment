import React from "react";
import styles from "./styles.module.css";

const GifCard = ({ gif }) => {
    return (
        <div className={styles.gifCard} key={gif.trending_id}>
            <div className={styles.gifCardContent}>
                <img
                    className={styles.gifCardImg}
                    loader="lazy"
                    width="100%"
                    src={gif?.images?.fixed_height?.url || gif?.cover_gif?.gif?.images?.fixed_height?.url}
                    height={gif?.images?.fixed_height?.height || gif?.cover_gif?.gif?.images?.fixed_height?.height}
                    alt="gif"
                />
            </div>
        </div>
    );
};

export default GifCard;
