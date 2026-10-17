import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { US_STATES_GEOJSON } from '../../data/usStatesGeoJson';
import { MapPin, Calendar, Trophy, Building2, ChevronRight, Check } from 'lucide-react';

// Custom Map Controller to handle smooth flyTo / fitBounds when filters change
const MapController = ({ selectedState, events }) => {
  const map = useMap();

  useEffect(() => {
    // If a specific state is selected from dropdown
    if (selectedState && selectedState !== 'ALL') {
      const stateFeature = US_STATES_GEOJSON.features.find(
        (f) =>
          f.properties.name.toLowerCase() === selectedState.toLowerCase() ||
          f.properties.code.toLowerCase() === selectedState.toLowerCase() ||
          f.properties.id.toLowerCase() === selectedState.toLowerCase()
      );
      if (stateFeature && stateFeature.properties.center) {
        map.flyTo(stateFeature.properties.center, 6, { duration: 1.2 });
        return;
      }
    }

    // If events exist after search/filter, adjust bounds to fit markers
    if (events && events.length > 0) {
      const validCoords = events
        .filter((e) => e.lat && e.lng)
        .map((e) => [e.lat, e.lng]);

      if (validCoords.length === 1) {
        map.flyTo(validCoords[0], 7, { duration: 1 });
      } else if (validCoords.length > 1) {
        const bounds = L.latLngBounds(validCoords);
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 7, animate: true });
      }
    } else {
      // Default USA view center
      map.flyTo([39.8283, -98.5795], 4, { duration: 1 });
    }
  }, [selectedState, events, map]);

  return null;
};

// Custom DivIcon generator for City Markers & Clusters
const createCustomMarkerIcon = (count, sportType = 'Coonhounds') => {
  const sportEmoji =
    sportType === 'Beagles'
      ? '🐶'
      : sportType === 'Squirrel Dogs'
      ? '🐿️'
      : sportType === 'Hog Dogs'
      ? '🐗'
      : '🐕';

  if (count > 1) {
    return L.divIcon({
      className: 'custom-cluster-icon',
      html: `
        <div class="relative group cursor-pointer">
          <div class="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-950 text-tan-300 border-2 border-tan-500 shadow-2xl transition-transform hover:scale-110 font-extrabold text-xs">
            <span class="text-sm">📍</span>
            <span>${count} Events</span>
          </div>
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-amber-400 rounded-full animate-ping"></div>
        </div>
      `,
      iconSize: [100, 36],
      iconAnchor: [50, 18]
    });
  }

  return L.divIcon({
    className: 'custom-marker-icon',
    html: `
      <div class="relative group cursor-pointer">
        <div class="flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-900 text-tan-200 border border-tan-400/80 shadow-xl transition-all hover:bg-forest-950 hover:border-tan-400 hover:scale-110 font-black text-xs">
          <span>${sportEmoji}</span>
          <span class="text-[11px]">Pin</span>
        </div>
      </div>
    `,
    iconSize: [60, 30],
    iconAnchor: [30, 15]
  });
};

