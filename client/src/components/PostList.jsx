import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateComment from "./CreateComment";
import CommentList from "./CommentList";

const PostList = () => {
  const [postList, setPostList] = useState({});

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:4000/posts");
    setPostList(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const renederedPosts = Object.values(postList).map((post) => {
    return (
      <div
        className="card"
        style={{ width: "30%", marginBottom: "20px" }}
        key={post.id}
      >
        <div className="card-body">
          <h3>{post.title}</h3>
          <CommentList postId={post.id} />
          <CreateComment postId={post.id}/>
        </div>
      </div>
    );
  });
  return (
    <div className="d-flex flex-row flex-wrap justify-content-between ">
      {renederedPosts}
    </div>
  );
};

export default PostList;
