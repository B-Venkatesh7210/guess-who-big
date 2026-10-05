# SCALE IT — PROJECT CONSTITUTION

This file defines the permanent product, UX, engineering, visual,
interaction, and content rules for SCALE IT.

Every future feature must follow these rules unless the product owner
explicitly changes this document.

Do not reinterpret the design system independently in different pages.

--------------------------------------------------
PRODUCT IDEA
--------------------------------------------------

SCALE IT is a visual intuition game about understanding the scale of the
real world.

The player sees:

REFERENCE OBJECT
vs
TARGET OBJECT

The reference object's scale is known internally.

The player changes the target object's visual size until they believe its
real-world dimensions are correct relative to the reference.

The emotional sequence should always be:

CURIOSITY
→ ESTIMATION
→ COMMITMENT
→ ANTICIPATION
→ REVEAL
→ SURPRISE
→ REWARD
→ NEXT ROUND

The reveal is as important as the guessing interaction.

--------------------------------------------------
PRODUCT PRINCIPLE
--------------------------------------------------

Never optimize for adding more features before improving the core interaction.

The primary question should always be:

“Does this make estimating and discovering real-world scale more satisfying?”

SCALE IT should feel like:

premium daily web game
+
interactive science exhibit
+
modern editorial visualization

It must NEVER feel like:

SaaS dashboard
admin panel
crypto app
generic Tailwind template
mobile casino
neon gamer UI

--------------------------------------------------
BRAND PERSONALITY
--------------------------------------------------

Personality:

smart
playful
minimal
curious
slightly mysterious
scientific
confident

Not childish.

Not corporate.

Not overly comedic.

Humor may appear in feedback text.

--------------------------------------------------
PRIMARY COLORS
--------------------------------------------------

Use semantic tokens.

Never hardcode random colors directly inside components.

Background:
--background: #07090D

Elevated background:
--surface: #0D1117

Secondary surface:
--surface-2: #121821

Border:
--border: #202936

Muted border:
--border-subtle: #161D26

Primary text:
--text-primary: #F4F7FA

Secondary text:
--text-secondary: #8D99A8

Muted text:
--text-muted: #5D6875

REFERENCE OBJECT:
--reference: #4EA1FF

TARGET OBJECT:
--target: #FF5C55

Positive:
--success: #69D391

Warning:
--warning: #F3C969

Danger:
--danger: #FF655F

Blue MUST always represent the reference object.

Red/coral MUST always represent the object the player controls.

Never swap this semantic relationship.

--------------------------------------------------
TYPOGRAPHY
--------------------------------------------------

Main font:
modern geometric sans.

Recommended:
Inter
Geist
or equivalent.

Data / measurements / score:
monospace.

Recommended:
Geist Mono.

Use uppercase monospace labels for:

ROUND
SCORE
ERROR
YOUR GUESS
ACTUAL
REFERENCE
TARGET

Avoid excessive uppercase elsewhere.

--------------------------------------------------
TYPE HIERARCHY
--------------------------------------------------

Primary headline:
large, bold, minimal.

Game instructions:
short and readable.

Measurement/data:
monospace.

Descriptions:
secondary color.

Never create extremely large marketing typography that pushes the game
below the fold.

The game itself is the hero.

--------------------------------------------------
SPACING SYSTEM
--------------------------------------------------

Use:

4
8
12
16
24
32
48
64

Do not invent arbitrary spacing unless mathematically required for the
game canvas.

--------------------------------------------------
BORDER RADIUS
--------------------------------------------------

Small controls:
8px

Buttons:
10–12px

Panels:
14–16px

Large game canvas:
16px

Avoid excessive pill-shaped UI.

Avoid putting every piece of information inside a card.

--------------------------------------------------
GAME CANVAS
--------------------------------------------------

The game canvas is always the visual focus of /play.

It must occupy the largest amount of visual attention.

Canvas contains:

measurement grid
baseline
reference object
target object
labels
resize interaction
zoom controls

The canvas must remain visually clean.

Never place unrelated UI inside the canvas.

--------------------------------------------------
BASELINE RULE
--------------------------------------------------

Every object must visually rest on the SAME baseline.

This is a core game rule.

When an object scales:

its bottom remains anchored.

It must NEVER scale from its center.

No floating objects.

--------------------------------------------------
REFERENCE OBJECT
--------------------------------------------------

Reference object:

color = blue

It cannot be resized by the player.

Label:

REFERENCE

Object Name
Measurement dimension

Example:

REFERENCE

Basketball
Diameter

Its real-world measurement may be visible.

--------------------------------------------------
TARGET OBJECT
--------------------------------------------------

