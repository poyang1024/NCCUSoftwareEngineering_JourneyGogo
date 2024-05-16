import React, { useState } from 'react'
import CustomTextField from '../UI/CustomTextField'
import CustomActionBtn from '../UI/CustomActionBtn';
import { IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useSnackBar } from '../../contexts/snackbar';
import ProfileRouteProps from '../../interface/ProfileRouteProps';


const ChangePwd = ({ routeHandler }: ProfileRouteProps) => {

    const [password, setPassword] = useState({
        "first": "",
        "second": ""
    })
    const [showPassword, setShowPassword] = useState(false);
    const [isValidPwd, setValidPwd] = useState({ // first field and scoond field
        "first": false,
        "second": false
    });

    const { showSnackBar } = useSnackBar()


    const validatePassword = (password: string): boolean => {
        const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{10,}$/;
        return passwordPattern.test(password);
    };


    const handleClickShowPassword = () => setShowPassword(!showPassword);

    const handlePwdChange_first = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredPwd = e.target.value;
        setPassword({
            ...password,
            first: enteredPwd
        });
        setValidPwd({
            ...isValidPwd,
            first: validatePassword(enteredPwd)
        });
    };

    const handlePwdChange_second = (e: React.ChangeEvent<HTMLInputElement>) => {
        const enteredPwd = e.target.value;
        setPassword({
            ...password,
            second: enteredPwd
        });
        setValidPwd({
            ...isValidPwd,
            second: enteredPwd === password.first
        });
    };


    const submitHandler = (): void => {
        const isCorrect = true // api call 
        if (isCorrect) {
            routeHandler("/")
            showSnackBar('Password change success.', 'success')
        }
        else {
            showSnackBar('Password change failed.', 'error')
        }
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <p style={{ fontSize: "20px", fontWeight: 500, margin: 0 }}>變更密碼</p>
            <p style={{ fontSize: "15px", fontWeight: 500, margin: 0, color: "#808080" }}>
                需至少使用 10 個字元，包含大寫、小寫字母以及數字。
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <p style={{ fontSize: "11px", fontWeight: 400, margin: 0, color: "#333333" }}>密碼</p>
                <CustomTextField
                    fullWidth
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    label={password.first ? "" : "請輸入密碼"}
                    value={password.first}
                    onChange={handlePwdChange_first}
                    error={!isValidPwd.first && password.first !== ""}
                    helperText={!isValidPwd.first && password.first !== "" ? "請輸入有效的密碼" : ""}
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
            <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                <p style={{ fontSize: "11px", fontWeight: 400, margin: 0, color: "#333333" }}>確認密碼</p>
                <CustomTextField
                    fullWidth
                    id="outlined-adornment-password2"
                    type={showPassword ? 'text' : 'password'}
                    label={password.second ? "" : "請再次輸入密碼"}
                    value={password.second}
                    onChange={handlePwdChange_second}
                    error={!isValidPwd.second && password.second !== ""}
                    helperText={!isValidPwd.second && password.second !== "" ? "請輸入相同的密碼" : ""}
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
                disabled={password.first !== password.second || password.first === ''}
                sx={{
                    top: "1rem",
                    backgroundColor: "#18CE79",
                }}
                hoverBackgroundColor='#32E48E'
            >
                變更密碼
            </CustomActionBtn>
        </div>
    )

};

export default ChangePwd
