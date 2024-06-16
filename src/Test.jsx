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

const handleSubmit = (e) => {
  e.preventDefault();

  axios.post('https://jsonplaceholder.typicode.com/posts', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  })
    .then((response) => {
      console.log('Success:', response.data);
      setResponse(response.data);
    })
    .catch((error) => {
      console.error('Error:', error);
    });
};

const submitData = async (formData) => {
  const response = await axios.post('https://jsonplaceholder.typicode.com/posts', formData, {
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response.data;
};

import React, { useState } from 'react';

const PostRequestComponent = () => {
  const [data, setData] = useState({ name: '', age: '', file: null });
  const [response, setResponse] = useState(null);

  const handleInputChange = (e) => {
    if (e.target.name === 'file') {
      setData({
        ...data,
        file: e.target.files[0], // Store the selected file
      });
    } else {
      const { name, value } = e.target;
      setData({
        ...data,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('age', data.age);
    formData.append('file', data.file);

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Success:', data);
        setResponse(data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            Age:
            <input
              type="text"
              name="age"
              value={data.age}
              onChange={handleInputChange}
            />
          </label>
        </div>
        <div>
          <label>
            File:
            <input
              type="file"
              name="file"
              onChange={handleInputChange}
            />
          </label>
        </div>
        <button type="submit">Submit</button>
      </form>
      {response && (
        <div>
          <h3>Response:</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default PostRequestComponent;

const handleUpdate = (e) => {
  e.preventDefault();

  fetch(`https://jsonplaceholder.typicode.com/posts/${data.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: data.title, body: data.body }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      console.log('Update Success:', data);
      setResponse(data);
    })
    .catch((error) => {
      console.error('Update Error:', error);
      setError(error);
    });
};