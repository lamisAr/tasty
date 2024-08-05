import { Container, Box, Typography, Card, Divider, Stack, FormLabel, FormControl, Input, Avatar } from "@mui/material";
import { useAppSelector } from "../hooks/redux-hooks.ts";

function Profile() {
  function stringToColor(string: string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = "#";

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToColor(name),
        width: "100px",
        height: "100px",
        fontSize: "32px",
      },
      children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
  }

  const basicUserInfo = useAppSelector((state) => state.auth.basicUserInfo);

  return (
    <Container maxWidth="xl" sx={{ padding: "15px !important" }}>
      <Box display="flex" alignItems="center" pt={4} pb={4}>
        <Typography variant="h5" fontWeight="bold">
          Personal Info
        </Typography>
      </Box>
      <Card sx={{ padding: 3 }}>
        <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" }, my: 1 }}>
          <Stack direction="column" spacing={1}>
            <Avatar {...stringAvatar(`${basicUserInfo?.firstName} ${basicUserInfo?.lastName}`)} />
          </Stack>
          <Stack spacing={2} sx={{ flexGrow: 1, paddingLeft: 4, paddingRight: 8 }}>
            <Stack spacing={1}>
              <FormLabel>Name</FormLabel>
              <FormControl sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
                <Input placeholder="First name" sx={{ flexGrow: 1 }} value={basicUserInfo?.firstName} disabled />
                <Input placeholder="Last name" sx={{ flexGrow: 1 }} value={basicUserInfo?.lastName} disabled />
              </FormControl>
            </Stack>
            <Stack direction="row" spacing={2}>
              <FormControl>
                <FormLabel>User Name</FormLabel>
                <Input placeholder="User Name" value={basicUserInfo?.userName} disabled />
              </FormControl>
              <FormControl sx={{ flexGrow: 1 }}>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="email" sx={{ flexGrow: 1 }} value={basicUserInfo?.email} disabled />
              </FormControl>
            </Stack>
            <div>
              <FormControl sx={{ display: { sm: "contents" } }} />
            </div>
            <Divider sx={{ mb: 3 }} />
            <FormLabel>Description</FormLabel>
            <Input placeholder="Description" sx={{ flexGrow: 1 }} value={basicUserInfo?.description} disabled />
          </Stack>
        </Stack>
      </Card>
    </Container>
  );
}

export default Profile;
