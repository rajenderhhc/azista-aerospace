import React from 'react';
import './dashboard.css';

const Footer = ({ showSidebar }) => {
  return (
    <footer
      className='footer-container'
      style={{ width: showSidebar ? '80%' : '100%' }}>
      <div>
        Copyright © {new Date().getFullYear()}{' '}
        <a
          style={{ textDecoration: 'none', color: 'black' }}
          href='https://www.azistaindustries.com/'
          target='_blank'
          rel='noopener noreferrer'>
          Azistaindustries
        </a>
      </div>
    </footer>
  );
};

export default Footer;
