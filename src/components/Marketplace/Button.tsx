'use client';

import React, { FC } from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'quinary' | 'danger';

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  /** compat con tu API vieja */
  isDisabled?: boolean;
  /** opcional: compat con uso viejo si algún lado usaba text */
  text?: string;
  selected?: boolean;
};

const Button: FC<ButtonProps> = ({
  children,
  text,
  variant = 'primary',
  onClick,
  isDisabled,
  disabled,
  type = 'button',
  className,
  selected = false,
  ...rest
}) => {
  const finalDisabled = Boolean(disabled ?? isDisabled);

  const baseClasses = `px-4 py-2 md:px-6 md:py-3 rounded-full shadow text-[14px] md:text-[16px] font-neueMontreal font-medium transition duration-300 ${
    finalDisabled ? 'cursor-not-allowed opacity-60' : ''
  } relative group`;

  const variants: Record<Variant, string> = {
    primary: 'bg-white text-black hover:bg-gray-200',
    secondary: 'bg-transparent border border-white text-white hover:bg-gray-200 hover:bg-opacity-5',
    danger: 'bg-red-600 text-white hover:bg-red-700',
    tertiary: 'bg-gray-200 text-black hover:bg-gray-300',
    quaternary: 'bg-forestGreen text-white hover:bg-forestGreen/80',
    quinary: 'bg-customGreen text-forestGreen hover:bg-mintGreen/80',
  };

  const selectedClasses = 'bg-customGreen text-black hover:bg-customGreen/80';

  const finalClasses = selected
    ? `${baseClasses} ${selectedClasses} ${className || ''}`
    : `${baseClasses} ${variants[variant]} ${className || ''}`;

  return (
    <div className="relative group">
      <button
        type={type}
        disabled={finalDisabled}
        className={finalClasses}
        onClick={onClick}
        {...rest}
      >
        {children ?? text}
      </button>
    </div>
  );
};

export default Button;

// import { FC } from "react";

// type ButtonProps = {
//   children: React.ReactNode;
//   variant:
//     | "primary"
//     | "secondary"
//     | "tertiary"
//     | "quaternary"
//     | "quinary"
//     | "danger";
//   onClick?: () => void;
//   isDisabled?: boolean;
//   type?: "button" | "submit" | "reset";
//   className?: string;
//   selected?: boolean;
// };

// const Button: FC<ButtonProps> = ({
//   children,
//   variant,
//   onClick,
//   isDisabled,
//   type,
//   className,
//   selected = false,
// }) => {
//   const baseClasses = `px-4 py-2 md:px-6 md:py-3 rounded-full shadow text-[14px] md:text-[16px] font-neueMontreal font-medium transition duration-300 ${
//     isDisabled ? "cursor-not-allowed" : ""
//   } relative group`;

//   const variants = {
//     primary: "bg-white text-black hover:bg-gray-200",
//     secondary:
//       "bg-transparent border border-white text-white hover:bg-gray-200 hover:bg-opacity-5",
//     danger: "bg-red-600 text-white hover:bg-red-700",
//     tertiary: "bg-gray-200 text-black hover:bg-gray-300",
//     quaternary: "bg-forestGreen text-white hover:bg-forestGreen/80 ",
//     quinary: "bg-customGreen text-forestGreen hover:bg-mintGreen/80",
//   };

//   const selectedClasses = "bg-customGreen text-black hover:bg-customGreen/80";

//   const finalClasses = selected
//     ? `${baseClasses} ${selectedClasses} ${className || ""}`
//     : `${baseClasses} ${variants[variant]} ${className || ""}`;

//   return (
//     <div className="relative group">
//       <button
//         disabled={isDisabled}
//         className={finalClasses}
//         onClick={onClick}
//         type={type}
//       >
//         {children}
//       </button>
//     </div>
//   );
// };

// export default Button;
