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
  Card,
  CardContent,
  Chip,
  Avatar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
  Breadcrumbs,
  Stack,
  TextField,
} from "@mui/material"
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  CancelOutlined as RejectIcon,
  Payments as PaymentsIcon,
  Description as DescriptionIcon,
  EventNote as CalendarIcon,
  Person as PersonIcon,
  Assignment as ClaimIcon,
  DirectionsCar as CarIcon,
  HomeWork as HomeIcon,
  HealthAndSafety as HealthIcon,
  Info as InfoIcon,
} from "@mui/icons-material"
import claimService from "../../services/claimService"
import policyService from "../../services/policyService"
import { type Claim, ClaimStatus } from "../../types/Claim"
import type { PolicyWithCustomer } from "../../types/Policy"

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

const ClaimDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const theme = useTheme()

  const [claim, setClaim] = useState<Claim | null>(null)
  const [policy, setPolicy] = useState<PolicyWithCustomer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Dialogs state
  const [approveDialogOpen, setApproveDialogOpen] = useState(false)
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [settleDialogOpen, setSettleDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [settledAmount, setSettledAmount] = useState<number>(0)

  useEffect(() => {
    if (id) {
      fetchClaimData()
    }
  }, [id])

  const fetchClaimData = async () => {
    try {
      setLoading(true)
      setError("")

      const claimData = await claimService.getClaimById(Number(id))
      setClaim(claimData)
      setSettledAmount(claimData.claimedAmount)

      if (claimData.policyId) {
        const policyData = await policyService.getPolicyWithCustomer(claimData.policyId)
        setPolicy(policyData)
      }
    } catch (err) {
      console.error("Error fetching claim data:", err)
      setError("Failed to load claim details. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async () => {
    if (!claim?.id) return

    try {
      await claimService.updateClaimStatus(claim.id, ClaimStatus.APPROVED)
      setApproveDialogOpen(false)
      fetchClaimData()
    } catch (err) {
      console.error("Error approving claim:", err)
      setError("Failed to approve claim. Please try again.")
    }
  }

  const handleReject = async () => {
    if (!claim?.id) return

    try {
      await claimService.updateClaimStatus(claim.id, ClaimStatus.REJECTED)
      setRejectDialogOpen(false)
      fetchClaimData()
    } catch (err) {
      console.error("Error rejecting claim:", err)
      setError("Failed to reject claim. Please try again.")
    }
  }

  const handleSettle = async () => {
    if (!claim?.id) return

    try {
      await claimService.updateClaimStatus(claim.id, ClaimStatus.SETTLED, settledAmount)
      setSettleDialogOpen(false)
      fetchClaimData()
    } catch (err) {
      console.error("Error settling claim:", err)
      setError("Failed to settle claim. Please try again.")
    }
  }

  const handleDelete = async () => {
    if (!claim?.id) return

    try {
      await claimService.deleteClaim(claim.id)
      setDeleteDialogOpen(false)
      navigate(`/policies/${claim.policyId}`)
    } catch (err) {
      console.error("Error deleting claim:", err)
      setError("Failed to delete claim. Please try again.")
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

  if (!claim && !loading) {
    return (
        <Alert severity="error" sx={{ mb: 3 }}>
          Claim not found. <Link to="/claims">Return to claims list</Link>
        </Alert>
    )
  }

  return (
      <Box>
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/dashboard" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
            Dashboard
          </Link>
          <Link to="/claims" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
            Claims
          </Link>
          <Typography color="text.primary">Claim Details</Typography>
        </Breadcrumbs>

        <Box sx={{ display: "flex", alignItems: "center", mb: 4, justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 56,
                  height: 56,
                  mr: 2,
                }}
            >
              <ClaimIcon />
            </Avatar>
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Typography variant="h4" component="h1" fontWeight={600}>
                  Claim #{claim?.id}
                </Typography>
                <Chip
                    label={claim?.status}
                    color={getStatusColor(claim?.status as ClaimStatus)}
                    size="small"
                    sx={{ fontWeight: 500 }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary">
                Filed on: {claim?.date && formatDate(claim.date)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/claims/edit/${id}`)}
                sx={{ borderRadius: "8px" }}
            >
              Edit
            </Button>
            <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={() => setDeleteDialogOpen(true)}
                sx={{ borderRadius: "8px" }}
            >
              Delete
            </Button>
          </Box>
        </Box>

        {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" fontWeight={600} gutterBottom>
                  Claim Information
                </Typography>
                <Divider sx={{ mb: 3 }} />

                <Stack spacing={3}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main + "20", color: theme.palette.primary.main, mr: 2 }}>
                      <PaymentsIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Claimed Amount
                      </Typography>
                      <Typography variant="h5" fontWeight={600}>
                        {formatCurrency(claim?.claimedAmount || 0)}
                      </Typography>
                    </Box>
                  </Box>

                  {claim?.settledAmount && (
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar sx={{ bgcolor: theme.palette.info.main + "20", color: theme.palette.info.main, mr: 2 }}>
                          <PaymentsIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Settled Amount
                          </Typography>
                          <Typography variant="h5" fontWeight={600}>
                            {formatCurrency(claim.settledAmount)}
                          </Typography>
                        </Box>
                      </Box>
                  )}

                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main + "20", color: theme.palette.primary.main, mr: 2 }}>
                      <CalendarIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        Date Filed
                      </Typography>
                      <Typography variant="body1" fontWeight={500}>
                        {claim?.date && formatDate(claim.date)}
                      </Typography>
                    </Box>
                  </Box>

                  <Box sx={{ display: "flex", alignItems: "flex-start" }}>
                    <Avatar
                        sx={{
                          bgcolor: theme.palette.primary.main + "20",
                          color: theme.palette.primary.main,
                          mr: 2,
                          mt: 0.5,
                        }}
                    >
                      <DescriptionIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Description
                      </Typography>
                      <Card variant="outlined" sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
                        <Typography variant="body1">{claim?.description}</Typography>
                      </Card>
                    </Box>
                  </Box>
                </Stack>
              </CardContent>
            </Card>

            {claim?.status === ClaimStatus.PENDING && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Claim Actions
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="success"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => setApproveDialogOpen(true)}
                            fullWidth
                            size="large"
                            sx={{ borderRadius: "8px", py: 1.2 }}
                        >
                          Approve Claim
                        </Button>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<RejectIcon />}
                            onClick={() => setRejectDialogOpen(true)}
                            fullWidth
                            size="large"
                            sx={{ borderRadius: "8px", py: 1.2 }}
                        >
                          Reject Claim
                        </Button>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
            )}

            {claim?.status === ClaimStatus.APPROVED && (
                <Card>
                  <CardContent>
                    <Typography variant="h6" fontWeight={600} gutterBottom>
                      Claim Actions
                    </Typography>
                    <Divider sx={{ mb: 3 }} />
                    <Button
                        variant="contained"
                        color="info"
                        startIcon={<PaymentsIcon />}
                        onClick={() => {
                          setSettledAmount(claim.claimedAmount)
                          setSettleDialogOpen(true)
                        }}
                        fullWidth
                        size="large"
                        sx={{ borderRadius: "8px", py: 1.2 }}
                    >
                      Settle Claim
                    </Button>
                  </CardContent>
                </Card>
            )}
          </Grid>

          <Grid item xs={12} md={5}>
            <Card>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                  <Typography variant="h6" fontWeight={600}>
                    Related Policy
                  </Typography>
                  <Button
                      variant="text"
                      size="small"
                      startIcon={<InfoIcon />}
                      component={Link}
                      to={`/policies/${policy?.policy.id}`}
                  >
                    View Policy
                  </Button>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                  <Avatar
                      sx={{
                        bgcolor:
                            policy?.policy.type === "AUTO"
                                ? theme.palette.primary.main
                                : policy?.policy.type === "HOME"
                                    ? theme.palette.secondary.main
                                    : theme.palette.success.main,
                        width: 48,
                        height: 48,
                        mr: 2,
                      }}
                  >
                    {getPolicyIcon(policy?.policy.type || "")}
                  </Avatar>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        {policy?.policy.type} Policy
                      </Typography>
                      <Chip
                          label={policy?.policy.type}
                          color={
                            policy?.policy.type === "AUTO"
                                ? "primary"
                                : policy?.policy.type === "HOME"
                                    ? "secondary"
                                    : "success"
                          }
                          size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Policy ID: {policy?.policy.id}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Coverage Amount
                  </Typography>
                  <Typography variant="h6" fontWeight={600}>
                    {formatCurrency(policy?.policy.coverageAmount || 0)}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Policy Period
                  </Typography>
                  <Typography variant="body1">
                    {policy?.policy.startDate && formatDate(policy.policy.startDate)} -{" "}
                    {policy?.policy.endDate && formatDate(policy.policy.endDate)}
                  </Typography>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Avatar
                      sx={{
                        bgcolor: theme.palette.grey[200],
                        width: 48,
                        height: 48,
                        mr: 2,
                        fontSize: "1rem",
                      }}
                  >
                    {policy?.customer.firstName.charAt(0)}
                    {policy?.customer.lastName.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={600}>
                      {policy?.customer.firstName} {policy?.customer.lastName}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      <Link
                          to={`/customers/${policy?.customer.id}`}
                          style={{
                            color: theme.palette.primary.main,
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                          }}
                      >
                        <PersonIcon fontSize="small" />
                        View Client Profile
                      </Link>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Approve Dialog */}
        <Dialog
            open={approveDialogOpen}
            onClose={() => setApproveDialogOpen(false)}
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Approve Claim</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to approve this claim for {formatCurrency(claim?.claimedAmount || 0)}?
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setApproveDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleApprove} color="success" variant="contained" autoFocus>
              Approve
            </Button>
          </DialogActions>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog
            open={rejectDialogOpen}
            onClose={() => setRejectDialogOpen(false)}
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Reject Claim</DialogTitle>
          <DialogContent>
            <DialogContentText>Are you sure you want to reject this claim?</DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setRejectDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleReject} color="error" variant="contained" autoFocus>
              Reject
            </Button>
          </DialogActions>
        </Dialog>

        {/* Settle Dialog */}
        <Dialog
            open={settleDialogOpen}
            onClose={() => setSettleDialogOpen(false)}
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Settle Claim</DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 3 }}>Please enter the final settlement amount for this claim.</DialogContentText>
            <TextField
                label="Settlement Amount"
                type="number"
                value={settledAmount}
                onChange={(e) => setSettledAmount(Number(e.target.value))}
                fullWidth
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                }}
                inputProps={{
                  min: 0,
                  max: claim?.claimedAmount,
                  step: 100,
                }}
            />
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
              Maximum amount: {formatCurrency(claim?.claimedAmount || 0)}
            </Typography>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setSettleDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button
                onClick={handleSettle}
                color="info"
                variant="contained"
                autoFocus
                disabled={settledAmount <= 0 || (claim?.claimedAmount ? settledAmount > claim.claimedAmount : false)}
            >
              Settle
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Dialog */}
        <Dialog
            open={deleteDialogOpen}
            onClose={() => setDeleteDialogOpen(false)}
            PaperProps={{ sx: { borderRadius: 2 } }}
        >
          <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Delete Claim</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete this claim? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3 }}>
            <Button onClick={() => setDeleteDialogOpen(false)} variant="outlined">
              Cancel
            </Button>
            <Button onClick={handleDelete} color="error" variant="contained" autoFocus>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
  )
}

export default ClaimDetail

