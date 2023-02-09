# Documentation

Complete documentation of the installation and usage of Keen-Slider. For the documentation of the **old version** click [here](https://keen-slider.io/docs/v5). For documentation of how to use it in **React Native** click [here](https://keen-slider.io/docs/react-native).

## Getting started

The usage of this library is really simple and is explained in many [code examples](https://keen-slider.io/examples). You can add it to any JavaScript or Typescript project you are working on in several way.

### Installation

Install keen-slider from npm.

```
npm install keen-slider
```

### Usage

After installation, you can import the library into your project as follows:

```javascript
import 'keen-slider/keen-slider.min.css'
import KeenSlider from 'keen-slider'
```

or, since it also comes as an UMD bundle, you can insert it directly into your HTML.

```html
<html>
  <head>
    <link
      rel="stylesheet"
      href="node_modules/keen-slider/keen-slider.min.css"
    />
    <!-- you can also load the stylesheet via CDN -->
    <!-- link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.min.css" /-->
  </head>
  <body>
    <!-- YOUR SITE -->
    <script src="node_modules/keen-slider/keen-slider.js"></script>
    <!-- you can also load the script via CDN -->
    <!-- script src="https://cdn.jsdelivr.net/npm/keen-slider@latest/keen-slider.js"></script-->
  </body>
</html>
```

Once you imported the library, you can initiate it. `KeenSlider` needs a `container` as first argument, which could be a **css selector string**, a **HTMLElement** or a **function** that returns a HTML element or css selector string. Optionally, you can pass [`Options`](https://keen-slider.io/docs#options) and [`Event hooks`](https://keen-slider.io/docs#event-hooks) as second argument. [`Plugins`](https://keen-slider.io/docs#plugins) can be passed as third argument.`KeenSlider` returns some [`Properties`](https://keen-slider.io/docs#properties) for further actions.

```javascript
var slider = new KeenSlider(
  '#my-slider',
  {
    loop: true,
    created: () => {
      console.log('created')
    },
  },
  [
    // add plugins here
  ]
)
```

### Usage in React

The library comes with a hook for react. Therefore, the usage is slightly different. Like any react hook, `useKeenSlider` has to be called at the top level of your component. Optionally, you can pass [`Options`](https://keen-slider.io/docs#options) and [`Event hooks`](https://keen-slider.io/docs#event-hooks) as first argument. [`Plugins`](https://keen-slider.io/docs#plugins) can be passed as second argument. The hook returns an array with two items. The first item is a callback function that has to be used as a reference for the **container** of your slider. The second item contains the slider instance or rather the [`Properties`](https://keen-slider.io/docs#properties).

```javascript
import React from 'react'
import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react' // import from 'keen-slider/react.es' for to get an ES module

export default () => {
  const [sliderRef, instanceRef] = useKeenSlider(
    {
      slideChanged() {
        console.log('slide changed')
      },
    },
    [
      // add plugins here
    ]
  )

  return (
    <div ref={sliderRef} className="keen-slider">
      <div className="keen-slider__slide">1</div>
      <div className="keen-slider__slide">2</div>
      <div className="keen-slider__slide">3</div>
    </div>
  )
}
```

### Usage in Vue 3

The library comes with a function that uses the composition API of Vue 3. Therefore, the usage is slightly different Optionally, you can pass [`Options`](https://keen-slider.io/docs#options) and [`Event hooks`](https://keen-slider.io/docs#event-hooks) as first argument. [`Plugins`](https://keen-slider.io/docs#plugins) can be passed as second argument. The hook returns an array with two items. The first item is a `ref()` that has to be used as a reference for the **container** of your slider. The second item contains a `ref()` that contains the slider instance or rather the [`Properties`](https://keen-slider.io/docs#properties).

```html
<script>
  import { ref } from 'vue'
  import { useKeenSlider } from 'keen-slider/vue' // import from 'keen-slider/vue.es' to get an ES module

  export default {
    setup() {
      const [container, slider] = useKeenSlider({ loop: true }, [
        // add plugins here
      ])
      return { container }
    },
  }
</script>

<template>
  <div ref="container" class="keen-slider">
    <div class="keen-slider__slide number-slide1">1</div>
    <div class="keen-slider__slide number-slide2">2</div>
    <div class="keen-slider__slide number-slide3">3</div>
    <div class="keen-slider__slide number-slide4">4</div>
    <div class="keen-slider__slide number-slide5">5</div>
    <div class="keen-slider__slide number-slide6">6</div>
  </div>
</template>

<style>
  @import url('keen-slider/keen-slider.css');
</style>
```

### Usage in React Native

For documentation of how to use it in **React Native** click [here](https://keen-slider.io/docs/react-native).

## Options

To customize keen-slider to your needs there are a lot of options which are listed below. Also, the [`Event hooks`](https://keen-slider.io/docs#event-hooks) are part of these options. If you want to change the options after initialization, you can do that with the update function. See [`Properties`](https://keen-slider.io/docs#properties).

### `breakpoints`: **object**

Changes the options or event hooks for a given breakpoint by overriding the options at the root level. Each `key` has to be a valid media query string e.g. `(orientation: portrait) and (min-width: 500px)`. Each `value` has to be an object with options and/or event hooks. Note: If multiple media queries match, the last one is applied. See the example below:

```javascript
new KeenSlider('#my-slider', {
  loop: true,
  breakpoints: {
    '(min-width: 500px)': {
      loop: false,
    },
  },
})
```

### `defaultAnimation`: **object**

Sets the default animation of the functions `moveToIdx`, `next` and `prev`.

- `duration`: **number** - Duration of the animation in milliseconds.
- `easing`: **function** - Easing of the animation as (`time`: **number**) => **number**.

### `disabled`: **boolean**

If this option is set to **true**, the slider is disabled. No styles or events will be applied. The default is **false**.

### `drag`: **boolean**

Enables or disables mouse and touch control. Default is **true**

### `dragSpeed`: **number | function**

Set the speed that is applied to the slider when dragging it. Number can be passed as a value or function. Minus values would invert the swipe direction. Default is **1**

### `initial`: **number**

Sets the index of the initially visible slide. Default is **1**.

### `loop`: **boolean | object**

Enables or disables carousel/loop functionality of the slider. This option can also be an object where you can set the `min` and/or the `max` index of the carousel.

Defaults to **false**.

### `mode`: **'snap' | 'free' | 'free-snap'**

Sets the animation that is applied after a drag ends. Default is **'snap'**.

### `range`: **object**

Regardless of the slide number, you can define the range of accessible slides.

- `min`: **number** - sets minimum accessible index
- `max`: **number** - sets maximum accessible index
- `align`: **boolean** - aligns the maximum position to the end of the last slide

### `renderMode`: **'precision' | 'performance' | 'custom'**

It is possible that the render performance of the browser slows down, if you have slides with some complexity in markup and CSS. To counteract this problem, you can set this option to **'performance'**. If you want to create your own renderer, you can set this options to **'custom'**. Default is **'precision'**.

### `rtl`: **boolean**

Changes the direction in which the slides are positioned, from left-to-right to right-to-left. Default is **false**.

### `rubberband`: **boolean**

Enables or disables the rubberband behavior for dragging and animation after a drag. Default is **true**.

### `selector`: **string | HTMLElement[] | Nodelist | function | null**

Specifies how the slides from the DOM are received. This could be a **css selector string**, an **array of HTMLElement** or a **function** that gets the container and returns an **array** of **HTMLElement**, a **NodeList**, a **HTMLCollection**, a **string** or **null**. If you don't want the slider to position or scale the slides, set this option to **null**. Default is **'.keen-slider\_\_slide'**.

### `slides`: **object | number | function | null**

Specifies the configuration of the slides. Every time there is an update, resize or change of options, the slide configuration is renewed. Therefore, all functions are called again. Default is **null**.

- **number** - Sets the number of slides to the specified number.

- **object** - Specifies the slides configuration with an object of optional properties.

  - `origin`: **'auto' | 'center' | number** - Sets the origin of the slides. **'auto'** - Adjusts the origins of all slides, so that the first slide aligns left and the last one right. **'center'** - Centers the slides. **number** - Relative to the viewport. Default is **'auto'**.
  - `number`: **number | function | null** - Behaves analog to `slides` if the value is a **number** or **null**. Can be a function as well, that returns a **number** or **null**. Default is **null**.
  - `perView`: **number | function | 'auto'** - Determines what size the slides should be in relation to the viewport/container. If set to `auto`, the slide size is determined based on the size of there corresponding HTML element. Therefore, the `selector`-options must not be **null**. Can be a function as well, that returns **number** or 'auto'. Default is **1**.
  - `spacing`: **number | function** - Defines the spacing between slides in pixel. Can be a function that returns a number. Default is **0**.

- **function** - Specifies the slides configuration with a function that returns an array of slide configurations. A slide configuration has the following optional properties:

  - `origin`: **number** - Determines where the origin of a slide is within the viewport. Default is **0**.
  - `size`: **number** - Determines the relativ size of the slide in relation to the viewport. Default is **1**.
  - `spacing`: **number** - Defines the space to the next slide in relation to the viewport. Default is **0**.

  The function receives as first argument the container size and the slides as an array of HTML elements as the second argument.

- **null** - the slides will be determined by the number of slides that are received by the `selector`-option.

### `vertical`: **boolean**

Changes the direction of the slider from horizontal to vertical. (Note: The height of the `container` must be defined if vertical is true) Default is **false**.

## Event Hooks

Event hooks are functions that the slider calls during its lifecycle. The functions getting the [`Properties`](https://keen-slider.io/docs#properties) as the only argument. Event hooks are part of the [`Options`](https://keen-slider.io/docs#options) and can be specified in the same way.

Below are the event hooks and when they are triggered:

`animationStarted` - Animation was started. An animation takes place after the drag has ended or when calling `moveToIdx()` or `animator.start()`.

`animationStopped` - Animation was stopped.

`animationEnded` - Animation has ended.

`created` - Slider was created.

`destroyed` - Slider was destroyed.

`detailsChanged` - The `details`-property has changed. At each movement, after an option change, and at each initialization or resizing.

`dragged` - Slider was dragged.

`dragStarted` - Drag has started.

`dragChecked` - Direction of dragging was checked and is valid.

`dragEnded` - Drag has ended.

`beforeOptionsChanged` - Options are going to be changed.

`optionsChanged` - Options have changed, e.g. due to an update, resizing(when the number of slides changes) or a change of the breakpoint.

`slideChanged` - Active or most visible slide has changed.

`updated` - the update function was called due to a size change or other trigger

## Methods & Properties

Whether the slider is implemented with a react hook or plain javascript, it returns an instance or an object of properties for further actions. These properties are described below:

### `animator`: **object**

The animator is the module that is responsible for the motion animation of the track. It has the following properties:

- `active`: **boolean** - Indicates whether an animation is active.
- `start`: **function** - Starts a new animation. Needs an **array** of keyframes. The keyframes are processed sequentially.

  ```typescript
  slider.animator.start([keyframe1, keyframe2])
  ```

  A `keyframe`: **object** has the following properties:

  - `distance`: **number** - Distance moved in the animation.
  - `duration`: **number** - Duration of the animation in milliseconds.
  - `earlyExit`: **number** - Optionally sets an earlier termination of the keyframe.
  - `easing`: **function** - Easing of the animation as (`time`: **number**) => **number**.

- `stop`: **function** - Stops the currently active animation, if there is one.
- `targetIdx`: **number | null** - Contains the index that will be active at the end of the animation.

### `container`: **HTMLElement**

The HTML element, that is defined as the container/viewport for the slides.

### `destroy`: **function**

A function that destroys the slider when called. All events and applied styles will be removed.

### `emit`: **function**

```typescript
slider.emit(eventName)
```

Emits an event when called. Requires an `eventName`: **string** as an argument.

### `moveToIdx`: **function**

```typescript
slider.moveToIdx(index, absolute, animation)
```

Changes the active slide with an animation when called.

- `index`: **number** - Specifies the index to be set active.
- `absolute`: **boolean** - Defines if the index is absolute. Default is **false**.
- `animation`: **object** - Modifies the default animation. **Object** can have the following properties:
  - `duration`: **number** - Sets the animation duration is milliseconds. Default is **500**.
  - `easing`: **function** - Sets the easing function. Default is **t => 1 + --t \* t \* t \* t \* t**.

### `next`: **function**

Changes the currently active slide to the next one when called. If exists.

### `on`: **function**

```typescript
slider.on(eventName, callback, remove)
```

Registers an event hook when called.

- `eventName`: **string** - Specifies the event name.
- `callback`: **function** - The function that will be called on this event.
- `remove`: **boolean** - Whether the function should be set or removed. Default is **false**.

### `options`: **object**

The currently used [`Options`](https://keen-slider.io/docs#options) and [`Event hooks`](https://keen-slider.io/docs#event-hooks) with regard to the active breakpoint.

### `prev`: **function**

Changes the currently active slide to the previous one when called. If exists.

### `size`: **number**

The size of the container/viewport, width or height, depending on the vertical option.

### `slides`: **HTMLElement[]**

The slides as an array of HTML elements.

### `track`: **object**

- `absToRel`: **function** - Transforms an absolute index into the corresponding relative index.
- `add`: **function** - Adds the passed value to the track position.
- `details`: **object | null** - The current details of the track. Position, length, sizes and distances are relative to the container/viewport size. Is set to **null** if the slider is disabled or not ready.

  - `abs`: **number** - Absolute index of the currently active slide.
  - `length`: **number** - Length of the track in relation to the size of the viewport.
  - `min`: **number** - minimum position according to the reachable slide
  - `max`: **number** - maximum position according to the reachable slide
  - `minIdx`: **number** - minimum index according to the reachable slide
  - `maxIdx`: **number** - maximum index according to the reachable slide
  - `position`: **number** - Current position of the track in relation to the size of the viewport.
  - `progress`: **number** - Relative position of track in relation to the length.
  - `rel`: **number** - Relative index of the currently active slide.
  - `slides`: **array** - Details of each slide as an array of **objects**. Each object has the following properties.
    - `abs`: **number** - Absolute index of this slide. Only reliable if portion is > 0
    - `distance`: **number** - Distance of the slide to the beginning of the viewport.
    - `portion`: **number** - Indicates how much of the slide is visible in the viewport.
    - `size`: **number** - Size of the slide in relation to the size of the viewport.
  - `slidesLength`: **number** - Length of the slides and the spacing between them.

- `distToIdx`: **function** - Transforms the passed distance into the corresponding index.
- `idxToDist`: **function** - Returns the distance to the passed index. The second argument is optional and a boolean that specifies whether the passed index is absolute. The third argument is optional and specifies a reference position.
- `init`: **function** - Reinitializes the track. Optionally, a new active index can be passed.
- `to`: **function** - Sets the passed value as the track position.
- `velocity`: **function** - Returns the current speed of the track as distance in relation to the viewport per millisecond.

### `update`: **function**

```typescript
slider.update(options, idx)
```

Updates the slider when it is called. If the resizing hasn't been triggered or the options need to be changed.

- `options`: **object** - Specifies the new options with which the slider should be reinitialized. Default **undefined**.

- `idx`: **number** - Sets the current active slide to the given index. Default **undefined**.

## Attributes

- `data-keen-slider-clickable` - Set this attribute to each element that should prevent touch/click events on the slider.
- `data-keen-slider-scrollable` - Set this attribute to each element that should be scrollable in the same direction as the slider (vertical or horizontal). `overflow`
  must be set to `scroll`.

## Plugins

To make it easier to integrate, structure, and version custom slider functions, you can create plugins. Keen-Slider itself is also partially based on plugins.

A plugin is basically a function that receives the slider instance as its only argument and is initiated during slider startup. With the `on` and `emit` function it can take part in the slider lifecycle.

Example:

```typescript
var slider = new KeenSlider(
  '#my-slider',
  {
    loop: true,
  },
  [
    slider => {
      slider.on('created', () => {
        alert('Hello World')
      })
    },
  ]
)
```

### Extend Drag Controls

If you want to extend the drag controls of the slider, you can emit the custom events `ksDragStart`, `ksDrag` and `ksDragEnd` with coordinates. You can find an example [here](https://keen-slider.io/examples#scroll-wheel-controls).
