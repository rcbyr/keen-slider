import KeenSlider from './keen-slider'
import * as React from 'react'

function useKeenSlider(options = {}) {
  const ref = React.useRef()
  const [slider, setSlider] = React.useState(null)

  React.useEffect(() => {
    setSlider(new KeenSlider(ref.current, options))
    return () => {
      if (slider) slider.destroy()
    }
  }, [])
  return [ref, slider]
}

export { useKeenSlider }
