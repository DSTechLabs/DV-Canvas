//=========================================================
//
//     FILE  : utils.js
//
//   PROJECT : Data Visualization Widget Support
//
//  FUNCTION : Utilities for test modules
//
//   AUTHOR  : Bill Daniels
//             Copyright 2026, D+S Tech Labs, Inc.
//             All Rights Reserved
//
//=========================================================

//--- Random integer, float, colors, etc. ---

export function randFloat    (min, max) { return (max-min) * Math.random() + min;                           }
export function randInt      (min, max) { return Math.round (randFloat (min, max));                         }
export function randBin      ()         { return (randInt(0, 1) == 0);                                      }
export function randAngle    ()         { return randFloat (0, 360);                                        }
export function randColorCSS ()         { return "#" + randInt (0, 16777216).toString(16).padStart(6, '0'); }
export function randColorNum ()         { return randInt (0, 16777216);                                     }
export function randGradient (ctx, x1, y1, x2, y2)
{
  const grad = ctx.createLinearGradient(x1, y1, x2, y2);
  grad.addColorStop(0.0, randColorCSS());
  grad.addColorStop(0.5, randColorCSS());
  grad.addColorStop(1.0, randColorCSS());
  return grad;
}
