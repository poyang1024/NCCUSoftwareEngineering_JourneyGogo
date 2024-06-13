import {
    Box,
    Container,
    Typography,
} from '@mui/material'

export default function AttractionCard() {
    return (
        <Box component="footer" sx={{ bgcolor: 'background.paper', paddingTop: 5 }}>
            <Container maxWidth="lg">
                <Typography
                    variant="body1"
                    align="center"
                    color="text.secondary"
                    fontSize= "14px"
                    sx={{
                        fontFamily: 'Noto Sans TC'
                    }}
                    >
                    © {new Date().getFullYear()} 阮舅公. All rights reserved.
                </Typography>
            </Container>
        </Box>
    )

}
