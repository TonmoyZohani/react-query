import "./App.css";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

function App() {
  const queryClient = useQueryClient();

  const { data: posts, error, isLoading } = useQuery({
    queryKey: ["posts"],
    queryFn: () => {
      return fetch(`https://jsonplaceholder.typicode.com/posts`)
        .then((res) => res.json());
    },
    refetchInterval: 4000, // Optional: Refetch posts every 4 seconds
    refetchOnWindowFocus: true, // Refetch on window focus
    retry: 2, // Retry failed queries up to 2 times
  });

  const { mutate, isPending, isSuccess, isError } = useMutation({
    mutationFn: (newPost) =>
      fetch(`https://jsonplaceholder.typicode.com/posts`, {
        method: "POST",
        body: JSON.stringify(newPost),
        headers: { "Content-type": "application/json" },
      }).then((res) => res.json()),
    onSuccess: (newPost) => {
      // Update cached data with new post
      queryClient.setQueryData(["posts"], (oldPosts) => [...oldPosts, newPost]);
    },
  });

  const [selectedPostId, setSelectedPostId] = useState(null); // Check

  const {
    data: selectedPost,
    isLoading: isPostLoading,
    error: postError,
  } = useQuery({
    queryKey: ["posts", selectedPostId],
    queryFn: ({ queryKey }) => {
      const postId = queryKey[1];
      return fetch(`https://jsonplaceholder.typicode.com/posts/${postId}`)
        .then((res) => res.json());
    },
    enabled: !!selectedPostId, // Only fetch data when selectedPostId has a value
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
            title: "This is my personal title",
            body: "This is personal post body",
          })
        }
        disabled={isPending} // Disable button while adding post
      >
        Add Post
      </button>
      {posts?.map((post) => (
        <div key={post.id} className="card" onClick={() => setSelectedPostId(post.id)}>
          <p>Id:{post.id}</p>
          <h2 className="card-title">{post.title}</h2>
          <p className="card-content">{post.body}</p>
        </div>
      ))}
      {selectedPostId && (
        <div>
          <h2>Selected Post Details</h2>
          {isPostLoading ? (
            <p>Loading details...</p>
          ) : postError ? (
            <p>Error: {postError.message}</p>
          ) : (
            <div>
              <p>Id: {selectedPost.id}</p>
              <p>Title: {selectedPost.title}</p>
              <p>Body: {selectedPost.body}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
