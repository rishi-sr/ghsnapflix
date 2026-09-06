/**
 * S3 Videos – full GHSnapflix MP4 library from config.
 * Carousel & homepage rows use slices; Videos page lists every URL once.
 */
import { VIDEOS_CONFIG } from '../config/videos';
export const getVideoTitleFromUrl = (url) => {
    let name = url;
    try {
        if (url.startsWith('http')) {
            const pathname = new URL(url).pathname;
            const lastSeg = pathname.split('/').pop() || pathname;
            name = decodeURIComponent(lastSeg.replace(/\+/g, ' '));
        }
    }
    catch {
        // keep name as url
    }
    const withoutExt = name.replace(/\.(mp4|mov)$/i, '');
    let title = withoutExt.replace(/^\d+\.?\s*-\s*/, '').trim();
    title = title.replace(/\s*[\(\[]?\s*edits?\s*[\)\]]?$/i, '').trim();
    return title || name;
};
const normalizeVideoUrlForRequest = (url) => {
    try {
        const u = new URL(url);
        const segments = u.pathname.split('/').filter(Boolean);
        const encoded = '/' +
            segments
                .map((seg) => {
                try {
                    return encodeURIComponent(decodeURIComponent(seg.replace(/\+/g, ' ')));
                }
                catch {
                    return encodeURIComponent(seg.replace(/\+/g, ' '));
                }
            })
                .join('/');
        return u.origin + encoded;
    }
    catch {
        return url;
    }
};
export const getVideoUrl = (videoPath) => {
    if (videoPath.startsWith('http://') || videoPath.startsWith('https://')) {
        return normalizeVideoUrlForRequest(videoPath);
    }
    const parts = videoPath.split('/');
    const encodedParts = parts.map((part) => encodeURIComponent(part));
    return `/videos/${encodedParts.join('/')}`;
};
export const getVideoMimeType = (urlOrPath) => {
    const pathOnly = urlOrPath.split('?')[0].split('#')[0];
    return /\.mov$/i.test(pathOnly) ? 'video/quicktime' : 'video/mp4';
};
/** Use first N videos across carousel, homepage rows, and library. */
const CATALOG_LIMIT = 100;
const S3_URLS = VIDEOS_CONFIG.s3VideoUrls.slice(0, CATALOG_LIMIT);
const sliceWrap = (start, count) => {
    const n = S3_URLS.length;
    if (n === 0)
        return [];
    const out = [];
    for (let i = 0; i < count; i++) {
        const idx = (start + i) % n;
        const url = S3_URLS[idx];
        out.push({
            id: idx + 1,
            name: getVideoTitleFromUrl(url),
            videoPath: url,
            description: getVideoTitleFromUrl(url),
            category: undefined,
        });
    }
    return out;
};
/** Full catalog: one row per video, stable ids 1..N */
export const allVideos = S3_URLS.map((url, i) => ({
    id: i + 1,
    name: getVideoTitleFromUrl(url),
    videoPath: url,
    description: getVideoTitleFromUrl(url),
    category: 'Featured',
}));
const CAROUSEL_COUNT = 10;
/** 10 + 18×5 = 100 videos across carousel + five homepage rows */
const ROW_LEN = 18;
const ROW_STARTS = [10, 28, 46, 64, 82];
const withCategory = (items, category) => items.map((v) => ({ ...v, category }));
export const carouselVideos = withCategory(sliceWrap(0, CAROUSEL_COUNT), 'Carousel');
export const topTrendingVideos = withCategory(sliceWrap(ROW_STARTS[0], ROW_LEN), 'Top Trending');
export const adventureVideos = withCategory(sliceWrap(ROW_STARTS[1], ROW_LEN), 'Adventure');
export const actionVideos = withCategory(sliceWrap(ROW_STARTS[2], ROW_LEN), 'Action');
export const brainteaseVideos = withCategory(sliceWrap(ROW_STARTS[3], ROW_LEN), 'Brain Tease');
export const fightingVideos = withCategory(sliceWrap(ROW_STARTS[4], ROW_LEN), 'Fighting');
export const CAROUSEL_VIDEOS = sliceWrap(0, CAROUSEL_COUNT).map((v) => v.videoPath);
export const TOP_TRENDING_VIDEOS = sliceWrap(ROW_STARTS[0], ROW_LEN).map((v) => v.videoPath);
export const ADVENTURE_VIDEOS = sliceWrap(ROW_STARTS[1], ROW_LEN).map((v) => v.videoPath);
export const ACTION_VIDEOS = sliceWrap(ROW_STARTS[2], ROW_LEN).map((v) => v.videoPath);
export const BRAINTEASE_VIDEOS = sliceWrap(ROW_STARTS[3], ROW_LEN).map((v) => v.videoPath);
export const FIGHTING_VIDEOS = sliceWrap(ROW_STARTS[4], ROW_LEN).map((v) => v.videoPath);
