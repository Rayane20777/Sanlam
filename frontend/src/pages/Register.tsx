"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  InputAdornment,
  IconButton,
  Grid,
  useTheme,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material"
import {
  Visibility,
  VisibilityOff,
  Email as EmailIcon,
  Person as PersonIcon,
  Lock as LockIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

const Register: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const { register } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()

  const steps = ["Account Information", "Set Password", "Complete"]

  const validateEmail = (email: string) => {
    return /\S+@\S+\.\S+/.test(email)
  }

  const handleNext = () => {
    if (activeStep === 0) {
      if (!username || !email) {
        setError("Please fill in all fields")
        return
      }
      if (!validateEmail(email)) {
        setError("Please enter a valid email address")
        return
      }
    } else if (activeStep === 1) {
      if (!password || !confirmPassword) {
        setError("Please fill in all fields")
        return
      }
      if (password !== confirmPassword) {
        setError("Passwords do not match")
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters long")
        return
      }
    }

    setError("")
    setActiveStep((prevStep) => prevStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
    setError("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      setError("")
      setLoading(true)
      await register(username, email, password)
      setSuccess("Registration successful! You can now login.")
      setTimeout(() => {
        navigate("/login")
      }, 2000)
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to register. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <Container
      component="main"
      maxWidth={false}
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
        p: 3,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          maxWidth: 900,
          width: "100%",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Left side - Brand */}
        <Box
          sx={{
            flex: { xs: "0 0 100%", md: "0 0 40%" },
            display: { xs: "none", md: "flex" },
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            backgroundColor: theme.palette.primary.main,
            color: "white",
            textAlign: "center",
          }}
        >
          <Typography variant="h4" fontWeight={700} gutterBottom>
            SANLAM
          </Typography>
          <Typography variant="h6" fontWeight={500} gutterBottom>
            Insurance Management
          </Typography>
          <Box sx={{ my: 3 }}>
            <img
              src="/placeholder.svg?height=120&width=120"
              alt="SANLAM Logo"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </Box>
          <Typography variant="body2" sx={{ mt: 2, opacity: 0.8 }}>
            Join SANLAM today and experience world-class insurance services.
          </Typography>
        </Box>

        {/* Right side - Registration Form */}
        <Box
          sx={{
            flex: { xs: "0 0 100%", md: "0 0 60%" },
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 4 }}>
            <Typography component="h1" variant="h5" fontWeight={600} color="text.primary">
              Create Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Join SANLAM Insurance Management System
            </Typography>
          </Box>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              {success}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            {activeStep === 0 && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PersonIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon color="primary" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </>
            )}

            {activeStep === 1 && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton aria-label="toggle password visibility" onClick={toggleShowPassword} edge="end">
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 2 }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LockIcon color="primary" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle confirm password visibility"
                          onClick={toggleShowConfirmPassword}
                          edge="end"
                        >
                          {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{ mb: 3 }}
                />
              </>
            )}

            {activeStep === 2 && (
              <Box sx={{ textAlign: "center", py: 3 }}>
                <CheckCircleIcon sx={{ fontSize: 60, color: theme.palette.success.main, mb: 2 }} />
                <Typography variant="h5" gutterBottom fontWeight={600}>
                  Almost Done!
                </Typography>
                <Typography variant="body1" paragraph>
                  Please review your information before submitting:
                </Typography>
                <Box sx={{ textAlign: "left", bgcolor: "background.default", p: 2, borderRadius: 1, mb: 3 }}>
                  <Grid container spacing={2}>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Username:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" fontWeight={500}>
                        {username}
                      </Typography>
                    </Grid>
                    <Grid item xs={4}>
                      <Typography variant="body2" color="text.secondary">
                        Email:
                      </Typography>
                    </Grid>
                    <Grid item xs={8}>
                      <Typography variant="body2" fontWeight={500}>
                        {email}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              </Box>
            )}

            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
              {activeStep > 0 ? (
                <Button onClick={handleBack} startIcon={<ArrowBackIcon />} sx={{ mr: 1 }}>
                  Back
                </Button>
              ) : (
                <Box />
              )}

              {activeStep < steps.length - 1 ? (
                <Button variant="contained" color="primary" onClick={handleNext} endIcon={<ArrowForwardIcon />}>
                  Next
                </Button>
              ) : (
                <Button type="submit" variant="contained" color="primary" disabled={loading} sx={{ px: 4 }}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : "Register"}
                </Button>
              )}
            </Box>

            <Box sx={{ textAlign: "center", mt: 4 }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{ color: theme.palette.primary.main, fontWeight: 500, textDecoration: "none" }}
                >
                  Sign In
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Register

