import { useState } from 'react';
import { ITEM_TYPES, createTournament } from '../utils/tournamentLogic';

export default function Creator({ onStart, onLoad }) {
    const [title, setTitle] = useState('');
    const [items, setItems] = useState([]);
    const [newItemUrl, setNewItemUrl] = useState('');
    const [newItemType, setNewItemType] = useState(ITEM_TYPES.YOUTUBE);
    const [bulkText, setBulkText] = useState('');

    const handleAddItem = () => {
        if (!newItemUrl) return;
        setItems([...items, {
            id: crypto.randomUUID(),
            content: newItemUrl,
            type: newItemType
        }]);
        setNewItemUrl('');
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
        <div className="glass-panel" style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Create Tournament</h2>

            <div style={{ marginBottom: '2rem' }}>
                <input
                    type="text"
                    placeholder="Tournament Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ width: '100%', padding: '0.8rem', fontSize: '1.2rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.3)', border: '1px solid #333', color: 'white' }}
                />

                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                    <select
                        value={newItemType}
                        onChange={(e) => setNewItemType(e.target.value)}
                        style={{ padding: '0.5rem', background: '#222', color: 'white', border: '1px solid #444' }}
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
                        style={{ flex: 1, padding: '0.5rem', background: '#222', color: 'white', border: '1px solid #444' }}
                    />
                    <button className="btn btn-blue" onClick={handleAddItem}>Add</button>
                </div>

                <details>
                    <summary style={{ cursor: 'pointer', color: '#aaa', marginBottom: '0.5rem' }}>Bulk Add (Paste List)</summary>
                    <textarea
                        value={bulkText}
                        onChange={(e) => setBulkText(e.target.value)}
                        placeholder="Paste URLs one per line..."
                        style={{ width: '100%', height: '100px', background: '#222', color: 'white', border: '1px solid #444', padding: '0.5rem' }}
                    />
                    <small style={{ color: '#888', display: 'block', marginTop: '0.2rem' }}>
                        Tip: Use <a href="https://www.youtubeplaylistanalyzer.com" target="_blank" rel="noreferrer" style={{ color: '#4a9eff' }}>youtubeplaylistanalyzer.com</a> to extract links from a playlist.
                    </small>
                    <button className="btn btn-primary" style={{ marginTop: '0.5rem' }} onClick={handleBulkAdd}>Process Bulk List</button>
                </details>
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h3>Items ({items.length})</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto', background: 'rgba(0,0,0,0.2)', padding: '1rem', marginTop: '0.5rem' }}>
                    {items.map((item, idx) => (
                        <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid #333' }}>
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '80%' }}>
                                [{item.type}] {item.content}
                            </span>
                            <button onClick={() => setItems(items.filter((_, i) => i !== idx))} style={{ color: 'red' }}>&times;</button>
                        </div>
                    ))}
                </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn btn-red" style={{ flex: 1 }} onClick={handleStart}>Start Battle</button>
                <button className="btn btn-primary" onClick={handleExport}>Save JSON</button>
                <label className="btn btn-primary" style={{ cursor: 'pointer' }}>
                    Import JSON
                    <input type="file" hidden accept=".json" onChange={handleImport} />
                </label>
            </div>
        </div>
    );
}
