// This is a custom like button component that is used to like and unlike events.
// It is used in the EventHeader component to display the like button and the like count.

import React, { useState, useEffect } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAppContext } from '../../lib/context';

// Define keyframes for animations (can't do this directly inline)

export default function LikeButton({ isLiked: initialIsLiked, likeCount: initialLikeCount, onClick }) {
    const context = useAppContext();
    const [isLiked, setIsLiked] = useState(initialIsLiked);
    const [likeCount, setLikeCount] = useState(initialLikeCount);
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        setIsLiked(initialIsLiked);
    }, [initialIsLiked]);

    useEffect(() => {
        setLikeCount(initialLikeCount);
    }, [initialLikeCount]);

    const handleClick = () => {
        const newState = !isLiked;
        const newCount = newState ? likeCount + 1 : likeCount - 1;

        // Trigger animation
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 300);

        onClick();
    };

    const iconSize = 22;
    const likedColor = context.colorScheme.accentColor;
    const defaultColor = context.colorScheme.secondaryText;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
                onClick={handleClick}
                className='like-button-crazy'
                style={{
                    background: 'none',
                    border: 'none',
                    padding: '5px',
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    outline: 'none',
                    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    transform: isAnimating ? (isLiked ? 'scale(1.3)' : 'scale(0.8)') : 'scale(1)',
                    color: isLiked ? likedColor : defaultColor,
                }}
                aria-label={isLiked ? 'Unlike event' : 'Like event'}
                title={isLiked ? 'Unlike event' : 'Like event'}
            >
                <span style={{ transition: 'color 0.3s ease' }}>
                    {isLiked ? (
                        <FaHeart size={iconSize} />
                    ) : (
                        <FaRegHeart size={iconSize} />
                    )}
                </span>
            </button>
            <span style={{
                color: context.colorScheme.textColor,
                fontSize: '0.9rem',
                fontWeight: '600',
                fontVariantNumeric: 'tabular-nums',
                transition: 'color 0.3s ease',
            }}>
                {likeCount}
            </span>
        </div>
    );
} 