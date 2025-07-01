import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Footer = () => {
  const location = useLocation();

  const navItems = [
    {
      name: 'Home',
      path: '/',
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M3 9.75L12 3l9 6.75V21a1.5 1.5 0 01-1.5 1.5H4.5A1.5 1.5 0 013 21V9.75z" />
        </svg>
      ),
    },
    {
      name: 'Groups',
      path: '/groups',
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M17 20h5v-2a4 4 0 00-5-4m-4-4a4 4 0 100-8 4 4 0 000 8zm6 8v2a4 4 0 01-8 0v-2a4 4 0 018 0zM6 20v-2a4 4 0 014-4H6a4 4 0 00-4 4v2h4z" />
        </svg>
      ),
    },
    {
      name: 'Friends',
      path: '/Friends',
      svg: (
        <svg
  xmlns="http://www.w3.org/2000/svg"
  className="w-6 h-6"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth={2}
>
  <path
    strokeLinecap="round"
    strokeLinejoin="round"
    d="M17 20h5v-2a4 4 0 00-5-4m-6 6H2v-2a4 4 0 014-4h6m0-6a4 4 0 11-8 0 4 4 0 018 0zm6-4a4 4 0 110 8 4 4 0 010-8z"
  />
</svg>

      ),
    },
    {
      name: 'Profile',
      path: '/profile',
      svg: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M12 12c2.67 0 8 1.34 8 4v4H4v-4c0-2.66 5.33-4 8-4zm0-2a4 4 0 110-8 4 4 0 010 8z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 w-full h-20 bg-black text-white flex justify-around items-center z-50 border-t border-t-white left-0">
      {navItems.map(({ name, path, svg }) => {
        const isActive = location.pathname === path;
        return (
          <Link
            key={name}
            to={path}
            className={`flex flex-col items-center text-xs px-4 py-2 rounded-xl transition ${
              isActive ? 'bg-white text-black font-semibold' : 'text-white'
            }`}
          >
            <div className="w-6 h-6">{svg}</div>
            <span>{name}</span>
          </Link>
        );
      })}
    </div>
  );
};

export default Footer;
