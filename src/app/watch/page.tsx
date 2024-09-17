"use client";
import React, { useState, useEffect, useRef } from 'react';

type ContinueWatchingItem = {
    id: string;
    item: any;
    season?: number | null;
    episode?: number | null;
    type: string;
};

export default function Player() {
    const [type, setType] = useState<string | null>(null);
    const [id, setId] = useState<string | null>(null);
    const [season, setSeason] = useState<number | null>(null);
    const [episode, setEpisode] = useState<number | null>(null);
    const [selectedServer, setSelectedServer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [availableServers, setAvailableServers] = useState<string[]>([]);
    const [errorServers, setErrorServers] = useState<string[]>([]);

    const videoRef = useRef<HTMLIFrameElement>(null);

    useEffect(() => {
        // Extract query parameters from URL
        const searchParams = new URLSearchParams(window.location.search);
        setType(searchParams.get('type'));
        setId(searchParams.get('id'));
        setSeason(searchParams.get('seasonNumber') ? parseInt(searchParams.get('seasonNumber')!) : null);
        setEpisode(searchParams.get('episodeNumber') ? parseInt(searchParams.get('episodeNumber')!) : null);
    }, []); // Empty dependency array means this runs once on component mount

    useEffect(() => {
        if (!id || !type) return;

        const fetchData = async () => {
            setLoading(true);
            setAvailableServers([]);
            setErrorServers([]);

            const servers = [
                { name: 'PRO', url: getProURL() },
                { name: 'TO', url: getToURL() },
                { name: 'SFLIX', url: getSflixURL() },
                { name: 'MULTI', url: getMultiURL() },
                { name: 'CLUB', url: getClubURL() },
                { name: 'XYZ', url: getXyzURL() },
                { name: 'TWO', url: getTwoURL() },
                { name: 'SS', url: getSsURL() }
            ];

            const validServers: string[] = [];
            const errorServersList: string[] = [];

            for (const { name, url } of servers) {
                const available = await checkServerAvailability(name, url);
                if (available) {
                    validServers.push(name);
                } else {
                    errorServersList.push(name);
                }
            }

            if (validServers.length > 0) {
                setAvailableServers(validServers);
                setSelectedServer(validServers[0]); // Set default server
            }

            if (errorServersList.length > 0) {
                setErrorServers(errorServersList);
            }

            setLoading(false);
        };

        fetchData();
    }, [id, type]); // Add dependencies to re-run when id or type changes

    const getServerURL = (): string => {
        switch (selectedServer) {
            case 'PRO':
                return getProURL();
            case 'TO':
                return getToURL();
            case 'SFLIX':
                return getSflixURL();
            case 'MULTI':
                return getMultiURL();
            case 'CLUB':
                return getClubURL();
            case 'XYZ':
                return getXyzURL();
            case 'TWO':
                return getTwoURL();
            case 'SS':
                return getSsURL();
            default:
                return '';
        }
    };

    // Helper functions for URL construction
    const getProURL = () => `https://vidsrc.pro/embed/${type === 'tv' ? 'tv' : 'movie'}/${id ?? ''}${season && episode ? `/${season}/${episode}` : ''}`;
    const getToURL = () => `https://vidsrc.to/embed/${type === 'tv' ? 'tv' : 'movie'}/${id ?? ''}${season && episode ? `/${season}/${episode}` : ''}`;
    const getSflixURL = () => `https://watch.streamflix.one/${type === 'tv' ? 'tv' : 'movie'}/${id ?? ''}/watch?server=1${season && episode ? `&season=${season}&episode=${episode}` : ''}`;
    const getMultiURL = () => `https://multiembed.mov/?video_id=${id ?? ''}${season && episode ? `&s=${season}&e=${episode}` : ''}`;
    const getClubURL = () => `https://moviesapi.club/${type === 'tv' ? 'tv' : 'movie'}/${id ?? ''}${season && episode ? `-${season}-${episode}` : ''}`;
    const getXyzURL = () => `https://vidsrc.xyz/embed/${type === 'tv' ? 'tv' : 'movie'}/${id ?? ''}${season && episode ? `/${season}-${episode}` : ''}`;
    const getTwoURL = () => `https://www.2embed.cc/embed${type === 'tv' ? 'tv' : 'movie'}/${id ?? ''}${season && episode ? `&s=${season}&e=${episode}` : ''}`;
    const getSsURL = () => `https://player.smashy.stream/${type === 'tv' ? 'tv' : 'movie'}/${id ?? ''}${season && episode ? `?s=${season}&e=${episode}` : ''}`;

    // Function to check if the video is available on a given server
    const checkServerAvailability = async (serverName: string, url: string) => {
        try {
            const response = await fetch(url, { method: 'HEAD' }); // Use HEAD request to check if the resource exists
            return response.ok;
        } catch (error) {
            console.error(`Error checking availability for server ${serverName}:`, error);
            return false;
        }
    };

    const updateContinueWatching = (item: ContinueWatchingItem) => {
        let continueWatching: ContinueWatchingItem[] = [];
        try {
            continueWatching = JSON.parse(localStorage.getItem('continueWatching') ?? '[]');
        } catch (e) {
            console.error('Error parsing continueWatching from localStorage:', e);
            continueWatching = [];
        }

        if (!Array.isArray(continueWatching)) {
            continueWatching = [];
        }

        continueWatching = continueWatching.filter(watch => watch.id !== item.id);
        continueWatching.unshift(item);

        if (continueWatching.length > 10) {
            continueWatching = continueWatching.slice(0, 10);
        }

        localStorage.setItem('continueWatching', JSON.stringify(continueWatching));
    };

    return (
        <div className="flex flex-col w-full h-screen bg-gradient-to-b from-gray-900 to-black text-white">
            {loading ? (
                <div className="flex justify-center items-center h-full text-xl text-gray-300">
                    Loading...
                </div>
            ) : (
                <>
                    <div className="fixed top-4 right-4 z-10 flex items-center space-x-4">
                        <select
                            value={selectedServer}
                            onChange={(e) => setSelectedServer(e.target.value)}
                            className="bg-gray-800 text-white border border-gray-700 p-2 rounded w-auto"
                        >
                            {availableServers.map(server => (
                                <option key={server} value={server}>{server}</option>
                            ))}
                        </select>
                    </div>
                    
                    <iframe
                        ref={videoRef}
                        src={getServerURL()}
                        className="flex-1 w-full h-full"
                        frameBorder="0"
                        allowFullScreen
                        title="Video Player"
                    />
                </>
            )}
        </div>
    );
}
