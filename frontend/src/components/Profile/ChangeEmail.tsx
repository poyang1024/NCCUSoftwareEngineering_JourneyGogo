import React, { useState } from 'react'
import CustomActionBtn from '../UI/CustomActionBtn'
import CustomTextField from '../UI/CustomTextField'
import { useSnackBar } from '../../contexts/snackbar'
import ProfileRouteProps from '../../interface/ProfileRouteProps'

const ChangeEmail = ({ routeHandler }: ProfileRouteProps) => {
    const [email, setEmail] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true);

    const { showSnackBar } = useSnackBar()

    const validateEmail = (email: string): boolean => {
        // Regular expression pattern for email validation
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredEmail = e.target.value;
        setEmail(enteredEmail);
        setIsValidEmail(validateEmail(enteredEmail));
    };

    const submitHandler = (): void => {
        const isCorrect = true // api call 
        if (isCorrect) {
            routeHandler("/")
            showSnackBar('Email change success.', 'success')
        }
        else {
            showSnackBar('Email change failed.', 'error')
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <p style={{ fontSize: "20px", fontWeight: 500, margin: 0 }}>更改電子信箱</p>
            <CustomTextField
                id="outlined-basic"
                label={email ? "" : "請輸入電子信箱"}
                value={email}
                onChange={handleEmailChange}
                error={!isValidEmail && email !== ""}
                helperText={!isValidEmail && email !== "" ? "請輸入有效的電子信箱" : ""}
            />
            <CustomActionBtn
                onClick={submitHandler}
                disabled={!isValidEmail || email === ''}
                sx={{
                    backgroundColor: "#18CE79",
                }}
                hoverBackgroundColor='#32E48E'
            >
                確認
            </CustomActionBtn>
        </div>
    );
}

export default ChangeEmail
