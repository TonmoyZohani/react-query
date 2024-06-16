import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";

const Test = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch(`https://jsonplaceholder.typicode.com/posts`).then((res) =>
        res.json()
      );
    },
    refetchInterval: 4000,
    retry: 2,
  });

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (newPost) =>
      fetch(`https://jsonplaceholder.typicode.com/posts`, {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json" },
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts, newPost]);
    },
  });

  const mutation = useMutation(updateTodo, {
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries("todos");
      const previousTodos = queryClient.getQueryData("todos");
      queryClient.setQueryData("todos", (old) => [...old, newTodo]);
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData("todos", context.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries("todos");
    },
  });

  return <div>Test</div>;
};

export default Test;

const [data, setData] = useState({});

const handleChange = (e) => {
  const { name, value } = e.target;
  setData({ ...data, [name]: value });
};

// Async- Await

const handleSubmit=async(e)=>{
  e.preventDefault();

  try{
    const response = await fetch(`https://jsonplaceholder.typicode.com/posts`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();
    console.log(data);

  }catch(error){
    console.log(error);
  }
}

const handleSubmit = (e) => {
  e.preventDefault();

  fetch(`https://jsonplaceholder.typicode.com/posts`, {
    method:"POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(formData),
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.log(error);
    });
};
