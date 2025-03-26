// Custom hook to manage trips
export default function useTrips(initialTrips) {
  // Sort trips by date
  const sortedTrips = [...initialTrips].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  // Separate trips into upcoming and past
  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.date) > new Date()
  );

  const pastTrips = sortedTrips
    .filter((trip) => new Date(trip.date) < new Date())
    .reverse();

  return { upcomingTrips, pastTrips };
}

// export default useTrips;
