# Bounce Away

## Introduction

This package is an interactive game for all ages from 5 upward. It consists of a an interactive display area into which "balls' are projected from one end to be hit by the player with a "bat" with the aim of directing them into a basket at the other. The bat can be manipulated using the arrow keys, or on a mobile or touch screen by touch and drag.

Author: Robin Warner (narayana-art.co.uk)

## Technology

This is a web game and is written in react-pixi/react-router-dom JSX with scalable graphics for mobile or PC usage. Page layout will be using react-bootstrap.

Once the specification has been drafted, it will be submitted to ChatGPT plus for an initial cut at the program and then details (such as graphic files) supplied by the programmer.

The Author will then compare testing/development times actualised, with the estimated times of the original schedule as if hand-coded.

### Installed Packages

npm install react
npm install @pixi/react pixi.js
npm install react-bootstrap

### Coding Instructions for ChatGPT

Please use the react file and directory conventions.

Indicate all file names and directories with the code.

Please use the conventional react-router-dom file conventions for the page routing (ie: use src/index.js to define the router and src/routes/root.js to actualise the navbar and the detail section (Outlet component))

## Specification

The website has two pages. One for the game, which is on the main page and one for the session scores list. These should be available via a top navigation bar.

The top navigation bar should be of a distinctive color (allowing for legible writing) with a left-side graphic (bounce-logo.png) and supplied by the programmer (Robin Warner) and the title "Bounce Away" in a fancy script.

### Main Page

On the main page, the score-line is above the stage and along with its title should be centred

The stage area should be automatically scalable (depending on window size) for mobiles vertically or horizontally, for tablets,
vertically or horizontally and for laptops/pc's up to a maximum width of 1000px (minimum suggested is 390px). The stage area should be dark to mid-grey. The height should be between 300 and 450 pixels, to fit the display allowing for the navbar and score-line above the stage.

The balls for the game are to appear from the left of the stage from 1/3 of the way from the bottom, to 1/3 of the way to the top. There are two graphics for the balls (fastball.png, slowball.png) and these appear one at a time from the left on a trajectory of between 60 degrees above the horizontal, to 60 degrees below the horizontal. They should appear on average once every 2.5 seconds and the choice of slow or fast ball is random. The fast balls should travel at an average straight-line speed of one stage width in 2 seconds, the slow, 3 seconds. The balls will bounce-off of any wall they strike (except the right) following Newtonian physics, but losing no speed. When the balls contact the right hand side of the stage, they disappear through it. A game consists of 25 balls. Balls are 30 pixels in diameter.

At the centre of the right hand wall is a basket (basket.png) projecting 70 pixels to the left. This is a box-shape and extends downward 70 pixels. If a ball lands within the upper edge of the basket it scores 10 points for a fast ball, 5 for a slow ball. If the ball strikes the vertical edge of the basket, it bounces off it following the same rules as for the walls. If a ball strikes the lower edge of the basket, it bounces off it following the same rule. Scores are updated on the score-line above the stage. A "Ding" sound is produced when the ball enters the basket (src/sounds/ding.mp3)

The bat (bat.png) is a horizontal bat 70 pixels wide and 30 pixels deep. It can be moved either up or down or left or right, using touch screen drag and drop or the pc arrow keys. When a ball strikes the bat, it bounces following newtonian physics, but adding the velocity of the bat on the vectors of motion of the ball. The velocity of the bat is assumed to be one stage width in 0.5 seconds. Each of the sides of the bat operate in the same way, allowing for their location with respect to the ball. A beep sound (200 msec) is produced when a ball strikes the bat.

Once the game is complete (ie: when the last ball is off the stage), the score-line indicates "Game Over" as well as the "Final Score". The session score and game number are recorded for the scores page.

Note that the graphics are stored in src/images.

#### Details of Ball and Bat Interaction

The bat is rectangular and has 4 orthogonal direct reflective surfaces. In addition the 4 corners of the bat are circular arcs being 0.25 of the bat height in radius. These produce a bounce that is the sum of the incoming vector of the ball relative to the vector angle toward the centre of the arc.

