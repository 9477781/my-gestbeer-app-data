
import React from 'react';

type Language = 'ja' | 'en';

interface HeaderProps {
    lang: Language;
    setLang: React.Dispatch<React.SetStateAction<Language>>;
}

const Header: React.FC<HeaderProps> = ({ lang, setLang }) => {
    const bannerImageUrl = 'https://images.unsplash.com/photo-1608225244979-5e74f88b5a75?q=80&w=2070&auto=format&fit=crop';

    const toggleLanguage = () => {
        const newLang = lang === 'ja' ? 'en' : 'ja';
        setLang(newLang);
        const url = new URL(window.location.href);
        url.searchParams.set('lang', newLang);
        window.history.pushState({}, '', url.toString());
    };

    return (
        <header className="relative h-64 bg-gray-800 text-white overflow-hidden">
            <button
                onClick={toggleLanguage}
                className="absolute top-5 right-5 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 text-white font-bold py-2 px-5 rounded-full transition-colors text-xl"
                aria-label="Toggle language"
            >
                {lang === 'ja' ? 'ENGLISH' : '日本語'}
            </button>
            
            {/* Background Image */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${bannerImageUrl})` }}
                aria-hidden="true"
            ></div>
            
            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black opacity-50" aria-hidden="true"></div>

            {/* Text Content */}
            <div className="relative h-full flex flex-col justify-center items-center text-center px-4">
                <h2 className="font-display text-9xl font-bold tracking-wider">GUEST BEER</h2>
                <p className="mt-2 text-4xl">ゲストビール</p>
            </div>
        </header>
    );
};

export default Header;
