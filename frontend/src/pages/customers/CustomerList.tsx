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
  Card,
  CardContent,
  Avatar,
  useTheme,
  TablePagination,
} from "@mui/material"
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Clear as ClearIcon,
  FilterList as FilterListIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
} from "@mui/icons-material"
import customerService from "../../services/customerService"
import type { Customer } from "../../types/Customer"

const CustomerList: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [searchTerm, setSearchTerm] = useState("")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  const navigate = useNavigate()
  const theme = useTheme()

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    if (searchTerm) {
      const filtered = customers.filter(
        (customer) =>
          customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          customer.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
      setFilteredCustomers(filtered)
    } else {
      setFilteredCustomers(customers)
    }
  }, [searchTerm, customers])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      setError("")
      const data = await customerService.getAllCustomers()
      setCustomers(data)
      setFilteredCustomers(data)
    } catch (err) {
      console.error("Error fetching customers:", err)
      setError("Failed to load customers. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
    setPage(0)
  }

  const clearSearch = () => {
    setSearchTerm("")
    setPage(0)
  }

  const handleDeleteClick = (customer: Customer) => {
    setCustomerToDelete(customer)
    setDeleteDialogOpen(true)
  }

  const handleDeleteConfirm = async () => {
    if (!customerToDelete?.id) return

    try {
      await customerService.deleteCustomer(customerToDelete.id)
      setCustomers(customers.filter((c) => c.id !== customerToDelete.id))
      setDeleteDialogOpen(false)
      setCustomerToDelete(null)
    } catch (err) {
      console.error("Error deleting customer:", err)
      setError("Failed to delete customer. Please try again.")
    }
  }

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false)
    setCustomerToDelete(null)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(Number.parseInt(event.target.value, 10))
    setPage(0)
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Box>
          <Typography variant="h4" component="h1" fontWeight={600}>
            Clients
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mt: 1 }}>
            Manage your client portfolio
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to="/customers/new"
          sx={{ px: 3, py: 1.2 }}
        >
          Add Client
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 4 }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search clients by name or email..."
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
            <Button
              variant="outlined"
              startIcon={<FilterListIcon />}
              sx={{ minWidth: 120 }}
            >
              Filter
            </Button>
          </Box>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", my: 4 }}>
          <CircularProgress size={60} thickness={4} sx={{ color: theme.palette.primary.main }} />
        </Box>
      ) : filteredCustomers.length > 0 ? (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Client</TableCell>
                  <TableCell>Contact Information</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredCustomers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((customer) => (
                  <TableRow key={customer.id} hover>
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <Avatar
                          sx={{
                            bgcolor: theme.palette.primary.main,
                            color: "white",
                            mr: 2,
                          }}
                        >
                          {getInitials(customer.firstName, customer.lastName)}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={600}>
                            {`${customer.firstName} ${customer.lastName}`}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            ID: {customer.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <EmailIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                          <Typography variant="body2">{customer.email}</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <PhoneIcon fontSize="small" sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                          <Typography variant="body2">{customer.phone}</Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{customer.address}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                        <Tooltip title="View Details">
                          <IconButton
                            color="primary"
                            onClick={() => navigate(`/customers/${customer.id}`)}
                            size="small"
                            sx={{ bgcolor: theme.palette.primary.main + "10" }}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Edit">
                          <IconButton
                            color="secondary"
                            onClick={() => navigate(`/customers/edit/${customer.id}`)}
                            size="small"
                            sx={{ bgcolor: theme.palette.secondary.main + "10" }}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(customer)}
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
              count={filteredCustomers.length}
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
            <img src="/placeholder.svg?height=120&width=120" alt="No customers" style={{ opacity: 0.5 }} />
          </Box>
          <Typography variant="h6" gutterBottom>
            {searchTerm ? "No clients match your search criteria" : "No clients found"}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {searchTerm
              ? "Try adjusting your search or filters to find what you're looking for."
              : "Get started by adding your first client to the system."}
          </Typography>
          {!searchTerm && (
            <Button variant="contained" startIcon={<AddIcon />} component={Link} to="/customers/new" sx={{ mt: 2 }}>
              Add Client
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
            Are you sure you want to delete {customerToDelete?.firstName} {customerToDelete?.lastName}? This action
            cannot be undone.
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

export default CustomerList

