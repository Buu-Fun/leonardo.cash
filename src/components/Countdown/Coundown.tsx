'use client';
import React, { useEffect } from 'react';
import styles from './Countdown.module.css';

function polarToCartesian(
  centerX: number,
  centerY: number,
  radius: number,
  angleInDegrees: number,
) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function describeArc(
  x: number,
  y: number,
  radius: number,
  startAngle: number,
  endAngle: number,
) {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);

  const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

  const d = [
    'M',
    start.x,
    start.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
  ].join(' ');

  return d;
}

function mapNumber(
  number: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number,
) {
  return (
    ((number - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  );
}

const SVGCircle = ({ radius }: { radius: number }) => (
  <svg className={styles.svg}>
    <path
      fill="none"
      stroke="#fff"
      strokeWidth="4"
      d={describeArc(100, 100, 70, 0, radius)}
    />
  </svg>
);

interface Props {
  date: Date;
}

export const Countdown = ({ date }: Props) => {
  //   const { days, hours, minutes, seconds } = this.state;

  const [state, setState] = React.useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = date.getTime() - now;
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setState({ days, hours, minutes, seconds });
    }, 1000);
    return () => clearInterval(interval);
  }, [date]);

  // Mapping the date values to radius values
  const daysRadius = mapNumber(state.days, 30, 0, 0, 360);
  const hoursRadius = mapNumber(state.hours, 24, 0, 0, 360);
  const minutesRadius = mapNumber(state.minutes, 60, 0, 0, 360);
  const secondsRadius = mapNumber(state.seconds, 60, 0, 0, 360);

  if (
    state.days === 0 &&
    state.hours === 0 &&
    state.minutes === 0 &&
    state.seconds === 0
  ) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.item}>
        <SVGCircle radius={daysRadius} />
        {state.days}
        <span className={styles.itemText}>days</span>
      </div>

      <div className={styles.item}>
        <SVGCircle radius={hoursRadius} />
        {state.hours}
        <span className={styles.itemText}>hours</span>
      </div>

      <div className={styles.item}>
        <SVGCircle radius={minutesRadius} />
        {state.minutes}
        <span className={styles.itemText}>minutes</span>
      </div>

      <div className={styles.item}>
        <SVGCircle radius={secondsRadius} />
        {state.seconds}
        <span className={styles.itemText}>seconds</span>
      </div>
    </div>
  );
};
