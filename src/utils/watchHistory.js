import { TRENDING_ANIME_VIDEOS } from '../config/animeCatalog.js';

const WATCH_HISTORY_STORAGE_KEY = 'ghsnapflix_watch_history';

export const DEFAULT_WATCH_HISTORY = [
  {
    id: 'trend-1',
    title: 'The Promise Of Zoro',
    duration: '02:14',
    date: '2 hours ago',
    thumbnail: '/thumbnails/zoro.jpg',
    category: 'Action',
    videoUrl: TRENDING_ANIME_VIDEOS[0]?.videoUrl || '',
  },
  {
    id: 'trend-2',
    title: 'Sung Jin Woo Aura',
    duration: '01:56',
    date: '1 day ago',
    thumbnail: '/thumbnails/jinwoo.jpg',
    category: 'Action',
    videoUrl: TRENDING_ANIME_VIDEOS[1]?.videoUrl || '',
  },
  {
    id: 'trend-3',
    title: 'The Tale Of Naruto Uzumaki',
    duration: '03:21',
    date: '2 days ago',
    thumbnail: '/thumbnails/naruto.jpg',
    category: 'Adventure',
    videoUrl: TRENDING_ANIME_VIDEOS[2]?.videoUrl || '',
  },
  {
    id: 'trend-4',
    title: 'Gojo The Strongest',
    duration: '01:45',
    date: '3 days ago',
    thumbnail: '/thumbnails/gojo.jpg',
    category: 'Fighting',
    videoUrl: TRENDING_ANIME_VIDEOS[3]?.videoUrl || '',
  },
];

export function getWatchHistory() {
  try {
    const raw = localStorage.getItem(WATCH_HISTORY_STORAGE_KEY);
    if (!raw) {
      return DEFAULT_WATCH_HISTORY;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : DEFAULT_WATCH_HISTORY;
  } catch {
    return DEFAULT_WATCH_HISTORY;
  }
}

export function addToWatchHistory(video) {
  if (!video || (!video.title && !video.id)) return;

  try {
    const current = getWatchHistory();
    const itemTitle = video.title || 'Featured Anime Video';
    const itemId = video.id || `watch-${Date.now()}`;
    const itemThumb = video.thumbnail || video.thumbnailUrl || '/thumbnails/zoro.jpg';
    const itemCat = video.category || 'Anime';
    const itemDuration = video.duration || '02:30';

    const newEntry = {
      id: itemId,
      title: itemTitle,
      duration: itemDuration,
      date: 'Just now',
      timestamp: Date.now(),
      thumbnail: itemThumb,
      category: itemCat,
      videoUrl: video.videoUrl || '',
    };

    // Filter out previous duplicate entry
    const filtered = current.filter(
      (item) => item.id !== itemId && item.title.toLowerCase() !== itemTitle.toLowerCase()
    );

    const updated = [newEntry, ...filtered].slice(0, 50);
    localStorage.setItem(WATCH_HISTORY_STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('watchHistoryUpdated'));
    return updated;
  } catch (err) {
    console.error('Failed to add to watch history:', err);
  }
}

export function clearWatchHistory() {
  try {
    localStorage.setItem(WATCH_HISTORY_STORAGE_KEY, JSON.stringify([]));
    window.dispatchEvent(new Event('watchHistoryUpdated'));
  } catch (err) {
    console.error('Failed to clear watch history:', err);
  }
}

export function getContinueWatching(history = []) {
  const source = history.length > 0 ? history : getWatchHistory();
  if (!source || source.length === 0) {
    return null;
  }
  const top = source[0];
  return {
    id: `continue-${top.id}`,
    title: top.title,
    duration: top.duration || '02:14',
    progressPercent: 65,
    timeLeft: '15 min left',
    thumbnail: top.thumbnail || '/thumbnails/zoro.jpg',
    category: top.category || 'Action',
    videoUrl: top.videoUrl || '',
  };
}

export function getWatchStats(history = []) {
  const count = history.length;
  const computedHours = Math.max(12, count * 3 + 18);
  const computedDownloads = Math.max(2, Math.floor(count / 2) + 1);
  return {
    watchTime: `${computedHours} hours`,
    contentWatched: count,
    downloads: computedDownloads,
  };
}
