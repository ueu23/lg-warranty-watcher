import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface WarrantyItem {
  id: string;
  customer_id: string;
  product_name: string;
  expiry_date: string;
  customers: {
    name: string;
    phone_number: string;
  };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const twilioAccountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
    const twilioAuthToken = Deno.env.get('TWILIO_AUTH_TOKEN');
    const twilioPhoneNumber = Deno.env.get('TWILIO_PHONE_NUMBER');

    if (!twilioAccountSid || !twilioAuthToken || !twilioPhoneNumber) {
      throw new Error('Missing Twilio credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting warranty reminder check...');

    // Calculate dates for 15, 10, and 1 day before expiry
    const today = new Date();
    const reminderDays = [15, 10, 1];
    
    for (const days of reminderDays) {
      const targetDate = new Date(today);
      targetDate.setDate(targetDate.getDate() + days);
      const targetDateStr = targetDate.toISOString().split('T')[0];

      console.log(`Checking for warranties expiring in ${days} days (${targetDateStr})...`);

      // Get warranty items expiring on target date
      const { data: warrantyItems, error: fetchError } = await supabase
        .from('warranty_items')
        .select(`
          id,
          customer_id,
          product_name,
          expiry_date,
          customers (
            name,
            phone_number
          )
        `)
        .eq('expiry_date', targetDateStr);

      if (fetchError) {
        console.error(`Error fetching warranty items for ${days} days:`, fetchError);
        continue;
      }

      if (!warrantyItems || warrantyItems.length === 0) {
        console.log(`No warranties expiring in ${days} days`);
        continue;
      }

      console.log(`Found ${warrantyItems.length} warranties expiring in ${days} days`);

      // Send SMS for each warranty item
      for (const item of warrantyItems as unknown as WarrantyItem[]) {
        try {
          // Check if reminder already sent
          const { data: existingLog } = await supabase
            .from('reminder_logs')
            .select('id')
            .eq('warranty_item_id', item.id)
            .eq('days_before_expiry', days)
            .single();

          if (existingLog) {
            console.log(`Reminder already sent for warranty item ${item.id}`);
            continue;
          }

          const message = `Hi ${item.customers.name}, your LG ${item.product_name} warranty expires in ${days} day${days > 1 ? 's' : ''} on ${item.expiry_date}. Please contact us if you need assistance.`;

          // Send SMS via Twilio
          const twilioUrl = `https://api.twilio.com/2010-04-01/Accounts/${twilioAccountSid}/Messages.json`;
          const twilioResponse = await fetch(twilioUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Basic ${btoa(`${twilioAccountSid}:${twilioAuthToken}`)}`,
              'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
              To: item.customers.phone_number,
              From: twilioPhoneNumber,
              Body: message,
            }),
          });

          const twilioData = await twilioResponse.json();

          if (twilioResponse.ok) {
            console.log(`SMS sent successfully for warranty item ${item.id}`);
            
            // Log successful reminder
            await supabase.from('reminder_logs').insert({
              warranty_item_id: item.id,
              customer_id: item.customer_id,
              days_before_expiry: days,
              status: 'sent',
              message: message,
            });
          } else {
            console.error(`Failed to send SMS for warranty item ${item.id}:`, twilioData);
            
            // Log failed reminder
            await supabase.from('reminder_logs').insert({
              warranty_item_id: item.id,
              customer_id: item.customer_id,
              days_before_expiry: days,
              status: 'failed',
              message: twilioData.message || 'Failed to send SMS',
            });
          }
        } catch (itemError) {
          console.error(`Error processing warranty item ${item.id}:`, itemError);
          
          // Log error
          await supabase.from('reminder_logs').insert({
            warranty_item_id: item.id,
            customer_id: item.customer_id,
            days_before_expiry: days,
            status: 'error',
            message: itemError.message,
          });
        }
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Warranty reminders processed' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in send-warranty-reminders function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});