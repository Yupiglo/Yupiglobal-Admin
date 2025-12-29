"use client";
import React from 'react';

interface FooterProps { }

/** Component to render Footer in common Dashboard layout */
const Footer: React.FC<FooterProps> = () => {
    return (
        <footer className="w-full bg-white border-t border-gray-100 py-6 px-8 text-center md:text-right">
            <p className="text-xs text-gray-400 font-medium">
                &copy; {new Date().getFullYear()} Redeyecreation. All rights reserved.
                <span className="mx-2 text-gray-300">|</span>
                <span className="text-gray-400">v1.0.0</span>
            </p>
        </footer>
    );
};

export default Footer;
