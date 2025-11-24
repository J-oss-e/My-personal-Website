import Head from 'next/head';
import React from 'react';
import sw from '../data/data.js';

const AFF_LOGOS = {
  Jedi: '/images/jedi.png',
  Sith: '/images/sith.png',
  Rebellion: '/images/rebel.png',
  Empire: '/images/empire.png',
};

const isGood = (aff) => ['Jedi', 'Rebellion'].includes(aff);

function useSessionState(key, initial) {
  const [state, setState] = React.useState(() => {
    try {
      const raw = typeof window !== 'undefined' && sessionStorage.getItem(key);
      return raw ? JSON.parse(raw) : initial;
    } catch {
      return initial;
    }
  });
  React.useEffect(() => {
    try {
      if (typeof window !== 'undefined') sessionStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState];
}

export default function DemoReact() {
  const [selected, setSelected] = React.useState(null);
  const [likesMap, setLikesMap] = useSessionState('sw_likes', {});
  const [commentsMap, setCommentsMap] = useSessionState('sw_comments', {});

  const onLike = (idx) => {
    setLikesMap((prev) => {
      const next = { ...prev };
      const id = sw[idx].title;
      next[id] = next[id] || { likes: 0, dislikes: 0 };
      next[id].likes = (next[id].likes || 0) + 1;
      return next;
    });
  };
  const onDislike = (idx) => {
    setLikesMap((prev) => {
      const next = { ...prev };
      const id = sw[idx].title;
      next[id] = next[id] || { likes: 0, dislikes: 0 };
      next[id].dislikes = (next[id].dislikes || 0) + 1;
      return next;
    });
  };

  const addComment = (idx, name, text) => {
    setCommentsMap((prev) => {
      const next = { ...prev };
      const id = sw[idx].title;
      next[id] = next[id] || [];
      next[id].push({ name, text, time: Date.now() });
      return next;
    });
  };

  return (
    <>
      <Head>
        <title>Star Wars React Demo</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.1/dist/css/bootstrap.min.css"
          rel="stylesheet"
        />
        <style>{`
          .movie-card { cursor: pointer; transition: transform .12s ease; }
          .movie-card:hover { transform: translateY(-4px); }
          .affiliation-logo { width: 100%; height: 200px; object-fit: cover; }
          .movie-poster { width: 100%; height: 200px; object-fit: cover; }
          .aff-good { border: 3px solid #0d6efd; }
          .aff-evil { border: 3px solid #dc3545; }
          .likes { margin-right: 8px; }
          .comments { margin-top: 1rem; }
        `}</style>
      </Head>

      <div className="container py-4">
        <h1 className="mb-4">Star Wars — React Demo</h1>
        <div className="row g-3">
          {sw.map((m, i) => (
            <MovieCard
              key={i}
              movie={m}
              index={i}
              onMore={() => setSelected(i)}
              onLike={() => onLike(i)}
              onDislike={() => onDislike(i)}
              likes={likesMap[m.title] || { likes: 0, dislikes: 0 }}
            />
          ))}
        </div>

        {selected !== null && (
          <Details
            movie={sw[selected]}
            comments={commentsMap[sw[selected].title] || []}
            onAddComment={(name, text) => addComment(selected, name, text)}
          />
        )}
      </div>
    </>
  );
}

function MovieCard({ movie, index, onMore, onLike, onDislike, likes }) {
  const [imgSrc, setImgSrc] = React.useState('/images/' + movie.poster);
  const [affClass, setAffClass] = React.useState('');

  const handleEnter = () => {
    const logo = AFF_LOGOS[movie.best_character.affiliation];
    if (logo) setImgSrc(logo);
    setAffClass(isGood(movie.best_character.affiliation) ? 'aff-good' : 'aff-evil');
  };
  const handleLeave = () => {
    setImgSrc('/images/' + movie.poster);
    setAffClass('');
  };

  return (
    <div className="col-12 col-sm-6 col-md-4">
      <div className={`card movie-card ${affClass}`} onMouseEnter={handleEnter} onMouseLeave={handleLeave}>
        <img src={imgSrc} className="card-img-top movie-poster" alt={movie.title} />
        <div className="card-body">
          <h5 className="card-title">{movie.title}</h5>
          <h6 className="card-subtitle text-muted mb-2">{movie.year}</h6>
          <div>
            <button className="btn btn-sm btn-link" onClick={onMore}>
              More...
            </button>
            <button className="btn btn-sm btn-outline-primary likes" onClick={onLike}>
              👍 {likes.likes || 0}
            </button>
            <button className="btn btn-sm btn-outline-danger" onClick={onDislike}>
              👎 {likes.dislikes || 0}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function Details({ movie, comments, onAddComment }) {
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');

  const submit = (e) => {
    e.preventDefault();
    if (!name.trim() || !text.trim()) return;
    onAddComment(name.trim(), text.trim());
    setText('');
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-4">
            <img src={'/images/' + movie.best_character.image} alt={movie.best_character.name} className="img-fluid" />
          </div>
          <div className="col-md-8">
            <h3>{movie.best_character.name}</h3>
            <p>{movie.best_character.bio}</p>
            <p>
              <strong>Affiliation: </strong> {movie.best_character.affiliation}
            </p>
          </div>
        </div>

        <hr />

        <div className="comments">
          <h5>Comments</h5>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            <ul className="list-group mb-3">
              {comments.map((c, i) => (
                <li key={i} className="list-group-item">
                  <strong>{c.name}: </strong>
                  {c.text}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={submit}>
            <div className="mb-2">
              <input className="form-control" placeholder="Your name" value={name} onChange={(ev) => setName(ev.target.value)} />
            </div>
            <div className="mb-2">
              <textarea className="form-control" placeholder="Your comment" value={text} onChange={(ev) => setText(ev.target.value)} />
            </div>
            <button className="btn btn-primary" type="submit">
              Add comment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
