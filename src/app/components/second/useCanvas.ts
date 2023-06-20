import Matter from "matter-js";
import { useCallback, useEffect, useState } from "react";
import { Config } from "./config";

const STATIC_DENSITY = 25;
const PARTICLE_SIZE = 10;
const PARTICLE_BOUNCYNESS = 0.9;

interface useCanvasProps {
  boxRef: React.RefObject<HTMLDivElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  trigger: boolean;
}

interface RenderClass extends Matter.Render {
  engine: Matter.Engine;
}

export const useCanvas = ({ boxRef, canvasRef, trigger }: useCanvasProps) => {
  const [constraints, setConstraints] = useState<DOMRect>();
  const [scene, setScene] = useState<RenderClass>();

  const handleResize = useCallback(() => {
    if (boxRef.current !== null) {
      setConstraints(boxRef.current.getBoundingClientRect());
    }
  }, [boxRef]);

  useEffect(() => {
    if (boxRef.current === null || canvasRef.current === null) {
      return;
    }

    const { Engine, Render, World, Bodies } = Matter;

    const engine = Engine.create({});
    engine.gravity.y = 1;
    engine.gravity.x = 0.1;
    const render = Render.create({
      element: boxRef.current,
      engine,
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

    setConstraints(boxRef.current.getBoundingClientRect());
    setScene(render as RenderClass);

    window.addEventListener("resize", handleResize);
  }, [boxRef, canvasRef, handleResize]);

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
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    // Add a new "ball" everytime `someStateValue` changes
    if (scene && constraints) {
      let { width } = constraints;

      let bodies = [];

      let randomX = Math.floor((Math.random() * -width) / 2) + width / 2;
      for (let i = 0; i < Config.particleCount; i++) {
        const circle = Matter.Bodies.circle(
          randomX,
          -PARTICLE_SIZE,
          PARTICLE_SIZE,
          {
            restitution: PARTICLE_BOUNCYNESS,
          }
        );
        bodies.push(circle);
      }

      Matter.World.add(scene.engine.world, bodies);
    }
  }, [trigger]);
};
