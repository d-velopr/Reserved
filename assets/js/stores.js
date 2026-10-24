/*
 * Reserved store list. Edit this file to add, remove or change a store.
 * Addresses come from the California Department of Cannabis Control license
 * records (real.cannabis.ca.gov), checked Oct 2026; Status (Adelanto) from its
 * Leafly listing and a City of Adelanto permit notice.
 * lat/lng place the pin; directions always use the address, so a pin that is
 * slightly off still sends people to the right door.
 * nudge: [x, y] px shift for the logo when zoomed out, so close neighbors don't
 *   cover each other. The red pin always stays on the real spot.
 * tag: the city label color, matched to the Reserved Instagram store-locator post.
 */
window.RESERVED_STORES = [
  { name: "Status",           city: "Adelanto",      tag: "#1E4F94", address: "11619 Rancho Rd, Adelanto, CA 92301",        lat: 34.55921, lng: -117.41124 },
  { name: "Green Label Rx",   city: "Echo Park",     tag: "#2E7D32", address: "1858 Echo Park Ave, Los Angeles, CA 90026",  lat: 34.08542, lng: -118.25266, nudge: [-14, 0] },
  { name: "The Cake House",   city: "El Monte",      tag: "#1E5AA8", address: "4728 Peck Rd, El Monte, CA 91732",           lat: 34.08966, lng: -118.01505 },
  { name: "Jungle Boys",      city: "Pomona",        tag: "#8C8A1E", address: "196 University Pkwy, Pomona, CA 91768",      lat: 34.04971, lng: -117.81050, nudge: [14, 0] },
  { name: "Plant Galaxy",     city: "Riverside",     tag: "#2E7D32", address: "1270 Center St, Riverside, CA 92507",        lat: 34.01936, lng: -117.35596, nudge: [-30, -8] },
  { name: "The Healing Tree", city: "Lake Elsinore", tag: "#8C8A1E", address: "480 3rd St, Lake Elsinore, CA 92530",        lat: 33.68559, lng: -117.33879, nudge: [-40, 0] },
  { name: "Westside Cllctv",  city: "Perris",        tag: "#C62828", address: "872 W Washington St, Perris, CA 92571",      lat: 33.85377, lng: -117.24485, nudge: [10, 0] },
  { name: "Blazed Utopia",    city: "San Jacinto",   tag: "#2E7D32", address: "620 S State St, San Jacinto, CA 92583",      lat: 33.78106, lng: -116.97196, nudge: [50, -30] },
  { name: "Budology",         city: "Hemet",         tag: "#2E7D32", address: "172 San Jacinto Ave, Hemet, CA 92543",       lat: 33.74894, lng: -116.95858, nudge: [-5, 18] },
  { name: "Leaf Society",     city: "El Centro",     tag: "#2E7D32", address: "599 La Brucherie Rd N, El Centro, CA 92243", lat: 32.79750, lng: -115.57860 }
];
