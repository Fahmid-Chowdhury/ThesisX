const CreateThesisForm = ({ onComplete }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
        const apiDomain = import.meta.env.VITE_API_DOMAIN;
        const token = localStorage.getItem("authToken");
  
        const response = await fetch(`${apiDomain}/api/thesis/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ title, description }),
        });
  
        if (!response.ok) {
          throw new Error("Failed to create thesis");
        }
  
        await response.json();
        onComplete();
      } catch (err) {
        console.error("Error creating thesis:", err);
      }
    };
  
    return (
      <form onSubmit={handleSubmit} className="mt-4 space-y-4">
        <input
          type="text"
          className="w-full p-2 border rounded"
          placeholder="Thesis Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Thesis Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button className="px-4 py-2 bg-blue-500 text-white rounded">Create</button>
      </form>
    );
  };
  
  export default CreateThesisForm;
  