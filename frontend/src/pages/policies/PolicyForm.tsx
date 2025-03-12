"use client"

import type React from "react"
import { useState, useEffect, type ChangeEvent } from "react"
import { useNavigate, useParams, useLocation, Link } from "react-router-dom"
import {
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormHelperText,
  Card,
  CardContent,
  Divider,
  InputAdornment,
  useTheme,
  Breadcrumbs,
  Avatar,
} from "@mui/material"
import {
  Check as CheckIcon,
  ArrowBack as ArrowBackIcon,
  EventNote as CalendarIcon,
  Payments as PaymentsIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  HomeWork as HomeIcon,
  HealthAndSafety as HealthIcon,
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import policyService from "../../services/policyService"
import customerService from "../../services/customerService"
import { type Policy, PolicyType } from "../../types/Policy"
import type { Customer } from "../../types/Customer"
import type { SelectChangeEvent } from "@mui/material/Select"

const PolicyForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const queryParams = new URLSearchParams(location.search)
  const customerId = queryParams.get("customerId")

  const isEditMode = !!id && id !== "new"

  const [policy, setPolicy] = useState<Policy>({
    type: PolicyType.AUTO,
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString().split("T")[0],
    coverageAmount: 0,
    customerId: customerId ? Number.parseInt(customerId) : 0,
  })

  const [customers, setCustomers] = useState<Customer[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchCustomers()
    if (isEditMode) {
      fetchPolicy()
    } else if (customerId) {
      fetchCustomer(Number(customerId))
    }
  }, [isEditMode, customerId])

  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers()
      setCustomers(data)
    } catch (err) {
      console.error("Error fetching customers:", err)
      setError("Failed to load customers. Please try again.")
    }
  }

  const fetchPolicy = async () => {
    try {
      setLoading(true)
      const data = await policyService.getPolicyById(Number(id))
      setPolicy(data)
      if (data.customerId) {
        fetchCustomer(data.customerId)
      }
    } catch (err) {
      console.error("Error fetching policy:", err)
      setError("Failed to load policy details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchCustomer = async (custId: number) => {
    try {
      const customer = await customerService.getCustomerById(custId)
      setSelectedCustomer(customer)
    } catch (err) {
      console.error("Error fetching customer:", err)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!policy.type) {
      errors.type = "Policy type is required"
    }

    if (!policy.startDate) {
      errors.startDate = "Start date is required"
    }

    if (!policy.endDate) {
      errors.endDate = "End date is required"
    } else if (new Date(policy.startDate) >= new Date(policy.endDate)) {
      errors.endDate = "End date must be after start date"
    }

    if (!policy.coverageAmount || policy.coverageAmount <= 0) {
      errors.coverageAmount = "Coverage amount must be greater than 0"
    }

    if (!policy.customerId) {
      errors.customerId = "Client is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (
      e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<PolicyType | number>,
  ) => {
    const { name, value } = e.target
    if (name) {
      setPolicy((prev) => ({ ...prev, [name]: value }))

      // Clear error for this field when user changes it
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }))
      }

      // If customer changed, fetch the customer details
      if (name === "customerId" && typeof value === "number") {
        fetchCustomer(value)
      }
    }
  }

  const handleDateChange = (field: "startDate" | "endDate", date: Date | null) => {
    if (date) {
      setPolicy((prev) => ({
        ...prev,
        [field]: date.toISOString().split("T")[0],
      }))

      // Clear error for this field when user changes it
      if (formErrors[field]) {
        setFormErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setSaving(true)
      setError("")

      if (isEditMode) {
        await policyService.updatePolicy(Number(id), policy)
      } else {
        await policyService.createPolicy(policy)
      }

      navigate("/policies")
    } catch (err) {
      console.error("Error saving policy:", err)
      setError("Failed to save policy. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const getPolicyIcon = (type: PolicyType) => {
    switch (type) {
      case PolicyType.AUTO:
        return <CarIcon />
      case PolicyType.HOME:
        return <HomeIcon />
      case PolicyType.HEALTH:
        return <HealthIcon />
      default:
        return null
    }
  }

  if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
  }

  return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box>
          <Breadcrumbs sx={{ mb: 3 }}>
            <Link to="/dashboard" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
              Dashboard
            </Link>
            <Link to="/policies" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
              Policies
            </Link>
            <Typography color="text.primary">{isEditMode ? "Edit Policy" : "New Policy"}</Typography>
          </Breadcrumbs>

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              {isEditMode ? "Edit Policy" : "Create New Policy"}
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
                      Policy Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth error={!!formErrors.type}>
                          <InputLabel id="policy-type-label">Policy Type</InputLabel>
                          <Select
                              labelId="policy-type-label"
                              id="type"
                              name="type"
                              value={policy.type}
                              label="Policy Type"
                              onChange={handleChange}
                              startAdornment={
                                <InputAdornment position="start">{getPolicyIcon(policy.type)}</InputAdornment>
                              }
                          >
                            <MenuItem value={PolicyType.AUTO}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <CarIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
                                Auto Insurance
                              </Box>
                            </MenuItem>
                            <MenuItem value={PolicyType.HOME}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <HomeIcon sx={{ mr: 1, color: theme.palette.secondary.main }} />
                                Home Insurance
                              </Box>
                            </MenuItem>
                            <MenuItem value={PolicyType.HEALTH}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <HealthIcon sx={{ mr: 1, color: theme.palette.success.main }} />
                                Health Insurance
                              </Box>
                            </MenuItem>
                          </Select>
                          {formErrors.type && <FormHelperText>{formErrors.type}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Coverage Amount ($)"
                            name="coverageAmount"
                            type="number"
                            value={policy.coverageAmount}
                            onChange={handleChange}
                            error={!!formErrors.coverageAmount}
                            helperText={formErrors.coverageAmount}
                            InputProps={{
                              inputProps: { min: 0 },
                              startAdornment: (
                                  <InputAdornment position="start">
                                    <PaymentsIcon color="action" />
                                  </InputAdornment>
                              ),
                            }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="Start Date"
                            value={policy.startDate ? new Date(policy.startDate) : null}
                            onChange={(date) => handleDateChange("startDate", date)}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!formErrors.startDate,
                                helperText: formErrors.startDate,
                                InputProps: {
                                  startAdornment: (
                                      <InputAdornment position="start">
                                        <CalendarIcon color="action" />
                                      </InputAdornment>
                                  ),
                                },
                              },
                            }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={6}>
                        <DatePicker
                            label="End Date"
                            value={policy.endDate ? new Date(policy.endDate) : null}
                            onChange={(date) => handleDateChange("endDate", date)}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!formErrors.endDate,
                                helperText: formErrors.endDate,
                                InputProps: {
                                  startAdornment: (
                                      <InputAdornment position="start">
                                        <CalendarIcon color="action" />
                                      </InputAdornment>
                                  ),
                                },
                              },
                            }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Client Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth error={!!formErrors.customerId}>
                          <InputLabel id="customer-label">Client</InputLabel>
                          <Select
                              labelId="customer-label"
                              id="customerId"
                              name="customerId"
                              value={policy.customerId || ""}
                              label="Client"
                              onChange={handleChange}
                              disabled={!!customerId}
                              startAdornment={
                                <InputAdornment position="start">
                                  <PersonIcon color="action" />
                                </InputAdornment>
                              }
                          >
                            {customers.map((customer) => (
                                <MenuItem key={customer.id} value={customer.id}>
                                  {customer.firstName} {customer.lastName}
                                </MenuItem>
                            ))}
                          </Select>
                          {formErrors.customerId && <FormHelperText>{formErrors.customerId}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      {selectedCustomer && (
                          <Grid item xs={12}>
                            <Card variant="outlined" sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
                              <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Avatar
                                    sx={{
                                      bgcolor: theme.palette.grey[200],
                                      width: 48,
                                      height: 48,
                                      mr: 2,
                                      fontSize: "1rem",
                                    }}
                                >
                                  {selectedCustomer.firstName.charAt(0)}
                                  {selectedCustomer.lastName.charAt(0)}
                                </Avatar>
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {selectedCustomer.firstName} {selectedCustomer.lastName}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {selectedCustomer.email} • {selectedCustomer.phone}
                                  </Typography>
                                </Box>
                              </Box>
                            </Card>
                          </Grid>
                      )}
                    </Grid>
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
                  <Button
                      variant="outlined"
                      onClick={() => navigate("/policies")}
                      startIcon={<ArrowBackIcon />}
                      sx={{ borderRadius: "8px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                      type="submit"
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <CheckIcon />}
                      disabled={saving}
                      sx={{ borderRadius: "8px", py: 1.2 }}
                  >
                    {isEditMode ? "Update Policy" : "Create Policy"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </LocalizationProvider>
  )
}

export default PolicyForm

