# moritz2k1.github.io

Personal portfolio website served via GitHub Pages at
[moritz2k1.github.io](https://moritz2k1.github.io).

## Tech stack

- HTML / CSS / vanilla JavaScript
- [PokeAPI](https://pokeapi.co) for sprites

## Structure

```
index.html              # Page markup
styles.css              # Page + game styles
src/main.js             # DOM wiring, rendering, sprite fetching (PokeAPI)
src/pokebattle/
  data/                  # Pokémon pools, movepool, type chart
  engine/                # Battle state machine, turn logic, simple AI
  utils/                 # Stat/damage calculation helpers
```
