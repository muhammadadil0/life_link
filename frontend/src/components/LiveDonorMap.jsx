import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Heart, Droplets, MapPin, Phone, MessageCircle, 
  Navigation, Crosshair, Sparkles, Shield, User, X, CheckCircle2 
} from 'lucide-react';

const CITY_COORDINATES = {
  'shergarh': [34.3855, 71.8953],
  'mardan': [34.1989, 72.0404],
  'peshawar': [34.0151, 71.5249],
  'charsadda': [34.1482, 71.7406],
  'swabi': [34.1202, 72.4698],
  'nowshera': [34.0153, 71.9747],
  'abbottabad': [34.1688, 73.2215],
  'swat': [34.7717, 72.3602],
  'mingora': [34.7717, 72.3602],
  'islamabad': [33.6844, 73.0479],
  'rawalpindi': [33.5651, 73.0169],
  'lahore': [31.5204, 74.3587],
  'faisalabad': [31.4504, 73.1350],
  'multan': [30.1575, 71.5249],
  'gujranwala': [32.1877, 74.1945],
  'sialkot': [32.4945, 74.5229],
  'karachi': [24.8607, 67.0011],
  'quetta': [30.1798, 66.9750]
};

const DEFAULT_CENTER = [34.3855, 71.8953]; // Shergarh, Mardan HQ

