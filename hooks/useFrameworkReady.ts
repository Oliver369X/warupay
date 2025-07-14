import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    // En React Native no existe window, por lo que simplemente no hacemos nada
    // Este hook era para web, pero no es necesario en React Native
  }, []);
}
