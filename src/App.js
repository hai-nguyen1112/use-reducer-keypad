import React, { useState, useCallback, useReducer, useEffect, useRef } from 'react'
import './App.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLock } from '@fortawesome/free-solid-svg-icons'
import { faLockOpen } from '@fortawesome/free-solid-svg-icons'

function App() {
    const [locked, setLocked] = useState(true)
    const [password, setPassword] = useState(generatePassword())
    const buttonOneRef = useRef()
    const buttonTwoRef = useRef()
    const buttonThreeRef = useRef()
    const buttonFourRef = useRef()
    const buttonFiveRef = useRef()
    const buttonSixRef = useRef()
    const resetButtonRef = useRef()
    const promptRef = useRef()
    const [sequence, dispatch] = useReducer((state, action) => {
        switch (action.type) {
            case "pressed":
                return [...state, action.number]
            case "reset":
                return []
            default:
                return state
        }
    }, [])

    const handleClickKeyPad = useCallback(number => {
        dispatch({type: "pressed", number: number})
    }, [])

    useEffect(() => {
        let handleWrongPassword
        let congrats
        promptingPressedNumber(sequence[sequence.length - 1], promptRef)
        if (sequence[sequence.length - 1] === password[sequence.length - 1]) {
            if (sequence.length === 6) {
                promptRef.current.innerText = sequence.join("")
                disableKeypad(buttonOneRef, buttonTwoRef, buttonThreeRef, buttonFourRef, buttonFiveRef, buttonSixRef)
                congrats = setTimeout(() => {
                    setLocked(false)
                    promptRef.current.innerText = "Good Job!"
                }, 1000)
            }
        } else {
            disableKeypad(buttonOneRef, buttonTwoRef, buttonThreeRef, buttonFourRef, buttonFiveRef, buttonSixRef)
            promptRef.current.innerText = "Wrong Password!"
            handleWrongPassword = setTimeout(() => {
                dispatch({type: "reset"})
                promptRef.current.innerText = ""
                enableKeypad(buttonOneRef, buttonTwoRef, buttonThreeRef, buttonFourRef, buttonFiveRef, buttonSixRef)
            }, 2000)
        }
        return () => clearTimeout(handleWrongPassword, congrats)
    }, [sequence, password])

    useEffect(() => {
        if (locked) {
            resetButtonRef.current.setAttribute("disabled", "true")
        } else {
            resetButtonRef.current.removeAttribute("disabled")
        }
    }, [locked])

    const handleReset = useCallback(() => {
        setLocked(true)
        promptRef.current.innerText = ""
        enableKeypad(buttonOneRef, buttonTwoRef, buttonThreeRef, buttonFourRef, buttonFiveRef, buttonSixRef)
        dispatch({type: "reset"})
        setPassword(generatePassword())
    }, [])

    return (
        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
            <p>
                {
                    locked
                        ?
                        <FontAwesomeIcon icon={faLock} style={{color: "red", fontSize: "50px"}}/>
                        :
                        <FontAwesomeIcon icon={faLockOpen} style={{color: "red", fontSize: "50px"}}/>
                }
            </p>
            <div style={{textAlign: "center"}}>Press the keypad in the sequence of {password} to unlock!</div>
            <br/>
            <div style={{border: "solid 2px", borderRadius: "5px", height: "40px", width: "160px", display: "flex", justifyContent: "center", alignItems: "center"}}>
                <h3 ref={promptRef}>{""}</h3>
            </div>
            <p>
                <button ref={buttonOneRef} onClick={() => handleClickKeyPad(1)}>1</button>
                &nbsp; &nbsp;
                <button ref={buttonTwoRef} onClick={() => handleClickKeyPad(2)}>2</button>
                &nbsp; &nbsp;
                <button ref={buttonThreeRef} onClick={() => handleClickKeyPad(3)}>3</button>
                &nbsp; &nbsp;
                <button ref={buttonFourRef} onClick={() => handleClickKeyPad(4)}>4</button>
                &nbsp; &nbsp;
                <button ref={buttonFiveRef} onClick={() => handleClickKeyPad(5)}>5</button>
                &nbsp; &nbsp;
                <button ref={buttonSixRef} onClick={() => handleClickKeyPad(6)}>6</button>
            </p>
            <button ref={resetButtonRef} onClick={handleReset}>Reset</button>
        </div>
    )
}

export default App

// helper functions
const generatePassword = () => [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
]

const promptingPressedNumber = (pressedNumber, promptRef) => {
    if (pressedNumber === 1) promptRef.current.innerText += '1'
    if (pressedNumber === 2) promptRef.current.innerText += '2'
    if (pressedNumber === 3) promptRef.current.innerText += '3'
    if (pressedNumber === 4) promptRef.current.innerText += '4'
    if (pressedNumber === 5) promptRef.current.innerText += '5'
    if (pressedNumber === 6) promptRef.current.innerText += '6'
}

const disableKeypad = (buttonOneRef, buttonTwoRef, buttonThreeRef, buttonFourRef, buttonFiveRef, buttonSixRef) => {
    buttonOneRef.current.setAttribute("disabled", true)
    buttonTwoRef.current.setAttribute("disabled", true)
    buttonThreeRef.current.setAttribute("disabled", true)
    buttonFourRef.current.setAttribute("disabled", true)
    buttonFiveRef.current.setAttribute("disabled", true)
    buttonSixRef.current.setAttribute("disabled", true)
}

const enableKeypad = (buttonOneRef, buttonTwoRef, buttonThreeRef, buttonFourRef, buttonFiveRef, buttonSixRef) => {
    buttonOneRef.current.removeAttribute("disabled")
    buttonTwoRef.current.removeAttribute("disabled")
    buttonThreeRef.current.removeAttribute("disabled")
    buttonFourRef.current.removeAttribute("disabled")
    buttonFiveRef.current.removeAttribute("disabled")
    buttonSixRef.current.removeAttribute("disabled")
}