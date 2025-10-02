-- Create customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create warranty_items table
CREATE TABLE public.warranty_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  product_name TEXT NOT NULL,
  serial_number TEXT,
  purchase_date DATE NOT NULL,
  warranty_period_months INTEGER NOT NULL,
  expiry_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Create reminder_logs table
CREATE TABLE public.reminder_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  warranty_item_id UUID REFERENCES public.warranty_items(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES public.customers(id) ON DELETE CASCADE NOT NULL,
  days_before_expiry INTEGER NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  status TEXT NOT NULL,
  message TEXT
);

-- Enable RLS
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.warranty_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminder_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for customers
CREATE POLICY "Users can view their own customers"
  ON public.customers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own customers"
  ON public.customers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own customers"
  ON public.customers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own customers"
  ON public.customers FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for warranty_items
CREATE POLICY "Users can view their own warranty items"
  ON public.warranty_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own warranty items"
  ON public.warranty_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own warranty items"
  ON public.warranty_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own warranty items"
  ON public.warranty_items FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for reminder_logs
CREATE POLICY "Users can view reminder logs for their warranty items"
  ON public.reminder_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.warranty_items
      WHERE warranty_items.id = reminder_logs.warranty_item_id
      AND warranty_items.user_id = auth.uid()
    )
  );

-- Triggers for updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER set_warranty_items_updated_at
  BEFORE UPDATE ON public.warranty_items
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

-- Enable pg_net extension for HTTP requests
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;