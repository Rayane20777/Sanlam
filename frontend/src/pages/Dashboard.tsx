"use client"

import type React from "react"
import { useState, useEffect } from "react"
import {
  Grid,
  Typography,
  Box,
  Card,
  CardContent,
  CardHeader,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Chip,
  Avatar,
  IconButton,
  Button,
  useTheme,
} from "@mui/material"
// Update the dashboard icons with more distinctive ones
import {
  PeopleAlt as PeopleIcon,
  Policy as PolicyIcon,
  AssignmentLate as ClaimsIcon,
  TrendingUp as TrendingUpIcon,
  MoreVert as MoreVertIcon,
  ArrowUpward as ArrowUpwardIcon,
  ArrowForward as ArrowForwardIcon,
  BarChart as BarChartIcon,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"
import customerService from "../services/customerService"
import policyService from "../services/policyService"
import claimService from "../services/claimService"
import type { Customer } from "../types/Customer"
import type { Policy } from "../types/Policy"
import type { Claim } from "../types/Claim"
import { Link } from "react-router-dom"

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const theme = useTheme()
  const [loading, setLoading] = useState(true)
  const [customerCount, setCustomerCount] = useState(0)
  const [policyCount, setPolicyCount] = useState(0)
  const [claimCount, setClaimCount] = useState(0)
  const [recentCustomers, setRecentCustomers] = useState<Customer[]>([])
  const [recentPolicies, setRecentPolicies] = useState<Policy[]>([])
  const [recentClaims, setRecentClaims] = useState<Claim[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)

        // Fetch customers
        const customers = await customerService.getAllCustomers()
        setCustomerCount(customers.length)
        setRecentCustomers(customers.slice(0, 5))

        // Fetch policies
        const policies = await policyService.getAllPolicies()
        setPolicyCount(policies.length)
        setRecentPolicies(policies.slice(0, 5))

        // Fetch claims
        const claims = await claimService.getAllClaims()
        setClaimCount(claims.length)
        setRecentClaims(claims.slice(0, 5))
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  if (loading) {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
    )
  }

  return (
      <Box>
        <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography variant="h4" fontWeight={600} color="text.primary">
              Welcome back, {user?.username}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
              Here's what's happening with your insurance portfolio today.
            </Typography>
          </Box>
          {/* Update the "Generate Report" button */}
          <Button
              variant="contained"
              color="primary"
              startIcon={<BarChartIcon />}
              sx={{
                px: 3,
                py: 1.2,
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
              }}
          >
            Generate Report
          </Button>
        </Box>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          {/* Update the summary cards with more distinctive styling */}
          <Grid item xs={12} sm={6} md={3}>
            <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                  transition: "transform 0.2s, box-shadow 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                  },
                }}
            >
              <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 100,
                    height: 100,
                    background: `linear-gradient(45deg, transparent 50%, ${theme.palette.primary.light}30 50%)`,
                  }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                      sx={{
                        bgcolor: theme.palette.primary.main,
                        backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
                        width: 48,
                        height: 48,
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                      }}
                  >
                    <PeopleIcon />
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Total Clients
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="text.primary">
                      {customerCount}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Chip
                      icon={<ArrowUpwardIcon fontSize="small" />}
                      label="12% increase"
                      size="small"
                      sx={{
                        bgcolor: theme.palette.success.light + "30",
                        color: theme.palette.success.main,
                        fontWeight: 500,
                        borderRadius: "6px",
                      }}
                  />
                  <Button
                      component={Link}
                      to="/customers"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 500, fontSize: "0.8rem" }}
                  >
                    View All
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
              <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    background: `linear-gradient(45deg, transparent 50%, ${theme.palette.secondary.light}40 50%)`,
                  }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.secondary.main, width: 48, height: 48 }}>
                    <PolicyIcon />
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Active Policies
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="text.primary">
                      {policyCount}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Chip
                      icon={<ArrowUpwardIcon fontSize="small" />}
                      label="8% increase"
                      size="small"
                      sx={{
                        bgcolor: theme.palette.success.light + "30",
                        color: theme.palette.success.main,
                        fontWeight: 500,
                      }}
                  />
                  <Button
                      component={Link}
                      to="/policies"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 500, fontSize: "0.8rem" }}
                  >
                    View All
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ height: "100%", position: "relative", overflow: "hidden" }}>
              <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    background: `linear-gradient(45deg, transparent 50%, ${theme.palette.warning.light}40 50%)`,
                  }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.warning.main, width: 48, height: 48 }}>
                    <ClaimsIcon />
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                      Open Claims
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="text.primary">
                      {claimCount}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Chip
                      label="4 pending review"
                      size="small"
                      sx={{
                        bgcolor: theme.palette.warning.light + "30",
                        color: theme.palette.warning.dark,
                        fontWeight: 500,
                      }}
                  />
                  <Button
                      component={Link}
                      to="/claims"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 500, fontSize: "0.8rem" }}
                  >
                    View All
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Card
                sx={{
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  bgcolor: theme.palette.primary.main,
                  color: "white",
                }}
            >
              <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: 80,
                    height: 80,
                    background: `linear-gradient(45deg, transparent 50%, ${theme.palette.primary.dark}90 50%)`,
                  }}
              />
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar sx={{ bgcolor: "rgba(255,255,255,0.2)", width: 48, height: 48 }}>
                    <TrendingUpIcon />
                  </Avatar>
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="body2" color="rgba(255,255,255,0.8)" fontWeight={500}>
                      Premium Revenue
                    </Typography>
                    <Typography variant="h4" fontWeight={600} color="white">
                      $1.2M
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Chip
                      icon={<ArrowUpwardIcon fontSize="small" />}
                      label="15% increase"
                      size="small"
                      sx={{
                        bgcolor: "rgba(255,255,255,0.2)",
                        color: "white",
                        fontWeight: 500,
                      }}
                  />
                  <Button
                      variant="text"
                      endIcon={<ArrowForwardIcon />}
                      sx={{ fontWeight: 500, fontSize: "0.8rem", color: "white" }}
                  >
                    Details
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Items Lists */}
          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                  title="Recent Clients"
                  action={
                    <IconButton component={Link} to="/customers">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.1rem" },
                  }}
              />
              <CardContent sx={{ p: 0 }}>
                {recentCustomers.length > 0 ? (
                    <List>
                      {recentCustomers.map((customer) => (
                          <ListItem
                              key={customer.id}
                              component={Link}
                              to={`/customers/${customer.id}`}
                              sx={{
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                textDecoration: "none",
                                color: "inherit",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                              }}
                          >
                            <Avatar
                                sx={{
                                  bgcolor: theme.palette.primary.light,
                                  color: "white",
                                  mr: 2,
                                  fontSize: "1rem",
                                }}
                            >
                              {customer.firstName.charAt(0)}
                              {customer.lastName.charAt(0)}
                            </Avatar>
                            <ListItemText
                                primary={`${customer.firstName} ${customer.lastName}`}
                                secondary={customer.email}
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                          </ListItem>
                      ))}
                    </List>
                ) : (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        No clients found
                      </Typography>
                    </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card sx={{ height: "100%" }}>
              <CardHeader
                  title="Recent Claims"
                  action={
                    <IconButton component={Link} to="/claims">
                      <MoreVertIcon />
                    </IconButton>
                  }
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.1rem" },
                  }}
              />
              <CardContent sx={{ p: 0 }}>
                {recentClaims.length > 0 ? (
                    <List>
                      {recentClaims.map((claim) => (
                          <ListItem
                              key={claim.id}
                              component={Link}
                              to={`/claims/view/${claim.id}`}
                              sx={{
                                borderBottom: `1px solid ${theme.palette.divider}`,
                                textDecoration: "none",
                                color: "inherit",
                                "&:hover": { bgcolor: "rgba(0,0,0,0.02)" },
                              }}
                          >
                            <Avatar
                                sx={{
                                  bgcolor:
                                      claim.status === "PENDING"
                                          ? theme.palette.warning.main
                                          : claim.status === "APPROVED"
                                              ? theme.palette.success.main
                                              : claim.status === "REJECTED"
                                                  ? theme.palette.error.main
                                                  : theme.palette.info.main,
                                  color: "white",
                                  mr: 2,
                                  fontSize: "1rem",
                                }}
                            >
                              {claim.id}
                            </Avatar>
                            <ListItemText
                                primary={`Claim #${claim.id}`}
                                secondary={`${claim.status} | $${claim.claimedAmount}`}
                                primaryTypographyProps={{ fontWeight: 500 }}
                            />
                            <Chip
                                label={claim.status}
                                size="small"
                                sx={{
                                  bgcolor:
                                      claim.status === "PENDING"
                                          ? theme.palette.warning.light + "30"
                                          : claim.status === "APPROVED"
                                              ? theme.palette.success.light + "30"
                                              : claim.status === "REJECTED"
                                                  ? theme.palette.error.light + "30"
                                                  : theme.palette.info.light + "30",
                                  color:
                                      claim.status === "PENDING"
                                          ? theme.palette.warning.dark
                                          : claim.status === "APPROVED"
                                              ? theme.palette.success.dark
                                              : claim.status === "REJECTED"
                                                  ? theme.palette.error.dark
                                                  : theme.palette.info.dark,
                                  fontWeight: 500,
                                }}
                            />
                          </ListItem>
                      ))}
                    </List>
                ) : (
                    <Box sx={{ p: 3, textAlign: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        No claims found
                      </Typography>
                    </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Recent Policies */}
          <Grid item xs={12}>
            <Card>
              <CardHeader
                  title="Recent Policies"
                  action={
                    <Button component={Link} to="/policies" endIcon={<ArrowForwardIcon />} sx={{ fontWeight: 500 }}>
                      View All
                    </Button>
                  }
                  sx={{
                    borderBottom: `1px solid ${theme.palette.divider}`,
                    "& .MuiCardHeader-title": { fontWeight: 600, fontSize: "1.1rem" },
                  }}
              />
              <CardContent>
                <Grid container spacing={2}>
                  {recentPolicies.length > 0 ? (
                      recentPolicies.map((policy) => (
                          <Grid item xs={12} sm={6} md={4} key={policy.id}>
                            <Card variant="outlined" sx={{ height: "100%" }}>
                              <CardContent>
                                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                                  <Chip
                                      label={policy.type}
                                      size="small"
                                      sx={{
                                        bgcolor:
                                            policy.type === "AUTO"
                                                ? theme.palette.primary.light + "20"
                                                : policy.type === "HOME"
                                                    ? theme.palette.secondary.light + "20"
                                                    : theme.palette.success.light + "20",
                                        color:
                                            policy.type === "AUTO"
                                                ? theme.palette.primary.main
                                                : policy.type === "HOME"
                                                    ? theme.palette.secondary.main
                                                    : theme.palette.success.main,
                                        fontWeight: 500,
                                      }}
                                  />
                                  <Typography variant="subtitle2" color="text.secondary">
                                    Policy #{policy.id}
                                  </Typography>
                                </Box>
                                <Typography variant="h6" sx={{ mb: 1, fontWeight: 600 }}>
                                  ${policy.coverageAmount.toLocaleString()}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                  Valid: {new Date(policy.startDate).toLocaleDateString()} -{" "}
                                  {new Date(policy.endDate).toLocaleDateString()}
                                </Typography>
                                <Button
                                    component={Link}
                                    to={`/policies/${policy.id}`}
                                    variant="outlined"
                                    color={
                                      policy.type === "AUTO" ? "primary" : policy.type === "HOME" ? "secondary" : "success"
                                    }
                                    fullWidth
                                    size="small"
                                >
                                  View Details
                                </Button>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))
                  ) : (
                      <Grid item xs={12}>
                        <Box sx={{ p: 3, textAlign: "center" }}>
                          <Typography variant="body2" color="text.secondary">
                            No policies found
                          </Typography>
                        </Box>
                      </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
  )
}

export default Dashboard

