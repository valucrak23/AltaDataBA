import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

// Verificamos que las variables de entorno estén definidas
if (!process.env.SUPABASE_URL) {
    console.error('Error: SUPABASE_URL no está definida en el archivo .env');
    process.exit(1);
}

if (!process.env.SUPABASE_ANON_KEY) {
    console.error('Error: SUPABASE_ANON_KEY no está definida en el archivo .env');
    process.exit(1);
}

// Crear cliente de Supabase
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
