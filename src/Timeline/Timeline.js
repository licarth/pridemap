import React, { useMemo, useState } from "react";
import { EffectCoverflow } from "swiper";
import "swiper/css";
// Import Swiper styles
import "swiper/css/bundle";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";
import { usePrideSelect } from "../currentWeekNumberContext";
import { formatWeekend } from "../formatWeekend";
import "./styles.css";
import _ from "lodash";
import styled from "styled-components";

export const Timeline = ({ pridesPerWeekendNumber }) => {
  const {
    weekendNumber,
    setWeekendNumber,
    minWeekendNumber,
    maxWeekendNumber,
  } = usePrideSelect();
  console.log("init timeline" + weekendNumber);
  const [swiper, setSwiper] = useState();

  const array = _.range(minWeekendNumber, maxWeekendNumber + 1).map(Number);

  useMemo(() => {
    const slildeNumber = array.findIndex((n) => n === weekendNumber);
    console.log(`going to slide ${slildeNumber}`);
    swiper && slildeNumber !== -1 && swiper.slideTo(slildeNumber);
  }, [array, weekendNumber]);

  return (
    <>
      {pridesPerWeekendNumber && (
        <>
          <FadeDiv />
          <Swiper
            onSlideChange={(swiper) => {
              console.log("slide change");
              return setWeekendNumber(array[swiper.realIndex]);
            }}
            onSliderMove={(swiper, e) => {
              console.log("slide move: " + e.target);
            }}
            coverflowEffect={{
              rotate: 0,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            effect="coverflow"
            grabCursor={true}
            onSwiper={setSwiper}
            slidesPerView={3}
            spaceBetween={30}
            modules={[EffectCoverflow]}
            slideToClickedSlide
            pagination={{
              clickable: true,
            }}
            centeredSlides={true}
            className="mySwiper"
          >
            {array.map((weekendNumber) => (
              <SwiperSlide key={weekendNumber}>
                {formatWeekend(weekendNumber)}
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </>
  );
};

const FadeDiv = styled.div`
  position: absolute;
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 1) 0%,
    rgba(0, 0, 0, 0) 10%,
    rgba(0, 0, 0, 0) 50%,
    rgba(0, 0, 0, 0) 90%,
    rgba(0, 0, 0, 1) 100%
  );
  width: 100%;
  height: 100%;
  z-index: 100;
  pointer-events: none;
`;
