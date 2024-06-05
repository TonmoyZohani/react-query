import { useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'

const Test = () => {

  const queryClient = useQueryClient();

  const {data,error,isLoading} = useQuery({
    queryKey:["posts"],
    queryFn:()=>{
      return fetch(`https://jsonplaceholder.typicode.com/posts`).then((res)=>res.json())
    },
    refetchInterval:4000,
    retry:2
  })

  return (
    <div>Test</div>
  )
}

export default Test