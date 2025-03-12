"use client"

import type React from "react"
import { Box, Button, Container, Typography, useTheme, Paper } from "@mui/material"
import { Link } from "react-router-dom"
import { Home as HomeIcon, ArrowBack as ArrowBackIcon } from "@mui/icons-material"

const NotFound: React.FC = () => {
    const theme = useTheme()

    return (
        <Container maxWidth="md">
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    textAlign: "center",
                    p: 3,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        p: 5,
                        borderRadius: 4,
                        width: "100%",
                        maxWidth: 600,
                        position: "relative",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            right: 0,
                            width: 150,
                            height: 150,
                            background: `linear-gradient(45deg, transparent 50%, ${theme.palette.primary.light}40 50%)`,
                            zIndex: 0,
                        }}
                    />

                    <Box
                        sx={{
                            position: "relative",
                            mb: 4,
                            zIndex: 1,
                        }}
                    >
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                fontSize: { xs: "8rem", md: "10rem" },
                                fontWeight: 700,
                                color: theme.palette.primary.main,
                                opacity: 0.15,
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                zIndex: 0,
                            }}
                        >
                            404
                        </Typography>
                        <Box
                            sx={{
                                position: "relative",
                                zIndex: 1,
                                p: 4,
                            }}
                        >
                            <img
                                src="/placeholder.svg?height=150&width=150"
                                alt="Page not found"
                                style={{
                                    maxWidth: "100%",
                                    height: "auto",
                                    opacity: 0.8,
                                }}
                            />
                        </Box>
                    </Box>

                    <Typography
                        variant="h3"
                        component="h2"
                        gutterBottom
                        fontWeight={600}
                        sx={{
                            color: theme.palette.primary.main,
                            mb: 2,
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        Page Not Found
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            mb: 4,
                            color: theme.palette.text.secondary,
                            maxWidth: 500,
                            mx: "auto",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the
                        dashboard.
                    </Typography>

                    <Box
                        sx={{
                            display: "flex",
                            gap: 2,
                            flexWrap: "wrap",
                            justifyContent: "center",
                            position: "relative",
                            zIndex: 1,
                        }}
                    >
                        <Button
                            variant="contained"
                            component={Link}
                            to="/"
                            startIcon={<HomeIcon />}
                            size="large"
                            sx={{ px: 3, borderRadius: "8px", py: 1.2 }}
                        >
                            Back to Dashboard
                        </Button>

                        <Button
                            variant="outlined"
                            component={Link}
                            to="#"
                            onClick={() => window.history.back()}
                            startIcon={<ArrowBackIcon />}
                            size="large"
                            sx={{ borderRadius: "8px" }}
                        >
                            Go Back
                        </Button>
                    </Box>
                </Paper>
            </Box>
        </Container>
    )
}

export default NotFound

