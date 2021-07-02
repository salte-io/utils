import React from 'react';
import styles from './footer.module.css';

export function Footer({
  children
}) {
  return (
    <div className={styles.footer}>{children}</div>
  )
}
