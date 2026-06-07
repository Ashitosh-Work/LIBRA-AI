import { useCallback, useEffect, useState } from "react";

function currentRoute() {
  return window.location.hash.replace("#", "") || "/dashboard";
}

export function useHashRoute() {
  const [route, setRoute] = useState(currentRoute);

  useEffect(() => {
    function handleHashChange() {
      setRoute(currentRoute());
    }

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navigate = useCallback((nextRoute) => {
    if (currentRoute() === nextRoute) {
      setRoute(nextRoute);
      return;
    }

    window.location.hash = nextRoute;
  }, []);

  return { route, navigate };
}
