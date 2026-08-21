"use client";

import { PasswordInput } from "./PasswordInput";
import { zxcvbn } from "@/lib/types";
import * as React from "react";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

const PasswordInputWithStrength = React.forwardRef<
  HTMLInputElement,
  InputProps
>(({ ...props }, ref) => {
  const [score, setScore] = React.useState(0);

  const previousChange = props.onChange;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (previousChange) {
      const zxcvbnResult = zxcvbn.check(e.target.value);
      setScore(zxcvbnResult.score);
      previousChange(e);
    }
  };

  props.onChange = onChange;

  function color(strength: number, index: number, length: number): string {
    if (!length) return "bg-gray-200";
    if (strength < index) return "bg-gray-200";
    return [
      "bg-red-500",
      "bg-orange-500",
      "bg-amber-500",
      "bg-yellow-400",
      "bg-green-400",
    ][strength];
  }

  return (
    <div>
      <PasswordInput {...props} ref={ref} />
      <div className="mt-4 grid grid-flow-col justify-stretch gap-4 px-1">
        {[...Array(5)].map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-xl px-1 transition-colors ${color(score, index, props.value?.toString()?.length || 0)}`}
          />
        ))}
      </div>
    </div>
  );
});
PasswordInputWithStrength.displayName = "PasswordInputWithStrength";

export { PasswordInputWithStrength };
