"use client";

import { useMap } from "@/context/map-context";
import mapboxgl from "mapbox-gl";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { createPortal } from "react-dom";

type PopupProps = {
  children: React.ReactNode;
  latitude?: number;
  longitude?: number;
  onClose?: () => void;
  marker?: mapboxgl.Marker;
} & mapboxgl.PopupOptions;

export default function Popup({
  latitude,
  longitude,
  children,
  marker,
  onClose,
  className,
  ...props
}: PopupProps) {
  const { map } = useMap();

  //   const container = useMemo(() => {
  //     return document.createElement("div");
  //   }, []);
  const containerRef = useRef<HTMLDivElement>(document.createElement("div"));
  const popupRef = useRef<mapboxgl.Popup | null>(null);

  const handleClose = useCallback(() => {
    onClose?.();
  }, [onClose]);

  useEffect(() => {
    if (!map) return;

    const popupOptions: mapboxgl.PopupOptions = {
      ...props,
      className: `mapboxgl-custom-popup ${className ?? ""}`,
    };

    // const popup = new mapboxgl.Popup(popupOptions)
    //   .setDOMContent(containerRef.current)
    //   .setMaxWidth("none");

    //popup.on("close", handleClose);

    if (!popupRef.current) {
      popupRef.current = new mapboxgl.Popup(popupOptions)
        .setDOMContent(containerRef.current)
        .setMaxWidth("none");
    }

    popupRef.current.on("close", handleClose);

    if (marker) {
      const currentPopup = marker.getPopup();
      if (currentPopup) {
        currentPopup.remove();
      }

      marker.setPopup(popupRef.current);

      marker.togglePopup();
    } else if (latitude !== undefined && longitude !== undefined) {
      popupRef.current.setLngLat([longitude, latitude]).addTo(map);
    }

    return () => {
      if (popupRef.current) {
        popupRef.current.off("close", handleClose);
        popupRef.current.remove();
      }

      if (marker && marker.getPopup()) {
        marker.setPopup(null);
      }
    };
  }, [
    map,
    marker,
    latitude,
    longitude,
    props,
    className,
    //containerRef.current,
    handleClose,
  ]);

  return createPortal(children, containerRef.current);
}
