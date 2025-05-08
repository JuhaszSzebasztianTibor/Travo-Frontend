// Custom hook to manage trips
export default function useTrips(initialTrips) {
  // Sort trips by date
  const sortedTrips = [...initialTrips].sort(
    (a, b) => new Date(a.startDate) - new Date(b.startDate)
  );

  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) > new Date()
  );

  const pastTrips = sortedTrips
    .filter((trip) => new Date(trip.startDate) < new Date())
    .reverse();

  return { upcomingTrips, pastTrips };
}
