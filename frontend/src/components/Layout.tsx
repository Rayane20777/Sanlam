"use client"

import type React from "react"
import { useState } from "react"
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom"
import {
    AppBar,
    Box,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    Container,
    Avatar,
    Button,
    Tooltip,
    MenuItem,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
    styled,
    useTheme,
    Badge,
    useMediaQuery,
} from "@mui/material"
import {
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    PeopleAlt as PeopleIcon,
    Policy as PolicyIcon,
    AssignmentLate as ClaimsIcon,
    Logout,
    AccountCircle,
    Settings,
    Notifications,
    ChevronLeft,
} from "@mui/icons-material"
import { useAuth } from "../contexts/AuthContext"

const StyledAppBar = styled(AppBar)(({ theme }) => ({
    background: `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.drawer + 1,
}))

const drawerWidth = 260

const Sidebar = styled(Drawer)(({ theme }) => ({
    "& .MuiDrawer-paper": {
        width: drawerWidth,
        background: "white",
        color: theme.palette.text.primary,
        borderRight: `1px solid ${theme.palette.divider}`,
    },
}))

const SidebarHeader = styled(Box)(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    padding: theme.spacing(2),
    backgroundColor: theme.palette.primary.main,
    backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
    color: "white",
    height: 64,
}))

const SidebarFooter = styled(Box)(({ theme }) => ({
    padding: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
    marginTop: "auto",
}))

const MenuItemStyled = styled(ListItem, {
    shouldForwardProp: (prop) => prop !== "selected",
})<{ selected?: boolean }>(({ theme, selected }) => ({
    borderRadius: 8,
    margin: "4px 8px",
    "&.Mui-selected": {
        backgroundColor: theme.palette.primary.main + "15",
        color: theme.palette.primary.main,
        "& .MuiListItemIcon-root": {
            color: theme.palette.primary.main,
        },
        "&:hover": {
            backgroundColor: theme.palette.primary.main + "25",
        },
    },
    "&:hover": {
        backgroundColor: theme.palette.action.hover,
    },
}))

const Layout: React.FC = () => {
    const { user, logout, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const theme = useTheme()
    const isMobile = useMediaQuery(theme.breakpoints.down("md"))

    const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleDrawerToggle = () => setMobileOpen(!mobileOpen)
    const handleCloseUserMenu = () => setAnchorElUser(null)

    const menuItems = [
        { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
        { text: "Clients", icon: <PeopleIcon />, path: "/customers" },
        { text: "Policies", icon: <PolicyIcon />, path: "/policies" },
        { text: "Claims", icon: <ClaimsIcon />, path: "/claims" },
    ]

    const drawerContent = (
        <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
            <SidebarHeader>
                <Typography variant="h6" fontWeight="bold" sx={{ flexGrow: 1 }}>
                    SANLAM
                </Typography>
                {isMobile && (
                    <IconButton edge="end" color="inherit" onClick={handleDrawerToggle}>
                        <ChevronLeft />
                    </IconButton>
                )}
            </SidebarHeader>

            <Box sx={{ p: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontWeight: 500 }}>
                    MAIN MENU
                </Typography>

                <List sx={{ p: 0 }}>
                    {menuItems.map((item) => (
                        <MenuItemStyled
                            button={true as any}
                            key={item.text}
                            component={Link}
                            to={item.path}
                            selected={location.pathname === item.path || location.pathname.startsWith(item.path + "/")}
                            onClick={() => isMobile && setMobileOpen(false)}
                        >
                            <ListItemIcon
                                sx={{ minWidth: 40, color: location.pathname === item.path ? theme.palette.primary.main : "inherit" }}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{
                                    fontWeight: location.pathname === item.path ? 600 : 400,
                                }}
                            />
                        </MenuItemStyled>
                    ))}
                </List>
            </Box>

            {isAuthenticated && (
                <SidebarFooter>
                    <Box sx={{ display: "flex", alignItems: "center", p: 1 }}>
                        <Avatar alt={user?.username} src="/static/images/avatar/2.jpg" sx={{ width: 40, height: 40, mr: 2 }} />
                        <Box>
                            <Typography variant="subtitle2" fontWeight={600}>
                                {user?.username}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                                {user?.email}
                            </Typography>
                        </Box>
                    </Box>
                </SidebarFooter>
            )}
        </Box>
    )

    return (
        <Box sx={{ display: "flex" }}>
            <StyledAppBar position="fixed">
                <Toolbar>
                    <IconButton color="inherit" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: "none" } }}>
                        <MenuIcon />
                    </IconButton>

                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            display: { xs: "none", md: "flex" },
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": { opacity: 0.9 },
                        }}
                    >
                        SANLAM INSURANCE
                    </Typography>

                    <Typography
                        variant="h6"
                        component={Link}
                        to="/"
                        sx={{
                            display: { xs: "flex", md: "none" },
                            flexGrow: 1,
                            fontWeight: 700,
                            color: "inherit",
                            textDecoration: "none",
                            "&:hover": { opacity: 0.9 },
                        }}
                    >
                        SANLAM
                    </Typography>

                    <Box sx={{ flexGrow: 1 }} />

                    {isAuthenticated ? (
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Tooltip title="Notifications">
                                <IconButton color="inherit">
                                    <Badge badgeContent={3} color="error">
                                        <Notifications />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Tooltip title="Account settings">
                                <IconButton onClick={(e) => setAnchorElUser(e.currentTarget)} color="inherit">
                                    <Avatar alt={user?.username} src="/static/images/avatar/2.jpg" sx={{ width: 32, height: 32 }} />
                                </IconButton>
                            </Tooltip>

                            <Menu
                                anchorEl={anchorElUser}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                                PaperProps={{
                                    sx: {
                                        mt: 1.5,
                                        minWidth: 200,
                                        boxShadow: theme.shadows[3],
                                        borderRadius: 2,
                                    },
                                }}
                            >
                                <MenuItem onClick={handleCloseUserMenu} component={Link} to="/profile">
                                    <ListItemIcon>
                                        <AccountCircle fontSize="small" />
                                    </ListItemIcon>
                                    My Profile
                                </MenuItem>
                                <MenuItem onClick={handleCloseUserMenu} component={Link} to="/settings">
                                    <ListItemIcon>
                                        <Settings fontSize="small" />
                                    </ListItemIcon>
                                    Settings
                                </MenuItem>
                                <Divider />
                                <MenuItem onClick={logout}>
                                    <ListItemIcon>
                                        <Logout fontSize="small" />
                                    </ListItemIcon>
                                    Sign Out
                                </MenuItem>
                            </Menu>
                        </Box>
                    ) : (
                        <Box>
                            <Button component={Link} to="/login" color="inherit" sx={{ textTransform: "none", px: 2 }}>
                                Sign In
                            </Button>
                            <Button
                                component={Link}
                                to="/register"
                                variant="contained"
                                color="secondary"
                                sx={{ ml: 2, textTransform: "none" }}
                            >
                                Register
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </StyledAppBar>

            <Box component="nav">
                <Sidebar
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{ keepMounted: true }}
                    sx={{ display: { xs: "block", md: "none" } }}
                >
                    {drawerContent}
                </Sidebar>

                <Sidebar
                    variant="permanent"
                    sx={{
                        display: { xs: "none", md: "block" },
                        "& .MuiDrawer-paper": { boxSizing: "border-box", width: drawerWidth },
                    }}
                    open
                >
                    {drawerContent}
                </Sidebar>
            </Box>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    ml: { md: `${drawerWidth}px` },
                    mt: "64px",
                    backgroundColor: "#f8f9fa",
                    minHeight: "calc(100vh - 64px)",
                }}
            >
                <Container maxWidth="xl" sx={{ py: 3 }}>
                    <Outlet />
                </Container>
            </Box>
        </Box>
    )
}

export default Layout

