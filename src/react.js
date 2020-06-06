import KeenSlider from './keen-slider'
import { useEffect, useRef, useState } from 'react'

export default KeenSlider

export function useKeenSlider(options = {}) {
  const ref = useRef()
  const [slider, setSlider] = useState(null)
  useDeepEffect(() => {
    setSlider(new KeenSlider(ref.current, options))
    return () => {
      slider.destroy()
    }
  }, [options])
  return [ref, slider]
}

function useDeepEffect(fn, deps) {
  const isFirst = useRef(true)
  const prevDeps = useRef(deps)

  useEffect(() => {
    const isSame = prevDeps.current.every((obj, index) =>
      isEqual(obj, deps[index])
    )

    if (isFirst.current || !isSame) {
      fn()
    }

    isFirst.current = false
    prevDeps.current = deps
  }, deps)
}

/*!
 * Check if two objects or arrays are equal
 * (c) 2017 Chris Ferdinandi, MIT License, https://gomakethings.com
 * @param  {Object|Array}  value  The first object or array to compare
 * @param  {Object|Array}  other  The second object or array to compare
 * @return {Boolean}              Returns true if they're equal
 */
var isEqual = function (value, other) {
  // Get the value type
  var type = Object.prototype.toString.call(value)

  // If the two objects are not the same type, return false
  if (type !== Object.prototype.toString.call(other)) return false

  // If items are not an object or array, return false
  if (['[object Array]', '[object Object]'].indexOf(type) < 0) return false

  // Compare the length of the length of the two items
  var valueLen =
    type === '[object Array]' ? value.length : Object.keys(value).length
  var otherLen =
    type === '[object Array]' ? other.length : Object.keys(other).length
  if (valueLen !== otherLen) return false

  // Compare two items
  var compare = function (item1, item2) {
    // Get the object type
    var itemType = Object.prototype.toString.call(item1)

    // If an object or array, compare recursively
    if (['[object Array]', '[object Object]'].indexOf(itemType) >= 0) {
      if (!isEqual(item1, item2)) return false
    }

    // Otherwise, do a simple comparison
    else {
      // If the two items are not the same type, return false
      if (itemType !== Object.prototype.toString.call(item2)) return false

      // Else if it's a function, convert to a string and compare
      // Otherwise, just compare
      if (itemType === '[object Function]') {
        if (item1.toString() !== item2.toString()) return false
      } else {
        if (item1 !== item2) return false
      }
    }
  }

  // Compare properties
  if (type === '[object Array]') {
    for (var i = 0; i < valueLen; i++) {
      if (compare(value[i], other[i]) === false) return false
    }
  } else {
    for (var key in value) {
      if (value.hasOwnProperty(key)) {
        if (compare(value[key], other[key]) === false) return false
      }
    }
  }

  // If nothing failed, return true
  return true
}
