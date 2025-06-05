import React, { useEffect, useState } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Box,
  Divider,
  CardHeader,
  Paper,
  Avatar,
  Container
} from '@mui/material';
import RssFeedIcon from '@mui/icons-material/RssFeed';

function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(
      "https://public-api.wordpress.com/rest/v1.1/sites/wojciechjaskula.wordpress.com/posts"
    )
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Ładowanie postów...</div>;

  return (
    <Box className="app-container" sx={{ width: '100vw', minHeight: '100vh', bgcolor: 'transparent', p: 0, m: 0, overflowX: 'hidden' }}>
      <Container disableGutters maxWidth="sm" sx={{ mt: 0, mb: 4, px: { xs: 0, sm: 1 }, width: '100%', boxSizing: 'border-box', pt: 1 }}>
        <Button
          variant="outlined"
          sx={{ mb: 2, ml: 0, mt: 1, width: { xs: '100%', sm: 'auto' } }}
          href="/"
        >
          Powrót do menu
        </Button>
        <Paper elevation={3} sx={{ p: { xs: 1, sm: 2 }, borderRadius: 3, backgroundColor: '#f8f9fa', mb: 4, width: '100%', boxSizing: 'border-box', maxWidth: '100vw', overflowX: 'hidden' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between', flexDirection: { xs: 'column', sm: 'row' }, gap: { xs: 2, sm: 0 }, width: '100%' }}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RssFeedIcon sx={{ mr: 1, fontSize: 35, color: 'primary.main' }} />
              <Typography variant="h4" component="h1" color="primary" fontWeight="bold" sx={{ fontSize: { xs: '1.5rem', sm: '2.125rem' } }}>
                Piwne Posty
              </Typography>
            </Box>
          </Box>
          <Grid container spacing={2} sx={{ width: '100%', margin: 0 }}>
            {posts.map((post) => (
              <Grid item xs={12} key={post.ID} sx={{ width: '100%' }}>
                <Card elevation={3} sx={{ width: '100%', maxWidth: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', overflowX: 'auto' }}>
                  <CardHeader
                    avatar={
                      <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, fontSize: '1.8rem' }}>
                        {post.title?.charAt(0)?.toUpperCase() || 'P'}
                      </Avatar>
                    }
                    title={
                      <Typography variant="h6" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '90%' }}>
                        {post.title}
                      </Typography>
                    }
                    subheader={post.date?.slice(0, 10)}
                    sx={{ pb: 1 }}
                  />
                  <Divider />
                  <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1, px: 2, width: '100%', maxWidth: '100%', boxSizing: 'border-box' }}>
                    <div style={{ wordBreak: 'break-word', maxWidth: '100%', overflowX: 'auto' }} dangerouslySetInnerHTML={{ __html: post.content }} />
                  </CardContent>
                  <CardActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)', bgcolor: 'rgba(0,0,0,0.02)' }}>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Posts;