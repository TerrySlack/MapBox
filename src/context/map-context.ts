// map-context.ts
import { createContext, useContext } from "react";

type MapContextType = {
  map: mapboxgl.Map | null;
  loaded: boolean;
};

//export const MapContext = createContext<MapContextType | null>(null);
export const MapContext = createContext<MapContextType>({
  map: null,
  loaded: false,
});

export const useMap = () => {
  const mapContext = useContext(MapContext);
  if (!mapContext) {
    throw new Error("useMap must be used within a MapProvider");
  }
  return mapContext;
};
