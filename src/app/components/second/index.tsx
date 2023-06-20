"use client";
import React, { useEffect, useState, useRef } from "react";
import Matter, { Render } from "matter-js";
import styled from "@emotion/styled";
import { useCanvas } from "./useCanvas";

const STATIC_DENSITY = 25;
const PARTICLE_SIZE = 30;
const PARTICLE_BOUNCYNESS = 0.9;

const SecondComponent = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [trigger, setTrigger] = useState<boolean>(false);

  useCanvas({ boxRef, canvasRef, trigger });

  const handleClick = () => {
    setTrigger((val) => !val);
  };

  return (
    <Root>
      <SVG xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="particles-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 15 -4"
              result="goo"
            />
          </filter>
        </defs>
      </SVG>

      <SVG xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="static-filter">
            <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 15 -6"
              result="goo"
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </SVG>

      <FormWrapper>
        <Button onClick={() => handleClick()}>click</Button>
      </FormWrapper>

      <CanvasWrapperDiv ref={boxRef}>
        <canvas ref={canvasRef} />
      </CanvasWrapperDiv>
    </Root>
  );
};

const SVG = styled.svg`
  display: none;
`;

const Root = styled.div`
  position: relative;
  border: 1px solid white;
  padding: 8px;
  height: 100vh;
`;

const FormWrapper = styled.div``;

const Button = styled.button`
  cursor: pointer;
  display: block;
  text-align: center;
  margin-bottom: 16px;
  font-size: 2rem;
`;

const CanvasWrapperDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;

  filter: url("#particles-filter");
`;

export default SecondComponent;
