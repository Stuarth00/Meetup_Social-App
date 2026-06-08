import { useState, useContext, useEffect } from 'react';
import { AppContext } from "../../Context/GlobalState";
import type { LikeUser } from '../../Types/Interafaces';


export function usePostActions (post_id: string, initialLikes : LikeUser[]){
    const { toggleLike, getLikesByPostId, state, dispatch} = useContext(AppContext);
    const currentUserId = state.currentUser?.user_id;

    const [isLiked, setIsLiked] = useState(
        initialLikes?.some(like => like.user_id === currentUserId) || false
    );
    const [likesCount, setLikesCount]= useState(initialLikes?.length || 0);
    const [likesList, setLikesList] = useState(initialLikes || []);


    useEffect(() => {
        if(!currentUserId) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLiked(
            initialLikes?.some(
                like => like.user_id === currentUserId
            ) || false
        );
    }, [initialLikes, currentUserId]);

    useEffect(() => {
        if(!currentUserId) return;

        // eslint-disable-next-line react-hooks/set-state-in-effect
        setLikesCount(initialLikes.length || 0);
    }, [initialLikes]);

    const handleLike = async () => {
        if(!post_id) return;
        const pid = String(post_id);

        const previousIsLiked = isLiked;
        const previousLikeCount = likesCount;

        setIsLiked(!previousIsLiked);
        setLikesCount(prev => previousIsLiked ? prev -1 : prev + 1);

        try{
            const udpatedPost = await toggleLike(pid);
            
            dispatch({ type: "UPDATE_POST", payload: udpatedPost});
            console.log("updatedPost", udpatedPost);
        } catch(err) {
            setIsLiked(previousIsLiked);
            setLikesCount(previousLikeCount);
            return err;
        }
    }

    const handleSharePost = async () => {
        const shareUrl = `${window.location.origin}/posts/${post_id}`;
        const shareData = {
            title: "Check this post!",
            text: "I found this interesting post and wanted to share it with you",
            url: shareUrl,
        };
        if(navigator.share) {
            try{
                await navigator.share(shareData);
                console.log("Post shared successfully");
            } catch ( err ) {
                return err; 
            }
        } else { 
            navigator.clipboard
                .writeText(shareUrl)
                .then(() => {
                    alert("Post URL copied to clipboard!");
                })
                .catch((err) => {
                    return err;
                });
        }
    };

    const fetchLikesList = async () => {
        try {
            const data = await getLikesByPostId(post_id);
            setLikesList(data);
        } catch(err) {
            console.error("Failed to fetch likes list", err);
            return err;
        }
    };

    return {
        isLiked, 
        likesCount, 
        likesList,
        handleLike,
        handleSharePost,
        fetchLikesList,
    };
}