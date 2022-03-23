import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EffectCoverflow, FreeMode } from "swiper";
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

export const Timeline = ({ pridesPerWeekendNumber }) => {
  const { mode, allWeekendNumbers, weekendNumber, selectWeekend } =
    usePrideSelect();
  const [swiper, setSwiper] = useState();

  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    if (swiper && !previewMode) {
      if (!weekendNumber || mode !== "weekend") {
        swiper.slideTo(0);
      }
      const slildeNumber = allWeekendNumbers.findIndex(
        (n) => n === weekendNumber
      );
      slildeNumber !== -1 && swiper.slideTo(slildeNumber + 1);
    }
  }, [swiper, allWeekendNumbers, weekendNumber, previewMode, mode]);

  return (
    <>
      {pridesPerWeekendNumber && (
        <>
          <FadeDiv />
          <Swiper
            onSlideChange={(swiper) => {
              selectWeekend(allWeekendNumbers[swiper.realIndex - 1]);
            }}
            onTransitionEnd={(swiper) => {
              console.log("Animation end");
              setPreviewMode(false);
            }}
            onTouchStart={(swiper) => {
              setPreviewMode(true);
            }}
            freeMode
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
            spaceBetween={0}
            modules={[FreeMode, EffectCoverflow]}
            slideToClickedSlide
            pagination={{
              clickable: true,
            }}
            centeredSlides={true}
            className="mySwiper"
          >
            <SwiperSlide key={"slide-intro"}>
              <SwipeBox>
                <div>Swipe</div>
                <div>▶︎</div>
              </SwipeBox>
            </SwiperSlide>
            {allWeekendNumbers.map((weekendNumber) => (
              <SwiperSlide
                key={weekendNumber}
                hidden={!pridesPerWeekendNumber[weekendNumber]}
              >
                <DateBox hasPrides={!!pridesPerWeekendNumber[weekendNumber]}>
                  {formatWeekend(weekendNumber)}
                </DateBox>
              </SwiperSlide>
            ))}
          </Swiper>
        </>
      )}
    </>
  );
};

const SwipeBox = styled.div`
  border: solid 1px white;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 80%;
  height: 100%;
`;
const DateBox = styled.div`
  border: ${({ hasPrides }) =>
    hasPrides ? "solid 1px white" : "dashed 1px black"};
  border-radius: 5px;
  color: ${({ hasPrides }) => (hasPrides ? "white" : "grey")};
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: ${({ hasPrides }) => (hasPrides ? "none" : "line-through")};
  width: 80%;
  height: 100%;
`;

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
  z-index: 100;
  pointer-events: none;
`;
