import React, {useState, useRef} from "react";
import { Row, Col, Form, Input, Button } from "antd";
// import "./pages/login.scss";
import BtnLoader from '../assets/btn_loader.gif'

import "../styles/main.scss";
import XapadsLogo from "../assets/XapadsLogo.svg"

export default function LoginPage() {
  const [form] = Form.useForm();
  const errSufix = (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="alert-triangle">
              <path id="Icon" d="M7.99986 5.33339V8.00006M7.99986 10.6667H8.00653M6.85986 1.90672L1.21319 11.3334C1.09677 11.535 1.03517 11.7636 1.03452 11.9964C1.03387 12.2292 1.09419 12.4581 1.20948 12.6604C1.32477 12.8627 1.49101 13.0312 1.69167 13.1493C1.89232 13.2674 2.12039 13.3308 2.35319 13.3334H13.6465C13.8793 13.3308 14.1074 13.2674 14.3081 13.1493C14.5087 13.0312 14.675 12.8627 14.7902 12.6604C14.9055 12.4581 14.9659 12.2292 14.9652 11.9964C14.9646 11.7636 14.903 11.535 14.7865 11.3334L9.13986 1.90672C9.02101 1.71079 8.85368 1.5488 8.65399 1.43638C8.45431 1.32395 8.22902 1.26489 7.99986 1.26489C7.7707 1.26489 7.54542 1.32395 7.34573 1.43638C7.14605 1.5488 6.97871 1.71079 6.85986 1.90672Z" stroke="#E50016" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </g>
      </svg>
  )

  const [showOTP, setShowOTP] = useState(true)

    // Validate Email From API On SigIn Button And Open OTP Screen
    const [showLoading, setShowLoading] = useState(false)

    const [email, setEmail] = useState("")
    const [emailErr, setEmailErr] = useState(false)
    const [emailErrMsg, setEmailErrMsg] = useState("")
    const validateEmail = (email) => {
        email = email.trim()
        const regex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        setEmail(email)

        if (email === "") {
            setEmailErr(true)
            setEmailErrMsg("Email is required.")
        } else if (regex.test(email) === false) {
            setEmailErr(true)
            setEmailErrMsg("Entered value must be a valid email address.")

        } else {
            setEmailErr(false)
            setEmailErrMsg("")

        }
    }

    const handleValidateEmail = () => {
        if ((email === "") || emailErr) {
          if (email === "") {
            setEmailErr(true)
            setEmailErrMsg("Email is required.")
          }
        } else {

           setShowOTP(true)
           return 0;
            setShowLoading(true)
            const raw = JSON.stringify({
                'email': email.toLowerCase()
            })

            const config = {
                method: 'post',
                maxBodyLength: Infinity,
                url: `${import.meta.env.VITE_APP_API_URL}/signin`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: raw
            };

            axios(config).then((response) => {
                if (response.status === 200) {
                    setShowOTP(true)
                    showToast('success', response.data.message)
                } else {
                    showToast('failure', response.data.message)
                }
            }).catch((error) => {
                showToast('failure', error.response.data.message)
            }).finally(() => {
                setShowLoading(false)
            });
        }
    }

    // /////////////////////////////////////Otp code ////////////////////////////////////////////////
    const [showResendOTP, setShowResendOTP] = useState(true)
    const [counterTime, setCounterTime] = useState('00:60');
    const intervalRef = useRef(null);
    const handleResendOTP = () => {

        handleValidateEmail()
        // Clear any running interval before starting a new one
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        let counter = 59;
        setShowResendOTP(false);
        setCounterTime(`00:${String(counter).padStart(2, '0')}`);

        intervalRef.current = setInterval(() => {
            counter--;

            if (counter < 0) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
                setShowResendOTP(true);
            } else {
                setCounterTime(`00:${String(counter).padStart(2, '0')}`);
            }
        }, 1000);
    };

    const [otp, setOTP] = useState(null);
    const [otpErr, setOTPErr] = useState(false)
    const [otpErrMsg, setOTPErrMsg] = useState("")
    const [verifyLoading, setVerifyLoading] = useState(false)

    const [otpArr, setOTPArr] = useState([])

    const handleBeforeInput = (e) => {
      // Block non-digit inputs (except Enter, Backspace, etc.)
      if (!/^\d+$/.test(e.data)) {
        e.preventDefault();
      }
    }

    const onChangeOTP = (otpValue) => {
      if (!/^\d*$/.test(otpValue)) {
          return;
      }

      if (otpValue.length === 0) {
          setOTPErr(true);
          setOTPErrMsg("OTP is required");
      } else {
          setOTPErr(false);
          setOTPErrMsg("");
      }

      setOTP(otpValue.slice(0, 6));

      if (otpValue.length === 6) {
          setTimeout(() => {
              form.submit();
          }, 0);
      }
    }

    const handlePaste = (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text').trim();

      // allow only digits
      if (!/^\d+$/.test(pasted)) return;

      // if more than 6 chars, trim
      const cleanOtp = pasted.slice(0, 6);

      // directly update your OTP state
      onChangeOTP(cleanOtp);
    };

    // Verify Login AFter OTP Input Complete By User
    const verifyLogin = () => {
      if ((otp.length < 6) || otpErr) {
        if (otp === "") {
          setOTPErr(true)
          setOTPErrMsg("Otp is required.")
        }
        else {
          setOTPErr(true)
          setOTPErrMsg("Incorrect Otp length")
        }
      } else {
          setVerifyLoading(true)

          const raw = JSON.stringify({
              'email': email.trim().toLowerCase(),
              'otp': Number(otp)
          })

          const config = {
              method: 'post',
              maxBodyLength: Infinity,
              url: `${import.meta.env.VITE_APP_API_URL}/verifyotp`,
              headers: {
                  'Content-Type': 'application/json'
              },
              data: raw
          };

          axios(config).then((response) => {
            if (response.status === 200) {
                login(response.data.token, response.data.data);
                // setShowOTP(true)
                // showToast('success', response.data.message)
            } else {
                showToast('failure', response.data.message)
            }
          }).catch((error) => {
              const msg = error?.response?.data?.message || "Something went wrong";
              showToast('failure', msg);
          }).finally(() => {
              setVerifyLoading(false)
          });
      }
    }

    const backToLogin = () => {
      setOTP("");
      setOTPErr(false)
      setOTPErrMsg("")
      setVerifyLoading(false)
      form.resetFields()
      setShowOTP(false)
    }

    const handleOTPInput = (value) => {
        // console.log('handleOTPInput:', value);

      if (!/^\d{0,6}$/.test(value)) return; // Allow only digits up to 6 characters
      setOTPArr(value)
    }

    const handleOTP = (otp) => {
      // console.log('onChange:', otp);
      setOTP(otp)
      setOTPErr(false)
      setOTPErrMsg("")

      if (otp.length === 6 && /^\d{6}$/.test(otp)) {
          verifyLogin(otp);  // pass otp directly
      }
    };
    
    const handleEmailEdit = () => {
      console.log("email", email)
      // setValidEmail(false)
      setShowOTP(false)
      setShowResendOTP(true)
      // setCounterTime('00:60')
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

  return (
    <div className="login-container">
    <Row className="login-wrapper">
      
      {/* LEFT HALF – IMAGE */}
      <Col xs={0} md={12} className="left-image-section">
        <div className="left-panel">
          <h1 className="title">
            Built for<br />
            Performance.<br />
            Driven by<br />
            Intelligence.
          </h1>
          <p className="subtext">AI-led DSP for measurable mobile growth.</p>
        </div>
      </Col>

      {/* RIGHT HALF – FORM */}
      <Col xs={24} md={12} className="right-form-section">
        <div className="right-panel">
          <div className="login-card">
            <img src={XapadsLogo} alt="logo" className="logo" />

            {!showOTP?
            <>
            <h2 className="welcome">Welcome Back</h2>
            <p className="signin-msg">Sign in to your account</p>
              <Form layout="vertical" className="custom_form" autoComplete="new-email">
                <Form.Item className='m-0'
                  label="Email Address *"
                  name="email"
                  validateStatus={emailErr ? 'error' : ''} help={emailErrMsg}
                >
                  <Input className="input-box" value={email} onChange={(e) => validateEmail(e.target.value)}
                    placeholder="Enter your email" autoComplete="new-email"
                    prefix={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="M18.3333 4.99998C18.3333 4.08331 17.5833 3.33331 16.6667 3.33331H3.33333C2.41667 3.33331 1.66667 4.08331 1.66667 4.99998M18.3333 4.99998V15C18.3333 15.9166 17.5833 16.6666 16.6667 16.6666H3.33333C2.41667 16.6666 1.66667 15.9166 1.66667 15V4.99998M18.3333 4.99998L10 10.8333L1.66667 4.99998"
                          stroke="#7D8593"
                          strokeWidth="1.33333"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
                  />
                </Form.Item>   
                <Form.Item className='m-0'>
                  <Button block type="primary"
                    htmlType="submit"
                    disabled={verifyLoading}
                    onClick={handleValidateEmail}
                  >Send Code
                  </Button>
                </Form.Item>                      
              </Form>
            <p className="footer">
              Having trouble with your account?{" "}
              <a href="#" className="contact-link">Contact administrator</a>
            </p> 
            </>
            :
            <>
            <h2 className="welcome">Verify Your Email</h2>
            <p className="signin-msg">Enter 6 digit code sent to your email</p>
            <Form name="otp_verify" className="custom_form"
              form={form}
              onFinish={verifyLogin}
              autoComplete="off" layout="vertical">
                <div className="email-display-box">
                  <div className="email_display_main">
                    <span className="left-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M18.3333 5.00004C18.3333 4.08337 17.5833 3.33337 16.6667 3.33337H3.33333C2.41667 3.33337 1.66667 4.08337 1.66667 5.00004M18.3333 5.00004V15C18.3333 15.9167 17.5833 16.6667 16.6667 16.6667H3.33333C2.41667 16.6667 1.66667 15.9167 1.66667 15V5.00004M18.3333 5.00004L10 10.8334L1.66667 5.00004" stroke="#1D2024" stroke-width="1.33333" stroke-linecap="round" stroke-linejoin="round"/>
                      </svg>
                    </span>
                    <span className="email-text">{email}</span>
                  </div>
                  <div className="edit-icon" onClick={handleEmailEdit}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 20H21M16.5 3.49998C16.8978 3.10216 17.4374 2.87866 18 2.87866C18.2786 2.87866 18.5544 2.93353 18.8118 3.04014C19.0692 3.14674 19.303 3.303 19.5 3.49998C19.697 3.69697 19.8532 3.93082 19.9598 4.18819C20.0665 4.44556 20.1213 4.72141 20.1213 4.99998C20.1213 5.27856 20.0665 5.55441 19.9598 5.81178C19.8532 6.06915 19.697 6.303 19.5 6.49998L7 19L3 20L4 16L16.5 3.49998Z" stroke="#2A2E34" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                  </div>
                </div>

                <Form.Item name="otp" label="Enter 6-digit code" validateStatus={otpErr ? 'error' : ''} help={otpErrMsg}>
                  <Input.OTP className="otp_input_box" onInput={handleOTPInput} onChange={handleOTP} status={otpErr ? 'error' : ''} />
                </Form.Item>    
                <Form.Item className='m-0'>
                  <Button block type="primary"
                    htmlType="submit"
                    disabled={verifyLoading}
                  >
                    {verifyLoading ? <img src={BtnLoader} className='img-fluid' alt="" /> : "Verify"}
                  </Button>
                </Form.Item>                 
              </Form>

            <p className="footer">
              Didn't receive the code?{" "}
              {showResendOTP? <a className='resend_otp_btn' onClick={handleResendOTP}>Resend OTP</a> : <span className='resend_otp_text'>Resend OTP in <small>{counterTime}</small></span>}
            </p>            
            </>}
          </div>
        </div>
        </Col>
      </Row>
    </div>
  );
}
