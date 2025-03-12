"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"
import {
  Box,
  Button,
  Typography,
  Grid,
  Divider,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  Chip,
  Avatar,
  useTheme,
  Breadcrumbs,
  Stack,
} from "@mui/material"
import {
  Edit as EditIcon,
  Add as AddIcon,
  Person as PersonIcon,
  Description as DescriptionIcon,
  Assignment as ClaimIcon,
  EventNote as CalendarIcon,
  Payments as PaymentsIcon,
  HomeWork as HomeIcon,
  DirectionsCar as CarIcon,
  HealthAndSafety as HealthIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material"
import policyService from "../../services/policyService"
import claimService from "../../services/claimService"
import type { PolicyWithCustomer } from "../../types/Policy"
import { type Claim, ClaimStatus } from "../../types/Claim"

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

const TabPanel = (props: TabPanelProps) => {
  const { children, value, index, ...other } = props

  return (
      <div
          role="tabpanel"
          hidden={value !== index}
          id={`policy-tabpanel-${index}`}
          aria-labelledby={`policy-tab-${index}`}
          {...other}
      >
        {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
      </div>
  )
}

const getStatusColor = (status: ClaimStatus) => {
  switch (status) {
    case ClaimStatus.APPROVED:
      return "success"
    case ClaimStatus.REJECTED:
      return "error"
    case ClaimStatus.SETTLED:
      return "info"
    default:
      return "warning"
  }
}

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

const PolicyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()

  const [policy, setPolicy] = useState<PolicyWithCustomer | null>(null)
  const [claims, setClaims] = useState<Claim[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (id) {
      fetchPolicyData()
    }
  }, [id])

  const fetchPolicyData = async () => {
    try {
      setLoading(true)
      setError("")

      const policyData = await policyService.getPolicyWithCustomer(Number(id))
      setPolicy(policyData)

      const claimsData = await claimService.getClaimsByPolicyId(Number(id))
      setClaims(claimsData)
    } catch (err) {
      console.error("Error fetching policy data:", err)
      setError("Failed to load policy details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
  }

  if (!policy && !loading) {
    return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Policy not found. <Link to="/policies">Return to policy list</Link>
        </Alert>
    )
  }

  return (
      <Box>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/dashboard" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
            Dashboard
          </Link>
          <Link to="/policies" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
            Policies
          </Link>
          <Typography color="text.primary">Policy Details</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
                sx={{
                  bgcolor:
                      policy?.policy.type === "AUTO"
                          ? theme.palette.primary.main
                          : policy?.policy.type === "HOME"
                              ? theme.palette.secondary.main
                              : theme.palette.success.main,
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
            >
              {getPolicyIcon(policy?.policy.type || "")}
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="h4" component="h1" fontWeight={600}>
                  {policy?.policy.type} Policy
                </Typography>
                <Chip
                    label={policy?.policy.type}
                    color={
                      policy?.policy.type === "AUTO" ? "primary" : policy?.policy.type === "HOME" ? "secondary" : "success"
                    }
                    size="small"
                    sx={{ fontWeight: 500 }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary">
                Policy ID: {policy?.policy.id}
              </Typography>
            </Box>
          </Box>
          <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/policies/edit/${id}`)}>
            Edit Policy
          </Button>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
        )}

        <Card sx={{ mb: 4, borderRadius: 2, overflow: "hidden" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
                value={tabValue}
                onChange={handleTabChange}
                aria-label="policy tabs"
                sx={{
                  "& .MuiTab-root": {
                    minWidth: 120,
                    fontWeight: 500,
                    fontSize: "0.9rem",
                  },
                  "& .Mui-selected": {
                    fontWeight: 600,
                  },
                }}
            >
              <Tab label="Policy Details" icon={<DescriptionIcon />} iconPosition="start" />
              <Tab label="Claims" icon={<ClaimIcon />} iconPosition="start" />
            </Tabs>
          </Box>

          <TabPanel value={tabValue} index={0}>
            <Grid container spacing={4}>
              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Policy Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={3}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{ bgcolor: theme.palette.primary.main + "20", color: theme.palette.primary.main, mr: 2 }}
                        >
                          <PaymentsIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Coverage Amount
                          </Typography>
                          <Typography variant="h5" fontWeight={600}>
                            {formatCurrency(policy?.policy.coverageAmount || 0)}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{ bgcolor: theme.palette.primary.main + "20", color: theme.palette.primary.main, mr: 2 }}
                        >
                          <CalendarIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Policy Period
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {formatDate(policy?.policy.startDate || "")} - {formatDate(policy?.policy.endDate || "")}
                          </Typography>
                        </Box>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                            sx={{ bgcolor: theme.palette.primary.main + "20", color: theme.palette.primary.main, mr: 2 }}
                        >
                          {getPolicyIcon(policy?.policy.type || "")}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Policy Type
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {policy?.policy.type} Insurance
                          </Typography>
                        </Box>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={6}>
                <Card variant="outlined" sx={{ height: "100%" }}>
                  <CardContent>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="h6" fontWeight={600}>
                        Client Information
                      </Typography>
                      <Button
                          variant="text"
                          size="small"
                          startIcon={<PersonIcon />}
                          component={Link}
                          to={`/customers/${policy?.customer.id}`}
                      >
                        View Profile
                      </Button>
                    </Box>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                      <Avatar
                          sx={{
                            bgcolor: theme.palette.grey[200],
                            width: 64,
                            height: 64,
                            mr: 2,
                            fontSize: "1.5rem",
                          }}
                      >
                        {policy?.customer.firstName.charAt(0)}
                        {policy?.customer.lastName.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" fontWeight={600}>
                          {policy?.customer.firstName} {policy?.customer.lastName}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Client ID: {policy?.customer.id}
                        </Typography>
                      </Box>
                    </Box>

                    <Stack spacing={2}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ minWidth: 30 }}>
                          <EmailIcon color="action" fontSize="small" />
                        </Box>
                        <Typography variant="body2">{policy?.customer.email}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ minWidth: 30 }}>
                          <PhoneIcon color="action" fontSize="small" />
                        </Box>
                        <Typography variant="body2">{policy?.customer.phone}</Typography>
                      </Box>

                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Box sx={{ minWidth: 30 }}>
                          <HomeIcon color="action" fontSize="small" />
                        </Box>
                        <Typography variant="body2">{policy?.customer.address}</Typography>
                      </Box>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Typography variant="h6" fontWeight={600}>
                Policy Claims
              </Typography>
              <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={Link}
                  to={`/claims/new?policyId=${id}`}
                  sx={{ borderRadius: "8px", py: 1.2 }}
              >
                File New Claim
              </Button>
            </Box>

            {claims.length > 0 ? (
                <Grid container spacing={3}>
                  {claims.map((claim) => (
                      <Grid item xs={12} sm={6} md={4} key={claim.id}>
                        <Card
                            sx={{
                              height: "100%",
                              transition: "transform 0.2s, box-shadow 0.2s",
                              "&:hover": {
                                transform: "translateY(-4px)",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                              },
                              borderLeft: `4px solid ${
                                  claim.status === ClaimStatus.PENDING
                                      ? theme.palette.warning.main
                                      : claim.status === ClaimStatus.APPROVED
                                          ? theme.palette.success.main
                                          : claim.status === ClaimStatus.REJECTED
                                              ? theme.palette.error.main
                                              : theme.palette.info.main
                              }`,
                            }}
                            component={Link}
                            to={`/claims/view/${claim.id}`}
                            style={{ textDecoration: "none" }}
                        >
                          <CardContent>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                              <Typography variant="subtitle2" fontWeight={600}>
                                Claim #{claim.id}
                              </Typography>
                              <Chip
                                  label={claim.status}
                                  color={
                                    getStatusColor(claim.status) as
                                        | "default"
                                        | "primary"
                                        | "secondary"
                                        | "error"
                                        | "info"
                                        | "success"
                                        | "warning"
                                  }
                                  size="small"
                                  sx={{ fontWeight: 500 }}
                              />
                            </Box>

                            <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                              {formatCurrency(claim.claimedAmount)}
                            </Typography>

                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                              Filed on: {formatDate(claim.date)}
                            </Typography>

                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                  mb: 2,
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                }}
                            >
                              {claim.description}
                            </Typography>

                            {claim.settledAmount && (
                                <Box
                                    sx={{
                                      p: 1,
                                      bgcolor: theme.palette.info.light + "20",
                                      borderRadius: 1,
                                      display: "flex",
                                      justifyContent: "space-between",
                                      alignItems: "center",
                                    }}
                                >
                                  <Typography variant="caption" color="text.secondary">
                                    Settled Amount:
                                  </Typography>
                                  <Typography variant="subtitle2" fontWeight={600} color={theme.palette.info.dark}>
                                    {formatCurrency(claim.settledAmount)}
                                  </Typography>
                                </Box>
                            )}
                          </CardContent>
                        </Card>
                      </Grid>
                  ))}
                </Grid>
            ) : (
                <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
                  <Box sx={{ mb: 2 }}>
                    <img src="/placeholder.svg?height=100&width=100" alt="No claims" style={{ opacity: 0.5 }} />
                  </Box>
                  <Typography variant="h6" gutterBottom>
                    No claims filed for this policy
                  </Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    When you need to file a claim for this policy, you can do it here.
                  </Typography>
                  <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      component={Link}
                      to={`/claims/new?policyId=${id}`}
                      sx={{ mt: 1, borderRadius: "8px", py: 1.2 }}
                  >
                    File New Claim
                  </Button>
                </Card>
            )}
          </TabPanel>
        </Card>
      </Box>
  )
}

export default PolicyDetail

