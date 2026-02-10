import { useState } from 'react';
import { ITEM_TYPES, createTournament } from '../utils/tournamentLogic';

export default function Creator({ onStart, onLoad }) {
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([]);
    const [newItemUrl, setNewItemUrl] = useState('');
    const [newItemLabel, setNewItemLabel] = useState('');
    const [newItemType, setNewItemType] = useState(ITEM_TYPES.YOUTUBE);
    const [bulkText, setBulkText] = useState('');

    const handleAddItem = () => {
        if (!newItemUrl) return;
        setItems([...items, {
            id: crypto.randomUUID(),
            content: newItemUrl,
            label: newItemLabel,
            type: newItemType
        }]);
        setNewItemUrl('');
        setNewItemLabel('');
    };

    const handleBulkAdd = () => {
        // Simple parser: split by newlines, detect type
        const lines = bulkText.split('\n').filter(l => l.trim().length > 0);
        const newItems = lines.map(line => {
            let type = ITEM_TYPES.TEXT;
            if (line.includes('youtube.com') || line.includes('youtu.be')) type = ITEM_TYPES.YOUTUBE;
            else if (line.match(/\.(jpeg|jpg|gif|png)$/)) type = ITEM_TYPES.IMAGE;

            return {
                id: crypto.randomUUID(),
                content: line.trim(),
                type
            };
        });
        setItems([...items, ...newItems]);
        setBulkText('');
    };

    const handleStart = () => {
        if (items.length < 2) return alert('Need at least 2 items!');
        const tournament = createTournament(title || 'Untitled Tournament', items);
        onStart(tournament);
    };

    const handleExport = () => {
        if (items.length === 0) return;
        const data = JSON.stringify({ title, items }, null, 2);
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'versusite-tournament.json';
        a.click();
    };

    const handleImport = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                if (data.items) {
                    setTitle(data.title || '');
                    setItems(data.items);
                }
            } catch (err) {
                alert('Invalid JSON');
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="glass-panel animate-slide-up" style={{
            padding: 'clamp(1.5rem, 3vw, 2.5rem)',
            maxWidth: '900px',
            margin: '2rem auto'
        }}>
            <h2 style={{
                marginBottom: '2rem',
                fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                background: 'linear-gradient(135deg, var(--color-primary-blue), var(--color-accent-purple))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
            }}>
                <a style={{ color: 'white', textDecoration: 'none' }}>Create Tournament</a>
            </h2>

            <div style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Tournament Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{
                        width: '100%',
                        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                        marginBottom: '1.5rem',
                        fontWeight: '500'
                    }}
                />

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                }}>
                    <select
                        value={newItemType}
                        onChange={(e) => setNewItemType(e.target.value)}
                        style={{
                            padding: '0.75rem',
                            fontSize: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value={ITEM_TYPES.YOUTUBE}>YouTube</option>
                        <option value={ITEM_TYPES.IMAGE}>Image</option>
                        <option value={ITEM_TYPES.TEXT}>Text</option>
                    </select>
                    <input
                        type="text"
                        placeholder="URL or Text content"
                        value={newItemUrl}
                        onChange={(e) => setNewItemUrl(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                        style={{ fontSize: '1rem' }}
                    />
                </div>

                <div style={{
                    display: 'flex',
                    gap: '0.75rem',
                    flexWrap: 'wrap'
                }}>
                    <input
                        type="text"
                        placeholder="Label (Optional)"
                        value={newItemLabel}
                        onChange={(e) => setNewItemLabel(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
                        style={{
                            flex: '1 1 200px',
                            fontSize: '1rem'
                        }}
                    />
                    <button
                        className="btn btn-blue animate-scale-in"
                        onClick={handleAddItem}
                        style={{
                            padding: '0.75rem 2rem',
                            fontSize: '1rem',
                            fontWeight: '700'
                        }}
                    >
                        Add Item
                    </button>
                </div>

                {newItemType === ITEM_TYPES.YOUTUBE && (
                    <PlaylistImporter onImport={(newItems) => setItems(prev => [...prev, ...newItems])} />
                )}

                {newItemType === ITEM_TYPES.IMAGE && (
                    <TopListImporter onImport={(newItems) => setItems(prev => [...prev, ...newItems])} />
                )}

                <details style={{ marginTop: '1.5rem' }}>
                    <summary style={{
                        cursor: 'pointer',
                        color: 'var(--color-text-muted)',
                        marginBottom: '0.75rem',
                        padding: '0.5rem',
                        borderRadius: '8px',
                        transition: 'all 0.2s',
                        fontWeight: '600'
                    }}>
                        📋 Bulk Add URLs (use <a href="https://www.youtubeplaylistanalyzer.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--color-primary-blue)' }}>YouTube Playlist Analyzer</a>)
                    </summary>
                    <textarea
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        placeholder="Paste URLs one per line..."
                        style={{
                            width: '100%',
                            height: '120px',
                            fontSize: '0.95rem',
                            fontFamily: 'monospace'
                        }}
                    />
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: '0.75rem' }}
                        onClick={handleBulkAdd}
                    >
                        Add URL List
                    </button>
                </details>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3 style={{
                    marginBottom: '1rem',
                    fontSize: 'clamp(1.3rem, 3vw, 1.6rem)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    Items
                    <span style={{
                        background: 'var(--color-primary-blue)',
                        color: '#000',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '20px',
                        fontSize: '0.9rem',
                        fontWeight: '900'
                    }}>
                        {items.length}
                    </span>
                </h3>
                <div style={{
                    maxHeight: '350px',
                    overflowY: 'auto',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '1rem',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)'
                }}>
                    {items.length === 0 ? (
                        <p style={{
                            textAlign: 'center',
                            color: 'var(--color-text-muted)',
                            padding: '2rem',
                            fontSize: '1.1rem'
                        }}>
                            No items yet. Add some above! 🎮
                        </p>
                    ) : (
                        items.map((item, idx) => (
                            <div
                                key={item.id}
                                className="animate-slide-in-left"
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '0.75rem',
                                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    transition: 'all 0.2s',
                                    borderRadius: '8px',
                                    marginBottom: '0.5rem'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                            >
                                <span style={{
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap',
                                    maxWidth: 'calc(100% - 80px)',
                                    fontSize: 'clamp(0.9rem, 2vw, 1rem)'
                                }}>
                                    <span style={{
                                        color: 'var(--color-accent-purple)',
                                        fontWeight: '700',
                                        marginRight: '0.5rem',
                                        fontSize: '0.85rem'
                                    }}>
                                        [{item.type}]
                                    </span>
                                    {item.label || item.content}
                                </span>
                                <button
                                    onClick={() => setItems(items.filter((_, i) => i !== idx))}
                                    style={{
                                        color: 'var(--color-primary-red)',
                                        background: 'transparent',
                                        border: 'none',
                                        fontSize: '1.5rem',
                                        cursor: 'pointer',
                                        padding: '0.25rem 0.5rem',
                                        transition: 'all 0.2s',
                                        borderRadius: '4px'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.background = 'rgba(255, 71, 87, 0.2)';
                                        e.target.style.transform = 'scale(1.2)';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.background = 'transparent';
                                        e.target.style.transform = 'scale(1)';
                                    }}
                                >
                                    ×
                                </button>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                gap: '1rem'
            }}>
                <button
                    className="btn btn-red animate-scale-in delay-100"
                    onClick={handleStart}
                    style={{
                        padding: '1rem 2rem',
                        fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
                        fontWeight: '800',
                        gridColumn: 'span 2'
                    }}
                >
                    🎮 Start Battle
                </button>
                <button
                    className="btn btn-primary animate-scale-in delay-200"
                    onClick={handleExport}
                    style={{ fontSize: 'clamp(0.9rem, 2vw, 1rem)' }}
                >
                    💾 Save JSON
                </button>
                <label
                    className="btn btn-primary animate-scale-in delay-300"
                    style={{
                        cursor: 'pointer',
                        fontSize: 'clamp(0.9rem, 2vw, 1rem)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    📂 Import JSON
                    <input type="file" hidden accept=".json" onChange={handleImport} />
                </label>
            </div>
        </div>
    );
}

function PlaylistImporter({ onImport }) {
    const [playlistUrl, setPlaylistUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchPlaylist = async () => {
        const listParam = playlistUrl.match(/[?&]list=([^&]+)/);
        if (!listParam) {
            setError('Invalid URL. Must contain "list=" parameter.');
            return;
        }
        const listId = listParam[1];
        const targetUrl = `https://m.youtube.com/playlist?list=${listId}`;

        setLoading(true);
        setError('');

        const strategies = [
            {
                name: 'CodeTabs Proxy',
                fetch: async () => {
                    const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`);
                    if (!res.ok) throw new Error(res.statusText);
                    return await res.text();
                }
            },
            {
                name: 'AllOrigins',
                fetch: async () => {
                    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`);
                    if (!res.ok) throw new Error(res.statusText);
                    const data = await res.json();
                    return data.contents;
                }
            },
            {
                name: 'CorsProxy',
                fetch: async () => {
                    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(targetUrl)}`);
                    if (!res.ok) throw new Error(res.statusText);
                    return await res.text();
                }
            }
        ];

        let html = '';
        let success = false;

        for (const strategy of strategies) {
            try {
                console.log(`Attempting fetch via ${strategy.name}...`);
                html = await strategy.fetch();
                if (html && html.length > 1000) {
                    success = true;
                    break;
                }
            } catch (e) {
                console.warn(`${strategy.name} failed:`, e);
            }
        }

        if (!success) {
            setLoading(false);
            setError('Failed to load playlist. Network or Proxy blocked.');
            return;
        }

        try {
            // Find ytInitialData
            const startStr = 'var ytInitialData = ';
            const startIdx = html.indexOf(startStr);

            if (startIdx === -1) throw new Error('ytInitialData not found. YouTube structure might have changed.');

            let endIdx = html.indexOf(';</script>', startIdx);
            if (endIdx === -1) endIdx = html.indexOf(';\n', startIdx);
            if (endIdx === -1) endIdx = html.indexOf(';', startIdx + startStr.length + 10000);

            if (endIdx === -1) throw new Error('JSON end not found');

            const jsonStr = html.substring(startIdx + startStr.length, endIdx);
            const jsonData = JSON.parse(jsonStr);

            // Traverse to find videos (supports desktop and mobile structures)
            let videos = [];

            const extractVideos = (root) => {
                let items = [];
                // Helper to find key recursively (limited depth)
                // But structure is somewhat known.
                // Mobile: contents.twoColumnBrowseResultsRenderer... or sectionListRenderer
                // Let's try standard paths first.

                try {
                    // Standard Desktop/Mobile path
                    const tabs = root.contents?.twoColumnBrowseResultsRenderer?.tabs ||
                        root.contents?.singleColumnBrowseResultsRenderer?.tabs;

                    if (tabs) {
                        const tab = tabs.find(t => t.tabRenderer?.selected);
                        const contents = tab?.tabRenderer?.content?.sectionListRenderer?.contents;
                        if (contents) {
                            // Iterating sections
                            contents.forEach(section => {
                                const list = section.itemSectionRenderer?.contents?.[0]?.playlistVideoListRenderer?.contents;
                                if (list) items = list;
                            });
                        }
                    }
                } catch (e) { }

                return items;
            };

            const rawItems = extractVideos(jsonData);

            if (rawItems.length > 0) {
                videos = rawItems
                    .filter(item => item.playlistVideoRenderer)
                    .map(item => {
                        const vid = item.playlistVideoRenderer;
                        return {
                            id: crypto.randomUUID(),
                            content: `https://www.youtube.com/watch?v=${vid.videoId}`,
                            type: ITEM_TYPES.YOUTUBE
                        };
                    });
            }

            if (videos.length === 0) {
                setError('No videos found in parsed data. Empty playlist?');
            } else {
                onImport(videos);
                setPlaylistUrl('');
                alert(`Imported ${videos.length} videos!`);
            }
        } catch (err) {
            console.error(err);
            setError(`Parse Error: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(46, 145, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(46, 145, 255, 0.2)'
        }}>
            <h4 style={{
                margin: '0 0 1rem 0',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                color: 'var(--color-primary-blue)'
            }}>
                📺 Import from YouTube Playlist
            </h4>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <input
                    type="text"
                    placeholder="https://www.youtube.com/playlist?list=..."
                    value={playlistUrl}
                    onChange={(e) => setPlaylistUrl(e.target.value)}
                    style={{
                        flex: '1 1 300px',
                        fontSize: '0.95rem'
                    }}
                />
                <button
                    className="btn btn-blue"
                    onClick={fetchPlaylist}
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        fontSize: '1rem'
                    }}
                >
                    {loading ? '⏳ Loading...' : '📥 Import'}
                </button>
            </div>
            {error && <p style={{ color: '#ff6b6b', marginTop: '0.75rem', fontSize: '0.9rem', fontWeight: '500' }}>⚠️ {error}</p>}
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '0.75rem', marginBottom: 0 }}>
                💡 Note: Fetches up to 100 first videos.
            </p>
        </div>
    );
}


function TopListImporter({ onImport }) {
    const [loading, setLoading] = useState(false);
    const [importCount, setImportCount] = useState(32);

    const importJikanTopAnime = async () => {
        setLoading(true);
        try {
            const pagesNeeded = Math.ceil(importCount / 25);
            let allAnime = [];

            for (let i = 1; i <= pagesNeeded; i++) {
                const response = await fetch(`https://api.jikan.moe/v4/top/anime?page=${i}`);
                if (!response.ok) throw new Error(`Jikan API Error: ${response.statusText}`);
                const data = await response.json();
                if (data.data) {
                    allAnime = [...allAnime, ...data.data];
                }
                // Small delay to be nice to Jikan API (limit is ~3/sec)
                await new Promise(r => setTimeout(r, 350));
            }

            const items = allAnime.slice(0, importCount).map(anime => ({
                id: crypto.randomUUID(),
                content: anime.images.jpg.image_url,
                label: `${anime.title} (${anime.year || '?'})`,
                type: ITEM_TYPES.IMAGE
            }));

            onImport(items);
            alert(`Imported ${items.length} Anime!`);
        } catch (e) {
            console.error(e);
            alert('Failed to fetch Anime: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    const importMockGames = () => {
        // Mock Top Games
        const games = [
            { name: "The Legend of Zelda: Ocarina of Time", year: 1998 },
            { name: "Grand Theft Auto IV", year: 2008 },
            { name: "SoulCalibur", year: 1998 },
            { name: "Super Mario Galaxy", year: 2007 },
            { name: "Super Mario Galaxy 2", year: 2010 },
            { name: "Red Dead Redemption 2", year: 2018 },
            { name: "Grand Theft Auto V", year: 2013 },
            { name: "Disco Elysium", year: 2019 },
            { name: "The Legend of Zelda: Breath of the Wild", year: 2017 },
            { name: "Tony Hawk's Pro Skater 2", year: 2000 },
            { name: "Metroid Prime", year: 2002 },
            { name: "Resident Evil 4", year: 2005 },
            { name: "Perfect Dark", year: 2000 },
            { name: "Halo: Combat Evolved", year: 2001 },
            { name: "Half-Life 2", year: 2004 },
            { name: "BioShock", year: 2007 },
            { name: "GoldenEye 007", year: 1997 },
            { name: "Uncharted 2: Among Thieves", year: 2009 },
            { name: "Batman: Arkham City", year: 2011 },
            { name: "Elden Ring", year: 2022 }
        ];

        let targetList = [...games];
        // If requested more than we have names for, generate generics
        if (importCount > games.length) {
            const needed = importCount - games.length;
            for (let i = 0; i < needed; i++) {
                targetList.push({ name: `Top Game #${games.length + i + 1}`, year: 2000 + (i % 24) });
            }
        }

        const items = targetList.slice(0, importCount).map((game, i) => ({
            id: crypto.randomUUID(),
            content: `https://placehold.co/300x400/png?text=${encodeURIComponent(game.name)}`,
            label: `${game.name} (${game.year})`,
            type: ITEM_TYPES.IMAGE
        }));
        onImport(items);
        alert(`Imported ${items.length} Mock Games (IGDB requires API Key)`);
    }

    const importTMDBMovies = async () => {
        setLoading(true);
        const TMDB_API_KEY = '12e3760af5607b44acdfb130bf0c9678';
        try {
            const pagesNeeded = Math.ceil(importCount / 20);
            let allMovies = [];

            for (let i = 1; i <= pagesNeeded; i++) {
                const response = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&page=${i}`);
                if (!response.ok) throw new Error(`TMDB API Error: ${response.statusText}`);
                const data = await response.json();
                if (data.results) {
                    allMovies = [...allMovies, ...data.results];
                }
                // Small delay to be safe
                await new Promise(r => setTimeout(r, 100));
            }

            const items = allMovies.slice(0, importCount).map(movie => ({
                id: crypto.randomUUID(),
                content: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                label: `${movie.title} (${movie.release_date?.substring(0, 4) || '?'})`,
                type: ITEM_TYPES.IMAGE
            }));

            onImport(items);
            alert(`Imported ${items.length} Movies from TMDB!`);
        } catch (e) {
            console.error(e);
            alert('Failed to fetch Movies: ' + e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            background: 'rgba(174, 112, 255, 0.05)',
            borderRadius: '12px',
            border: '1px solid rgba(174, 112, 255, 0.2)'
        }}>
            <h4 style={{
                margin: '0 0 1rem 0',
                fontSize: 'clamp(1.1rem, 2.5vw, 1.3rem)',
                color: 'var(--color-accent-purple)'
            }}>
                🎬 Import Top Lists
            </h4>

            <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <label style={{ color: 'var(--color-text-primary)', fontWeight: '600' }}>Item Count:</label>
                <input
                    type="number"
                    min="2"
                    max="100"
                    value={importCount}
                    onChange={(e) => setImportCount(Number(e.target.value))}
                    style={{
                        width: '80px',
                        textAlign: 'center',
                        fontWeight: '700',
                        fontSize: '1rem'
                    }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
                <button
                    className="btn btn-blue"
                    onClick={importJikanTopAnime}
                    disabled={loading}
                    style={{ background: '#2e51a2', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}
                >
                    {loading ? '⏳ Loading...' : '📺 MAL Top Anime'}
                </button>
                <button
                    className="btn btn-primary"
                    onClick={importMockGames}
                    style={{ background: '#9147ff', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}
                >
                    🎮 IGDB Top Games
                </button>
                <button
                    className="btn btn-primary"
                    onClick={importTMDBMovies}
                    disabled={loading}
                    style={{ background: '#01b4e4', color: 'white', fontSize: 'clamp(0.85rem, 2vw, 0.95rem)' }}
                >
                    {loading ? '⏳ Loading...' : '🎬 TMDB Top Movies'}
                </button>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.85rem', marginTop: '1rem', marginBottom: 0 }}>
                💡 Note: MAL and TMDB use real APIs. IGDB shows mock data.
            </p>
        </div>
    );
}
