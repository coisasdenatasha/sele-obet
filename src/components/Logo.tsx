import React from 'react';

interface LogoProps {
    size?: 'sm' | 'md' | 'lg';
    mode?: 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ size = 'md', mode = 'light' }) => {
    const logoSrc = mode === 'dark' ? '/path/to/dark-logo.png' : '/path/to/light-logo.png';

    const sizeClasses = {
        sm: 'h-8 w-8',
        md: 'h-12 w-12',
        lg: 'h-16 w-16',
    }[size];

    return <img src={logoSrc} alt="Esportes da Sorte Logo" className={sizeClasses} />;
};

export default Logo;