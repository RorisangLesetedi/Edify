'use client';

import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      {/* Left side - Background image */}
      <div className={styles.backgroundImage}>
        <div className={styles.overlay} />
      </div>
      
      {/* Right side - Login form */}
      <div className={styles.loginContainer}>
        <div className={styles.logoContainer}>
          <div className={styles.logo}>EDIFY</div>
        </div>
        
        <h1 className={styles.welcomeText}>Welcome Back!</h1>
        <p className={styles.subText}>Please login to access your account.</p>
        
        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>📧</div>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className={styles.input}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <div className={styles.inputIcon}>•••</div>
            <input 
              type="password" 
              placeholder="Enter your password" 
              className={styles.input}
              required 
            />
          </div>
          
          <div className={styles.inputGroup}>
            <label htmlFor="role" className="sr-only">Role</label>
            <div className={styles.inputIcon} aria-hidden="true">👤</div>
            <select 
              id="role"
              name="role"
              className={`${styles.input} ${styles.select}`} 
              required
              aria-label="Select your role"
              title="Select your role"
            >
              <option value="">Select a role</option>
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Administrator</option>
            </select>
            <div className={styles.dropdownIcon} aria-hidden="true">▼</div>
          </div>
          
          <button type="submit" className={styles.loginButton}>
            LOGIN
          </button>
        </form>
        
        <p className={styles.registerText}>
          Don't have an account?{' '}
          <Link href="/register" className={styles.registerLink}>
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
