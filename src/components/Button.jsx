import React from "react";
import clsx from "clsx";
import "./Button.css"; // Create this file for the animations

const Button = ({ id, title, rightIcon, leftIcon, containerClass, onClick }) => {
  return (
    <button
      id={id}
      onClick={onClick}
      className={clsx(
        "glowing-button group relative z-10 cursor-pointer overflow-hidden rounded-3xl bg-[#edff66] px-10 py-3 text-black",
        "border-2 border-[#edff66] font-semibold uppercase tracking-wider",
        containerClass
      )}
    >
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      
      <span className="relative inline-flex overflow-hidden font-general text-xs uppercase">
        <div className="translate-y-0 skew-y-0 transition duration-500 group-hover:translate-y-[-160%] group-hover:skew-y-12">
          {title}
        </div>
        <div className="absolute translate-y-[164%] skew-y-12 transition duration-500 group-hover:translate-y-0 group-hover:skew-y-0">
          {title}
        </div>
      </span>
      
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

export default Button;
