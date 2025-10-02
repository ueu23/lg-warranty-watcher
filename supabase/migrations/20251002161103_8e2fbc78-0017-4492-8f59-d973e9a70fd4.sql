-- Set up daily cron job to send warranty reminders at 9 AM
SELECT cron.schedule(
  'send-warranty-reminders-daily',
  '0 9 * * *', -- Run at 9:00 AM every day
  $$
  SELECT
    net.http_post(
      url:='https://fbvjololemgoejwblalp.supabase.co/functions/v1/send-warranty-reminders',
      headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZidmpvbG9sZW1nb2Vqd2JsYWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkzMTc5NTcsImV4cCI6MjA3NDg5Mzk1N30.puej77oVDOqFQHx4TvM1zqdI9pIanHPD_-QzBb-7-Z4"}'::jsonb,
      body:='{}'::jsonb
    ) as request_id;
  $$
);