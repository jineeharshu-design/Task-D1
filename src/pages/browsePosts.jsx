import { useEffect, useState } from 'react';
import { useAuth } from '../context/authContext';

const API_URL = import.meta.env.VITE_API_URL;

function BrowsePosts() {
    const { user, loading } = useAuth();

    const [posts, setPosts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [error, setError] = useState('');

    const [hiddenPosts, setHiddenPosts] = useState([]);
    const [expandedPosts, setExpandedPosts] = useState([]);

    const [postTypeFilter, setPostTypeFilter] = useState('All');
    const [planFilter, setPlanFilter] = useState('All');
    const [dateFilter, setDateFilter] = useState('');
    const [tagFilter, setTagFilter] = useState('');

    useEffect(() => {
        async function fetchPosts() {
            try {
                setFetching(true);
                setError('');

                const token = localStorage.getItem('token');

                const response = await fetch(`${API_URL}/api/posts`, {
                    headers: token
                        ? { Authorization: `Bearer ${token}` }
                        : {}
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || 'Unable to load posts.');
                }

                setPosts(data.posts || []);
            } catch (error) {
                console.error('Browse posts error:', error);
                setError(error.message);
            } finally {
                setFetching(false);
            }
        }

        // Wait until AuthContext finishes checking the login
        if (!loading) {
            fetchPosts();
        }
    }, [loading, user]);

    const filteredPosts = posts.filter((post) => {
        const matchesType =
            postTypeFilter === 'All' ||
            post.postType === postTypeFilter;

        const matchesPlan =
            planFilter === 'All' ||
            post.planType === planFilter;

        const matchesDate =
            !dateFilter ||
            (post.createdAt && post.createdAt.substring(0, 10) === dateFilter);

        const matchesTag =
            !tagFilter ||
            post.tags.some((tag) =>
                tag.toLowerCase().includes(tagFilter.toLowerCase().trim())
            );

        const isNotHidden = !hiddenPosts.includes(post.id);

        return matchesType && matchesPlan && matchesDate &&
            matchesTag && isNotHidden;
    });

    if (loading || fetching) {
        return <p className="text-center p-10">Loading posts...</p>;
    }

    if (error) {
        return <p className="text-center text-red-700 p-10">{error}</p>;
    }

    return (
        <div className="min-h-screen bg-[#F5F5DC] px-6 py-10">
            <div className="max-w-5xl mx-auto">

                <h1 className="text-3xl font-bold text-red-900 mb-2">
                    Browse Posts
                </h1>

                <p className="text-gray-700 mb-8">
                    Explore questions and articles shared by the community.
                </p>

                <div className="bg-[#FFFEF5] border border-gray-300 rounded-xl p-5 mb-8">

                    <h2 className="text-xl font-bold text-red-900 mb-4">
                        Filter Posts
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Post Type */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Post Type
                            </label>

                            <select
                                value={postTypeFilter}
                                onChange={(e) => setPostTypeFilter(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 bg-white"
                            >
                                <option value="All">All Types</option>
                                <option value="Question">Questions</option>
                                <option value="Article">Articles</option>
                            </select>
                        </div>

                        {/* Plan */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Plan
                            </label>

                            <select
                                value={planFilter}
                                onChange={(e) => setPlanFilter(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 bg-white"
                            >
                                <option value="All">All Plans</option>
                                <option value="Free">Free</option>
                                <option value="Paid">Paid</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Published Date
                            </label>

                            <input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full rounded-lg border border-gray-300 p-3 bg-white"
                            />
                        </div>

                        {/* Tags */}
                        <div>
                            <label className="block font-semibold mb-2">
                                Search by Tag
                            </label>

                            <input
                                type="text"
                                value={tagFilter}
                                onChange={(e) => setTagFilter(e.target.value)}
                                placeholder="Enter a tag..."
                                className="w-full rounded-lg border border-gray-300 p-3 bg-white"
                            />
                        </div>

                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setPostTypeFilter('All');
                            setPlanFilter('All');
                            setDateFilter('');
                            setTagFilter('');
                        }}
                        className="mt-5 rounded-lg bg-[#800000] px-5 py-2 text-white hover:bg-[#600000]"
                    >
                        Reset Filters
                    </button>

                    <button
                        type="button"
                        onClick={() => setHiddenPosts([])}
                        className="mt-5 ml-3 rounded-lg bg-[#800000] border border-[#800000] px-5 py-2 text-white hover:bg-[#600000]"
                    >
                        Restore Hidden Posts
                    </button>
                    
                </div>

                {/* POST COUNT */}
                <p className="text-gray-700 mb-4">
                    Showing {filteredPosts.length} of {posts.length} posts
                </p>

                {/* POSTS */}
                {filteredPosts.length === 0 ? (
                    <p className="text-gray-600">
                        No posts match your filters.
                    </p>
                ) : (
                    <div className="space-y-6">
                        {filteredPosts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-[#FFFEF5] border border-gray-300 rounded-xl p-6 shadow-sm"
                            >
                                <div className="flex flex-wrap justify-between gap-2 mb-3">
                                    <span className="text-sm font-semibold text-red-900">
                                        {post.postType}
                                    </span>

                                    <span className="text-sm text-gray-600">
                                        {post.planType}
                                    </span>
                                </div>

                                <h2 className="text-xl font-bold text-gray-900 mb-3">
                                    {post.title}
                                </h2>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setHiddenPosts((previous) => [...previous, post.id]);
                                    }}
                                    className="text-sm text-red-900 underline hover:text-red-700 mb-3"
                                >
                                    Hide Post
                                </button>

                                {post.postType === 'Question' ? (
                                    <p className="text-gray-700 whitespace-pre-line">
                                        {expandedPosts.includes(post.id)
                                            ? post.description
                                            : post.description.length > 100
                                                ? post.description.substring(0, 100) + '...'
                                                : post.description}
                                    </p>
                                ) : (
                                    <>
                                        <p className="text-gray-700 mb-3">
                                            {post.abstract}
                                        </p>
                                        <p className="text-gray-700 whitespace-pre-line">
                                            {expandedPosts.includes(post.id) && post.articleText}
                                        </p>
                                    </>
                                )}

                                {/* READ MORE / SHOW LESS */}
                                {(
                                    (post.postType === 'Question' && post.description.length > 100) ||
                                    (post.postType === 'Article' && post.articleText.length > 0)
                                ) && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setExpandedPosts((previous) =>
                                                previous.includes(post.id)
                                                    ? previous.filter((id) => id !== post.id)
                                                    : [...previous, post.id]
                                            );
                                        }}
                                        className="mt-3 font-semibold text-[#800000] hover:underline"
                                    >
                                        {expandedPosts.includes(post.id)
                                            ? 'Show Less'
                                            : 'Read More'}
                                    </button>
                                )}

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {(post.tags || []).map((tag, index) => (
                                        <span
                                            key={index}
                                            className="bg-red-100 text-red-900 px-3 py-1 rounded-full text-sm"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-xs text-gray-500 mt-4">
                                    Published: {
                                        post.createdAt
                                            ? new Date(post.createdAt).toLocaleString()
                                            : 'Date unavailable'
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default BrowsePosts