export default function LiveDonorMap({ 
  donors = [], 
  selectedCity = '', 
  onOpenChat, 
  height = '560px' 
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersLayerRef = useRef(null);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [activeCityName, setActiveCityName] = useState('Shergarh & Mardan');

  // Compute donor coordinates with deterministic jitter
  const getDonorCoords = (donor, index) => {
    if (donor.latitude && donor.longitude) {
      return [parseFloat(donor.latitude), parseFloat(donor.longitude)];
    }

    const cityLower = (donor.city || donor.address || '').toLowerCase();
    let baseCoords = DEFAULT_CENTER;

    for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
      if (cityLower.includes(key)) {
        baseCoords = coords;
        break;
      }
    }

    // Deterministic scatter around city center so pins don't overlap
    const seed = (donor.id || donor.name || index).toString();
    const hash = seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + index * 17;
    const angle = ((hash % 360) * Math.PI) / 180;
    const distance = 0.006 + ((hash % 12) * 0.002); // ~600m to 2.8km radius scatter

    return [
      baseCoords[0] + Math.sin(angle) * distance,
      baseCoords[1] + Math.cos(angle) * distance
    ];
  };

  // Create custom circular avatar marker HTML
  const createDonorIcon = (donor, isSelected) => {
    const isAvailable = donor.is_available !== false;
    const initial = (donor.name || 'D').charAt(0).toUpperCase();
    const bloodType = donor.blood_type || 'O+';
    const borderColor = isSelected ? '#ef4444' : isAvailable ? '#10b981' : '#f59e0b';
    const bgGradient = isAvailable 
      ? 'linear-gradient(135deg, #059669 0%, #10b981 100%)' 
      : 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)';

    return L.divIcon({
      className: 'custom-circle-donor-pin',
      html: `
        <div style="position: relative; width: 50px; height: 50px; cursor: pointer;">
          ${isAvailable ? `
            <div style="
              position: absolute;
              inset: -5px;
              border-radius: 9999px;
              background-color: #10b981;
              opacity: 0.55;
              animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite;
            "></div>
          ` : ''}
          <div style="
            position: relative;
            width: 50px;
            height: 50px;
            border-radius: 9999px;
            background: ${bgGradient};
            border: 3px solid ${borderColor};
            box-shadow: 0 10px 20px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.1);
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffffff;
            font-weight: 800;
            font-size: 18px;
            font-family: 'Poppins', sans-serif;
            transition: all 0.25s ease;
            ${isSelected ? 'transform: scale(1.15); box-shadow: 0 0 25px rgba(239, 68, 68, 0.6);' : ''}
          ">
            ${initial}
          </div>
          <div style="
            position: absolute;
            bottom: -3px;
            right: -3px;
            background: #dc2626;
            color: #ffffff;
            border: 2px solid #ffffff;
            border-radius: 9999px;
            padding: 2px 7px;
            font-size: 11px;
            font-weight: 900;
            box-shadow: 0 2px 6px rgba(0,0,0,0.3);
            white-space: nowrap;
            letter-spacing: -0.5px;
          ">
            ${bloodType}
          </div>
        </div>
      `,
      iconSize: [50, 50],
      iconAnchor: [25, 25],
      popupAnchor: [0, -28]
    });
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: DEFAULT_CENTER,
        zoom: 12,
        zoomControl: false,
        attributionControl: false
      });

      // CartoDB Positron / OpenStreetMap Clean Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd'
      }).addTo(map);

      // Custom Zoom Control at Top Right
      L.control.zoom({ position: 'topright' }).addTo(map);

      markersLayerRef.current = L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Markers when donors or selectedCity change
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    if (!map || !markersLayer) return;

    markersLayer.clearLayers();

    if (donors.length === 0) return;

    const bounds = L.latLngBounds([]);

    donors.forEach((donor, index) => {
      const coords = getDonorCoords(donor, index);
      bounds.extend(coords);

      const marker = L.marker(coords, {
        icon: createDonorIcon(donor, selectedDonor?.id === donor.id)
      });

      marker.on('click', () => {
        setSelectedDonor(donor);
        map.flyTo(coords, Math.max(map.getZoom(), 13), {
          duration: 0.8
        });
      });

      marker.addTo(markersLayer);
    });

    // Fly to city center if selectedCity is specified
    if (selectedCity && selectedCity !== 'all') {
      const cityKey = selectedCity.toLowerCase().trim();
      for (const [key, coords] of Object.entries(CITY_COORDINATES)) {
        if (cityKey.includes(key)) {
          map.flyTo(coords, 13, { duration: 1 });
          setActiveCityName(donorCityName(key));
          return;
        }
      }
    }

    // Auto-fit bounds if donors exist
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [donors, selectedCity, selectedDonor]);

  const donorCityName = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1);
  };

  const handleCityQuickJump = (cityName) => {
    const coords = CITY_COORDINATES[cityName.toLowerCase()];
    if (coords && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(coords, 13, { duration: 1.2 });
      setActiveCityName(cityName);
      setSelectedDonor(null);
    }
  };

  const handleLocateMe = () => {
    if (navigator.geolocation && mapInstanceRef.current) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const userCoords = [pos.coords.latitude, pos.coords.longitude];
          mapInstanceRef.current.flyTo(userCoords, 14, { duration: 1 });
          setActiveCityName('Your GPS Location');
        },
        () => {
          handleCityQuickJump('Shergarh');
        }
      );
    } else {
      handleCityQuickJump('Shergarh');
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-red-200/80 shadow-2xl bg-slate-900 group">
      
      {/* 🧭 Top Floating Map Radar HUD Overlay */}
      <div className="absolute top-4 left-4 right-14 sm:right-auto z-[400] flex flex-wrap items-center gap-2 pointer-events-auto">
        <div className="glass-card bg-white/95 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-lg border border-red-100 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          <div>
            <div className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
              <span>Live Donor Radar</span>
              <span className="bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full">
                {donors.length} Donors Live
              </span>
            </div>
            <p className="text-[10px] text-gray-500">
              Showing active lifesavers near {activeCityName}
            </p>
          </div>
        </div>

        {/* Quick City Jumps */}
        <div className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl shadow-lg border border-gray-200 text-xs font-semibold">
          {['Shergarh', 'Mardan', 'Peshawar', 'Islamabad', 'Lahore'].map((c) => (
            <button
              key={c}
              onClick={() => handleCityQuickJump(c)}
              className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer ${
                activeCityName.toLowerCase().includes(c.toLowerCase())
                  ? 'bg-red-600 text-white font-bold shadow-xs'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* 🎯 Recenter / GPS Button */}
      <button
        onClick={handleLocateMe}
        className="absolute top-4 right-4 z-[400] w-10 h-10 rounded-2xl bg-white hover:bg-gray-50 text-gray-700 flex items-center justify-center shadow-lg border border-gray-200 transition-all cursor-pointer"
        title="Recenter Map"
      >
        <Crosshair className="w-5 h-5 text-red-600" />
      </button>

      {/* 🗺️ Leaflet Container */}
      <div 
        ref={mapContainerRef} 
        style={{ height }} 
        className="w-full relative z-0"
      />

      {/* 👤 Floating Selected Donor Card Modal (Sliding Glass Tray) */}
      {selectedDonor && (
        <div className="absolute bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-96 z-[400] animate-fade-in pointer-events-auto">
          <div className="glass-card bg-white/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border-2 border-red-200 shadow-2xl relative">
            <button
              onClick={() => setSelectedDonor(null)}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              {/* Circular Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-red-600 to-rose-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  {selectedDonor.name?.charAt(0) || 'D'}
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px]">
                  ✓
                </div>
              </div>

              {/* Donor Details */}
              <div className="flex-1 pr-6">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span>🟢 Available Live Now</span>
                </div>
                <h3 className="text-base font-extrabold text-gray-900 leading-tight">
                  {selectedDonor.name}
                </h3>
                <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-red-500" />
                  <span>{selectedDonor.city || selectedDonor.address || 'Pakistan'}</span>
                </p>
              </div>
            </div>

            {/* Donor Metrics Badge */}
            <div className="grid grid-cols-2 gap-2 mt-4 p-3 rounded-2xl bg-slate-50 border border-gray-100 text-xs">
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Blood Group</span>
                <span className="font-extrabold text-red-600 text-sm flex items-center gap-1">
                  <Droplets className="w-3.5 h-3.5 fill-red-600" />
                  {selectedDonor.blood_type}
                </span>
              </div>
              <div>
                <span className="text-gray-400 block text-[10px] uppercase font-bold">Verified Donations</span>
                <span className="font-extrabold text-gray-800 text-sm">
                  {selectedDonor.total_donations || 1} Donations
                </span>
              </div>
            </div>

            {/* Quick Action Contact Buttons */}
            <div className="grid grid-cols-2 gap-2.5 mt-4">
              <a
                href={`tel:${selectedDonor.phone || '03494996898'}`}
                className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 transition-all"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Donor</span>
              </a>

              <button
                onClick={() => {
                  onOpenChat?.(selectedDonor);
                  setSelectedDonor(null);
                }}
                className="btn-medical text-white py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-medical cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Direct Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 💡 Legend Overlay at bottom left */}
      <div className="absolute bottom-4 left-4 z-[400] hidden md:flex items-center gap-3 bg-white/90 backdrop-blur-md px-3.5 py-2 rounded-xl text-[11px] font-semibold text-gray-700 shadow-md border border-gray-200 pointer-events-auto">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Available Donor</span>
        </div>
        <div className="h-3 w-px bg-gray-300" />
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
          <span>Resting</span>
        </div>
        <div className="h-3 w-px bg-gray-300" />
        <span className="text-gray-400">Click any circle to call or chat</span>
      </div>

    </div>
  );
}
