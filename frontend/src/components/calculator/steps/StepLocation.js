import React, { useState, useEffect, useRef } from 'react';
import { MapPinIcon, SunIcon } from '../../ui/Icons';

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const US_STATES = [
  ['AL','Alabama'],['AK','Alaska'],['AZ','Arizona'],['AR','Arkansas'],['CA','California'],
  ['CO','Colorado'],['CT','Connecticut'],['DE','Delaware'],['FL','Florida'],['GA','Georgia'],
  ['HI','Hawaii'],['ID','Idaho'],['IL','Illinois'],['IN','Indiana'],['IA','Iowa'],
  ['KS','Kansas'],['KY','Kentucky'],['LA','Louisiana'],['ME','Maine'],['MD','Maryland'],
  ['MA','Massachusetts'],['MI','Michigan'],['MN','Minnesota'],['MS','Mississippi'],['MO','Missouri'],
  ['MT','Montana'],['NE','Nebraska'],['NV','Nevada'],['NH','New Hampshire'],['NJ','New Jersey'],
  ['NM','New Mexico'],['NY','New York'],['NC','North Carolina'],['ND','North Dakota'],['OH','Ohio'],
  ['OK','Oklahoma'],['OR','Oregon'],['PA','Pennsylvania'],['RI','Rhode Island'],['SC','South Carolina'],
  ['SD','South Dakota'],['TN','Tennessee'],['TX','Texas'],['UT','Utah'],['VT','Vermont'],
  ['VA','Virginia'],['WA','Washington'],['WV','West Virginia'],['WI','Wisconsin'],['WY','Wyoming'],
  ['DC','Washington D.C.'],
];

