export type MapPreviewProps = {
  lat: number;
  lon: number;
  zoom?: number;
  width?: number | string;
  height?: number | string;
};

export const MapPreview = ({
  lat,
  lon,
  zoom = 12,
  width = "100%",
  height = 200,
}: MapPreviewProps) => {
  const url = `https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.01}%2C${lat - 0.01}%2C${lon + 0.01}%2C${lat + 0.01}&layer=mapnik&marker=${lat}%2C${lon}`;

  return (
    <iframe
      src={url}
      width={width}
      height={height}
      style={{ borderRadius: 8, border: "none" }}
      loading="lazy"
    />
  );
};
