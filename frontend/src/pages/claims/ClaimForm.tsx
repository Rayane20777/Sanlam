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
  Chip,
} from "@mui/material"
import {
  Save as SaveIcon,
  ArrowBack as ArrowBackIcon,
  Description as DescriptionIcon,
  Payments as PaymentsIcon,
  EventNote as CalendarIcon,
  Assignment as ClaimIcon,
  DirectionsCar as CarIcon,
  HomeWork as HomeIcon,
  HealthAndSafety as HealthIcon,
  Money as MoneyIcon,
} from "@mui/icons-material"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import claimService from "../../services/claimService"
import policyService from "../../services/policyService"
import { type Claim, ClaimStatus } from "../../types/Claim"
import type { PolicyWithCustomer } from "../../types/Policy"
import type { SelectChangeEvent } from "@mui/material/Select"

const getPolicyIcon = (type: string) => {
  switch (type) {
    case "AUTO":
      return <CarIcon />
    case "HOME":
      return <HomeIcon />
    case "HEALTH":
      return <HealthIcon />
    default:
      return <DescriptionIcon />
  }
}

const ClaimForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const queryParams = new URLSearchParams(location.search)
  const policyId = queryParams.get("policyId")

  const isEditMode = !!id && id !== "new"

  const [claim, setClaim] = useState<Claim>({
    date: new Date().toISOString().split("T")[0],
    description: "",
    claimedAmount: 0,
    status: ClaimStatus.PENDING,
    policyId: policyId ? Number.parseInt(policyId) : 0,
  })

  const [policies, setPolicies] = useState<PolicyWithCustomer[]>([])
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyWithCustomer | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchPolicies()
    if (isEditMode) {
      fetchClaim()
    } else if (policyId) {
      fetchPolicy(Number(policyId))
    }
  }, [isEditMode, policyId])

  const fetchPolicies = async () => {
    try {
      const data = await policyService.getAllPoliciesWithCustomers()
      setPolicies(data)
    } catch (err) {
      console.error("Error fetching policies:", err)
      setError("Failed to load policies. Please try again.")
    }
  }

  const fetchClaim = async () => {
    try {
      setLoading(true)
      const data = await claimService.getClaimById(Number(id))
      setClaim(data)
      if (data.policyId) {
        fetchPolicy(data.policyId)
      }
    } catch (err) {
      console.error("Error fetching claim:", err)
      setError("Failed to load claim details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const fetchPolicy = async (polId: number) => {
    try {
      const policy = await policyService.getPolicyWithCustomer(polId)
      setSelectedPolicy(policy)
    } catch (err) {
      console.error("Error fetching policy:", err)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}

    if (!claim.date) {
      errors.date = "Date is required"
    }

    if (!claim.description.trim()) {
      errors.description = "Description is required"
    }

    if (!claim.claimedAmount || claim.claimedAmount <= 0) {
      errors.claimedAmount = "Claimed amount must be greater than 0"
    }

    if (!claim.policyId) {
      errors.policyId = "Policy is required"
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    if (name) {
      setClaim((prev) => ({ ...prev, [name]: value }))

      // Clear error for this field when user changes it
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }))
      }
    }
  }

  const handleSelectChange = (e: SelectChangeEvent<number>) => {
    const { name, value } = e.target
    if (name) {
      setClaim((prev) => ({ ...prev, [name]: value }))

      // Clear error for this field when user changes it
      if (formErrors[name]) {
        setFormErrors((prev) => ({ ...prev, [name]: "" }))
      }

      // If policy changed, fetch the policy details
      if (name === "policyId" && typeof value === "number") {
        fetchPolicy(value)
      }
    }
  }

  const handleDateChange = (date: Date | null) => {
    if (date) {
      setClaim((prev) => ({
        ...prev,
        date: date.toISOString().split("T")[0],
      }))

      // Clear error for this field when user changes it
      if (formErrors.date) {
        setFormErrors((prev) => ({ ...prev, date: "" }))
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
        await claimService.updateClaim(Number(id), claim)
      } else {
        await claimService.createClaim(claim)
      }

      // Navigate back to policy details or claims list
      if (claim.policyId) {
        navigate(`/policies/${claim.policyId}`)
      } else {
        navigate("/claims")
      }
    } catch (err) {
      console.error("Error saving claim:", err)
      setError("Failed to save claim. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
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
            <Link to="/claims" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
              Claims
            </Link>
            <Typography color="text.primary">{isEditMode ? "Edit Claim" : "New Claim"}</Typography>
          </Breadcrumbs>

          <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
            <Typography variant="h4" component="h1" fontWeight={600}>
              {isEditMode ? "Edit Claim" : "File New Claim"}
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
                      Claim Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Grid container spacing={3}>
                      <Grid item xs={12}>
                        <FormControl fullWidth error={!!formErrors.policyId}>
                          <InputLabel id="policy-label">Policy</InputLabel>
                          <Select
                              labelId="policy-label"
                              id="policyId"
                              name="policyId"
                              value={claim.policyId || ""}
                              label="Policy"
                              onChange={handleSelectChange}
                              disabled={!!policyId}
                              startAdornment={
                                  selectedPolicy && (
                                      <InputAdornment position="start">
                                        {getPolicyIcon(selectedPolicy.policy.type)}
                                      </InputAdornment>
                                  )
                              }
                          >
                            {policies.map((policy) => (
                                <MenuItem key={policy.policy.id} value={policy.policy.id}>
                                  <Box sx={{ display: "flex", alignItems: "center" }}>
                                    <Avatar
                                        sx={{
                                          bgcolor:
                                              policy.policy.type === "AUTO"
                                                  ? theme.palette.primary.main
                                                  : policy.policy.type === "HOME"
                                                      ? theme.palette.secondary.main
                                                      : theme.palette.success.main,
                                          width: 24,
                                          height: 24,
                                          mr: 1,
                                          fontSize: "0.8rem",
                                        }}
                                    >
                                      {getPolicyIcon(policy.policy.type)}
                                    </Avatar>
                                    {policy.policy.type} - {policy.customer.firstName} {policy.customer.lastName}
                                  </Box>
                                </MenuItem>
                            ))}
                          </Select>
                          {formErrors.policyId && <FormHelperText>{formErrors.policyId}</FormHelperText>}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12}>
                        <DatePicker
                            label="Incident Date"
                            value={claim.date ? new Date(claim.date) : null}
                            onChange={handleDateChange}
                            slotProps={{
                              textField: {
                                fullWidth: true,
                                error: !!formErrors.date,
                                helperText: formErrors.date,
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

                      <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Claimed Amount ($)"
                            name="claimedAmount"
                            type="number"
                            value={claim.claimedAmount}
                            onChange={handleInputChange}
                            error={!!formErrors.claimedAmount}
                            helperText={formErrors.claimedAmount}
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

                      <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            multiline
                            rows={4}
                            value={claim.description}
                            onChange={handleInputChange}
                            error={!!formErrors.description}
                            helperText={formErrors.description || "Describe the incident with as much detail as possible."}
                            InputProps={{
                              startAdornment: (
                                  <InputAdornment position="start" sx={{ alignSelf: "flex-start", mt: 1.5 }}>
                                    <DescriptionIcon color="action" />
                                  </InputAdornment>
                              ),
                            }}
                        />
                      </Grid>

                      {isEditMode && (
                          <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                              <InputLabel id="status-label">Status</InputLabel>
                              <Select
                                  labelId="status-label"
                                  id="status"
                                  name="status"
                                  value={claim.status}
                                  label="Status"
                                  onChange={(e) => {
                                    setClaim((prev) => ({ ...prev, status: e.target.value as ClaimStatus }))
                                  }}
                              >
                                <MenuItem value={ClaimStatus.PENDING}>Pending</MenuItem>
                                <MenuItem value={ClaimStatus.APPROVED}>Approved</MenuItem>
                                <MenuItem value={ClaimStatus.REJECTED}>Rejected</MenuItem>
                                <MenuItem value={ClaimStatus.SETTLED}>Settled</MenuItem>
                              </Select>
                            </FormControl>
                          </Grid>
                      )}

                      {isEditMode && claim.status === ClaimStatus.SETTLED && (
                          <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Settled Amount ($)"
                                name="settledAmount"
                                type="number"
                                value={claim.settledAmount || ""}
                                onChange={handleInputChange}
                                InputProps={{
                                  inputProps: { min: 0 },
                                  startAdornment: (
                                      <InputAdornment position="start">
                                        <MoneyIcon color="action" />
                                      </InputAdornment>
                                  ),
                                }}
                            />
                          </Grid>
                      )}
                    </Grid>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Policy Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    {selectedPolicy ? (
                        <Box>
                          <Card variant="outlined" sx={{ p: 3, mb: 3, bgcolor: theme.palette.grey[50] }}>
                            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                              <Avatar
                                  sx={{
                                    bgcolor:
                                        selectedPolicy.policy.type === "AUTO"
                                            ? theme.palette.primary.main
                                            : selectedPolicy.policy.type === "HOME"
                                                ? theme.palette.secondary.main
                                                : theme.palette.success.main,
                                    width: 48,
                                    height: 48,
                                    mr: 2,
                                  }}
                              >
                                {getPolicyIcon(selectedPolicy.policy.type)}
                              </Avatar>
                              <Box>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                  <Typography variant="h6" fontWeight={600}>
                                    {selectedPolicy.policy.type} Policy
                                  </Typography>
                                  <Chip
                                      label={selectedPolicy.policy.type}
                                      color={
                                        selectedPolicy.policy.type === "AUTO"
                                            ? "primary"
                                            : selectedPolicy.policy.type === "HOME"
                                                ? "secondary"
                                                : "success"
                                      }
                                      size="small"
                                  />
                                </Box>
                                <Typography variant="body2" color="text.secondary">
                                  Policy ID: {selectedPolicy.policy.id}
                                </Typography>
                              </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Grid container spacing={2}>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Coverage Amount
                                </Typography>
                                <Typography variant="body1" fontWeight={600}>
                                  {formatCurrency(selectedPolicy.policy.coverageAmount)}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  Policy Period
                                </Typography>
                                <Typography variant="body1">
                                  {new Date(selectedPolicy.policy.startDate).toLocaleDateString()} -{" "}
                                  {new Date(selectedPolicy.policy.endDate).toLocaleDateString()}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Card>

                          <Card variant="outlined" sx={{ p: 3, bgcolor: theme.palette.grey[50] }}>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              Policy Holder
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                              <Avatar
                                  sx={{
                                    bgcolor: theme.palette.grey[300],
                                    width: 40,
                                    height: 40,
                                    mr: 2,
                                    fontSize: "1rem",
                                  }}
                              >
                                {selectedPolicy.customer.firstName.charAt(0)}
                                {selectedPolicy.customer.lastName.charAt(0)}
                              </Avatar>
                              <Box>
                                <Typography variant="body1" fontWeight={600}>
                                  {selectedPolicy.customer.firstName} {selectedPolicy.customer.lastName}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  {selectedPolicy.customer.email}
                                </Typography>
                              </Box>
                            </Box>
                          </Card>
                        </Box>
                    ) : (
                        <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              p: 4,
                              bgcolor: theme.palette.grey[50],
                              borderRadius: 1,
                              height: "100%",
                              minHeight: 200,
                            }}
                        >
                          <ClaimIcon sx={{ fontSize: 48, color: theme.palette.primary.main, opacity: 0.5, mb: 2 }} />
                          <Typography variant="body1" color="text.secondary" align="center">
                            Select a policy to see its details
                          </Typography>
                        </Box>
                    )}
                  </Grid>
                </Grid>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}>
                  <Button
                      variant="outlined"
                      onClick={() => (claim.policyId ? navigate(`/policies/${claim.policyId}`) : navigate("/claims"))}
                      startIcon={<ArrowBackIcon />}
                      sx={{ borderRadius: "8px" }}
                  >
                    Cancel
                  </Button>
                  <Button
                      type="submit"
                      variant="contained"
                      startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                      disabled={saving}
                      sx={{ borderRadius: "8px", py: 1.2 }}
                  >
                    {isEditMode ? "Update Claim" : "Submit Claim"}
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
      </LocalizationProvider>
  )
}

export default ClaimForm

