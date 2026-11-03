import { useState } from "react";
import { useAuth } from "../context/authContext";

const API_URL = import.meta.env.VITE_API_URL;

function Post() {
    const { user, loading } = useAuth();

    const [postType, setPostType] = useState("Question");
    const [planType, setPlanType] = useState("Free");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [abstract, setAbstract] = useState("");
    const [articleText, setArticleText] = useState("");
    const [tags, setTags] = useState("");

    const [submitting, setSubmitting] = useState(false);

  async function handlePost() {
        // Check whether login information is still loading
        if (loading) {
            alert("Please wait while your account loads.");
            return;
        }

        // Check whether the user is logged in
        const token = localStorage.getItem("token");

        if (!user || !token) {
            alert("Please log in before submitting a post.");
            return;
        }

        // Convert tags into an array
        const tagList = tags
            .split(",")
            .map(tag => tag.trim())
            .filter(tag => tag !== "");

        // Remove duplicate tags
        const uniqueTags = [...new Set(tagList)];

        // Validate title
        if (!title.trim()) {
            alert("Please enter a title.");
            return;
        }

        if (title.trim().length > 150) {
            alert("Title must be 150 characters or fewer.");
            return;
        }

        // Validate Question
        if (postType === "Question" && !description.trim()) {
            alert("Please describe your problem.");
            return;
        }

        // Validate Article
        if (postType === "Article") {
            if (!abstract.trim()) {
                alert("Please enter the abstract.");
                return;
            }

            if (!articleText.trim()) {
                alert("Please enter your article text.");
                return;
            }
        }

        // Validate tags
        if (uniqueTags.length > 3) {
            alert("You can add a maximum of 3 tags.");
            return;
        }

        if (uniqueTags.some(tag => tag.length > 30)) {
            alert("Each tag must be 30 characters or fewer.");
            return;
        }

        // Prepare post data
        const postData = {
            title: title.trim(),
            postType,
            planType,
            description,
            abstract,
            articleText,
            tags: uniqueTags
        };

        try {
            setSubmitting(true);

            // Send post to backend
            const response = await fetch(`${API_URL}/api/posts`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(postData)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to publish post.");
            }

            // Success notification
            alert(data.message || "Post published successfully!");

            // Clear form after successful submission
            setTitle("");
            setDescription("");
            setAbstract("");
            setArticleText("");
            setTags("");
            setPostType("Question");
            setPlanType("Free");

        } catch (error) {
            console.error("Post submission error:", error);
            alert(error.message || "Something went wrong. Please try again.");
        } finally {
            setSubmitting(false);
        }
    }
    
    return (
    <main className="min-h-screen bg-[#F5F5DC] px-5 py-10 font-sans text-gray-900 sm:px-8">
        <div className="mx-auto max-w-5xl">
            <h1 className="mb-7 text-3xl font-bold text-red-900 sm:text-4xl">
                New Post
            </h1>

            <div className="mb-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <span className="font-semibold text-red-900">
                    Select Post Type:
                </span>

                {["Question", "Article"].map(type => (
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="radio"
                            name="postType"
                            value={type}
                            checked={postType === type}
                            onChange={() => setPostType(type)}
                            className="h-4 w-4 accent-red-900"
                        />
                        {type}
                    </label>
                ))}
            </div>

            <div className="mb-7 flex flex-wrap items-center gap-x-8 gap-y-4">
                <span className="font-semibold text-red-900">
                    Select Plan Type:
                </span>

                {["Free", "Paid"].map(type => (
                    <label className="flex cursor-pointer items-center gap-2">
                        <input
                            type="radio"
                            name="planType"
                            value={type}
                            checked={planType === type}
                            onChange={() => setPlanType(type)}
                            className="h-4 w-4 accent-red-900"
                        />
                        {type}
                    </label>
                ))}
            </div>

            <section className="rounded-lg border border-red-900 bg-white/30 p-5 sm:p-8">
                <h2 className="mb-3 text-xl font-bold text-red-900 sm:text-2xl">
                    What do you want to ask or share
                </h2>

                <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="post-title">Title</label>

                    <input
                        id="post-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        maxLength={150}
                        placeholder={
                            postType === "Question"
                            ? "Start your question with how, what, why, etc."
                            : "Enter a descriptive title"
                        }
                        className="w-full rounded-md border border-gray-700 bg-[#FFFEF5] p-3 outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                    />
                </div>

                {postType === "Question" ? (
                    <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="description">
                        Describe your problem
                    </label>

                    <textarea
                        id="description"
                        rows={8}
                        maxLength={5000}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full resize-y rounded-md border border-gray-700 bg-[#FFFEF5] p-3 outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                    />
                    </div>
                ) : (
                    <>
                    <div className="mb-6 flex flex-col gap-2">
                        <label htmlFor="abstract">Abstract</label>

                        <textarea
                            id="abstract"
                            rows={3}
                            maxLength={1000}
                            value={abstract}
                            onChange={(e) => setAbstract(e.target.value)}
                            placeholder="Enter a 1-paragraph abstract"
                            className="w-full resize-y rounded-md border border-gray-700 bg-[#FFFEF5] p-3 outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                        />
                    </div>

                    <div className="mb-6 flex flex-col gap-2">
                        <label htmlFor="article-text">Article Text</label>

                        <textarea
                            id="article-text"
                            rows={8}
                            maxLength={10000}
                            value={articleText}
                            onChange={(e) => setArticleText(e.target.value)}
                            placeholder="Write your article here"
                            className="w-full resize-y rounded-md border border-gray-700 bg-[#FFFEF5] p-3 outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                        />
                    </div>
                    </>
                )}

                <div className="mb-6 flex flex-col gap-2">
                    <label htmlFor="tags">Tags</label>

                    <input
                        id="tags"
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="Add up to 3 tags, e.g. React, Java"
                        className="w-full rounded-md border border-gray-700 bg-[#FFFEF5] p-3 outline-none focus:border-red-900 focus:ring-1 focus:ring-red-900"
                    />

                    <p className="text-sm text-gray-600">
                        Separate tags with commas. Maximum 3 tags.
                    </p>
                </div>

                <div className="flex justify-end">
                    <button
                        type="button"
                        onClick={handlePost}
                        disabled={submitting || loading}
                        className="w-full rounded-lg bg-red-900 px-8 py-3 font-semibold text-white transition hover:bg-red-950 sm:w-52 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {submitting ? "Publishing..." : "Post"}
                    </button>
                </div>
            </section>
        </div>
    </main>
    )
}

export default Post
