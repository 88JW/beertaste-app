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
  Avatar
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
    <Box sx={{ width: '100%', maxWidth: '1200px', mx: 'auto', mt: 4 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3, backgroundColor: '#f8f9fa', mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <RssFeedIcon sx={{ mr: 1, fontSize: 35, color: 'primary.main' }} />
            <Typography variant="h4" component="h1" color="primary" fontWeight="bold">
              Piwne Posty
            </Typography>
          </Box>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            href="/"
          >
            Powrót do menu
          </Button>
        </Box>
        <Grid container spacing={3}>
          {posts.map((post) => (
            <Grid item xs={12} sm={12} md={6} lg={6} key={post.ID}>
              <Card elevation={3} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
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
                <CardContent sx={{ flexGrow: 1, pt: 2, pb: 1, px: 2 }}>
                  <div dangerouslySetInnerHTML={{ __html: post.content }} />
                </CardContent>
                <CardActions sx={{ p: 2.5, borderTop: '1px solid rgba(0,0,0,0.08)', bgcolor: 'rgba(0,0,0,0.02)' }}>
                
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}

export default Posts;