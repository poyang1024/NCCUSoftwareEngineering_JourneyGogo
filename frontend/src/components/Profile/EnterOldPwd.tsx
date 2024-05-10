import React, { useState } from 'react'
import CustomTextField from '../UI/CustomTextField'
import CustomActionBtn from '../UI/CustomActionBtn';
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSnackBar } from '../../contexts/snackbar';
import ProfileRouteProps from '../../interface/ProfileRouteProps';
import authService from '../../services/auth.service';

const EnterOldPwd = ({ routeHandler }: ProfileRouteProps) => {

    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);
    const [isValidPwd, setValidPwd] = useState(true);
    const { showSnackBar } = useSnackBar()


    const validatePassword = (password: string): boolean => {
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
        return passwordPattern.test(password);
    };

    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredPwd = e.target.value;
        setPassword(enteredPwd);
        setValidPwd(validatePassword(enteredPwd));
    };

    const submitHandler = async (): Promise<void> => {
        const isCorrect = await authService.verifyPassword({
            password: password
        })
        if (isCorrect.state) {
            routeHandler("/change-password")
        }
        else {
            showSnackBar('Wrong password.', 'error')
        }
    }

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <p style={{ fontSize: "20px", fontWeight: 500, margin: 0 }}>輸入舊密碼</p>
            <p style={{ fontSize: "15px", fontWeight: 500, margin: 0, color: "#808080" }}>需輸入舊密碼才能更改密碼</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <p style={{ fontSize: "11px", fontWeight: 400, margin: 0, color: "#333333" }}>密碼</p>
                <CustomTextField
                    fullWidth
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    label={password ? "" : "請輸入密碼"}
                    value={password}
                    onChange={handlePwdChange}
                    error={!isValidPwd && password !== ""}
                    helperText={!isValidPwd && password !== "" ? "請輸入有效的密碼" : ""}
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                >
                                    {showPassword ? <Visibility /> : <VisibilityOff />}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                />
            </div>
            <CustomActionBtn
                onClick={submitHandler}
                disabled={!isValidPwd || password === ''}
                sx={{
                    top: "1rem",
                    backgroundColor: "#18CE79",
                }}
                hoverBackgroundColor='#32E48E'
            >
                確認
            </CustomActionBtn>
        </div>
    )
}

export default EnterOldPwd