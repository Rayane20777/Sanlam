"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
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
  useTheme,
} from "@mui/material"
import { Visibility, VisibilityOff, Email as EmailIcon, Lock as LockIcon } from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

const Login: React.FC = () => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()

  const from = location.state?.from?.pathname || "/dashboard"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username || !password) {
      setError("Please enter both username and password")
      return
    }

    try {
      setError("")
      setLoading(true)
      await login(username, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to login. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
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
        background: "#E5E7EB",
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
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        }}
      >
        {/* Left side - Brand */}
        <Box
          sx={{
            flex: { xs: "0 0 100%", md: "0 0 40%" },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            p: 4,
            backgroundColor: "#F3F4F6",
            color: "#0066B3",
            textAlign: "center",
            borderRight: "1px solid",
            borderColor: "divider",
          }}
        >
          <Box sx={{ mb: 3, width: "80%", maxWidth: 280 }}>
            <img
              src="/assets/sanlam-investments-logo.png"
              alt="Sanlam Investments"
              style={{ width: "100%", height: "auto" }}
            />
          </Box>
          <Typography variant="h6" fontWeight={500} sx={{ mt: 2, color: "#666666" }}>
            Insurance Management System
          </Typography>
          <Typography variant="body2" sx={{ mt: 2, color: "#666666" }}>
            Secure your future with Sanlam's comprehensive insurance solutions.
          </Typography>
        </Box>

        {/* Right side - Login Form */}
        <Box
          sx={{
            flex: { xs: "0 0 100%", md: "0 0 60%" },
            p: 4,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <Typography component="h1" variant="h5" fontWeight={600} color="text.primary">
              Sign In to Your Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Enter your credentials to access your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
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
                    <EmailIcon sx={{ color: "#0066B3" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "#0066B3" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton 
                      aria-label="toggle password visibility" 
                      onClick={toggleShowPassword} 
                      edge="end"
                      sx={{ color: "#0066B3" }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3 }}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{ 
                py: 1.5, 
                mb: 2,
                bgcolor: "#0066B3",
                "&:hover": {
                  bgcolor: "#004580"
                }
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Sign In"}
            </Button>

            <Box sx={{ textAlign: "center", mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  style={{ color: "#0066B3", fontWeight: 500, textDecoration: "none" }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default Login

