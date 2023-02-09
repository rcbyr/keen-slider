# Documentation React Native

Complete documentation of the installation and usage of Keen-Slider for React Native. For the documentation of the **web version** click [here](https://keen-slider.io/docs).

## Getting started

The usage of this library is really simple and is explained in many [code examples](https://keen-slider.io/examples). You can add it to any JavaScript or Typescript project you are working on in several way.

### Installation

Install keen-slider from npm.

```
npm install keen-slider
```

### Usage

The library comes with a hook for react-native. Like any react hook, `useKeenSliderNative` has to be called at the top level of your component. Optionally, you can pass [`Options`](https://keen-slider.io/docs/react-native#options) and [`Event hooks`](https://keen-slider.io/docs/react-native#event-hooks) as first argument. [`Plugins`](https://keen-slider.io/docs/react-native#plugins) can be passed as second argument. The hook returns the [`slider instance`](https://keen-slider.io/docs/react-native#properties).

```javascript
import { useKeenSliderNative } from 'keen-slider/react-native'

export default () => {
  const slides = 4
  const slider = useKeenSliderNative({
    slides,
  })

  return (
    <View {...slider.containerProps}>
      {[...Array(slides).keys()].map(idx => {
        return (
          <View key={idx} {...slider.slidesProps[idx]}>
            <Text>Slide {idx}</Text>
          </View>
        )
      })}
    </View>
  )
}
```

## Options

To customize keen-slider to your needs there are a lot of options which are listed below. Also, the [`Event hooks`](https://keen-slider.io/docs/react-native#event-hooks) are part of these options. If you want to change the options after initialization, you can do that with the update function. See [`Properties`](https://keen-slider.io/docs/react-native#properties).

### `defaultAnimation`: **object**

Sets the default animation of the functions `moveToIdx`, `next` and `prev`.

- `duration`: **number** - Duration of the animation in milliseconds.
- `easing`: **function** - Easing of the animation as (`time`: **number**) => **number**.

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

### `rtl`: **boolean**

Changes the direction in which the slides are positioned, from left-to-right to right-to-left. Default is **false**.

### `rubberband`: **boolean**

Enables or disables the rubberband behavior for dragging and animation after a drag. Default is **true**.

### `slides`: **object | number | function**

Specifies the configuration of the slides. Every time there is an update, resize or change of options, the slide configuration is renewed. Therefore, all functions are called again. Default is **null**.

- **number** - Sets the number of slides to the specified number.

- **object** - Specifies the slides configuration with an object of optional properties.

  - `origin`: **'auto' | 'center' | number** - Sets the origin of the slides. **'auto'** - Adjusts the origins of all slides, so that the first slide aligns left and the last one right. **'center'** - Centers the slides. **number** - Relative to the viewport. Default is **'auto'**.
  - `number`: **number | function | null** - Behaves analog to `slides` if the value is a **number** or **null**. Can be a function as well, that returns a **number** or **null**. Default is **null**.
  - `perView`: **number | function** - Determines what size the slides should be in relation to the viewport/container. Can be a function as well, that returns **number**. Default is **1**.
  - `spacing`: **number | function** - Defines the spacing between slides in pixel. Can be a function that returns a number. Default is **0**.

- **function** - Specifies the slides configuration with a function that returns an array of slide configurations. A slide configuration has the following optional properties:

  - `origin`: **number** - Determines where the origin of a slide is within the viewport. Default is **0**.
  - `size`: **number** - Determines the relativ size of the slide in relation to the viewport. Default is **1**.
  - `spacing`: **number** - Defines the space to the next slide in relation to the viewport. Default is **0**.

  The function receives as first argument the container size.

### `vertical`: **boolean**

Changes the direction of the slider from horizontal to vertical. Default is **false**.

## Event Hooks

Event hooks are functions that the slider calls during its lifecycle. The functions getting the [`Properties`](https://keen-slider.io/docs/react-native#properties) as the only argument. Event hooks are part of the [`Options`](https://keen-slider.io/docs/react-native#options) and can be specified in the same way.

Below are the event hooks and when they are triggered:

`animationStarted` - Animation was started. An animation takes place after the drag has ended or when calling `moveToIdx()` or `animator.start()`.

`animationStopped` - Animation was stopped.

`animationEnded` - Animation has ended.

`created` - Slider was created.

`layoutChanged` - onLayout was called on the container.

`detailsChanged` - The `details`-property has changed. At each movement, after an option change, and at each initialization or resizing.

`dragged` - Slider was dragged.

`dragStarted` - Drag has started.

`dragChecked` - Direction of dragging was checked and is valid.

`dragEnded` - Drag has ended.

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

### `containerProps`: **object**

Contains properties that has to be bound to the container.

- `onLayout`: **function** - Response to changes in the size of the container. Sets `size`-property.
- `onPanResponderMove`: **function** - Handles touch movements.
- `onPanResponderRelease`: **function** - Handles touch ends.
- `onPanResponderTerminate`: **function** - Handles touch terminations.
- `onStartShouldSetPanResponder`: **function** - Handles touch starts.

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

The currently used [`Options`](https://keen-slider.io/docs/react-native#options) and [`Event hooks`](https://keen-slider.io/docs/react-native#event-hooks) with regard to the active breakpoint.

### `prev`: **function**

Changes the currently active slide to the previous one when called. If exists.

### `size`: **number**

The size of the container/viewport, width or height, depending on the verical option.

### `slidesProps`: **object[]**

Contains properties that has to be bound to the slides.

- `ref`: **object** - MutableRefObject that refers to a slide. Updates to the position are made directly to this reference.

- `styles`: **object** - Contains the position and size styles for a specific slide.

### `track`: **object**

- `absToRel`: **function** - Transforms an absolute index into the corresponding relative index.
- `add`: **function** - Adds the passed value to the track position.
- `details`: **object | null** - The current details of the track. Position, length, sizes and distances are relative to the container/viewport size. Is set to **null** if the slider is disabled or not ready.

  - `abs`: **number** - Absolute index of the currently active slide.
  - `length`: **number** - Length of the track in relation to the size of the viewport.
  - `min`: **number** - minimum position according to range or loop
  - `max`: **number** - maximum position according to range or loop
  - `minIdx`: **number** - minimum index according to range or loop
  - `maxIdx`: **number** - maximum position according to range or loop
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

## Plugins

To make it easier to integrate, structure, and version custom slider functions, you can create plugins. Keen-Slider itself is also partially based on plugins.

A plugin is basically a function that receives the slider instance as its only argument and is initiated during slider startup. With the `on` and `emit` function it can take part in the slider lifecycle.

Example:

```typescript
const slider = useKeenSliderNative(
  {
    slides: 4,
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
