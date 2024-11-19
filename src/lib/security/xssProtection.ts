import xss from 'xss';

const xssOptions = {
  whiteList: {}, // Disable all tags by default
  stripIgnoreTag: true,
  stripIgnoreTagBody: ['script', 'style']
};

export function sanitizeHtml(input: string): string {
  return xss(input, xssOptions);
}

export function sanitizeObject<T extends object>(obj: T): T {
  const sanitized = { ...obj };
  
  Object.keys(sanitized).forEach(key => {
    const value = sanitized[key];
    if (typeof value === 'string') {
      sanitized[key] = sanitizeHtml(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    }
  });

  return sanitized;
}