"use client";

import { useMemo } from 'react';

interface HtmlRendererProps {
  html: string;
  className?: string;
}

/**
 * Safe HTML Renderer Component
 * Renders HTML content from WooCommerce API safely
 * Handles HTML tags like <p>, <br>, <strong>, <em>, <ul>, <ol>, <li>, etc.
 */
export default function HtmlRenderer({ html, className = "" }: HtmlRendererProps) {
  // Clean and sanitize HTML
  const sanitizedHtml = useMemo(() => {
    if (!html) return '';
    
    // Convert HTML string to safe format
    // Remove potentially dangerous scripts but keep formatting
    let cleaned = html
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove scripts
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .replace(/on\w+='[^']*'/gi, ''); // Remove event handlers with single quotes
    
    return cleaned;
  }, [html]);

  if (!html) {
    return null;
  }

  return (
    <div 
      className={`html-content ${className}`}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
      style={{
        lineHeight: '1.6',
      }}
    />
  );
}

