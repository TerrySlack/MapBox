"use client";

import { useEffect, useMemo, useRef } from "react";
import mapboxgl, { MarkerOptions } from "mapbox-gl";
import { useMap } from "@/context/map-context";
import { LocationFeature } from "@/lib/mapbox/map-utils";

type Props = {
  longitude: number;
  latitude: number;
  //data: any;
  data: LocationFeature;
  onHover?: ({
    isHovered,
    position,
    marker,
    data,
  }: {
    isHovered: boolean;
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  onClick?: ({
    position,
    marker,
    data,
  }: {
    position: { longitude: number; latitude: number };
    marker: mapboxgl.Marker;
    data: LocationFeature;
  }) => void;
  children?: React.ReactNode;
} & MarkerOptions;

export const Marker = ({
  children,
  latitude,
  longitude,
  data,
  onHover,
  onClick,
  ...props
}: Props) => {
  const { map } = useMap();
  const markerRef = useRef<HTMLDivElement | null>(null);
  let marker: mapboxgl.Marker | null = null;

  const hover = (isHovered: boolean) => {
    if (onHover && marker) {
      onHover({
        isHovered,
        position: { longitude, latitude },
        marker,
        data,
      });
    }
  };

  const click = () => {
    if (onClick && marker) {
      onClick({ position: { longitude, latitude }, marker, data });
    }
  };

  const mouseEnter = () => hover(true);
  const mouseLeave = () => hover(false);

  useEffect(() => {
    const markerEl = markerRef.current;
    if (!map || !markerEl) return;

    // Add event listeners
    markerEl.addEventListener("mouseenter", mouseEnter);
    markerEl.addEventListener("mouseleave", mouseLeave);
    markerEl.addEventListener("click", click);

    // Marker options
    const options = {
      element: markerEl,
      ...props,
    };

    marker = new mapboxgl.Marker(options)
      .setLngLat([longitude, latitude])
      .addTo(map);

    return () => {
      // Cleanup on unmount
      if (marker) marker.remove();
      if (markerEl) {
        markerEl.removeEventListener("mouseenter", mouseEnter);
        markerEl.removeEventListener("mouseleave", mouseLeave);
        markerEl.removeEventListener("click", click);
      }
    };
  }, [map, longitude, latitude, props]);

  return <div ref={markerRef}>{children}</div>;
};
