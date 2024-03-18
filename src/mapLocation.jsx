// import { useEffect, useState } from "react";

// const GoogleMapComponent = () => {
//   const [map, setMap] = useState(null);
//   const [directionsService, setDirectionsService] = useState(null);
//   const [directionsRenderer, setDirectionsRenderer] = useState(null);
//   const [carMarker, setCarMarker] = useState(null);
//   const [userMarker, setUserMarker] = useState(null);

//   useEffect(() => {
//     const initMap = () => {
//       const mapInstance = new window.google.maps.Map(
//         document.getElementById("map"),
//         {
//           center: { lat: 37.7749, lng: -122.4194 },
//           zoom: 12,
//         }
//       );
//       setMap(mapInstance);
//       setDirectionsService(new window.google.maps.DirectionsService());
//       const renderer = new window.google.maps.DirectionsRenderer();
//       renderer.setMap(mapInstance);
//       setDirectionsRenderer(renderer);

//       // const originAutocomplete = new window.google.maps.places.Autocomplete(
//       //   document.getElementById("origin")
//       // );
//       // const destinationAutocomplete =
//       //   new window.google.maps.places.Autocomplete(
//       //     document.getElementById("destination")
//       //   );
//     };

//     if (!window.google) {
//       // Google Maps API script is not loaded yet
//       const script = document.createElement("script");
//       script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDMvHTvx8oVrT5NDIXLck6aqLacu3tIHU8&callback=initMap`;
//       script.async = true;
//       script.defer = true;
//       document.head.appendChild(script);
//       script.onload = initMap;
//     } else {
//       // Google Maps API is already loaded
//       initMap();
//     }
//   }, []);

//   const getUserLocation = () => {
//     if (navigator.geolocation) {
//       navigator.geolocation.watchPosition(
//         (position) => {
//           const userLocation = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude,
//           };
//           console.log(userLocation);
//           // local starage 
//           localStorage.setItem("userLocation", JSON.stringify(userLocation));

//           if (!userMarker) {
//             if (userMarker) {
//               userMarker.setMap(null); // Remove the marker from the map
//             }
//             setUserMarker(
//               new window.google.maps.Marker({
//                 position: userLocation,
//                 map: map,
//                 icon: {
//                   url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
//                 },
//               })
//             );
//           } else {
//             userMarker.setPosition(userLocation);
//           }
//           map.setCenter(userLocation);
//           map.setZoom(15);
//         },
//         (error) => {
//           console.error("Error getting location:", error);
//         }
//       );
//     } else {
//       console.error("Geolocation is not supported.");
//     }
//   };

//   const calculateAndDisplayRoute = () => {
//     const origin = document.getElementById("origin").value;
//     const destination = document.getElementById("destination").value;

//     directionsService.route(
//       {
//         origin: origin,
//         destination: destination,
//         travelMode: window.google.maps.TravelMode.DRIVING,
//       },
//       (response, status) => {
//         if (status === "OK") {
//           directionsRenderer.setDirections(response);
//           computeTotalDistance(response);
//           computeTotalDuration(response);
//           trackCar(response);
//         } else {
//           window.alert("Directions request failed due to " + status);
//         }
//       }
//     );
//   };

//   const computeTotalDistance = (result) => {
//     let totalDistance = 0;
//     const myRoute = result.routes[0];
//     for (let i = 0; i < myRoute.legs.length; i++) {
//       totalDistance += myRoute.legs[i].distance.value;
//     }
//     const totalDistanceInKm = totalDistance / 1000;
//     document.getElementById("distance").innerHTML =
//       "Total distance: " + totalDistanceInKm + " km";
//   };

//   const computeTotalDuration = (result) => {
//     let totalDuration = 0;
//     const myRoute = result.routes[0];
//     for (let i = 0; i < myRoute.legs.length; i++) {
//       totalDuration += myRoute.legs[i].duration.value;
//     }
//     const hours = Math.floor(totalDuration / 3600);
//     const minutes = Math.floor((totalDuration % 3600) / 60);
//     document.getElementById("duration").innerHTML =
//       "Estimated time: " + hours + " hours " + minutes + " minutes";
//   };

//   const trackCar = (result) => {
//     const myRoute = result.routes[0];
//     let stepIndex = 0;

//     setInterval(() => {
//       if (stepIndex >= myRoute.legs[0].steps.length) return;
//       const step = myRoute.legs[0].steps[stepIndex];
//       const nextPosition = step.end_location;
//       moveCar(nextPosition);
//       localStorage.setItem("carLocation", JSON.stringify(nextPosition));
//       stepIndex++;
//     }, 2000);
//   };

//   const moveCar = (position) => {
//     // Remove previous car marker if it exists
//     if (carMarker) {
//       carMarker.setMap(null); // Remove the marker from the map
//     }

