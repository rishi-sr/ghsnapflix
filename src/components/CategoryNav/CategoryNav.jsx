import React, { useRef } from 'react';
import './CategoryNav.scss';

const CATEGORIES = [
  {
    id: 'anime',
    name: 'Anime',
    image: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'action',
    name: 'Action',
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'adventure',
    name: 'Adventure',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'fighting',
    name: 'Fighting',
    image: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'thriller',
    name: 'Thriller',
    image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&auto=format&fit=crop&q=80',
  },
  {
    id: 'comedy',
    name: 'Comedy',
    image: 'https://images.unsplash.com/photo-1569003339405-ea396a5a8a90?w=300&auto=format&fit=crop&q=80',
  },
];

export default function CategoryNav({ activeCategory = 'all', onSelectCategory }) {
  const scrollRef = useRef(null);

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: 'smooth' });
    }
  };

  return (
    <section className="category-nav-section" aria-label="Anime Categories">
      <div className="category-nav-inner">
        <div className="category-scroll-container" ref={scrollRef}>
          {/* All Pill */}
          <button
            type="button"
            className="category-card-all"
            onClick={() => onSelectCategory('all')}
          >
            <svg viewBox="0 0 24 24">
              <rect x="3" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="3" width="7" height="7" rx="1.5" />
              <rect x="14" y="14" width="7" height="7" rx="1.5" />
              <rect x="3" y="14" width="7" height="7" rx="1.5" />
            </svg>
            <span>All</span>
          </button>

          {/* Dynamic Categories */}
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              className={`category-item-wrap ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
            >
              <div className="category-thumb-card">
                <img src={cat.image} alt={cat.name} loading="lazy" />
              </div>
              <span className="cat-label">{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Scroll Next Arrow */}
        <button
          type="button"
          className="scroll-next-btn"
          onClick={scrollRight}
          aria-label="Scroll Categories Right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </section>
  );
}

