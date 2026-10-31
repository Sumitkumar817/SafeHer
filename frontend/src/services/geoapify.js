const API_KEY = "9c3f1431de76433fa4d98ec58bde4e5f";

export const fetchNearbyPlaces = async (lat, lon, category) => {
  const radius = 5000;
  const url = `https://api.geoapify.com/v2/places?categories=${category}&filter=circle:${lon},${lat},${radius}&bias=proximity:${lon},${lat}&limit=12&apiKey=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("Geoapify raw response:", data); // ← keep this for now

    if (!data.features || data.features.length === 0) {
      console.warn("Empty features for category:", category);
      return [];
    }

    return data.features
      .filter(f => f.properties && f.geometry)
      .map(feature => ({
        id:       feature.properties.place_id,
        name:     feature.properties.name || feature.properties.address_line1 || "Nearby Safe Spot",
        address:  feature.properties.address_line2 || feature.properties.formatted || "Address not available",
        distance: feature.properties.distance != null
                    ? (feature.properties.distance / 1000).toFixed(1) + " km"
                    : "Distance N/A",
        phone:    feature.properties.datasource?.raw?.phone
               || feature.properties.datasource?.raw?.["contact:phone"]
               || "—",
        // ✅ THIS is what was missing — coordinates for map markers
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
      }));
  } catch (error) {
    console.error("Fetch Error:", error);
    return [];
  }
};