//     if (!carMarker) {
//       setCarMarker(
//         new window.google.maps.Marker({
//           position: position,
//           map: map,
//           icon: {
//             url: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
//           },
//         })
//       );
//     } else {
//       carMarker.setPosition(position);
//     }
//   };

//   return (
//     <div>
//       <h1>
//         Google Maps Directions, Distance, Time, and Car Tracking with User
//         Location
//       </h1>
//       <button onClick={getUserLocation}>Get My Location</button>
//       <input type="text" id="origin" placeholder="Origin" />
//       <input type="text" id="destination" placeholder="Destination" />
//       <button onClick={calculateAndDisplayRoute}>Get Directions</button>
//       <div id="map" style={{ height: "400px", width: "100%" }}></div>
//       <div id="distance"></div>
//       <div id="duration"></div>
//     </div>
//   );
// };

// export default GoogleMapComponent;





















import { useEffect, useState } from 'react';

const GoogleMapComponent = () => {
  const [map, setMap] = useState(null);
  const [directionsService, setDirectionsService] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [userMarker, setUserMarker] = useState(null);
  const [path, setPath] = useState([]);
  const [polyline, setPolyline] = useState(null);


  useEffect(() => {
    const initMap = () => {
      const mapInstance = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: 37.7749, lng: -122.4194 },
        zoom: 12,
      });
      setMap(mapInstance);
      setDirectionsService(new window.google.maps.DirectionsService());
      const renderer = new window.google.maps.DirectionsRenderer();
      renderer.setMap(mapInstance);
      setDirectionsRenderer(renderer);

      const originAutocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("origin")
      );
      const destinationAutocomplete = new window.google.maps.places.Autocomplete(
        document.getElementById("destination")
      );
    };

    if (!window.google) {
      // Google Maps API script is not loaded yet
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyDMvHTvx8oVrT5NDIXLck6aqLacu3tIHU8&callback=initMap`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = initMap;
    } else {
      // Google Maps API is already loaded
      initMap();
    }
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      setInterval(() => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            let userLocations = JSON.parse(localStorage.getItem("userLocations")) || [];
            userLocations.push(userLocation);
            localStorage.setItem("userLocations", JSON.stringify(userLocations));

            if (!userMarker) {
              if (userMarker) {
                              userMarker.setMap(null); // Remove the marker from the map
                            }
              setUserMarker(new window.google.maps.Marker({
                position: userLocation,
                map: map,
                icon: {
                  url: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
                },
              }));
            } else {
              userMarker.setPosition(userLocation);
            }

            map.setCenter(userLocation);
            map.setZoom(15);

            setPath((prevPath) => [...prevPath, userLocation]);
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }, 5000); // Update every 5 seconds
    } else {
      console.error("Geolocation is not supported.");
    }
  };


  useEffect(() => {
    if (path.length > 1) {
      if (polyline) {
        polyline.setMap(null); // Remove existing polyline
      }
      const newPath = new window.google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: "#FF0000",
        strokeOpacity: 1.0,
        strokeWeight: 2,
      });
      newPath.setMap(map);
      setPolyline(newPath);
    }
  }, [path, map, polyline]);

  const calculateAndDisplayRoute = () => {
    const origin = document.getElementById("origin").value;
    const destination = document.getElementById("destination").value;

    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          directionsRenderer.setDirections(response);
          computeTotalDistance(response);
          computeTotalDuration(response);
        } else {
          window.alert("Directions request failed due to " + status);
        }
      }
    );
  };

  const computeTotalDistance = (result) => {
    let totalDistance = 0;
    const myRoute = result.routes[0];
    for (let i = 0; i < myRoute.legs.length; i++) {
      totalDistance += myRoute.legs[i].distance.value;
    }
    const totalDistanceInKm = totalDistance / 1000;
    document.getElementById("distance").innerHTML =
      "Total distance: " + totalDistanceInKm + " km";
  };

  const computeTotalDuration = (result) => {
    let totalDuration = 0;
    const myRoute = result.routes[0];
    for (let i = 0; i < myRoute.legs.length; i++) {
      totalDuration += myRoute.legs[i].duration.value;
    }
    const hours = Math.floor(totalDuration / 3600);
    const minutes = Math.floor((totalDuration % 3600) / 60);
    document.getElementById("duration").innerHTML =
      "Estimated time: " + hours + " hours " + minutes + " minutes";
  };

  return (
    <div>
      <h1>Google Maps Directions, Distance, Time, and User Location</h1>
      <button onClick={getUserLocation}>Get My Location</button>
      <input type="text" id="origin" placeholder="Origin" />
      <input type="text" id="destination" placeholder="Destination" />
      <button onClick={calculateAndDisplayRoute}>Get Directions</button>
      <div id="map" style={{ height: "400px", width: "100%" }}></div>
      <div id="distance"></div>
      <div id="duration"></div>

    </div>
  );
};

export default GoogleMapComponent;