Target object:

color = coral/red

Player controls its size.

Label:

YOUR OBJECT

Object Name
Measurement dimension

Do NOT reveal its true real-world size until Lock In.

--------------------------------------------------
OBJECT VISUAL LANGUAGE
--------------------------------------------------

V1 uses clean silhouettes.

Silhouettes should:

be immediately recognizable
use currentColor
contain minimal internal details
have consistent visual weight
remain readable at small sizes
remain recognizable at large sizes

Do not mix:

photography
cartoons
emoji
random illustration styles

inside V1.

One consistent silhouette family only.

--------------------------------------------------
MEASUREMENT SYSTEM
--------------------------------------------------

All measurements are stored internally in CENTIMETERS.

Example:

AA battery:
5.05 cm

Basketball:
24 cm

Human:
170 cm

Blue whale:
2400 cm

The math engine is the source of truth.

Never visually approximate scale independently of the math engine.

--------------------------------------------------
CORE FORMULA
--------------------------------------------------

Given:

referenceRealCm
referenceRenderedPx
playerGuessCm

targetRenderedPx =

referenceRenderedPx *
(playerGuessCm / referenceRealCm)

Reverse calculation:

playerGuessCm =

targetRenderedPx /
referenceRenderedPx *
referenceRealCm

--------------------------------------------------
VIEWPORT ZOOM
--------------------------------------------------

Viewport zoom multiplies BOTH objects equally.

It never alters their relative scale.

referencePx *= zoom

targetPx *= zoom

Never manipulate one object's visual scale to make a composition look nicer.

Mathematical truth takes priority.

--------------------------------------------------
TARGET STARTING SCALE
--------------------------------------------------

The target must never start at the correct answer.

Generate an offset around the actual answer.

Suggested:

actualRatio * factor

factor:
0.45 – 1.75

Initial state must be at least approximately 12% away from the true answer.

--------------------------------------------------
PLAYER CONTROLS
--------------------------------------------------

Primary:
drag resize handle.

Secondary:
slider.

Precision:
+ / −.

Desktop:
keyboard support.

Left/right:
small adjustment.

Shift + left/right:
precision adjustment.

The player controls SCALE only.

No horizontal dragging.

--------------------------------------------------
LOCK IN
--------------------------------------------------

Primary action text:

LOCK IN

Do not use:

Submit
Check
Confirm Answer

LOCK IN is permanent product language.

--------------------------------------------------
ANSWER REVEAL
--------------------------------------------------

The reveal sequence must always follow:

1. Player presses LOCK IN
2. controls freeze
3. 200–350ms anticipation delay
4. player's scale becomes a ghost outline
5. solid object animates to correct scale
6. actual measurement appears
7. error appears
8. score counts upward
9. feedback sentence appears
10. educational fact appears
11. NEXT ROUND becomes available

Do not instantly dump all result information.

The reveal should feel earned.

--------------------------------------------------
GHOST SCALE
--------------------------------------------------

After Lock In:

retain player's original scale as a transparent outline.

Correct object becomes solid target color.

Ghost:

low opacity
thin stroke
no distracting animation.

This visually explains the player's error.

--------------------------------------------------
SCORING
--------------------------------------------------

Each round:

0–1000.

Maximum game:

5000.

Relative error:

abs(playerGuess - actual) / actual

Score:

round(
1000 * exp(-3 * relativeError)
)

Clamp:
0–1000.

The scoring function must live in one centralized utility.

Never duplicate scoring logic.

--------------------------------------------------
FEEDBACK LANGUAGE
--------------------------------------------------

Approximate ranges:

< 1%
BULLSEYE.

< 3%
RIDICULOUSLY CLOSE.

< 7%
GREAT EYE.

< 15%
PRETTY CLOSE.

< 25%
NOT BAD.

< 40%
A LITTLE OFF.

< 60%
WAY OFF.

>= 60%
REALITY HAD OTHER PLANS.

Keep sentences short.

Do not insult the player.

--------------------------------------------------
MOTION
--------------------------------------------------

Motion should communicate state.

Not decorate the interface.

Typical duration:

150–250ms:
buttons / UI

300–500ms:
object scaling

500–800ms:
major reveal

Use easeOut / spring carefully.

No excessive bounce.

No constant floating animations.

No looping decorative animation.

Respect prefers-reduced-motion.

--------------------------------------------------
DAILY GAME
--------------------------------------------------

Daily game:

5 rounds.

All players on the same date receive identical rounds.

Generation is deterministic.

Seed:

YYYY-MM-DD

Daily completion is stored locally in V1.

Replaying today's Daily must not modify the original recorded score.

