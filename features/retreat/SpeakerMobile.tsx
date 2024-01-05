import React, { useRef, useState } from "react";
import Slider from "react-slick";
import {
  Box,
  Text,
  Image,
  Flex,
  Button,
  useStyleConfig,
  Heading
} from "@chakra-ui/react";
import { SpeakerData } from "./";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
export const SpeakerMobile = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slider = useRef<any>(null);
  const next = () => {
    slider.current.slickNext();
  };
  const previous = () => {
    slider.current.slickPrev();
  };

  const settings = {
    dots: true,
    infinite: true,
    rows: 1,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 5000,
    speed: 500,
    cssEase: "linear",
    arrows: true,
    beforeChange: (next: any) => {
      setCurrentSlide(next);
    },
    appendDots: (dots: any) => (
      <div
        style={{
          borderRadius: "10px",
          padding: "30px",
        //   marginTop: "30px",
        }}
      >
        <ul style={{ margin: "0px" }}> {dots} </ul>
      </div>
    ),
    customPaging: (i: any) => (
      <div
        style={
          {}
        }
        key={i}
      />
    ),
  };

  return (
    <Box pos="relative" overflow="hidden" pb="8rem" pl="1rem">
      <Slider ref={slider} {...settings}>
        {SpeakerData.map((item, index) => (
          <Box key={index} position="relative" mb="2.4312rem">
            <Box width="full" height={"20.625rem"} pos="relative">
              <Image
                w="100%"
                h="100%"
                objectPosition="top center"
                objectFit="cover"
                src={item.image}
                alt={item.name}
              />
            </Box>
            <Box
              pos="relative"
              py="2.5625rem"
            //   pl="1.1875rem"
            >
              <Text
                mb="2.5625rem"
                fontSize="1.125rem"
                fontWeight="400"
                lineHeight="1.9125rem"
              >
                {item.description}
              </Text>

              <Box>
                <Text
                  fontWeight="500"
                  fontSize="1.125rem"
                  lineHeight="170%"
                  mb=".6875rem"
                >
                  {item.name}
                </Text>
              </Box>

              <Box backgroundColor={"#060022"} padding="20px 
              36px" rounded="1.6875rem" display="inline-flex" flexDir="column" mt="45px" >
                <Text color="#FFF">
                    Topic:
                </Text>
                <Heading color="#FFF" fontSize="40px" fontWeight="900" >
                    {
                        item.topic
                    }
                </Heading>
            </Box>
            </Box>
          </Box>
        ))}
      </Slider>
      <Box display="flex">
        <Box 
        position="absolute"
        bottom="14%"
        >
          <Text color="#060022" fontSize="30px" fontWeight={400}>
            <BsArrowLeftCircle onClick={previous} />
          </Text>
        </Box>
        <Box
         position="absolute"
         bottom="14%"
         right="0"
        >
          <Text color="#060022" fontSize="30px" >
            <BsArrowRightCircle onClick={next} />
          </Text>
        </Box>
      </Box>
    </Box>
  );
};
