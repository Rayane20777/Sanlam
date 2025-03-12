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
} from "@mui/material"
import {
  Edit as EditIcon,
  Description as DescriptionIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Home as HomeIcon,
  Person as PersonIcon,
  Add as AddIcon,
} from "@mui/icons-material"
import customerService from "../../services/customerService"
import policyService from "../../services/policyService"
import type { Customer } from "../../types/Customer"
import type { Policy } from "../../types/Policy"

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
      id={`customer-tabpanel-${index}`}
      aria-labelledby={`customer-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

const CustomerDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [policies, setPolicies] = useState<Policy[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [tabValue, setTabValue] = useState(0)

  useEffect(() => {
    if (id) {
      fetchCustomerData()
    }
  }, [id])

  const fetchCustomerData = async () => {
    try {
      setLoading(true)
      setError("")

      const customerData = await customerService.getCustomerById(Number(id))
      setCustomer(customerData)

      const policiesData = await policyService.getPoliciesByCustomerId(Number(id))
      setPolicies(policiesData)
    } catch (err) {
      console.error("Error fetching customer data:", err)
      setError("Failed to load customer details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
        <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
      </Box>
    )
  }

  if (!customer && !loading) {
    return (
      <Alert severity="error" sx={{ mb: 3 }}>
        Client not found. <Link to="/customers">Return to client list</Link>
      </Alert>
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
        <Typography color="text.primary">Client Details</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", alignItems: "center", mb: 4, justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.primary.main,
              width: 56,
              height: 56,
              mr: 2,
              fontSize: "1.5rem",
            }}
          >
            {customer?.firstName.charAt(0)}
            {customer?.lastName.charAt(0)}
          </Avatar>
          <Box>
            <Typography variant="h4" component="h1" fontWeight={600}>
              {customer?.firstName} {customer?.lastName}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Client ID: {customer?.id}
            </Typography>
          </Box>
        </Box>
        <Button variant="contained" startIcon={<EditIcon />} onClick={() => navigate(`/customers/edit/${id}`)}>
          Edit Client
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
            aria-label="customer tabs"
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
            <Tab label="Profile" icon={<PersonIcon />} iconPosition="start" />
            <Tab label="Policies" icon={<DescriptionIcon />} iconPosition="start" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Personal Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <PersonIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Full Name
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {customer?.firstName} {customer?.lastName}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <EmailIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Email Address
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {customer?.email}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
              <Card variant="outlined" sx={{ height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    Contact Information
                  </Typography>
                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={3}>
                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <PhoneIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Phone Number
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {customer?.phone}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>

                    <Grid item xs={12}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <HomeIcon sx={{ color: theme.palette.primary.main, mr: 2 }} />
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Address
                          </Typography>
                          <Typography variant="body1" fontWeight={500}>
                            {customer?.address}
                          </Typography>
                        </Box>
                      </Box>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Client Policies
            </Typography>
            <Button variant="contained" startIcon={<AddIcon />} component={Link} to={`/policies/new?customerId=${id}`}>
              Add Policy
            </Button>
          </Box>

          {policies.length > 0 ? (
            <Grid container spacing={3}>
              {policies.map((policy) => (
                <Grid item xs={12} sm={6} md={4} key={policy.id}>
                  <Card
                    sx={{
                      height: "100%",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                      },
                    }}
                    component={Link}
                    to={`/policies/${policy.id}`}
                    style={{ textDecoration: "none" }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                        <Chip
                          label={policy.type}
                          color={policy.type === "AUTO" ? "primary" : policy.type === "HOME" ? "secondary" : "success"}
                          size="small"
                          sx={{ fontWeight: 500 }}
                        />
                        <Typography variant="caption" color="text.secondary">
                          Policy #{policy.id}
                        </Typography>
                      </Box>

                      <Typography variant="h5" fontWeight={600} sx={{ mb: 1 }}>
                        ${policy.coverageAmount.toLocaleString()}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Valid: {new Date(policy.startDate).toLocaleDateString()} -{" "}
                        {new Date(policy.endDate).toLocaleDateString()}
                      </Typography>

                      <Button
                        variant="outlined"
                        fullWidth
                        color={policy.type === "AUTO" ? "primary" : policy.type === "HOME" ? "secondary" : "success"}
                        size="small"
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Card variant="outlined" sx={{ p: 4, textAlign: "center" }}>
              <Box sx={{ mb: 2 }}>
                <img src="/placeholder.svg?height=100&width=100" alt="No policies" style={{ opacity: 0.5 }} />
              </Box>
              <Typography variant="h6" gutterBottom>
                No policies found for this client
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Get started by adding a new insurance policy for this client.
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                component={Link}
                to={`/policies/new?customerId=${id}`}
                sx={{ mt: 1 }}
              >
                Add Policy
              </Button>
            </Card>
          )}
        </TabPanel>
      </Card>
    </Box>
  )
}

export default CustomerDetail

