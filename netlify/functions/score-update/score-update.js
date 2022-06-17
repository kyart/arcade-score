

// Grab our credentials from a .env file or environment variables
require('dotenv').config();
const {
    DATABASE_URL,
    SUPABASE_SERVICE_API_KEY
} = process.env;

// Connect to our database
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(DATABASE_URL, SUPABASE_SERVICE_API_KEY);

// Our standard serverless handler function
exports.handler = async event => {

    // Insert a row
    const { data, error } = await supabase
        .from('notes')
        .upsert([
            { student_name: 'Steve',
                group_id: '1',
                score: 250
            },
            {
                onConflict: 'student_name'
            }
        ]);

    // Did it work?
    console.log(data, error);

}
