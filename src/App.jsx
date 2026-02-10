import { useState, useEffect } from 'react'
import Creator from './components/Creator';
import BattleArena from './components/BattleArena';
import Footer from './components/Footer';
import { ITEM_TYPES, getRankings } from './utils/tournamentLogic';
import logo from './assets/logo.svg';
import backgroundImg from './assets/Background.jpg';

function App() {
  const [view, setView] = useState('LANDING'); // LANDING, CREATOR, BATTLE, RESULTS
  const [tournament, setTournament] = useState(null);

  const startTournament = (t) => {
    setTournament(t);
    setView('BATTLE');
  };

  const updateTournament = (t) => {
    setTournament(t);
    if (t.completed) {
      setView('RESULTS');
    }
  };

  // Extract ID for thumbnail
  const getContentPreview = (item) => {
    if (item.type === ITEM_TYPES.YOUTUBE) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = item.content.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt="Preview" style={{ height: '100px' }} />;
    }
    if (item.type === ITEM_TYPES.IMAGE) {
      return <img src={item.content} alt="Preview" style={{ height: '100px' }} />;
    }
    return <span>{item.content}</span>;
  }

  return (
    <div className="min-h-screen">
      <header className="container" style={{ padding: '2rem', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <img
          src={logo}
          alt="Versusite"
          className="title-gradient animate-fade-in"
          style={{ height: '4rem', cursor: 'pointer' }}
          onClick={() => {
            if (window.confirm('Return to home? Current progress may be lost.')) setView('LANDING');
          }}
        />
      </header>


      <main className="container">
        {view === 'LANDING' && (
          <div style={{
            minHeight: 'calc(100vh - 200px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            padding: '2rem'
          }}>
            {/* Background Image - Plus visible */}
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.70,
              zIndex: -1,
              filter: 'blur(1px)'
            }} />

            {/* Contenu centré */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              textAlign: 'center'
            }}>
              <div className="animate-slide-up delay-200" style={{ maxWidth: '800px', marginBottom: '3rem' }}>
                <p style={{
                  fontFamily: "'Cantora One', sans-serif",
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: '400',
                  lineHeight: '1.2'
                }}>
                  Create tournaments,
                </p>
                <p style={{
                  fontFamily: "'Cantora One', sans-serif",
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.5rem',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: '400',
                  lineHeight: '1.2'
                }}>
                  Rank everything,
                </p>
                <p style={{
                  fontFamily: "'Cantora One', sans-serif",
                  color: 'var(--color-text-primary)',
                  marginBottom: '2.5rem',
                  fontSize: 'clamp(2rem, 5vw, 3rem)',
                  fontWeight: '400',
                  lineHeight: '1.2'
                }}>
                  Decide the winner !
                </p>
                <p style={{
                  color: 'var(--color-text-muted)',
                  fontSize: 'clamp(1.1rem, 3vw, 1.4rem)',
                  lineHeight: '1.6',
                  marginBottom: '3rem',
                  fontWeight: '500'
                }}>
                  Support for Images, YouTube Videos, and Text.
                </p>
              </div>

              <button
                className="btn btn-blue animate-slide-up delay-300"
                style={{ fontSize: 'clamp(1.1rem, 3vw, 1.3rem)', padding: '1.1rem 2.8rem', fontWeight: '700' }}
                onClick={() => setView('CREATOR')}
              >
                Start a Tournament
              </button>
            </div>

            {/* Footer en bas */}
            <Footer />
          </div>
        )}

        {view === 'CREATOR' && (
          <div style={{ position: 'relative', minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            {/* Overlay sombre pour Creator seulement */}
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundImage: `url(${backgroundImg})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.40,
              zIndex: -2,
              filter: 'blur(3px)'
            }} />
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'rgba(0, 0, 0, 0.7)',
              zIndex: -1
            }} />
            <div style={{ flex: 1 }}>
              <Creator onStart={startTournament} onLoad={startTournament} />
            </div>
            <Footer />
          </div>
        )}

        {view === 'BATTLE' && tournament && (
          <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <BattleArena
                tournament={tournament}
                onUpdate={updateTournament}
                onComplete={(t) => { setTournament(t); setView('RESULTS'); }}
              />
            </div>
            <Footer />
          </div>
        )}

        {view === 'RESULTS' && tournament && tournament.winner && (
          <div style={{ minHeight: 'calc(100vh - 200px)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1 }}>
              <ResultsView tournament={tournament} onHome={() => setView('LANDING')} />
            </div>
            <Footer />
          </div>
        )}
      </main>
    </div>
  )
}

function ResultsView({ tournament, onHome }) {
  const [winnerTitle, setWinnerTitle] = useState(null);
  const [rankings, setRankings] = useState([]);

  // Fetch winner title
  useEffect(() => {
    if (!tournament.winner) return;

    // Calculate rankings immediately
    setRankings(getRankings(tournament));

    const fetchTitle = async () => {
      const item = tournament.winner;

      if (item.label) {
        setWinnerTitle(item.label);
        return;
      }

      if (item.type === ITEM_TYPES.YOUTUBE) {
        try {
          const response = await fetch(`https://noembed.com/embed?url=${item.content}`);
          const data = await response.json();
          setWinnerTitle(data.title || 'Watch Video');
        } catch (e) {
          setWinnerTitle('Watch Video');
        }
      } else if (item.type === ITEM_TYPES.IMAGE) {
        const name = item.content.split('/').pop();
        setWinnerTitle(name || 'View Image');
      } else {
        setWinnerTitle(item.content);
      }
    };
    fetchTitle();
  }, [tournament]);

  // Extract ID for thumbnail (helper duplicated or moved to scope, let's redefine locally or pass down)
  const getPreview = (item, large = false) => {
    if (item.type === ITEM_TYPES.YOUTUBE) {
      const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
      const match = item.content.match(regExp);
      const id = (match && match[2].length === 11) ? match[2] : null;
      return <img src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`} alt="Preview" style={{ height: large ? '300px' : '60px', borderRadius: '8px', objectFit: 'cover' }} />;
    }
    if (item.type === ITEM_TYPES.IMAGE) {
      return <img src={item.content} alt="Preview" style={{ height: large ? '300px' : '60px', borderRadius: '8px', objectFit: 'contain' }} />;
    }
    return <span style={{ fontSize: large ? '2rem' : '1rem' }}>{item.content}</span>;
  }

  return (
    <div className="glass-panel animate-slide-up" style={{ textAlign: 'center', padding: '3rem', maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '3rem', marginBottom: '1rem', fontWeight: '900' }} className="title-gradient">WINNER</h2>

      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
        <div style={{
          padding: '1rem',
          background: 'var(--color-bg-dark)',
          borderRadius: '20px',
          border: '2px solid var(--color-primary-blue)',
          boxShadow: '0 0 50px rgba(43, 110, 235, 1)'
        }}>
          {getPreview(tournament.winner, true)}
        </div>

        <h3 style={{ fontSize: '2rem', marginTop: '1rem' }}>
          {winnerTitle || 'Loading...'}
        </h3>

        {(tournament.winner.type === ITEM_TYPES.YOUTUBE || tournament.winner.type === ITEM_TYPES.IMAGE) && (
          <a
            href={tournament.winner.content}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-blue"
            style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            OPEN LINK <span>↗</span>
          </a>
        )}
      </div>

      <div style={{ textAlign: 'left', marginTop: '4rem' }}>
        <h3 style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1.5rem', fontSize: '1.5rem' }}>
          Tournament Rankings
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '1rem' }}>
          {rankings.map(({ rank, item }) => (
            <div key={item.id} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '1rem',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: '12px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: rank === 1 ? 'var(--color-primary-blue)' : 'rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '1.2rem',
                color: rank === 1 ? '#000' : '#fff'
              }}>
                #{rank}
              </div>
              <div style={{ width: '80px', display: 'flex', justifyContent: 'center' }}>
                {getPreview(item, false)}
              </div>
              <div style={{ flex: 1, fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {item.label || item.content}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '3rem' }}>
        <button className="btn btn-primary" onClick={onHome} style={{ padding: '1rem 3rem', fontSize: '1.2rem' }}>Return Home</button>
      </div>
    </div>
  );
}


export default App