This approach works fine until we have to take account of the motion of the bat as well as of the ball (ie: if the bat is moving) in this case, the motion of the bat may have a double effect on the ball (as if it were struck twice), reversing the vectors inappropriately. To overcome this we can use a state to indicate that the bat is moving, then when the ball is recorded as striking the bat we can add the vector of motion of the bat to add to the vector of motion of the ball.

The velocity of the bat depends upon the drag rate of the user and so is measured as the bat moves. This is sampled 10 times per second, as opposed to the ball, whose base velocity is based on the frame rate of 60 samples per second. So the bat velocity needs to be scaled accordingly.

### Score Page

The score page has the title "Game Scores" at the top. If no games have been played, the line below states "No Games Played Yet"

The game score chart appears beneath the table and has three columns, Game Number, Score, Percentage with the entries ranked
in percentage order. The percentage is calculated from the actual score divided by the maximum possible score of the game. (This varies from game to game, since the slow and fast balls are generated at random).

Below the chart are two lines, the first gives the average score and the second the average percentage for all the games played.

Use a bold font for the text on this page.

### Schedule

The code written for this project is initially prepared by ChatGPT Plus (October 2023) and then modified by the programmer as required, so the actual times are based on this. Note that the relatively long estimated development times allow for familiarisation with the react-pixi development.

Development Times (man-days):

| Item                          | Hand-Code (est.) | Actual |
| ------------------------------| ---------------- | ------ |
| Navbar                        | 0.5              |   1.0  |
| Ball Images (to draft)        | 0.5              |   0.2  |
| Basket Image                  | 0.2              |   0.2  |
| Bat image                     | 0.2              |   0.5  |
| Stage Layout                  | 0.3              |   0.3  |
| Motion and Physics of balls   | 8.0              |   5.0  |
| Motion and interaction of bat | 6.0              |   5.0  |
| Ball into basket              | 5.0              |   0.5  |
| Scoring                       | 2.0              |   1.0  |
| Game Scores Page              | 2.0              |   1.0  |
| TOTALS                        | 26.7             |   14.7 |
Completion Date: Monday 6th Nov 2023

Documentation:   Est. 2.0
Systems Testing: Est. 3.0

#### Developments Phase 1A

| Item                              | Actual Time |
| --------------------------------- | ----------- |
| On bat bounce clear by 2 * vector | 2.0         |
| Corner bounces                    | 2.0         |
| Check bat in basket               | 0.2         |
| Click position check edges/basket | 0.5         |
| Check for bat moving on bounce    | 1.0         |
| Resize stage, adjust bat position | 0.2         |
| Fast/Slow ball speed control      | 0.5         |
| Set width of stage to 100% of Col | 0.1         |
| Adjust scoring for ball speed     | 0.3         |
| Tidy-up Tool and Header layout    | 0.2         |
| Put border around stage           | 0.1         |
| Clear console logs                | 0.1         |
| Tidy-up score table               | 0.1         |
| TOTALS                            | 7.3         |
Completion Date: Tuesday 14th Nov 2023

#### Phase 1 Release Phases

| Item                              | Actual Time |
| --------------------------------- | ----------- |
| Build Production Model            | 0           |
| Release to Heroku                 | 0.1         |
| Test on Mobile Device             | 2.0         |
| Make Necessary Modifications      |             |
| Add Link in Narayana-Art          | 1.5         |
| TOTALS                            | 3.6         |

Critique arising: Game too hard with bat controls.

Heroku App Name: https://bounce-away-0573028c80c3.herokuapp.com

#### Phase 1B - Tasks Arisng

| Item                              | Actual Time |
| --------------------------------- | ----------- |
| Favicon Icon                      | 0.1         |
| Title                             | 0           |
| Link To Zing Games                | 0           |
| Update to Heroku                  | 0.1         |
| TOTAL                             | 0.2         |

#### Phase 1C - Tasks Arising

Because the basic game seems to hard, I have decided to include an 
optional ball path predictor, and double the scores if it is
turned off. The feature can be turned off by clicking the relevant
feature button.

In harmony with this feature, change the Sound Enable/Disable button
to a speaker graphic.

| Item                              | Actual Time |
| --------------------------------- | ----------- |
| Graphic for Sound                 | 0.1         |
| Graphic for Path Trace            | 0.1         |
| Code for Path Trace               | 1.5         |
| Rework bat bounces                |
| TOTAL                             |