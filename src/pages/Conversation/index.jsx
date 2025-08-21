import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserConversations, fetchRoleplayConversations } from "../../services/api";
import "./ConversationStyles.css";
import ConversationItem from "./components/ConversationItem";
import { FETCH_USER_BOT_DATA } from "../../store/bot/actionTypes"; // Import the action type or action creator


const Conversation = () => {
    const [practiceConversations, setPracticeConversations] = useState([]);
    const [roleplayConversations, setRoleplayConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [modal, setModal] = useState(false);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const tenantId = useSelector(
        (state) => state.onboardingReducer.data?.tenant_id || state.login.user?.tenant_id
    );
    const username = useSelector((state) => state.login.user?.username);
    const botData = useSelector((state) => state.botReducer.botData);
    const navigate = useNavigate();
    const dispatch = useDispatch(); // Initialize useDispatch
    const limit = 10;

    const loadConversations = useCallback(async () => {
        try {
            const [practiceData, roleplayData] = await Promise.all([
                fetchUserConversations(tenantId, username, page, limit),
                fetchRoleplayConversations(tenantId, username, page, limit)
            ]);
            setPracticeConversations(prev => [...prev, ...practiceData]);
            setRoleplayConversations(prev => [...prev, ...roleplayData]);
            if (practiceData.length < limit && roleplayData.length < limit) {
                setHasMore(false);
            }
        } catch (error) {
            setError("Failed to load conversations");
        } finally {
            setLoading(false);
        }
    }, [tenantId, username, page, limit]);

    useEffect(() => {
        if (tenantId && username) {
            loadConversations();
            dispatch({ type: FETCH_USER_BOT_DATA, payload: { tenantId, username } }); // Dispatch the action
        }
    }, [tenantId, username, page, loadConversations, dispatch]);

    const toggleModal = useCallback((conversation) => {
        setSelectedConversation(conversation);
        setModal(!modal);
    }, [modal]);

    const viewDetails = useCallback((conversation) => {
        navigate("/conversation-details", { state: { conversation } });
    }, [navigate]);

    /*const getBotDetails = (bot_id) => {
        if (!bot_id) {
            return {
                name: "Allison McDonald",
                title: "President at SoftTech",
                company: "SoftTech",
                picture: "default_picture_url" // Replace with actual default picture URL
            };
        }
        const bot = botData.find(bot => bot.bot_id === bot_id);
        return bot ? {
            name: bot.name,
            title: bot.title,
            company: bot.company,
            picture: bot.picture
        } : {
            name: "Allison McDonald",
            title: "President at SoftTech",
            company: "SoftTech",
            picture: "default_picture_url" // Replace with actual default picture URL
        };*/
    //};

    const getBotDetails = (bot_id) => {
        const defaultBot = {
            name: "Allison McDonald",
            title: "President at SoftTech",
            company: "SoftTech",
            picture: "default_picture_url" // Replace with actual default picture URL
        };

        const data = bot_id ? botData.find(bot => bot.bot_id === bot_id) : defaultBot;
        return data || defaultBot;
    };



    const totalConversations = useMemo(() => {
        return [...practiceConversations, ...roleplayConversations].sort(
            (a, b) => new Date(b.call_createdAt) - new Date(a.call_createdAt)
        ).map(conversation => ({
            ...conversation,
            botDetails: getBotDetails(conversation.bot_id)
        }));
    }, [practiceConversations, roleplayConversations, botData]);

    if (loading && page === 1) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <>
            {selectedConversation && (
                <Modal isOpen={modal} toggle={toggleModal}>
                    <ModalHeader toggle={toggleModal}>Conversation Recording</ModalHeader>
                    <ModalBody>
                        <audio controls>
                            <source src={selectedConversation.recordingUrl} type="audio/wav" />
                            Your browser does not support the audio element.
                        </audio>
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={toggleModal}>
                            Close
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
            <div className="flex flex-col gap-4 w-full h-[calc(100vh-70px)] overflow-y-auto mt-[70px] font-Gilroy py-3 px-3 bg-background text-white">
                {/* main heading */}
                <h1 className="font-semibold text-[28px] leading-[34px]">
                    Conversations
                </h1>

                {/* practice conversation list */}
                <ul className="flex flex-row flex-wrap items-stretch gap-3 w-full h-max">
                    {totalConversations.length > 0 &&
                        totalConversations.map((conversations) => (
                            <ConversationItem
                                key={conversations.call_id}
                                conversations={conversations}
                                toggleModal={toggleModal}
                                viewDetails={viewDetails}
                                botDetails={conversations.botDetails} // Pass bot details to ConversationItem
                            />
                        ))}
                </ul>
                {hasMore && (
                    <Button onClick={() => setPage(prev => prev + 1)} disabled={loading}>
                        {loading ? 'Loading...' : 'Load More'}
                    </Button>
                )}
            </div>
        </>
    );
};

export default Conversation;