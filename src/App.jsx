import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function App() {

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then((res) => res.json());
    },
    // staleTime: 4000, 
    refetchInterval:4000
  });
  

  // const { mutate, isPending, isSuccess, isError } = useMutation({
  //   mutationFn: (newPost) =>
  //     fetch(`https://jsonplaceholder.typicode.com/posts`, {
  //       method: "POST",
  //       body: JSON.stringify(newPost),
  //       headers: { "Content-type": "application/json" },
  //     }).then((res) => res.json()),
  //   onSuccess: () => {
  //     // Refetch the data to get the updated posts after adding a new post
  //     queryClient.invalidateQueries("posts");
  //   },
  // });

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (newPost) =>
      fetch(`https://jsonplaceholder.typicode.com/posts`, {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json" },
      }).then((res) => res.json()),
      onSuccess: (newPost) => {
        // Update the data directly without refetching
        queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts,newPost]);
      
      },
  });


  if (error || isError) {
    return <div>There was an error!</div>;
  }

  if (isLoading) {
    return <div>Data is loading...</div>;
  }

  return (
    <div>
      <button
        onClick={() =>
          mutate({
            userId: 5000,
            id: 101,
            title:
              "This is my personal title",
            body: "This is personal post body",
          })
        }
      >
        Add Post
      </button>
      {data?.map((todo) => {
        return (
          <div className="card">
            <p>Id:{todo?.id}</p>
            <h2 className="card-title">{todo?.title}</h2>
            <p className="card-content">{todo?.body}</p>
          </div>
        );
      })}
    </div>
  );
}

export default App;
