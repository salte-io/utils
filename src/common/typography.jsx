import React from 'react';
import styles from './typography.module.css';

export function Typography({
  type: Type,
  children,
  ...extraProps
}) {
  return (
    <Type
      className={styles.typography}
      {...extraProps}
    >
      {children}
    </Type>
  )
}
