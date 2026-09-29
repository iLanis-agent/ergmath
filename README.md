# ErgMath

Honest math for the rowing ergometer: split-to-watts conversion, distance and time projections, predicted 2k, weight-scaled calories, damper-to-drag translation, and watts per kilo.

## Run it

Static site. Open `index.html` (landing) or `app.html` (the calculator). On GitHub Pages the root serves the landing page.

## What it computes

- **Split and watts** - `W = 2.8 * (500/split)^3`: the cubic relationship means a 5-second split gain costs more watts the faster you go.
- **Distance and time** - meters covered in a piece, seconds for a distance, predicted 2k from a sustainable split.
- **Calories** - the monitor's `4*W + 300` assumes a 175 lb body; the basal part scales with your actual weight.
- **Damper and drag** - damper 1-10 maps to drag factor roughly 97-205; most rowers do their best steady work near 120-135, whatever the damper says. Higher drag is a heavier feel, not more fitness.
- **Fair comparisons** - watts per kilogram beats raw watts across body sizes, and rough bands place a 2k score.

## Files

- `index.html` - landing page
- `app.html` - the calculator
- `engine.js` - pure math (also usable from Node: `require('./engine.js')`)
