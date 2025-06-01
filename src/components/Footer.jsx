import React from 'react';
import './Footer.css';
import 'boxicons/css/boxicons.min.css';

const Footer = () => {
  return (
    <section className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <p>© 2025 Penny Hsiao. All rights reserved.</p>
          
          <ul>
            <li>
              <a href="https://www.linkedin.com/in/penny-hsiao1/" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-linkedin-square'></i>
              </a>
            </li>
            <li>
              <a href="https://github.com/PennyHS" target="_blank" rel="noopener noreferrer">
                <i className='bx bxl-github'></i>
              </a>
            </li>
            <li>
              <a href="https://www.pennyhsiao.com/">
              <i class='bx bx-link'></i>
              </a>
              </li>
          </ul>
          
          <p className="policy-text">
             Tutorial project inspired by JavaScript Mastery's Zentry clone
          </p>
        </div>
      </div>
    </section>
  );
};

export default Footer;