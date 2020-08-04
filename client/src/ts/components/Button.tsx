import React, {MouseEvent} from "react";

interface ButtonProps {
    btnText: string
    handleClick: (e: MouseEvent<HTMLButtonElement>) => void
}

export default ({btnText, handleClick}: ButtonProps) => (
        <button onClick={handleClick}>{btnText}</button>
    )
