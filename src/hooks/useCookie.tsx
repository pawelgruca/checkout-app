import { useEffect, useState } from 'react';

export const useCookie = (name: string) => {
  const [cookie, setCookie] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (!document) {
      return;
    }

    const c = document.cookie
      .split(';')
      .find((cookie) => cookie.includes(name))
      ?.split('=')[1];

    if (c) {
      setCookie(c);
    }
  }, []);

  return cookie;
};
