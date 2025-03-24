import { useEffect, useState } from "react";
import { getFullPokedexNumber, getPokedexNumber } from "../utils";
import { TypeCard } from "./TypeCard";
import { Modal } from "./Modal";

export function PokeCard(props) {
    const { selectedPokemon } = props;
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [skill, setSkill] = useState(null);

    // destructure info out of data object, even if it is null data type
    const { name, height, abilities, stats, types, moves, sprites } =
        data || {};

    // Create an array from all the keys from the sprites

    const imgList = Object.keys(sprites || {}).filter((val) => {
        // Using the filter method to filter out when sprites at the particular value returns undefined
        if (!sprites[val]) {
            return false;
        }
        // or if the values, which is the keyname, has either of the values in it, return false
        if (["versions", "other"].includes(val)) {
            return false;
        }
        // if neither of the above 2 cases is true, then we keep the image, and if one of them is true, we filter it out
        return true;
    });

    useEffect(() => {
        // if loading, exit logic
        if (loading || !localStorage) {
            return;
        }
        // check if the selected pokemon information is available in the cache
        // 1. define the cache
        let cache = {};
        if (localStorage.getItem("pokedex")) {
            cache = JSON.parse(localStorage.getItem("pokedex"));
        }

        // 2. check if the selected pokemon is in the cache, otherwise fetch from the API

        if (selectedPokemon in cache) {
            //read from cache
            setData(cache[selectedPokemon]);
            console.log("Found pokemon in cache");
            return;
        }

        // we passed all the cache stuff to no avail and now need to fetch the data from the api

        async function fetchPokemonData() {
            setLoading(true);
            try {
                const baseUrl = "https://pokeapi.co/api/v2/";
                const suffix = "pokemon/" + getPokedexNumber(selectedPokemon);
                const finalUrl = baseUrl + suffix;
                const res = await fetch(finalUrl);
                const pokemonData = await res.json();
                setData(pokemonData);
                console.log("Fetched pokemon data");
                cache[selectedPokemon] = pokemonData;
                localStorage.setItem("pokedex", JSON.stringify(cache));
            } catch (err) {
                console.log(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchPokemonData();

        // if we fetch from the api, make sure to save the information to the cache for next time
    }, [selectedPokemon]);

    // secondary return
    if (loading || !data) {
        return (
            <div>
                <h4>Loading...</h4>
            </div>
        );
    }

    return (
        <div className="poke-card">
            <Modal handleCloseModal={() => {}}>
                <div>
                    <h6>Name</h6>
                    <h2></h2>
                </div>
                <div>
                    <h6>Description</h6>
                    <p>desfwef</p>
                </div>
            </Modal>

            <div>
                <h4>#{getFullPokedexNumber(selectedPokemon)}</h4>
                <h2>{name}</h2>
            </div>
            <div className="type-container">
                {types.map((typeObj, typeIndex) => {
                    return (
                        <TypeCard key={typeIndex} type={typeObj?.type?.name} />
                    );
                })}
            </div>
            <img
                className="default-img"
                src={
                    "/pokemon/" + getFullPokedexNumber(selectedPokemon) + ".png"
                }
                alt={`${name}-large-img`}
            />
            <div className="img-container">
                {imgList.map((spriteUrl, spriteIndex) => {
                    const imgUrl = sprites[spriteUrl];
                    return (
                        <img
                            key={spriteIndex}
                            src={imgUrl}
                            alt={`${name}-img-${spriteUrl}`}
                        />
                    );
                })}
            </div>
            <h3>Stats</h3>
            <div className="stats-card">
                {stats.map((statObj, statIndex) => {
                    const { stat, base_stat } = statObj;
                    return (
                        <div key={statIndex} className="stat-item">
                            <p>{stat?.name.replaceAll("-", " ")}</p>
                            <h4>{base_stat}</h4>
                        </div>
                    );
                })}
            </div>
            <h3>Moves</h3>
            <div className="pokemon-move-grid">
                {moves.map((moveObj, moveIndex) => {
                    return (
                        <button
                            // className="button-card pokemon-move"
                            className="pokemon-move"
                            key={moveIndex}
                            onClick={() => {}}
                        >
                            <p>{moveObj?.move?.name.replaceAll("-", " ")}</p>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
