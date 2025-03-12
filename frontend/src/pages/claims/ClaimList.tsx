"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  Box,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
  Chip,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Card,
  CardContent,
  Avatar,
  useTheme,
  Grid,
  TablePagination,
  Breadcrumbs,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  ReportProblem as ReportIcon,
} from "@mui/icons-material"
import claimService from "../../services/claimService"
import policyService from "../../services/policyService"
import { type Claim, ClaimStatus } from "../../types/Claim"
import type { PolicyWithCustomer } from "../../types/Policy"
import type { SelectChangeEvent } from "@mui/material/Select"

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

interface ClaimWithPolicy extends Claim {
  policyType?: string
  customerName?: string
}

const ClaimList: React.FC = () => {
  const [claims, setClaims] = useState<ClaimWithPolicy[]>([])
  const [filteredClaims, setFilteredClaims] = useState<ClaimWithPolicy[]>([])
  const [policies, setPolicies] = useState<PolicyWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [claimToDelete, setClaimToDelete] = useState<Claim | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    filterClaims()
  }, [searchTerm, statusFilter, claims])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError("")

      const [claimsData, policiesData] = await Promise.all([
        claimService.getAllClaims(),
        policyService.getAllPoliciesWithCustomers(),
      ])

      setPolicies(policiesData)

      // Enrich claims with policy and customer data
      const enrichedClaims = claimsData.map((claim) => {
        const relatedPolicy = policiesData.find((p) => p.policy.id === claim.policyId)
        return {
          ...claim,
          policyType: relatedPolicy?.policy.type,
          customerName: relatedPolicy
            ? `${relatedPolicy.customer.firstName} ${relatedPolicy.customer.lastName}`
            : undefined,
        }
      })

      setClaims(enrichedClaims)
      setFilteredClaims(enrichedClaims)
    } catch (err) {
      console.error("Error fetching data:", err)
      setError("Failed to load claims data. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const filterClaims = () => {
    let filtered = [...claims]

    // Filter by status
    if (statusFilter !== "ALL") {
      filtered = filtered.filter((claim) => claim.status === statusFilter)
    }

    // Filter by search term
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase().trim()
      filtered = filtered.filter(
        (claim) =>
          claim.id?.toString().includes(term) ||
          claim.description.toLowerCase().includes(term) ||
          (claim.customerName && claim.customerName.toLowerCase().includes(term)) ||
          (claim.policyType && claim.policyType.toLowerCase().includes(term)),
      )
    }

    setFilteredClaims(filtered)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const handleClearSearch = () => {
    setSearchTerm("")
    setPage(0)
  }

  const handleStatusFilterChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value)
    setPage(0)
  }

  const handleDeleteClick = (claim: Claim) => {
    setClaimToDelete(claim)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!claimToDelete || !claimToDelete.id) return

    try {
      await claimService.deleteClaim(claimToDelete.id)
      setClaims((prevClaims) => prevClaims.filter((c) => c.id !== claimToDelete.id))
      setDeleteDialogOpen(false)
      setClaimToDelete(null)
    } catch (err) {
      console.error("Error deleting claim:", err)
      setError("Failed to delete claim. Please try again.")
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setClaimToDelete(null)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
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
    <Box>
      <Breadcrumbs sx={{ mb: 3 }}>
        <Link to="/dashboard" style={{ textDecoration: "none", color: theme.palette.text.secondary }}>
          Dashboard
        </Link>
        <Typography color="text.primary">Claims</Typography>
      </Breadcrumbs>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Claims Management
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage and process insurance claims
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/claims/new")}
          sx={{ px: 3, py: 1.2 }}
        >
          File New Claim
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search claims by client name or description..."
                value={searchTerm}
                onChange={handleSearchChange}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: searchTerm && (
                    <InputAdornment position="end">
                      <IconButton onClick={handleClearSearch} edge="end" size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={handleStatusFilterChange}
                >
                  <MenuItem value="ALL">All Statuses</MenuItem>
                  <MenuItem value={ClaimStatus.PENDING}>Pending</MenuItem>
                  <MenuItem value={ClaimStatus.APPROVED}>Approved</MenuItem>
                  <MenuItem value={ClaimStatus.REJECTED}>Rejected</MenuItem>
                  <MenuItem value={ClaimStatus.SETTLED}>Settled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={3}>
              <Button variant="outlined" startIcon={<FilterListIcon />} fullWidth>
                More Filters
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {filteredClaims.length > 0 ? (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Claim ID</TableCell>
                  <TableCell>Date Filed</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Policy Type</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredClaims.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((claim) => (
                  <TableRow key={claim.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.warning.main + "20",
                            color: theme.palette.warning.main,
                            mr: 2,
                            width: 36,
                            height: 36,
                          }}
                        >
                          <ReportIcon fontSize="small" />
                        </Avatar>
                        <Typography variant="body2" fontWeight={500}>
                          #{claim.id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{formatDate(claim.date)}</TableCell>
                    <TableCell>{claim.customerName || "Unknown"}</TableCell>
                    <TableCell>
                      {claim.policyType && (
                        <Chip
                          label={claim.policyType}
                          size="small"
                          color={
                            claim.policyType === "AUTO"
                              ? "primary"
                              : claim.policyType === "HOME"
                                ? "secondary"
                                : "success"
                          }
                          sx={{ fontWeight: 500 }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box>
                        <Typography variant="body2" fontWeight={600}>
                          {formatCurrency(claim.claimedAmount)}
                        </Typography>
                        {claim.settledAmount && (
                          <Typography variant="caption" color="text.secondary">
                            Settled: {formatCurrency(claim.settledAmount)}
                          </Typography>
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/claims/view/${claim.id}`)}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary.main + "10" }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="secondary"
                            onClick={() => navigate(`/claims/edit/${claim.id}`)}
                            size="small"
                            sx={{ bgcolor: theme.palette.secondary.main + "10" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(claim)}
                            size="small"
                            sx={{ bgcolor: theme.palette.error.main + "10" }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredClaims.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </Card>
      ) : (
        <Card sx={{ p: 4, textAlign: "center" }}>
          <Box sx={{ mb: 2 }}>
            <img src="/placeholder.svg?height=120&width=120" alt="No claims" style={{ opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" gutterBottom>
            {searchTerm || statusFilter !== "ALL" ? "No claims match your search criteria" : "No claims found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || statusFilter !== "ALL"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by filing your first claim."}
          </Typography>
          {!searchTerm && statusFilter === "ALL" && (
            <Button variant="contained" startIcon={<AddIcon />} onClick={() => navigate("/claims/new")} sx={{ mt: 2 }}>
              File New Claim
            </Button>
          )}
        </Card>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: { borderRadius: 2 },
        }}
      >
        <DialogTitle sx={{ pb: 1, fontWeight: 600 }}>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete claim #{claimToDelete?.id}? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleDeleteCancel} variant="outlined">
            Cancel
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ClaimList

