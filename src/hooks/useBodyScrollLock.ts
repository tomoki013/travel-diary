"use client";

import { useEffect } from "react";

let lockCount = 0;
let previousOverflow = "";
let previousPaddingRight = "";

const lockBodyScroll = () => {
  const body = document.body;
  const scrollbarWidth =
    window.innerWidth - document.documentElement.clientWidth;

  if (lockCount === 0) {
    previousOverflow = body.style.overflow;
    previousPaddingRight = body.style.paddingRight;
    body.style.overflow = "hidden";

    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }
  }

  lockCount += 1;
};

const unlockBodyScroll = () => {
  if (lockCount === 0) {
    return;
  }

  lockCount -= 1;

  if (lockCount === 0) {
    const body = document.body;
    body.style.overflow = previousOverflow;
    body.style.paddingRight = previousPaddingRight;
  }
};

export const useBodyScrollLock = (locked: boolean) => {
  useEffect(() => {
    if (!locked) {
      return;
    }

    lockBodyScroll();

    return () => {
      unlockBodyScroll();
    };
  }, [locked]);
};
