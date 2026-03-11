import React, { useState, useEffect } from "react";
import { Box, Text, Input, VStack, Flex } from "@chakra-ui/react";
import UserAvatar from "../../common/UserAvatar";
import { useNavigate } from "react-router-dom";
import profileService from "../../../services/profileService";
import SearchSkeleton from "../../skeletons/SearchSkeleton";
import { AiOutlineClose } from "react-icons/ai";

const SearchPanel = ({ isOpen }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchHistory, setSearchHistory] = useState([]);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Fetch Search History on Open
    useEffect(() => {
        if (isOpen && !searchTerm) {
            const fetchHistory = async () => {
                try {
                    const history = await profileService.getSearchHistory();
                    setSearchHistory(history || []);
                } catch (error) {
                    console.error("Failed to fetch history:", error);
                }
            };
            fetchHistory();
        }
    }, [isOpen, searchTerm]);

    // Debounced Search Logic
    useEffect(() => {
        const fetchResults = async () => {
            if (searchTerm.trim() === "") {
                setSearchResults([]);
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const results = await profileService.searchUsers(searchTerm);
                setSearchResults(results || []);
            } catch (error) {
                console.error("Search failed:", error);
            } finally {
                setLoading(false);
            }
        };

        const timer = setTimeout(fetchResults, 400); // 400ms Debounce
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleNavigate = async (user) => {
        try {
            // Add to history via API
            await profileService.addToSearchHistory(user.id);
        } catch (error) {
            console.error("Failed to add to history:", error);
        }
        setSearchTerm("");
        navigate(`/${user.username}`);
    };

    const handleDeleteHistory = async (e, id) => {
        e.stopPropagation();
        try {
            await profileService.deleteSearchHistory(id);
            setSearchHistory(searchHistory.filter(item => item.id !== id));
        } catch (error) {
            console.error("Failed to delete history:", error);
        }
    };

    const handleClearAll = async () => {
        try {
            await profileService.clearSearchHistory();
            setSearchHistory([]);
        } catch (error) {
            console.error("Failed to clear history:", error);
        }
    };

    return (
        <div
            className={`fixed left-[72px] top-0 h-screen w-[397px] bg-white z-[90] p-4 text-black transition-all duration-300 ease-in-out shadow-[20px_0_20px_-20px_rgba(0,0,0,0.1)] ${
                isOpen ? "translate-x-0 opacity-100 visible" : "-translate-x-full opacity-0 invisible"
            }`}
        >
            <h2 className="text-2xl font-bold mb-6 mt-2">Search</h2>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search"
                    className="w-full bg-[#efefef] border-none rounded-lg px-4 py-2 focus:outline-none focus:ring-1 focus:ring-gray-300 placeholder-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="h-px bg-gray-200 w-full mb-4" />

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[calc(100vh-180px)] no-scrollbar">
                <div className="flex justify-between items-center mb-2">
                    <span className="font-bold text-base">
                        {searchTerm ? "Results" : "Recent"}
                    </span>
                    {!searchTerm && searchHistory.length > 0 && (
                        <button
                            className="text-[#0095f6] text-sm font-bold cursor-pointer hover:text-blue-900"
                            onClick={handleClearAll}
                        >
                            Clear all
                        </button>
                    )}
                </div>

                {loading ? (
                    <SearchSkeleton />
                ) : searchTerm ? (
                    searchResults.length > 0 ? (
                        searchResults.map((user) => (
                            <div
                                key={user.id}
                                className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors"
                                onClick={() => handleNavigate(user)}
                            >
                                <UserAvatar src={user.avatar} size="44px" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm leading-tight">{user.username}</span>
                                    <span className="text-gray-500 text-sm">{user.fullName}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-gray-500 text-sm text-center mt-10">
                            No results found for "{searchTerm}".
                        </div>
                    )
                ) : searchHistory.length > 0 ? (
                    searchHistory.map((item) => (
                        <div
                            key={item.id}
                            className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded transition-colors group"
                            onClick={() => handleNavigate(item.user)}
                        >
                            <div className="flex items-center gap-3">
                                <UserAvatar src={item.user?.avatar} size="44px" />
                                <div className="flex flex-col">
                                    <span className="font-bold text-sm leading-tight">{item.user?.username}</span>
                                    <span className="text-gray-500 text-sm">{item.user?.fullName}</span>
                                </div>
                            </div>
                            <button 
                                className="p-1 text-gray-400 hover:text-black"
                                onClick={(e) => handleDeleteHistory(e, item.id)}
                            >
                                <AiOutlineClose size={18} />
                            </button>
                        </div>
                    ))
                ) : (
                    <div className="text-gray-500 text-sm text-center mt-10">
                        No recent searches.
                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPanel;
