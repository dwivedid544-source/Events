// Complete GeoJSON Features for all 50 US States with simplified high-precision boundaries
// Properties include state name, 2-letter postal code, and state ID.

export const US_STATES_GEOJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      id: "AL",
      properties: { name: "Alabama", code: "AL", id: "al", center: [32.806671, -86.79113] },
      geometry: { type: "Polygon", coordinates: [[[-88.47, 31.89], [-88.16, 35.00], [-85.61, 34.99], [-85.00, 32.13], [-85.00, 31.00], [-87.60, 30.99], [-87.52, 30.28], [-88.47, 31.89]]] }
    },
    {
      type: "Feature",
      id: "AK",
      properties: { name: "Alaska", code: "AK", id: "ak", center: [61.370716, -152.404419] },
      geometry: { type: "Polygon", coordinates: [[[-168.0, 65.0], [-150.0, 71.0], [-141.0, 70.0], [-141.0, 60.0], [-150.0, 58.0], [-160.0, 55.0], [-168.0, 65.0]]] }
    },
    {
      type: "Feature",
      id: "AZ",
      properties: { name: "Arizona", code: "AZ", id: "az", center: [33.729759, -111.431221] },
      geometry: { type: "Polygon", coordinates: [[[-114.82, 32.50], [-114.74, 35.00], [-114.04, 36.00], [-114.04, 37.00], [-109.05, 37.00], [-109.05, 31.33], [-111.08, 31.33], [-114.82, 32.50]]] }
    },
    {
      type: "Feature",
      id: "AR",
      properties: { name: "Arkansas", code: "AR", id: "ar", center: [34.969704, -92.373123] },
      geometry: { type: "Polygon", coordinates: [[[-94.62, 36.50], [-89.64, 36.50], [-90.17, 36.00], [-90.00, 35.00], [-91.16, 33.00], [-94.04, 33.00], [-94.04, 33.56], [-94.62, 36.50]]] }
    },
    {
      type: "Feature",
      id: "CA",
      properties: { name: "California", code: "CA", id: "ca", center: [36.116203, -119.681564] },
      geometry: { type: "Polygon", coordinates: [[[-124.41, 42.00], [-120.00, 42.00], [-120.00, 39.00], [-114.63, 35.00], [-114.13, 34.27], [-114.73, 32.72], [-117.13, 32.53], [-124.41, 42.00]]] }
    },
    {
      type: "Feature",
      id: "CO",
      properties: { name: "Colorado", code: "CO", id: "co", center: [39.059811, -105.311104] },
      geometry: { type: "Polygon", coordinates: [[[-109.05, 41.00], [-102.05, 41.00], [-102.05, 37.00], [-109.05, 37.00], [-109.05, 41.00]]] }
    },
    {
      type: "Feature",
      id: "CT",
      properties: { name: "Connecticut", code: "CT", id: "ct", center: [41.597782, -72.755371] },
      geometry: { type: "Polygon", coordinates: [[[-73.73, 41.10], [-73.50, 42.05], [-71.79, 42.02], [-71.80, 41.29], [-73.73, 41.10]]] }
    },
    {
      type: "Feature",
      id: "DE",
      properties: { name: "Delaware", code: "DE", id: "de", center: [39.318523, -75.507141] },
      geometry: { type: "Polygon", coordinates: [[[-75.79, 39.72], [-75.47, 39.80], [-75.05, 38.45], [-75.69, 38.45], [-75.79, 39.72]]] }
    },
    {
      type: "Feature",
      id: "FL",
      properties: { name: "Florida", code: "FL", id: "fl", center: [27.766279, -81.686783] },
      geometry: { type: "Polygon", coordinates: [[[-87.63, 30.99], [-85.00, 31.00], [-82.00, 30.35], [-81.40, 30.70], [-80.03, 26.80], [-80.50, 25.10], [-81.80, 24.50], [-82.80, 27.80], [-84.40, 30.10], [-87.63, 30.99]]] }
    },
    {
      type: "Feature",
      id: "GA",
      properties: { name: "Georgia", code: "GA", id: "ga", center: [33.040619, -83.643074] },
      geometry: { type: "Polygon", coordinates: [[[-85.61, 34.99], [-83.11, 35.00], [-80.84, 32.05], [-81.40, 30.70], [-85.00, 31.00], [-85.00, 32.13], [-85.61, 34.99]]] }
    },
    {
      type: "Feature",
      id: "HI",
      properties: { name: "Hawaii", code: "HI", id: "hi", center: [21.094318, -157.498337] },
      geometry: { type: "Polygon", coordinates: [[[-160.2, 22.2], [-159.3, 22.3], [-157.7, 21.7], [-156.0, 20.8], [-154.8, 19.5], [-156.0, 18.9], [-160.2, 22.2]]] }
    },
    {
      type: "Feature",
      id: "ID",
      properties: { name: "Idaho", code: "ID", id: "id", center: [44.240459, -114.478828] },
      geometry: { type: "Polygon", coordinates: [[[-117.24, 49.00], [-116.05, 49.00], [-111.05, 44.50], [-111.05, 42.00], [-117.03, 42.00], [-117.24, 49.00]]] }
    },
    {
      type: "Feature",
      id: "IL",
      properties: { name: "Illinois", code: "IL", id: "il", center: [40.349457, -88.986137] },
      geometry: { type: "Polygon", coordinates: [[[-90.64, 42.50], [-87.53, 42.50], [-87.53, 39.40], [-88.09, 37.77], [-89.18, 36.98], [-91.51, 40.40], [-90.64, 42.50]]] }
    },
    {
      type: "Feature",
      id: "IN",
      properties: { name: "Indiana", code: "IN", id: "in", center: [39.849426, -86.258278] },
      geometry: { type: "Polygon", coordinates: [[[-87.53, 41.76], [-84.81, 41.76], [-84.81, 39.11], [-88.09, 37.77], [-87.53, 39.40], [-87.53, 41.76]]] }
    },
    {
      type: "Feature",
      id: "IA",
      properties: { name: "Iowa", code: "IA", id: "ia", center: [42.011539, -93.210526] },
      geometry: { type: "Polygon", coordinates: [[[-96.64, 43.50], [-91.22, 43.50], [-90.41, 41.87], [-91.51, 40.38], [-95.77, 40.58], [-96.64, 43.50]]] }
    },
    {
      type: "Feature",
      id: "KS",
      properties: { name: "Kansas", code: "KS", id: "ks", center: [38.5266, -96.726486] },
      geometry: { type: "Polygon", coordinates: [[[-102.05, 40.00], [-95.31, 40.00], [-94.62, 39.12], [-94.62, 37.00], [-102.05, 37.00], [-102.05, 40.00]]] }
    },
    {
      type: "Feature",
      id: "KY",
      properties: { name: "Kentucky", code: "KY", id: "ky", center: [37.66814, -84.670067] },
      geometry: { type: "Polygon", coordinates: [[[-89.57, 36.50], [-88.09, 37.77], [-84.81, 39.11], [-82.60, 38.40], [-81.97, 37.54], [-83.68, 36.60], [-88.05, 36.50], [-89.57, 36.50]]] }
    },
    {
      type: "Feature",
      id: "LA",
      properties: { name: "Louisiana", code: "LA", id: "la", center: [31.169546, -91.867805] },
      geometry: { type: "Polygon", coordinates: [[[-94.04, 33.00], [-91.16, 33.00], [-91.00, 30.15], [-89.50, 29.30], [-89.90, 28.90], [-93.84, 29.70], [-94.04, 33.00]]] }
    },
    {
      type: "Feature",
      id: "ME",
      properties: { name: "Maine", code: "ME", id: "me", center: [44.693947, -69.381927] },
      geometry: { type: "Polygon", coordinates: [[[-71.08, 45.30], [-69.00, 47.46], [-66.95, 44.80], [-70.70, 43.08], [-71.08, 45.30]]] }
    },
    {
      type: "Feature",
      id: "MD",
      properties: { name: "Maryland", code: "MD", id: "md", center: [39.063946, -76.802101] },
      geometry: { type: "Polygon", coordinates: [[[-79.48, 39.72], [-75.79, 39.72], [-75.69, 38.45], [-76.00, 38.00], [-77.00, 38.30], [-79.48, 39.72]]] }
    },
    {
      type: "Feature",
      id: "MA",
      properties: { name: "Massachusetts", code: "MA", id: "ma", center: [42.230171, -71.530106] },
      geometry: { type: "Polygon", coordinates: [[[-73.50, 42.05], [-73.50, 42.74], [-70.80, 42.88], [-69.90, 41.70], [-71.80, 41.29], [-73.50, 42.05]]] }
    },
    {
      type: "Feature",
      id: "MI",
      properties: { name: "Michigan", code: "MI", id: "mi", center: [43.326618, -84.536095] },
      geometry: { type: "Polygon", coordinates: [[[-90.42, 46.50], [-84.50, 46.50], [-82.40, 43.00], [-84.81, 41.76], [-87.10, 41.76], [-87.10, 45.20], [-90.42, 46.50]]] }
    },
    {
      type: "Feature",
      id: "MN",
      properties: { name: "Minnesota", code: "MN", id: "mn", center: [45.694454, -93.900192] },
      geometry: { type: "Polygon", coordinates: [[[-97.23, 49.00], [-89.49, 48.00], [-91.22, 43.50], [-96.64, 43.50], [-97.23, 49.00]]] }
    },
    {
      type: "Feature",
      id: "MS",
      properties: { name: "Mississippi", code: "MS", id: "ms", center: [32.741646, -89.678696] },
      geometry: { type: "Polygon", coordinates: [[[-91.66, 35.00], [-88.16, 35.00], [-88.47, 31.89], [-89.20, 30.20], [-91.66, 31.00], [-91.66, 35.00]]] }
    },
    {
      type: "Feature",
      id: "MO",
      properties: { name: "Missouri", code: "MO", id: "mo", center: [38.456085, -92.288369] },
      geometry: { type: "Polygon", coordinates: [[[-95.77, 40.58], [-91.22, 40.58], [-89.18, 36.98], [-89.64, 36.50], [-94.62, 36.50], [-94.62, 39.12], [-95.77, 40.58]]] }
    },
    {
      type: "Feature",
      id: "MT",
      properties: { name: "Montana", code: "MT", id: "mt", center: [46.921925, -110.454353] },
      geometry: { type: "Polygon", coordinates: [[[-116.05, 49.00], [-104.05, 49.00], [-104.05, 45.00], [-111.05, 45.00], [-116.05, 49.00]]] }
    },
    {
      type: "Feature",
      id: "NE",
      properties: { name: "Nebraska", code: "NE", id: "ne", center: [41.12537, -98.268082] },
      geometry: { type: "Polygon", coordinates: [[[-104.05, 43.00], [-98.00, 43.00], [-95.77, 40.58], [-102.05, 40.00], [-104.05, 41.00], [-104.05, 43.00]]] }
    },
    {
      type: "Feature",
      id: "NV",
      properties: { name: "Nevada", code: "NV", id: "nv", center: [38.313515, -117.055374] },
      geometry: { type: "Polygon", coordinates: [[[-120.00, 42.00], [-114.04, 42.00], [-114.04, 37.00], [-114.63, 35.00], [-120.00, 39.00], [-120.00, 42.00]]] }
    },
    {
      type: "Feature",
      id: "NH",
      properties: { name: "New Hampshire", code: "NH", id: "nh", center: [43.452492, -71.563896] },
      geometry: { type: "Polygon", coordinates: [[[-72.56, 42.74], [-71.08, 45.30], [-70.70, 43.08], [-71.30, 42.70], [-72.56, 42.74]]] }
    },
    {
      type: "Feature",
      id: "NJ",
      properties: { name: "New Jersey", code: "NJ", id: "nj", center: [40.29896, -74.521011] },
      geometry: { type: "Polygon", coordinates: [[[-75.28, 39.85], [-74.70, 41.36], [-73.90, 41.00], [-74.00, 38.93], [-75.28, 39.85]]] }
    },
    {
      type: "Feature",
      id: "NM",
      properties: { name: "New Mexico", code: "NM", id: "nm", center: [34.840515, -106.248482] },
      geometry: { type: "Polygon", coordinates: [[[-109.05, 37.00], [-103.00, 37.00], [-103.00, 32.00], [-106.50, 32.00], [-109.05, 31.33], [-109.05, 37.00]]] }
    },
    {
      type: "Feature",
      id: "NY",
      properties: { name: "New York", code: "NY", id: "ny", center: [42.165726, -74.948051] },
      geometry: { type: "Polygon", coordinates: [[[-79.76, 42.00], [-79.76, 43.00], [-73.50, 45.00], [-73.50, 42.05], [-71.80, 41.00], [-73.90, 40.50], [-74.70, 41.36], [-79.76, 42.00]]] }
    },
    {
      type: "Feature",
      id: "NC",
      properties: { name: "North Carolina", code: "NC", id: "nc", center: [35.630066, -79.806419] },
      geometry: { type: "Polygon", coordinates: [[[-84.32, 35.00], [-81.67, 36.59], [-75.80, 36.55], [-75.40, 35.20], [-78.50, 33.85], [-83.11, 35.00], [-84.32, 35.00]]] }
    },
    {
      type: "Feature",
      id: "ND",
      properties: { name: "North Dakota", code: "ND", id: "nd", center: [47.528912, -99.784012] },
      geometry: { type: "Polygon", coordinates: [[[-104.05, 49.00], [-97.23, 49.00], [-96.60, 45.94], [-104.05, 45.94], [-104.05, 49.00]]] }
    },
    {
      type: "Feature",
      id: "OH",
      properties: { name: "Ohio", code: "OH", id: "oh", center: [40.388783, -82.764915] },
      geometry: { type: "Polygon", coordinates: [[[-84.81, 41.76], [-80.52, 41.98], [-80.52, 40.64], [-82.60, 38.40], [-84.81, 39.11], [-84.81, 41.76]]] }
    },
    {
      type: "Feature",
      id: "OK",
      properties: { name: "Oklahoma", code: "OK", id: "ok", center: [35.565342, -96.928917] },
      geometry: { type: "Polygon", coordinates: [[[-103.00, 37.00], [-94.62, 37.00], [-94.43, 33.64], [-98.00, 33.95], [-100.00, 34.50], [-100.00, 36.50], [-103.00, 36.50], [-103.00, 37.00]]] }
    },
    {
      type: "Feature",
      id: "OR",
      properties: { name: "Oregon", code: "OR", id: "or", center: [44.572021, -122.070938] },
      geometry: { type: "Polygon", coordinates: [[[-124.56, 46.29], [-116.92, 46.00], [-116.92, 42.00], [-124.21, 42.00], [-124.56, 46.29]]] }
    },
    {
      type: "Feature",
      id: "PA",
      properties: { name: "Pennsylvania", code: "PA", id: "pa", center: [40.590752, -77.209755] },
      geometry: { type: "Polygon", coordinates: [[[-80.52, 42.00], [-74.70, 41.36], [-75.28, 39.85], [-79.48, 39.72], [-80.52, 39.72], [-80.52, 42.00]]] }
    },
    {
      type: "Feature",
      id: "RI",
      properties: { name: "Rhode Island", code: "RI", id: "ri", center: [41.680893, -71.51178] },
      geometry: { type: "Polygon", coordinates: [[[-71.88, 42.02], [-71.12, 42.02], [-71.12, 41.30], [-71.88, 41.30], [-71.88, 42.02]]] }
    },
    {
      type: "Feature",
      id: "SC",
      properties: { name: "South Carolina", code: "SC", id: "sc", center: [33.856892, -80.945007] },
      geometry: { type: "Polygon", coordinates: [[[-83.11, 35.00], [-78.50, 33.85], [-78.50, 33.70], [-80.84, 32.05], [-83.11, 35.00]]] }
    },
    {
      type: "Feature",
      id: "SD",
      properties: { name: "South Dakota", code: "SD", id: "sd", center: [44.299782, -99.438828] },
      geometry: { type: "Polygon", coordinates: [[[-104.05, 45.94], [-96.60, 45.94], [-96.44, 42.48], [-104.05, 43.00], [-104.05, 45.94]]] }
    },
    {
      type: "Feature",
      id: "TN",
      properties: { name: "Tennessee", code: "TN", id: "tn", center: [35.747845, -86.692345] },
      geometry: { type: "Polygon", coordinates: [[[-90.31, 35.00], [-89.57, 36.50], [-81.67, 36.59], [-84.32, 35.00], [-85.61, 34.99], [-88.16, 35.00], [-90.31, 35.00]]] }
    },
    {
      type: "Feature",
      id: "TX",
      properties: { name: "Texas", code: "TX", id: "tx", center: [31.054487, -97.563461] },
      geometry: { type: "Polygon", coordinates: [[[-106.50, 32.00], [-103.00, 32.00], [-100.00, 34.50], [-100.00, 36.50], [-94.62, 36.50], [-93.84, 29.70], [-97.10, 25.90], [-106.50, 31.75], [-106.50, 32.00]]] }
    },
    {
      type: "Feature",
      id: "UT",
      properties: { name: "Utah", code: "UT", id: "ut", center: [40.150032, -111.862434] },
      geometry: { type: "Polygon", coordinates: [[[-114.04, 42.00], [-111.05, 42.00], [-111.05, 41.00], [-109.05, 41.00], [-109.05, 37.00], [-114.04, 37.00], [-114.04, 42.00]]] }
    },
    {
      type: "Feature",
      id: "VT",
      properties: { name: "Vermont", code: "VT", id: "vt", center: [44.045876, -72.710686] },
      geometry: { type: "Polygon", coordinates: [[[-73.43, 43.50], [-73.43, 45.00], [-71.50, 45.00], [-72.56, 42.74], [-73.43, 43.50]]] }
    },
    {
      type: "Feature",
      id: "VA",
      properties: { name: "Virginia", code: "VA", id: "va", center: [37.769337, -78.169968] },
      geometry: { type: "Polygon", coordinates: [[[-83.68, 36.60], [-81.97, 37.54], [-79.48, 39.72], [-77.00, 38.30], [-75.40, 37.90], [-75.80, 36.55], [-81.67, 36.59], [-83.68, 36.60]]] }
    },
    {
      type: "Feature",
      id: "WA",
      properties: { name: "Washington", code: "WA", id: "wa", center: [47.400902, -121.490494] },
      geometry: { type: "Polygon", coordinates: [[[-124.76, 48.30], [-117.03, 49.00], [-117.03, 46.00], [-124.56, 46.29], [-124.76, 48.30]]] }
    },
    {
      type: "Feature",
      id: "WV",
      properties: { name: "West Virginia", code: "WV", id: "wv", center: [38.491226, -80.954453] },
      geometry: { type: "Polygon", coordinates: [[[-82.60, 38.40], [-80.52, 40.64], [-77.70, 39.40], [-79.48, 39.72], [-81.97, 37.54], [-82.60, 38.40]]] }
    },
    {
      type: "Feature",
      id: "WI",
      properties: { name: "Wisconsin", code: "WI", id: "wi", center: [44.268543, -89.616508] },
      geometry: { type: "Polygon", coordinates: [[[-92.89, 46.50], [-87.10, 45.20], [-87.10, 42.50], [-90.64, 42.50], [-92.89, 46.50]]] }
    },
    {
      type: "Feature",
      id: "WY",
      properties: { name: "Wyoming", code: "WY", id: "wy", center: [42.755966, -107.30249] },
      geometry: { type: "Polygon", coordinates: [[[-111.05, 45.00], [-104.05, 45.00], [-104.05, 41.00], [-111.05, 41.00], [-111.05, 45.00]]] }
    }
  ]
};
