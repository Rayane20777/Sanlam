"use client"

import type React from "react"
import { useState, useEffect, useCallback, useMemo } from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  Grid,
  Divider,
  InputAdornment,
  useTheme,
  Breadcrumbs,
} from "@mui/material"
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Home as HomeIcon,
  Check as CheckIcon,
} from "@mui/icons-material"
import customerService from "../../services/customerService"
import type { Customer } from "../../types/Customer"

const CustomerForm = () => {
  const { id } = useParams<{ id?: string }>()
  const navigate = useNavigate()
  const theme = useTheme()

  const isEditMode = useMemo(() => id && id !== "new", [id])

  const [customer, setCustomer] = useState<Customer>({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    phone: "",
  })

  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  const fetchCustomer = useCallback(async () => {
    if (!isEditMode) return

    setLoading(true)
    try {
      const data = await customerService.getCustomerById(Number(id))
      setCustomer(data)
    } catch (err) {
      console.error("Error fetching client:", err)
      setError("Failed to retrieve client details. Please try again.")
    } finally {
      setLoading(false)
    }
  }, [id, isEditMode])

  useEffect(() => {
    fetchCustomer()
  }, [fetchCustomer])

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!customer.firstName.trim()) errors.firstName = "First name is required"
    if (!customer.lastName.trim()) errors.lastName = "Last name is required"
    if (!customer.email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(customer.email)) {
      errors.email = "Email is invalid"
    }
    if (!customer.address.trim()) errors.address = "Address is required"
    if (!customer.phone.trim()) errors.phone = "Phone number is required"

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomer((prev) => ({ ...prev, [name]: value }))

    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()
      if (!validateForm()) return

      setSaving(true)
      setError("")

      try {
        if (isEditMode) {
          await customerService.updateCustomer(Number(id), customer)
        } else {
          await customerService.createCustomer(customer)
        }
        navigate("/customers")
      } catch (err) {
        console.error("Error saving client:", err)
        setError("Failed to save client. Please try again.")
      } finally {
        setSaving(false)
      }
    },
    [customer, id, isEditMode, navigate],
  )

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    )
  }

  return (
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/dashboard" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
          Dashboard
        </Link>
        <Link to="/customers" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
          Clients
        </Link>
        <Typography color="text.primary">{isEditMode ? "Edit Client" : "New Client"}</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" component="h1" fontWeight={600}>
          {isEditMode ? "Edit Client" : "Add New Client"}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Personal Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      name="firstName"
                      value={customer.firstName}
                      onChange={handleChange}
                      error={!!formErrors.firstName}
                      helperText={formErrors.firstName}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      name="lastName"
                      value={customer.lastName}
                      onChange={handleChange}
                      error={!!formErrors.lastName}
                      helperText={formErrors.lastName}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={customer.email}
                      onChange={handleChange}
                      error={!!formErrors.email}
                      helperText={formErrors.email}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <EmailIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Contact Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Phone Number"
                      name="phone"
                      value={customer.phone}
                      onChange={handleChange}
                      error={!!formErrors.phone}
                      helperText={formErrors.phone}
                      required
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      value={customer.address}
                      onChange={handleChange}
                      error={!!formErrors.address}
                      helperText={formErrors.address}
                      required
                      multiline
                      rows={2}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <HomeIcon color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>

            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
              <Button variant="outlined" onClick={() => navigate("/customers")} startIcon={<ArrowBackIcon />}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                disabled={saving}
              >
                {isEditMode ? "Update Client" : "Save Client"}
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default CustomerForm

