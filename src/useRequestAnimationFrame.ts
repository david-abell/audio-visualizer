import { useRef, useLayoutEffect, useState } from "react";

const useRequestAnimationFrame = (callback: () => void) => {
  const [toggleAnimation, setToggleAnimation] = useState(false);
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);

  const animate = (now: number) => {
    // console.log("time", now);
    if (previousTimeRef.current) {
      callback();
    }
    previousTimeRef.current = now;
    requestRef.current = requestAnimationFrame(animate);
  };

  const handleToggleAnimation = () => {
    setToggleAnimation((prev) => !prev);
  };

  useLayoutEffect(() => {
    if (!callback || !toggleAnimation) return undefined;

    requestRef.current = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(requestRef.current as number);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [toggleAnimation]);

  return { handleToggleAnimation };
};

export default useRequestAnimationFrame;
