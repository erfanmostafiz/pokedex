import { useState } from "react";
import { first151Pokemon, getFullPokedexNumber } from "../utils";
export function SideNav(props) {
    const {
        selectedPokemon,
        setSelectedPokemon,
        handleToggleMenu,
        showSideMenu,
    } = props;

    // Search Functionality
    const [searchValue, setSearchValue] = useState("");

    // create a filtered pokeomon list
    const filteredPokemon = first151Pokemon.filter((ele, eleIndex) => {
        // Search Filter 1:
        // if full pokedex number includes the current search value, return true
        if (getFullPokedexNumber(eleIndex).includes(searchValue)) {
            return true;
        }

        // if pokemon name includes the current search value, return true
        // el is the current entry at the index
        if (ele.toLowerCase().includes(searchValue.toLowerCase())) {
            return true;
        }

        // otherwise, exclude value from the array
        return false;
    });

    return (
        <nav className={" " + (!showSideMenu ? "open" : "")}>
            <div className={"header " + (!showSideMenu ? "open" : "")}>
                <button onClick={handleToggleMenu} className="open-nav-button">
                    <i className="fa-solid fa-arrow-left-long"></i>
                </button>
                <h1 className="text-gradient">Pokédex</h1>
            </div>

            <input
                placeholder="E.g. 001 or Bulba..."
                value={searchValue}
                onChange={(e) => {
                    setSearchValue(e.target.value);
                }}
            />
            {filteredPokemon.map((pokemon, pokemonIndex) => {
                const truePokedexNumber = first151Pokemon.indexOf(pokemon);
                return (
                    <button
                        onClick={() => {
                            // on mobile, close the menu bar once the pokecard is selected
                            handleToggleMenu();
                            setSelectedPokemon(truePokedexNumber);
                        }}
                        key={pokemonIndex}
                        className={
                            "nav-card " +
                            (pokemonIndex === selectedPokemon
                                ? " nav-card-selected"
                                : " ")
                        }
                    >
                        {/* Find the index of the pokemon from the 151 pokemon list */}
                        <p>{getFullPokedexNumber(truePokedexNumber)}</p>
                        <p>{pokemon}</p>
                    </button>
                );
            })}
        </nav>
    );
}
