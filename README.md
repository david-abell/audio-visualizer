# React Audio visualizer

> An audio player and live spectogram.
> Live demo [_soon to be here_](https://www.example.com). <!-- If you have the project hosted somewhere, include the link here. -->

## Table of Contents

- [General Info](#general-information)
- [Technologies Used](#technologies-used)
- [Features](#features)
- [Screenshots](#screenshots)
- [Setup](#setup)
- [Usage](#usage)
- [Project Status](#project-status)
- [Room for Improvement](#room-for-improvement)
- [Acknowledgements](#acknowledgements)
- [Contact](#contact)
<!-- * [License](#license) -->

## General Information

- Provide general information about your project here.
- What problem does it (intend to) solve?
- What is the purpose of your project?
- Why did you undertake it?
- Why did you build this way?
<!-- You don't have to answer all the questions - just the ones relevant to your project. -->

## Technologies Used

- Vite.js
- React.js
- D3.js
- Typescript

## Features

List the ready features here:

- Audio spectrum displays live track frequency Hz, color coded by decibel range.
- Awesome feature 2
- Awesome feature 3

## Screenshots

![Example screenshot](./img/screenshot.png)

<!-- If you have screenshots you'd like to share, include them here. -->

## Setup

What are the project requirements/dependencies? Where are they listed? A requirements.txt or a Pipfile.lock file perhaps? Where is it located?

Proceed to describe how to install / setup one's local environment / get started with the project.

## Usage

How does one go about using it?
Provide various use cases and code examples here.

`write-your-code-here`

## Room for Improvement

Include areas you believe need improvement / could be improved. Also add TODOs for future development. If I had more time I would...

Room for improvement:

- Improvement to be done 1
- Improvement to be done 2

To do:

- Feature to be added 1
- Feature to be added 2

## Lessons learned

Include unexpected issues / bugs encountered. How were they resolved?

- Solid.js is by far the better choice for animating svgs in this manner. This runs at 18 fps or lower if trying just to duplicate the number of svg paths solid.js could handle at 60fps.
- Styling range sliders with a before current value color and after current value color is a non trivial problem. Cross browser consistency of pseudo elements is lacking [This stack overflow answer was very helpful](https://stackoverflow.com/a/66802544/19766980)

## Acknowledgements

Give credit here.

- This project was inspired by Jack Herrington's very cool [60FPS Solid-JS Audio Spectrum Visualizer Project](https://www.youtube.com/watch?v=Xt1dNdJpgw4)
- Many thanks to...

## Contact

<!-- Optional -->
<!-- ## License -->
<!-- This project is open source and available under the [... License](). -->

<!-- You don't have to include all sections - just the one's relevant to your project -->
