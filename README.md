# Pontos

A partial clone of the [Dots](http://weplaydots.com/) game (buy the original, it's awesome!). See a demo at [http://viniciuspinto.github.io/pontos/index.html](http://viniciuspinto.github.io/pontos/index.html) and a themed version at [http://dogedots.com/](http://dogedots.com/)

## Features

* Play by # of moves (time limited play is currently not supported)
* Extras: remove one dot, remove by color
* Personal high scores (stored locally on cookies)
* Touch / mobile support
* Publisher: customize board size, # of moves, allowed extras, etc.

## Browser compatibility

Tested on:

- Latest Firefox, Chrome and Safari on Mac OS X
- IE 11 on Windows 8.1
- iOS 6 Safari on real device
- iOS 7 Safari on simulator
- Android 4.4 default browser on emulator

## Basic Setup

1 - Add the basic stylesheet;<br />
2 - Create an empty wrapper `<div>`;<br />
3 - Add the game JS;<br />
4 - Load the game.

```
    (..)
    <link href="pontos/style.min.css" rel="stylesheet" type="text/css" />
</head>

<body>
    <div id="mygame"></div>

    <script src="pontos/pontos.full.min.js"></script>
    <script>
    Pontos.GameManager.load({
        container: $('#mygame'),
        filesPath: 'pontos/',
        width: 400
    });
    </script>
</body>
```

The above setup will create a game with width 400 and the appropriate height according to the default aspect ratio. You may want to make it fit the screen size or just set the dimensions on the wrapper div and omit the `width`, check the options below.

You can add a theme by including its CSS file, like the provided `themes/doge/theme-doge.min.css` (available under dist/). To create your own theme, check the `template_main.html` to see the HTML structure and class names.

## Options

The only required option is `filesPath`, but if you don't set a proper width/height for the wrapper div and don't pass TRUE to `fitToScreen` (see below), you may end up with a gigantic game board (might be fun, though).

```
Pontos.GameManager.load({
  container: $(..)      // An existing wrapper element to hold the game
  filesPath: './',      // Path to the directory holding the game files
  width: 200,           // The width of the game container (may be changed to keep aspect ratio)
  height: 250,          // The height of the game container (may be changed to keep aspect ratio)
  fitToScreen: false,   // Whether to make the game fit to visible screen, even after window resizes
                        // (width and height options will be ignored)
  minWidth: 300,        // The minimum width of the game container. Valid only when fitToScreen is TRUE
  containerRatio: 0.8   // The (Width / Height) container ratio. Adjust this for custom board size, etc.
  expandBg: false       // If TRUE, will expand the background to fill the screen
  board: {
    width: 6,           // number of dots horizontally
    height: 6           // number of dots vertically
                        // NOTE: some board sizes will make the game impossible or too easy to play
  },
  moves: 30,            // Maximum number of moves allowed by the player
  extras: {
    removeSingle: {
      unlimited: true,  // Whether the player can remove a single dot any time
      remaining: 0      // Number of times the player can remove a single dot (if not unlimited)
    },
    removeColor: {
      unlimited: false, // Whether the player can remove dots by color any time
      remaining: 1      // Number of times the player can remove dots by color (if not unlimited)
    }
  },
  maxHighScores: 10,      // Maximum number of scores to keep (currently only 5 are shown in the end screen)
  sayings: [],            // An array of strings to be randomly displayed after color removals
  tweetText: '',          // Text for sharing on Twitter. The "<!score>" token will be replaced by the user's score
  facebookAppId: '',      // If passed, it will show the Facebook widget at the end screen
  facebookSharedUrl: '',  // The URL used for Facebook sharing
  footerContent: '',      // Any markup to be added to the bottom of the board
  statsHandler: '/stats', // A path on the same server to POST stats to. See info below.
  infoContent: '...'      // Any HTML to be displayed when the INFO link is clicked
});
```

### About the game dimensions

If you have a limited space to put the game board, the best way to configure it is to set the dimensions of the wrapper div (that you create in your HTML) and NOT pass any height / width.

If you want the game to occupy the whole width or height of the screen (depending on the aspect ratio), just pass TRUE to `fitToScreen` and leave out any width or height. In this case, you may pass a `minWidth` value to avoid having a board that is too small.

## Statistics

If a path is provided in the `statsHandler` option, after each game there will be a POST to that path with the following data:

```
playedGames: [
  {
    score: [number of points in this game],
    closedPaths: [number of times the player performed a closed path],
    time: [time in seconds of this game]
  }
]
```

## Distribution files

`dist/pontos.full.min.js` - minified game source + required libs<br />
`dist/pontos.min.js` - minified game source without the required libs<br />
`dist/template_main.html` - game template file (check it if you want to customize the layout)<br />
`dist/style.min.css` - basic game stylesheet<br />
`dist/themes/doge/*` - doge theme (so amaze)<br />

## Libraries

This game uses code from the following projects:

- [jQuery](http://jquery.com)
- [jQuery Mobile](http://jquerymobile.com)
- [Cookies.js](https://github.com/ScottHamper/Cookies)
- [Modernizr](http://modernizr.com/)
- [viewportSize](https://github.com/tysonmatanich/viewportSize)
- [animate.css](https://github.com/daneden/animate.css)

## License

The MIT License (MIT)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

