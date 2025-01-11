import React from 'react';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
  footer: {
    backgroundColor: '#1976d2',
    color:'#fff',
    padding: '20px 0',
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
    minWidth: '200px',
    padding: '10px',
  },
  ul: {
    listStyle: 'none',
    
    padding: 0,
  },
  link: {
    textDecoration: 'none',
    color: '#fff',
    '&:hover': {
      textDecoration: 'underline', // Add underline on hover
    },
  },
  address: {
    maxWidth: '1200px',
    margin: '20px auto 0',
    textAlign: 'center',
  },
  copyright: {
    maxWidth: '1200px',
    margin: '20px auto',
    textAlign: 'center',
    borderTop: '1px solid #ddd',
    paddingTop: '10px',
  },
  responsive: {
    '@media (max-width: 768px)': {
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <footer className={classes.footer}>
      <div className={`${classes.container} ${classes.responsive}`}>
        {/* About Section */}
        <div className={classes.section}>
          <h4>ABOUT</h4>
          <ul className={classes.ul}>
            <li><a href="#" className={classes.link}>Contact Us</a></li>
            <li><a href="#" className={classes.link}>About Us</a></li>
            <li><a href="#" className={classes.link}>Careers</a></li>
            <li><a href="#" className={classes.link}>Altaneofin Stories</a></li>
            <li><a href="#" className={classes.link}>Press</a></li>
            <li><a href="#" className={classes.link}>Corporate Information</a></li>
          </ul>
        </div>

        {/* Group Companies Section */}
        <div className={classes.section}>
          <h4>GROUP COMPANIES</h4>
          <ul className={classes.ul}>
            <li><a href="#" className={classes.link}>Myntra</a></li>
            <li><a href="#" className={classes.link}>Cleartrip</a></li>
            <li><a href="#" className={classes.link}>Shopsy</a></li>
          </ul>
        </div>

        {/* Help Section */}
        <div className={classes.section}>
          <h4>HELP</h4>
          <ul className={classes.ul}>
            <li><a href="#" className={classes.link}>Payments</a></li>
            <li><a href="#" className={classes.link}>Shipping</a></li>
            <li><a href="#" className={classes.link}>Cancellation & Returns</a></li>
            <li><a href="#" className={classes.link}>FAQ</a></li>
          </ul>
        </div>

        {/* Consumer Policy Section */}
        <div className={classes.section}>
          <h4>CONSUMER POLICY</h4>
          <ul className={classes.ul}>
            <li><a href="#" className={classes.link}>Cancellation & Returns</a></li>
            <li><a href="#" className={classes.link}>Terms Of Use</a></li>
            <li><a href="#" className={classes.link}>Security</a></li>
            <li><a href="#" className={classes.link}>Privacy</a></li>
            <li><a href="#" className={classes.link}>Sitemap</a></li>
            <li><a href="#" className={classes.link}>Grievance Redressal</a></li>
            <li><a href="#" className={classes.link}>EPR Compliance</a></li>
          </ul>
        </div>
      </div>

      {/* Address Section */}
      

      {/* Social and Copyright Section */}
      <div className={classes.copyright}>
        <p>&copy; 2007-2025 Altaneofin.com</p>
        <p><a href="#" className={classes.link}>Become a Seller</a> | <a href="#" className={classes.link}>Advertise</a> | <a href="#" className={classes.link}>Gift Cards</a> | <a href="#" className={classes.link}>Help Center</a></p>
      </div>
    </footer>
  );
};

export default Footer;