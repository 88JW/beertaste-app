import React, { useEffect, useState } from "react";

function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch(
      "https://public-api.wordpress.com/rest/v1.1/sites/wojciechjaskula.wordpress.com/posts"
    )
      .then((res) => res.json())
      .then((data) => setPosts(data.posts));
  }, []);

  return (
    <div>
      <h1>Posty z WordPress.com</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.ID}>
            <a href={post.URL} target="_blank" rel="noopener noreferrer">
              <h2>{post.title}</h2>
            </a>
            <div dangerouslySetInnerHTML={{ __html: post.excerpt }} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Posts;