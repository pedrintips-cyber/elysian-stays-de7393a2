ALTER TABLE public.bookings
ADD COLUMN IF NOT EXISTS check_in_date date;

CREATE INDEX IF NOT EXISTS idx_bookings_property_id ON public.bookings(property_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in_date ON public.bookings(check_in_date);