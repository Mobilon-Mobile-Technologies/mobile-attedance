import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import 'react-native-url-polyfill/auto';

const supabaseUrl = "https://bnvjujarkspbwnpwtyrl.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJudmp1amFya3NwYnducHd0eXJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgwMTc2NjQsImV4cCI6MjAyMzU5MzY2NH0.1n1PoNlgSK2R1l1BHSxx0ou053z8_on1lIW331_kR8A";
const supabase = createClient(supabaseUrl, supabaseKey, {
  localStorage: AsyncStorage
});

export default supabase;