# React Audio visualizer

> An audio player and live spectrogram.
> Live demo [_here_](https://spectrum-audio.netlify.app).

## Table of Contents

---

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
<!-- - [Contact](#contact) -->

## General Information

---

- Project began while experimenting with React and audio spectogram graphs built with D3.
- Initially curious about how React performed with on the fly svg graph generation (not good), I expanded this project into a fully functional audio app.
- No third party audio integrations such as Howler.js were used. This lead to both admiration for how powerful the web audio api can be, but also, frustration with some of its limiting factors including long standing chrome bugs.
- Some specific React technology used was a heavy reliance on useCallback and Refs for the custom audio hook as well as less common hooks such as useLayoutEffect as part of the custom hook written to use requestAnimationFrame with React.

## Technologies Used

---

- Vite.js
- React.js
- Typescript
- D3.js svg path generation
- Zustand state management
- Uuid for library ids
- a few functions from Lodash and usehooks-ts such as useInterval and useMediaQuery that weren't worth reinventing the wheel for.

## Features

---

- Audio spectrum displays live track frequency Hz, color coded by decibel range.

## Screenshots

![Example desktop screenshot](./img/screenshot-desktop.png)

<details>

  <summary>Click here to show mobile screenshot</summary>

![Example mobile screenshot](./img/screenshot-mobile.png)

</details>

<br/><br/>

## Setup

---

`npm install` No other dependencies required.

## Usage

- `npm run dev`

  or

- `npm run build` then `npm run preview`

## Room for Improvement

---

Room for improvement:

- A button is needed for user to disable the spectogram animation but this may require architectural changes to the useAudio hook...See chrome issue below

## Lessons learned / Issues

Include unexpected issues / bugs encountered. How were they resolved?

- Solid.js is by far the better choice for animating svgs in this manner. This does not run well at over 256 svg paths where Solid.js can easily handle 1024 paths at 60fps.
- Styling range sliders with a before current value color and after current value color is a non trivial problem. Cross browser consistency of pseudo elements is lacking [This stack overflow answer was very helpful](https://stackoverflow.com/a/66802544/19766980)
- It took a while to figure out the intricacies of audio context and the necessity of handling it as singleton global state shared between player and audio graph.
- A simple toggle to enable/disable the spectrogram animation turned out to be an architectural nightmare because chrome has a [long standing Issue 429204 from 2014](https://bugs.chromium.org/p/chromium/issues/detail?id=429204) and [github issue](https://github.com/webAudio/web-audio-api/issues/1202). You cannot attach multiple MediaElementAudioSourceNodes to a single `<audio>` element. Disconnect doesn't destory they element or connection...Works great in Firefox!
- Control flow for calling Play and Pause on the audio api ended up requiring careful management of Refs and promises to not throw exceptions from stale state and interrupted promises. For example: not storing the Play promise in a Ref caused interruptions by pause requests when seeking with the progress bar, while calling play on a new song withing the same action as setting new song state throws a play interrupted by load event exception...

## Acknowledgements

- This project was inspired by Jack Herrington's very cool [60FPS Solid-JS Audio Spectrum Visualizer Project](https://www.youtube.com/watch?v=Xt1dNdJpgw4)
- All audio tracks from [https://freemusicarchive.org](https://freemusicarchive.org)
- Quill icons by Casper Lourens.

<!-- ## Contact -->
