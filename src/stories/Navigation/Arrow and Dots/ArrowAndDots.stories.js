import React from "react";
import { useKeenSlider } from "../../../react";
import "../../../keen-slider.scss";
import "./style.css";

export default {
  title: 'Navigation',
  component: useKeenSlider,
}

const Template = (args)  => {
  const {rtl} = args;
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [sliderRef, slider] = useKeenSlider({
    initial: 0,
    slideChanged(s) {
      setCurrentSlide(s.details().relativeSlide);
    },
    rtl
  });
  
  return (
    <>
      <div className="navigation-wrapper">
        <div ref={sliderRef} className="keen-slider" dir={rtl ? 'rtl' : 'ltr'}>
          <div className="keen-slider__slide number-slide1">1</div>
          <div className="keen-slider__slide number-slide2">2</div>
          <div className="keen-slider__slide number-slide3">3</div>
          <div className="keen-slider__slide number-slide4">4</div>
          <div className="keen-slider__slide number-slide5">5</div>
          <div className="keen-slider__slide number-slide6">6</div>
        </div>
        {slider && (
          <>
            <ArrowLeft onClick={(e) => e.stopPropagation() || slider.prev()} disabled={(currentSlide === 0 && !rtl) || (currentSlide === slider.details().size - 1 && rtl)} />

            <ArrowRight
              onClick={(e) => e.stopPropagation() || slider.next()}
              disabled={(currentSlide === slider.details().size - 1 && !rtl) || (currentSlide === 0 && rtl)}
            />
          </>
        )}
      </div>
      {slider && (
        <div className="dots" dir={rtl ? 'rtl' : 'ltr'}>
          {[...Array(slider.details().size).keys()].map((idx) => {
            return (
              <button
                key={idx}
                onClick={() => {
                  slider.moveToSlideRelative(idx);
                }}
                className={"dot" + (currentSlide === idx ? " active" : "")}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

function ArrowLeft(props) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={"arrow arrow--left" + disabeld}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M16.67 0l2.83 2.829-9.339 9.175 9.339 9.167-2.83 2.829-12.17-11.996z" />
    </svg>
  );
}

function ArrowRight(props) {
  const disabeld = props.disabled ? " arrow--disabled" : "";
  return (
    <svg
      onClick={props.onClick}
      className={"arrow arrow--right" + disabeld}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
    >
      <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
    </svg>
  );
}

export const ArrowDot = Template.bind({});

ArrowDot.args = {
  rtl: true,
};
