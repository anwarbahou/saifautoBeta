"use client";

import { useEffect, useState } from 'react';
import { Calendar, dateFnsLocalizer, EventProps } from 'react-big-calendar';
import { format } from 'date-fns/format';
import { parse } from 'date-fns/parse';
import { startOfWeek } from 'date-fns/startOfWeek';
import { getDay } from 'date-fns/getDay';
import { enUS } from 'date-fns/locale/en-US';
import { getBookings } from '@/lib/actions'; // Assuming this action fetches all bookings
import 'react-big-calendar/lib/css/react-big-calendar.css';
import '@/styles/calendar.css'; // Import custom calendar styles
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AlertTriangle, Loader2 } from 'lucide-react';
import { BookingDetailsModal } from '@/components/booking-details-modal'; // Import the modal

// For date calculations
import { startOfMonth, endOfMonth, startOfWeek as dfnsStartOfWeek, endOfWeek as dfnsEndOfWeek, startOfDay, endOfDay } from 'date-fns';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface Booking {
  id: string | number;
  start_date: string; // ISO string or a format parse() can handle
  end_date: string;   // ISO string or a format parse() can handle
  status?: string;
  clients?: { id: number; first_name?: string; last_name?: string; name?: string; } | null;
  cars?: { id: number; make?: string; model?: string; license_plate?: string; } | null;
  // Add any other fields that might be useful for the event title or details
  total_price?: string | number;
}

export interface CalendarEvent {
  id: string | number;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  resource?: any; // Original booking data
  status?: string;
}

const CalendarPage = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date()); // State for current calendar date
  const [currentView, setCurrentView] = useState<any>('month'); // State for current calendar view
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function fetchAndSetEvents(date: Date, view: string) {
      setLoading(true);
      setError(null);

      // Calculate date range based on current view and date
      let rangeStartDate: Date;
      let rangeEndDate: Date;

      if (view === 'month') {
        rangeStartDate = startOfMonth(date);
        rangeEndDate = endOfMonth(date);
      } else if (view === 'week') {
        rangeStartDate = dfnsStartOfWeek(date, { locale: enUS });
        rangeEndDate = dfnsEndOfWeek(date, { locale: enUS });
      } else { // day or agenda (agenda might need different handling or show all for simplicity)
        rangeStartDate = startOfDay(date);
        rangeEndDate = endOfDay(date);
      }

      try {
        // Pass ISO strings to the backend action
        const bookingsData: Booking[] = await getBookings(rangeStartDate.toISOString(), rangeEndDate.toISOString());

        if (Array.isArray(bookingsData)) {
          const calendarEvents: CalendarEvent[] = bookingsData.map((booking) => {
            let eventTitle = 'Booking';
            if (booking.clients) {
              const clientName = booking.clients.name || `${booking.clients.first_name || ''} ${booking.clients.last_name || ''}`.trim();
              eventTitle = clientName ? `Booking: ${clientName}` : 'Booking';
            }
            if (booking.cars) {
              const carName = `${booking.cars.make || ''} ${booking.cars.model || ''}`.trim();
              if (carName) eventTitle += ` - ${carName}`;
            }
            
            return {
              id: booking.id,
              title: eventTitle,
              start: new Date(booking.start_date),
              end: new Date(booking.end_date),
              allDay: false, // Assuming bookings are not all-day events, adjust if needed
              resource: booking, // Store original booking for more details on select
              status: booking.status
            };
          }).filter(event => !isNaN(event.start.valueOf()) && !isNaN(event.end.valueOf())); // Filter out invalid dates
          
          setEvents(calendarEvents);
        } else {
          console.error("getBookings did not return an array:", bookingsData);
          setError("Failed to load bookings: Invalid data format.");
          setEvents([]);
        }
      } catch (e: any) {
        console.error("Error fetching bookings for calendar:", e);
        setError(e.message || "An unexpected error occurred while fetching bookings.");
        setEvents([]);
      } finally {
        setLoading(false);
      }
    }

    fetchAndSetEvents(currentDate, currentView);
  }, [currentDate, currentView]); // Re-fetch when currentDate or currentView changes

  // Custom Event component to add styling based on status
  const CustomEvent: React.FC<EventProps<CalendarEvent>> = ({ event }) => {
    let backgroundColor = 'bg-primary'; // Default color
    if (event.status === 'Confirmed' || event.status === 'Active') {
      backgroundColor = 'bg-primary';
    } else if (event.status === 'Pending') {
      backgroundColor = 'bg-yellow-600';
    } else if (event.status === 'Cancelled') {
      backgroundColor = 'bg-destructive';
    } else if (event.status === 'Completed') {
      backgroundColor = 'bg-muted';
    }

    return (
      <div className={`p-1 text-white rounded-sm text-xs ${backgroundColor}`}>
        {event.title}
      </div>
    );
  };

  const handleNavigate = (newDate: Date, view: string, action: string) => {
    setCurrentDate(newDate);
    // The view might also change here if the user selects a day from month view, etc.
    // react-big-calendar typically passes the new view if it changes.
    // setCurrentView(view); // Already handled by onCurrentViewChange if needed explicitly
  };

  const handleViewChange = (newView: string) => {
    setCurrentView(newView);
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  return (
    <main className="flex-1 p-6 md:p-8 min-h-screen">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Bookings Calendar</CardTitle>
          <CardDescription>View and manage all scheduled bookings.</CardDescription>
        </CardHeader>
        <CardContent style={{ height: '70vh' }}> {/* Set a height for the calendar container */}
          {loading && (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          )}
          {error && !loading && (
            <div className="flex flex-col items-center justify-center h-full text-destructive">
              <AlertTriangle className="h-12 w-12 mb-3" />
              <p className="text-lg font-semibold">Error loading calendar</p>
              <p className="text-sm">{error}</p>
            </div>
          )}
          {!loading && !error && (
            <Calendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ flexGrow: 1 }}
              views={['month', 'week', 'day', 'agenda']}
              date={currentDate} // Control the displayed date
              onNavigate={handleNavigate} // Handle date navigation
              view={currentView}
              onView={handleViewChange} // Handle view changes
              onSelectEvent={handleSelectEvent} // Handle event selection
              components={{
                event: CustomEvent, // Use custom event component
              }}
              // onSelectEvent={event => alert(event.title + "\nDetails: " + JSON.stringify(event.resource, null, 2))}
              // You can add more event handlers like onSelectSlot, onNavigate, etc.
            />
          )}
        </CardContent>
      </Card>
      <BookingDetailsModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </main>
  );
};

export default CalendarPage; 