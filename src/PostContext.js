import { createContext, useContext, useState } from "react";
import { faker } from "@faker-js/faker";

// 1. CREATING A CONTEXT (its first letter is capital bcoz its a Component function)
const PostContext = createContext();
function createRandomPost() {
  return {
    title: `${faker.hacker.adjective()} ${faker.hacker.noun()}`,
    body: faker.hacker.phrase(),
  };
}

// CREATING A COSTUM PROVIDER COMPONENT
function PostProvider({ children }) {
  const [posts, setPosts] = useState(() =>
    Array.from({ length: 30 }, () => createRandomPost())
  );
  const [searchQuery, setSearchQuery] = useState("");

  // Derived state. These are the posts that will actually be displayed
  const searchedPosts =
    searchQuery.length > 0
      ? posts.filter((post) =>
          `${post.title} ${post.body}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        )
      : posts;

  function handleAddPost(post) {
    setPosts((posts) => [post, ...posts]);
  }

  function handleClearPosts() {
    setPosts([]);
  }

  return (
    // STEP-2 PROVIDING VALUE TO THE CHILD COMPONENTS
    <PostContext.Provider
      value={{
        posts: searchedPosts,
        onAddPost: handleAddPost,
        onClearPosts: handleClearPosts,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </PostContext.Provider>
  );
}
// Creating costum useContext hook
function usePosts() {
  const context = useContext(PostContext);
  if (context === undefined)
    throw new Error("Postcontext is used outside the PostProvider"); // so that no one can use context value outside of its scope and if it uses it will throw error
  return context;
}

export { PostProvider, usePosts };
