import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const Test = () => {

  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch(`https://jsonplaceholder.typicode.com/posts`).then((res) => res.json())
    },
    refetchInterval: 4000,
    retry: 2
  })

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (newPost) =>
      fetch(`https://jsonplaceholder.typicode.com/posts`, {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json" }
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts, newPost])
    }
  })

  const mutation = useMutation(updateTodo, {
    onMutate: async newTodo => {
      await queryClient.cancelQueries('todos');
      const previousTodos = queryClient.getQueryData('todos');
      queryClient.setQueryData('todos', old => [...old, newTodo]);
      return { previousTodos };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData('todos', context.previousTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries('todos');
    },
  });
  


  return (
    <div>Test</div>
  )
}

export default Test