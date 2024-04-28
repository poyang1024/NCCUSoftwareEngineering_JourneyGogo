import React, { useState } from 'react'
import { Button } from '@mui/material'
import CustomTextField from '../../components/UI/CustomTextField'

const ChangeEmail = () => {
    const [email, setEmail] = useState("")
    const [isValidEmail, setIsValidEmail] = useState(true);

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

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <p style={{ fontSize: "20px", fontWeight: 500, margin: 0 }}>更改電子信箱</p>
            <CustomTextField
                id="outlined-basic"
                label={email ? "" : "請輸入電子信箱"}
                onChange={handleEmailChange}
                error={!isValidEmail && email !== ""}
                helperText={!isValidEmail && email !== "" ? "請輸入有效的電子信箱" : ""}
            />
            <Button
                variant="contained"
                // onClick={}
                disabled={!isValidEmail || email === ''}
                sx={{
                    fontSize: 15,
                    fontWeight: "bold",
                    backgroundColor: "#18CE79",
                    "&:hover": {
                        backgroundColor: "#080909",
                    },
                }}
            >
                確認
            </Button>
        </div>
    );
}

export default ChangeEmail