[![npm version](https://badge.fury.io/js/keen-slider.svg)](https://badge.fury.io/js/keen-slider)
[![Build Status](https://travis-ci.org/rcbyr/keen-slider.svg?branch=release)](https://travis-ci.org/rcbyr/keen-slider)
[![dependencies Status](https://david-dm.org/rcbyr/keen-slider/status.svg)](https://david-dm.org/rcbyr/keen-slider)
[![devDependency Status](https://david-dm.org/rcbyr/keen-slider/dev-status.svg)](https://david-dm.org/rcbyr/keen-slider#info=devDependencies)

# keen-slider

The HTML touch slider carousel with the most native feeling you will get.

Features:

- great performance and fully responsive
- only 2.3 KB gzipped
- works great and the same, on all devices and browsers (>= IE10)
- no dependencies
- typescript compatible
- examples for the most common frameworks/libraries (React, Vue.js, Angular and LitElement)
- simple but powerful API

Demo: https://rcbyr.github.io/keen-slider/

## Getting Started

### Install with npm

```
$ npm install --save keen-slider
```

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="path/node_modules/keen-slider/dist/keen-slider.min.css"
    />
  </head>
  <body>
    <div id="my-keen-slider" class="keen-slider">
      <div class="keen-slider__track">
        <div class="keen-slider__slide"></div>
        <div class="keen-slider__slide"></div>
        ...
      </div>
    </div>

    <script src="path/node_modules/keen-slider/dist/keen-slider.min.js"></script>
    <script>
      new KeenSlider('#my-keen-slider')
    </script>
  </body>
</html>
```

### Use as ES-Module

```javascript
// optionally import CSS here
import 'keen-slider/dist/keen-slider.min.css'
import KeenSlider from 'keen-slider'

const options_and_events = {
  created: function() {
 console.log('Congratulations! Your slider has ' + this.length + 'items')
  }
  loop: true
}
const slider = new KeenSlider('#my-keen-slider', options_and_events)
```

### Use from CDN

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/keen-slider@latest/dist/keen-slider.min.css"
    />
  </head>
  <body>
    <div id="my-keen-slider" class="keen-slider">
      <div class="keen-slider__track">
        <div class="keen-slider__slide"></div>
        <div class="keen-slider__slide"></div>
        ...
      </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/keen-slider@latest/dist/keen-slider.min.js"></script>
    <script>
      new KeenSlider('#my-keen-slider')
    </script>
  </body>
</html>
```

## API

### Create Slider

```javascript
var slider = new KeenSlider('#my-slider')
```

- **container** has to be from type HtmlElement or String
  (CSS-Selektor)
- **params** has to be from type object, with [options](#options) and [event hooks](#event-hooks) (optional)

**returns** a slider instance with public [methods](#methods) and [getters](#getters)

### Options

The following options are available.

| Option        | Type                  | Default                                     | Description                                                             |
| ------------- | --------------------- | ------------------------------------------- | ----------------------------------------------------------------------- |
| initialSlide  | Integer               | 0                                           | initial activate slide                                                  |
| loop          | Boolean               | true                                        | infinity loop of slides                                                 |
| moveDuration  | Integer               | 500                                         | animation time                                                          |
| moveEasing    | Function              | function (t) { return \-\-t \* t \* t + 1 } | method animation easing                                                 |
| selectorSlide | String or Function    | ".keen-slider\_\_slide"                     | selector for the slides or function that returns a list of HtmlElements |
| selectorTrack | String or HtmlElement | ".keen-slider\_\_track"                     | selector for the track                                                  |
| touchControl  | Boolean               | true                                        | control slider with mouse or touch gestures                             |
| virtualSlides | Integer               | null                                        | Disables dom manipulation and ignores track and slides. Simulates slider with given number of slides. Use move hook to get slider details. |

```javascript
var options = {
  loop: false,
  initialSlide: 2,
}
var slider = new KeenSlider('#my-slider', options)
```

### Event hooks

The following event hooks are available.

| Event     | Params | Description                                                                      |
| --------- | ------ | -------------------------------------------------------------------------------- |
| changed   | slide: number  | Fires after current slide has changed, but before the move animation has started |
| created   | -      | triggered after initialization                                                   |
| dragStart | -      | triggered after dragging is started and scrolling is blocked                     |
| dragEnd   | -      | triggered after dragging was stopped                                             |
| move      | details: TDetails | triggered after slider has moved by any reason |

TDetails

| Property  | Description                                 |
| ------- | ------------------------------------------- |
| currentSlide | number of the slide in viewport  |
| direction | current direction of movement -1, 0 or 1  |
| progress  | progress of slider 0 to 1 - with loop enabled, +-(1 / slides * .5)|
| progressSlides | to be written  |
| targetSlide | number of the slide, where the slider will move to  |



Example:

```javascript
var options = {
  changed: function (slide) {
    console.log('Slide ' + slide + ' of ' + this.length)
  },
}
var slider = new KeenSlider('#my-slider', options)
```

### Getters

The following getters are available on a slider instance.

| Getter  | Description                                 |
| ------- | ------------------------------------------- |
| current | get number of current slide (starts with 0) |
| length  | number of slides                            |

Example:

```javascript
var slider = new KeenSlider(container, params)
console.log('number of slides:' + slider.length)
```

### Methods

The following methods are available on a slider instance.

| Method           | Arguments                                        | Description                                                                                                                               |
| ---------------- | ------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- |
| destroy          | -                                                | remove events and helper slides of the loop - reset() would undo this                                                                     |
| moveToSlide      | slide(Integer), instant(Boolean, Default: false) | move to given slide - optionally without animation                                                                                        |
| next             | -                                                | move to next slide                                                                                                                        |
| prev             | -                                                | move to previous slide                                                                                                                    |
| reset            | -                                                | reinitialize the loop and events and resize the slides - when you add/remove slides                                                       |
| updateLoop       | -                                                | since the first and last slides are cloned to make the loop work, you may want to update the cloned items when the slider content changes |
| setTouchControls | activate(Boolean)                                | add touch control events                                                                                                                  |
| resize           | -                                                | manually trigger a resize, to recalculate width of slides                                                                                 |

Example:

```javascript
var slider = new KeenSlider(container, params)
setInterval(slider.next, 5000)
```

## Examples

Demo & Examples: https://rcbyr.github.io/keen-slider/

If you miss a feature to build the slider you need, create an issue and I will try to help you out.