export const EventMapView = ({ events = [], selectedState = 'ALL', onPreSignUp }) => {
  // Compute set of active state codes from current filtered events
  const activeStateCodes = useMemo(() => {
    const codes = new Set();
    events.forEach((evt) => {
      if (evt.stateCode) codes.add(evt.stateCode.toUpperCase());
      if (evt.state) {
        const matchingState = US_STATES_GEOJSON.features.find(
          (f) => f.properties.name.toLowerCase() === evt.state.toLowerCase()
        );
        if (matchingState) codes.add(matchingState.properties.code.toUpperCase());
      }
    });
    return codes;
  }, [events]);

  // Group events by city & coordinates to handle multiple events in same location
  const groupedEvents = useMemo(() => {
    const groups = {};
    events.forEach((evt) => {
      const lat = evt.lat || 35.9606;
      const lng = evt.lng || -83.9207;
      const key = `${evt.city || 'City'}-${evt.state || 'State'}-${lat}-${lng}`;
      if (!groups[key]) {
        groups[key] = {
          city: evt.city,
          state: evt.state,
          lat,
          lng,
          events: []
        };
      }
      groups[key].events.push(evt);
    });
    return Object.values(groups);
  }, [events]);

  // GeoJSON styling logic for 50 US States
  const stateStyle = (feature) => {
    const stateCode = feature.properties.code.toUpperCase();
    const isActive = activeStateCodes.has(stateCode);

    if (isActive) {
      return {
        fillColor: '#2D4A3E',
        fillOpacity: 0.65,
        color: '#D4AF37',
        weight: 2,
        dashArray: ''
      };
    }

    return {
      fillColor: '#0c1f17',
      fillOpacity: 0.35,
      color: '#1e3b2e',
      weight: 0.8,
      dashArray: ''
    };
  };

  const onEachFeature = (feature, layer) => {
    const stateName = feature.properties.name;
    const stateCode = feature.properties.code;
    const isActive = activeStateCodes.has(stateCode.toUpperCase());

    const matchingCount = events.filter(
      (e) =>
        (e.stateCode && e.stateCode.toUpperCase() === stateCode.toUpperCase()) ||
        (e.state && e.state.toLowerCase() === stateName.toLowerCase())
    ).length;

    layer.bindTooltip(
      `<strong>${stateName} (${stateCode})</strong><br/>${
        isActive ? `✨ ${matchingCount} Active Event${matchingCount > 1 ? 's' : ''}` : 'No active events'
      }`,
      { sticky: true, className: 'uhc-map-tooltip' }
    );

    layer.on({
      mouseover: (e) => {
        const l = e.target;
        l.setStyle({
          fillOpacity: 0.85,
          weight: 2.5,
          color: isActive ? '#F59E0B' : '#4ADE80'
        });
      },
      mouseout: (e) => {
        const l = e.target;
        l.setStyle(stateStyle(feature));
      }
    });
  };

  return (
    <div className="relative w-full rounded-2xl overflow-hidden border border-forest-800 shadow-2xl bg-forest-950">
      {/* Top Map Header Bar */}
      <div className="bg-forest-900/90 backdrop-blur-md border-b border-forest-800 p-4 px-6 flex flex-wrap items-center justify-between gap-4 z-20">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
          <h3 className="text-sm font-black text-white tracking-wide">
            USA Interactive Event Location Map (Leaflet & OpenStreetMap)
          </h3>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-[11px] font-bold text-tan-200">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-tan-500 border border-tan-300"></span>
            <span>Active Location Pin</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#2D4A3E] border border-[#D4AF37]"></span>
            <span>State With Events ({activeStateCodes.size})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-3.5 rounded bg-[#0c1f17] border border-[#1e3b2e]"></span>
            <span>No Events</span>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="h-[520px] w-full relative">
        <MapContainer
          center={[39.8283, -98.5795]}
          zoom={4}
          scrollWheelZoom={true}
          className="h-full w-full bg-forest-950 z-10"
          style={{ background: '#0a1711' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />

          {/* 50 States GeoJSON Layer */}
          <GeoJSON
            data={US_STATES_GEOJSON}
            style={stateStyle}
            onEachFeature={onEachFeature}
          />

          {/* City Event Markers */}
          {groupedEvents.map((group) => {
            const firstEvt = group.events[0];
            const icon = createCustomMarkerIcon(group.events.length, firstEvt.sport);

            return (
              <Marker
                key={`${group.city}-${group.state}-${group.lat}-${group.lng}`}
                position={[group.lat, group.lng]}
                icon={icon}
              >
                <Popup className="uhc-custom-leaflet-popup" maxWidth={360}>
                  <div className="bg-forest-950 text-white rounded-xl p-4 space-y-3 font-sans border border-forest-700 shadow-2xl">
                    <div className="flex items-center justify-between border-b border-forest-800 pb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-tan-500/20 text-tan-300 text-[10px] font-black uppercase tracking-wider border border-tan-500/40">
                        📍 {group.city}, {group.state}
                      </span>
                      <span className="text-[10px] font-black text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                        {group.events.length} Event{group.events.length > 1 ? 's' : ''}
                      </span>
                    </div>

                    {/* List of events at this city location */}
                    <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                      {group.events.map((evt) => (
                        <div
                          key={evt.id}
                          className="bg-forest-900/90 rounded-xl p-3 border border-forest-800 space-y-2 hover:border-tan-500/50 transition-colors"
                        >
                          <div className="flex items-center justify-between text-[10px] text-tan-300 font-extrabold">
                            <span className="px-2 py-0.5 rounded bg-forest-950 border border-forest-700">
                              {evt.sport || 'Coonhounds'}
                            </span>
                            <span className="text-tan-400 font-bold">{evt.type}</span>
                          </div>

                          <h4 className="text-sm font-black text-white leading-tight">
                            {evt.name}
                          </h4>

                          <div className="text-[11px] text-tan-200 space-y-1 font-medium">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="w-3.5 h-3.5 text-tan-400 shrink-0" />
                              <span className="truncate">{evt.club}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-tan-400 shrink-0" />
                              <span>{evt.date} @ {evt.startTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5 font-bold text-tan-300">
                              <Trophy className="w-3.5 h-3.5 text-tan-400 shrink-0" />
                              <span>Fee: ${evt.fee} • {evt.entries}/{evt.maxCapacity} Registered</span>
                            </div>
                          </div>

                          <div className="pt-1 flex items-center justify-end">
                            <button
                              type="button"
                              onClick={() => {
                                if (onPreSignUp) onPreSignUp(evt);
                              }}
                              className="px-3 py-1.5 rounded-lg bg-tan-500 hover:bg-tan-600 text-forest-950 font-black text-[11px] shadow transition-transform active:scale-95 cursor-pointer flex items-center gap-1"
                            >
                              <span>Pre-Sign Up (${evt.fee})</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}

          <MapController selectedState={selectedState} events={events} />
        </MapContainer>

        {/* Empty State Overlay if filters return 0 events */}
        {events.length === 0 && (
          <div className="absolute inset-0 bg-forest-950/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-tan-500/20 text-tan-400 flex items-center justify-center border border-tan-500/40 text-xl font-black">
              🐕
            </div>
            <h4 className="text-lg font-black text-white">No events found for the selected filters</h4>
            <p className="text-xs text-tan-300 max-w-sm">
              Try adjusting your Search, Sport category, State, or Event Type filter to discover active trials nationwide.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
