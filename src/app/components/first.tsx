"use client";
import React, { useEffect, useState, useRef } from "react";
import Matter, { Render } from "matter-js";
import styled from "@emotion/styled";

const STATIC_DENSITY = 25;
const PARTICLE_SIZE = 30;
const PARTICLE_BOUNCYNESS = 0.9;

interface RenderClass extends Render {
  engine: Matter.Engine;
}

const FirstComponent = () => {
  const boxRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef(null);

  const [constraints, setContraints] = useState<DOMRect>();
  const [scene, setScene] = useState<RenderClass>();

  const [someStateValue, setSomeStateValue] = useState(false);

  const handleResize = () => {
    if (boxRef.current !== null) {
      setContraints(boxRef.current.getBoundingClientRect());
    }
  };

  const handleClick = () => {
    setSomeStateValue(!someStateValue);
  };

  useEffect(() => {
    if (boxRef.current === null || canvasRef.current === null) {
      return;
    }

    let Engine = Matter.Engine;
    let Render = Matter.Render;
    let World = Matter.World;
    let Bodies = Matter.Bodies;

    let engine = Engine.create({});

    let render = Render.create({
      element: boxRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        background: "transparent",
        wireframes: false,
      },
    });

    const floor = Bodies.rectangle(0, 0, 0, STATIC_DENSITY, {
      isStatic: true,
      render: {
        fillStyle: "blue",
      },
    });

    World.add(engine.world, [floor]);

    Engine.run(engine);
    Render.run(render);

    setContraints(boxRef.current.getBoundingClientRect());
    setScene(render as RenderClass);

    window.addEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    if (constraints && scene) {
      let { width, height } = constraints;

      // Dynamically update canvas and bounds
      scene.bounds.max.x = width;
      scene.bounds.max.y = height;
      scene.options.width = width;
      scene.options.height = height;
      scene.canvas.width = width;
      scene.canvas.height = height;

      // Dynamically update floor
      const floor = scene.engine.world.bodies[0];

      Matter.Body.setPosition(floor, {
        x: width / 2,
        y: height + STATIC_DENSITY / 2,
      });

      Matter.Body.setVertices(floor, [
        { x: 0, y: height },
        { x: width, y: height },
        { x: width, y: height + STATIC_DENSITY },
        { x: 0, y: height + STATIC_DENSITY },
      ]);
    }
  }, [scene, constraints]);

  useEffect(() => {
    // Add a new "ball" everytime `someStateValue` changes
    if (scene && constraints) {
      let { width } = constraints;
      let randomX = Math.floor(Math.random() * -width) + width;
      Matter.World.add(
        scene.engine.world,
        Matter.Bodies.circle(randomX, -PARTICLE_SIZE, PARTICLE_SIZE, {
          restitution: PARTICLE_BOUNCYNESS,
        })
      );
    }
  }, [someStateValue]);

  return (
    <Root>
      <FormWrapper>
        <Button onClick={() => handleClick()}>click</Button>
      </FormWrapper>

      <CanvasWrapperDiv ref={boxRef}>
        <canvas ref={canvasRef} />
      </CanvasWrapperDiv>
    </Root>
  );
};

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
`;

export default FirstComponent;
