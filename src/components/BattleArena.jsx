import { useState, useEffect } from 'react';
import { ITEM_TYPES, getNextMatch, resolveMatch } from '../utils/tournamentLogic';

export default function BattleArena({ tournament, onUpdate, onComplete }) {
    const [match, setMatch] = useState(null);

    useEffect(() => {
        if (!tournament) return;
        if (tournament.completed) {
            onComplete(tournament);
            return;
        }
        const next = getNextMatch(tournament);
        if (!next) {
            // Round might be over, force logic to advance?
            // Wait, resolveMatch handles advancement. 
            // If getNextMatch returns null but not completed, it usually means we need to trigger round transition?
            // In my logic `resolveMatch` automatically pushes new rounds.
            // So if next is null and !completed, something is weird or we just finished the final match?
            // Ah, `resolveMatch` sets `completed = true` if final match finishes.
            // So this state should handle itself.
            console.log("No match found but not completed?", tournament);
        }
        setMatch(next);
    }, [tournament, onComplete]);

    const handleVote = (winnerId) => {
        if (!match) return;
        const winnerContent = match.p1.id === winnerId ? match.p1 : match.p2;
        const updated = resolveMatch(tournament, match.id, winnerContent);
        onUpdate(updated);
    };

    if (!match) return <div className="container" style={{ textAlign: 'center' }}>Loading match...</div>;

    // Helper to extract YouTube ID
    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const RenderItem = ({ item, side }) => {
        const isRed = side === 'left';
        const borderColor = isRed ? 'var(--color-primary-red)' : 'var(--color-primary-blue)';

        return (
            <div style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                border: `2px solid ${borderColor}`,
                borderRadius: '16px',
                overflow: 'hidden',
                position: 'relative',
                background: 'black'
            }}>
                <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {item.type === ITEM_TYPES.TEXT && (
                        <h1 style={{ padding: '2rem', textAlign: 'center', fontSize: '3rem' }}>{item.content}</h1>
                    )}
                    {item.type === ITEM_TYPES.IMAGE && (
                        <img src={item.content} alt="Content" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                    )}
                    {item.type === ITEM_TYPES.YOUTUBE && (
                        <iframe
                            width="100%"
                            height="100%"
                            src={`https://www.youtube.com/embed/${getYoutubeId(item.content)}?autoplay=1&mute=1`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                        />
                    )}
                </div>
                <button
                    onClick={() => handleVote(item.id)}
                    style={{
                        padding: '2rem',
                        fontSize: '1.5rem',
                        fontWeight: 'bold',
                        background: isRed ? 'var(--color-primary-red)' : 'var(--color-primary-blue)',
                        color: 'white',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'filter 0.3s'
                    }}
                    className="vote-btn"
                >
                    VOTE {isRed ? 'RED' : 'BLUE'}
                </button>
            </div>
        );
    };

    return (
        <div style={{ height: 'calc(100vh - 100px)', display: 'flex', gap: '1rem', padding: '1rem' }}>
            {/* If p2 is null (Bye), auto-skip? Logic should have handled this. */}
            <RenderItem item={match.p1} side="left" />

            <div style={{ width: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '2rem', fontStyle: 'italic' }}>
                VS
            </div>

            <RenderItem item={match.p2} side="right" />
        </div>
    );
}