--------------------------------------------------
PRACTICE
--------------------------------------------------

Practice:

5 random rounds.

Unlimited games.

Does not affect Daily data.

Does not affect future streak systems.

--------------------------------------------------
ROUND DIFFICULTY
--------------------------------------------------

Round 1:
Easy

Round 2:
Easy / Medium

Round 3:
Medium

Round 4:
Hard

Round 5:
Wildcard

Difficulty may consider:

target/reference ratio

familiarity

measurement orientation

visual similarity.

--------------------------------------------------
OBJECT DATA MODEL
--------------------------------------------------

Every object has:

id
name
category
measurementType
realSizeCm
svgKey
fact
approximationLabel
sourceNote optional

Example:

{
  id: "aa-battery",
  name: "AA Battery",
  category: "everyday",
  measurementType: "height",
  realSizeCm: 5.05,
  svgKey: "battery",
  fact: "A standard AA battery is approximately 50.5 mm tall.",
  approximationLabel: "Standard size"
}

Variable objects must NEVER pretend to have exact universal dimensions.

Use names such as:

Typical adult
Average domestic cat
Typical city bus
Adult African elephant

--------------------------------------------------
MEASUREMENT TYPES
--------------------------------------------------

Allowed values initially:

height
length
width
diameter
shoulder-height
wingspan

Do not silently compare different axes.

Always tell the player what axis matters.

--------------------------------------------------
FACTS
--------------------------------------------------

Facts appear after reveal.

Maximum:

1–2 sentences.

Facts should:

be interesting
provide context
relate to scale
avoid unnecessary trivia

Example:

“An adult blue whale can grow to roughly 24 metres long.”

Avoid:

long encyclopedia paragraphs.

--------------------------------------------------
GAME HEADER
--------------------------------------------------

Primary navigation:

SCALE IT

Daily
Practice

Secondary:

Help
Sound

Do not overload the nav in V1.

--------------------------------------------------
COPY STYLE
--------------------------------------------------

Short.

Confident.

Human.

Examples:

Match its real-world scale.

How big do you think it really is?

Lock it in.

Bullseye.

Reality had other plans.

Next round.

Avoid phrases like:

“Please adjust the slider to estimate the target object's dimensions.”

--------------------------------------------------
BUTTON HIERARCHY
--------------------------------------------------

Primary:
filled target/coral.

Secondary:
neutral outlined.

Destructive:
rare.

Only ONE dominant CTA should exist at a time.

During guessing:

LOCK IN

After reveal:

NEXT ROUND

--------------------------------------------------
MOBILE FIRST
--------------------------------------------------

390px width must receive first-class treatment.

No horizontal page scrolling.

Game controls must remain touch friendly.

Touch targets:
minimum ~44px.

The target object must remain draggable without precision frustration.

--------------------------------------------------
DESKTOP
--------------------------------------------------

Maximum game content width:

approximately 1100–1200px.

Do not stretch content indefinitely.

Give the game canvas visual breathing room.

--------------------------------------------------
STATE
--------------------------------------------------

Game state should be centralized.

Never derive score, guesses, or completion differently across components.

Game phases:

guessing
locked
revealing
result
complete

Components should respond to the phase.

--------------------------------------------------
ENGINEERING RULE
--------------------------------------------------

Separate:

game mathematics
game state
object data
visual components
storage
animation
routing

Never put all logic inside Game.tsx.

--------------------------------------------------
SUGGESTED STRUCTURE
--------------------------------------------------

components/
  game/
  objects/
  layout/
  ui/

data/
  objects.ts

lib/
  scale/
  scoring/
  random/
  game/
  storage/

types/

--------------------------------------------------
NO FEATURE CREEP
--------------------------------------------------

V1 does NOT contain:

authentication
leaderboards
Size IQ
collections
achievements
multiplayer
Blitz
Survival
Scale Universe
3D objects
user-generated games
payments

Build V1 extremely well first.

--------------------------------------------------
THE V1 TEST
--------------------------------------------------

A completely new user should be able to:

open the site

understand the game within 5 seconds

start playing

resize an object

feel confident about what they're being asked

lock their answer

experience an enjoyable reveal

understand why they got their score

immediately want to try the next round.

If any feature harms this flow, simplify it.

Before implementing any new UI or game mechanic, read PROJECT_CONSTITUTION.md.

Treat it as the project's source of truth.

Do not introduce new colors, spacing systems, interaction language, scoring logic, measurement logic, component patterns, or visual styles that conflict with it.

If an existing implementation conflicts with PROJECT_CONSTITUTION.md, refactor the implementation rather than creating an exception.
