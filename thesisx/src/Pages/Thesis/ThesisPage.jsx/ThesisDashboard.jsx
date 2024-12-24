import { useState } from "react";

const ThesisDashboard = ({ thesis }) => {
  const [posts, setPosts] = useState(thesis.posts || []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 bg-blue-600 text-white">
        <h1 className="text-2xl font-bold">{thesis.title}</h1>
        <p className="text-sm">{thesis.supervisorName}</p>
      </header>

      <main className="p-4 space-y-4">
        <section>
          <h2 className="text-xl font-semibold">Posts</h2>
          <div className="space-y-4">
            {posts.map((post) => (
              <div
                key={post.id}
                className="p-4 border rounded shadow hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <h3 className="text-lg font-medium">{post.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{post.content}</p>
                <p className="text-xs text-gray-500 dark:text-gray-500">
                  {new Date(post.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Resources</h2>
          <div className="space-y-2">
            {thesis.resources.map((resource) => (
              <a
                key={resource.id}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-2 bg-gray-200 rounded shadow hover:bg-gray-300 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                {resource.title}
              </a>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Schedule</h2>
          <p className="text-sm">Schedule meetings or check upcoming deadlines.</p>
        </section>
      </main>
    </div>
  );
};

export default ThesisDashboard;
