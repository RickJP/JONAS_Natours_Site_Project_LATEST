const locations = JSON.parse(document.getElementById('map').dataset.locations);
console.log(locations);

mapboxgl.accessToken =
  'pk.eyJ1IjoiYXBhY2hlanAiLCJhIjoiY2p6eGV0M245MDF3djNlbWpjc2xwNzdhcSJ9.B60_dInv3urnU-hEJLvdKQ';

let map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/apachejp/cjzxex0ky1czj1cqvq5aahx7b',
  scrollZoom: false
  // center: [-118.359804,34.121042],
  // zoom: 10,
  // interactive: false
});

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
  // Create marker
  const el = document.createElement('div');
  el.className = 'marker';

  // Add marker
  new mapboxgl.Marker({
    element: el,
    anchor: 'bottom'
  })
    .setLngLat(loc.coordinates)
    .addTo(map);
  // Add group
  new mapboxgl.Popup({
    offset: 30,
    //closeButton: false,
    closeOnClick: false
  })
    .setLngLat(loc.coordinates)
    .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
    .addTo(map);

  // Extend map bounds to include current location
  bounds.extend(loc.coordinates);

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100
    }
  });
});
