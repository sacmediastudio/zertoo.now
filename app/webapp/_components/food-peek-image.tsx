"use client";

import { useEffect, useState } from "react";

// Las 4 fotos que se asoman por abajo del header, de una en una.
const IMAGES = ["/nav/pizza.jpg", "/nav/burger.jpg", "/nav/fish.jpg", "/nav/pasta.jpg"];
const SIZE = 104; // diámetro del círculo completo
const PEEK_VISIBLE = 66; // cuánto se ve (el resto queda "bajo tierra")
const HOLD_MS = 3500;
const RISE_MS = 450;

export default function FoodPeekImage() {
  const [index, setIndex] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    function cycle() {
      timeout = setTimeout(() => {
        setHidden(true);
        timeout = setTimeout(() => {
          // El cambio de foto pasa mientras está escondida, así nunca se ve el salto.
          setIndex((i) => (i + 1) % IMAGES.length);
          setHidden(false);
          timeout = setTimeout(cycle, RISE_MS);
        }, RISE_MS);
      }, HOLD_MS);
    }
    cycle();
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div
      className="ml-2.5 shrink-0 overflow-hidden"
      style={{ width: SIZE, height: PEEK_VISIBLE, borderTopLeftRadius: SIZE / 2, borderTopRightRadius: SIZE / 2 }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={IMAGES[index]}
        alt=""
        draggable={false}
        className="rounded-full object-cover"
        style={{
          width: SIZE,
          height: SIZE,
          opacity: hidden ? 0 : 1,
          transform: `translateY(${hidden ? PEEK_VISIBLE : 0}px)`,
          transition: `transform ${RISE_MS}ms cubic-bezier(0.215,0.61,0.355,1), opacity ${RISE_MS}ms cubic-bezier(0.215,0.61,0.355,1)`,
        }}
      />
    </div>
  );
}
