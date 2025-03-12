"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
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
  Card,
  CardContent,
  Avatar,
  useTheme,
  TablePagination,
  MenuItem,
  Select,
  SelectChangeEvent,
  FormControl,
  InputLabel,
  Grid,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Description as DescriptionIcon,
} from "@mui/icons-material"
import policyService from "../../services/policyService"
import type { PolicyWithCustomer } from "../../types/Policy"

const PolicyList: React.FC = () => {
  const [policies, setPolicies] = useState<PolicyWithCustomer[]>([])
  const [filteredPolicies, setFilteredPolicies] = useState<PolicyWithCustomer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState("ALL")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [policyToDelete, setPolicyToDelete] = useState<PolicyWithCustomer | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    fetchPolicies()
  }, [])

  useEffect(() => {
    filterPolicies()
  }, [searchTerm, typeFilter, policies])

  const fetchPolicies = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await policyService.getAllPoliciesWithCustomers()
      setPolicies(data)
      setFilteredPolicies(data)
    } catch (err) {
      console.error("Error fetching policies:", err)
      setError("Failed to load policies. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const filterPolicies = () => {
    let filtered = [...policies]

    // Filter by type
    if (typeFilter !== "ALL") {
      filtered = filtered.filter((policy) => policy.policy.type === typeFilter)
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (policy) =>
          policy.customer.firstName.toLowerCase().includes(term) ||
          policy.customer.lastName.toLowerCase().includes(term) ||
          policy.policy.type.toLowerCase().includes(term) ||
          policy.policy.id?.toString().includes(term),
      )
    }

    setFilteredPolicies(filtered)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setPage(0)
  }

  const handleTypeFilterChange = (event: SelectChangeEvent) => {
    setTypeFilter(event.target.value)
    setPage(0)
  }

  const handleDeleteClick = (policy: PolicyWithCustomer) => {
    setPolicyToDelete(policy)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!policyToDelete?.policy.id) return

    try {
      await policyService.deletePolicy(policyToDelete.policy.id)
      setPolicies(policies.filter((p) => p.policy.id !== policyToDelete.policy.id))
      setDeleteDialogOpen(false)
      setPolicyToDelete(null)
    } catch (err) {
      console.error("Error deleting policy:", err)
      setError("Failed to delete policy. Please try again.")
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setPolicyToDelete(null)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
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

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Policies
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage insurance policies
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/policies/new" sx={{ px: 3, py: 1.2 }}>
          Add Policy
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
                placeholder="Search policies by client name or policy ID..."
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
                      <IconButton onClick={clearSearch} edge="end" size="small">
                        <ClearIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth size="small">
                <InputLabel id="type-filter-label">Policy Type</InputLabel>
                <Select
                  labelId="type-filter-label"
                  id="type-filter"
                  value={typeFilter}
                  label="Policy Type"
                  onChange={handleTypeFilterChange}
                >
                  <MenuItem value="ALL">All Types</MenuItem>
                  <MenuItem value="AUTO">Auto</MenuItem>
                  <MenuItem value="HOME">Home</MenuItem>
                  <MenuItem value="HEALTH">Health</MenuItem>
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

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : filteredPolicies.length > 0 ? (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Policy ID</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Client</TableCell>
                  <TableCell>Coverage Amount</TableCell>
                  <TableCell>Valid Period</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredPolicies
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((policyWithCustomer) => {
                    const { policy, customer } = policyWithCustomer
                    return (
                      <TableRow key={policy.id} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor:
                                  policy.type === "AUTO"
                                    ? theme.palette.primary.main
                                    : policy.type === "HOME"
                                      ? theme.palette.secondary.main
                                      : theme.palette.success.main,
                                color: "white",
                                mr: 2,
                                width: 36,
                                height: 36,
                              }}
                            >
                              <DescriptionIcon fontSize="small" />
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              #{policy.id}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={policy.type}
                            color={
                              policy.type === "AUTO" ? "primary" : policy.type === "HOME" ? "secondary" : "success"
                            }
                            size="small"
                            sx={{ fontWeight: 500 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar
                              sx={{
                                bgcolor: theme.palette.grey[200],
                                color: theme.palette.text.primary,
                                mr: 2,
                                width: 32,
                                height: 32,
                                fontSize: "0.8rem",
                              }}
                            >
                              {customer.firstName.charAt(0)}
                              {customer.lastName.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={500}>
                              {`${customer.firstName} ${customer.lastName}`}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight={600}>
                            {formatCurrency(policy.coverageAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(policy.startDate)} - {formatDate(policy.endDate)}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                            <Tooltip title="View Details">
                              <IconButton
                                color="primary"
                                onClick={() => navigate(`/policies/${policy.id}`)}
                                size="small"
                                sx={{ bgcolor: theme.palette.primary.main + "10" }}
                              >
                                <ViewIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                color="secondary"
                                onClick={() => navigate(`/policies/edit/${policy.id}`)}
                                size="small"
                                sx={{ bgcolor: theme.palette.secondary.main + "10" }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                color="error"
                                onClick={() => handleDeleteClick(policyWithCustomer)}
                                size="small"
                                sx={{ bgcolor: theme.palette.error.main + "10" }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    )
                  })}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredPolicies.length}
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
            <img src="/placeholder.svg?height=120&width=120" alt="No policies" style={{ opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" gutterBottom>
            {searchTerm || typeFilter !== "ALL" ? "No policies match your search criteria" : "No policies found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm || typeFilter !== "ALL"
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by adding your first policy to the system."}
          </Typography>
          {!searchTerm && typeFilter === "ALL" && (
            <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/policies/new" sx={{ mt: 2 }}>
              Add Policy
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
            Are you sure you want to delete this {policyToDelete?.policy.type} policy for{" "}
            {policyToDelete?.customer.firstName} {policyToDelete?.customer.lastName}? This action cannot be undone.
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

export default PolicyList

