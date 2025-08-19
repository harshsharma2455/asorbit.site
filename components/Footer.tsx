import React from 'react';
import type { View } from '../App';

interface FooterProps {
    onNavigate: (view: View) => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
    return (
        <footer className="bg-transparent border-t border-slate-200">
            <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                    <div className="flex justify-center space-x-6 md:order-2">
                        <button onClick={() => onNavigate('features')} className="text-slate-500 hover:text-slate-900">Features</button>
                        <button onClick={() => onNavigate('process')} className="text-slate-500 hover:text-slate-900">Process</button>
                        <button onClick={() => onNavigate('contact')} className="text-slate-500 hover:text-slate-900">Contact</button>
                    </div>
                    <p className="mt-8 text-base text-slate-500 md:mt-0 md:order-1">
                        &copy; {new Date().getFullYear()} Asorbit. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