function loadGoogleMaps(key) {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) { resolve(); return; }
    const existing = document.getElementById('gmaps-script');
    if (existing) {
      existing.addEventListener('load', resolve);
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ── Map-enhanced location step ────────────────────────────────────────────────
function StepLocationMap({ zip, state, address, lat, lng, onZipChange, onStateChange, onAddressChange, onLatLngChange, serviceStates }) {
  const [mapsReady, setMapsReady] = useState(!!window.google?.maps?.places);
  const [loadError, setLoadError] = useState(false);
  const mapRef      = useRef(null);
  const mapObj      = useRef(null);
  const marker      = useRef(null);
  const autocomplete = useRef(null);
  const inputRef    = useRef(null);
  const hasAddress  = !!(lat && lng);

  // 1. Load Google Maps SDK
  useEffect(() => {
    if (mapsReady) return;
    loadGoogleMaps(API_KEY)
      .then(() => setMapsReady(true))
      .catch(() => setLoadError(true));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 2. Init map once SDK is ready and div is mounted
  useEffect(() => {
    if (!mapsReady || !mapRef.current || mapObj.current) return;

    const center = hasAddress ? { lat, lng } : { lat: 39.5, lng: -98.35 };

    mapObj.current = new window.google.maps.Map(mapRef.current, {
      zoom: hasAddress ? 19 : 4,
      center,
      mapTypeId: 'satellite',
      tilt: 0,
      zoomControl: true,
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
      gestureHandling: 'cooperative',
    });

    marker.current = new window.google.maps.Marker({
      position: center,
      map: hasAddress ? mapObj.current : null,
      draggable: true,
      title: 'Drag to your exact roof',
    });

    marker.current.addListener('dragend', e => {
      onLatLngChange(e.latLng.lat(), e.latLng.lng());
    });
  }, [mapsReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // 3. Init Places autocomplete once SDK + input are ready
  useEffect(() => {
    if (!mapsReady || !inputRef.current || autocomplete.current) return;

    const ac = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: 'us' },
      fields: ['address_components', 'geometry', 'formatted_address'],
      types: ['address'],
    });
    autocomplete.current = ac;

    ac.addListener('place_changed', () => {
      const place = ac.getPlace();
      if (!place.geometry?.location) return;

      const newLat = place.geometry.location.lat();
      const newLng = place.geometry.location.lng();

      // Extract ZIP + state from address components
      let newZip = '', newState = '';
      for (const comp of (place.address_components || [])) {
        if (comp.types.includes('postal_code'))               newZip   = comp.short_name;
        if (comp.types.includes('administrative_area_level_1')) newState = comp.short_name;
      }

      onAddressChange(place.formatted_address || '');
      onLatLngChange(newLat, newLng);
      if (newZip)   onZipChange(newZip);
      if (newState) onStateChange(newState);

      // Fly to roof
      if (mapObj.current) {
        mapObj.current.setCenter({ lat: newLat, lng: newLng });
        mapObj.current.setZoom(19);
      }
      if (marker.current) {
        marker.current.setPosition({ lat: newLat, lng: newLng });
        marker.current.setMap(mapObj.current);
      }
    });
  }, [mapsReady]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loadError) {
    return <StepLocationFallback zip={zip} state={state} onZipChange={onZipChange} onStateChange={onStateChange} serviceStates={serviceStates} />;
  }

  const isOutOfArea = serviceStates?.length > 0 && state && !serviceStates.includes(state);

  return (
    <div>
      <h2 className="step-title">Where is your home located?</h2>
      <p className="step-desc">Enter your address — we'll show your roof on the map for a more accurate estimate.</p>

      {/* Address autocomplete */}
      <div style={{ marginBottom: 14 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: '#374151', marginBottom: 6 }}>
          Home Address
        </label>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#9ca3af' }}>
            <MapPinIcon size={16} />
          </span>
          <input
            ref={inputRef}
            type="text"
            placeholder="Start typing your address..."
            defaultValue={address}
            className="field-input"
            style={{ paddingLeft: 36 }}
          />
        </div>
      </div>

      {/* Satellite map */}
      <div style={{ position: 'relative', borderRadius: 14, overflow: 'hidden', border: '1.5px solid #e2e8f0' }}>
        {/* Map div — always rendered so Google can init into it */}
        <div ref={mapRef} style={{ width: '100%', height: 264 }} />

        {/* Loading overlay */}
        {!mapsReady && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' }}>
            <div style={{ textAlign: 'center', color: '#64748b', fontSize: 13 }}>
              <div style={{ marginBottom: 8, opacity: 0.5 }}><MapPinIcon size={28} /></div>
              Loading map…
            </div>
          </div>
        )}

        {/* "Enter address" prompt overlay — shown when map is ready but no address yet */}
        {mapsReady && !hasAddress && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <div style={{ background: 'rgba(15,23,42,0.72)', backdropFilter: 'blur(4px)', color: '#ffffff', borderRadius: 12, padding: '12px 18px', fontSize: 13, textAlign: 'center', maxWidth: 240, lineHeight: 1.5 }}>
              <div style={{ marginBottom: 4, fontSize: 20 }}>🛰️</div>
              Enter your address above to see your roof
            </div>
          </div>
        )}

        {/* Pin instruction — shown after address is selected */}
        {mapsReady && hasAddress && (
          <div style={{ position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', whiteSpace: 'nowrap', background: 'rgba(15,23,42,0.75)', backdropFilter: 'blur(4px)', color: '#ffffff', borderRadius: 999, padding: '6px 14px', fontSize: 12, fontWeight: 500 }}>
            📍 Drag the pin to your exact roof
          </div>
        )}
      </div>

      {/* Auto-filled location summary */}
      {(state || zip) && (
        <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {state && <span style={{ fontSize: 12, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 999, padding: '3px 10px', fontWeight: 600 }}>✓ State: {state}</span>}
          {zip   && <span style={{ fontSize: 12, background: '#f0fdf4', color: '#166534', border: '1px solid #bbf7d0', borderRadius: 999, padding: '3px 10px', fontWeight: 600 }}>✓ ZIP: {zip}</span>}
        </div>
      )}

      {/* Out-of-area warning */}
      {isOutOfArea && (
        <div style={{ marginTop: 12, textAlign: 'center', padding: 20, background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 12, color: '#92400e' }}>
          <div style={{ marginBottom: 8 }}><MapPinIcon size={28} /></div>
          <h4 style={{ margin: '0 0 8px', fontWeight: 700 }}>We don't currently serve {state}</h4>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>This installer operates in a specific service area. Try a different address or contact them directly.</p>
        </div>
      )}

      <style>{`
        .field-input {
          padding: 12px 14px;
          border: 1.5px solid #e2e8f0;
          border-radius: 10px;
          font-size: 15px;
          color: #1e293b;
          background: white;
          transition: border-color 0.12s;
          outline: none;
          width: 100%;
          font-family: inherit;
        }
        .field-input:focus { border-color: #1e40af; }
      `}</style>
    </div>
  );
}

// ── Fallback: original ZIP + state UI ────────────────────────────────────────
function StepLocationFallback({ zip, state, onZipChange, onStateChange, serviceStates }) {
  const isOutOfArea = serviceStates?.length > 0 && state && !serviceStates.includes(state);

  return (
    <div>
      <h2 className="step-title">Where is your home located?</h2>
      <p className="step-desc">Your location determines sunlight availability, electricity rates, and solar incentives.</p>

      <div className="location-fields">
        <div className="field-group">
          <label className="field-label">ZIP Code <span className="optional">(optional — improves accuracy)</span></label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={5}
            placeholder="e.g. 78701"
            value={zip}
            onChange={e => onZipChange(e.target.value.replace(/\D/g, '').slice(0, 5))}
            className="field-input"
          />
        </div>

        <div className="field-divider">or</div>

        <div className="field-group">
          <label className="field-label">State</label>
          <select value={state} onChange={e => onStateChange(e.target.value)} className="field-input">
            <option value="">Select your state...</option>
            {US_STATES.map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </select>
        </div>
      </div>

      {isOutOfArea ? (
        <div className="disqualify-box" style={{ textAlign: 'center', padding: 20, background: '#fef3c7', border: '1px solid #fbbf24', borderRadius: 12, color: '#92400e' }}>
          <div style={{ marginBottom: 8 }}><MapPinIcon size={28} /></div>
          <h4 style={{ margin: '0 0 8px', fontWeight: 700 }}>We don't currently serve {state}</h4>
          <p style={{ margin: 0, fontSize: 13, lineHeight: 1.6 }}>This installer operates in a specific service area. Try selecting a different state or contact them directly.</p>
        </div>
      ) : (
        <div className="location-note">
          <span className="note-icon"><SunIcon size={16} /></span>
          <span>States like California, Arizona, and Texas get more sun hours — meaning higher solar production and bigger savings.</span>
        </div>
      )}

      <style>{`
        .location-fields { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
        .field-group { display: flex; flex-direction: column; gap: 6px; }
        .field-label { font-size: 13px; font-weight: 600; color: #374151; }
        .optional { font-weight: 400; color: #9ca3af; font-size: 12px; }
        .field-input { padding: 12px 14px; border: 1.5px solid #e2e8f0; border-radius: 10px; font-size: 15px; color: #1e293b; background: white; transition: border-color 0.12s; outline: none; width: 100%; font-family: inherit; }
        .field-input:focus { border-color: #1e40af; }
        .field-divider { text-align: center; color: #94a3b8; font-size: 13px; font-weight: 500; }
        .location-note { display: flex; gap: 10px; align-items: flex-start; padding: 12px 14px; background: #fef3c7; border-radius: 10px; font-size: 13px; color: #78350f; }
        .note-icon { flex-shrink: 0; }
      `}</style>
    </div>
  );
}

// ── Public export — routes to map or fallback ─────────────────────────────────
export default function StepLocation(props) {
  if (API_KEY) return <StepLocationMap {...props} />;
  return <StepLocationFallback {...props} />;
}
